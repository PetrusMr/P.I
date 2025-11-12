const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/test',
  method: 'GET'
};

console.log('Testando rota /api/test modificada...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Resposta:', data);
    
    try {
      const json = JSON.parse(data);
      if (json.historico) {
        console.log(`✅ FUNCIONANDO! ${json.historico.length} registros`);
        if (json.historico.length > 0) {
          console.log('Primeiro:', json.historico[0]);
        }
      }
    } catch (e) {
      console.log('Erro:', e.message);
    }
  });
});

req.on('error', (e) => console.error(`Erro: ${e.message}`));
req.end();