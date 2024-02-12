import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: any[] = [];

  totalItems: number = 0;
  pageNumber: number = 1;
  searchValues: string = '';
  resultPerPage: number = 10;
  dataOrderBy: boolean = true;
  columnsSortBy: string = 'id';

  private submission$: Subscription = new Subscription();
  public rootUrl = `${this.commonService.rootUrl}/uploads/`;
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getProducts();

  }

  convertToSlug(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getProducts();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getProducts();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getProducts();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getProducts();
  }

  getProducts() {
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService
      .getJson('website/shop/products',
        `?${new URLSearchParams(queryParams)}`
      )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.products = data.data;
            this.totalItems = data.total;
          } else {
            this.products = [];
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
