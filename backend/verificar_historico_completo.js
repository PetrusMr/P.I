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
  
  console.log('=== AGENDAMENTOS ATIVOS ===');
  db.query('SELECT * FROM agendamentos ORDER BY data, horario', (err, results) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      console.log('Total:', results.length);
      results.forEach(r => console.log(`${r.data} ${r.horario}: ${r.nome}`));
    }
    
    console.log('\n=== HISTÓRICO ===');
    db.query('SELECT * FROM historico_agendamentos ORDER BY data DESC, horario', (err, results) => {
      if (err) {
        console.error('Erro:', err);
      } else {
        console.log('Total:', results.length);
        results.forEach(r => console.log(`${r.data} ${r.horario}: ${r.nome}`));
      }
      
      // Mover reserva da manhã para histórico (já passou das 12h)
      const hoje = '2025-10-13';
      console.log('\n=== MOVENDO MANHÃ PARA HISTÓRICO ===');
      
      db.query('SELECT * FROM agendamentos WHERE data = ? AND horario = ?', [hoje, 'manha'], (err, results) => {
        if (results && results.length > 0) {
          results.forEach(ag => {
            db.query('INSERT IGNORE INTO historico_agendamentos (nome, data, horario) VALUES (?, ?, ?)', 
              [ag.nome, ag.data, ag.horario], () => {
                db.query('DELETE FROM agendamentos WHERE id = ?', [ag.id], () => {
                  console.log(`Movido: ${ag.data} ${ag.horario} ${ag.nome}`);
                });
              });
          });
        } else {
          console.log('Nenhuma reserva de manhã para mover');
        }
        
        setTimeout(() => db.end(), 1000);
      });
    });
  });
});