import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline } from 'ionicons/icons';
import { BasePageComponent } from '../../shared/base-page.component';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.page.html',
  styleUrls: ['./home-supervisor.page.scss'],
  standalone: true,
  imports: [BasePageComponent, IonCard, IonCardContent, IonButton, IonIcon]
})
export class HomeSupervisorPage {

  constructor(private router: Router) {
    addIcons({ calendarOutline, timeOutline });
  }

  verReservas() {
    this.router.navigate(['/reservas-supervisor']);
  }

  verHistorico() {
    this.router.navigate(['/historico-supervisor']);
  }
}