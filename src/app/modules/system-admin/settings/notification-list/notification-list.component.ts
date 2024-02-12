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
  component_id: number;
  channel_id: number;
  op_type_code: number;
  component_name: string;
  remarks: any;
  status: any;
  activeChannelList: any;
  channel_op_type: any;
  optionList: any;
  save_type: string;
}
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

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
  activeChannelList: any = [];
  channel_op_type: any = [];
  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    public common: CommonService
  ) { }

  ngOnInit(): void {
    this.allChannelData();
    this.allInitialData();
    this.allInitialUpdatedData();
    this.common.aClickedEvent.subscribe((data: string) => {
      this.allInitialData();
      this.allInitialUpdatedData();
    });
  }

  allChannelData() {
    const postData = {
      'search': 'test'
    };
    this.dataService.post(postData, 'system/settings/componentList-and-others')
      .subscribe(data => {
        if (data.response === 200) {
          this.activeChannelList = data.data.channel_list;
          this.channel_op_type = data.data.channel_op_type;
        } else {
          this.activeChannelList = data.data;

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
    this.dataService.post(postData, 'system/settings/notification-list')
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
    this.dataService.post(postData, 'system/settings/notify-Update-list')
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
  Edit Info function
  */
  EditDialog(inputData: any) {
    const dialogRef = this.dialog.open(CreateNotificationDialog, {
      width: '50%',
      data: {
        activeChannelList: this.activeChannelList,
        optionList: inputData.notification_option_list,
        channel_id: '',
        channel_op_type: this.channel_op_type,
        op_type_code: '',
        id: inputData.id,
        component_name: inputData.title,
        remarks: inputData.notification_list ? inputData.notification_list.remarks : '',
        status: inputData.status ? inputData.status : '1',
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
  selector: 'notification-list-dialog',
  templateUrl: './notification-list-dialog.html',
  styles: ['.mat-form-field-appearance-outline .mat-form-field-label {top: 1.84375em !important;}']
})

export class CreateNotificationDialog {
  submitButtonEnable = false;
  type: any = this.data.save_type;
  optionList: any = [];

  constructor(public dialogRef: MatDialogRef<CreateNotificationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dataService: DataService,
    private common: CommonService) {

    this.data.optionList.forEach((element: any) => {
      const newRow = {
        'channel_id': element.channel_id,
        'op_type_code': element.op_type_code,
        'text': element.text,
        'opt_status': element.status
      }
      this.optionList.push(newRow);
    });


  }

  addRow() {
    const row = {
      'channel_id': '',
      'op_type_code': '',
      'text': '',
      'opt_status': '1',
    }
    this.optionList.push(row);
  }
  delete_row(option: any) {
    const index: number = this.optionList.indexOf(option);
    if (index !== -1) {
      this.optionList.splice(index, 1);
    }
  }

  // data submit function
  onsubmit() {
    // this.submitButtonEnable = true;
    const posts = {
      'component_id': this.data.id,
      'optionList': this.optionList,
      'remarks': this.data.remarks,
      'status': this.data.status,
      'save_type': this.data.save_type
    }
    this.dataService.post(posts, 'system/settings/notification-insert-update')
      .subscribe(data => {
        if (data.response === 200) {
          // this.submitButtonEnable = false;
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

