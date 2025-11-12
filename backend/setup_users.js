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

  // Criar tabela de usuários se não existir
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50) NOT NULL UNIQUE,
      senha VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createUsersTable, (err) => {
    if (err) {
      console.error('Erro ao criar tabela usuarios:', err);
      return;
    }
    console.log('Tabela usuarios criada/verificada com sucesso');

    // Inserir usuários de teste
    const insertUsers = `
      INSERT IGNORE INTO usuarios (usuario, senha) VALUES 
      ('admin', 'admin123'),
      ('user', '123456')
    `;

    db.query(insertUsers, (err, result) => {
      if (err) {
        console.error('Erro ao inserir usuários:', err);
        return;
      }
      console.log('Usuários de teste inseridos:', result.affectedRows);
      
      // Verificar usuários inseridos
      db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
          console.error('Erro ao consultar usuários:', err);
          return;
        }
        console.log('Usuários na tabela:', results);
        db.end();
      });
    });
  });
});