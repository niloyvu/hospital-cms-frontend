import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { AppError } from 'src/app/shared/core/app-error';
import { BadInput } from 'src/app/shared/core/bad-input';

@Component({
    selector: 'app-role-management',
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
    collection: any = [];
    pageRequest = 1;
    itemPerPage = '10';
    totalItem = 0;
    itemSearch: String = '';
    dataOrderBy = true;
    sortColumn = 'id';
    emptyData = 0;

    collection_update: any = [];
    pageRequestUpdate = 1;
    itemPerPageUpdate = '10';
    totalItemUpdate = 0;
    itemSearchUpdate: String = '';
    dataOrderByUpdate = true;
    sortColumnUpdate = 'id';

    constructor(
        public dialog: MatDialog,
        public common: CommonService,
        private dataService: DataService,
    ) { }

    ngOnInit(): void {
        this.getData();
        this.getUpdatedData();
        this.common.aClickedEvent.subscribe((data: string) => {
            this.getData();
            this.getUpdatedData();
        });
    }
    sort(column: string) {
        if (this.sortColumn = column) {
            this.dataOrderBy = !this.dataOrderBy;
        } else {
            this.sortColumn = column;
        }
        this.getData();
    }

    sortUpdate(column: string) {
        if (this.sortColumnUpdate = column) {
            this.dataOrderByUpdate = !this.dataOrderByUpdate;
        } else {
            this.sortColumnUpdate = column;
        }
        this.getUpdatedData();
    }

    getData() {
        let orderBy: string;
        if (this.dataOrderBy === true) {
            orderBy = 'DESC';
        } else {
            orderBy = 'ASC';
        }
        const queryString = "?search=" + this.itemSearch + "&sort_column=" + this.sortColumn + "&sort_by=" + orderBy + "&per_page=" + this.itemPerPage + "&page=" + this.pageRequest + "";
        this.dataService.getJson('system/role/get', queryString)
            .subscribe(data => {
                if (data.code == 200) {
                    this.collection = data.data.roles.data;
                    this.totalItem = data.data.roles.total;
                } else {
                    this.collection = [];
                    this.totalItem = 0;
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


    getUpdatedData() {
        this.common.onBufferEvent.emit(true);
        let orderByUpdate: string;
        if (this.dataOrderByUpdate === true) {
            orderByUpdate = 'DESC';
        } else {
            orderByUpdate = 'ASC';
        }
        this.sortColumnUpdate = 'id';
        const queryString = "?search=" + this.itemSearchUpdate + "&sort_column=" + this.sortColumnUpdate + "&sort_by=" + orderByUpdate + "&per_page=" + this.itemPerPageUpdate + "&page=" + this.pageRequestUpdate + "";
        this.dataService.getJson('system/role/get/activity-log', queryString)
            .subscribe(data => {
                this.common.onBufferEvent.emit(false);
                if (data.code == 200) {

                    this.collection_update = data.data.activity_logs.data;
                    this.totalItemUpdate = data.data.activity_logs.total;
                } else {
                    this.collection_update = [];
                    this.totalItemUpdate = 0;
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

    getSL(i: any) {
        return (Number(this.itemPerPage) * (Number(this.pageRequest) - 1)) + i
    }

    changedPageItem(sevent: any) {
        this.pageRequest = 1;
        this.itemPerPage = sevent;
        this.getData();
    }

    pageChange(newPage: number) {
        this.pageRequest = newPage;
        this.getData();
    }

    itemSearchChange(value: any) {
        this.itemSearch = value;
        this.getData();
    }

    getSLUpdated(i: any) {
        return (Number(this.itemPerPageUpdate) * (Number(this.pageRequestUpdate) - 1)) + i
    }

    changedPageItemUpdate(event: any) {
        this.pageRequestUpdate = 1;
        this.itemPerPageUpdate = event;
        this.getUpdatedData();
    }

    pageChangeUpdate(newPage: number) {
        this.pageRequestUpdate = newPage;
        this.getUpdatedData();
    }

    itemSearchChangeUpdate(value: any) {
        this.itemSearchUpdate = value;
        this.getUpdatedData();
    }

}


@Component({
    selector: 'app-role-create',
    templateUrl: './role-create.component.html',
    styleUrls: ['./role-management.component.scss']
})
export class RoleCreateComponent implements OnInit {
    component_collection: any = [];
    module_list: any = [];
    select_module = 'all';
    name = '';
    role_type = '';
    onsubmit = 0;
    permissionCollection: any = [];
    submitButtonEnable = false;
    activeLan = '';

    constructor(private fb: FormBuilder,
        public dialog: MatDialog,
        private dataService: DataService,
        public common: CommonService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.getModules();
        this.getComponent();
        this.common.aClickedEvent.subscribe((data: string) => {
            this.getModules();
            this.getComponent();
        });
    }

    getModules() {
        this.common.onBufferEvent.emit(false);
        const getLan = localStorage.getItem("active_lang");
        if (getLan) {
            this.activeLan = getLan;
        }
        else {
            this.activeLan = 'en';
        }
        const queryString = "?active_language=" + this.activeLan + "";
        this.dataService.getJson('system/role/system-module', queryString)
            .subscribe(data => {
                this.common.onBufferEvent.emit(false);
                if (data.code == 200) {
                    this.module_list = data.data.modules;
                } else {
                    this.module_list = [];
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

    permissionArray(event: any, id: number) {
        if (event.checked == true) {
            this.permissionCollection.push(id);
        }
        else {
            const data = this.permissionCollection.find((o: any) => o === id);
            const index: number = this.permissionCollection.indexOf(data);
            if (index !== -1) {
                this.permissionCollection.splice(index, 1);
            }
        }
    }
    getComponent() {
        if (this.select_module != '') {
            const postData = {
                'module_id': this.select_module,
                'active_language': localStorage.getItem("active_lang")
            };

            this.common.onBufferEvent.emit(true);
            this.dataService.post(postData, 'system/role/component-by-system-module')
                .subscribe(data => {
                    this.common.onBufferEvent.emit(false);
                    if (data.code == 200) {
                        this.component_collection = data.data.components;
                        this.formatComponent(this.component_collection);
                    } else {
                        this.component_collection = [];
                    }
                });
        }

    }

    formatComponent(component_collection: any) {
        component_collection.forEach((firstLayer: any, i: any) => {
            firstLayer.permissions.forEach((permission: any) => {
                permission.is_permitted = 0;
            });
            if (firstLayer.is_component == 0) {
                firstLayer.childs.forEach((secondLayer: any) => {
                    secondLayer.permissions.forEach((permission: any) => {
                        permission.is_permitted = 0;
                    });
                    if (secondLayer.is_component == 0) {
                        secondLayer.childs.forEach((thirdLayer: any) => {
                            thirdLayer.permissions.forEach((permission: any) => {
                                permission.is_permitted = 0;
                            });
                            if (thirdLayer.is_component == 0) {
                                thirdLayer.childs.forEach((fourthLayer: any) => {
                                    fourthLayer.permissions.forEach((permission: any) => {
                                        permission.is_permitted = 0;
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    create_role() {
        if (this.permissionCollection.length > 0) {
            this.common.onBufferEvent.emit(true);
            this.submitButtonEnable = true;
            const postData = {
                'name': this.name,
                'role_type': this.role_type,
                'permissions': this.permissionCollection
            };
            this.dataService.post(postData, 'system/role/post')
                .subscribe(data => {
                    this.common.onBufferEvent.emit(false);
                    if (data.code === 200) {
                        this.submitButtonEnable = false;
                        this.common.openSnackBar(data.message, 'Close', 'submit-success');
                        this.common.AClicked('component clicked');
                        this.router.navigate(['/system/user-role-manager/role-list']);
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
        else {
            this.common.openSnackBar('Permissions cannot be empty', 'Close', 'submit-warning');
        }

    }

    checkAll(e: any) {
        if (e.checked) {
            this.permissionCollection = [];
            this.component_collection.forEach((firstLayer: any, i: any) => {
                firstLayer.permissions.forEach((permission: any) => {
                    permission.is_permitted = 1;
                    this.permissionCollection.push(permission.id);
                });
                if (firstLayer.is_component == 0) {
                    firstLayer.childs.forEach((secondLayer: any) => {
                        secondLayer.permissions.forEach((permission: any) => {
                            permission.is_permitted = 1;
                            this.permissionCollection.push(permission.id);
                        });
                        if (secondLayer.is_component == 0) {
                            secondLayer.childs.forEach((thirdLayer: any) => {
                                thirdLayer.permissions.forEach((permission: any) => {
                                    permission.is_permitted = 1;
                                    this.permissionCollection.push(permission.id);
                                });
                                if (thirdLayer.is_component == 0) {
                                    thirdLayer.childs.forEach((fourthLayer: any) => {
                                        fourthLayer.permissions.forEach((permission: any) => {
                                            permission.is_permitted = 1;
                                            this.permissionCollection.push(permission.id);
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            this.permissionCollection = [];
            this.component_collection.forEach((firstLayer: any, i: any) => {
                firstLayer.permissions.forEach((permission: any) => {
                    permission.is_permitted = 0;
                });
                if (firstLayer.is_component == 0) {
                    firstLayer.childs.forEach((secondLayer: any) => {
                        secondLayer.permissions.forEach((permission: any) => {
                            permission.is_permitted = 0;
                        });
                        if (secondLayer.is_component == 0) {
                            secondLayer.childs.forEach((thirdLayer: any) => {
                                thirdLayer.permissions.forEach((permission: any) => {
                                    permission.is_permitted = 0;
                                });
                                if (thirdLayer.is_component == 0) {
                                    thirdLayer.childs.forEach((fourthLayer: any) => {
                                        fourthLayer.permissions.forEach((permission: any) => {
                                            permission.is_permitted = 0;
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

}


@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-management.component.scss']
})
export class RoleEditComponent implements OnInit {
    disabled = false;
    compcollection = [];
    rolewisecompcollection = [];
    modulelist = [];
    tokenId: any;
    role: any;
    allcompanyList = [];
    searchCompanyName = '';
    selectCompany = '';
    selectModule = '';
    searchModuleName = '';
    roleName = '';
    onsubmit = 0;
    access = 0;
    select_module = 'all';
    module_list: any = [];
    component_collection: any = [];
    permissionCollection: any = [];
    submitButtonEnable: any = false;
    assignedPermission: any = [];
    activeLan = '';
    role_type = '';

    constructor(private fb: FormBuilder,
        public dialog: MatDialog,
        private dataService: DataService,
        public common: CommonService,
        private router: Router,
        private activeroute: ActivatedRoute) {
    }


    ngOnInit(): void {
        this.getModules();
        this.getDataById();
        this.getComponent();
        this.common.aClickedEvent.subscribe((data: string) => {
            this.getModules();
            this.getDataById();
            this.getComponent();
        });
    }

    getDataById() {
        this.submitButtonEnable = true;
        const roleId = this.activeroute.snapshot.paramMap.get("id");
        const postData = {
            'id': roleId
        };
        this.dataService.post(postData, 'system/role/get-by-id')
            .subscribe(data => {
                this.common.onBufferEvent.emit(false);
                if (data.code === 200) {
                    this.submitButtonEnable = false;
                    this.roleName = data.data.role.name;
                    this.role_type = data.data.role.role_type;
                    this.permissionCollection = [];
                    data.data.role.permissions.forEach((element: any) => {
                        this.permissionCollection.push(element.permission_id);
                    });
                } else if (data.code === 404) {
                    this.roleName = '';
                    this.submitButtonEnable = false;
                }
            },
                (error: AppError) => {
                    if (error instanceof BadInput) {
                    } else {
                        throw error;
                    }
                });
    }

    permissionArray(event: any, id: number) {
        if (event.checked == true) {
            this.permissionCollection.push(id);
        }
        else {
            const data = this.permissionCollection.find((o: any) => o === id);
            const index: number = this.permissionCollection.indexOf(data);
            if (index !== -1) {
                this.permissionCollection.splice(index, 1);
            }
        }
    }

    getModules() {
        this.common.onBufferEvent.emit(false);
        const getLan = localStorage.getItem("active_lang");
        if (getLan) {
            this.activeLan = getLan;
        }
        else {
            this.activeLan = 'en';
        }
        const queryString = "?active_language=" + this.activeLan + "";
        this.dataService.getJson('system/role/system-module', queryString)
            .subscribe(data => {
                this.common.onBufferEvent.emit(false);
                if (data.code == 200) {
                    this.module_list = data.data.modules;
                } else {
                    this.module_list = [];
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

    getComponent() {
        if (this.select_module != '') {
            const postData = {
                'module_id': this.select_module,
                'active_language': localStorage.getItem("active_lang")
            };

            this.common.onBufferEvent.emit(true);
            this.dataService.post(postData, 'system/role/component-by-system-module')
                .subscribe(data => {
                    this.common.onBufferEvent.emit(false);
                    if (data.code == 200) {
                        this.component_collection = data.data.components;
                        this.formatComponent(this.component_collection);
                    } else {
                        this.component_collection = [];
                    }
                });
        }

    }

    formatComponent(component_collection: any) {
        component_collection.forEach((firstLayer: any, i: any) => {
            firstLayer.permissions.forEach((permission: any) => {
                const data = this.permissionCollection.find((o: any) => o === permission.id);
                if (data) {
                    permission.is_permitted = 1;
                }
                else {
                    permission.is_permitted = 0;
                }

            });
            if (firstLayer.is_component == 0) {
                firstLayer.childs.forEach((secondLayer: any) => {
                    secondLayer.permissions.forEach((permission: any) => {
                        const data = this.permissionCollection.find((o: any) => o === permission.id);
                        if (data) {
                            permission.is_permitted = 1;
                        }
                        else {
                            permission.is_permitted = 0;
                        }
                    });
                    if (secondLayer.is_component == 0) {
                        secondLayer.childs.forEach((thirdLayer: any) => {
                            thirdLayer.permissions.forEach((permission: any) => {
                                const data = this.permissionCollection.find((o: any) => o === permission.id);
                                if (data) {
                                    permission.is_permitted = 1;
                                }
                                else {
                                    permission.is_permitted = 0;
                                }
                            });
                            if (thirdLayer.is_component == 0) {
                                thirdLayer.childs.forEach((fourthLayer: any) => {
                                    fourthLayer.permissions.forEach((permission: any) => {
                                        const data = this.permissionCollection.find((o: any) => o === permission.id);
                                        if (data) {
                                            permission.is_permitted = 1;
                                        }
                                        else {
                                            permission.is_permitted = 0;
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    saverole() {
        if (this.permissionCollection.length > 0) {
            this.common.onBufferEvent.emit(true);
            this.submitButtonEnable = true;
            const postData = {
                'id': this.activeroute.snapshot.paramMap.get("id"),
                'name': this.roleName,
                'role_type': this.role_type,
                'permissions': this.permissionCollection
            };
            this.dataService.post(postData, 'system/role/update')
                .subscribe(data => {
                    this.common.onBufferEvent.emit(false);
                    if (data.code === 200) {
                        this.submitButtonEnable = false;
                        this.common.openSnackBar(data.message, 'Close', 'submit-success');
                        this.common.AClicked('component clicked');
                        this.common.AClickedMenu('component clicked');
                        this.router.navigate(['/system/user-role-manager/role-list']);
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
        else {
            this.common.openSnackBar('Permissions cannot be empty', 'Close', 'submit-warning');
        }

    }

    checkAll(e: any) {
        if (e.checked) {
            this.permissionCollection = [];
            this.component_collection.forEach((firstLayer: any, i: any) => {
                firstLayer.permissions.forEach((permission: any) => {
                    permission.is_permitted = 1;
                    this.permissionCollection.push(permission.id);
                });
                if (firstLayer.is_component == 0) {
                    firstLayer.childs.forEach((secondLayer: any) => {
                        secondLayer.permissions.forEach((permission: any) => {
                            permission.is_permitted = 1;
                            this.permissionCollection.push(permission.id);
                        });
                        if (secondLayer.is_component == 0) {
                            secondLayer.childs.forEach((thirdLayer: any) => {
                                thirdLayer.permissions.forEach((permission: any) => {
                                    permission.is_permitted = 1;
                                    this.permissionCollection.push(permission.id);
                                });
                                if (thirdLayer.is_component == 0) {
                                    thirdLayer.childs.forEach((fourthLayer: any) => {
                                        fourthLayer.permissions.forEach((permission: any) => {
                                            permission.is_permitted = 1;
                                            this.permissionCollection.push(permission.id);
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            this.permissionCollection = [];
            this.component_collection.forEach((firstLayer: any, i: any) => {
                firstLayer.permissions.forEach((permission: any) => {
                    permission.is_permitted = 0;
                });
                if (firstLayer.is_component == 0) {
                    firstLayer.childs.forEach((secondLayer: any) => {
                        secondLayer.permissions.forEach((permission: any) => {
                            permission.is_permitted = 0;
                        });
                        if (secondLayer.is_component == 0) {
                            secondLayer.childs.forEach((thirdLayer: any) => {
                                thirdLayer.permissions.forEach((permission: any) => {
                                    permission.is_permitted = 0;
                                });
                                if (thirdLayer.is_component == 0) {
                                    thirdLayer.childs.forEach((fourthLayer: any) => {
                                        fourthLayer.permissions.forEach((permission: any) => {
                                            permission.is_permitted = 0;
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}
