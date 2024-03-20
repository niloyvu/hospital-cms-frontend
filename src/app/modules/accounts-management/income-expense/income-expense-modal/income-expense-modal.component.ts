import { pageType } from 'src/app/shared/enum/page-type';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentType } from 'src/app/shared/enum/payment-type';

@Component({
  selector: 'app-income-expense-modal',
  templateUrl: './income-expense-modal.component.html',
  styleUrls: ['./income-expense-modal.component.scss']
})
export class IncomeExpenseModalComponent implements OnInit, OnDestroy {

  payment = PaymentType;
  isDisabled: boolean = false;
  incomeExpenseForm!: FormGroup;
  dialogRef = inject(MatDialogRef);
  private submission$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.incomeExpenseForm.patchValue(this.data);
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    this.submission$ = this.dataService.post(this.incomeExpenseForm.value, 'website-cms/accounts/cash-flows')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.dialogRef.close(true);
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success')
          } else {
            this.commonService.openSnackBar(response.message, 'Close', 'submit-error')
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  initializeFormGroup() {
    this.incomeExpenseForm = this.formBuilder.group({
      id: null,
      payment_type: ['', Validators.required],
      source: ['', Validators.required],
      date: [null, Validators.required],
      amount: ['', Validators.required],
      remarks: '',
      status: true,
    });
  }

  get paymentType() {
    return this.incomeExpenseForm.controls['payment_type'].value;
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
  }

}
