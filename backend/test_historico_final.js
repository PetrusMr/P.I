const http = require('http');

console.log('=== TESTE FINAL DO HISTÓRICO ===\n');

// Teste 1: Verificar se o servidor está rodando
console.log('1. Testando se o servidor está rodando...');

const testServer = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/',
  method: 'GET'
};

const reqServer = http.request(testServer, (res) => {
  console.log(`✅ Servidor respondeu com status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Resposta do servidor:', data);
    console.log('\n2. Testando rota do histórico...');
    testarHistorico();
  });
});

reqServer.on('error', (e) => {
  console.error(`❌ Erro ao conectar com o servidor: ${e.message}`);
  console.log('💡 Inicie o servidor com: node server.js');
});

reqServer.end();

function testarHistorico() {
  const options = {
    hostname: '192.168.192.185',
    port: 3000,
    path: '/api/agendamentos/historico',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status da rota histórico: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Resposta da API do histórico:');
        console.log(`   Success: ${response.success}`);
        console.log(`   Registros encontrados: ${response.historico ? response.historico.length : 0}`);
        
        if (response.historico && response.historico.length > 0) {
          console.log('\n📋 Registros do histórico:');
          response.historico.forEach((item, index) => {
            const data = new Date(item.data).toLocaleDateString('pt-BR');
            console.log(`   ${index + 1}. ${item.nome} - ${data} - ${item.horario}`);
          });
          console.log('\n✅ HISTÓRICO FUNCIONANDO CORRETAMENTE!');
        } else {
          console.log('\n⚠️  Nenhum registro encontrado no histórico');
          console.log('💡 Execute: node inserir_dados_historico.js para adicionar dados de teste');
        }
      } catch (e) {
        console.log('❌ Erro ao parsear resposta:', e.message);
        console.log('Resposta bruta:', data);
      }
      
      console.log('\n=== TESTE CONCLUÍDO ===');
    });
  });
  
  req.on('error', (e) => {
    console.error(`❌ Erro na requisição do histórico: ${e.message}`);
  });
  
  req.end();
}