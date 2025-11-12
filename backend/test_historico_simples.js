const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('Testando conexão com banco de dados...');

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Conectado ao MySQL');
  
  // Testar se a tabela historico_agendamentos existe e tem dados
  const query = 'SELECT COUNT(*) as total FROM historico_agendamentos';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar histórico:', err);
    } else {
      console.log('Total de registros no histórico:', results[0].total);
      
      // Buscar alguns registros para teste
      const selectQuery = 'SELECT * FROM historico_agendamentos ORDER BY data_criacao DESC LIMIT 5';
      
      db.query(selectQuery, (err, results) => {
        if (err) {
          console.error('Erro ao buscar registros:', err);
        } else {
          console.log('Últimos 5 registros do histórico:');
          results.forEach((registro, index) => {
            console.log(`${index + 1}. ${registro.nome} - ${registro.data} - ${registro.horario}`);
          });
        }
        db.end();
      });
    }
  });
});