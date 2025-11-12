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
  
  console.log('Removendo conflitos do histórico...');
  
  // Remover reserva duplicada do dia 14 tarde (manter apenas user)
  db.query('DELETE FROM historico_agendamentos WHERE data = ? AND horario = ? AND nome = ?', 
    ['2025-10-14', 'tarde', 'teste'], (err, result) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log(`Removida reserva conflitante: teste 14/10 tarde`);
    }
    
    // Remover reserva duplicada do dia 10 manhã (manter apenas user)
    db.query('DELETE FROM historico_agendamentos WHERE data = ? AND horario = ? AND nome = ?', 
      ['2025-10-10', 'manha', 'Ana Oliveira'], (err, result) => {
      if (err) {
        console.error('Erro:', err);
      } else {
        console.log(`Removida reserva conflitante: Ana Oliveira 10/10 manhã`);
      }
      
      // Remover reserva duplicada do dia 09 noite (manter apenas user)
      db.query('DELETE FROM historico_agendamentos WHERE data = ? AND horario = ? AND nome = ?', 
        ['2025-10-09', 'noite', 'Pedro Costa'], (err, result) => {
        if (err) {
          console.error('Erro:', err);
        } else {
          console.log(`Removida reserva conflitante: Pedro Costa 09/10 noite`);
        }
        db.end();
      });
    });
  });
});