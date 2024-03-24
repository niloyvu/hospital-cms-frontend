import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { LoaderService } from '../services/loader.service';


@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  
  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.setRequestType(request.method);
    this.loaderService.showLoader();
    console.log('Outgoing HTTP request', request);
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        console.log('Incoming HTTP response', event);
      }),
      finalize(() => this.loaderService.hideLoader())
    );
  }
}