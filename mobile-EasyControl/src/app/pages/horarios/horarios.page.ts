import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons';
import { BasePageComponent } from '../../shared/base-page.component';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
  standalone: true,
  imports: [BasePageComponent, IonCard, IonCardContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class HorariosPage implements OnInit {
  dataSelecionada = 'Dia 01/05/2025';

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({ timeOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.dataSelecionada = `Dia ${params['data']}`;
      }
    });
  }

  selecionarPeriodo(periodo: string) {
    console.log('Período selecionado:', periodo);
  }
}
