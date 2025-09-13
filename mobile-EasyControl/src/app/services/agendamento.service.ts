import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:3000/api';

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
}