import { Subscription } from "rxjs";
import { Component, Inject, OnInit } from '@angular/core';
import { AppError } from 'src/app/shared/core/app-error';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
export interface DialogData {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password: string;
    country_id: number;
    country_code: string;
    phone_number: string;
    alternate_country: number;
    alternate_country_code: string;
    alternate_phone: string;
    country_list: any;
    prefix_code: string;
    prefix_name: string;
    sequrity_code: string;
    status: any;
    save_type: string;
    role_id: number;
}

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
    public collection: any[] = [];
    public country_list: any[] = [];

    public notFoundMessage: string = '';
    public totalItems: number = 0;
    public pageNumber: number = 1;
    public resultPerPage: number = 10;
    public columnsSortBy: string = 'id';
    public searchValues: string = '';
    public dataOrderBy: boolean = true;
    public clickCount: number = 0;
    randCode = Math.floor((Math.random() * 1000000) + 1);

    updated_collection: any[] = [];
    updated_totalItems: number = 0;
    updated_PageNumber: number = 1;
    updated_ResultPerPage: number = 10;
    updated_ColumnsSortBy: string = 'id';
    updated_SearchValues: string = '';
    updated_DataOrderBy: boolean = true;

    private items$: Subscription = new Subscription();
    private countries$: Subscription = new Subscription();
    private updated_collection$: Subscription = new Subscription();

    constructor(private dataService: DataService,
        private common: CommonService,
        public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getUserList();
        this.getUpdatedUserList();
        this.common.aClickedEvent.subscribe((data: string) => {
            this.getUserList();
            this.getUpdatedUserList();
        });
    }

    isAccess(type: any) {
        // permissions: {create: 1, edit: 1, update: 1, delete: 1}
        return this.common.checkPermissionAccess('CreateUserComponent', type)
    }

    ngOnDestroy(): void {
        this.items$.unsubscribe();
        this.countries$.unsubscribe();
        this.updated_collection$.unsubscribe();
    }

    getSl(i: number) {
        return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
    }

    changeResultPerPage(event: number) {
        this.pageNumber = 1;
        this.resultPerPage = event;
        this.getUserList();
    }

    pageChange(newPage: number) {
        this.pageNumber = newPage;
        this.getUserList();
    }

    searchByData(value: string) {
        this.searchValues = value;
        this.pageNumber = 1;
        this.resultPerPage = 10;
        this.dataOrderBy = true;
        this.getUserList();
    }

    sortBy(column: string) {
        if (this.columnsSortBy === column) {
            this.dataOrderBy = !this.dataOrderBy;
        } else {
            this.columnsSortBy = column;
        }
        this.getUserList();
    }

    getUserList() {
        this.common.onBufferEvent.emit(true);
        let orderBy: string;
        if (this.dataOrderBy === true) {
            orderBy = 'DESC';
        } else {
            orderBy = 'ASC';
        }

        const queryString = "?"
            + "search=" + this.searchValues
            + "&sort_column=" + this.columnsSortBy
            + "&sort_by=" + orderBy
            + "&per_page=" + this.resultPerPage
            + "&page=" + this.pageNumber;
        this.items$ = this.dataService.getJson('system/user/get', queryString)
            .subscribe({
                next: ({ data, code }) => {
                    this.common.onBufferEvent.emit(false);
                    if (code == 200) {
                        this.collection = data.users.data;
                        this.totalItems = data.users.total;
                    } else {
                        this.collection = [];
                        this.totalItems = 0;
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            });

        this.countries$ = this.dataService.getJson('country/active/all', '')
            .subscribe({
                next: (response) => {
                    this.common.onBufferEvent.emit(false);
                    if (response.code == 200) {
                        this.country_list = response.data.countries;
                    } else {
                        this.country_list = [];
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    updatedGetSl(i: number) {
        return (Number(this.updated_ResultPerPage) * (Number(this.updated_PageNumber) - 1)) + i
    }

    updatedChangeResultPerPage(event: number) {
        this.updated_PageNumber = 1;
        this.updated_ResultPerPage = event;
        this.getUpdatedUserList();
    }

    updatedSearchByData(value: string) {
        this.updated_SearchValues = value;
        this.updated_PageNumber = 1;
        this.updated_ResultPerPage = 10;
        this.updated_DataOrderBy = true;
        this.getUpdatedUserList();
    }

    updatedSortBy(column: string) {
        if (this.updated_ColumnsSortBy === column) {
            this.updated_DataOrderBy = !this.updated_DataOrderBy;
        } else {
            this.updated_ColumnsSortBy = column;
        }
        this.getUpdatedUserList()
    }

    updatedPageChange(page: number) {
        this.updated_PageNumber = page;
        this.getUpdatedUserList()
    }


    public getUpdatedUserList() {
        let orderBy: string;
        if (this.updated_DataOrderBy === true) {
            orderBy = 'DESC';
        } else {
            orderBy = 'ASC';
        }
        const queryString = '?'
            + 'search=' + this.updated_SearchValues
            + '&sort_column=' + this.updated_ColumnsSortBy
            + '&sort_by=' + orderBy
            + '&per_page=' + this.updated_ResultPerPage
            + '&page=' + this.updated_PageNumber;
        this.getUpdatedData(queryString);
    }

    getUpdatedData(queryString: string) {
        this.common.onBufferEvent.emit(true);
        this.updated_collection$ = this.dataService.getJson('system/user/updated-list', queryString)
            .subscribe({
                next: ({ data, code }) => {
                    this.common.onBufferEvent.emit(false);
                    if (code == 200) {
                        this.updated_collection = data.activity_logs.data;
                        this.updated_totalItems = data.activity_logs.total;
                    } else {
                        this.updated_collection = [];
                        this.updated_totalItems = 0;
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }


    createUserDialog() {
        this.clickCount = Number(this.clickCount) + 1;
        if (this.clickCount < 2) {
            const dialogRef = this.dialog.open(CreateUserAddEditDialog, {
                width: "900px",
                data: {
                    id: null,
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    user_name: '',
                    email: '',
                    password: '',
                    country_id: 18,
                    country_code: '880',
                    phone_number: '',
                    alternate_country: 18,
                    alternate_country_code: '880',
                    alternate_phone: '',
                    country_list: this.country_list,
                    prefix_code: this.randCode,
                    prefix_name: '',
                    sequrity_code: '',
                    role_id: '',
                    status: '1',
                    save_type: 'create'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.clickCount = 0;
            });
        }
    }

    updateUserDialog(itemData: any) {
        this.clickCount = Number(this.clickCount) + 1;
        if (this.clickCount < 2) {
            const dialogRef = this.dialog.open(CreateUserAddEditDialog, {
                width: "900px",
                data: {
                    id: itemData.id,
                    first_name: itemData?.user_profile?.first_name,
                    middle_name: itemData?.user_profile?.middle_name,
                    last_name: itemData?.user_profile?.last_name,
                    email: itemData?.email,
                    password: '',
                    country_id: itemData.country_id,
                    country_code: itemData.phone_country.phone_code,
                    phone_number: itemData.phone_number,
                    alternate_country: itemData.alternate_country,
                    alternate_country_code: itemData.alternate_country ? itemData.alt_phone_country.phone_code : '',
                    alternate_phone: itemData.alternate_phone,
                    country_list: this.country_list,
                    user_name: itemData.user_name,
                    prefix_code: itemData.prefix_code,
                    prefix_name: itemData.prefix_name,
                    sequrity_code: itemData.sequrity_code,
                    role_id: itemData.role_id,
                    status: itemData.status,
                    save_type: 'update'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.clickCount = 0;
            });
        }
    }

    viewUserInfoDialog(userData: any) {
        let inputValue = userData.properties;
        this.clickCount = Number(this.clickCount) + 1;
        if (this.clickCount < 2) {
            const dialogRef = this.dialog.open(CreateUserAddEditDialog, {
                width: "900px",
                data: {
                    password: '',
                    id: inputValue.id,
                    country_list: this.country_list,
                    email: inputValue.email ? inputValue.email : '',
                    first_name: inputValue.profile_info ? inputValue.profile_info.first_name : '',
                    middle_name: inputValue.profile_info ? inputValue.profile_info.middle_name : '',
                    last_name: inputValue.profile_info ? inputValue.profile_info.last_name : '',
                    country_id: inputValue.country_id ? inputValue.country_id : '',
                    phone_number: inputValue.phone_number ? inputValue.phone_number : '',
                    alternate_country: inputValue.alternate_country ? inputValue.alternate_country : '',
                    alternate_phone: inputValue.alternate_phone ? inputValue.alternate_phone : '',
                    user_name: inputValue.user_name ? inputValue.user_name : '',
                    prefix_code: inputValue.prefix_code ? inputValue.prefix_code : '',
                    prefix_name: inputValue.prefix_name ? inputValue.prefix_name : '',
                    sequrity_code: inputValue.sequrity_code ? inputValue.sequrity_code : '',
                    role_id: inputValue.role_id ? inputValue.role_id : '',
                    status: inputValue.status,
                    save_type: 'view'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.clickCount = 0;
            });
        }
    }

}

@Component({
    selector: 'app-create-user-dialog',
    templateUrl: './create-user-add-edit.html',
    styleUrls: ['./create-user.component.scss']
})
export class CreateUserAddEditDialog {
    public type: string = this.data.save_type;
    public submitButton: boolean = false;
    public role_collection: any[] = [];

    constructor(public dialogRef: MatDialogRef<CreateUserAddEditDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        public common: CommonService) {
        this.getRoles();
        if (this.type == 'view') {
            if (this.data.country_id) {
                this.countryWisePhoneCode(this.data.country_id)
            }
            if (this.data.alternate_country) {
                this.countryWiseAltPhoneCode(this.data.alternate_country)
            }

        }
    }

    getRoles() {
        const queryStringRole = '';
        this.dataService.getJson('system/role/get/active/all', queryStringRole)
            .subscribe({
                next: ({ data, code }) => {
                    if (code == 200) {
                        this.role_collection = data.roles;
                    } else {
                        this.role_collection = [];
                    }
                },
                error: (error: AppError) => {
                    console.log(error);
                }
            });
    }

    countryWisePhoneCode(event: number) {
        const countryCode = this.data.country_list.find((e: any) => e.id === event);
        this.data.country_code = (countryCode.phone_code);
    }

    countryWiseAltPhoneCode(event: number) {
        const countryCode = this.data.country_list.find((e: any) => e.id === event);
        this.data.alternate_country_code = (countryCode.phone_code);
    }

    onsubmit() {
        this.common.onBufferEvent.emit(true);
        this.submitButton = true;
        const postData = {
            'id': this.data.id,
            'first_name': this.data.first_name,
            'middle_name': this.data.middle_name,
            'last_name': this.data.last_name,
            'email': this.data.email,
            'password': this.data.password,
            'country_id': this.data.country_id,
            'country_code': this.data.country_code,
            'phone_number': this.data.phone_number,
            'alternate_country': this.data.alternate_country,
            'alternate_country_code': this.data.alternate_country_code,
            'alternate_phone': this.data.alternate_phone,
            'prefix_code': this.data.prefix_code,
            'prefix_name': this.data.prefix_name,
            'sequrity_code': this.data.sequrity_code,
            'role_id': this.data.role_id,
            'status': this.data.status,
            'save_type': this.type,
            'user_name': this.data.user_name
        };

        if (this.type == 'create') {
            this.dataService.post(postData, 'system/user/post')
                .subscribe({
                    next: (response) => {
                        this.common.onBufferEvent.emit(false);
                        if (response.code === 200) {
                            this.submitButton = false;
                            this.dialogRef.close();
                            this.common.openSnackBar(response.message, 'Close', 'submit-success');
                            this.common.AClicked('component clicked');
                        } else if (response.code === 404) {
                            this.submitButton = false;
                            this.common.openSnackBar(response.message, 'Close', 'submit-warning');
                        }
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });

        } else if (this.type == 'update') {
            this.dataService.post(postData, 'system/user/update')
                .subscribe({
                    next: (response) => {
                        this.common.onBufferEvent.emit(false);
                        if (response.code === 200) {
                            this.submitButton = false;
                            this.dialogRef.close();
                            this.common.openSnackBar(response.message, 'Close', 'submit-success');
                            this.common.AClicked('component clicked');
                        } else if (response.code === 404) {
                            this.submitButton = false;
                            this.common.openSnackBar(response.message, 'Close', 'submit-warning');
                        }
                    },
                    error: (error: AppError) => {
                        console.error(error);
                    }
                });
        }
    }

}

