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
  
  const hoje = new Date().toISOString().split('T')[0];
  console.log('Data de hoje:', hoje);
  
  // Verificar se user tem reserva para hoje à tarde
  const checkQuery = 'SELECT * FROM agendamentos WHERE nome = ? AND data = ? AND horario = ?';
  
  db.query(checkQuery, ['user', hoje, 'tarde'], (err, results) => {
    if (err) {
      console.error('Erro ao verificar reserva:', err);
      db.end();
      return;
    }
    
    if (results.length > 0) {
      console.log('User já tem reserva para hoje à tarde:', results[0]);
      db.end();
    } else {
      console.log('User não tem reserva para hoje à tarde. Verificando se horário está ocupado...');
      
      // Verificar se alguém tem reserva para hoje à tarde
      const checkOccupiedQuery = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ?';
      
      db.query(checkOccupiedQuery, [hoje, 'tarde'], (err, results) => {
        if (err) {
          console.error('Erro ao verificar ocupação:', err);
          db.end();
          return;
        }
        
        if (results.length > 0) {
          console.log('Horário ocupado por:', results[0].nome);
          console.log('Substituindo reserva...');
          
          // Atualizar reserva existente
          const updateQuery = 'UPDATE agendamentos SET nome = ? WHERE data = ? AND horario = ?';
          
          db.query(updateQuery, ['user', hoje, 'tarde'], (err, result) => {
            if (err) {
              console.error('Erro ao atualizar reserva:', err);
            } else {
              console.log('Reserva atualizada com sucesso para user!');
            }
            db.end();
          });
        } else {
          console.log('Horário livre. Criando nova reserva...');
          
          // Criar nova reserva
          const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
          
          db.query(insertQuery, ['user', hoje, 'tarde'], (err, result) => {
            if (err) {
              console.error('Erro ao criar reserva:', err);
            } else {
              console.log('Nova reserva criada com sucesso para user!');
            }
            db.end();
          });
        }
      });
    }
  });
});