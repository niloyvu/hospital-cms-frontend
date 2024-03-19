import { Subscription } from 'rxjs';
import { EditorConfig } from 'src/app/shared/config/editor';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-hero-form-text',
  templateUrl: './hero-form-text.component.html',
  styleUrls: ['./hero-form-text.component.scss']
})
export class HeroFormTextComponent implements OnInit, OnDestroy {

  heroForm!: FormGroup;
  isDisabled: boolean = false;
  editorConfig = EditorConfig;
  editorApiKey = environment.editorApiKey;

  private submission$: Subscription = new Subscription();
  private heroForm$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getHeroFormInfo();
  }

  initializeFormGroup() {
    this.heroForm = this.formBuilder.group({
      id: null,
      contact_us: ['', Validators.required],
      location: ['', Validators.required],
      opening_hours: ['', Validators.required],
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.heroForm.value, 'website/home/hero-form-text')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getHeroFormInfo();
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

  getHeroFormInfo() {
    this._commonService.onBufferEvent.emit(true);
    this.heroForm$ = this._dataService.getJson('website/home/hero-form-text', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.heroForm.patchValue(response.data);
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.heroForm$.unsubscribe();
  }

}
