import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ProductCategoryModalComponent } from './product-category-modal/product-category-modal.component';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  dialogOpen: boolean = false;

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
    this.getProductCategories();
  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getProductCategories();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getProductCategories();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getProductCategories();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getProductCategories();
  }

  getProductCategories() {
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService
      .getJson('website/shop/product-categories',
        `?${new URLSearchParams(queryParams)}`
      )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.categories = data.data;
            this.totalItems = data.total;
          } else {
            this.categories = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createBlogCategory() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(ProductCategoryModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getProductCategories();
        });
    }
  }

  updateBlogCategory(blogCategory: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(ProductCategoryModalComponent, {
        width: "700px",
        data: blogCategory,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getProductCategories();
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
