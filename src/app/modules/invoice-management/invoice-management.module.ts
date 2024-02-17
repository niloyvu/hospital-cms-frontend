import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoiceListsComponent } from './invoice-lists/invoice-lists.component';
import { InvoiceManagementRoutingModule } from './invoice-management-routing.module';
import { InvoiceFormModalComponent } from './invoice-lists/invoice-form-modal/invoice-form-modal.component';
import { InvoiceItemsComponent } from './invoice-items/invoice-items.component';
import { InvoiceItemFormModalComponent } from './invoice-items/invoice-item-form-modal/invoice-item-form-modal.component';


@NgModule({
  declarations: [
    InvoiceListsComponent,
    InvoiceFormModalComponent,
    InvoiceItemsComponent,
    InvoiceItemFormModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceManagementRoutingModule
  ]
})
export class InvoiceManagementModule { }
