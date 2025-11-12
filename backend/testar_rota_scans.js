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
  
  console.log('Testando busca de scans para user em 2025-10-10...');
  
  const query = `
    SELECT * FROM scans 
    WHERE usuario = ? 
    AND DATE(data_hora) = ?
    ORDER BY data_hora
  `;
  
  db.query(query, ['user', '2025-10-10'], (err, results) => {
    if (err) {
      console.error('Erro ao buscar scans:', err);
    } else {
      console.log('Scans encontrados:', results.length);
      if (results.length > 0) {
        results.forEach(scan => {
          console.log(`- ${scan.tipo_scan}: ${scan.resultado_scan}`);
        });
      } else {
        console.log('Nenhum scan encontrado - retornaria "Não scaneado"');
      }
    }
    db.end();
  });
});