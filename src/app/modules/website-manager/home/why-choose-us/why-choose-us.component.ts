import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-why-choose-us',
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent implements OnInit, OnDestroy {

  isDisabled: boolean = false;
  whyChooseUsForm!: FormGroup;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getWhyChooseUsDetails();
  }

  initializeFormGroup() {
    this.whyChooseUsForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      description: ['', Validators.required],
      circle_text: ['', Validators.required],
      progress_bars: this.formBuilder.array([
        this.createProgressBarFormGroup()
      ]),
    });
  }

  createProgressBarFormGroup() {
    return this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      percentage: ['', Validators.required],
    });
  }

  addProgressBar() {
    const progressBarsArray = this.whyChooseUsForm.get('progress_bars') as FormArray;
    progressBarsArray.push(this.createProgressBarFormGroup());
  }

  removeProgressBar(index: number) {
    const progressBarsArray = this.whyChooseUsForm.get('progress_bars') as FormArray;
    progressBarsArray.removeAt(index);
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.whyChooseUsForm.value, 'website/home/why-choose-us')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getWhyChooseUsDetails();
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

  getWhyChooseUsDetails() {
    this._commonService.onBufferEvent.emit(true);
    this.subscription$ = this._dataService.getJson('website/home/why-choose-us', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.whyChooseUsForm.patchValue(response?.data);
            this.setFormValuesFromApiResponse(response?.data?.progress_bars);
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  setFormValuesFromApiResponse(apiResponse: any) {
    const progressBarsArray = this.whyChooseUsForm.get('progress_bars') as FormArray;

    while (progressBarsArray.length !== 0) {
      progressBarsArray.removeAt(0);
    }

    apiResponse.forEach((featureData: any) => {
      progressBarsArray.push(this.formBuilder.group(featureData));
    });
  }

  
  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
