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

  public remove(): void {
    localStorage.clear();
    this.appMethodCallSource.next('logout');
  }

  public cachePlanning(planning: Day[]) {
    localStorage.setItem('isen_planning_cache', JSON.stringify(planning));
    localStorage.setItem('isen_planning_update', new Date().toString());
  }

  public getPlanningUpdate(): Date {
    let update = localStorage.getItem('isen_planning_update');

    if(update === null) return null;
    else return new Date(update);
  }

  public getPlanningUpdateElapsed() {
    let date = this.getPlanningUpdate();

    if(date === null) return "jamais";
    else return "il y a " + this.timeSince(date);
  }

  // From: https://stackoverflow.com/a/3177838
  private timeSince(date: Date) {
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " années";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " mois";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " jours";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " heures";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }

    return Math.floor(seconds) + " secondes";
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

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return planning.filter(d => d.date >= today);
  }


}
