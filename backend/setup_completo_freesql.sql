-- Script completo para FreeSQLDatabase
-- Execute este script na ordem apresentada

-- 1. Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);

-- 2. Tabela de supervisor
CREATE TABLE supervisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);

-- 3. Tabela de agendamentos
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    horario ENUM('manha', 'tarde', 'noite') NOT NULL,
    UNIQUE KEY unique_agendamento (data, horario)
);

-- 4. Tabela de histórico
CREATE TABLE historico_agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    horario ENUM('manha', 'tarde', 'noite') NOT NULL
);

-- 5. Tabela de scans
CREATE TABLE scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    tipo_scan ENUM('inicio', 'fim') NOT NULL,
    resultado_scan TEXT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Inserir dados iniciais
INSERT INTO usuarios (usuario, senha) VALUES 
('admin', 'admin123'),
('user1', 'pass123');

INSERT INTO supervisor (usuario, senha) VALUES 
('supervisor', 'super123');