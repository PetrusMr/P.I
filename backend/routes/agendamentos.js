const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Salvar agendamento
router.post('/', (req, res) => {
  const { nome, data, horario } = req.body;
  
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