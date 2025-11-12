const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_scan ENUM('inicio', 'fim') NOT NULL,
    resultado_scan TEXT NOT NULL
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
      console.log('Tabela scans criada com sucesso');
    }
    
    connection.end();
  });
});