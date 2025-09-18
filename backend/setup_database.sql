-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS easycontrol;
USE easycontrol;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data VARCHAR(10) NOT NULL,
  horario VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário de teste
INSERT IGNORE INTO usuarios (usuario, senha) VALUES ('admin', 'admin123');
INSERT IGNORE INTO usuarios (usuario, senha) VALUES ('user', '123456');