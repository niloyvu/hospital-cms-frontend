import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { BlogCategoryModalComponent } from './blog-category-modal/blog-category-modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.scss']
})
export class BlogCategoryComponent implements OnInit, OnDestroy {

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
    this.getBlogs();

  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getBlogs();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getBlogs();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getBlogs();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getBlogs();
  }

  getBlogs() {
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService
      .getJson('website/blog/categories',
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
      const dialogRef = this.dialog.open(BlogCategoryModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getBlogs();
        });
    }
  }

  updateBlogCategory(blogCategory: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(BlogCategoryModalComponent, {
        width: "700px",
        data: blogCategory,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getBlogs();
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
