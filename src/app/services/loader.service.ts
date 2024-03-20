import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private apiCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private requestTypeSubject = new Subject<string>();
  requestType$ = this.requestTypeSubject.asObservable();

  constructor() { }

  setRequestType(requestType: string) {
    this.requestTypeSubject.next(requestType);
  }

  showLoader() {
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(true);
    }
    this.apiCount++;
  }

  hideLoader() {
    this.apiCount--;
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(false);
    }
  }
}
