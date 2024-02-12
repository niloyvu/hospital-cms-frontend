import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-testimonial-modal',
  templateUrl: './testimonial-modal.component.html',
  styleUrls: ['./testimonial-modal.component.scss']
})

export class TestimonialModalComponent implements OnInit, OnDestroy {

  testimonialForm!: FormGroup;
  isDisabled: boolean = false;

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;

  imageFile: string | null = null;
  private submission$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TestimonialModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.testimonialForm.patchValue(this.data);
      this.imageFile =
        `${this.commonService.rootUrl}/uploads/${this.data.image}`;
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    const formValue = this.testimonialForm.value;
    formValue.image = this.fileUpload;
    this.submission$ = this.dataService.post(formValue, 'website/testimonial')
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
    this.testimonialForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      designation: ['', Validators.required],
      review: ['', Validators.required],
      status: [true],
      feature: [false],
    });
  }

  onFileSelected(event: any) {
    this.imageError = '';
    const file: File = event.target.files[0];
    const fileName = file.name;
    this.fileExtension = fileName?.split('.')?.pop()?.toLowerCase() || '';

    if (this.commonService.isFileSizeExceedsMax(file)) {
      this.imageError = 'Maximum size allowed is 1 MB';
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageFile = reader.result as string;
        this.fileUpload = {
          base64: this.imageFile,
          extension: this.fileExtension,
        };
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imageError = "Image is required"
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
  }

}
