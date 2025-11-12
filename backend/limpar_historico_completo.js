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
  
  const hoje = new Date();
  const dataAtual = hoje.toISOString().split('T')[0];
  const horaAtual = hoje.getHours();
  
  console.log('Data atual:', dataAtual);
  console.log('Hora atual:', horaAtual);
  
  // Determinar quais horários de hoje já passaram
  let horariosPassados = [];
  if (horaAtual >= 7) horariosPassados.push('manha');
  if (horaAtual >= 13) horariosPassados.push('tarde');
  if (horaAtual >= 18) horariosPassados.push('noite');
  
  console.log('Horários que já passaram hoje:', horariosPassados);
  
  // Primeiro, remover todos os registros futuros
  const deleteFuturosQuery = 'DELETE FROM historico_agendamentos WHERE data > ?';
  
  db.query(deleteFuturosQuery, [dataAtual], (err, result) => {
    if (err) {
      console.error('Erro ao limpar registros futuros:', err);
      db.end();
      return;
    }
    
    console.log(`${result.affectedRows} registros futuros removidos`);
    
    // Agora remover os horários de hoje que ainda não passaram
    if (horariosPassados.length < 3) {
      const horariosNaoPassados = ['manha', 'tarde', 'noite'].filter(h => !horariosPassados.includes(h));
      
      if (horariosNaoPassados.length > 0) {
        const deleteHojeQuery = `DELETE FROM historico_agendamentos WHERE data = ? AND horario IN (${horariosNaoPassados.map(() => '?').join(',')})`;
        const params = [dataAtual, ...horariosNaoPassados];
        
        db.query(deleteHojeQuery, params, (err, result) => {
          if (err) {
            console.error('Erro ao limpar horários de hoje:', err);
          } else {
            console.log(`${result.affectedRows} registros de horários não passados de hoje removidos`);
          }
          
          // Verificar resultado final
          verificarHistorico();
        });
      } else {
        verificarHistorico();
      }
    } else {
      verificarHistorico();
    }
  });
  
  function verificarHistorico() {
    db.query('SELECT * FROM historico_agendamentos ORDER BY data DESC, horario', (err, results) => {
      if (err) {
        console.error('Erro ao buscar histórico final:', err);
      } else {
        console.log('\nHistórico final (apenas reservas que já passaram):');
        results.forEach(registro => {
          const dataRegistro = new Date(registro.data).toISOString().split('T')[0];
          console.log(`Data: ${dataRegistro}, Horário: ${registro.horario}, Nome: ${registro.nome}`);
        });
      }
      db.end();
    });
  }
});