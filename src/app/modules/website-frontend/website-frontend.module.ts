import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteRoutingModule } from './website-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ContactsInfoComponent } from './contacts-info/contacts-info.component';
import { ProductOrdersComponent } from './product-orders/product-orders.component';
import { WebSubscriptionsComponent } from './web-subscriptions/web-subscriptions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentModalComponent } from './appointments/appointment-modal/appointment-modal.component';
import { MakeOrderModalComponent } from './product-orders/make-order-modal/make-order-modal.component';



@NgModule({
  declarations: [
    AppointmentsComponent,
    ContactsInfoComponent,
    ProductOrdersComponent,
    WebSubscriptionsComponent,
    AppointmentModalComponent,
    MakeOrderModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WebsiteRoutingModule
  ]
})
export class WebsiteFrontendModule { }
