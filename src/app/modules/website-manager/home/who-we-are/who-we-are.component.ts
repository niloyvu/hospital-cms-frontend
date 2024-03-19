import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-who-we-are',
  templateUrl: './who-we-are.component.html',
  styleUrls: ['./who-we-are.component.scss']
})
export class WhoWeAreComponent implements OnInit, OnDestroy {

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;
  isDisabled: boolean = false;
  whoWeAreForm!: FormGroup;

  imageFile: string | null = null;
  private rootUrl = this._commonService.rootUrl;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getWhoWeAreDetails();
  }

  initializeFormGroup() {
    this.whoWeAreForm = this.formBuilder.group({
      id: null,
      image: ['', Validators.required],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      percentage: ['', Validators.required],
      description: ['', Validators.required],
      button_text: ['', Validators.required],
      percentage_text: ['', Validators.required],
      features: this.formBuilder.array([
        this.createFeatureFormGroup()
      ]),
    });
  }

  createFeatureFormGroup() {
    return this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get featureCardsFormArray() {
    return this.whoWeAreForm.get('features') as FormArray;
  }

  addFeature() {
    const featuresArray = this.whoWeAreForm.get('features') as FormArray;
    featuresArray.push(this.createFeatureFormGroup());
  }

  removeFeature(index: number) {
    const featuresArray = this.whoWeAreForm.get('features') as FormArray;
    featuresArray.removeAt(index);
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.whoWeAreForm.value.file_extension = this.fileExtension;
    this.submission$ = this._dataService.post(this.whoWeAreForm.value, 'website/home/who-we-are')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getWhoWeAreDetails();
            this._commonService.openSnackBar(response.message, 'Close', 'submit-success')
          } else {
            this._commonService.openSnackBar(response.message, 'Close', 'submit-error')
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getWhoWeAreDetails() {
    this._commonService.onBufferEvent.emit(true);
    this.subscription$ = this._dataService.getJson('website/home/who-we-are', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.whoWeAreForm.patchValue(response?.data);
            this.setFormValuesFromApiResponse(response?.data?.features);
            this.imageFile = this.rootUrl + 'uploads/' + response.data.image;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  setFormValuesFromApiResponse(apiResponse: any) {
    const featuresArray = this.whoWeAreForm.get('features') as FormArray;

    while (featuresArray.length !== 0) {
      featuresArray.removeAt(0);
    }

    apiResponse.forEach((featureData: any) => {
      featuresArray.push(this.formBuilder.group(featureData));
    });
  }

  onFileSelected(event: any) {
    this.imageError = '';
    const file: File = event.target.files[0];
    const fileName = file.name;
    this.fileExtension = fileName?.split('.')?.pop()?.toLowerCase() || '';

    if (this._commonService.isFileSizeExceedsMax(file)) {
      this.imageError = 'Maximum size allowed is 1 MB';
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.whoWeAreForm.get('image')?.setValue(reader.result);
        this.imageFile = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imageError = "Image is required"
    this.whoWeAreForm.controls['image'].setValue(null);
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
