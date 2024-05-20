import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit, OnDestroy {

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;

  isDisabled: boolean = false;
  bookAppointmentPageForm!: FormGroup;

  imageFile: string | null = null;
  private rootUrl = this.commonService.rootUrl;

  private submission$: Subscription = new Subscription();
  private subscription$: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getAppointmentPageContents();
  }

  initializeFormGroup() {
    this.bookAppointmentPageForm = this.formBuilder.group({
      id: null,
      page_title: ['', Validators.required],
      specialty_title: ['', Validators.required],
      subtitle: ['', Validators.required]
    });
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    const formValue = this.bookAppointmentPageForm.value;
    formValue.image = this.fileUpload;

    this.submission$ = this.dataService.post(formValue, 'website/appointment-page')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.getAppointmentPageContents();
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success')
          } else {
            this.commonService.openSnackBar(response.message, 'Close', 'submit-error')
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getAppointmentPageContents() {
    this.commonService.onBufferEvent.emit(true);
    this.subscription$ = this.dataService.getJson('website/appointment-page', '')
      .subscribe({
        next: ({ data, code }) => {
          this.commonService.onBufferEvent.emit(false);
          if (code == 200) {
            this.bookAppointmentPageForm.patchValue(data);
            this.imageFile = this.rootUrl + 'uploads/' + data.image;
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

    if (this.commonService.isFileSizeExceedsMax(file)) {
      this.imageError = 'Maximum size allowed is 1 MB';
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageFile = reader.result as string;
        this.fileUpload = {
          base64: this.imageFile,
          extension: this.fileExtension,
        };
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imageError = "Image is required"
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscription$.unsubscribe();
  }

}
