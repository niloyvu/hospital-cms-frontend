import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.scss']
})
export class FooterSectionComponent implements OnInit, OnDestroy {

  isDisabled: boolean = false;
  footerForm!: FormGroup;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getFooterDetails();
  }

  initializeFormGroup() {
    this.footerForm = this.formBuilder.group({
      id: null,
      description: ['', Validators.required],
      address_title: ['', Validators.required],
      address: ['', Validators.required],
      quick_link_heading: ['', Validators.required],
      quick_links: this.formBuilder.array([
        this.createQuickLinksFormGroup()
      ]),
      hour_heading: ['', Validators.required],
      hours: this.formBuilder.array([
        this.createOpeningHoursFormGroup()
      ]),
      call_heading: ['', Validators.required],
      phone: ['', Validators.required],
      organization: ['', Validators.required],
      powered_by: ['', Validators.required],
      creator: ['', Validators.required],

    });
  }

  createQuickLinksFormGroup() {
    return this.formBuilder.group({
      id: null,
      link_title: ['', Validators.required],
      link: ['', Validators.required],
    });
  }

  createOpeningHoursFormGroup() {
    return this.formBuilder.group({
      id: null,
      day: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  addLink() {
    const quickLinksArray = this.footerForm.get('quick_links') as FormArray;
    quickLinksArray.push(this.createQuickLinksFormGroup());
  }

  get quickLinksArray() {
    return this.footerForm.get('quick_links') as FormArray;
  }

  removeLink(index: number) {
    const quickLinksArray = this.footerForm.get('quick_links') as FormArray;
    quickLinksArray.removeAt(index);
  }

  addHour() {
    const hoursArray = this.footerForm.get('hours') as FormArray;
    hoursArray.push(this.createOpeningHoursFormGroup());
  }

  removeHour(index: number) {
    const hoursArray = this.footerForm.get('hours') as FormArray;
    hoursArray.removeAt(index);
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.footerForm.value, 'website/home/footer-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getFooterDetails();
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

  getFooterDetails() {
    this._commonService.onBufferEvent.emit(true);
    this.subscription$ = this._dataService.getJson('website/home/footer-section', '')
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

  setFormValuesFromApiResponse(response: any) {
    this.footerForm.patchValue(response);
    this.setFormFooterHoursValuesFromApiResponse(response?.hours);
    this.setFormQuickLinkValuesFromApiResponse(response?.quick_links);
  }

  setFormQuickLinkValuesFromApiResponse(apiResponse: any) {
    const quickLinksArray = this.footerForm.get('quick_links') as FormArray;

    while (quickLinksArray.length !== 0) {
      quickLinksArray.removeAt(0);
    }

    apiResponse.forEach((linkData: any) => {
      quickLinksArray.push(this.formBuilder.group(linkData));
    });
  }

  setFormFooterHoursValuesFromApiResponse(apiResponse: any) {
    const hoursArray = this.footerForm.get('hours') as FormArray;

    while (hoursArray.length !== 0) {
      hoursArray.removeAt(0);
    }

    apiResponse.forEach((hourData: any) => {
      hoursArray.push(this.formBuilder.group(hourData));
    });
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
