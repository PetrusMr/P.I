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
      console.error('Erro completo:', error);
      console.error('Status:', error.status);
      console.error('Mensagem:', error.error);
      
      if (error.status === 0) {
        throw new Error('Backend não está rodando ou não acessível');
      }
      
      throw new Error(error.error?.error || error.error?.details || 'Erro ao analisar imagem');
    }
  }
}