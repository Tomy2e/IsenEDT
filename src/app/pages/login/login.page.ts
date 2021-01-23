import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AurionService } from '../../services/aurion.service';
import { EntService } from '../../services/ent.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private entService: EntService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private aurionService: AurionService,
    private sessionService: SessionService,
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit() { }

  username: string;
  password: string;
  trackingConsent: boolean = true;

  submitAvailable: boolean = true;

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Firebase Analytics',
      message: "Le suivi Firebase Analytics permet au développeur de mesurer et analyser"
      + " l'audience de l'application. Les données collectées sont exclusivement utilisées"
      + " afin d'améliorer l'application. Ce paramètre peut être modifié plus tard dans"
      + " les paramètres de l'application.",
      buttons: ['OK']
    });

    await alert.present();
  }

  updateConsent() {
    if(!this.trackingConsent) {
      this.sessionService.setTrackingConsent(this.trackingConsent);
      this.analyticsService.setCollectionEnabled(this.trackingConsent);
    }
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Connexion en cours...',
    });

    loading.present();

    this.sessionService.setTrackingConsent(this.trackingConsent);
    this.analyticsService.setCollectionEnabled(this.trackingConsent);

    try {
      let login = await this.entService.loginAurion(this.username, this.password);

      await loading.dismiss();

      if(login) {
        this.submitAvailable = false;

        // Fetch name
        let name = await this.aurionService.getName();

        // Fetch and cache planning
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        let end = new Date();
        end.setDate(start.getDate() + 31 * 3); // fetch roughly 3 months
        end.setHours(23, 59, 59, 0);
        this.sessionService.cachePlanning(await this.aurionService.fetchEdt({start, end}));

        // Persist user
        this.sessionService.create(this.username, this.password, name);

        this.analyticsService.logEvent('login', {
          success: "yes",
        });
      } else {
        const alert = await this.alertController.create({
          header: 'Erreur de connexion',
          message: "Une erreur de connexion s'est produite. Nom d'utilisateur ou mot de passe probablement incorrect.",
          buttons: ['OK']
        });
        await alert.present();

        this.analyticsService.logEvent('login', {
          success: "no",
          error: "wrong credentials"
        });
      }
    } catch(error) {
      this.submitAvailable = true;
      await loading.dismiss();

      let details = (error.error) ? error.error : "unknown";
      const alert = await this.alertController.create({
        header: 'Erreur de connexion',
        message: "Une erreur de connexion s'est produite: " + details,
        buttons: ['OK']
      });

      await alert.present();

      this.analyticsService.logEvent('login', {
        success: "no",
        error: "global"
      });
    }
  }

}
