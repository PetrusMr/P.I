const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/ativo/user',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta da API:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();