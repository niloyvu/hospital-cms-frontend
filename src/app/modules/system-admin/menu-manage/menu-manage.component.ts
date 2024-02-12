
import { FlatTreeControl } from '@angular/cdk/tree';
import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { BadInput } from 'src/app/shared/core/bad-input';
import { AppError } from 'src/app/shared/core/app-error';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { LanguageService } from 'src/app/services/language.service';
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
  menu_visibility: any;
  component_layer: any;
  file_path: any;
  shiftFromValue: any;
  shiftFrom: any;
  shiftTo: any;
  shiftFromId: any;
  shiftToId: any;
}
interface FoodNode {
  id: string;
  component_name: string;
  children?: FoodNode[];
  parent_id: number;
  sort_order: number;
  icon: string;
  status: any;
  path: string;
  is_notify: string;
  note: any;
  is_component: any;
  component_layer: any;
  menu_visibility: any;
  component: string;
  file_path: string;
  comments: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  id: string;
  component_name: string;
  level: number;
  parent_id: number;
  sort_order: number;
  icon: string;
  status: any;
  path: string;
  is_notify: string;
  note: any;
  is_component: any;
  menu_visibility: any;
  component_layer: any;
  component: string;
  file_path: string;
  comments: string;
}


@Component({
  selector: 'app-menu-manage',
  templateUrl: './menu-manage.component.html',
  styleUrls: ['./menu-manage.component.scss']
})
export class MenuManageComponent implements OnInit {

  shiftFrom = [];
  shiftTo = [];
  shiftFromValue: any;
  shiftToValue: any;

  collection = [];
  notFoundMessage: any;
  totalItem = 0;
  showTree = true;
  access = 0;
  access1 = 0;
  access2 = 0;
  activeLan = '';

  nzOptions = [];
  values: string[] | null = null;

