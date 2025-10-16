import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons';
import { BasePageComponent } from '../../shared/base-page.component';
import { AgendamentoService } from '../../services/agendamento.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
  standalone: true,
  imports: [BasePageComponent, IonCard, IonCardContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class HorariosPage implements OnInit {
  dataSelecionada = 'Dia 01/05/2025';
  diaAtual = '';
  dataAtual = '';
  mostrarConfirmacao = false;
  mensagemConfirmacao = '';
  periodoSelecionado = '';
  
  periodos = {
    manha: { disponivel: true, ocupado: false },
    tarde: { disponivel: true, ocupado: false },
    noite: { disponivel: true, ocupado: false }
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private agendamentoService: AgendamentoService,
    private alertController: AlertController
  ) {
    addIcons({ timeOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['dia'] && params['data']) {
        this.dataSelecionada = `${params['dia']} - ${params['data']}`;
        this.diaAtual = params['dia'];
        this.dataAtual = params['data'];
        this.verificarHorariosOcupados();
      } else if (params['data']) {
        this.dataSelecionada = `Dia ${params['data']}`;
        this.dataAtual = params['data'];
        this.verificarHorariosOcupados();
      }
    });
    
    // Atualizar a cada minuto para verificar horários expirados
    setInterval(() => {
      this.verificarPeriodosExpirados();
    }, 60000);
  }

  verificarHorariosOcupados() {
    if (!this.dataAtual) {
      console.log('Data atual não definida');
      return;
    }
    
    // Reset todos os períodos para disponível
    this.periodos.manha = { disponivel: true, ocupado: false };
    this.periodos.tarde = { disponivel: true, ocupado: false };
    this.periodos.noite = { disponivel: true, ocupado: false };
    
    // Verificar se é hoje e desabilitar períodos expirados
    this.verificarPeriodosExpirados();
    
    const dataFormatada = this.dataAtual;
    console.log('Consultando API para data:', dataFormatada);
    
    this.agendamentoService.verificarHorariosOcupados(dataFormatada).subscribe({
      next: (response) => {
        console.log('Resposta completa da API:', response);
        if (response && response.success && response.horarios && response.horarios.length > 0) {
          console.log('Horários ocupados encontrados:', response.horarios);
          response.horarios.forEach((horario: string) => {
            console.log('Processando horário:', horario);
            if (this.periodos[horario as keyof typeof this.periodos]) {
              this.periodos[horario as keyof typeof this.periodos].ocupado = true;
              this.periodos[horario as keyof typeof this.periodos].disponivel = false;
              console.log(`${horario} marcado como ocupado`);
            }
          });
        } else {
          console.log('Nenhum horário ocupado encontrado');
        }
        console.log('Estado final:', this.periodos);
      },
      error: (error) => {
        console.error('Erro na consulta:', error);
      }
    });
  }

  verificarPeriodosExpirados() {
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    const horaAtual = hoje.getHours();
    
    // dataAtual já está no formato YYYY-MM-DD
    const dataComparacao = this.dataAtual;
    
    // Apenas bloquear se for hoje E o horário já passou
    if (dataComparacao === dataHoje) {
      if (horaAtual >= 7) {
        this.periodos.manha.disponivel = false;
        this.periodos.manha.ocupado = true;
      }
      if (horaAtual >= 13) {
        this.periodos.tarde.disponivel = false;
        this.periodos.tarde.ocupado = true;
      }
      if (horaAtual >= 18) {
        this.periodos.noite.disponivel = false;
        this.periodos.noite.ocupado = true;
      }
    }
    // Se é data passada, desabilitar todos
    else if (dataComparacao < dataHoje) {
      this.periodos.manha.disponivel = false;
      this.periodos.manha.ocupado = true;
      this.periodos.tarde.disponivel = false;
      this.periodos.tarde.ocupado = true;
      this.periodos.noite.disponivel = false;
      this.periodos.noite.ocupado = true;
    }
    // Para datas futuras, manter todos disponíveis (serão verificados pela API)
  }

  selecionarPeriodo(periodo: string) {
    if (!this.periodos[periodo as keyof typeof this.periodos].disponivel) {
      return;
    }
    
    this.periodoSelecionado = periodo;
    this.mensagemConfirmacao = `Tem certeza que deseja agendar o período da ${periodo}?`;
    this.mostrarConfirmacao = true;
  }

  confirmarAgendamento() {
    this.salvarAgendamento(this.periodoSelecionado);
    this.periodos[this.periodoSelecionado as keyof typeof this.periodos].ocupado = true;
    this.periodos[this.periodoSelecionado as keyof typeof this.periodos].disponivel = false;
    this.mostrarConfirmacao = false;
  }

  cancelarAgendamento() {
    this.mostrarConfirmacao = false;
  }

  salvarAgendamento(periodo: string) {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Usuário';
    const dataFormatada = `${this.dataAtual}`;
    
    this.agendamentoService.salvarAgendamento(usuarioLogado, dataFormatada, periodo).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Agendamento salvo com sucesso');
        }
      },
      error: (error) => {
        console.error('Erro ao salvar agendamento:', error);
        if (error.status === 400) {
          // Recarrega os horários para atualizar o estado
          this.verificarHorariosOcupados();
        }
      }
    });
  }
}
