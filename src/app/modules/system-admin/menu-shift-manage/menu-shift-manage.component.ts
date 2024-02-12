
import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AppError } from 'src/app/shared/core/app-error';
import { BadInput } from 'src/app/shared/core/bad-input';
import { LanguageService } from 'src/app/services/language.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
  id: number;
  status: any;
  save_type: string;
  parent_id: number;
  component_name: string;
  list_level: any;
  sort_order: string;
  icon: string;
  path: string;
  comments: string;
  component: string;
  is_notify: string;
  note: any;
  is_component: any;
  component_layer: any;
  file_path: any;
  shiftFromValue: any;
  shiftFrom: any;
  shiftTo: any;
  shiftFromId: any;
  shiftToId: any;
}
@Component({
  selector: 'app-menu-shift-manage',
  templateUrl: './menu-shift-manage.component.html',
  styleUrls: ['./menu-shift-manage.component.scss']
})
export class MenuShiftManageComponent implements OnInit {

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


  menucollection: any = [];
  shiftFrom: any = [];
  shiftTo: any = [];
  shiftFromValue: any;
  shiftToValue: any;

  activeLan = '';
  notFoundMessage: any
  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    public common: CommonService
  ) { }

  ngOnInit(): void {
    this.allInitialData();
    this.menu_data();
    this.common.aClickedEvent.subscribe((data: string) => {
      this.menu_data();
      this.allInitialData();
    });
  }


  menu_data() {
    const getLan = localStorage.getItem("active_lang");
    if (getLan) {
      this.activeLan = getLan;
    }
    else {
      this.activeLan = 'en';
    }
    this.common.onBufferEvent.emit(true);
    this.notFoundMessage = '';
    const queryString = "?active_language=" + this.activeLan + "";
    this.dataService.getJson('system/menu/get', queryString)
      .subscribe(data => {
        this.common.onBufferEvent.emit(false);
        if (data.code == 200) {
          this.menucollection = data.data.components;
          this.shiftFrom = this.menucollection;
          this.shiftTo = this.menucollection;
          this.updateShiftFrom(this.shiftFrom);
          this.updateShiftTo(this.shiftTo);

        } else {
          this.menucollection = [];
        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );
  }


  updateShiftFrom(menuListFrom: any) {            // update label and value for cascade 
    menuListFrom.forEach((element: any) => {
      element.label = element.component_name;
      element.value = element.id;
      if (element.children.length > 0) {
        element.children.forEach((child: any) => {
          child.label = child.component_name;
          child.value = child.id;
          if (child.children.length > 0) {
            child.children.forEach((child2: any) => {
              child2.label = child2.component_name;
              child2.value = child2.id;
              if (child2.children.length > 0) {
                child2.children.forEach((child3: any) => {
                  child3.label = child3.component_name;
                  child3.value = child3.id;
                  if (child3.is_component === 1) {
                    child3.isLeaf = true;
                  }
                });
              } else {
                if (child2.is_component === 1) {
                  child2.isLeaf = true;
                }
              }
            });
          } else {
            if (child.is_component === 1) {
              child.isLeaf = true;
            }
          }
        });
      } else {
        if (element.is_component === 1) {
          element.isLeaf = true;
        }
      }
    });



  }
  updateShiftTo(menuListTo: any) {
    menuListTo.forEach((element: any) => {
      element.label = element.component_name;
      element.value = element.id;
      if (element.children.length > 0) {
        element.children.forEach((child: any) => {
          child.label = child.component_name;
          child.value = child.id;
          if (child.children.length > 0) {
            child.children.forEach((child2: any) => {
              child2.label = child2.component_name;
              child2.value = child2.id;
              if (child2.children.length > 0) {
                child2.children.forEach((child3: any) => {
                  child3.label = child3.component_name;
                  child3.value = child3.id;
                  if (child3.is_component === 1) {
                    child3.isLeaf = true;
                  }
                });
              } else {
                if (child2.is_component === 1) {
                  child2.isLeaf = true;
                }
              }
            });
          } else {
            if (child.is_component === 1) {
              child.isLeaf = true;
            }
          }
        });
      } else {
        if (element.is_component === 1) {
          element.isLeaf = true;
        }
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
    this.dataService.post(postData, 'system/menu-shift/getData')
      .subscribe(data => {
        if (data.response === 200) {

          this.list = data.data;
          this.totalitem = data.totalitem;
        } else {
          this.list = data.data;
          this.totalitem = data.totalitem;
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
  openMenuShiftModal() {
    const dialogRef = this.dialog.open(MenuShiftModal, {
      width: '700px',
      data: {
        id: '',
        shiftFrom: this.shiftFrom,
        shiftTo: this.shiftTo,
        shiftFromId: '',
        shiftToId: '',
        note: '',
        comments: '',
        status: 1,
        save_type: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditMenuShiftModal(node: any) {

    const dialogRef = this.dialog.open(MenuShiftModal, {
      width: '700px',
      data: {
        id: node.id,
        shiftFrom: this.shiftFrom,
        shiftTo: this.shiftTo,
        shiftFromId: JSON.parse(node.shiftFromData),
        shiftToId: JSON.parse(node.shiftToData),
        note: node.description,
        status: node.status,
        save_type: 'update'
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
  selector: 'menu-manager-shift-model',
  templateUrl: './menu-manager-shift-model.html',
  styleUrls: ['./menu-shift-manage.component.scss'],
  styles: ['.mat-form-field-appearance-outline .mat-form-field-label {top: 1.84375em !important;}']
})
export class MenuShiftModal {
  basicFileUpload!: File;
  submitButtonEnable = false;
  baseUrl = '';
  tempLangs = this.translate.getLangs();
  languages = [];
  languagePrevData = [];
  shiftFromValue: any;
  shiftToValue: any;
  constructor(public dialogRef: MatDialogRef<MenuShiftModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    public common: CommonService, public _languageService: LanguageService, public translate: TranslateService) {

  }

  onShiftFromChanges(values: any): void {

  }
  onShifToChanges(values: any): void {
  }


  onClickSubmit() {
    this.common.onBufferEvent.emit(true);
    this.submitButtonEnable = true;
    let FromId = this.data.shiftFromId.slice(-1);
    let ToId = this.data.shiftToId.slice(-1);
    const postData = {
      'id': this.data.id,
      'shiftFromId': FromId,
      'shiftFromArray': this.data.shiftFromId,
      'shiftToId': ToId,
      'shiftToArray': this.data.shiftToId,
      'status': this.data.status,
      'save_type': this.data.save_type,
      'note': this.data.note,
    };
    this.dataService.post(postData, 'system/menu-shift/insertData')
      .subscribe(data => {
        this.common.onBufferEvent.emit(false);
        if (data.code === 200) {
          this.submitButtonEnable = false;
          this.dialogRef.close();
          this.common.openSnackBar(data.message, 'Close', 'submit-success');
          this.common.AClicked('component clicked');
          this.common.AClickedMenu('component clicked');
        } else if (data.code === 404) {
          this.submitButtonEnable = false;
          this.common.openSnackBar(data.message, 'Close', 'submit-warning');
        }
      },
        (error: AppError) => {
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        });
  }
}

