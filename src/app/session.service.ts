import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Day } from './day';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() { }
  private appMethodCallSource = new Subject<string>();
  appMethodCallSource$ = this.appMethodCallSource.asObservable();

  public create(username: string, password: string, name: string): void {
    localStorage.setItem('isen_username', username);
    localStorage.setItem('isen_password', password);
    localStorage.setItem('isen_name', name);
    this.renewCookieExpire();
    this.appMethodCallSource.next('login');
  }

  public isConnected(): boolean {
    return (
      (localStorage.getItem('isen_username') !== null) &&
      (localStorage.getItem('isen_password') !== null) &&
      (localStorage.getItem('isen_name') !== null)
    );
  }

  public getName() {
    return localStorage.getItem('isen_name');
  }

  public getUsername() {
    return localStorage.getItem('isen_username');
  }

  public getPassword() {
    return localStorage.getItem('isen_password');
  }

  public getCookieExpire() {
    let ce = localStorage.getItem('isen_cookie_expire');
    return ce === null ? 0 : parseInt(ce);
  }

  public isCookieExpired() {
    return this.getCookieExpire() < new Date().getTime();
  }

  public renewCookieExpire() {
    localStorage.setItem('isen_cookie_expire', (new Date().getTime() + 300 * 1000).toString());
  }

  public remove(): void {
    localStorage.clear();
    this.appMethodCallSource.next('logout');
  }

  public cachePlanning(planning: Day[]) {
    localStorage.setItem('isen_planning_cache', JSON.stringify(planning));
    localStorage.setItem('isen_planning_update', new Date().getTime().toString());
  }

  // From: https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
  private dateParser(_key, value) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
    if (typeof value === 'string') {
        var a = reISO.exec(value);
        if (a)
            return new Date(value);
        a = reMsAjax.exec(value);
        if (a) {
            var b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;
  };

  public getPlanning(): Day[] {
    let cache = localStorage.getItem('isen_planning_cache');

    if(cache === null) return [];

    let planning: Day[] = JSON.parse(cache, this.dateParser);

    return planning.filter(d => d.date >= new Date());
  }


}