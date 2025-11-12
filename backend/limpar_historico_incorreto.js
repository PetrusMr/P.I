const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco:', err);
    return;
  }
  console.log('Conectado ao MySQL');
  
  const hoje = new Date().toISOString().split('T')[0];
  console.log('Data atual:', hoje);
  
  // Primeiro, vamos ver o que tem no histórico
  db.query('SELECT * FROM historico_agendamentos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar histórico:', err);
      db.end();
      return;
    }
    
    console.log('Registros no histórico antes da limpeza:');
    results.forEach(registro => {
      const dataRegistro = new Date(registro.data).toISOString().split('T')[0];
      console.log(`ID: ${registro.id}, Data: ${dataRegistro}, Horário: ${registro.horario}, Nome: ${registro.nome}`);
    });
    
    // Remover registros futuros (que não deveriam estar no histórico)
    const deleteQuery = 'DELETE FROM historico_agendamentos WHERE data > ?';
    
    db.query(deleteQuery, [hoje], (err, result) => {
      if (err) {
        console.error('Erro ao limpar histórico:', err);
      } else {
        console.log(`${result.affectedRows} registros futuros removidos do histórico`);
      }
      
      // Verificar o que sobrou
      db.query('SELECT * FROM historico_agendamentos', (err, results) => {
        if (err) {
          console.error('Erro ao buscar histórico após limpeza:', err);
        } else {
          console.log('Registros no histórico após limpeza:');
          results.forEach(registro => {
            const dataRegistro = new Date(registro.data).toISOString().split('T')[0];
            console.log(`ID: ${registro.id}, Data: ${dataRegistro}, Horário: ${registro.horario}, Nome: ${registro.nome}`);
          });
        }
        db.end();
      });
    });
  });
});