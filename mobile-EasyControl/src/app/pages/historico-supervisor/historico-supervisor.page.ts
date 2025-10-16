import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonIcon, IonButton, IonCard, IonCardContent, IonDatetime } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';
import { BasePageComponent } from '../../shared/base-page.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-historico-supervisor',
  templateUrl: './historico-supervisor.page.html',
  styleUrls: ['./historico-supervisor.page.scss'],
  standalone: true,
  imports: [BasePageComponent, IonIcon, IonButton, IonCard, IonCardContent, IonDatetime, CommonModule, FormsModule]
})
export class HistoricoSupervisorPage implements OnInit, OnDestroy {
  selectedDate = new Date().toISOString();
  mostrarCalendario = false;
  dataAtual = '';
  historico: any[] = [];
  private intervalId: any;

  constructor(private http: HttpClient, private router: Router) {
    addIcons({ calendarOutline });
  }

  ngOnInit() {
    this.atualizarDataAtual();
    this.carregarHistorico();
    this.intervalId = setInterval(() => {
      this.carregarHistorico();
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
    this.carregarHistorico();
  }

  async carregarHistorico() {
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/agendamentos/lista/historico`).toPromise();
      
      if (response.success) {
        const baseDate = this.selectedDate ? new Date(this.selectedDate) : new Date();
        const diaSemana = baseDate.getDay();
        const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
        const inicioSemana = new Date(baseDate);
        inicioSemana.setDate(baseDate.getDate() + diasParaSegunda);
        
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 4);
        
        const dataInicio = inicioSemana.toISOString().split('T')[0];
        const dataFim = fimSemana.toISOString().split('T')[0];
        
        // Filtrar por semana
        const historicoFiltrado = response.historico.filter((reserva: any) => {
          const dataReserva = new Date(reserva.data).toISOString().split('T')[0];
          return dataReserva >= dataInicio && dataReserva <= dataFim;
        });
        
        // Converter formato da data
        this.historico = historicoFiltrado.map((reserva: any) => {
          const data = new Date(reserva.data);
          const dia = data.getDate().toString().padStart(2, '0');
          const mes = (data.getMonth() + 1).toString().padStart(2, '0');
          return {
            data: `${dia}/${mes}`,
            nome: reserva.nome,
            horario: reserva.horario
          };
        });
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      this.historico = [];
    }
  }

  formatarData(data: string): string {
    const [dia, mes] = data.split('/');
    return `${dia}/${mes}`;
  }

  async verScans(reserva: any) {
    // Converter data de dd/mm para yyyy-mm-dd
    const [dia, mes] = reserva.data.split('/');
    const ano = new Date().getFullYear();
    const dataCompleta = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/scans/usuario/${reserva.nome}/${dataCompleta}/${reserva.horario}`).toPromise();
      
      if (response.success) {
        const params = {
          usuario: reserva.nome,
          data: dataCompleta,
          turno: reserva.horario,
          scans: JSON.stringify(response.scans)
        };
        
        console.log('Navegando para detalhes com scans:', params);
        this.router.navigate(['/detalhes-scan'], { queryParams: params });
      }
    } catch (error) {
      console.error('Erro ao buscar scans:', error);
      // Em caso de erro, navegar com "Não scaneado"
      const params = {
        usuario: reserva.nome,
        data: dataCompleta,
        turno: reserva.horario,
        scans: JSON.stringify([{ 
          usuario: reserva.nome, 
          tipo_scan: 'nenhum', 
          resultado_scan: 'Não scaneado', 
          data_hora: dataCompleta + ' 00:00:00' 
        }])
      };
      this.router.navigate(['/detalhes-scan'], { queryParams: params });
    }
  }




}