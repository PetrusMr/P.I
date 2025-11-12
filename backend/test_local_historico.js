const http = require('http');

// Teste local
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/agendamentos/historico',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando API do histórico localmente...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta completa:', data);
    try {
      const response = JSON.parse(data);
      console.log('JSON parseado:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro na requisição: ${e.message}`);
  console.log('Servidor pode não estar rodando localmente');
});

req.end();