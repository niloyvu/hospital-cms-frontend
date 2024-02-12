import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-web-subscriptions',
  templateUrl: './web-subscriptions.component.html',
  styleUrls: ['./web-subscriptions.component.scss']
})
export class WebSubscriptionsComponent implements OnInit, OnDestroy {
  date!: Date;
  subscriptions: any[] = [];
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
    this.getWebsiteSubscriptions();

  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  onChangeDate() {
    this.getWebsiteSubscriptions();
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getWebsiteSubscriptions();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getWebsiteSubscriptions();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getWebsiteSubscriptions();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getWebsiteSubscriptions();
  }

  getWebsiteSubscriptions() {
    const date = this.date? this.date.toLocaleDateString() : '';
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`,
      date:  `${date}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService.getJson('website/subscriptions',
      `?${new URLSearchParams(queryParams)}`
    )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.subscriptions = data.data;
            this.totalItems = data.total;
          } else {
            this.subscriptions = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
