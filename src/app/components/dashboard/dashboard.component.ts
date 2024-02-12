import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export interface DialogData {
  mobile: string;
  save_type: string;
  change_name: string;
  otpcode: string;
  title: string;
  change_cost: string;
  countdate: string;
}
export interface DialogDataexpair {
  mobile: string;
  save_type: string;
  change_name: string;
  otpcode: string;
  title: string;
  change_cost: string;
  countdate: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalearning: number = .00;
  rootUrl = this.common.rootUrl + 'uploads/';
  erroeMsg = ''

  userdata!: {
    username: string,
    sponsor: string,
    upline: string,
    entrydate: string,
    mobile: string,
    rcf: string,
    lcf: string,
    membertype: string
  };

  userImageFile = './assets/img/image_placeholder.jpg';
  tableBuffer = true;
  showTable = false;
  allnotice = []

  announceArrive: number = 0;
  @Output() messageEvent = new EventEmitter<number>();
  constructor(
    public dialog: MatDialog,
    public common: CommonService,
  ) { }

  ngOnInit(): void {
    this.common.checkCookie();
  }

  info() {
    this.common.openSnackBar('Success Created', 'Close', 'submit-info');
  }
  success() {
    this.common.openSnackBar('Success Created', 'Close', 'submit-success');
  }
  warning() {
    this.common.openSnackBar('Warning Created', 'Close', 'submit-warning');
  }
  danger() {
    this.common.openSnackBar('Error Created', 'Close', 'submit-error');
  }

  forPreques() {

    if (Number(this.userdata.membertype) > 1) {
      return 'Prerequisites :';
    } else {
      return '&nbsp;'
    }
  }

  forBsDev() {

    if (Number(this.userdata.membertype) > 3) {
      return 'col-lg-6 col-md-6 col-sm-12 col-12';
    } else {
      return 'col-lg-12 col-md-12 col-sm-12 col-12';
    }
  }

  getDataDiff(startDate: Date) {
    let endDate = new Date();
    let specifiedTime = new Date(startDate);
    let diff = endDate.getTime() - specifiedTime.getTime();
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    let minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    let seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

    let timae = 'You last logined ';
    if (days > 0) {
      timae = timae + days + ' days ';
    }

    if (hours > 0) {
      timae = timae + hours + ' hour ';
    }

    if (minutes > 0) {
      timae = timae + minutes + ' minute ';
    }

    if (seconds > 0) {
      timae = timae + seconds + ' second ago. ';
    }

    return timae
  }
}