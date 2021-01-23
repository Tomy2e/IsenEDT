import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  trackingConsent: boolean;

  constructor(private sessionService: SessionService, private analyticsService: AnalyticsService) {
    this.trackingConsent = this.sessionService.getTrackingConsent();
  }

  updateTrackingConsent() {
    this.sessionService.setTrackingConsent(this.trackingConsent);
    this.analyticsService.setCollectionEnabled(this.trackingConsent);
  }

  ngOnInit() {
  }

}
