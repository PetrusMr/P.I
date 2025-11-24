import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonIcon, IonButton, IonCard, IonCardContent, IonDatetime } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';
import { BasePageComponent } from '../../shared/base-page.component';
import { AgendamentoService } from '../../services/agendamento.service';

@Component({
  selector: 'app-reservas-supervisor',
  templateUrl: './reservas-supervisor.page.html',
  styleUrls: ['./reservas-supervisor.page.scss'],
  standalone: true,
  imports: [BasePageComponent, IonIcon, IonButton, IonCard, IonCardContent, IonDatetime, CommonModule, FormsModule]
})
export class ReservasSupervisorPage implements OnInit, OnDestroy {
  selectedDate = new Date().toISOString();
  mostrarCalendario = false;
  dataAtual = '';
  reservas: any[] = [];
  private intervalId: any;

  constructor(private agendamentoService: AgendamentoService) {
    addIcons({ calendarOutline });
  }

  ngOnInit() {
    this.atualizarDataAtual();
    this.carregarReservas();
    this.intervalId = setInterval(() => {
      this.carregarReservas();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
    this.atualizarDataAtual(this.selectedDate);
    this.carregarReservas();
  }

  carregarReservas() {
    this.agendamentoService.buscarTodasReservas().subscribe({
      next: (response) => {
        console.log('Resposta todas reservas:', response);
        if (response.success && response.reservas) {
          this.reservas = response.reservas.map((reserva: any) => {
            let dataString = reserva.data;
            if (typeof dataString === 'string' && dataString.includes('T')) {
              dataString = dataString.split('T')[0];
            }
            
            const [ano, mes, dia] = dataString.split('-');
            return {
              id: reserva.id,
              data: `${dia}/${mes}/${ano}`,
              nome: reserva.nome,
              horario: reserva.horario
            };
          });
          console.log('Reservas processadas:', this.reservas);
        } else {
          this.carregarReservasLocal();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar reservas:', error);
        this.carregarReservasLocal();
      }
    });
  }

  carregarReservasLocal() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    this.reservas = agendamentos
      .filter((agendamento: any) => {
        const dataAgendamento = new Date(agendamento.data);
        return dataAgendamento >= hoje;
      })
      .map((agendamento: any) => {
        const [ano, mes, dia] = agendamento.data.split('-');
        return {
          id: agendamento.id || Date.now(),
          data: `${dia}/${mes}/${ano}`,
          nome: agendamento.nome,
          horario: agendamento.horario
        };
      });
    
    console.log('Reservas do localStorage:', this.reservas);
  }
}