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
  
  // Criar uma reserva de teste para ontem
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const dataOntem = ontem.toISOString().split('T')[0];
  
  console.log('Criando reserva de teste para:', dataOntem);
  
  // Inserir reserva de teste
  const insertReserva = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
  
  db.query(insertReserva, ['teste_user', dataOntem, 'manha'], (err, result) => {
    if (err) {
      console.error('Erro ao criar reserva teste:', err);
      db.end();
      return;
    }
    
    console.log('Reserva teste criada. Executando limpeza...');
    
    // Executar limpeza manualmente
    const agora = new Date();
    const dataAtual = agora.toISOString().split('T')[0];
    
    const selectQuery = `SELECT * FROM agendamentos WHERE data < ?`;
    
    db.query(selectQuery, [dataAtual], (err, results) => {
      if (err) {
        console.error('Erro ao buscar reservas:', err);
        db.end();
        return;
      }
      
      console.log('Reservas encontradas para limpeza:', results.length);
      
      if (results.length > 0) {
        results.forEach(agendamento => {
          console.log(`Processando: ${agendamento.nome} - ${agendamento.data} - ${agendamento.horario}`);
          
          // Verificar scans
          const queryScans = `
            SELECT tipo_scan 
            FROM scans 
            WHERE usuario = ? 
            AND DATE(data_hora) = ?
          `;
          
          db.query(queryScans, [agendamento.nome, agendamento.data], (err, scans) => {
            if (err) {
              console.error('Erro ao verificar scans:', err);
              return;
            }
            
            const temInicio = scans.some(scan => scan.tipo_scan === 'inicio');
            const temFim = scans.some(scan => scan.tipo_scan === 'fim');
            
            console.log(`Scans encontrados - Início: ${temInicio}, Fim: ${temFim}`);
            
            let statusScan = '';
            if (!temInicio && !temFim) {
              statusScan = 'Nenhum scan realizado';
            } else if (temInicio && !temFim) {
              statusScan = 'Scan incompleto - apenas início';
            } else {
              console.log('Scan completo, não precisa salvar');
              return;
            }
            
            console.log('Salvando scan incompleto:', statusScan);
            
            const insertScanIncompleto = `
              INSERT INTO scans (usuario, tipo_scan, resultado_scan, data_hora) 
              VALUES (?, 'fim', ?, NOW())
            `;
            
            db.query(insertScanIncompleto, [agendamento.nome, statusScan], (err) => {
              if (err) {
                console.error('Erro ao salvar scan incompleto:', err);
              } else {
                console.log('Scan incompleto salvo com sucesso!');
              }
            });
          });
        });
        
        // Limpar reserva teste após 2 segundos
        setTimeout(() => {
          db.query('DELETE FROM agendamentos WHERE nome = ?', ['teste_user'], () => {
            console.log('Reserva teste removida');
            db.end();
          });
        }, 2000);
      } else {
        console.log('Nenhuma reserva para processar');
        db.end();
      }
    });
  });
});