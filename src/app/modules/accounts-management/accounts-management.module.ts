import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsManagementRoutingModule } from './accounts-management-routing.module';
import { IncomeExpenseComponent } from './income-expense/income-expense.component';
import { IncomeExpenseModalComponent } from './income-expense/income-expense-modal/income-expense-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    IncomeExpenseComponent,
    IncomeExpenseModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccountsManagementRoutingModule
  ]
})
export class AccountsManagementModule { }
