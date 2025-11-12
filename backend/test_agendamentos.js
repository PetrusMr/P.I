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
  
  // Verificar dados existentes
  db.query('SELECT * FROM agendamentos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos:', err);
    } else {
      console.log('Agendamentos existentes:', results.length);
      console.log(results);
      
      // Se não há dados, inserir alguns de teste
      if (results.length === 0) {
        const agendamentosTest = [
          ['Carlos', '2024-12-02', 'tarde'],
          ['Marcio', '2024-12-03', 'manha'],
          ['Jeremias', '2024-12-04', 'noite'],
          ['Jannes', '2024-12-05', 'manha'],
          ['Roger', '2024-12-06', 'noite']
        ];
        
        const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES ?';
        db.query(insertQuery, [agendamentosTest], (err, result) => {
          if (err) {
            console.error('Erro ao inserir dados de teste:', err);
          } else {
            console.log('Dados de teste inseridos:', result.affectedRows);
          }
          db.end();
        });
      } else {
        db.end();
      }
    }
  });
});