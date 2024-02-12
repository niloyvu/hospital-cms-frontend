import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-news-letter-section',
  templateUrl: './news-letter-section.component.html',
  styleUrls: ['./news-letter-section.component.scss']
})
export class NewsLetterSectionComponent implements OnInit, OnDestroy {

  homeNewsletterSectionForm!: FormGroup;
  isDisabled: boolean = false;

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;
  imageFile: string | null = null;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getHomeNewsletterSectionText();
  }

  initializeFormGroup() {
    this.homeNewsletterSectionForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      placeholder: ['', Validators.required],
      button_text: ['', Validators.required]
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    const { image, ...formValue } = this.homeNewsletterSectionForm.value;
    formValue.image = this.fileUpload;
    this.submission$ = this.dataService.post(formValue, 'website/home/newsletter-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getHomeNewsletterSectionText();
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

  getHomeNewsletterSectionText() {
    this.commonService.onBufferEvent.emit(true);
    this.subscription$ = this.dataService.getJson('website/home/newsletter-section', '')
      .subscribe({
        next: ({ data, code }) => {
          this.commonService.onBufferEvent.emit(false);
          if (code == 200) {
            this.homeNewsletterSectionForm.patchValue(data);
            this.imageFile =
              `${this.commonService.rootUrl}/uploads/${data.image}`;
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
