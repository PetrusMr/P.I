import { Component } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { atOutline, barcode, calendar, camera, image, list, logoFacebook, logoInstagram, logoTiktok, logoWhatsapp } from 'ionicons/icons';
import { Router } from '@angular/router';
import { BasePageComponent } from '../../shared/base-page.component';

 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [BasePageComponent, IonButton, IonIcon],
})
export class HomePage {
  imagemSelecionada: string | undefined;

  constructor(
    private router: Router
  ) {
    addIcons({camera, calendar, barcode, image, list, logoFacebook, logoInstagram, logoTiktok, logoWhatsapp })
  }

  irParaAgenda() {
    this.router.navigate(['/agenda']);
  }

  async abrirCamera() {
    this.router.navigate(['/controle-sala']);
  }



  async abrirGaleria() {
    this.router.navigate(['/controle-sala']);
  }

  isActionSheetOpen = false;
  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Share',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
 
  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }



}
