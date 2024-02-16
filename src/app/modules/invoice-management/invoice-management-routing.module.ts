import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceListsComponent } from './invoice-lists/invoice-lists.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoice-lists',
    pathMatch: 'full'
  },
  {
    path: 'invoice-lists',
    component: InvoiceListsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceManagementRoutingModule { }
