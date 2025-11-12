const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('Inserindo dados atuais no histórico...');

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('✅ Conectado ao MySQL');
  
  // Limpar dados antigos
  console.log('🧹 Limpando dados antigos...');
  db.query('DELETE FROM historico_agendamentos', (err) => {
    if (err) {
      console.error('Erro ao limpar dados:', err);
    } else {
      console.log('✅ Dados antigos removidos');
    }
    
    // Inserir dados atuais
    const hoje = new Date();
    const dadosHistorico = [];
    
    // Adicionar dados dos últimos 7 dias
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      dadosHistorico.push(['João Silva', dataStr, 'manha']);
      dadosHistorico.push(['Maria Santos', dataStr, 'tarde']);
      if (i < 3) { // Apenas nos últimos 3 dias
        dadosHistorico.push(['Pedro Costa', dataStr, 'noite']);
      }
    }
    
    // Adicionar dados dos próximos dias também
    for (let i = 1; i <= 3; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const dataStr = data.toISOString().split('T')[0];
      
      dadosHistorico.push(['Ana Oliveira', dataStr, 'manha']);
      dadosHistorico.push(['Carlos Lima', dataStr, 'tarde']);
    }
    
    console.log(`📝 Inserindo ${dadosHistorico.length} registros...`);
    
    const query = 'INSERT INTO historico_agendamentos (nome, data, horario) VALUES ?';
    
    db.query(query, [dadosHistorico], (err, result) => {
      if (err) {
        console.error('❌ Erro ao inserir dados:', err);
      } else {
        console.log(`✅ ${result.affectedRows} registros inseridos com sucesso!`);
        
        // Verificar os dados inseridos
        const selectQuery = 'SELECT * FROM historico_agendamentos ORDER BY data DESC LIMIT 10';
        
        db.query(selectQuery, (err, results) => {
          if (err) {
            console.error('Erro ao consultar dados:', err);
          } else {
            console.log('\n📋 Últimos registros inseridos:');
            results.forEach((registro, index) => {
              const data = new Date(registro.data).toLocaleDateString('pt-BR');
              console.log(`${index + 1}. ${registro.nome} - ${data} - ${registro.horario}`);
            });
          }
          
          console.log('\n✅ Dados inseridos com sucesso!');
          console.log('💡 Agora teste o app mobile para ver o histórico');
          db.end();
        });
      }
    });
  });
});