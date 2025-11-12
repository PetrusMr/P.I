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
  
  // Criar reserva para user na tarde de hoje
  const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
  
  db.query(insertQuery, ['user', hoje, 'tarde'], (err, result) => {
    if (err) {
      console.error('Erro ao criar reserva:', err);
    } else {
      console.log('Reserva criada com sucesso para user na tarde de hoje!');
    }
    
    // Verificar reservas atuais
    const selectQuery = 'SELECT * FROM agendamentos WHERE data = ? ORDER BY horario';
    
    db.query(selectQuery, [hoje], (err, results) => {
      if (err) {
        console.error('Erro ao buscar reservas:', err);
      } else {
        console.log('\nReservas de hoje:');
        results.forEach(reserva => {
          console.log(`${reserva.horario}: ${reserva.nome}`);
        });
      }
      db.end();
    });
  });
});