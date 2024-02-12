import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CommonService } from './common.service';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from '../shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

export interface IUserResponse {
  total: number;
  list: User[];
}

export class User {
  constructor(public username: string) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  httpHeader: any;
  getUrl = environment.API_URL;
  environmentObj = environment;

  httpDataHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  httpFormDataHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    })
  };

  constructor(
    private router: Router,
    public auth: AuthService,
    private https: HttpClient,
    private common: CommonService,
  ) { }

  headerData() {
    const token = this.common.getCookie(this.environmentObj.tokenKey) ? JSON.parse(decodeURIComponent(this.common.getCookie(this.environmentObj.tokenKey))).bearertoken : '';
    this.httpHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
  }

  getJson(path: string, query: string): Observable<any> {
    this.headerData();
    const checkAuthenticateUser = this.https.get(this.getUrl + 'api/' + path + query, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
    checkAuthenticateUser.subscribe((data: any) => {
      if (data) {
        if (data['code'] == 401) {
          this.auth.eraseCookie(this.environmentObj.tokenKey);
          localStorage.removeItem(this.environmentObj.componentGroupPermission);
          localStorage.removeItem(this.environmentObj.allComponentPermission);
          this.router.navigate(['login']);
        }
        else { }
      }
      else {
        this.auth.eraseCookie(this.environmentObj.tokenKey);
        localStorage.removeItem(this.environmentObj.componentGroupPermission);
        localStorage.removeItem(this.environmentObj.allComponentPermission);
        this.router.navigate(['login']);
      }
    });
    return checkAuthenticateUser;
  }

  post(resource: any, path: string): Observable<any> {
    this.headerData();
    return this.https.post(this.getUrl + 'api/' + path, resource, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getdata(id: string, path: string): Observable<any> {
    this.headerData();
    return this.https.get(this.getUrl + 'api/' + path + '/' + '?id=' + id, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  create(resource: object, path: string) {
    this.headerData();
    return this.https.post(this.getUrl + 'api/' + path, JSON.stringify(resource), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  list(path: string): Observable<any> {
    this.headerData();
    return this.https.get(this.getUrl + 'api/' + path + '/', this.httpHeader);
  }

  get(path: string, params?: any) {
    this.headerData();
    return this.https.get(this.getUrl + 'api/' + path + '/' + params ? params : '', this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  postJson(resource: any, path: string): Observable<any> {
    this.headerData();
    return this.https.post(this.getUrl + 'api/' + path + '/', JSON.stringify(resource), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  httpError(error: { error: { message: string; }; status: any; message: any; }) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(
      'Something bad happened; please try again later.');
  }
}
