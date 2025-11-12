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
  console.log('Reservas para hoje (' + hoje + '):');
  
  const query = 'SELECT * FROM agendamentos WHERE data = ? ORDER BY horario';
  
  db.query(query, [hoje], (err, results) => {
    if (err) {
      console.error('Erro ao buscar reservas:', err);
    } else {
      if (results.length === 0) {
        console.log('Nenhuma reserva encontrada para hoje.');
      } else {
        results.forEach(reserva => {
          console.log(`${reserva.horario}: ${reserva.nome}`);
        });
      }
    }
    db.end();
  });
});