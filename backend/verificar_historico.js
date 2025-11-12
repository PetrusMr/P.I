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
  
  // Verificar se a tabela historico_agendamentos existe
  const checkTableQuery = `
    SELECT COUNT(*) as count 
    FROM information_schema.tables 
    WHERE table_schema = 'easycontrol' 
    AND table_name = 'historico_agendamentos'
  `;
  
  db.query(checkTableQuery, (err, results) => {
    if (err) {
      console.error('Erro ao verificar tabela:', err);
      db.end();
      return;
    }
    
    if (results[0].count === 0) {
      console.log('Tabela historico_agendamentos não existe. Criando...');
      
      const createTableQuery = `
        CREATE TABLE historico_agendamentos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          data DATE NOT NULL,
          horario ENUM('manha', 'tarde', 'noite') NOT NULL,
          data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
        } else {
          console.log('Tabela historico_agendamentos criada com sucesso!');
        }
        db.end();
      });
    } else {
      console.log('Tabela historico_agendamentos já existe.');
      
      // Verificar se há dados na tabela
      db.query('SELECT COUNT(*) as count FROM historico_agendamentos', (err, results) => {
        if (err) {
          console.error('Erro ao contar registros:', err);
        } else {
          console.log(`Registros no histórico: ${results[0].count}`);
        }
        db.end();
      });
    }
  });
});