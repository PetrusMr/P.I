const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3'
});

// Criar banco e tabelas
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('Conectado ao MySQL');
  
  // Criar banco
  db.query('CREATE DATABASE IF NOT EXISTS easycontrol', (err) => {
    if (err) console.error('Erro ao criar banco:', err);
    else console.log('Banco criado/verificado');
    
    // Usar banco
    db.query('USE easycontrol', (err) => {
      if (err) console.error('Erro ao usar banco:', err);
      
      // Criar tabela usuarios
      const createUsers = `CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) NOT NULL UNIQUE,
        senha VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
      
      db.query(createUsers, (err) => {
        if (err) console.error('Erro ao criar tabela usuarios:', err);
        else console.log('Tabela usuarios criada');
        
        // Inserir usuário teste
        db.query('INSERT IGNORE INTO usuarios (usuario, senha) VALUES (?, ?)', ['admin', 'admin123'], (err) => {
          if (err) console.error('Erro ao inserir usuário:', err);
          else console.log('Usuário admin criado');
          
          // Criar tabela agendamentos
          const createAgendamentos = `CREATE TABLE IF NOT EXISTS agendamentos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            data VARCHAR(10) NOT NULL,
            horario VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`;
          
          db.query(createAgendamentos, (err) => {
            if (err) console.error('Erro ao criar tabela agendamentos:', err);
            else console.log('Tabela agendamentos criada');
            
            console.log('Setup completo!');
            db.end();
          });
        });
      });
    });
  });
});