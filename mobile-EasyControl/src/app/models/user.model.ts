export interface User {
  id?: number;
  usuario: string;
  senha: string;
  nome?: string;
  email?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}