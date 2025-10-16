import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  salvarAgendamento(nome: string, data: string, horario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/agendamentos`, {
      nome,
      data,
      horario
    });
  }

  verificarHorariosOcupados(data: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/agendamentos/${data}`);
  }

  buscarAgendamentosPorUsuario(nome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/agendamentos/usuario/${nome}`);
  }

  cancelarAgendamento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agendamentos/${id}`);
  }



  buscarAgendamentoPorDataHorario(data: string, horario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/agendamentos/buscar/${data}/${horario}`);
  }

  buscarTodasReservas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/agendamentos/todas`);
  }
}