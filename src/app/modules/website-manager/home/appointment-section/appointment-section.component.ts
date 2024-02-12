import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-appointment-section',
  templateUrl: './appointment-section.component.html',
  styleUrls: ['./appointment-section.component.scss']
})
export class AppointmentSectionComponent implements OnInit, OnDestroy {

  appointmentSectionForm!: FormGroup;
  isDisabled: boolean = false;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getHomeAppointmentSectionText();
  }

  initializeFormGroup() {
    this.appointmentSectionForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      form_heading: ['', Validators.required],
      button_text: ['', Validators.required],
      video_link: ['', Validators.required],
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.appointmentSectionForm.value, 'website/home/appointment-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getHomeAppointmentSectionText();
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

  getHomeAppointmentSectionText() {
    this._commonService.onBufferEvent.emit(true);
    this.subscription$ = this._dataService.getJson('website/home/appointment-section', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.appointmentSectionForm.patchValue(response.data);
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
