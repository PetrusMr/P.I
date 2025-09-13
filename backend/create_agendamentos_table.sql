USE easycontrol;

CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data VARCHAR(10) NOT NULL,
  horario VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO agendamentos (nome, data, horario) VALUES 
('João Silva', '09/12', 'manha'),
('Maria Santos', '10/12', 'tarde');