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
    
    // Atualizar disponibilidade a cada minuto
    setInterval(() => {
      this.verificarDisponibilidade();
    }, 60000);
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
      
      const hoje = new Date().toISOString().split('T')[0];
      const isDataAnterior = `${ano}-${mes}-${dia}` < hoje;
      
      this.diasSemana.push({
        nome: diasNomes[data.getDay()],
        data: `${dia}/${mes}`,
        dataCompleta: `${ano}-${mes}-${dia}`,
        cor: 'success',
        desabilitado: isDataAnterior
      });
    }
    
    this.verificarDisponibilidade();
  }

  constructor(private router: Router, private agendamentoService: AgendamentoService) {
    addIcons({ arrowUndo, ellipse, calendarOutline });
  }

  verificarDisponibilidade() {
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    this.diasSemana.forEach(dia => {
      // Dias anteriores: vermelho e desabilitado
      if (dia.dataCompleta < hoje) {
        dia.cor = 'danger';
        dia.desabilitado = true;
        return;
      }
      
      // Se é hoje, verificar se todos os horários já passaram
      if (dia.dataCompleta === hoje && horaAtual >= 18) {
        dia.cor = 'danger';
        dia.desabilitado = true;
        return;
      }
      
      // Para datas futuras, sempre permitir acesso
      if (dia.dataCompleta > hoje) {
        dia.desabilitado = false;
      }
      
      // Verificar quantas reservas existem
      this.agendamentoService.verificarHorariosOcupados(dia.dataCompleta).subscribe({
        next: (response) => {
          let horariosOcupados = response.success ? response.horarios.length : 0;
          
          // Se é hoje, contar horários que já passaram como ocupados
          if (dia.dataCompleta === hoje) {
            if (horaAtual >= 7) horariosOcupados++; // manhã passou
            if (horaAtual >= 13) horariosOcupados++; // tarde passou
            if (horaAtual >= 18) horariosOcupados++; // noite passou
          }
          // Para datas futuras, não adicionar horários expirados
          
          if (horariosOcupados === 0) {
            dia.cor = 'success'; // Verde: todos disponíveis
          } else if (horariosOcupados >= 3) {
            dia.cor = 'danger'; // Vermelho: todos ocupados
          } else {
            dia.cor = 'warning'; // Amarelo: parcialmente ocupado
          }
        },
        error: () => {
          // Se é hoje, verificar horários expirados
          if (dia.dataCompleta === hoje) {
            let horariosExpirados = 0;
            if (horaAtual >= 7) horariosExpirados++;
            if (horaAtual >= 13) horariosExpirados++;
            if (horaAtual >= 18) horariosExpirados++;
            
            if (horariosExpirados === 0) {
              dia.cor = 'success';
            } else if (horariosExpirados >= 3) {
              dia.cor = 'danger';
            } else {
              dia.cor = 'warning';
            }
          } else {
            dia.cor = 'success';
          }
        }
      });
    });
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  irParaHorarios(dia: any) {
    if (dia.desabilitado) {
      return; // Não permite navegar para datas anteriores
    }
    
    console.log('Clicou no dia:', dia);
    this.router.navigate(['/horarios'], {
      queryParams: {
        dia: dia.nome,
        data: dia.dataCompleta
      }
    });
  }

  irParaSuaAgenda() {
    this.router.navigate(['/sua-reserva']);
  }
}
