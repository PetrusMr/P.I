import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, MenuController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, calendar, logOut } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon],
})
export class AppComponent {
  constructor(private router: Router, private menuController: MenuController) {
    addIcons({ home, calendar, logOut });
  }

  navigateTo(route: string) {
    this.menuController.close();
    this.router.navigate([route]);
  }

  sair() {
    this.menuController.close();
    this.router.navigate(['/login']);
  }
}
