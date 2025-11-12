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
  
  console.log('=== VERIFICANDO DUPLICATAS NO HISTÓRICO ===');
  
  const query = `
    SELECT nome, data, horario, COUNT(*) as quantidade 
    FROM historico_agendamentos 
    GROUP BY nome, data, horario 
    HAVING COUNT(*) > 1
    ORDER BY data DESC, horario
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro:', err);
    } else {
      if (results.length > 0) {
        console.log('DUPLICATAS ENCONTRADAS:');
        results.forEach(r => {
          console.log(`${r.data} ${r.horario}: ${r.nome} (${r.quantidade} vezes)`);
        });
        
        console.log('\n=== REMOVENDO DUPLICATAS ===');
        // Remover duplicatas mantendo apenas 1 registro
        const removeDuplicates = `
          DELETE h1 FROM historico_agendamentos h1
          INNER JOIN historico_agendamentos h2 
          WHERE h1.id > h2.id 
          AND h1.nome = h2.nome 
          AND h1.data = h2.data 
          AND h1.horario = h2.horario
        `;
        
        db.query(removeDuplicates, (err, result) => {
          if (err) {
            console.error('Erro ao remover duplicatas:', err);
          } else {
            console.log(`Duplicatas removidas: ${result.affectedRows}`);
          }
          db.end();
        });
      } else {
        console.log('Nenhuma duplicata encontrada');
        db.end();
      }
    }
  });
});