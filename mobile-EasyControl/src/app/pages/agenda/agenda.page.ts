import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonMenu,
  IonMenuButton, IonButtons, IonIcon, IonButton, IonCard, IonCardContent,
  IonItem, IonLabel, IonDatetime } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowUndo, ellipse, calendarOutline } from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-agenda',
  templateUrl: 'agenda.page.html',
  styleUrls: ['agenda.page.scss'],
  imports: [IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, 
           IonMenu, IonMenuButton, IonCard, IonCardContent, IonItem, IonLabel, IonDatetime, CommonModule, FormsModule],
})
export class AgendaPage implements OnInit {
  selectedDate = new Date().toISOString();
  diasSemana: any[] = [];
  mostrarCalendario = false;
  dataAtual = '';

  ngOnInit() {
    this.gerarDiasSemana();
    this.atualizarDataAtual();
  }

  atualizarDataAtual(dataBase?: string) {
    const baseDate = dataBase ? new Date(dataBase) : new Date();
    const diaSemana = baseDate.getDay();
    const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
    const inicioSemana = new Date(baseDate);
    inicioSemana.setDate(baseDate.getDate() + diasParaSegunda);
    
    const dia = inicioSemana.getDate().toString().padStart(2, '0');
    const mes = (inicioSemana.getMonth() + 1).toString().padStart(2, '0');
    const ano = inicioSemana.getFullYear();
    
    this.dataAtual = `${dia}/${mes}/${ano}`;
  }

  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.mostrarCalendario = false;
    this.gerarDiasSemana(this.selectedDate);
    this.atualizarDataAtual(this.selectedDate);
  }

  gerarDiasSemana(dataBase?: string) {
    this.diasSemana = [];
    
    const baseDate = dataBase ? new Date(dataBase) : new Date();
    const diasNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    const inicioSemana = new Date(baseDate);
    const diaSemana = baseDate.getDay();
    const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
    inicioSemana.setDate(baseDate.getDate() + diasParaSegunda);
    
    for (let i = 0; i < 5; i++) {
      const data = new Date(inicioSemana);
      data.setDate(inicioSemana.getDate() + i);
      
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      
      this.diasSemana.push({
        nome: diasNomes[data.getDay()],
        data: `${dia}/${mes}`
      });
    }
  }

  constructor(private router: Router) {
    addIcons({ arrowUndo, ellipse, calendarOutline });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
