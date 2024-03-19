import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-feature-cards',
  templateUrl: './feature-cards.component.html',
  styleUrls: ['./feature-cards.component.scss']
})
export class FeatureCardsComponent implements OnInit, OnDestroy {

  featureForm!: FormGroup;
  isDisabled: boolean = false;

  private submission$: Subscription = new Subscription();
  private featureForm$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getFeatureCards();
  }

  initializeFormGroup() {
    this.featureForm = this.formBuilder.group({
      features: this.formBuilder.array([
        this.createFeatureFormGroup()
      ])
    });
  }

  createFeatureFormGroup() {
    return this.formBuilder.group({
      id: null,
      icon_name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  addFeature() {
    const featuresArray = this.featureForm.get('features') as FormArray;
    featuresArray.push(this.createFeatureFormGroup());
  }
  
  get featureCardsFormArray() {
    return this.featureForm.get('features') as FormArray;

  }

  removeFeature(index: number) {
    const featuresArray = this.featureForm.get('features') as FormArray;
    featuresArray.removeAt(index);
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.featureForm.value, 'website/home/feature-cards')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getFeatureCards();
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

  getFeatureCards() {
    this._commonService.onBufferEvent.emit(true);
    this.featureForm$ = this._dataService.getJson('website/home/feature-cards', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.setFormValuesFromApiResponse(response.data);
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }


  setFormValuesFromApiResponse(apiResponse: any) {
    const featuresArray = this.featureForm.get('features') as FormArray;

    while (featuresArray.length !== 0) {
      featuresArray.removeAt(0);
    }

    apiResponse.forEach((featureData: any) => {
      featuresArray.push(this.formBuilder.group(featureData));
    });
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.featureForm$.unsubscribe();
  }
}
