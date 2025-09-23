import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton ,IonInput, IonIcon, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { person, personCircle, eyeOutline, eyeOffOutline, personOutline, cameraOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
 
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [CommonModule, IonContent, IonButton, IonInput, IonIcon, FormsModule
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  usuario: string = '';
  senha: string = '';
  showPassword: boolean = false;
  mostrarErro: boolean = false;
  mensagemErro: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private menuController: MenuController
  ) {
     addIcons({personCircle, person, eyeOutline, eyeOffOutline, personOutline, cameraOutline});
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  ngOnDestroy() {
    this.menuController.enable(true);
  }

  login() {
    if (!this.usuario || !this.senha) {
      this.mostrarPopupErro('Preencha todos os campos');
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
        this.mostrarPopupErro('Usuário ou senha inválidos');
      }
    });
  }

  mostrarPopupErro(mensagem: string) {
    this.mensagemErro = mensagem;
    this.mostrarErro = true;
  }

  fecharErro() {
    this.mostrarErro = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
 