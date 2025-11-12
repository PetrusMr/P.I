const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('=== DEBUG DO HISTÓRICO ===\n');

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('✅ Conectado ao MySQL\n');
  
  // Testar consulta direta
  console.log('1. Testando consulta direta na tabela...');
  const query = 'SELECT nome, data, horario FROM historico_agendamentos ORDER BY data DESC, horario';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erro na consulta:', err);
      db.end();
      return;
    }
    
    console.log(`📊 Registros encontrados: ${results.length}`);
    
    if (results.length > 0) {
      console.log('\n📋 Dados encontrados:');
      results.forEach((registro, index) => {
        console.log(`${index + 1}. Nome: ${registro.nome}, Data: ${registro.data}, Horário: ${registro.horario}`);
      });
    } else {
      console.log('❌ Nenhum registro encontrado na tabela');
    }
    
    db.end();
  });
});