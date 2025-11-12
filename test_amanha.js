const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

// Testar data de amanhã
const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
const dataAmanha = amanha.toISOString().split('T')[0];

console.log('Data de amanhã:', dataAmanha);

// Verificar agendamentos para amanhã
db.query('SELECT * FROM agendamentos WHERE data = ?', [dataAmanha], (err, results) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('Agendamentos para amanhã:', results);
  }
  
  // Testar inserção
  db.query('INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)', 
    ['TESTE', dataAmanha, 'manha'], (err2, result) => {
    if (err2) {
      console.error('Erro ao inserir:', err2);
    } else {
      console.log('Inserção bem-sucedida:', result);
      
      // Remover teste
      db.query('DELETE FROM agendamentos WHERE nome = "TESTE"', (err3) => {
        if (err3) console.error('Erro ao remover teste:', err3);
        db.end();
      });
    }
  });
});