import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton ,IonInput, IonIcon, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router, RouterLink } from '@angular/router';
import { person, personCircle,  } from 'ionicons/icons';
 
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton,RouterLink,
     IonInput, IonIcon
  ],
})
export class LoginPage {

  constructor(private router : Router) {
     addIcons({personCircle, person});
  }
  IrParaHome(){
    this.router.navigateByUrl('/home');
  }
}
 