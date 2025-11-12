const https = require('https');

const data = JSON.stringify({
  usuario: 'user',
  senha: '123'
});

const options = {
  hostname: 'back-end-requtluwk-petrusmrs-projects.vercel.app',
  port: 443,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testando login no Vercel...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Erro:', error);
});

req.write(data);
req.end();