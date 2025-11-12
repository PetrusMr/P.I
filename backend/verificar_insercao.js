const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('Verificando se as inserções funcionaram...');

db.query('SELECT * FROM agendamentos WHERE data = "2025-10-14"', (err, results) => {
  if (err) {
    console.error('Erro:', err);
  } else {
    console.log('Registros encontrados:', results.length);
    results.forEach(r => {
      console.log(`ID: ${r.id}, Nome: ${r.nome}, Horário: ${r.horario}`);
    });
  }
  
  // Tentar inserção direta
  console.log('\nTentando inserção direta...');
  db.query('INSERT INTO agendamentos (nome, data, horario) VALUES ("user", "2025-10-14", "manha")', (err2, result) => {
    if (err2) {
      console.error('Erro na inserção:', err2);
    } else {
      console.log('Inserção bem-sucedida, ID:', result.insertId);
    }
    db.end();
  });
});