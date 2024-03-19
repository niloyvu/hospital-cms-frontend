import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeExpenseComponent } from './income-expense/income-expense.component';

const routes: Routes = [
  {
    path: 'income-expense',
    component: IncomeExpenseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsManagementRoutingModule { }
