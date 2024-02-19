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
  invoiceForm!: FormGroup;
  isDisabled: boolean = false;
  currentDate: Date = new Date();
  dialogRef = inject(MatDialogRef);

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getActiveInvoiceItems();
    if (this.data) {
      this.invoiceForm.patchValue(this.data);
    }
  }

  initializeForm() {
    this.invoiceForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      invoice_number: [{ value: '4234', disabled: true }, Validators.required],
      date: [this.getDefaultDate(), Validators.required],
      due_date: [this.getDefaultDate(), Validators.required],
      selected_items: [[], Validators.required],
      invoice_items: this.formBuilder.array([this.invoiceItem()]),
      sub_total: ['', Validators.required],
      discount: ['', Validators.required],
      total_amount: [{ value: '', disabled: true }, Validators.required],
      paid_amount: ['', Validators.required],
      due_amount: ['', Validators.required],
      status: ['', Validators.required],
      remarks: [null, Validators.required],
    });
    this.onChangeSelectedItems();
    this.onChangeDiscount();
    this.onChangePaidAmount();
  }

  onChangeDiscount() {
    this.invoiceForm.get('discount')?.valueChanges.subscribe((discount) => {
      const discountAmount = (discount / 100) * this.subTotal;
      this.invoiceForm.get('total_amount')?.setValue(this.subTotal - discountAmount);
    });
  }

  onChangePaidAmount() {
    this.invoiceForm.get('paid_amount')?.valueChanges.subscribe((paid_amount) => {
      if (paid_amount <= this.totalAmount) {
        const dueAmount = this.totalAmount - paid_amount
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
    return this.invoiceForm.get('due_amount')?.value;
  }

  get selectedInvoiceItems() {
    return this.invoiceForm.get('invoice_items') as FormArray;
  }

  onChangeSelectedItems() {
    this.invoiceForm.get('selected_items')?.valueChanges.subscribe((selected_items) => {
      const filteredObjects = this.invoiceItems.filter((item) => selected_items.includes(item.id));

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

    });
  }

  invoiceItem(data?: any) {
    const formGroup = this.formBuilder.group({
      id: data?.id,
      item: [{ value: data?.id, disabled: true }, Validators.required],
      quantity: [data?.quantity, Validators.required],
      price: [data?.price, Validators.required],
      amount: [data?.amount, Validators.required],
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
      const amount = formGroup.get('amount')?.value;
      subTotal += amount ? amount : 0;
    });

    this.invoiceForm.get('sub_total')?.setValue(subTotal);
    this.invoiceForm.get('total_amount')?.setValue(subTotal);
  }

  getDefaultDate() {
    return new Date().toISOString().slice(0, 10);
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

  onSubmitForm() {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    this.dataService.post(this.invoiceForm.value, 'website/book-appointment')
      .subscribe({
        next: (response) => {
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.isDisabled = false;
            this.dialogRef.close(true);
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success');
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}
