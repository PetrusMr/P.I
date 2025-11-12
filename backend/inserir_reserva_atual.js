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
  const agora = new Date();
  const horaAtual = agora.getHours();
  
  let horario = '';
  if (horaAtual >= 6 && horaAtual < 12) {
    horario = 'manha';
  } else if (horaAtual >= 13 && horaAtual < 18) {
    horario = 'tarde';
  } else if (horaAtual >= 19 && horaAtual < 22) {
    horario = 'noite';
  } else {
    console.log('Fora do horário de funcionamento. Criando reserva para tarde como teste.');
    horario = 'tarde';
  }
  
  console.log(`Hora atual: ${horaAtual}h`);
  console.log(`Criando reserva para: ${horario}`);
  
  // Obter nome do usuário logado (assumindo que é 'petru' baseado no contexto)
  const usuario = 'petru';
  
  // Inserir reserva
  const insertQuery = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
  
  db.query(insertQuery, [usuario, hoje, horario], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('Já existe uma reserva para este usuário, data e horário.');
      } else {
        console.error('Erro ao criar reserva:', err);
      }
    } else {
      console.log('Reserva criada com sucesso!');
      console.log(`ID: ${result.insertId}`);
      console.log(`Usuário: ${usuario}`);
      console.log(`Data: ${hoje}`);
      console.log(`Horário: ${horario}`);
    }
    
    // Verificar reservas atuais
    const checkQuery = 'SELECT * FROM agendamentos WHERE data = ? ORDER BY horario';
    db.query(checkQuery, [hoje], (err, results) => {
      if (err) {
        console.error('Erro ao verificar reservas:', err);
      } else {
        console.log('\nReservas atuais para hoje:');
        results.forEach(reserva => {
          console.log(`${reserva.horario}: ${reserva.nome} (ID: ${reserva.id})`);
        });
      }
      db.end();
    });
  });
});