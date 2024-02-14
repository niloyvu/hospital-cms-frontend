import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;
  isDisabled: boolean = false;
  aboutUsPageForm!: FormGroup;

  imageFile: string | null = null;
  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();
  public rootUrl = `${this.commonService.rootUrl}/uploads/`;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getAboutUsPageContent();
  }

  initializeFormGroup() {
    this.aboutUsPageForm = this.formBuilder.group({
      id: null,
      page_title: ['', Validators.required],
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    const formValue = this.aboutUsPageForm.value;

    formValue.image = this.fileUpload;
    this.submission$ = this.dataService.post(formValue, 'website/about-us')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getAboutUsPageContent();
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

  getAboutUsPageContent() {
    this.commonService.onBufferEvent.emit(true);
    this.subscription$ = this.dataService.getJson('website/about-us', '')
      .subscribe({
        next: (response) => {
          this.commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.aboutUsPageForm.patchValue(response.data);
            this.imageFile = `${this.rootUrl}${response?.data?.image}`;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
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
    this.subscription$.unsubscribe();
  }

}
