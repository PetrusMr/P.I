import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonContent, IonButton ,IonInput, IonIcon, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { person, personCircle, eyeOutline, personOutline, cameraOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
 
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [IonContent, IonButton, IonInput, IonIcon, FormsModule
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  usuario: string = '';
  senha: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private menuController: MenuController
  ) {
     addIcons({personCircle, person, eyeOutline, personOutline, cameraOutline});
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  ngOnDestroy() {
    this.menuController.enable(true);
  }

  login() {
    if (!this.usuario || !this.senha) {
      this.showAlert('Erro', 'Preencha todos os campos');
      return;
    }

    this.authService.login(this.usuario, this.senha).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('usuarioLogado', this.usuario);
          this.menuController.enable(true);
          this.router.navigateByUrl('/home');
        }
      },
      error: (error) => {
        this.showAlert('Erro', 'Usuário ou senha inválidos');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onSenhaInput() {
    const eyeIcon = document.querySelector('.input-box:last-of-type .input-icon') as HTMLElement;
    if (eyeIcon && this.senha.length > 0) {
      eyeIcon.style.display = 'none';
    } else if (eyeIcon && this.senha.length === 0) {
      eyeIcon.style.display = 'block';
    }
  }
}
 