CREATE TABLE IF NOT EXISTS supervisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO supervisor (usuario, senha, nome) VALUES 
('admin', 'admin123', 'Administrador'),
('supervisor', 'super123', 'Supervisor');