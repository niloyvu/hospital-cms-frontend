
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { bookingDateValidator } from 'src/app/shared/validators/booking-date';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss']
})
export class AppointmentModalComponent implements OnInit {
  appointmentForm!: FormGroup;
  dentists:any[] = [];

  isDisabled: boolean = false;
  constructor(
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AppointmentModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getActiveDentists();
    if(this.data) {
      this.appointmentForm.patchValue(this.data);
    }
   }

  
  initializeForm() {
    this.appointmentForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      email: new FormControl('',
        [
          Validators.email,
          Validators.required
        ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern('^[0-9]+$'),
      ]),
      dentist_id: new FormControl(null, [
        Validators.required
      ]),
      department_id: new FormControl(null, [
        Validators.required
      ]),
      date: new FormControl('', [
        Validators.required,
        bookingDateValidator.bind(this)
      ]),
      time: new FormControl(null, [
        Validators.required
      ]),
      feature: new FormControl(1, [
        Validators.required
      ]),
      remarks: new FormControl('', [
        Validators.required
      ]),
      status: new FormControl(2)
    });
  }

  get name() {
    return this.appointmentForm.get('name');
  }

  get email() {
    return this.appointmentForm.get('email');
  }

  get phone() {
    return this.appointmentForm.get('phone');
  }

  get dentist_id() {
    return this.appointmentForm.get('dentist_id');
  }

  get department_id() {
    return this.appointmentForm.get('department_id');
  }

  get date() {
    return this.appointmentForm.get('date');
  }

  get time() {
    return this.appointmentForm.get('time');
  }

  getActiveDentists() {
    this.dataService.getJson('dentists-list','')
      .subscribe({
        next: ({ data }) => {
          this.dentists = data;
        },
        error: error => {
          console.error(error);
        }
      })
  }

  onSubmitForm() {
    this.commonService.onBufferEvent.emit(true);

    this.dataService.post(this.appointmentForm.value, 'website/book-appointment')
      .subscribe({
        next: (response) => {
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {

            this.dialogRef.close();
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success');
            this.commonService.AClicked('component clicked');
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}
