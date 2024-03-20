import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { pageType } from 'src/app/shared/enum/page-type';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { IncomeExpenseModalComponent } from './income-expense-modal/income-expense-modal.component';
import { PaymentType } from 'src/app/shared/enum/payment-type';

@Component({
  selector: 'app-income-expense',
  templateUrl: './income-expense.component.html',
  styleUrls: ['./income-expense.component.scss']
})
export class IncomeExpenseComponent implements OnInit, OnDestroy {

  dialogOpen: boolean = false;
  cashFlows: any[] = [];
  pageType = pageType;
  totalItems: number = 0;
  pageNumber: number = 1;
  searchValues: string = '';
  resultPerPage: number = 10;
  dataOrderBy: boolean = true;
  columnsSortBy: string = 'id';
  dayType: number | null = 1;

  paymentType: number | null = null;
  date: Date[] = [];

  totalIncome: number = 0;
  totalExpense: number = 0;
  currentBalance: number = 0;
  timeoutId: any;

  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getCashFlows();
  }

  handleSearch(event: KeyboardEvent) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.searchByData(this.searchValues);
    }, 500);
  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  onChangeDate() {
    this.dayType = null;
    this.getCashFlows();
  }

  onChangeDayType() {
    this.getCashFlows();
  }

  onChangePaymentType() {
    this.getCashFlows();
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getCashFlows();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getCashFlows();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getCashFlows();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getCashFlows();
  }

  getCashFlows() {
    const startDate = this.date[0] ? this.date[0].toLocaleDateString() : '';
    const endDate = this.date[1] ? this.date[1].toLocaleDateString() : '';
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      start_date: `${startDate}`,
      end_date: `${endDate}`,
      day_type: `${this.dayType}`,
      per_page: `${this.resultPerPage}`,
      payment_type: `${this.paymentType}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService.getJson('website-cms/accounts/cash-flows',
      `?${new URLSearchParams(queryParams)}`
    )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.cashFlows = data.data;
            this.totalItems = data.total;
            this.onCalculateCurrentBalance();
          } else {
            this.cashFlows = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createIncomeExpenseModal() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(IncomeExpenseModalComponent, {
        width: "800px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getCashFlows()
          };
        });
    }
  }

  updateIncomeExpenseModal(invoice: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(IncomeExpenseModalComponent, {
        width: "800px",
        data: invoice,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getCashFlows()
          };
        });
    }
  }

  onCalculateCurrentBalance() {
    this.totalIncome = this.processTotalAmount(PaymentType.Income);
    this.totalExpense = this.processTotalAmount(PaymentType.Expense);

    this.currentBalance = this.totalIncome - this.totalExpense;
  }

  processTotalAmount(incomeType: number) {
    const data = this.cashFlows.filter((transaction: any) => transaction.payment_type === incomeType);
    return data.reduce((accumulator, transaction) => {
      return accumulator + parseFloat(transaction.amount);
    }, 0);
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}

