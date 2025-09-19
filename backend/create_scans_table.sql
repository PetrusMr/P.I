CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    turno ENUM('manha', 'tarde', 'noite') NOT NULL,
    hora_scan TIME NOT NULL,
    data_scan DATE NOT NULL,
    quantidade INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);