const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Criar conexão com o banco
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'q1w2e3',
  database: process.env.DB_NAME || 'easycontrol'
});

// Testar conexão
db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco nas rotas:', err);
  } else {
    console.log('✅ Rotas de agendamentos conectadas ao MySQL');
  }
});

// Função para mover agendamentos expirados para histórico
function moverParaHistorico() {
  const hoje = new Date();
  const dataAtual = hoje.toISOString().split('T')[0];
  const horaAtual = hoje.getHours();
  
  let condicaoHorario = '';
  let params = [];
  
  if (horaAtual >= 22) {
    condicaoHorario = "data < ?";
    params = [dataAtual];
  } else if (horaAtual >= 18) {
    condicaoHorario = "(data < ? OR (data = ? AND horario IN ('manha', 'tarde')))";
    params = [dataAtual, dataAtual];
  } else if (horaAtual >= 12) {
    condicaoHorario = "(data < ? OR (data = ? AND horario = 'manha'))";
    params = [dataAtual, dataAtual];
  } else {
    condicaoHorario = "data < ?";
    params = [dataAtual];
  }
  
  // Primeiro, mover para histórico
  const selectQuery = `SELECT * FROM agendamentos WHERE ${condicaoHorario}`;
  
  db.query(selectQuery, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos expirados:', err);
      return;
    }
    
    if (results.length > 0) {
      results.forEach(agendamento => {
        // Salvar no histórico
        const historicoQuery = 'INSERT IGNORE INTO historico_agendamentos (nome, data, horario) VALUES (?, ?, ?)';
        db.query(historicoQuery, [agendamento.nome, agendamento.data, agendamento.horario], (historicoErr) => {
          if (historicoErr) {
            console.error('Erro ao salvar no histórico:', historicoErr);
          }
        });
        
        // Verificar se já existe scan para este agendamento
        const checkScanQuery = 'SELECT COUNT(*) as count FROM scans WHERE usuario = ? AND DATE(data_hora) = ? AND turno = ?';
        db.query(checkScanQuery, [agendamento.nome, agendamento.data, agendamento.horario], (scanErr, scanResults) => {
          if (!scanErr && scanResults[0].count === 0) {
            // Não existe scan, criar "não feito"
            const insertScanQuery = 'INSERT INTO scans (usuario, tipo_scan, resultado_scan, turno, data_hora) VALUES (?, ?, ?, ?, ?)';
            const dataHora = `${agendamento.data} 23:59:59`;
            db.query(insertScanQuery, [agendamento.nome, 'nao_feito', 'Não scaneado', agendamento.horario, dataHora]);
          }
        });
      });
      
      // Depois, remover da tabela principal
      const deleteQuery = `DELETE FROM agendamentos WHERE ${condicaoHorario}`;
      db.query(deleteQuery, params, (deleteErr) => {
        if (deleteErr) {
          console.error('Erro ao remover agendamentos expirados:', deleteErr);
        }
      });
    }
  });
}

// Buscar histórico de agendamentos
router.get('/lista/historico', (req, res) => {
  console.log('🔍 Rota /historico acessada');
  
  // Primeiro, mover agendamentos expirados para histórico
  moverParaHistorico();
  
  const query = 'SELECT nome, data, horario FROM historico_agendamentos ORDER BY data DESC, horario';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar histórico:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    console.log(`📊 Registros encontrados no histórico: ${results.length}`);
    if (results.length > 0) {
      console.log('📋 Primeiro registro:', results[0]);
    }
    
    res.json({ success: true, historico: results });
  });
});

// Salvar agendamento
router.post('/', (req, res) => {
  const { nome, data, horario } = req.body;
  
  // Verificar se já existe reserva para este horário
  const checkQuery = 'SELECT COUNT(*) as count FROM agendamentos WHERE data = ? AND horario = ?';
  
  db.query(checkQuery, [data, horario], (err, results) => {
    if (err) {
      console.error('Erro ao verificar conflito:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results[0].count > 0) {
      return res.status(400).json({ success: false, message: 'Horário já ocupado' });
    }
    
    const query = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
    
    db.query(query, [nome, data, horario], (err, result) => {
      if (err) {
        console.error('Erro ao salvar agendamento:', err);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
      }
      
      res.json({ success: true, message: 'Agendamento salvo com sucesso' });
    });
  });
});

// Verificar agendamento ativo do usuário
router.get('/ativo/:usuario', (req, res) => {
  const { usuario } = req.params;
  const hoje = new Date().toISOString().split('T')[0];
  
  const query = 'SELECT * FROM agendamentos WHERE nome = ? AND data = ?';
  
  db.query(query, [usuario, hoje], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamento ativo:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results.length > 0) {
      res.json({ 
        temAgendamento: true, 
        agendamento: results[0] 
      });
    } else {
      res.json({ 
        temAgendamento: false, 
        agendamento: null 
      });
    }
  });
});

// Buscar agendamentos por usuário
router.get('/usuario/:nome', (req, res) => {
  const { nome } = req.params;
  
  const query = 'SELECT * FROM agendamentos WHERE nome = ? ORDER BY data, horario';
  
  db.query(query, [nome], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos do usuário:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, agendamentos: results });
  });
});

// Cancelar agendamento
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM agendamentos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao cancelar agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Agendamento cancelado com sucesso' });
    } else {
      res.json({ success: false, message: 'Agendamento não encontrado' });
    }
  });
});

// Verificar horários ocupados (DEVE vir DEPOIS da rota /historico)
router.get('/:data', (req, res) => {
  const { data } = req.params;
  
  // Não limpar agendamentos ao consultar para evitar conflitos
  
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