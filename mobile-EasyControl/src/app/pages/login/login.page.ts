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
  toggleActive: boolean = false;

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
    console.log('Botão login clicado');
    console.log('Usuário:', this.usuario, 'Senha:', this.senha);
    console.log('Tipo:', this.toggleActive ? 'supervisor' : 'professor');
    
    if (!this.usuario || !this.senha) {
      console.log('Campos vazios');
      this.mostrarPopupErro('Preencha todos os campos');
      return;
    }

    console.log('Iniciando requisição de login...');
    const loginMethod = this.toggleActive ? 
      this.authService.loginSupervisor(this.usuario, this.senha) : 
      this.authService.login(this.usuario, this.senha);

    console.log('Observable criado, fazendo subscribe...');
    loginMethod.subscribe({
      next: (response) => {
        console.log('Resposta do login:', response);
        if (response.success) {
          localStorage.setItem('usuarioLogado', this.usuario);
          localStorage.setItem('tipoUsuario', this.toggleActive ? 'supervisor' : 'professor');
          this.menuController.enable(true);
          
          const homeRoute = this.toggleActive ? '/home-supervisor' : '/home';
          this.router.navigateByUrl(homeRoute);
        }
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.mostrarPopupErro('Usuário ou senha inválidos');
      },
      complete: () => {
        console.log('Requisição de login finalizada');
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

  toggleSwitch() {
    this.toggleActive = !this.toggleActive;
  }
}
 