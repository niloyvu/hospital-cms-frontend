import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form-modal',
  templateUrl: './invoice-form-modal.component.html',
  styleUrls: ['./invoice-form-modal.component.scss']
})
export class InvoiceFormModalComponent implements OnInit {

  invoiceItems: any[] = [];
  appointmentUsers: any[] = [];
  invoiceForm!: FormGroup;
  isDisabled: boolean = false;
  currentDate: Date = new Date();
  dialogRef = inject(MatDialogRef);

  selectedUser: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getAppointmentUsers();
    this.getActiveInvoiceItems();

    if (this.data) {
      this.invoiceForm.patchValue(this.data);
      this.populateInvoiceItems();
      this.invoiceForm.get('sub_total')?.setValue(this.data.sub_total);
      this.invoiceForm.get('due_amount')?.setValue(this.data.due_amount);
      this.invoiceForm.get('total_amount')?.setValue(this.data.total_amount);
    } else {
      this.getNextInvoiceId();
    }
  }

  initializeForm() {
    this.invoiceForm = this.formBuilder.group({
      id: null,
      appointment_id: ['', Validators.required],
      invoice_id: [null, Validators.required],
      date: [new Date(), Validators.required],
      due_date: [new Date(), Validators.required],
      selected_items: [[], Validators.required],
      invoice_items: this.formBuilder.array([this.invoiceItem()]),
      sub_total: [null, Validators.required],
      discount: [null, [Validators.min(5), Validators.max(50), Validators.pattern(/^\d+$/)]],
      total_amount: [null, Validators.required],
      paid_amount: [null, [Validators.required]],
      due_amount: [null],
      status: [true, Validators.required],
      remarks: [null, Validators.required],
    });

    if(!this.data) {
      this.onChangeSelectedItems();
      this.onChangeDiscount();
      this.onChangePaidAmount();
      this.onChangeAppointmentUser();
    }
  }

  onChangeAppointmentUser() {
    this.invoiceForm.get('appointment_id')?.valueChanges.subscribe((appointment_user_id) => {
      this.selectedUser = this.appointmentUsers?.find(user => user.id === appointment_user_id);
    });
  }

  onChangeDiscount() {
    this.invoiceForm.get('discount')?.valueChanges.subscribe((discount) => {
      this.handleDiscountAmount(discount);
    });
  }

  onChangePaidAmount() {
    this.invoiceForm.get('paid_amount')?.valueChanges.subscribe((paid_amount) => {
      if (paid_amount <= this.totalAmount) {
        const dueAmount = this.totalAmount - paid_amount;
        this.invoiceForm.get('due_amount')?.setValue(dueAmount);
      }
    });
  }

  get subTotal() {
    return this.invoiceForm.get('sub_total')?.value;
  }

  get totalAmount() {
    return this.invoiceForm.get('total_amount')?.value;
  }

  get dueAmount() {
    return Math.abs(this.invoiceForm.get('due_amount')?.value);
  }
  get discount() {
    return this.invoiceForm.get('discount');
  }

  get paidAmount() {
    return this.invoiceForm.get('paid_amount');
  }

  get selectedInvoiceItems() {
    return this.invoiceForm.get('invoice_items') as FormArray;
  }

  onChangeSelectedItems() {
    this.invoiceForm.get('selected_items')?.valueChanges.subscribe((selected_items) => {
      const filteredObjects = this.invoiceItems.filter((item) => selected_items.includes(item.id));
      this.handleDiscountAmount();
      for (let i = this.selectedInvoiceItems.length - 1; i >= 0; i--) {
        const currentItem = this.selectedInvoiceItems.at(i).get('id')?.value;
        if (!filteredObjects.some((item) => item.id === currentItem)) {
          this.selectedInvoiceItems.removeAt(i);
        }
      }

      filteredObjects.forEach((item: any) => {
        if (!this.selectedInvoiceItems.value.some((existingItem: any) => existingItem.id === item.id)) {
          this.selectedInvoiceItems.push(this.invoiceItem(item));
        }
      });
      this.calculateTotalAmount();
    });
  }


  populateInvoiceItems() {
    this.selectedInvoiceItems.clear();
    this.data.invoice_items.forEach((item: any) => {
      this.selectedInvoiceItems.push(this.invoiceItem(item));
    });
  }

  invoiceItem(data?: any) {
    const formGroup = this.formBuilder.group({
      id: data?.id,
      item_id: [data?.item_id, Validators.required],
      quantity: [data?.quantity ?? 1, Validators.required],
      price: [data?.price, Validators.required],
      amount: [data?.price, Validators.required],
    });
    this.onChangeCalculateItemPrice(formGroup);
    return formGroup;
  }

  onChangeCalculateItemPrice(formGroup: FormGroup) {
    formGroup.get('quantity')?.valueChanges.subscribe((newQuantity) => {
      const price = formGroup.get('price')?.value;
      const newAmount = price * newQuantity;

      formGroup.get('amount')?.setValue(newAmount);
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount() {
    let subTotal = 0;

    this.selectedInvoiceItems.controls.forEach((formGroup) => {
      const amount = formGroup?.get('amount')?.value;
      subTotal += amount ? amount : 0;
    });

    this.invoiceForm.get('sub_total')?.setValue(subTotal);
    this.invoiceForm.get('total_amount')?.setValue(subTotal);

    this.setPaidAmountValidators(subTotal);

    this.handleExistingPaidAmount();
    this.handleDiscountAmount();
  }

  handleExistingPaidAmount() {
    const initialPaidAmount = this.paidAmount?.value;

    if (initialPaidAmount) {
      const initialDueAmount = this.totalAmount - initialPaidAmount;
      this.invoiceForm.get('due_amount')?.setValue(initialDueAmount);

    }
  }

  handleDiscountAmount(discount?: number) {
    const initialDiscount = this.invoiceForm.get('discount')?.value;
    const discountAmount = ((discount || initialDiscount) / 100) * this.subTotal;
    const totalPaymentAmount = this.subTotal - discountAmount;
    this.setPaidAmountValidators(totalPaymentAmount);
    this.invoiceForm.get('total_amount')?.setValue(totalPaymentAmount);
    this.handleExistingPaidAmount();
    this.paidAmount?.updateValueAndValidity();
  }

  setPaidAmountValidators(paidAmount: number) {
    this.paidAmount?.setValidators([Validators.required, Validators.min(500), Validators.max(paidAmount), Validators.pattern(/^\d+$/)]);
  }

  getActiveInvoiceItems() {
    this.dataService.getJson('website-cms/active-invoice-items', '')
      .subscribe({
        next: ({ data }) => {
          this.invoiceItems = data;
        },
        error: error => {
          console.error(error);
        }
      })
  }

  getAppointmentUsers() {
    this.dataService.getJson('website-cms/appointment-users', '')
      .subscribe({
        next: ({ data }) => {
          this.appointmentUsers = data;
          if (this.data) {
            this.selectedUser = this.appointmentUsers?.find(user => user.id === this.data.appointment_id);
          }
        },
        error: error => {
          console.error(error);
        }
      })
  }

  getNextInvoiceId() {
    this.dataService.getJson('website-cms/next-invoice', '')
      .subscribe({
        next: ({ data }) => {
          this.invoiceForm.get('invoice_id')?.setValue(data.invoice_id);
        },
        error: error => {
          console.error(error);
        }
      })
  }

  onSubmitForm() {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);

    this.dataService.post(this.invoiceForm.value, 'website-cms/create-invoice')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.dialogRef.close(true);
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success');
          }
        },
        error: (error) => {
          console.error(error);
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
        }
      });
  }
}
