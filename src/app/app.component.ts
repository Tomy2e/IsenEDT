import { Component, OnInit } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;

  public appPagesLogout = [
    { 
      title: 'Connexion',
      url: '/login',
      icon: 'lock-closed',
    },
    {
      title: 'A propos',
      url: '/about',
      icon: 'information-circle',
    }
  ];

  public appPagesLogged = [
    {
      title: 'Planning',
      url: '/planning',
      icon: 'calendar',
    },
    {
      title: 'Paramètres',
      url: '/settings',
      icon: 'settings',
    },
    {
      title: 'A propos',
      url: '/about',
      icon: 'information-circle',
    },
  ];

  public status = "Non connecté";

  public appPages = this.appPagesLogout;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sessionService: SessionService,
    private navCtrl: NavController,
  ) {
    this.initializeApp();

    this.sessionService.appMethodCallSource$.subscribe((data: string) => {
      if(data === 'login') this.setLogin();
      else if(data === 'logout') this.setLogout();
    });

    if(sessionService.isConnected()) this.setLogin();
  }

  setLogin() {
    this.appPages = this.appPagesLogged;
    this.status = this.sessionService.getName();
    this.navCtrl.navigateRoot('/planning');
  }

  setLogout() {
    this.appPages = this.appPagesLogout;
    this.status = "Non connecté";
    this.navCtrl.navigateRoot('/login');
  }

  logoutPrompt() {
    this.sessionService.remove();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
