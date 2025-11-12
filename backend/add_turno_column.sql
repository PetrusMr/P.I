-- Adicionar coluna turno na tabela scans
ALTER TABLE scans ADD COLUMN turno ENUM('manha', 'tarde', 'noite') AFTER data_hora;