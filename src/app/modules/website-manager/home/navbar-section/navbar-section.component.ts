import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-navbar-section',
  templateUrl: './navbar-section.component.html',
  styleUrls: ['./navbar-section.component.scss']
})
export class NavbarSectionComponent implements OnInit, OnDestroy {

  navbarForm!: FormGroup;
  isDisabled: boolean = false;

  lightModeLogoFileExtension: string = '';
  lightModeLogoFile: string | null = null;
  lightModeLogoError!: any;

  darkModeLogoFileExtension: string = '';
  darkModeLogoFile: string | null = null;
  darkModeLogoError!: any;

  private rootUrl = this._commonService.rootUrl;

  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private form: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getNavbarSectionTexts();
  }

  initializeFormGroup() {
    this.navbarForm = this.form.group({
      id: null,
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      schedule: ['', Validators.required],
      button_text: ['', Validators.required],
      dark_mode_logo: ['', Validators.required],
      light_mode_logo: ['', Validators.required],
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);

    this.navbarForm.value.light_mode_logo_file_extension = this.lightModeLogoFileExtension;
    this.navbarForm.value.dark_mode_logo_file_extension = this.darkModeLogoFileExtension;

    this.submission$ = this._dataService.post(this.navbarForm.value, 'website/home/navbar-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.lightModeLogoFileExtension = '';
          this.darkModeLogoFileExtension = '';
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getNavbarSectionTexts();
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

  getNavbarSectionTexts() {
    this._commonService.onBufferEvent.emit(true);
    this.subscriptions$ = this._dataService.getJson('website/home/navbar-section', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.navbarForm.patchValue(response.data);
            this.lightModeLogoFile = this.rootUrl + 'uploads/' + response.data.light_mode_logo;
            this.darkModeLogoFile = this.rootUrl + 'uploads/' + response.data.dark_mode_logo;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }


  onClickLogoSelected(event: any, mode: string) {

    const file: File = event.target.files[0];
    const fileName = file.name;
    let error = '';
    let fileExtension = fileName?.split('.')?.pop()?.toLowerCase() || '';

    if (this._commonService.isFileSizeExceedsMax(file)) {
      error = 'Maximum size allowed is 1 MB';
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (mode === 'light') {
          this.navbarForm.get('light_mode_logo')?.setValue(reader.result);
          this.lightModeLogoFile = reader.result as string;
          this.lightModeLogoError = error;
          this.lightModeLogoFileExtension = fileExtension;
        } else if (mode === 'dark') {
          this.navbarForm.get('dark_mode_logo')?.setValue(reader.result);
          this.darkModeLogoFile = reader.result as string;
          this.darkModeLogoError = error;
          this.darkModeLogoFileExtension = fileExtension;
        }
      };

      reader.readAsDataURL(file);

    }

  }


  removeLogo(mode: string): void {
    if (mode === 'light') {
      this.lightModeLogoFile = null;
      this.lightModeLogoError = 'Light mode logo is required';
      this.navbarForm.controls['light_mode_logo'].setValue(null);
    } else if (mode === 'dark') {
      this.darkModeLogoFile = null;
      this.darkModeLogoError = 'Dark mode logo is required';
      this.navbarForm.controls['dark_mode_logo'].setValue(null);
    }

  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }


}
