import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogin = false;
  url = environment.API_URL;
  environmentObj = environment;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  httpDataHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  login(data: object): Observable<any> {
    const uri = `${this.url}api/login`;
    return this.http.post(uri, JSON.stringify(data), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  loggedIns(): boolean {
    return !!this.getCookie(this.environmentObj.tokenKey);
  }

  setCookie(cookieName: string, cookieValue: string, expireDays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (expireDays * 9000 * 60 * 9000000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
  }

  getCookie(cookieName: string) {
    const name = `${cookieName}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  eraseCookie(name: string) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  logOut() {
    this.eraseCookie(this.environmentObj.tokenKey);
    localStorage.removeItem(this.environmentObj.componentGroupPermission);
    localStorage.removeItem(this.environmentObj.allComponentPermission);
    this.router.navigate(['login']);
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error instanceof ErrorEvent ?
      error.error.message :
      `Error Code: ${error.status}, Message: ${error.message}`;

    // Log the error (consider using a logging service)
    console.error(errorMessage);

    return throwError('Something went wrong. Please try again later.');
  }
}
