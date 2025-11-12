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

  // Verificar supervisores
  db.query('SELECT * FROM supervisor', (err, results) => {
    if (err) {
      console.error('Erro ao consultar supervisores:', err);
      return;
    }
    console.log('Supervisores na tabela:', results);
    db.end();
  });
});