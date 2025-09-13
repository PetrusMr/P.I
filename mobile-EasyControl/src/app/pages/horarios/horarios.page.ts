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

  async selecionarPeriodo(periodo: string) {
    if (!this.periodos[periodo as keyof typeof this.periodos].disponivel) {
      return;
    }
    
    const alert = await this.alertController.create({
      header: 'Confirmar Agendamento',
      message: `Tem certeza que deseja agendar o período da ${periodo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.salvarAgendamento(periodo);
            this.periodos[periodo as keyof typeof this.periodos].ocupado = true;
            this.periodos[periodo as keyof typeof this.periodos].disponivel = false;
          }
        }
      ]
    });
    
    await alert.present();
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
          alert('Horário já está ocupado!');
          // Recarrega os horários para atualizar o estado
          this.verificarHorariosOcupados();
        }
      }
    });
  }
}
