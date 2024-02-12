import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, OnDestroy {

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;
  pageHeaderForm!: FormGroup;
  isDisabled: boolean = false;
  @Input() apiEndpoint!: string;
  @Input() pageType!: number;

  imageFile: string | null = null;
  public rootUrl = `${this.commonService.rootUrl}/uploads/`;
  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getPageHeaderSection();
  }

  initializeFormGroup() {
    this.pageHeaderForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required]
    });
  }

  getPageHeaderSection() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson(this.apiEndpoint, '?page_type=' + this.pageType)
      .subscribe({
        next: (response) => {
          this.commonService.onBufferEvent.emit(false);
          if (response?.code == 200) {
            this.pageHeaderForm.patchValue(response?.data);
            this.imageFile = `${this.rootUrl}${response?.data?.image}`;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  onSubmitForm(): void {
    this.isDisabled = true;

    this.commonService.onBufferEvent.emit(true);
    const formValue = this.pageHeaderForm.value;

    formValue.image = this.fileUpload;
    formValue.type = this.pageType;
    this.submission$ =
      this.dataService
        .post(formValue, this.apiEndpoint)
        .subscribe({
          next: (response) => {
            this.isDisabled = false;
            this.commonService
              .onBufferEvent.emit(false);
            if (response.code === 200) {
              this.getPageHeaderSection();
              this.commonService
                .openSnackBar(response.message, 'Close', 'submit-success')
            } else {
              this.commonService
                .openSnackBar(response.message, 'Close', 'submit-error')
            }
          },
          error: (error) => {
            console.error(error);
            this.isDisabled = false;
            this.commonService.onBufferEvent.emit(false);
          }
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
    this.subscriptions$.unsubscribe();
  }
}
