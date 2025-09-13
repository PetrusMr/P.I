USE easycontrol;

-- Adiciona constraint única para impedir dupla reserva no mesmo dia e horário
ALTER TABLE agendamentos 
ADD CONSTRAINT unique_data_horario 
UNIQUE (data, horario);