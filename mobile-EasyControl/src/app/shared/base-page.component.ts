import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonMenuButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-page',
  template: `
    <div class="ion-page">
      <ion-header>
        <ion-toolbar class="custom-toolbar">
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{pageTitle}}</ion-title>
          <ion-buttons slot="end" *ngIf="showBackButton">
            <ion-button (click)="goBack()">
              <ion-icon name="arrow-undo"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ng-content></ng-content>
      </ion-content>
    </div>
  `,
  styles: [`
    .custom-toolbar {
      --background: #222428 !important;
      background: #222428 !important;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      border-bottom: 3px solid rgb(72, 172, 255);
    }
    ion-title {
      --color: rgb(72, 172, 255) !important;
      color: rgb(72, 172, 255) !important;
    }
    ion-button {
      --color: #ffffff !important;
      color: #ffffff !important;
    }
    ion-icon {
      --color: #ffffff !important;
      color: #ffffff !important;
    }
  `],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonMenuButton, IonIcon, CommonModule]
})
export class BasePageComponent {
  @Input() pageTitle: string = '';
  @Input() showBackButton: boolean = false;
  @Input() backRoute: string = '/home';

  constructor(protected router: Router) {}

  goBack() {
    this.router.navigate([this.backRoute]);
  }
}