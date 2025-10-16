import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(usuario: string, senha: string): Observable<any> {
    console.log('Fazendo login para:', `${this.apiUrl}/login`);
    return this.http.post(`${this.apiUrl}/login`, { usuario, senha });
  }

  loginSupervisor(usuario: string, senha: string): Observable<any> {
    console.log('Fazendo login supervisor para:', `${this.apiUrl}/login-supervisor`);
    return this.http.post(`${this.apiUrl}/login-supervisor`, { usuario, senha });
  }


}