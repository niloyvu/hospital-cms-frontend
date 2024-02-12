import { Component, OnInit } from '@angular/core';
import { AppError } from "../../shared/core/app-error";
import { BadInput } from "../../shared/core/bad-input";
import { DataService } from '../../services/data.service';
import { AuthService } from '../../shared/auth/auth.service';
import { CommonService } from '../../services/common.service';

export interface RoutersData {
    path: string;
    title: string;
    icon: string;
    class: string;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    mockDate: Date = new Date();
    menuItems = Array();
    rootUrl = this.common.rootUrl + 'uploads/';
    erroeMsg = '';
    rootIndex = 0;
    previousmembertype: any;
    currentmembertype: any;
    nextmembertype: any;
    currentmembertype2: any
    panelOpenState = false;
    userImageFile: any;
    menus = [];
    collection = [];
    activeLan = '';

    openMap: { [name: string]: boolean } = {
        'sub1': true,
        'sub2': false,
        'sub3': false,
        'sub4': false,
        'sub5': false,
        'sub6': false,
        'sub7': false,
        'sub8': false
    };

    constructor(
        public auth: AuthService,
        private common: CommonService,
        private dataService: DataService
    ) { }

    ngOnInit(): void {
        this.resetRoute();
        this.permittedMenus();
        this.menuItems = this.resetRoute().filter(menuItem => menuItem);
        this.common.aClickedEventMenu
            .subscribe((data: string) => {
                this.permittedMenus();
                this.menuItems = this.resetRoute().filter(menuItem => menuItem);
            });
    }

    permittedMenus() {
        const getLan = localStorage.getItem("active_lang");
        if (getLan) {
            this.activeLan = getLan;
        }
        else {
            this.activeLan = 'en';
        }
        const queryString = "?active_language=" + this.activeLan + "";
        this.dataService.getJson('dynamic-menu-by-role', queryString)
            .subscribe(data => {
                if (data.code == 200) {

                    let env = this.common.environmentObj
                    localStorage.removeItem(env.componentGroupPermission);
                    this.collection = data.data.permissions;
                    localStorage.setItem(env.componentGroupPermission, encodeURIComponent(JSON.stringify(this.collection)));
                    this.menus = JSON.parse(decodeURIComponent(String(localStorage.getItem(env.componentGroupPermission))));
                    localStorage.setItem(env.allComponentPermission, encodeURIComponent(JSON.stringify(data.data.all_componet_permission)));

                    localStorage.setItem(env.roleType, encodeURIComponent(JSON.stringify(data.data.role_type)));
                    this.menus.forEach((element: any) => {
                        if (element.children) {
                            element.children.forEach((child: any) => {
                                if (child.children) {
                                    child.children.forEach((child2: any) => {
                                        if (child2.children) {
                                            child2.children.forEach((child3: any) => {
                                                const lastSegment = child3.path.split("/").pop();
                                                if (lastSegment == 'coming-soon') {
                                                    child3.path = '/coming-soon';
                                                }
                                            });

                                        } else {
                                            const lastSegment = child2.path.split("/").pop();
                                            if (lastSegment == 'coming-soon') {
                                                child2.path = '/coming-soon';
                                            }
                                        }
                                    });

                                } else {
                                    const lastSegment = child.path.split("/").pop();
                                    if (lastSegment == 'coming-soon') {
                                        child.path = '/coming-soon';
                                    }
                                }
                            });
                        }
                    });

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

    openHandler(value: string, indx: number, level: number): void {

        for (const key in this.openMap) {
            if (key !== value) {
                this.openMap[key] = false;
            } else {
                this.openMap[key] = true;
            }
        }

        if (level == 1) {
            this.rootIndex = indx;
            this.menus.forEach((element: any, inx) => {
                if (inx !== indx) {
                    element.open = false
                }
            });
        } else {
            if (level == 2) {
                this.menus.forEach((element: any, inx) => {
                    if (this.rootIndex == inx) {
                        element.children.forEach((eleme: any, ix: any) => {
                            if (ix !== indx) {
                                eleme.open = false
                            }
                        });
                    }
                });
            }
        }

    }

    isMobileMenu() {
        // if ($(window).width() > 991) {
        //     return false;
        // }
        // return true;
    };

    resetRoute() {
        return [
            {
                path: '/dashboard',
                title: 'Dashboard',
                icon: 'dashboard',
                class: 'show_menu'
            },
            {
                title: 'Retailer Account',
                icon: 'supervisor_account',
                id: 'retailer-account',
                class: 'show_menu',
                subMenus: [
                    {
                        path: '/product-purchase-report',
                        title: 'Product Purchase Report',
                        icon: 'attach_money',
                        pageaccess: true
                    },
                    {
                        path: '/convert-point',
                        title: 'Convert Point',
                        icon: 'note_add',
                        class: '',
                        pageaccess: true
                    },
                    {
                        path: '/ip-stock-ledger',
                        title: 'IP Stock Ledger',
                        icon: 'note_add',
                        class: '',
                        pageaccess: true
                    },
                    {
                        path: '/consumer-team-list',
                        title: 'Consumer Team List',
                        icon: 'note_add',
                        class: '',
                        pageaccess: true
                    },
                    {
                        path: '/account-upgrade-request',
                        title: 'Account Upgrade Request',
                        icon: 'person_add',
                        pageaccess: true
                    },
                    {
                        path: '/upgrade-distributor-type',
                        title: 'Upgrade Distributor Type',
                        icon: 'note_add',
                        class: '',
                        pageaccess: true
                    },
                ]
            },
        ]
    }

}
