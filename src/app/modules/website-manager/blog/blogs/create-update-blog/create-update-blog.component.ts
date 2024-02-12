import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DetailsEditorConfig } from 'src/app/shared/config/editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-update-blog',
  templateUrl: './create-update-blog.component.html',
  styleUrls: ['./create-update-blog.component.scss']
})
export class CreateUpdateBlogComponent implements OnInit, OnDestroy {

  blogId!: number;
  isDisabled: boolean = false;
  editorConfig = DetailsEditorConfig;
  blogForm!: FormGroup;
  featureImageFile: string | null = null;

  detailsPageImageFile: string | null = null;
  doctorName: string = '';

  blogCategories: any[] = [];

  featureImageUploadFile: any;
  featureImageError!: string;

  detailsPageImageUploadFile: any;
  detailsPageImageError!: string;


  public rootUrl = `${this.commonService.rootUrl}/uploads/`;
  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.blogId = this.activatedRoute.snapshot.params['id'];
    this.initializeFormGroup();
    this.getBlogCategories();
    if (this.blogId) {
      this.getBlogDetails();
      this.doctorName = this.slugToSentence(this.activatedRoute.snapshot.params['name']);
    }
  }

  slugToSentence(slug: string) {
    return slug.replace(/-/g, " ");
  }

  initializeFormGroup() {
    this.blogForm = this.formBuilder.group({
      id: this.blogId,
      title: [null, Validators.required],
      category_id: [null, Validators.required],
      details: [null, Validators.required],
      status: [true],
      feature: [false],
    });
  }

  getBlogDetails() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson('website/blog/details', '?id=' + this.blogId)
      .subscribe({
        next: ({ data, code }) => {
          this.commonService.onBufferEvent.emit(false);
          if (code == 200) {
            this.blogForm.patchValue(data);
            this.featureImageFile = data.feature_image ? `${this.rootUrl}${data?.feature_image}` : null;
            this.detailsPageImageFile = data.details_page_image ? `${this.rootUrl}${data?.details_page_image}` : null;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getBlogCategories() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson('website/blog/category-list', '')
      .subscribe({
        next: ({ data, code }) => {
          this.commonService.onBufferEvent.emit(false);
          this.blogCategories = data || [];

        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);

    const formValue = this.blogForm.value;
    formValue.feature_image = this.featureImageUploadFile;
    formValue.details_page_image = this.detailsPageImageUploadFile;

    this.submission$ = this.dataService
      .post(formValue, 'website/blog/create-update')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService
            .onBufferEvent.emit(false);
          if (response.code === 200) {
            if (this.blogId) {
              this.router.navigate(['/website/blogs/list']);
            }
            this.initializeFormGroup();
            this.featureImageFile = null;
            this.detailsPageImageFile = null;
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

  onFileSelected(event: any, type: string): void {
    this.featureImageError = '';
    this.detailsPageImageError = '';

    const file: File = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName?.split('.')?.pop()?.toLowerCase();
    const imageErrorMessage = 'Maximum file size allowed is 1 MB';

    if (type === 'featureImage') {
      if (this.commonService.isFileSizeExceedsMax(file)) {
        this.featureImageError = imageErrorMessage;
        return;
      }
    }

    if (type === 'detailsPage') {
      if (this.commonService.isFileSizeExceedsMax(file)) {
        this.detailsPageImageError = imageErrorMessage;
        return;
      }
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result as string;

        const imageFile = {
          base64: image,
          extension: fileExtension
        };
        
        if(type === 'detailsPage') {
          this.detailsPageImageFile = image;
          this.detailsPageImageUploadFile = imageFile;
        } else {
          this.featureImageFile = image;
          this.featureImageUploadFile = imageFile;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(type: string): void {
    if (type === 'featureImage') {
      this.featureImageFile = null;
      this.featureImageError = "Image is required"
    } else {
      this.detailsPageImageFile = null;
      this.detailsPageImageError = "Image is required"
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
