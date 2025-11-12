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

console.log('Limpando reservas de teste para:', dataAmanha);

db.query('DELETE FROM agendamentos WHERE data = ?', [dataAmanha], (err, result) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('Reservas removidas:', result.affectedRows);
  }
  db.end();
});