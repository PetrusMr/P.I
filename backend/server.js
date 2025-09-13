const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

// Salvar agendamento
app.post('/api/agendamentos', (req, res) => {
  const { nome, data, horario } = req.body;
  
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});