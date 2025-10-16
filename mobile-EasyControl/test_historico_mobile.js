const http = require('http');

// Teste usando a mesma configuração do mobile
const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/historico',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando API do histórico do ambiente mobile...');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta bruta:', data);
    try {
      const response = JSON.parse(data);
      console.log('Resposta parseada:');
      console.log('- Success:', response.success);
      if (response.historico) {
        console.log('- Histórico encontrado:', response.historico.length, 'registros');
        if (response.historico.length > 0) {
          console.log('- Primeiro registro:', response.historico[0]);
        }
      } else if (response.horarios) {
        console.log('- ERRO: Retornou horarios em vez de historico');
        console.log('- Horários:', response.horarios);
      }
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro na requisição: ${e.message}`);
});

req.setTimeout(10000, () => {
  console.log('Timeout na requisição');
  req.destroy();
});

req.end();