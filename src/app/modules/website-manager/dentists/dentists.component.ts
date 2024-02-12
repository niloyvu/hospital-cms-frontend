import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { pageType } from 'src/app/shared/enum/page-type';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DentistModalComponent } from './dentist-modal/dentist-modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dentists',
  templateUrl: './dentists.component.html',
  styleUrls: ['./dentists.component.scss']
})
export class DentistsComponent implements OnInit, OnDestroy {

  dialogOpen: boolean = false;

  tabIndex: number = 0;

  dentists: any[] = [];
  pageType = pageType;
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
    this.getDentists();

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
    this.getDentists();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getDentists();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getDentists();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getDentists();
  }

  getDentists() {
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService
      .getJson('website/dentists',
        `?${new URLSearchParams(queryParams)}`
      )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.dentists = data.data;
            this.totalItems = data.total;
          } else {
            this.dentists = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createService() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(DentistModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getDentists();
        });
    }
  }

  updateService(service: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(DentistModalComponent, {
        width: "700px",
        data: service,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe(result => {
          this.dialogOpen = false;
          this.getDentists();
        });
    }
  }
 
  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
