import { Subscription } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-blog-category-modal',
  templateUrl: './blog-category-modal.component.html',
  styleUrls: ['./blog-category-modal.component.scss']
})
export class BlogCategoryModalComponent implements OnInit, OnDestroy {

  blogCategoryForm!: FormGroup;
  isDisabled: boolean = false;

  private submission$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BlogCategoryModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.blogCategoryForm.patchValue(this.data);
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);

    this.submission$ = this.dataService.post(this.blogCategoryForm.value, 'website/blog/category')
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
    this.blogCategoryForm = this.formBuilder.group({
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