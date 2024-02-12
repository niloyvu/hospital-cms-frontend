import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-working-process',
  templateUrl: './working-process.component.html',
  styleUrls: ['./working-process.component.scss']
})
export class WorkingProcessComponent implements OnInit, OnDestroy {

  isDisabled: boolean = false;
  workingProcessForm!: FormGroup;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getDentistWorkingProcess();
  }

  initializeFormGroup() {
    this.workingProcessForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      trusted_by_text: ['', Validators.required],
      trusted_by_count: ['', Validators.required],
      established_text: ['', Validators.required],
      established_count: ['', Validators.required],
      processes: this.formBuilder.array([
        this.createProcessItemFormGroup()
      ]),
    });
  }

  createProcessItemFormGroup() {
    return this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      icon_class: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  addProcess() {
    const processesArray = this.workingProcessForm.get('processes') as FormArray;
    processesArray.push(this.createProcessItemFormGroup());
  }

  removeProcess(index: number) {
    const processesArray = this.workingProcessForm.get('processes') as FormArray;
    processesArray.removeAt(index);
  }

  onSubmitWorkingProcessForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.workingProcessForm.value, 'website/dentist-working-processes')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getDentistWorkingProcess();
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

  getDentistWorkingProcess() {
    this._commonService.onBufferEvent.emit(true);
    this.subscription$ = this._dataService.getJson('website/dentist-working-processes', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.workingProcessForm.patchValue(response?.data);
            this.setFormValuesFromApiResponse(response?.data?.processes);
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  setFormValuesFromApiResponse(apiResponse: any) {
    const processesArray = this.workingProcessForm.get('processes') as FormArray;

    while (processesArray.length !== 0) {
      processesArray.removeAt(0);
    }

    apiResponse?.forEach((processItem: any) => {
      processesArray.push(this.formBuilder.group(processItem));
    });
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
