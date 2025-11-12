const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS historico_agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario ENUM('manha', 'tarde', 'noite') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Conectado ao MySQL');
  
  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
    } else {
      console.log('Tabela historico_agendamentos criada com sucesso');
    }
    
    connection.end();
  });
});