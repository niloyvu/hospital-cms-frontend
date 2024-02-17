import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { bookingDateValidator } from 'src/app/shared/validators/booking-date';

@Component({
  selector: 'app-invoice-form-modal',
  templateUrl: './invoice-form-modal.component.html',
  styleUrls: ['./invoice-form-modal.component.scss']
})
export class InvoiceFormModalComponent implements OnInit {

  invoiceItems: any[] = [];
  currentDate: Date = new Date();
  invoiceForm!: FormGroup;
  isDisabled: boolean = false;
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
      quantity: ['', Validators.required],
      invoice_items: [[], Validators.required],
      price: ['', Validators.required],
      total_amount: [{ value: '', disabled: true }, Validators.required],
      sub_total: ['', Validators.required],
      total: ['', Validators.required],
      discount: ['', Validators.required],
      paid_amount: ['', Validators.required],
      due_amount: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getDefaultDate() {
    return new Date().toISOString().slice(0, 10);
  }

  get name() {
    return this.invoiceForm.get('name');
  }

  get email() {
    return this.invoiceForm.get('email');
  }

  get phone() {
    return this.invoiceForm.get('phone');
  }

  get dentist_id() {
    return this.invoiceForm.get('dentist_id');
  }

  get department_id() {
    return this.invoiceForm.get('department_id');
  }

  get date() {
    return this.invoiceForm.get('date');
  }

  get time() {
    return this.invoiceForm.get('time');
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
