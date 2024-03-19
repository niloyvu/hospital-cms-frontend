import { AuthService } from '../shared/auth/auth.service';
import { Component, OnInit, Inject, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface DialogData {
  baseURL: string,
  image: string
}

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  aClickedEvent: EventEmitter<any> = new EventEmitter<string>();
  aClickedEventMenu: EventEmitter<any> = new EventEmitter<string>();
  aClickedEventLostMenu: EventEmitter<any> = new EventEmitter<string>();
  onMainEvent: EventEmitter<any> = new EventEmitter();
  onBufferEvent: EventEmitter<any> = new EventEmitter();
  rootUrl = environment.API_URL;
  imageUrl = environment.IMAGE_URL;
  environmentObj = environment;
  element = ElementRef
  bearerToken!: string;
  username!: string;
  snackbarInstant!: any;
  mycookie = this.getCookie(this.environmentObj.tokenKey);
  rolelist = [];
  today: Date = new Date();
  position = 'top-right';
  permissionsAll = Array();
  public activeLangList = [];

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public dialog: MatDialog
  ) { }

  checkPermissionAccess(componentClass: any, type: any) {
    let permissionsArr = Array();
    let storageValu = JSON.parse(decodeURIComponent(String(localStorage.getItem(this.environmentObj.allComponentPermission)))) || [];
    let returnVar = false;
    (this.permissionsAll.length > 0) ? (permissionsArr = this.permissionsAll) : (permissionsArr = storageValu)
    if (permissionsArr.length > 0) {
      let componetOBJ = permissionsArr.find(elment => elment.component == componentClass);
      let access = componetOBJ.permissions[type];
      returnVar = (access == 1) ? true : false;
    } else {
      returnVar = false;
      this.auth.logOut();
    }
    return returnVar;
  }

  AClicked(msg: string) {
    this.aClickedEvent.emit(msg);
  }

  AClickedMenu(msg: string): void {
    this.aClickedEventMenu.emit(msg);
  }

  openSnackBar(message: string, action: string, className: string): void {

    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponentExampleSnack, {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [className],
      data: { message, getIcon: 'highlight_off' }
    });
    this.snackbarInstant = snackBarRef;
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });

  }

  closeSnackBars(): void {
    this.snackbarInstant.dismiss();
  }

  getCookie(cname: string) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  updateCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 9000 * 60 * 9000000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  checkCookie() {
    const cookie = this.getCookie(this.environmentObj.tokenKey)
    if (cookie) {
      const copkiedata = JSON.parse(decodeURIComponent(cookie));
      this.updateCookie(this.environmentObj.tokenKey, cookie, 10);
    } else {
      this.auth.logOut();
    }

  }

  // Angular Validators
  minDigits(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && this.countDigits(control.value) < min) {
        return { 'minDigits': true };
      }
      return null;
    };
  }

  passMatched(pass: string, cpass: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get(pass);
      const confirmPassword = control.get(cpass);
      return password && confirmPassword && password.value !== confirmPassword.value ? { 'passMatched': true } : null;
    }
  }

  // Non-Angular Validators
  stringSlicer(n: number, control: any) {
    if (control.value.length > n) {
      control.setValue(control.value.slice(0, n));
    } else if (isNaN(Number(control.value.slice(-1)))) {
      control.setValue(control.value.slice(0, -1));
    }
  }

  basicImageFile!: File;
  fileUpload!: any;
  up_image_data(fileInput: any) {
    const pre = this;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        pre.basicImageFile = e.target.result;
        let img_data = {
          extension: fileInput.target.files[0].name.split('.').pop(),
          base64: pre.basicImageFile
        }
        pre.fileUpload = img_data;
      }
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  // helper functions
  countDigits(n: number) {
    let count = 0;
    if (n >= 1) {
      ++count;
    }
    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }
    return count;
  }

  mysqlDate(dateTimes: Date) {
    let dateTime = new Date(dateTimes);
    const yyyy = dateTime.getFullYear().toString();
    let mm: string = (dateTime.getMonth() + 1).toString();
    if (Number(mm) < 10) {
      mm = '0' + mm.toString();
    } else {
      mm = mm.toString();
    }
    let dd = (dateTime.getDate()).toString();
    if (Number(dd) < 10) {
      dd = '0' + dd.toString();
    } else {
      dd = dd.toString();
    }
    let hh = (dateTime.getHours().toString());
    if (Number(hh) < 10) {
      hh = '0' + hh.toString();
    } else {
      hh = hh.toString();
    }
    let mmm = (dateTime.getMinutes()).toString();
    if (Number(mmm) < 10) {
      mmm = '0' + mmm.toString();
    } else {
      mmm = mmm.toString();
    }
    let ss = (dateTime.getSeconds()).toString();
    if (Number(ss) < 10) {
      ss = '0' + ss.toString();
    } else {
      ss = ss.toString();
    }
    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mmm + ':' + ss;
  }

  getStatus(status: string) {
    let statusname = '';
    switch (status) {
      case '1':
        statusname = 'Active';
        break;
      case '2':
        statusname = 'Inactive';
        break;
      case '3':
        statusname = 'Blocked';
        break;
      case '4':
        statusname = 'Free';
        break;
    }
    return statusname;
  }

  getMonthNmae(month: string) {
    let monthname
    switch (month) {
      case '1':
        monthname = 'JAN'
        break;
      case '2':
        monthname = 'FEB'
        break;
      case '3':
        monthname = 'MAR'
        break;
      case '4':
        monthname = 'APR'
        break;
      case '5':
        monthname = 'MAY'
        break;
      case '6':
        monthname = 'JUN'
        break;
      case '7':
        monthname = 'JUL'
        break;
      case '8':
        monthname = 'AUG'
        break;
      case '9':
        monthname = 'SEP'
        break;
      case '10':
        monthname = 'OCT'
        break;
      case '11':
        monthname = 'NOV'
        break;
      case '12':
        monthname = 'DEC'
        break;
      default:
    }
    return monthname;
  }


  JSONToCSVConvertor(JSONData: any[], ReportTitle: string, ShowLabel: boolean, lside = false, column: any = null) {
    JSONData.forEach(function (json, index) {
      delete json.id;
      delete json.password;
      delete json.facilitator;
      delete json.documentstatus;
      if (column != null) {
        let keys = Object.keys(json)
        keys.forEach(element => {
          let a = column.includes(element);
          if (a == false) {
            delete json[element];
          }
        });
      } else {
        if (lside != false) {
          if (JSONData[index].side === 'l') {
            JSONData[index].side = 'L1'
          } else {
            JSONData[index].side = 'L2'
          }
        }
      }
    })
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
    //var arrData = delete arrData1[key];
    var CSV = "";
    //Set Report title in first row or line
    CSV += ReportTitle + "\r\n\n";
    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ",";
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + "\r\n";
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";
      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }
      row.slice(0, row.length - 1);
      //add a line break after each row
      CSV += row + "\r\n";
    }

    if (CSV == "") {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "Download_";
    // this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");
    //Initialize file format you want csv or xls
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);
    const link = document.createElement("a") as HTMLAnchorElement;
    link.href = uri;
    //set the visibility hidden so it will not effect on your web-layout
    link.style.visibility = "hidden";
    link.download = fileName + ".csv";
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  openImageServiceModel(baseURL: string, image: string) {
    const dialogRef = this.dialog.open(OpenServiceImgModal, {
      // width: '650px',
      panelClass: 'pannel-padding-remove',
      data: {
        baseURL: baseURL,
        image: image
      }
    });
  }


  getMetaAccessToken() {
    return {
      appId: 822711612626227,
      appSecret: "9f316c6263f78fd5510b6b568e37fa1f",
      pageId: 107693172235747,
      accessToken: "EAALsQHlsVTMBOzOBuesvfX7rbAECOcySqefoZB0ug9JZAq4rjBjW5IFi12B9B5i8669hvm1Vy0siosVtEHG0jIML2l3KyU1DCGpypmSZAFpfyouMpdpvbCuALLSyJ4xTWlOGMFaeFjrZBZAS19wiZBChkgluUjBMm84BtZC3tShuPI83jVVScBtWemdzFzWxd1TJz5a1pJP76ZCO1dmiekkiQawZD"
    }
  }

  isFileSizeExceedsMax(file: File): boolean {
    const maxFileSize = 1048550; // 1 MB
    return file.size > maxFileSize;
  }

}


@Component({
  selector: 'snack-bar-component',
  templateUrl: '../shared/templates/snack-bar-component.html',
  styles: [
    `
    :host {
      display: flex;
    }
  `,
  ],
})

export class SnackBarComponentExampleSnack {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}

@Component({
  selector: 'open-service-img-modal',
  templateUrl: '../shared/templates/open-service-img-modal.html',
})
export class OpenServiceImgModal {
  dialogRef = inject(MatDialogRef);
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

