import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  // TODO:10: all of this is placeholder until we implement: https://github.com/pnlp-network/pnlp/issues/10
  public userAddress() {
    return Observable.create((observer: Observer<string>) => {
      observer.next('TODO:10');
    });
  }

  public isAuthenticated() {
    return false; //TODO:10
  }

  public logout(): Observable<void> {
    // TODO:10
    return Observable.create();
  }
}
