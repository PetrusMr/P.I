// EXEMPLO: Como criar uma nova página usando o padrão

export const exemploDocumentacao = {
  html: `
<app-base-page pageTitle="Título da Página" [showBackButton]="true" backRoute="/home">
  <!-- Seu conteúdo específico aqui -->
  <div class="meu-conteudo">
    <h2>Conteúdo da página</h2>
    <ion-button>Meu botão</ion-button>
  </div>
</app-base-page>
  `,
  
  typescript: `
import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { BasePageComponent } from '../../shared/base-page.component';

@Component({
  selector: 'app-exemplo',
  templateUrl: 'exemplo.page.html',
  styleUrls: ['exemplo.page.scss'],
  imports: [BasePageComponent, IonButton]
})
export class ExemploPage {
  constructor() {}
}
  `,
  
  propriedades: {
    pageTitle: 'Título que aparece no header',
    showBackButton: 'Se deve mostrar botão de voltar (padrão: false)',
    backRoute: 'Rota para onde o botão voltar vai (padrão: /home)'
  }
};