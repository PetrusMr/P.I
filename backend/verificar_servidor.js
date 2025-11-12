const http = require('http');

console.log('=== VERIFICANDO SERVIDOR ===\n');

// Teste 1: Verificar se servidor está rodando
const testRoot = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/',
  method: 'GET'
};

console.log('1. Testando rota raiz...');

const req1 = http.request(testRoot, (res) => {
  console.log(`✅ Servidor respondeu: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Resposta:', data);
    
    // Teste 2: Verificar rota de teste
    console.log('\n2. Testando rota /api/test...');
    
    const testApi = {
      hostname: '192.168.192.185',
      port: 3000,
      path: '/api/test',
      method: 'GET'
    };
    
    const req2 = http.request(testApi, (res2) => {
      console.log(`Status /api/test: ${res2.statusCode}`);
      
      let data2 = '';
      res2.on('data', (chunk) => { data2 += chunk; });
      res2.on('end', () => {
        console.log('Resposta /api/test:', data2);
        
        // Teste 3: Verificar rota histórico
        console.log('\n3. Testando rota /api/agendamentos/historico...');
        
        const testHistorico = {
          hostname: '192.168.192.185',
          port: 3000,
          path: '/api/agendamentos/historico',
          method: 'GET'
        };
        
        const req3 = http.request(testHistorico, (res3) => {
          console.log(`Status histórico: ${res3.statusCode}`);
          
          let data3 = '';
          res3.on('data', (chunk) => { data3 += chunk; });
          res3.on('end', () => {
            console.log('Resposta histórico:', data3);
            
            try {
              const json = JSON.parse(data3);
              if (json.historico !== undefined) {
                console.log('\n✅ ROTA DO HISTÓRICO FUNCIONANDO!');
                console.log(`Registros: ${json.historico.length}`);
              } else if (json.horarios !== undefined) {
                console.log('\n❌ Ainda caindo na rota errada (/:data)');
                console.log('💡 Reinicie o servidor: Ctrl+C e depois node server.js');
              }
            } catch (e) {
              console.log('Erro ao parsear:', e.message);
            }
          });
        });
        
        req3.on('error', (e) => {
          console.error(`Erro histórico: ${e.message}`);
        });
        
        req3.end();
      });
    });
    
    req2.on('error', (e) => {
      console.error(`Erro /api/test: ${e.message}`);
    });
    
    req2.end();
  });
});

req1.on('error', (e) => {
  console.error(`❌ Servidor não está rodando: ${e.message}`);
  console.log('💡 Inicie o servidor: node server.js');
});

req1.end();