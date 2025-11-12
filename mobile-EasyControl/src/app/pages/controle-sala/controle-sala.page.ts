import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonButton, LoadingController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BasePageComponent } from '../../shared/base-page.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GeminiService } from '../../services/gemini.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-controle-sala',
  templateUrl: 'controle-sala.page.html',
  styleUrls: ['controle-sala.page.scss'],
  imports: [BasePageComponent, IonButton, CommonModule],
})
export class ControleSalaPage implements OnInit, OnDestroy {
  mostrarResultado = false;
  mensagemResultado = '';
  isErro = false;
  tipoScanAtual = '';
  sessaoIniciada = false;
  temReservaAtiva = false;
  cicloFinalizado = false;
  private intervalId: any;

  constructor(
    private geminiService: GeminiService,
    private loadingController: LoadingController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.verificarEstadoSessao();
    this.verificarReservaAtiva();
    
    // Verificar a cada 3 segundos se ainda está no horário correto
    this.intervalId = setInterval(() => {
      this.verificarReservaAtiva();
      this.verificarCicloAtual();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  verificarEstadoSessao() {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      const sessaoKey = `sessao_${usuario}`;
      const sessaoSalva = localStorage.getItem(sessaoKey);
      this.sessaoIniciada = sessaoSalva === 'true';
      
      this.verificarCicloAtual();
    }
  }

  verificarCicloAtual() {
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) return;
    
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date();
    const horaAtual = agora.getHours();
    
    let horarioAtual = '';
    if (horaAtual >= 6 && horaAtual < 12) {
      horarioAtual = 'manha';
    } else if (horaAtual >= 13 && horaAtual < 18) {
      horarioAtual = 'tarde';
    } else if (horaAtual >= 19 && horaAtual < 22) {
      horarioAtual = 'noite';
    }
    
    const cicloKey = `ciclo_${usuario}_${hoje}_${horarioAtual}`;
    const cicloSalvo = localStorage.getItem(cicloKey);
    this.cicloFinalizado = cicloSalvo === 'true';
  }

  async verificarReservaAtiva() {
    const usuario = localStorage.getItem('usuarioLogado');
    console.log('Verificando reserva para usuario:', usuario);
    
    if (!usuario) {
      this.temReservaAtiva = false;
      console.log('Nenhum usuario logado');
      return;
    }

    try {
      const url = `${environment.apiUrl}/agendamentos/ativo/${usuario}`;
      console.log('Fazendo requisição para:', url);
      
      const response = await this.http.get<any>(url).toPromise();
      console.log('Resposta da API:', response);
      
      if (response && response.temAgendamento && response.agendamento) {
        // Para teste, sempre liberar se tem reserva
        this.temReservaAtiva = true;
        console.log('✅ RESERVA ENCONTRADA - SCAN LIBERADO');
      } else {
        console.log('❌ Sem agendamento ativo');
        this.temReservaAtiva = false;
      }
      
      console.log('temReservaAtiva final:', this.temReservaAtiva);
    } catch (error) {
      console.error('❌ Erro ao verificar reserva ativa:', error);
      console.log('Tentando fallback localStorage...');
      
      // Fallback: verificar localStorage
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const hoje = new Date().toISOString().split('T')[0];
      const temReservaLocal = agendamentos.some((a: any) => 
        a.nome === usuario && a.data === hoje
      );
      
      this.temReservaAtiva = temReservaLocal;
      console.log('Fallback localStorage:', temReservaLocal);
    }
  }

  async iniciarSessao() {
    if (!this.temReservaAtiva) {
      await this.verificarEMostrarMensagem();
      return;
    }
    this.tipoScanAtual = 'inicio';
    await this.abrirCamera();
  }

  async finalizarSessao() {
    if (!this.temReservaAtiva) {
      await this.verificarEMostrarMensagem();
      return;
    }
    this.tipoScanAtual = 'fim';
    await this.abrirCamera();
  }

  private async verificarEMostrarMensagem() {
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) return;

    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/agendamentos/ativo/${usuario}`).toPromise();
      
      if (!response.temAgendamento || !response.agendamento) {
        this.mostrarPopup('Você não tem reserva para hoje.', true);
        return;
      }

      const agora = new Date();
      const horaAtual = agora.getHours();
      const horarioReserva = response.agendamento.horario;
      
      let mensagem = '';
      
      if (horarioReserva === 'manha') {
        if (horaAtual < 6) {
          mensagem = 'Sua reserva é para a manhã (6h-12h). Ainda não é horário.';
        } else if (horaAtual >= 12) {
          mensagem = 'Sua reserva da manhã (6h-12h) já expirou.';
        }
      } else if (horarioReserva === 'tarde') {
        if (horaAtual < 13) {
          mensagem = 'Sua reserva é para a tarde (13h-18h). Ainda não é horário.';
        } else if (horaAtual >= 18) {
          mensagem = 'Sua reserva da tarde (13h-18h) já expirou.';
        }
      } else if (horarioReserva === 'noite') {
        if (horaAtual < 19) {
          mensagem = 'Sua reserva é para a noite (19h-22h). Ainda não é horário.';
        } else if (horaAtual >= 22) {
          mensagem = 'Sua reserva da noite (19h-22h) já expirou.';
        }
      }
      
      this.mostrarPopup(mensagem, true);
    } catch (error) {
      this.mostrarPopup('Erro ao verificar reserva.', true);
    }
  }

  private async abrirCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 30,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 800,
        height: 600
      });
      
      if (image.base64String) {
        await this.analisarImagem(image.base64String);
      }
    } catch (error) {
      console.error('Erro ao abrir câmera:', error);
    }
  }

  private async analisarImagem(base64: string) {
    if (!base64 || base64.length < 100) {
      this.mostrarPopup('Imagem inválida. Tente capturar novamente.', true);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Analisando componentes...'
    });
    await loading.present();

    try {
      const resultado = await this.geminiService.analisarComponentes(base64);
      await loading.dismiss();
      this.mostrarPopup(resultado, false);
    } catch (error: any) {
      await loading.dismiss();
      this.mostrarPopup(error.message || 'Erro desconhecido. Tente novamente.', true);
    }
  }

  mostrarPopup(mensagem: string, erro: boolean) {
    this.mensagemResultado = mensagem;
    this.isErro = erro;
    this.mostrarResultado = true;
  }

  fecharResultado() {
    this.mostrarResultado = false;
  }

  async salvar() {
    const usuario = localStorage.getItem('usuarioLogado') || 'usuario_desconhecido';
    
    console.log('💾 Salvando scan:', this.tipoScanAtual);
    console.log('👤 Usuário:', usuario);
    
    // Buscar turno da reserva ativa
    let turno = '';
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/agendamentos/ativo/${usuario}`).toPromise();
      if (response && response.temAgendamento && response.agendamento) {
        turno = response.agendamento.horario;
      }
    } catch (error) {
      console.error('Erro ao buscar turno:', error);
    }
    
    // Salvar no banco
    try {
      const response = await this.http.post(`${environment.apiUrl}/scans/salvar-scan`, {
        usuario: usuario,
        tipo_scan: this.tipoScanAtual,
        resultado_scan: this.mensagemResultado,
        turno: turno
      }).toPromise();
      
      console.log('✅ Scan salvo no banco:', response);
    } catch (error) {
      console.error('❌ Erro ao salvar no banco:', error);
      console.log('💾 Salvando apenas localmente...');
    }
    
    if (this.tipoScanAtual === 'inicio') {
      this.sessaoIniciada = true;
      const sessaoKey = `sessao_${usuario}`;
      localStorage.setItem(sessaoKey, 'true');
      console.log('🟢 Sessão INICIADA');
    } else if (this.tipoScanAtual === 'fim') {
      this.sessaoIniciada = false;
      this.cicloFinalizado = true;
      
      const hoje = new Date().toISOString().split('T')[0];
      const agora = new Date();
      const horaAtual = agora.getHours();
      
      let horarioAtual = '';
      if (horaAtual >= 6 && horaAtual < 12) {
        horarioAtual = 'manha';
      } else if (horaAtual >= 13 && horaAtual < 18) {
        horarioAtual = 'tarde';
      } else if (horaAtual >= 19 && horaAtual < 22) {
        horarioAtual = 'noite';
      }
      
      const sessaoKey = `sessao_${usuario}`;
      const cicloKey = `ciclo_${usuario}_${hoje}_${horarioAtual}`;
      localStorage.removeItem(sessaoKey);
      localStorage.setItem(cicloKey, 'true');
      console.log('🔴 Sessão FINALIZADA');
    }
    
    console.log('📊 Estado atual:');
    console.log('- sessaoIniciada:', this.sessaoIniciada);
    console.log('- cicloFinalizado:', this.cicloFinalizado);
    
    this.fecharResultado();
  }

  clickarNao() {
    if (this.isErro) {
      this.fecharResultado();
    } else {
      this.fecharResultado();
      this.abrirCamera();
    }
  }
}