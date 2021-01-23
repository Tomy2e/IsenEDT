import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AurionService } from '../../services/aurion.service';
import { Day } from '../../interfaces/day';
import { EntService } from '../../services/ent.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {

  public planning: Day[];
  public lastUpdate: string;
  constructor(
    private entService: EntService,
    private aurionService: AurionService,
    private sessionService: SessionService,
    private toastController: ToastController,
    private alertController: AlertController,
    private analyticsService: AnalyticsService,
  ) {
    this.planning = this.sessionService.getPlanning();
    this.lastUpdate = this.sessionService.getPlanningUpdateElapsed();
  }

  ngOnInit() {
  }

  async doRefresh(event) {
    try {
      // Login
      let login = await this.entService.loginAurion(this.sessionService.getUsername(), this.sessionService.getPassword());

      if(login) {
        // Do Fetch
        let start = new Date();
        start.setHours(0, 0, 0, 0);

        let end = new Date();
        end.setDate(start.getDate() + 31 * 3); // fetch roughly 3 months
        end.setHours(23, 59, 59, 0);

        this.planning = await this.aurionService.fetchEdt({ start, end });
        
        this.sessionService.cachePlanning(this.planning);

        this.lastUpdate = "à l'instant";

        this.analyticsService.logEvent('fetch_planning', {
          success: "yes",
        });
      } else {
        // Logout user
        this.sessionService.remove();

        const toast = await this.toastController.create({
          message: "Nom d'utilisateur ou mot de passe incorrect. Veuillez vous reconnecter.",
          duration: 3000
        });
        toast.present();

        this.analyticsService.logEvent('logout', {
          reason: "expired credentials",
        });
      }
    } catch(error) {
      let details = (error.error) ? error.error : "unknown";
      const alert = await this.alertController.create({
        header: 'Erreur de connexion',
        message: "Une erreur de connexion s'est produite: " + details,
        buttons: ['OK']
      });
      await alert.present();

      this.analyticsService.logEvent('fetch_planning', {
        success: "no",
        error: "global",
      });
    } finally {
      event.target.complete();
    }
  }

}
