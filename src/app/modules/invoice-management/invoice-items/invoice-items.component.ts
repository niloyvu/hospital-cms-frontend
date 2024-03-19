import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { pageType } from 'src/app/shared/enum/page-type';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { InvoiceItemFormModalComponent } from './invoice-item-form-modal/invoice-item-form-modal.component';

@Component({
  selector: 'app-invoice-items',
  templateUrl: './invoice-items.component.html',
  styleUrls: ['./invoice-items.component.scss']
})
export class InvoiceItemsComponent implements OnInit, OnDestroy {

  dialogOpen: boolean = false;
  invoiceItems: any[] = [];
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
    this.getWebInvoiceItems();

  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  onChangeDepartment() {
    this.getWebInvoiceItems();
  }
  onChangeStatus() {
    this.getWebInvoiceItems();
  }
  onChangeTimeSlot() {
    this.getWebInvoiceItems();
  }
  onChangeDate() {
    this.getWebInvoiceItems();
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getWebInvoiceItems();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getWebInvoiceItems();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getWebInvoiceItems();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getWebInvoiceItems();
  }

  getWebInvoiceItems() {
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService.getJson('website-cms/invoice-items',
      `?${new URLSearchParams(queryParams)}`
    )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.invoiceItems = data.data;
            this.totalItems = data.total;
          } else {
            this.invoiceItems = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createInvoiceItem() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(InvoiceItemFormModalComponent, {
        width: "800px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getWebInvoiceItems()
          };
        });
    }
  }

  updateInvoiceItem(invoice: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(InvoiceItemFormModalComponent, {
        width: "800px",
        data: invoice,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getWebInvoiceItems()
          };
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
