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
  
  // Testar login supervisor
  const usuario = 'admin';
  const senha = 'admin123';
  
  console.log('Testando login supervisor com:', { usuario, senha });
  
  // Primeiro verifica se o usuário existe na tabela usuarios
  const checkUserQuery = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(checkUserQuery, [usuario], (err, userResults) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return;
    }
    
    console.log('Usuário na tabela usuarios:', userResults);
    
    if (userResults.length > 0) {
      console.log('ERRO: Usuário existe na tabela usuarios - não pode ser supervisor');
      db.end();
      return;
    }
    
    // Verifica na tabela supervisor
    const query = 'SELECT * FROM supervisor WHERE usuario = ? AND senha = ?';
    db.query(query, [usuario, senha], (err, results) => {
      if (err) {
        console.error('Erro ao verificar supervisor:', err);
      } else {
        console.log('Resultado do login supervisor:', results);
        if (results.length > 0) {
          console.log('LOGIN SUPERVISOR: SUCESSO');
        } else {
          console.log('LOGIN SUPERVISOR: FALHOU');
        }
      }
      db.end();
    });
  });
});