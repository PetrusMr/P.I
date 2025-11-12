-- Criar tabela para histórico de agendamentos
CREATE TABLE IF NOT EXISTS historico_agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario ENUM('manha', 'tarde', 'noite') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);