import { Subscription } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DetailsEditorConfig, EditorConfig } from 'src/app/shared/config/editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.component.html',
  styleUrls: ['./create-update-product.component.scss']
})
export class CreateUpdateProductComponent implements OnInit, OnDestroy {


  productId!: number;
  isDisabled: boolean = false;
  productForm!: FormGroup;
  imageFile: string | null = null;
  productName: string = '';
  
  productCategories: any[] = [];
  
  fileUpload: any;
  imageError!: string;
  fileExtension!: string;
  
  editorConfig = DetailsEditorConfig;
  editorConfigForShortDescription = EditorConfig;
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
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.initializeFormGroup();
    this.getProductCategories();
    if (this.productId) {
      this.getProductDetails();
      this.productName = this.slugToSentence(this.activatedRoute.snapshot.params['name']);
    }
  }

  slugToSentence(slug: string) {
    return slug.replace(/-/g, " ");
  }

  initializeFormGroup() {
    this.productForm = this.formBuilder.group({
      id: this.productId,
      title: [null, Validators.required],
      category_id: [null, Validators.required],
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      short_description: [null, Validators.required],
      details: [null, Validators.required],
      status: [true],
      feature: [false],
    });
  }

  getProductDetails() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson('website/shop/product-details', '?id=' + this.productId)
      .subscribe({
        next: ({ data, code }) => {
          this.commonService.onBufferEvent.emit(false);
          if (code == 200) {
            this.productForm.patchValue(data);
            this.imageFile = data.image ? `${this.rootUrl}${data?.image}` : null;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getProductCategories() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson('website/shop/product-category-list', '')
      .subscribe({
        next: ({ data }) => {
          this.commonService.onBufferEvent.emit(false);
          this.productCategories = data || [];

        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);

    const formValue = this.productForm.value;
    formValue.image = this.fileUpload;

    this.submission$ = this.dataService
      .post(formValue, 'website/shop/create-update-product')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService
            .onBufferEvent.emit(false);
          if (response.code === 200) {
            if (this.productId) {
              this.router.navigate(['/website/shop/products']);
            }
            this.initializeFormGroup();
            this.imageFile = null;
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
