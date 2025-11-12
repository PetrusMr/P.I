const https = require('https');

const loginData = JSON.stringify({
  usuario: 'user',
  senha: '123'
});

const options = {
  hostname: 'back-end-pi-beta.vercel.app',
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('Testando login...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Resposta completa:', data);
    try {
      const json = JSON.parse(data);
      console.log('JSON:', json);
    } catch (e) {
      console.log('Não é JSON válido');
    }
  });
});

req.on('error', (error) => {
  console.error('Erro na requisição:', error);
});

req.write(loginData);
req.end();