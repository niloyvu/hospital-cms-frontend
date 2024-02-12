import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
    id: any;
    user_id: any;
    user_list: any;
    name: string;
    company_id: any;
    companyList: any;
    control_panel_id: any;
    control_panel_list: any;
    permission_type: any;
    role_id: any;
    addMore_companies_list: any;
    status: any;
    type: any;
}

@Component({
    selector: 'app-role-assign',
    templateUrl: './role-assign.component.html',
    styleUrls: ['./role-assign.component.scss']
})
export class RoleAssignComponent implements OnInit {
    access = 0;
    companyList = [];
    userList = [];
    controlPanelList = [];
    pagereqest = 1;
    itemPerPage = '15';
    totalitem: any = 0;
    itemSearch: any = '';
    usercollection: any = [];
    rolesUpdateCollection: any = [];

    constructor(
        public dialog: MatDialog,
        private common: CommonService,
        private dataService: DataService,
    ) { }

    ngOnInit(): void {
        this.allrelatedData()
        this.all_initialData();
        this.common.aClickedEvent.subscribe((data: string) => {
            this.all_initialData();
            this.allrelatedData()
        });
    }

    all_initialData() {
        const postData = {
            'rowPerPage': this.itemPerPage,
            'pageRequest': this.pagereqest,
            'search': this.itemSearch,
        }
        this.allUser(postData);
    }

    allUser(postData: any) {
        this.dataService.postJson(postData, 'usermanagment/all')
            .subscribe(data => {
                this.usercollection = data.list;
                this.totalitem = data.totalitem;
            });
    }

    getSL(i: any) {
        return (Number(this.itemPerPage) * (Number(this.pagereqest) - 1)) + i
    }

    changedPageItem(sevent: any) {
        this.pagereqest = 1;
        this.itemPerPage = sevent;
        this.all_initialData();
    }

    pageChange(newPage: number) {
        this.pagereqest = newPage;
        this.all_initialData();
    }

    itemSearchChange(value: any) {
        this.itemSearch = value;
        this.pagereqest = 1;
        this.itemPerPage = '10';
        this.all_initialData();
    }

    allrelatedData() {
        const postdatet = {}
        this.dataService.postJson(postdatet, 'usermanagment/companies')
            .subscribe(data => {
                this.companyList = data.list;
                this.userList = data.users;
                this.controlPanelList = data.panels;
            });
    }

    openDialog() {
        const dialogRef = this.dialog.open(RoleAssignDialog, {
            width: '700px',
            data: {
                id: '',
                user_id: '',
                user_list: this.userList,
                control_panel_id: '',
                addMore_companies_list: [{
                    id: '',
                    company_id: '',
                    permissiontype: '',
                    role_id: null,
                    status: true,
                }],
                companyList: this.companyList,
                control_panel_list: this.controlPanelList,
                type: 'create'
            }
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    EditDialog(user: any) {
        this.rolesUpdateCollection = [];
        if (user.roles) {
            user.roles.forEach((e: any) => {
                const item = {
                    'id': e.id,
                    'company_id': e.company_id,
                    'permissiontype': e.permissiontype,
                    'role_id': e.role_id,
                    'status': e.status == '1'
                }
                this.rolesUpdateCollection.push(item)
            })
        }
        const dialogRef = this.dialog.open(RoleAssignDialog, {
            width: '700px',
            data: {
                id: user.id,
                user_id: user.user_id,
                name: user.first_name + ' ' + user.middle_name + ' ' + user.last_name,
                user_list: this.userList,
                control_panel_id: user.control_panel_id,
                control_panel_list: this.controlPanelList,
                addMore_companies_list: this.rolesUpdateCollection,
                companyList: this.companyList,
                type: 'update'
            }
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

}


@Component({
    selector: 'app-role-assign-dialog',
    templateUrl: 'role-assign-dialog.html',
    styleUrls: ['./role-assign.component.scss']
})
export class RoleAssignDialog {
    type = this.data.type;
    form: any;
    roleList: any = [];
    public isSubmit!: boolean;
    companyCollection: any = [];

    constructor(public dialogRef: MatDialogRef<RoleAssignDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder, public dialog: MatDialog,
        private dataService: DataService,
        public common: CommonService) {
        if (this.data.type == 'update') {
            this.data.addMore_companies_list.forEach((e: any, i: any) => {
                this.companyWiseRole(i)
            })
        }

    }

    changeStatus(e: any, i: any) {
        this.data.addMore_companies_list[i].status = true;
    }

    companyWiseRole(i: any, clear = '') {
        if (clear) {
            this.data.addMore_companies_list[i].role_id = '';
        }

        const postdatet = {
            'company_id': this.data.addMore_companies_list[i].company_id
        }
        this.dataService.postJson(postdatet, 'usermanagment/findByCompanyId')
            .subscribe(data => {
                this.roleList = data.list;
            });
    }

    addMoreCompanyAssign() {
        const arr = {
            id: null,
            company_id: '',
            control_panel_id: '',
            permissiontype: '',
            role_id: null,
            status: true,
        }
        this.data.addMore_companies_list.push(arr)
    }

    removeAddmoreRow(rowData: any) {
        const index: number = this.data.addMore_companies_list.indexOf(rowData);
        if (index !== -1) {
            this.data.addMore_companies_list.splice(index, 1);
        }
    }


    // data save function
    onClickSubmit() {
        this.isSubmit = true;
        const postdatet = {
            'id': this.data.id,
            'user_id': this.data.user_id,
            'control_panel_id': this.data.control_panel_id,
            'assign_companies': this.data.addMore_companies_list,
            'operation': this.data.type,
        };
        this.dataService.postJson(postdatet, 'usermanagment/create_assign_company')
            .subscribe(res => {
                if (res.response == 400) {
                    this.isSubmit = false;
                    this.common.openSnackBar('Warning', res.message, 'warning');
                } else {
                    this.isSubmit = false;
                    this.dialogRef.close();
                    this.common.AClicked("componenet clicked");
                    this.common.openSnackBar('Success', res.message, 'success');
                }
            });
    }

}

