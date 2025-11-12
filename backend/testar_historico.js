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
  
  // Buscar dados do histórico
  const query = 'SELECT * FROM historico_agendamentos ORDER BY data_criacao DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar histórico:', err);
    } else {
      console.log('Dados do histórico:');
      console.log(JSON.stringify(results, null, 2));
    }
    db.end();
  });
});