-- Criar tabela para armazenar os scans de componentes
CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_scan ENUM('inicio', 'fim') NOT NULL,
    resultado_scan TEXT NOT NULL
);