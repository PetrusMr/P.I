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
  
  const nome = 'user';
  const agora = new Date();
  const dataAtual = agora.toISOString().split('T')[0];
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  
  console.log('Testando API /agendamentos/ativo/user');
  console.log('Data atual:', dataAtual);
  console.log('Hora atual:', horaAtual + ':' + minutoAtual);
  
  let horarioAtual = '';
  if (horaAtual >= 7 && horaAtual < 13) {
    horarioAtual = 'manha';
  } else if (horaAtual >= 13 && horaAtual < 18) {
    horarioAtual = 'tarde';
  } else if (horaAtual >= 18 && horaAtual < 23) {
    horarioAtual = 'noite';
  }
  
  console.log('Horário atual detectado:', horarioAtual);
  
  // Verificar se tem agendamento para hoje no horário atual
  const query = 'SELECT * FROM agendamentos WHERE nome = ? AND data = ? AND horario = ?';
  
  db.query(query, [nome, dataAtual, horarioAtual], (err, results) => {
    if (err) {
      console.error('Erro ao verificar agendamento:', err);
      db.end();
      return;
    }
    
    console.log('Resultados da query:', results);
    
    if (results.length > 0) {
      let podeEscanear = false;
      
      if (horarioAtual === 'manha' && horaAtual >= 7 && (horaAtual > 7 || minutoAtual >= 1)) {
        podeEscanear = true;
      } else if (horarioAtual === 'tarde' && horaAtual >= 13 && (horaAtual > 13 || minutoAtual >= 1)) {
        podeEscanear = true;
      } else if (horarioAtual === 'noite' && horaAtual >= 18 && (horaAtual > 18 || minutoAtual >= 1)) {
        podeEscanear = true;
      }
      
      console.log('Pode escanear?', podeEscanear);
      console.log('Resposta que seria enviada:', { 
        temAgendamento: podeEscanear, 
        agendamento: podeEscanear ? results[0] : null 
      });
    } else {
      console.log('Nenhum agendamento encontrado');
      console.log('Resposta que seria enviada:', { temAgendamento: false, agendamento: null });
    }
    
    db.end();
  });
});