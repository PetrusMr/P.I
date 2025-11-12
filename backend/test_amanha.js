const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
const dataAmanha = amanha.toISOString().split('T')[0];

console.log('Data de amanhã:', dataAmanha);

db.query('SELECT * FROM agendamentos WHERE data = ?', [dataAmanha], (err, results) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('Agendamentos para amanhã:', results);
  }
  db.end();
});