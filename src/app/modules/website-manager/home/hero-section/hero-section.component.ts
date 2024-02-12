import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy {

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;
  isDisabled: boolean = false;
  heroSectionForm!: FormGroup;

  imageFile: string | null = null;
  private rootUrl = this._commonService.rootUrl;

  private submission$: Subscription = new Subscription();
  private topBarText$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private _dataService: DataService,
    private _commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getHeroSection();
  }

  initializeFormGroup() {
    this.heroSectionForm = this.formBuilder.group({
      id: null,
      image: ['', Validators.required],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      rating_text: ['', Validators.required],
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this._commonService.onBufferEvent.emit(true);
    this.heroSectionForm.value.file_extension = this.fileExtension;
    this.submission$ = this._dataService.post(this.heroSectionForm.value, 'website/home/hero-section')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this._commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getHeroSection();
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

  getHeroSection() {
    this._commonService.onBufferEvent.emit(true);
    this.topBarText$ = this._dataService.getJson('website/home/hero-section', '')
      .subscribe({
        next: (response) => {
          this._commonService.onBufferEvent.emit(false);
          if (response.code == 200) {
            this.heroSectionForm.patchValue(response.data);
            this.imageFile = this.rootUrl + 'uploads/' + response.data.image;
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  onFileSelected(event: any) {
    this.imageError = '';
    const file: File = event.target.files[0];
    const fileName = file.name; 
     this.fileExtension = fileName?.split('.')?.pop()?.toLowerCase() || '';  

    if (this._commonService.isFileSizeExceedsMax(file)) {
      this.imageError = 'Maximum size allowed is 1 MB';
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.heroSectionForm.get('image')?.setValue(reader.result);
        this.imageFile = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imageError = "Image is required"
    this.heroSectionForm.controls['image'].setValue(null);
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.topBarText$.unsubscribe();
  }

}
