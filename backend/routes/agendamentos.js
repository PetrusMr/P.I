const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Função para limpar agendamentos expirados
function limparAgendamentosExpirados() {
  const hoje = new Date();
  const dataAtual = hoje.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaAtual = hoje.getHours();
  
  let condicaoHorario = '';
  if (horaAtual >= 18) {
    // Após 18h, remove todos os períodos do dia
    condicaoHorario = "data < ?";
  } else if (horaAtual >= 13) {
    // Após 13h, remove manhã e tarde de hoje
    condicaoHorario = "(data < ? OR (data = ? AND horario IN ('manha', 'tarde')))";
  } else if (horaAtual >= 7) {
    // Após 7h, remove apenas manhã de hoje
    condicaoHorario = "(data < ? OR (data = ? AND horario = 'manha'))";
  } else {
    // Antes das 7h, remove apenas dias anteriores
    condicaoHorario = "data < ?";
  }
  
  const query = `DELETE FROM agendamentos WHERE ${condicaoHorario}`;
  const params = horaAtual >= 13 && horaAtual < 18 ? [dataAtual, dataAtual] : [dataAtual];
  
  db.query(query, params, (err) => {
    if (err) {
      console.error('Erro ao limpar agendamentos expirados:', err);
    }
  });
}

// Salvar agendamento
router.post('/', (req, res) => {
  const { nome, data, horario } = req.body;
  
  // Limpar agendamentos expirados antes de salvar
  limparAgendamentosExpirados();
  
  const query = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
  
  db.query(query, [nome, data, horario], (err, result) => {
    if (err) {
      console.error('Erro ao salvar agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, message: 'Agendamento salvo com sucesso' });
  });
});

// Verificar horários ocupados
router.get('/:data', (req, res) => {
  const { data } = req.params;
  
  // Limpar agendamentos expirados antes de consultar
  limparAgendamentosExpirados();
  
  const query = 'SELECT horario FROM agendamentos WHERE data = ?';
  
  db.query(query, [data], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    const horarios = results.map(row => row.horario);
    res.json({ success: true, horarios });
  });
});

module.exports = router;