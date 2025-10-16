export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    USER: 'usuarioLogado',
    SCANS: 'scans',
    THEME: 'theme'
  },
  
  HORARIOS: {
    MANHA: { label: 'Manhã', value: 'manha', inicio: '07:00', fim: '13:00' },
    TARDE: { label: 'Tarde', value: 'tarde', inicio: '13:00', fim: '18:00' },
    NOITE: { label: 'Noite', value: 'noite', inicio: '18:00', fim: '23:00' }
  },
  
  CORES: {
    SUCCESS: 'success',
    WARNING: 'warning', 
    DANGER: 'danger',
    MEDIUM: 'medium',
    PRIMARY: 'primary'
  },
  
  MENSAGENS: {
    LOGIN_SUCESSO: 'Login realizado com sucesso',
    LOGIN_ERRO: 'Usuário ou senha inválidos',
    AGENDAMENTO_SUCESSO: 'Agendamento realizado com sucesso',
    AGENDAMENTO_ERRO: 'Erro ao realizar agendamento',
    SCAN_SUCESSO: 'Scan salvo com sucesso',
    SCAN_ERRO: 'Erro ao salvar scan'
  },
  
  ROBOFLOW: {
    WORKFLOW_ID: 'tt-vwjiq',
    WORKFLOW_NAME: 'find-objects',
    CONFIDENCE_THRESHOLD: 0.5
  }
};