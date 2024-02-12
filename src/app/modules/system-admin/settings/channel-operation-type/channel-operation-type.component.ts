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
  channel_id: any;
  activeChannelList: any;
  title: any;
  remarks: any;
  status: any;
  save_type: string;
}
@Component({
  selector: 'app-channel-operation-type',
  templateUrl: './channel-operation-type.component.html',
  styleUrls: ['./channel-operation-type.component.scss']
})
export class ChannelOperationTypeComponent implements OnInit {

  totalitem = 0;
  pageRequest = 1;
  itemPerPage = '15';
  errorMessage = '';
  searchValues: String = '';
  dataOrderBy = true;
  sortColumn = 'id';
  list: any = [];
  activeChannelList: any = [];

  searchValuesUP: String = '';
  pageRequestUP = 1;
  itemPerPageUP = '15';
  totalitemUpdate = 0;
  sortColumnUP = 'id';
  updatelist: any = [];

  constructor(
    public dialog: MatDialog,
    public common: CommonService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.allInitialData();
    this.allChannelData();
    this.allInitialUpdatedData();
    this.common.aClickedEvent.subscribe((data: string) => {
      this.allInitialData();
      this.allChannelData();
      this.allInitialUpdatedData();
    });
  }

  allChannelData() {
    const postData = {
      'search': 'test'
    };
    this.dataService.post(postData, 'system/settings/channelOpType')
      .subscribe(data => {
        if (data.response === 200) {

          this.activeChannelList = data.data;

        } else {
          this.activeChannelList = data.data;

        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        });
  }


  changedPageItem(event: any) {
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
    this.dataService.post(postData, 'system/settings/channelOpTypeList')
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
    this.dataService.post(postData, 'system/settings/channelOpTypeListUpdateData')
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
    const dialogRef = this.dialog.open(CreateChannelTypeDialog, {
      width: '60%',
      data: {
        id: '',
        channel_id: '',
        activeChannelList: this.activeChannelList,
        title: '',
        remarks: '',
        status: '',
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
    const dialogRef = this.dialog.open(CreateChannelTypeDialog, {
      width: '60%',
      data: {
        id: inputData.id,
        channel_id: inputData.channel_id,
        activeChannelList: this.activeChannelList,
        title: inputData.title,
        remarks: inputData.remarks,
        status: inputData.status,
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
  selector: 'channel-type-dialog',
  templateUrl: './channel-type-dialog.html',
  styles: ['.mat-form-field-appearance-outline .mat-form-field-label {top: 1.84375em !important;}']
})

export class CreateChannelTypeDialog {
  submitButtonEnable = false;
  type = this.data.save_type;


  constructor(public dialogRef: MatDialogRef<CreateChannelTypeDialog>,
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

    this.dataService.post(this.data, 'system/settings/channelOpTypeInsertData')
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


