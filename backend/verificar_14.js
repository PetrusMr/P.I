const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('Verificando reservas para 2025-10-14:');

db.query('SELECT * FROM agendamentos WHERE data = ?', ['2025-10-14'], (err, results) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('Agendamentos para 14/10:', results);
  }
  db.end();
});