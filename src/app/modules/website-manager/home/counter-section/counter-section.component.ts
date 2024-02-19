import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-counter-section',
  templateUrl: './counter-section.component.html',
  styleUrls: ['./counter-section.component.scss']
})
export class CounterSectionComponent implements OnInit, OnDestroy {
  counterForm!: FormGroup;
  isDisabled: boolean = false;

  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.FormArray();
  }

  initializeFormGroup() {
    this.counterForm = this.formBuilder.group({
      counters: this.formBuilder.array([
        this.createCounterFormGroup()
      ])
    });
  }

  createCounterFormGroup() {
    return this.formBuilder.group({
      id: null,
      icon_name: ['', Validators.required],
      value: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  get getCountersFormArray() {
    return this.counterForm.get('counters') as FormArray;
  } 

  addCounter() {
    const countersArray = this.counterForm.get('counters') as FormArray;
    countersArray.push(this.createCounterFormGroup());
  }

  removeCounter(index: number) {
    const countersArray = this.counterForm.get('counters') as FormArray;
    countersArray.removeAt(index);
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.counterForm.value, 'website/home/counter-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.FormArray();
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

  FormArray() {
    this._commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this._dataService.getJson('website/home/counter-section', '')
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
    const countersArray = this.counterForm.get('counters') as FormArray;

    while (countersArray.length !== 0) {
      countersArray.removeAt(0);
    }

    apiResponse.forEach((featureData: any) => {
      countersArray.push(this.formBuilder.group(featureData));
    });
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }
}
