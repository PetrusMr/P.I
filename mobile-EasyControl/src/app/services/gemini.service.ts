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
    console.log('🚀 Enviando para backend...');
    console.log('URL completa:', `${environment.apiUrl}/gemini/analisar-componentes`);
    console.log('Tamanho da imagem:', imageBase64.length);
    
    try {
      // Timeout de 30 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: A análise demorou muito tempo')), 30000)
      );
      
      const requestPromise = this.http.post<any>(
        `${environment.apiUrl}/gemini/analisar-componentes`,
        { imageBase64 },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();
      
      const response = await Promise.race([requestPromise, timeoutPromise]) as any;
      
      console.log('✅ Resposta do backend:', response);
      
      if (!response) {
        throw new Error('Resposta vazia do servidor');
      }
      
      if (!response.success) {
        console.log('❌ Response.success é false:', response);
        // Se o backend retornou um resultado mesmo com success false, usar ele
        if (response.resultado) {
          return response.resultado;
        }
        throw new Error(response.error || response.message || 'Erro na resposta do servidor');
      }
      
      // Usar resultado_scan se resultado não existir
      const resultado = response.resultado || response.resultado_scan || 'Nenhum componente identificado';
      console.log('✅ Retornando resultado:', resultado);
      return resultado;
    } catch (error: any) {
      console.error('❌ Erro na API Gemini:', error);
      console.error('Detalhes do erro:', error.error);
      
      // Melhor tratamento de erros
      if (error.message && error.message.includes('Timeout')) {
        throw new Error('A análise demorou muito tempo. Tente com uma imagem menor.');
      } else if (error.status === 0) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else if (error.status >= 500) {
        throw new Error('Erro no servidor. Tente novamente em alguns minutos.');
      } else if (error.error && error.error.message) {
        throw new Error(error.error.message);
      } else {
        throw new Error('Erro ao analisar imagem. Tente novamente.');
      }
    }
  }
}