const http = require('http');

// Teste direto da rota do histórico
const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/test',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando rota de teste primeiro...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta:', data);
    
    // Agora testa o histórico
    console.log('\nTestando histórico...');
    
    const historicoOptions = {
      hostname: '192.168.192.185',
      port: 3000,
      path: '/api/agendamentos/historico',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const historicoReq = http.request(historicoOptions, (historicoRes) => {
      console.log(`Status histórico: ${historicoRes.statusCode}`);
      
      let historicoData = '';
      
      historicoRes.on('data', (chunk) => {
        historicoData += chunk;
      });
      
      historicoRes.on('end', () => {
        console.log('Resposta histórico:', historicoData);
      });
    });
    
    historicoReq.on('error', (e) => {
      console.error(`Erro histórico: ${e.message}`);
    });
    
    historicoReq.end();
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();