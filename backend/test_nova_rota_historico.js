const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/historico-reservas',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando nova rota: /api/historico-reservas');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta:');
    console.log(data);
    
    try {
      const json = JSON.parse(data);
      if (json.historico) {
        console.log(`✅ FUNCIONANDO! ${json.historico.length} registros encontrados`);
        if (json.historico.length > 0) {
          console.log('Primeiro registro:', json.historico[0]);
        }
      } else {
        console.log('❌ Não retornou histórico');
      }
    } catch (e) {
      console.log('Erro:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();