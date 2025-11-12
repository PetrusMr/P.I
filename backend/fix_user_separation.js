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
  
  // Verificar usuários duplicados entre as tabelas
  const checkDuplicatesQuery = `
    SELECT u.usuario 
    FROM usuarios u 
    INNER JOIN supervisor s ON u.usuario = s.usuario
  `;
  
  db.query(checkDuplicatesQuery, (err, duplicates) => {
    if (err) {
      console.error('Erro ao verificar duplicatas:', err);
      db.end();
      return;
    }
    
    if (duplicates.length > 0) {
      console.log('Usuários duplicados encontrados:', duplicates.map(d => d.usuario));
      
      // Remover usuários duplicados da tabela supervisor (manter apenas na tabela usuarios)
      const removeDuplicatesQuery = `
        DELETE s FROM supervisor s 
        INNER JOIN usuarios u ON s.usuario = u.usuario
      `;
      
      db.query(removeDuplicatesQuery, (err, result) => {
        if (err) {
          console.error('Erro ao remover duplicatas:', err);
        } else {
          console.log(`${result.affectedRows} usuários duplicados removidos da tabela supervisor`);
        }
        
        // Garantir que existe pelo menos um supervisor
        const insertSupervisorQuery = 'INSERT IGNORE INTO supervisor (usuario, senha) VALUES (?, ?)';
        db.query(insertSupervisorQuery, ['supervisor', 'supervisor123'], (err) => {
          if (err) {
            console.error('Erro ao inserir supervisor:', err);
          } else {
            console.log('Supervisor padrão criado: usuario=supervisor, senha=supervisor123');
          }
          db.end();
        });
      });
    } else {
      console.log('Nenhum usuário duplicado encontrado');
      
      // Garantir que existe pelo menos um supervisor
      const insertSupervisorQuery = 'INSERT IGNORE INTO supervisor (usuario, senha) VALUES (?, ?)';
      db.query(insertSupervisorQuery, ['supervisor', 'supervisor123'], (err) => {
        if (err) {
          console.error('Erro ao inserir supervisor:', err);
        } else {
          console.log('Supervisor padrão verificado/criado: usuario=supervisor, senha=supervisor123');
        }
        db.end();
      });
    }
  });
});