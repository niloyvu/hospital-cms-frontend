import { Subscription } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-product-category-modal',
  templateUrl: './product-category-modal.component.html',
  styleUrls: ['./product-category-modal.component.scss']
})
export class ProductCategoryModalComponent implements OnInit, OnDestroy {

  productCategoryForm!: FormGroup;
  isDisabled: boolean = false;

  private submission$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCategoryModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.productCategoryForm.patchValue(this.data);
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);

    this.submission$ = this.dataService.post(this.productCategoryForm.value, 'website/shop/product-category')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.dialogRef.close();
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
    this.productCategoryForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [true],
      feature: [false],
    });
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
  }
}