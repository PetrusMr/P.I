import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons';
import { BasePageComponent } from '../../shared/base-page.component';
import { AgendamentoService } from '../../services/agendamento.service';

@Component({
  selector: 'app-sua-reserva',
  templateUrl: './sua-reserva.page.html',
  styleUrls: ['./sua-reserva.page.scss'],
  standalone: true,
  imports: [BasePageComponent, IonCard, IonCardContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class SuaReservaPage implements OnInit {
  agendamentos: any[] = [];

  constructor(
    private agendamentoService: AgendamentoService,
    private alertController: AlertController
  ) {
    addIcons({ timeOutline });
  }

  ngOnInit() {
    this.carregarAgendamentos();
  }

  ionViewWillEnter() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Usuario';
    const hoje = new Date().toISOString().split('T')[0];
    const horaAtual = new Date().getHours();
    
    this.agendamentoService.buscarAgendamentosPorUsuario(usuarioLogado).subscribe({
      next: (response) => {
        if (response.success) {
          // Filtrar agendamentos de hoje e futuros
          const agendamentosRelevantes = response.agendamentos.filter((ag: any) => ag.data >= hoje);
          
          this.agendamentos = agendamentosRelevantes
            .map((ag: any) => {
              const [ano, mes, dia] = ag.data.split('-');
              const data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
              const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
              
              // Verifica se pode cancelar baseado no horário (apenas para hoje)
              let podeCancelar = true;
              if (ag.data === hoje) {
                podeCancelar = false;
                if ((ag.horario === 'Manhã' || ag.horario === 'manha') && horaAtual < 6) podeCancelar = true;
                if ((ag.horario === 'Tarde' || ag.horario === 'tarde') && horaAtual < 13) podeCancelar = true;
                if ((ag.horario === 'Noite' || ag.horario === 'noite') && horaAtual < 18) podeCancelar = true;
              }
              
              return {
                id: ag.id,
                diaSemana: diasSemana[data.getDay()],
                data: `${dia}/${mes}`,
                periodo: ag.horario.charAt(0).toUpperCase() + ag.horario.slice(1),
                dataCompleta: ag.data,
                horario: ag.horario,
                podeCancelar: podeCancelar
              };
            })
            .filter((ag: any) => ag.podeCancelar || ag.dataCompleta > hoje); // Remove expirados de hoje
        }
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
      }
    });
  }

  async cancelarAgendamento(agendamento: any) {
    const alert = await this.alertController.create({
      header: 'Cancelar Agendamento',
      message: `Tem certeza que deseja cancelar o agendamento de ${agendamento.diaSemana} - ${agendamento.data} - ${agendamento.periodo}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          handler: () => {
            this.agendamentoService.cancelarAgendamento(agendamento.id).subscribe({
              next: (response) => {
                if (response.success) {
                  this.agendamentos = this.agendamentos.filter(a => a.id !== agendamento.id);
                  this.carregarAgendamentos(); // Recarrega a lista
                }
              },
              error: (error) => {
                console.error('Erro ao cancelar agendamento:', error);
              }
            });
          }
        }
      ]
    });
    
    await alert.present();
  }

}
