import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, MenuController } from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, calendar, logOut } from 'ionicons/icons';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private menuController: MenuController) {
    addIcons({ home, calendar, logOut });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('usuarioLogado');
  }

  navigateTo(route: string) {
    this.menuController.close();
    this.router.navigate([route]);
  }

  sair() {
    localStorage.removeItem('usuarioLogado');
    this.isLoggedIn = false;
    this.menuController.close();
    this.router.navigate(['/login']);
  }
}
