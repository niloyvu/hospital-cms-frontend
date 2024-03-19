import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ContactsInfoComponent } from './contacts-info/contacts-info.component';
import { ProductOrdersComponent } from './product-orders/product-orders.component';
import { WebSubscriptionsComponent } from './web-subscriptions/web-subscriptions.component';

const routes: Routes = [
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'contacts-info', component: ContactsInfoComponent },
    { path: 'product-orders', component: ProductOrdersComponent },
    { path: 'web-subscriptions', component: WebSubscriptionsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebsiteRoutingModule { }
