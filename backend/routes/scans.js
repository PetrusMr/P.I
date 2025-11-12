const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'q1w2e3',
  database: process.env.DB_NAME || 'easycontrol'
};

router.post('/salvar-scan', async (req, res) => {
  try {
    const { usuario, tipo_scan, resultado_scan, turno } = req.body;
    
    let turnoFinal = turno;
    
    // Se turno não foi enviado, buscar da reserva ativa
    if (!turnoFinal) {
      const connection = await mysql.createConnection(dbConfig);
      const hoje = new Date().toISOString().split('T')[0];
      
      const [reservas] = await connection.execute(
        'SELECT horario FROM agendamentos WHERE nome = ? AND data = ?',
        [usuario, hoje]
      );
      
      if (reservas.length > 0) {
        turnoFinal = reservas[0].horario;
      } else {
        // Fallback para horário atual
        const hora = new Date().getHours();
        if (hora >= 6 && hora < 12) turnoFinal = 'manha';
        else if (hora >= 13 && hora < 18) turnoFinal = 'tarde';
        else if (hora >= 19 && hora < 22) turnoFinal = 'noite';
      }
      
      await connection.end();
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'INSERT INTO scans (usuario, tipo_scan, resultado_scan, turno) VALUES (?, ?, ?, ?)',
      [usuario, tipo_scan, resultado_scan, turnoFinal]
    );
    
    await connection.end();
    
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Erro ao salvar scan:', error);
    res.status(500).json({ error: 'Erro ao salvar scan' });
  }
});

router.get('/historico', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [results] = await connection.execute(
      'SELECT * FROM scans ORDER BY data_hora DESC'
    );
    
    await connection.end();
    
    res.json({ success: true, historico: results });
  } catch (error) {
    console.error('Erro ao buscar histórico de scans:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

module.exports = router;