const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('Inserindo dados de teste no histórico...');

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Conectado ao MySQL');
  
  // Dados de teste para o histórico
  const dadosHistorico = [
    ['João Silva', '2025-10-07', 'manha'],
    ['Maria Santos', '2025-10-07', 'tarde'],
    ['Pedro Costa', '2025-10-07', 'noite'],
    ['Ana Oliveira', '2025-10-08', 'manha'],
    ['Carlos Lima', '2025-10-08', 'tarde'],
    ['Lucia Ferreira', '2025-10-08', 'noite'],
    ['Roberto Alves', '2025-10-09', 'manha'],
    ['Fernanda Rocha', '2025-10-09', 'tarde']
  ];
  
  const query = 'INSERT INTO historico_agendamentos (nome, data, horario) VALUES ?';
  
  db.query(query, [dadosHistorico], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
    } else {
      console.log('Dados inseridos com sucesso!');
      console.log('Registros inseridos:', result.affectedRows);
      
      // Verificar os dados inseridos
      const selectQuery = 'SELECT * FROM historico_agendamentos ORDER BY data_criacao DESC LIMIT 10';
      
      db.query(selectQuery, (err, results) => {
        if (err) {
          console.error('Erro ao consultar dados:', err);
        } else {
          console.log('\nÚltimos registros do histórico:');
          results.forEach((registro, index) => {
            const data = new Date(registro.data).toLocaleDateString('pt-BR');
            console.log(`${index + 1}. ${registro.nome} - ${data} - ${registro.horario}`);
          });
        }
        db.end();
      });
    }
  });
});