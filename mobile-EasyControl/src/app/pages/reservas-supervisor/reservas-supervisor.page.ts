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
    }, 10000);
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
    // Calcular semana atual (segunda a sexta)
    const baseDate = this.selectedDate ? new Date(this.selectedDate) : new Date();
    const diaSemana = baseDate.getDay();
    const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
    const inicioSemana = new Date(baseDate);
    inicioSemana.setDate(baseDate.getDate() + diasParaSegunda);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 4);
    
    const dataInicio = inicioSemana.toISOString().split('T')[0];
    const dataFim = fimSemana.toISOString().split('T')[0];
    
    this.agendamentoService.buscarTodasReservas().subscribe({
      next: (response) => {
        console.log('Resposta todas reservas:', response);
        console.log('Filtro semana:', { dataInicio, dataFim });
        if (response.success) {
          const reservasFiltradas = response.reservas
            .filter((reserva: any) => reserva.data >= dataInicio && reserva.data <= dataFim);
          console.log('Reservas filtradas:', reservasFiltradas);
          
          this.reservas = reservasFiltradas.map((reserva: any) => {
              // Tratar data que pode vir como string ISO
              let dataString = reserva.data;
              if (typeof dataString === 'string' && dataString.includes('T')) {
                dataString = dataString.split('T')[0];
              }
              
              const [ano, mes, dia] = dataString.split('-');
              return {
                data: `${dia}/${mes}`,
                nome: reserva.nome,
                horario: reserva.horario
              };
            });
          console.log('Reservas processadas:', this.reservas);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar reservas:', error);
        this.reservas = [];
      }
    });
  }
}