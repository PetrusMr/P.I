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
  
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const dataOntem = ontem.toISOString().split('T')[0];
  
  console.log('Criando teste com scan de início incompleto...');
  
  // 1. Criar reserva de teste
  const insertReserva = 'INSERT INTO agendamentos (nome, data, horario) VALUES (?, ?, ?)';
  
  db.query(insertReserva, ['teste_inicio', dataOntem, 'tarde'], (err) => {
    if (err) {
      console.error('Erro ao criar reserva:', err);
      db.end();
      return;
    }
    
    // 2. Criar scan de início
    const insertScan = 'INSERT INTO scans (usuario, tipo_scan, resultado_scan, data_hora) VALUES (?, ?, ?, ?)';
    const resultadoInicio = 'Componentes encontrados: 5 mesas, 10 cadeiras, 2 projetores';
    
    db.query(insertScan, ['teste_inicio', 'inicio', resultadoInicio, dataOntem + ' 14:00:00'], (err) => {
      if (err) {
        console.error('Erro ao criar scan:', err);
        db.end();
        return;
      }
      
      console.log('Scan de início criado. Testando limpeza...');
      
      // 3. Simular limpeza
      const agendamento = {
        nome: 'teste_inicio',
        data: dataOntem,
        horario: 'tarde'
      };
      
      const queryScans = `
        SELECT tipo_scan, resultado_scan 
        FROM scans 
        WHERE usuario = ? 
        AND DATE(data_hora) = ?
        ORDER BY data_hora
      `;
      
      db.query(queryScans, [agendamento.nome, agendamento.data], (err, scans) => {
        if (err) {
          console.error('Erro ao verificar scans:', err);
          db.end();
          return;
        }
        
        console.log('Scans encontrados:', scans);
        
        const scanInicio = scans.find(scan => scan.tipo_scan === 'inicio');
        const temFim = scans.some(scan => scan.tipo_scan === 'fim');
        
        let statusScan = '';
        if (!scanInicio && !temFim) {
          statusScan = 'Nenhum scan realizado';
        } else if (scanInicio && !temFim) {
          statusScan = `Scan incompleto - Início: ${scanInicio.resultado_scan}`;
        } else {
          console.log('Scan completo');
          return;
        }
        
        console.log('Status a ser salvo:', statusScan);
        
        // Salvar scan incompleto
        const insertIncompleto = 'INSERT INTO scans (usuario, tipo_scan, resultado_scan, data_hora) VALUES (?, ?, ?, NOW())';
        
        db.query(insertIncompleto, [agendamento.nome, 'fim', statusScan], (err) => {
          if (err) {
            console.error('Erro ao salvar:', err);
          } else {
            console.log('Scan incompleto salvo com sucesso!');
          }
          
          // Limpar dados de teste
          db.query('DELETE FROM agendamentos WHERE nome = ?', ['teste_inicio'], () => {
            db.query('DELETE FROM scans WHERE usuario = ?', ['teste_inicio'], () => {
              console.log('Dados de teste removidos');
              db.end();
            });
          });
        });
      });
    });
  });
});