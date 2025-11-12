const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('Removendo dados fictícios do histórico...');

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Conectado ao MySQL');
  
  // Remove apenas os dados fictícios, mantém os dados reais do usuário "user"
  const nomesFicticios = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Lima', 'Lucia Ferreira', 'Roberto Alves', 'Fernanda Rocha'];
  
  const query = 'DELETE FROM historico_agendamentos WHERE nome IN (?)';
  
  db.query(query, [nomesFicticios], (err, result) => {
    if (err) {
      console.error('Erro ao remover dados fictícios:', err);
    } else {
      console.log('Dados fictícios removidos:', result.affectedRows, 'registros');
      
      // Verificar dados restantes
      const selectQuery = 'SELECT * FROM historico_agendamentos ORDER BY data_criacao DESC';
      
      db.query(selectQuery, (err, results) => {
        if (err) {
          console.error('Erro ao consultar dados:', err);
        } else {
          console.log('\nDados reais restantes no histórico:');
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