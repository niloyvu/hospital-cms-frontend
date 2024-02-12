import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TestimonialModalComponent } from './testimonial-modal/testimonial-modal.component';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements OnInit, OnDestroy {

  dialogOpen: boolean = false;

  testimonials: any[] = [];
  totalItems: number = 0;
  pageNumber: number = 1;
  searchValues: string = '';
  resultPerPage: number = 10;
  dataOrderBy: boolean = true;
  columnsSortBy: string = 'id';

  public rootUrl = `${this.commonService.rootUrl}/uploads/`;
  private submission$: Subscription = new Subscription();
  private subscriptions$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,

    private dataService: DataService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getTestimonials();
  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getTestimonials();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getTestimonials();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getTestimonials();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getTestimonials();
  }

  getTestimonials() {
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService
      .getJson('website/testimonials',
        `?${new URLSearchParams(queryParams)}`
      )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            
            this.testimonials = data.data;
            this.totalItems = data.total;
          } else {
            this.testimonials = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createTestimonial() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(TestimonialModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getTestimonials();
        });
    }
  }

  updateTestimonial(testimonial: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(TestimonialModalComponent, {
        width: "700px",
        data: testimonial,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getTestimonials();
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
