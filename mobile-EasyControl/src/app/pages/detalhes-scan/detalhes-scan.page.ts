import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { BasePageComponent } from '../../shared/base-page.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detalhes-scan',
  templateUrl: './detalhes-scan.page.html',
  styleUrls: ['./detalhes-scan.page.scss'],
  standalone: true,
  imports: [CommonModule, BasePageComponent, IonCard, IonCardContent]
})
export class DetalhesScanPage implements OnInit {
  scans: any[] = [];
  usuario = '';
  data = '';
  turno = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'];
      this.data = params['data'];
      this.turno = params['turno'];
      this.carregarScans();
    });
  }

  async carregarScans() {
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/scans/historico`).toPromise();
      if (response.success) {
        this.scans = response.historico.filter((scan: any) => {
          const dataScan = scan.data_hora.split('T')[0];
          return scan.usuario === this.usuario && 
                 dataScan === this.data && 
                 scan.turno === this.turno;
        }).sort((a: any, b: any) => {
          if (a.tipo_scan === 'inicio' && b.tipo_scan === 'fim') return -1;
          if (a.tipo_scan === 'fim' && b.tipo_scan === 'inicio') return 1;
          return 0;
        });
      }
    } catch (error) {
      console.error('Erro ao carregar scans:', error);
    }
  }

  formatarDataHora(dataHora: string): string {
    return new Date(dataHora).toLocaleString('pt-BR');
  }
}