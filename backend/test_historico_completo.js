const mysql = require('mysql2');
const http = require('http');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'q1w2e3',
  database: 'easycontrol'
});

console.log('=== TESTE COMPLETO DO HISTÓRICO ===\n');

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  
  console.log('✅ Conectado ao MySQL\n');
  
  // 1. Verificar se a tabela existe
  console.log('1. Verificando se a tabela historico_agendamentos existe...');
  const checkTableQuery = `
    SELECT COUNT(*) as count 
    FROM information_schema.tables 
    WHERE table_schema = 'easycontrol' 
    AND table_name = 'historico_agendamentos'
  `;
  
  db.query(checkTableQuery, (err, results) => {
    if (err) {
      console.error('❌ Erro ao verificar tabela:', err);
      db.end();
      return;
    }
    
    if (results[0].count === 0) {
      console.log('❌ Tabela não existe. Criando...');
      
      const createTableQuery = `
        CREATE TABLE historico_agendamentos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          data DATE NOT NULL,
          horario ENUM('manha', 'tarde', 'noite') NOT NULL,
          data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela:', err);
          db.end();
          return;
        }
        console.log('✅ Tabela criada com sucesso!\n');
        inserirDadosTeste();
      });
    } else {
      console.log('✅ Tabela existe!\n');
      verificarDados();
    }
  });
  
  function verificarDados() {
    console.log('2. Verificando dados existentes...');
    db.query('SELECT COUNT(*) as count FROM historico_agendamentos', (err, results) => {
      if (err) {
        console.error('❌ Erro ao contar registros:', err);
        db.end();
        return;
      }
      
      const count = results[0].count;
      console.log(`📊 Registros encontrados: ${count}\n`);
      
      if (count === 0) {
        inserirDadosTeste();
      } else {
        mostrarDados();
      }
    });
  }
  
  function inserirDadosTeste() {
    console.log('3. Inserindo dados de teste...');
    
    const dadosHistorico = [
      ['João Silva', '2025-01-20', 'manha'],
      ['Maria Santos', '2025-01-20', 'tarde'],
      ['Pedro Costa', '2025-01-20', 'noite'],
      ['Ana Oliveira', '2025-01-21', 'manha'],
      ['Carlos Lima', '2025-01-21', 'tarde'],
      ['Lucia Ferreira', '2025-01-21', 'noite'],
      ['Roberto Alves', '2025-01-22', 'manha'],
      ['Fernanda Rocha', '2025-01-22', 'tarde']
    ];
    
    const query = 'INSERT INTO historico_agendamentos (nome, data, horario) VALUES ?';
    
    db.query(query, [dadosHistorico], (err, result) => {
      if (err) {
        console.error('❌ Erro ao inserir dados:', err);
        db.end();
        return;
      }
      
      console.log(`✅ ${result.affectedRows} registros inseridos com sucesso!\n`);
      mostrarDados();
    });
  }
  
  function mostrarDados() {
    console.log('4. Mostrando dados da tabela...');
    
    const selectQuery = 'SELECT * FROM historico_agendamentos ORDER BY data DESC, horario LIMIT 10';
    
    db.query(selectQuery, (err, results) => {
      if (err) {
        console.error('❌ Erro ao consultar dados:', err);
        db.end();
        return;
      }
      
      console.log('📋 Dados na tabela historico_agendamentos:');
      results.forEach((registro, index) => {
        const data = new Date(registro.data).toLocaleDateString('pt-BR');
        console.log(`   ${index + 1}. ${registro.nome} - ${data} - ${registro.horario}`);
      });
      
      console.log('\n5. Testando API...');
      testarAPI();
    });
  }
  
  function testarAPI() {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/agendamentos/historico',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      console.log(`📡 Status da API: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Resposta da API:');
          console.log(`   Success: ${response.success}`);
          console.log(`   Registros retornados: ${response.historico ? response.historico.length : 0}`);
          
          if (response.historico && response.historico.length > 0) {
            console.log('📋 Primeiros 3 registros da API:');
            response.historico.slice(0, 3).forEach((item, index) => {
              const data = new Date(item.data).toLocaleDateString('pt-BR');
              console.log(`   ${index + 1}. ${item.nome} - ${data} - ${item.horario}`);
            });
          }
        } catch (e) {
          console.log('❌ Resposta não é JSON válido:', data);
        }
        
        console.log('\n=== TESTE CONCLUÍDO ===');
        db.end();
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ Erro na requisição da API: ${e.message}`);
      console.log('💡 Certifique-se de que o servidor está rodando na porta 3000');
      db.end();
    });
    
    req.end();
  }
});