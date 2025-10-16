export interface Agendamento {
  id?: number;
  nome: string;
  data: string;
  horario: 'manha' | 'tarde' | 'noite';
  created_at?: string;
}

export interface AgendamentoResponse {
  success: boolean;
  message: string;
  agendamentos?: Agendamento[];
  horarios?: string[];
}