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
  console.log('Conectado ao MySQL');
  
  // Verificar supervisores
  const query = 'SELECT * FROM supervisor';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar supervisores:', err);
    } else {
      console.log('Supervisores encontrados:', results);
    }
    db.end();
  });
});