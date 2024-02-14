import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { DetailsEditorConfig } from 'src/app/shared/config/editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-dentist-details',
  templateUrl: './dentist-details.component.html',
  styleUrls: ['./dentist-details.component.scss']
})
export class DentistDetailsComponent implements OnInit, OnDestroy {
  dentistId!: number;
  isDisabled: boolean = false;
  editorConfig = DetailsEditorConfig;
  
  editorApiKey = environment.editorApiKey;

  dentistDetailsForm!: FormGroup;
  imageFile: string | null = null;
  doctorName: string = '';

  public rootUrl = `${this.commonService.rootUrl}/uploads/`;
  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dentistId = this.activatedRoute.snapshot.params['id'];
    this.initializeFormGroup();
    this.getDentistDetails();
    this.doctorName = this.slugToSentence(this.activatedRoute.snapshot.params['name']);
  }

  slugToSentence(slug: string) {
    return slug.replace(/-/g, " ");
  }

  initializeFormGroup() {
    this.dentistDetailsForm = this.formBuilder.group({
      id: this.dentistId,
      details: [null, Validators.required]
    });
  }

  getDentistDetails() {
    this.commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this.dataService
      .getJson('website/dentist-details', '?id=' + this.dentistId)
      .subscribe({
        next: ({ data, code }) => {
          this.commonService.onBufferEvent.emit(false);
          if (code == 200) {
            this.dentistDetailsForm.patchValue(data);
            this.imageFile = data.image ? `${this.rootUrl}${data?.image}` : null;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    this.submission$ = this.dataService
      .post(this.dentistDetailsForm.value, 'website/dentist')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService
            .onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getDentistDetails();
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

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
