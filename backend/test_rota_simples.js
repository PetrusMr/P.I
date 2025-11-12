const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/historico',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando rota: http://192.168.192.185:3000/api/agendamentos/historico');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta completa:');
    console.log(data);
    
    try {
      const json = JSON.parse(data);
      console.log('\nJSON parseado:');
      console.log('Success:', json.success);
      console.log('Histórico length:', json.historico ? json.historico.length : 'undefined');
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();