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
  
  // Primeiro limpar qualquer reserva existente para user na tarde
  const deleteQuery = 'DELETE FROM agendamentos WHERE nome = ? AND data = ? AND horario = ?';
  
  db.query(deleteQuery, ['user', hoje, 'tarde'], (err) => {
    if (err) console.error('Erro ao limpar:', err);
    
    // Inserir nova reserva
    const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
    
    db.query(insertQuery, ['user', hoje, 'tarde'], (err, result) => {
      if (err) {
        console.error('Erro ao inserir:', err);
      } else {
        console.log('Reserva inserida! ID:', result.insertId);
      }
      
      // Verificar se foi inserida
      db.query('SELECT * FROM agendamentos WHERE data = ?', [hoje], (err, results) => {
        if (err) {
          console.error('Erro ao verificar:', err);
        } else {
          console.log('Reservas de hoje:');
          results.forEach(r => console.log(`${r.id} - ${r.nome} - ${r.data} - ${r.horario}`));
        }
        db.end();
      });
    });
  });
});