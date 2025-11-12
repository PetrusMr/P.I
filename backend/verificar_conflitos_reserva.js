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
  
  console.log('=== VERIFICANDO CONFLITOS DE RESERVA ===');
  
  // Verificar agendamentos duplicados
  const queryAgendamentos = `
    SELECT data, horario, COUNT(*) as quantidade, GROUP_CONCAT(nome) as usuarios
    FROM agendamentos 
    GROUP BY data, horario 
    HAVING COUNT(*) > 1
    ORDER BY data, horario
  `;
  
  db.query(queryAgendamentos, (err, results) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      if (results.length > 0) {
        console.log('CONFLITOS EM AGENDAMENTOS:');
        results.forEach(r => {
          console.log(`${r.data} ${r.horario}: ${r.usuarios} (${r.quantidade} reservas)`);
        });
      } else {
        console.log('Nenhum conflito em agendamentos ativos');
      }
    }
    
    // Verificar histórico duplicado
    const queryHistorico = `
      SELECT data, horario, COUNT(*) as quantidade, GROUP_CONCAT(nome) as usuarios
      FROM historico_agendamentos 
      GROUP BY data, horario 
      HAVING COUNT(*) > 1
      ORDER BY data DESC, horario
    `;
    
    db.query(queryHistorico, (err, results) => {
      if (err) {
        console.error('Erro:', err);
      } else {
        if (results.length > 0) {
          console.log('\nCONFLITOS NO HISTÓRICO:');
          results.forEach(r => {
            console.log(`${r.data} ${r.horario}: ${r.usuarios} (${r.quantidade} reservas)`);
          });
        } else {
          console.log('\nNenhum conflito no histórico');
        }
      }
      db.end();
    });
  });
});