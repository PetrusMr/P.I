const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

const addColumnQuery = `
ALTER TABLE scans ADD COLUMN turno ENUM('manha', 'tarde', 'noite') AFTER data_hora;
`;

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Conectado ao MySQL');
  
  connection.query(addColumnQuery, (err, result) => {
    if (err) {
      console.error('Erro ao adicionar coluna:', err);
    } else {
      console.log('Coluna turno adicionada com sucesso');
    }
    
    connection.end();
  });
});