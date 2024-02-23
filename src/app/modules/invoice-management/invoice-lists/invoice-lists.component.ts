import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { pageType } from 'src/app/shared/enum/page-type';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { InvoiceFormModalComponent } from './invoice-form-modal/invoice-form-modal.component';

@Component({
  selector: 'app-invoice-lists',
  templateUrl: './invoice-lists.component.html',
  styleUrls: ['./invoice-lists.component.scss']
})
export class InvoiceListsComponent implements OnInit, OnDestroy {

  date!: Date;
  dueDate!: Date;
  status!: string;

  dialogOpen: boolean = false;

  tabIndex: number = 0;

  invoices: any[] = [];
  pageType = pageType;
  totalItems: number = 0;
  pageNumber: number = 1;
  searchValues: string = '';
  resultPerPage: number = 10;
  dataOrderBy: boolean = true;
  columnsSortBy: string = 'id';

  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,

    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getWebInvoices();

  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  onChangeDepartment() {
    this.getWebInvoices();
  }
  onChangeStatus() {
    this.getWebInvoices();
  }
  onChangeTimeSlot() {
    this.getWebInvoices();
  }
  onChangeDate() {
    this.getWebInvoices();
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getWebInvoices();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getWebInvoices();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getWebInvoices();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getWebInvoices();
  }

  getWebInvoices() {
    const date = this.date ? this.date.toLocaleDateString() : '';
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'desc' : 'asc',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`,
      date: `${date}`,
      due_date: `${date}`,
      status: `${this.status}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService.getJson('website-cms/invoices',
      `?${new URLSearchParams(queryParams)}`
    )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.invoices = data.data;
            this.totalItems = data.total;
          } else {
            this.invoices = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createInvoice() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(InvoiceFormModalComponent, {
        width: "800px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getWebInvoices()
          };
        });
    }
  }

  updateInvoice(invoice: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(InvoiceFormModalComponent, {
        width: "800px",
        data: invoice,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getWebInvoices()
          };
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
