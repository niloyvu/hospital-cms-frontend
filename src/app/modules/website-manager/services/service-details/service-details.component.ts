import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { DetailsEditorConfig, EditorConfig } from 'src/app/shared/config/editor';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {

  serviceId!: number;
  imageError!: string;
  thumbnailFile: any;
  serviceName!: string;

  thumbnailError!: string;
  thumbnailFileUpload: any;

  editorConfig = DetailsEditorConfig;
  editorApiKey = environment.editorApiKey;
  
  serviceImageFileUpload: any;
  isDisabled: boolean = false;
  serviceDetailsForm!: FormGroup;

  imageFile: string | null = null;

  public rootUrl = `${this.commonService.rootUrl}/uploads/`;
  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.serviceId = this.activatedRoute.snapshot.params['id'];
    this.initializeFormGroup();
    this.getServiceDetails();
    this.serviceName = this.slugToSentence(this.activatedRoute.snapshot.params['name']);
  }

  slugToSentence(slug: string) {
    return slug.replace(/-/g, " ");
  }

  initializeFormGroup() {
    this.serviceDetailsForm = this.formBuilder.group({
      id: null,
      services_id: this.serviceId,
      service_details: ['', Validators.required],
      video_title: ['', Validators.required],
      video_link: ['', Validators.required],
      video_details: ['', Validators.required]
    });
  }

  getServiceDetails() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson('website/service-details', '?id=' + this.serviceId)
      .subscribe({
        next: ({data, code}) => {
          this.commonService.onBufferEvent.emit(false);
          if (code == 200) {
            this.serviceDetailsForm.patchValue(data);
            this.imageFile = data?.image? `${this.rootUrl}${data?.image}` : null;
            this.thumbnailFile = data?.image?`${this.rootUrl}${data?.thumbnail}`: null;
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
    const formValue = this.serviceDetailsForm.value;
    formValue.image = this.serviceImageFileUpload;
    formValue.thumbnail = this.thumbnailFileUpload;
    this.submission$ = this.dataService
      .post(formValue, 'website/service-details')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService
            .onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getServiceDetails();
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

  onFileSelected(event: any, type: string) {
    this.imageError = '';
    this.thumbnailError = '';
  
    const file: File = event.target.files[0];
  
    if (this.commonService.isFileSizeExceedsMax(file)) {
      this.setError(type, 'Max file size allowed is 1 MB');
      return;
    }
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const loadFile = reader.result as string;
        const uploadFile = {
          base64: loadFile,
          extension: this.getFileExtension(file),
        };
  
        this.setFile(type, loadFile, uploadFile);
      };
      reader.readAsDataURL(file);
    }
  }
  
  private setError(type: string, error: string): void {
    if (type === 'image') {
      this.imageError = error;
    } else {
      this.thumbnailError = error;
    }
  }
  
  private getFileExtension(file: File): string {
    return file.name.split('.')?.pop()?.toLowerCase() || '';
  }
  
  private setFile(type: string, loadFile: string, uploadFile: { base64: string, extension: string }): void {
    if (type === 'image') {
      this.imageFile = loadFile;
      this.serviceImageFileUpload = uploadFile;
    } else {
      this.thumbnailFile = loadFile;
      this.thumbnailFileUpload = uploadFile;
    }
  }
  
  removeImage(type: any) {
    if (type === 'image') {
      this.imageFile = null;
      this.imageError = "Image is required"
    } else {
      this.thumbnailFile = null;
      this.thumbnailError = "Thumbnail is required"
    }
  }
  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }
}

