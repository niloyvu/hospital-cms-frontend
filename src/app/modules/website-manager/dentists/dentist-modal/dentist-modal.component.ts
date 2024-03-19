import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dentist-modal',
  templateUrl: './dentist-modal.component.html',
  styleUrls: ['./dentist-modal.component.scss']
})
export class DentistModalComponent implements OnInit, OnDestroy {

  dentistForm!: FormGroup;
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
    public dialogRef: MatDialogRef<DentistModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.dentistForm.patchValue(this.data);
      this.imageFile =
        `${this.commonService.rootUrl}/uploads/${this.data.image}`;
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    const formValue = this.dentistForm.value;
    formValue.image = this.fileUpload;
    this.submission$ = this.dataService.post(formValue, 'website/dentist')
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
    this.dentistForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      phone: [null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)]
      ],
      email: [null, [
        Validators.required,
        Validators.email]
      ],
      designation: [null,
        Validators.required],
      address: [null,
        Validators.required],
      description: [null,
        Validators.required],
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
