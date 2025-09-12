// EXEMPLO: Como criar uma nova página usando o padrão

// 1. HTML da nova página (exemplo-page.html):
/*
<app-base-page pageTitle="Título da Página" [showBackButton]="true" backRoute="/home">
  <!-- Seu conteúdo específico aqui -->
  <div class="meu-conteudo">
    <h2>Conteúdo da página</h2>
    <ion-button>Meu botão</ion-button>
  </div>
</app-base-page>
*/

// 2. TypeScript da nova página (exemplo-page.ts):
/*
import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { BasePageComponent } from '../../shared/base-page.component';

@Component({
  selector: 'app-exemplo',
  templateUrl: 'exemplo.page.html',
  styleUrls: ['exemplo.page.scss'],
  imports: [BasePageComponent, IonButton] // Importe apenas os componentes que você usar
})
export class ExemploPage {
  constructor() {}
}
*/

// Propriedades do BasePageComponent:
// - pageTitle: string - Título que aparece no header
// - showBackButton: boolean - Se deve mostrar botão de voltar (padrão: false)
// - backRoute: string - Rota para onde o botão voltar vai (padrão: '/home')