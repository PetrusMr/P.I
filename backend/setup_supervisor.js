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
  console.log('Conectado ao MySQL');
  
  // Criar tabela supervisor
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS supervisor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      nome VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
    } else {
      console.log('Tabela supervisor criada com sucesso');
      
      // Inserir supervisor de teste
      const insertQuery = 'INSERT IGNORE INTO supervisor (usuario, senha) VALUES (?, ?)';
      db.query(insertQuery, ['admin', 'admin123'], (err) => {
        if (err) {
          console.error('Erro ao inserir supervisor:', err);
        } else {
          console.log('Supervisor de teste inserido');
        }
        db.end();
      });
    }
  });
});