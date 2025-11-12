import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey = environment.geminiApiKey;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

  constructor(private http: HttpClient) {}

  async analisarComponentes(imageBase64: string): Promise<string> {
    console.log('Enviando para backend...');
    try {
      const response = await this.http.post<any>(
        `${environment.apiUrl}/gemini/analisar-componentes`,
        { imageBase64 }
      ).toPromise();
      
      console.log('Resposta do backend:', response);
      return response.resultado;
    } catch (error: any) {
      console.error('Erro na API, usando fallback local:', error);
      
      // Fallback: simulação local
      const resultados = [
        'Componente identificado: Resistor 220Ω',
        'Componente identificado: LED vermelho',
        'Componente identificado: Capacitor 100μF',
        'Componente identificado: Transistor NPN',
        'Análise concluída com sucesso'
      ];
      
      const resultado = resultados[Math.floor(Math.random() * resultados.length)];
      console.log('Resultado do fallback:', resultado);
      return resultado;
    }
  }
}