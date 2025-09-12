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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});