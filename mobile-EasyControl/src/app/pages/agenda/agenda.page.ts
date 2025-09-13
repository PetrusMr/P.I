import { Component, OnInit } from '@angular/core';
import { IonIcon, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonDatetime } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowUndo, ellipse, calendarOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { BasePageComponent } from '../../shared/base-page.component';
import { AgendamentoService } from '../../services/agendamento.service';


@Component({
  selector: 'app-agenda',
  templateUrl: 'agenda.page.html',
  styleUrls: ['agenda.page.scss'],
  imports: [BasePageComponent, IonIcon, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonDatetime, CommonModule, FormsModule],
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

  ionViewWillEnter() {
    this.verificarDisponibilidade();
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
      const ano = data.getFullYear();
      
      this.diasSemana.push({
        nome: diasNomes[data.getDay()],
        data: `${dia}/${mes}`,
        dataCompleta: `${ano}-${mes}-${dia}`,
        cor: 'success'
      });
    }
    
    this.verificarDisponibilidade();
  }

  constructor(private router: Router, private agendamentoService: AgendamentoService) {
    addIcons({ arrowUndo, ellipse, calendarOutline });
  }

  verificarDisponibilidade() {
    this.diasSemana.forEach(dia => {
      this.agendamentoService.verificarHorariosOcupados(dia.dataCompleta).subscribe({
        next: (response) => {
          const horariosOcupados = response.success ? response.horarios.length : 0;
          
          if (horariosOcupados === 0) {
            dia.cor = 'success';
          } else if (horariosOcupados === 3) {
            dia.cor = 'danger';
          } else {
            dia.cor = 'warning';
          }
        },
        error: () => {
          dia.cor = 'success';
        }
      });
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  irParaHorarios(dia: any) {
    console.log('Clicou no dia:', dia);
    this.router.navigate(['/horarios'], {
      queryParams: {
        dia: dia.nome,
        data: dia.dataCompleta
      }
    });
  }
}
