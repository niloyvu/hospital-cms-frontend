import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.scss']
})
export class BlogSectionComponent implements OnInit, OnDestroy {

  homeBlogSectionForm!: FormGroup;
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
    this.getHomeBlogSectionText();
  }

  initializeFormGroup() {
    this.homeBlogSectionForm = this.formBuilder.group({
      id: null,
      title: ['', Validators.required],
      subtitle: ['', Validators.required]
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.submission$ = this._dataService.post(this.homeBlogSectionForm.value, 'website/home/blog-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getHomeBlogSectionText();
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

  getHomeBlogSectionText() {
    this._commonService.onBufferEvent.emit(true);
    this.subscription$ = this._dataService.getJson('website/home/blog-section', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.homeBlogSectionForm.patchValue(response.data);
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
