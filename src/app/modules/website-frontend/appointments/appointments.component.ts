import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { pageType } from 'src/app/shared/enum/page-type';
import { DataService } from 'src/app/services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, OnDestroy {

  date!: Date;
  status!: string;
  timeSlot!: string;
  departmentId!: string;
  dialogOpen: boolean = false;

  tabIndex: number = 0;

  appointments: any[] = [];
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
    this.getWebAppointments();

  }

  getSl(i: number) {
    return (Number(this.resultPerPage) * (Number(this.pageNumber) - 1)) + i
  }

  onChangeDepartment() {
    this.getWebAppointments();
  }
  onChangeStatus() {
    this.getWebAppointments();
  }
  onChangeTimeSlot() {
    this.getWebAppointments();
  }
  onChangeDate() {
    this.getWebAppointments();
  }

  changeResultPerPage(event: number) {
    this.pageNumber = 1;
    this.resultPerPage = event;
    this.getWebAppointments();
  }

  pageChange(newPage: number) {
    this.pageNumber = newPage;
    this.getWebAppointments();
  }

  searchByData(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.resultPerPage = 10;
    this.dataOrderBy = true;
    this.getWebAppointments();
  }

  sortBy(column: string) {
    if (this.columnsSortBy === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.columnsSortBy = column;
    }
    this.getWebAppointments();
  }

  getWebAppointments() {
    const date = this.date ? this.date.toLocaleDateString() : '';
    const queryParams = {
      search: this.searchValues,
      sort_column: `${this.columnsSortBy}`,
      sort_by: this.dataOrderBy ? 'DESC' : 'ASC',
      per_page: `${this.resultPerPage}`,
      page: `${this.pageNumber}`,
      date: `${date}`,
      status: `${this.status}`,
      time: `${this.timeSlot}`,
      department_id: `${this.departmentId}`
    };
    this.commonService.onBufferEvent.emit(true);

    this.dataService.getJson('website/appointments',
      `?${new URLSearchParams(queryParams)}`
    )
      .subscribe({
        next: ({ code, data }) => {
          this.commonService
            .onBufferEvent.emit(false);
          if (code == 200) {
            this.appointments = data.data;
            this.totalItems = data.total;
          } else {
            this.appointments = [];
            this.totalItems = 0;
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  createAppointment() {
    if (!this.dialogOpen) {
      const dialogRef = this.dialog.open(AppointmentModalComponent, {
        width: "700px",
        data: null,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getWebAppointments();
          }
        });
    }
  }


  updateAppointment(appointment: any) {
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      const dialogRef = this.dialog.open(AppointmentModalComponent, {
        width: "700px",
        data: appointment,
        disableClose: true
      });
      dialogRef.afterClosed()
        .subscribe((response) => {
          this.dialogOpen = false;
          if (response) {
            this.getWebAppointments();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.submission$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

}
