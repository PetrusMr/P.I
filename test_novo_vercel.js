const https = require('https');

console.log('Testando novo link do Vercel...');

// Teste básico
const req1 = https.request('https://back-end-pi-beta.vercel.app/api/test', (res) => {
  console.log(`Status teste: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Resposta teste:', data));
});
req1.on('error', err => console.error('Erro teste:', err.message));
req1.end();

// Teste login
const loginData = JSON.stringify({ usuario: 'user', senha: '123' });
const loginReq = https.request({
  hostname: 'back-end-pi-beta.vercel.app',
  path: '/api/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  console.log(`Status login: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Resposta login:', data));
});
loginReq.on('error', err => console.error('Erro login:', err.message));
loginReq.write(loginData);
loginReq.end();