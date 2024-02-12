import { FormBuilder } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AppError } from 'src/app/shared/core/app-error';
import { BadInput } from 'src/app/shared/core/bad-input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
  id: number;
  token: string;
  name: any;
  provider_name: any;
  domain_name: any;
  end_point: any;
  api_key: any;
  username: any;
  password: any;
  remarks: any;
  report_end_point: any;
  balance_end_point: any;
  sms_type: any;
  source_type: any;
  status: any;
  save_type: string;
  operation: string;
}
@Component({
  selector: 'app-sms-provider',
  templateUrl: './sms-provider.component.html',
  styleUrls: ['./sms-provider.component.scss']
})
export class SmsProviderComponent implements OnInit {

  totalitem = 0;
  pageRequest = 1;
  itemPerPage = '15';
  errorMessage = '';
  searchValues: String = '';
  dataOrderBy = true;
  sortColumn = 'id';
  list: any = [];
  searchValuesUP: String = '';
  pageRequestUP = 1;
  itemPerPageUP = '15';
  totalitemUpdate = 0;
  sortColumnUP = 'id';
  updatelist: any = [];

  constructor(
    public dialog: MatDialog,
    public common: CommonService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.allInitialData();
    this.allInitialUpdatedData();
    this.common.aClickedEvent.subscribe((data: string) => {
      this.allInitialData();
      this.allInitialUpdatedData();
    });
  }

  changedPageItem() {
    this.pageRequest = 1;
    this.allInitialData();
  }

  pageChange(newPage: number) {
    this.pageRequest = newPage;
    this.allInitialData();
  }
  filter(value: string) {
    this.searchValues = value;
    this.pageRequest = 1;
    this.itemPerPage = '15';
    this.dataOrderBy = true;
    this.allInitialData();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageRequest = 1;
    this.itemPerPage = '15';
    this.dataOrderBy = true;
    this.allInitialData();
  }


  sort(column: string) {
    if (this.sortColumn === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.sortColumn = column;
    }
    this.allInitialData();
  }

  allInitialData() {
    let orderBy: string;
    if (this.dataOrderBy === true) {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }
    const postData = {
      'search': this.searchValues,
      'order': orderBy,
      'columns': this.sortColumn,
      'rowperpage': this.itemPerPage,
      'pagereqest': this.pageRequest,
    };
    this.allData(postData);
  }



  allData(postData: any) {
    this.dataService.post(postData, 'system/settings/smsprovider')
      .subscribe(data => {
        if (data.response === 200) {

          this.list = data.data;
          this.totalitem = data.totalitem;
        } else {
          this.list = data.data;
          this.totalitem = data.totalitem;
          this.common.openSnackBar(data.message, 'Close', 'submit-error');
        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
            // tslint:disable-next-line: semicolon
          } else {
            throw error;
          }
        });
  }
  sendSms() {
    const postData = {
      'search': this.searchValues,
      'columns': this.sortColumn,
      'rowperpage': this.itemPerPage,
      'pagereqest': this.pageRequest,
      'component_class': 'DashboardComponent',
      // 'op_type_code' :  'notify_code',
      // 'op_type_code' :  'otp_code',
      'op_type_code': 'security_code',

    };
    this.dataService.post(postData, 'system/settings/testSendSms2')
      .subscribe(data => {
        if (data.response === 200) {
          this.common.openSnackBar(data.message, 'Close', 'submit-success')

        } else {

          this.common.openSnackBar(data.message, 'Close', 'submit-error');
        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
            // tslint:disable-next-line: semicolon
          } else {
            throw error;
          }
        });
  }

  changedPageUpdate() {
    this.pageRequestUP = 1;
    this.allInitialUpdatedData();
  }

  pageChangeUpdate(newPage: number) {
    this.pageRequestUP = newPage;
    this.allInitialUpdatedData();
  }

