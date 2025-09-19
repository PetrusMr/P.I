const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Função para limpar agendamentos expirados
function limparAgendamentosExpirados(db) {
  const hoje = new Date();
  const dataAtual = hoje.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaAtual = hoje.getHours();
  
  let condicaoHorario = '';
  let params = [];
  
  if (horaAtual >= 18) {
    // Após 18h, remove todos os períodos do dia
    condicaoHorario = "data <= ?";
    params = [dataAtual];
  } else if (horaAtual >= 13) {
    // Após 13h, remove manhã e tarde de hoje
    condicaoHorario = "(data < ? OR (data = ? AND horario IN ('manha', 'tarde')))";
    params = [dataAtual, dataAtual];
  } else if (horaAtual >= 7) {
    // Após 7h, remove apenas manhã de hoje
    condicaoHorario = "(data < ? OR (data = ? AND horario = 'manha'))";
    params = [dataAtual, dataAtual];
  } else {
    // Antes das 7h, remove apenas dias anteriores
    condicaoHorario = "data < ?";
    params = [dataAtual];
  }
  
  const query = `DELETE FROM agendamentos WHERE ${condicaoHorario}`;
  
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Erro ao limpar agendamentos expirados:', err);
    } else if (result.affectedRows > 0) {
      console.log(`${result.affectedRows} agendamentos expirados removidos`);
    }
  });
}

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;
  
  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
  db.query(query, [usuario, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    
    if (results.length > 0) {
      res.json({ success: true, message: 'Login realizado com sucesso' });
    } else {
      res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  });
});

// Verificar agendamento ativo
app.get('/api/agendamentos/ativo/:nome', (req, res) => {
  const { nome } = req.params;
  const agora = new Date();
  const dataAtual = agora.toISOString().split('T')[0];
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  
  let horarioAtual = '';
  if (horaAtual >= 7 && horaAtual < 13) {
    horarioAtual = 'manha';
  } else if (horaAtual >= 13 && horaAtual < 18) {
    horarioAtual = 'tarde';
  } else if (horaAtual >= 18 && horaAtual < 23) {
    horarioAtual = 'noite';
  }
  
  // Verificar se tem agendamento para hoje no horário atual
  const query = 'SELECT * FROM agendamentos WHERE nome = ? AND data = ? AND horario = ?';
  
  db.query(query, [nome, dataAtual, horarioAtual], (err, results) => {
    if (err) {
      console.error('Erro ao verificar agendamento ativo:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results.length > 0) {
      // Verificar se está no horário correto
      let podeEscanear = false;
      
      if (horarioAtual === 'manha' && horaAtual >= 7 && (horaAtual > 7 || minutoAtual >= 1)) {
        podeEscanear = true;
      } else if (horarioAtual === 'tarde' && horaAtual >= 13 && (horaAtual > 13 || minutoAtual >= 1)) {
        podeEscanear = true;
      } else if (horarioAtual === 'noite' && horaAtual >= 18 && (horaAtual > 18 || minutoAtual >= 1)) {
        podeEscanear = true;
      }
      
      res.json({ 
        temAgendamento: podeEscanear, 
        agendamento: podeEscanear ? results[0] : null 
      });
    } else {
      res.json({ temAgendamento: false, agendamento: null });
    }
  });
});

// Verificar se scan foi feito para agendamento específico
app.get('/api/scans/verificar-agendamento/:nome/:data/:horario/:tipo', (req, res) => {
  const { nome, data, horario, tipo } = req.params;
  
  const query = 'SELECT COUNT(*) as count FROM scans WHERE nome = ? AND data_agendamento = ? AND horario_agendamento = ? AND tipo_scan = ?';
  
  db.query(query, [nome, data, horario, tipo], (err, results) => {
    if (err) {
      console.error('Erro ao verificar scan do agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    const scanFeito = results[0].count > 0;
    res.json({ scanFeito });
  });
});

// Salvar scan
app.post('/api/scans', (req, res) => {
  const { nome, tipo_scan, quantidade, data_agendamento, horario_agendamento } = req.body;
  
  const agora = new Date();
  const data = agora.toISOString().split('T')[0];
  const hora = agora.toTimeString().split(' ')[0];
  const horaAtual = agora.getHours();
  
  let turno;
  if (horaAtual >= 6 && horaAtual < 12) {
    turno = 'manha';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    turno = 'tarde';
  } else {
    turno = 'noite';
  }
  
  const query = 'INSERT INTO scans (nome, tipo_scan, turno, hora_scan, data_scan, quantidade, data_agendamento, horario_agendamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [nome, tipo_scan, turno, hora, data, quantidade, data_agendamento, horario_agendamento], (err, result) => {
    if (err) {
      console.error('Erro ao salvar scan:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, message: 'Scan salvo com sucesso' });
  });
});

// Salvar agendamento
app.post('/api/agendamentos', (req, res) => {
  const { nome, data, horario } = req.body;
  
  // Limpar agendamentos expirados antes de salvar
  limparAgendamentosExpirados(db);
  
  // Verifica se a data não é anterior ao dia atual
  const hoje = new Date().toISOString().split('T')[0];
  if (data < hoje) {
    return res.status(400).json({ success: false, message: 'Não é possível agendar para datas anteriores' });
  }
  
  // Primeiro verifica se já existe agendamento para essa data e horário
  const checkQuery = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ?';
  
  db.query(checkQuery, [data, horario], (err, results) => {
    if (err) {
      console.error('Erro ao verificar agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Horário já está ocupado' });
    }
    
    // Se não existe, insere o novo agendamento
    const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
    
    db.query(insertQuery, [nome, data, horario], (err, result) => {
      if (err) {
        console.error('Erro ao salvar agendamento:', err);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
      }
      
      res.json({ success: true, message: 'Agendamento salvo com sucesso' });
    });
  });
});

// Verificar horários ocupados
app.get('/api/agendamentos/:data', (req, res) => {
  const { data } = req.params;
  
  // Limpar agendamentos expirados antes de consultar
  limparAgendamentosExpirados(db);
  
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

// Buscar agendamentos por usuário
app.get('/api/agendamentos/usuario/:nome', (req, res) => {
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
app.delete('/api/agendamentos/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM agendamentos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao cancelar agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, message: 'Agendamento cancelado com sucesso' });
  });
});

// Executar limpeza de agendamentos expirados a cada hora
setInterval(() => {
  limparAgendamentosExpirados(db);
}, 60 * 60 * 1000); // 1 hora

// Executar limpeza inicial ao iniciar o servidor
limparAgendamentosExpirados(db);

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});