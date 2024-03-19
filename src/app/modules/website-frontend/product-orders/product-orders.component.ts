import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { pageType } from 'src/app/shared/enum/page-type';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MakeOrderModalComponent } from './make-order-modal/make-order-modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.component.html',
  styleUrls: ['./product-orders.component.scss']
})
export class ProductOrdersComponent implements OnInit, OnDestroy {

  date!: Date;
  status!: string;
  timeSlot!: string;
  departmentId!: string;
  orderType!: string;
  orders: any[] = [];
  pageType = pageType;
  totalItems: number = 0;
  pageNumber: number = 1;
  searchValues: string = '';
  dialogOpen: boolean = false;
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
    this.websiteOrders();

  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  onChangeStatus() {
    this.websiteOrders();
  }

  onChangeDate() {
    this.websiteOrders();
  }

  onChangeOrderType() {
    this.websiteOrders();
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.websiteOrders();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.websiteOrders();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.websiteOrders();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.websiteOrders();
  }

  websiteOrders() {
    const date = this.date ? this.date.toLocaleDateString() : '';
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`,
      date: `${date}`,
      status: `${this.status}`,
      order_type: this.orderType
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService.getJson('website/orders',
      `?${new URLSearchParams(queryParams)}`
    )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.orders = data.data;
            this.totalItems = data.total;
          } else {
            this.orders = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  addOrder() {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(MakeOrderModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          if (result) {
            this.websiteOrders();
          }

        });
    }
  }

  updateOrder(order: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(MakeOrderModalComponent, {
        width: "700px",
        data: order,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          if (result) {
            this.websiteOrders();
            console.log("🚀 ~ ProductOrdersComponent ~ updateOrder ~ result:", result)
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