  filter2(value: string) {
    this.searchValuesUP = value;
    this.pageRequestUP = 1;
    this.itemPerPageUP = '15';
    this.dataOrderBy = true;
    this.allInitialUpdatedData();
  }

  clearFilter2() {
    this.searchValuesUP = '';
    this.pageRequestUP = 1;
    this.itemPerPageUP = '15';
    this.dataOrderBy = true;
    this.allInitialUpdatedData();
  }

  sort2(column: string) {
    if (this.sortColumnUP === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.sortColumnUP = column;
    }
    this.allInitialUpdatedData();
  }



  allInitialUpdatedData() {
    let orderBy: string;
    if (this.dataOrderBy === true) {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }
    const postData = {
      'search': this.searchValuesUP,
      'order': orderBy,
      'columns': this.sortColumnUP,
      'rowperpage': this.itemPerPageUP,
      'pagereqest': this.pageRequestUP,
    };
    this.allUpdateData(postData);
  }

  allUpdateData(postData: any) {
    this.dataService.post(postData, 'system/settings/smsproviderUpdateData')
      .subscribe(data => {
        if (data.response === 200) {

          this.updatelist = data.data;
          this.totalitemUpdate = data.totalitem;
        } else {
          this.updatelist = data.data;
          this.totalitemUpdate = data.totalitem;
          // this.common.openSnackBar(data.message, 'Close', 'submit-error');
        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
            // tslint:disable-next-line: semicolon
          } else {
            throw error;
          }
        });
  }

  getSL(i: any) {
    return (Number(this.itemPerPage) * (Number(this.pageRequest) - 1)) + i;
  }






  /*
  Add Info function
  */
  openDialog() {
    const dialogRef = this.dialog.open(SmsProviderDialog, {
      width: '60%',
      data: {
        id: '',
        provider_name: '',
        domain_name: '',
        end_point: '',
        api_key: '',
        username: '',
        password: '',
        remarks: '',
        status: '',
        report_end_point: '',
        balance_end_point: '',
        sms_type: '',
        operation: 'create',
        save_type: 'create',

      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /*
  Edit Info function
  */
  EditDialog(inputData: any) {
    const dialogRef = this.dialog.open(SmsProviderDialog, {
      width: '60%',
      data: {
        id: inputData.id,
        provider_name: inputData.provider_name,
        domain_name: inputData.domain_name,
        end_point: inputData.end_point,
        api_key: inputData.api_key,
        username: inputData.username,
        password: inputData.password,
        report_end_point: inputData.report_end_point,
        balance_end_point: inputData.balance_end_point,
        update_record_id: inputData.update_record_id,
        sms_type: inputData.sms_type,
        remarks: inputData.remarks,
        status: inputData.status,
        operation: 'update',
        save_type: 'update',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
/*
new bank info dialog
start from here
*/
@Component({
  selector: 'sms-provider-dialog',
  templateUrl: './sms-provider-dialog.html',
  styles: ['.mat-form-field-appearance-outline .mat-form-field-label {top: 1.84375em !important;}']
})

export class SmsProviderDialog {
  submitButtonEnable = false;
  type = this.data.operation;


  constructor(public dialogRef: MatDialogRef<SmsProviderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataService,
    private common: CommonService) {
  }

  ngOnInit() {
  }


  // data submit function
  onsubmit() {
    this.submitButtonEnable = true;

    this.dataService.post(this.data, 'system/settings/smsproviderInsertData')
      .subscribe(data => {
        if (data.response === 200) {
          this.submitButtonEnable = false;
          this.common.openSnackBar(data.message, 'Close', 'submit-info');
          this.dialogRef.close();
          this.common.AClicked('component clicked');
        } else if (data.response === 400) {
          this.submitButtonEnable = false;
          this.common.openSnackBar(data.message, 'Close', 'submit-error');
        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
            // tslint:disable-next-line:semicolon
          } else {
            throw error;
          }
        });
  }
}


