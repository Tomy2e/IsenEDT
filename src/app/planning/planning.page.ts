import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AurionService } from '../aurion.service';
import { Day } from '../day';
import { EntService } from '../ent.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {

  public planning: Day[];
  constructor(
    private entService: EntService,
    private aurionService: AurionService,
    private sessionService: SessionService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    this.planning = this.sessionService.getPlanning();
    console.log(this.planning);
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

        console.log(this.planning);

      } else {
        // Logout user
        this.sessionService.remove();

        const toast = await this.toastController.create({
          message: "Nom d'utilisateur ou mot de passe incorrect. Veuillez vous reconnecter.",
          duration: 3000
        });
        toast.present();
      }
    } catch(error) {
      let details = (error.error) ? error.error : "unknown";
      const alert = await this.alertController.create({
        header: 'Erreur de connexion',
        message: "Une erreur de connexion s'est produite: " + details,
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      event.target.complete();
    }
  }

}