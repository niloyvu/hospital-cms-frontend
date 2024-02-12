import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/shared/ng-zorro-antd.module';
import { SystemAdminRoutingModule } from './system-admin-routing.module';
import { ComingSoonComponent } from './settings/coming-soon/coming-soon.component';
import { RoleAssignComponent, RoleAssignDialog } from "./role-assign/role-assign.component";
import { CreateUserAddEditDialog, CreateUserComponent } from "./create-user/create-user.component";
import { CreateMenuManagerAddEditModel, MenuManageComponent } from './menu-manage/menu-manage.component';
import { SmsProviderComponent, SmsProviderDialog } from './settings/sms-provider/sms-provider.component';
import { LoginNotifyComponent, LoginNotifyDialog } from './settings/login-notify/login-notify.component';
import { MenuShiftManageComponent, MenuShiftModal } from './menu-shift-manage/menu-shift-manage.component';
import { RoleCreateComponent, RoleEditComponent, RoleManagementComponent } from "./role-management/role-management.component";
import { CreateNotificationDialog, NotificationListComponent } from './settings/notification-list/notification-list.component';
import { MailServiceProviderComponent, MailServiceProviderDialog } from './settings/mail-service-provider/mail-service-provider.component';
import { ChannelOperationTypeComponent, CreateChannelTypeDialog } from './settings/channel-operation-type/channel-operation-type.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        SystemAdminRoutingModule
    ],
    declarations: [
        MenuShiftModal,
        RoleAssignDialog,
        RoleEditComponent,
        SmsProviderDialog,
        LoginNotifyDialog,
        CreateUserComponent,
        RoleAssignComponent,
        RoleCreateComponent,
        SmsProviderComponent,
        MenuManageComponent,
        ComingSoonComponent,
        LoginNotifyComponent,
        RoleManagementComponent,
        CreateUserAddEditDialog,
        CreateChannelTypeDialog,
        CreateNotificationDialog,
        MenuShiftManageComponent,
        MailServiceProviderDialog,
        NotificationListComponent,
        MailServiceProviderComponent,
        CreateMenuManagerAddEditModel,
        ChannelOperationTypeComponent,
        MenuShiftModal,
        RoleAssignDialog,
        SmsProviderDialog,
        LoginNotifyDialog,
        CreateChannelTypeDialog,
        CreateUserAddEditDialog,
        CreateNotificationDialog,
        MailServiceProviderDialog,
        CreateMenuManagerAddEditModel,
    ],
})

export class SystemAdminModule {}