  constructor(
    private dataService: DataService,
    private common: CommonService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.list_data();
    this.common.aClickedEvent.subscribe((data: string) => {
      this.list_data();
    });
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      id: node.id,
      component_name: node.component_name,
      parent_id: node.parent_id,
      sort_order: node.sort_order,
      level: level,
      icon: node.icon,
      status: node.status,
      path: node.path,
      note: node.note,
      is_notify: node.is_notify,
      is_component: node.is_component,
      menu_visibility: node.menu_visibility,
      component_layer: node.component_layer,
      file_path: node.file_path,
      component: node.component,
      comments: node.comments
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  list_data() {
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
          this.collection = data.data.components;
          this.shiftFrom = this.collection;
          this.shiftFrom.forEach((element: any) => {
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
          this.shiftTo = this.collection;
          this.shiftTo.forEach((element: any) => {
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
          this.dataSource.data = this.collection;
        } else {
          this.collection = [];
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


  openCreateModelGroup() {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '700px',
      data: {
        id: '',
        shiftFrom: this.shiftFrom,
        component_name: '',
        component_layer: 1,
        icon: '',
        path: '',
        sort_order: '',
        note: '',
        is_notify: '',
        menu_visibility: '',
        comments: '',
        component: '',
        parent_id: 0,
        status: true,
        save_type: 'Create',
        file_path: '',
        is_component: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openEditModelGroup(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: node.id,
        component_name: node.component_name,
        component_layer: node.component_layer,
        icon: node.icon,
        path: node.path,
        sort_order: node.sort_order,
        note: node.note,
        is_notify: node.is_notify,
        menu_visibility: node.menu_visibility,
        comments: node.comments,
        component: node.component,
        parent_id: 0,
        status: node.status == 1 ? true : false,
        save_type: 'Edit',
        file_path: node.file_path,
        is_component: node.is_component
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCreateModelComponent(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: '',
        component_name: '',
        component_layer: 2,
        icon: '',
        path: '',
        sort_order: '',
        note: '',
        is_notify: '',
        menu_visibility: '',
        comments: '',
        component: '',
        parent_id: node.id,
        status: true,
        save_type: 'Create',
        file_path: '',
        is_component: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openEditModelComponent(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: node.id,
        component_name: node.component_name,
        component_layer: node.component_layer,
        icon: node.icon,
        path: node.path,
        sort_order: node.sort_order,
        note: node.note,
        is_notify: node.is_notify,
        menu_visibility: node.menu_visibility,
        comments: node.comments,
        component: node.component,
        parent_id: node.parent_id,
        status: node.status == 1 ? true : false,
        save_type: 'Edit',
        file_path: node.file_path,
        is_component: node.is_component
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCreateModelChild(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: '',
        component_name: '',
        component_layer: 3,
        icon: '',
        path: '',
        sort_order: '',
        note: '',
        is_notify: '',
        menu_visibility: '',
        comments: '',
        component: '',
        parent_id: node.id,
        status: true,
        save_type: 'Create',
        file_path: '',
        is_component: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openEditModelChild(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: node.id,
        component_name: node.component_name,
        component_layer: node.component_layer,
        icon: node.icon,
        path: node.path,
        sort_order: node.sort_order,
        note: node.note,
        is_notify: node.is_notify,
        menu_visibility: node.menu_visibility,
        comments: node.comments,
        component: node.component,
        parent_id: node.parent_id,
        status: node.status == 1 ? true : false,
        save_type: 'Edit',
        file_path: node.file_path,
        is_component: node.is_component
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCreateModelSubChild(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: '',
        component_name: '',
        component_layer: 4,
        icon: '',
        path: '',
        sort_order: '',
        note: '',
        is_notify: '',
        menu_visibility: '',
        comments: '',
        component: '',
        parent_id: node.id,
        status: node.status == 1 ? true : false,
        save_type: 'Create',
        file_path: '',
        is_component: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openEditModelSubChild(node: any) {
    const dialogRef = this.dialog.open(CreateMenuManagerAddEditModel, {
      width: '600px',
      data: {
        id: node.id,
        component_name: node.component_name,
        component_layer: node.component_layer,
        icon: node.icon,
        path: node.path,
        sort_order: node.sort_order,
        note: node.note,
        is_notify: node.is_notify,
        menu_visibility: node.menu_visibility,
        comments: node.comments,
        component: node.component,
        parent_id: node.parent_id,
        status: node.status == 1 ? true : false,
        save_type: 'Edit',
        file_path: node.file_path,
        is_component: node.is_component
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

@Component({
  selector: 'app-menu-manage-create-model',
  templateUrl: './create-menu-manager-add-edit-model.html',
  styleUrls: ['./menu-manage.component.scss'],
  styles: ['.mat-form-field-appearance-outline .mat-form-field-label {top: 1.84375em !important;}']
})
export class CreateMenuManagerAddEditModel {
  basicFileUpload!: File;
  submitButtonEnable = false;
  baseUrl = '';
  tempLangs = this.translate.getLangs();
  languages: any = [];
  languagePrevData: any = [];
  shiftFromValue: any;
  shiftToValue: any;
  constructor(public dialogRef: MatDialogRef<CreateMenuManagerAddEditModel>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    public common: CommonService, 
    public _languageService: LanguageService, 
    public translate: TranslateService
    ) {
    this.initialData();
  }

  onChanges(values: any): void {

  }

  initialData() {

    if (this.data.id) {
      const postData = {
        'component_id': this.data.id
      };
      this.dataService.post(postData, 'system/menu/get-previous-data-menu')
        .subscribe(data => {
          this.common.onBufferEvent.emit(false);
          if (data.code == 200) {
            this.languagePrevData = data.data.languages;
            if (this.languagePrevData.length > 0) {
              this.languagePrevData.forEach((element: any) => {
                const item: any = {
                  name: element.title,
                  code: element.locale,
                  note: element.note
                };
                this.languages.push(item);
              });
            }
            else {
              this.tempLangs.forEach((element: any) => {
                const item = {
                  name: '',
                  note: '',
                  code: element
                };
                this.languages.push(item);
              });
            }
          } else {
            this.tempLangs.forEach((element: any) => {
              const item = {
                name: '',
                note: '',
                code: element
              };
              this.languages.push(item);
            });
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
    else {
      this.tempLangs.forEach((element: any) => {
        const item: any = {
          name: '',
          note: '',
          code: element
        };
        this.languages.push(item);
      });
    }
  }

  changeStatus(e: any) {
    if (e == true) {
      this.data.status = true;
    } else {
      this.data.status = false;
    }
  }

  fileUploads(event: any) {
    const pre = this;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        pre.basicFileUpload = e.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onClickSubmit() {
    this.common.onBufferEvent.emit(true);
    this.submitButtonEnable = true;
    const postData = {
      'id': this.data.id,
      'component_name': this.data.component_name,
      'sort_order': this.data.sort_order,
      'icon': this.data.icon,
      'path': this.data.path,
      'status': this.data.status,
      'comments': this.data.comments,
      'component': this.data.component,
      'save_type': this.data.save_type,
      'note': this.data.note,
      'is_notify': this.data.is_notify,
      'menu_visibility': this.data.menu_visibility,
      'component_layer': this.data.component_layer,
      'is_component': this.data.is_component,
      'parent_id': this.data.parent_id,
      'languages': this.languages
    };
    this.dataService.post(postData, 'system/menu/post')
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
