const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Removendo registros do histórico a partir de 16/10...');
  
  db.query('DELETE FROM historico_agendamentos WHERE data >= ?', ['2025-10-16'], (err, result) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log(`Registros removidos: ${result.affectedRows}`);
    }
    db.end();
  });
});