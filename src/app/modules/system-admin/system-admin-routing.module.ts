import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/guards/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { MenuManageComponent } from './menu-manage/menu-manage.component';
import { CreateUserComponent } from "./create-user/create-user.component";
import { ComingSoonComponent } from './settings/coming-soon/coming-soon.component';
import { SmsProviderComponent } from './settings/sms-provider/sms-provider.component';
import { LoginNotifyComponent } from './settings/login-notify/login-notify.component';
import { MenuShiftManageComponent } from './menu-shift-manage/menu-shift-manage.component';
import { NotificationListComponent } from './settings/notification-list/notification-list.component';
import { MailServiceProviderComponent } from './settings/mail-service-provider/mail-service-provider.component';
import { ChannelOperationTypeComponent } from './settings/channel-operation-type/channel-operation-type.component';
import { RoleCreateComponent, RoleEditComponent, RoleManagementComponent } from "./role-management/role-management.component";

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'System Users',
        },
        children: [
            {
                path: 'user-role-manager',
                data: {
                    title: 'User & Role Manager'
                },
                children: [
                    { path: 'user', component: CreateUserComponent, canActivate: [AuthGuard] },
                    { path: 'role-list', component: RoleManagementComponent, canActivate: [AuthGuard] },
                    { path: 'role-create', component: RoleCreateComponent, canActivate: [AuthGuard] },
                    { path: 'role-edit/:id', component: RoleEditComponent, canActivate: [AuthGuard] },
                ],

            },
            {
                path: 'menu-manager',
                data: {
                    title: 'Menu Manager'
                },
                children: [
                    { path: 'menu-manage', component: MenuManageComponent, canActivate: [AuthGuard] },
                    {
                        path: 'shift-menu',
                        component: MenuShiftManageComponent,
                        canActivate: [AuthGuard],
                    }
                ]
            },
            {
                path: 'notification-manager',
                data: {
                    title: 'Notification Manager'
                },
                children: [

                    {
                        path: 'sms-provider',
                        component: SmsProviderComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'mail-service-provider',
                        component: MailServiceProviderComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'channel-list',
                        component: LoginNotifyComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'notification-list',
                        component: NotificationListComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'channel-type',
                        component: ChannelOperationTypeComponent,
                        canActivate: [AuthGuard],
                    },

                ]
            }


        ]
    },
    {
        path: 'coming-soon',
        component: ComingSoonComponent
    }


];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemAdminRoutingModule {
}
