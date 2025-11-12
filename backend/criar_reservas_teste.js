const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

const reservas = [
  { nome: 'user', data: '2025-10-14', horario: 'manha' },
  { nome: 'teste', data: '2025-10-14', horario: 'tarde' },
  { nome: 'user', data: '2025-10-14', horario: 'noite' }
];

reservas.forEach((reserva, index) => {
  db.query('INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)', 
    [reserva.nome, reserva.data, reserva.horario], (err, result) => {
    if (err) {
      console.error(`Erro ao criar reserva ${reserva.horario}:`, err);
    } else {
      console.log(`Reserva criada: ${reserva.nome} - ${reserva.horario}`);
    }
    
    if (index === reservas.length - 1) {
      db.end();
    }
  });
});