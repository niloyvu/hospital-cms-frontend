
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-navigation-menu-modal',
  templateUrl: './navigation-menu-modal.component.html',
  styleUrls: ['./navigation-menu-modal.component.scss']
})
export class NavigationMenuModalComponent implements OnInit {

  navigationMenuForm!: FormGroup;
  isDisabled: boolean = false;

  fileUpload: any;
  imageError!: string;
  fileExtension!: string;

  imageFile: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NavigationMenuModalComponent>
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
    if (this.data) {
      this.navigationMenuForm.patchValue(this.data);
    }
  }

  onSubmitForm(): void {
    this.isDisabled = true;
    this.commonService.onBufferEvent.emit(true);
    this.dataService
      .post(this.navigationMenuForm.value, 'website-cms/navigation-link')
      .subscribe({
        next: (response) => {
          this.isDisabled = false;
          this.commonService.onBufferEvent.emit(false);
          if (response.code === 200) {
            this.commonService.openSnackBar(response.message, 'Close', 'submit-success')
            this.dialogRef.close(true);
          } else {
            this.commonService.openSnackBar(response.message, 'Close', 'submit-error')
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  initializeFormGroup() {
    this.navigationMenuForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      path: ['', Validators.required],
      order: ['', Validators.required],
      is_button: [false],
      status: [true]
    });
  }
  
  closeModal() {
    this.dialogRef.close();
  }
}
