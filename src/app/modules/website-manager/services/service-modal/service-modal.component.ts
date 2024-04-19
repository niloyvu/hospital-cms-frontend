import { Subscription } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss']
})
export class ServiceModalComponent implements OnInit, OnDestroy {

  serviceForm!: FormGroup;
  isDisabled: boolean = false;

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;

  iconImageRequired: boolean = false;

  imageIconFileUpload: any;
  imageIconError!: string;
  imageIconFileExtension!: string;

  imageFile: string | null = null;
  imageIconFile: string | null = null;
  private submission$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ServiceModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.serviceForm.patchValue(this.data);
      this.imageFile =`${this.commonService.rootUrl}/uploads/${this.data.image}`;
      if(this.data.image_icon) {
        this.imageIconFile =`${this.commonService.rootUrl}/uploads/${this.data.image_icon}`;
      }
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    const formValue = this.serviceForm.value;
    formValue.image = this.fileUpload;
    formValue.image_icon = this.imageIconFileUpload;
    this.submission$ = this.dataService.post(formValue, 'website/service')
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
    this.serviceForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      graphics_type: ['', Validators.required],
      icon: [''],
      description: ['', Validators.required],
      status: [true],
      feature: [false],
    });

    this.serviceForm.get('graphics_type')?.valueChanges.subscribe(graphicsType => {
      const iconControl = this.serviceForm.get('icon');
      if (graphicsType === 1) {
        this.imageIconError = '';
        this.imageIconFile = null;
        this.iconImageRequired = false;
        iconControl?.setValidators(Validators.required);
      } else {
        iconControl?.reset();
        iconControl?.clearValidators();
        this.iconImageRequired = true;
      }
      iconControl?.updateValueAndValidity();
    });
  }

  onFileSelected(event: any, type: string): void {
    this.imageError = '';
    this.imageIconError = '';

    const file: File = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName?.split('.')?.pop()?.toLowerCase();
    const imageErrorMessage = 'Maximum file size allowed is 1 MB';

    if (this.commonService.isFileSizeExceedsMax(file)) {
      type === 'service-image' ? this.imageError = imageErrorMessage : this.imageIconError = imageErrorMessage;
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result as string;

        const imageFile = {
          base64: image,
          extension: fileExtension
        };

        if (type === 'service-image') {
          this.imageFile = image;
          this.fileUpload = imageFile;
        } else {
          this.imageIconFile = image;
          this.imageIconFileUpload = imageFile;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(fileType: string) {
    if (fileType === 'service-image') {
      this.imageFile = null;
      this.imageError = "Image is required"
    } else {
      this.imageIconFile = null;
      this.imageIconError = "Image icon is required"

    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
  }

}
