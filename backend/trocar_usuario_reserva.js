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
  
  const hoje = new Date().toISOString().split('T')[0];
  
  db.query('UPDATE agendamentos SET nome = ? WHERE nome = ? AND data = ?', 
    ['user', 'petru', hoje], (err, result) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log(`Reservas atualizadas: ${result.affectedRows}`);
    }
    db.end();
  });
});