import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListsComponent } from './invoice-lists/invoice-lists.component';
import { InvoiceManagementRoutingModule } from './invoice-management-routing.module';


@NgModule({
  declarations: [
    InvoiceListsComponent
  ],
  imports: [
    CommonModule,
    InvoiceManagementRoutingModule
  ]
})
export class InvoiceManagementModule { }
