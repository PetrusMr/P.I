const mysql = require('mysql2');

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
  
  const hoje = new Date().toISOString().split('T')[0];
  const agora = new Date();
  const horaAtual = agora.getHours();
  
  let horario = '';
  if (horaAtual >= 6 && horaAtual < 12) {
    horario = 'manha';
  } else if (horaAtual >= 13 && horaAtual < 18) {
    horario = 'tarde';
  } else if (horaAtual >= 19 && horaAtual < 22) {
    horario = 'noite';
  } else {
    horario = 'tarde'; // padrão para teste
  }
  
  console.log(`Criando reserva para hoje (${hoje}) no período: ${horario}`);
  
  // Primeiro, verificar se já existe
  const checkQuery = 'SELECT * FROM agendamentos WHERE nome = ? AND data = ?';
  
  db.query(checkQuery, ['petru', hoje], (err, results) => {
    if (err) {
      console.error('Erro ao verificar reserva existente:', err);
      db.end();
      return;
    }
    
    if (results.length > 0) {
      console.log('Já existe uma reserva para petru hoje:', results[0]);
      db.end();
      return;
    }
    
    // Inserir nova reserva
    const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
    
    db.query(insertQuery, ['petru', hoje, horario], (err, result) => {
      if (err) {
        console.error('Erro ao criar reserva:', err);
      } else {
        console.log('Reserva criada com sucesso!');
        console.log(`ID: ${result.insertId}`);
      }
      db.end();
    });
  });
});