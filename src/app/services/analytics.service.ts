import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Plugins } from "@capacitor/core";
const { FirebaseAnalytics } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // Mostly based on this article: https://devdactic.com/firebase-analytics-ionic/

  constructor(private router: Router) {
    // Disable tracking by default
    FirebaseAnalytics.disable();

    this.router.events.pipe(
      filter((e: RouterEvent) => e instanceof NavigationEnd),
    ).subscribe((e: RouterEvent) => {
      console.log('route changed: ', e.url);
      this.setScreenName(e.url)
    });
  }

  setScreenName(screenName: string) {
    FirebaseAnalytics.setScreenName({
      screenName
    });
  }

  logEvent(name: string, params: object) {
    FirebaseAnalytics.logEvent({
      name,
      params,
    });
  }
 
  setCollectionEnabled(enabled: boolean) {
    FirebaseAnalytics.setCollectionEnabled({
      enabled: enabled,
    });
  }
}
