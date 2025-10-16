const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/historico',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando rota temporária do histórico...');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Success:', response.success);
      if (response.success && response.historico) {
        console.log('Número de registros no histórico:', response.historico.length);
        if (response.historico.length > 0) {
          console.log('Registros encontrados:');
          response.historico.forEach((registro, index) => {
            const data = new Date(registro.data).toLocaleDateString('pt-BR');
            console.log(`${index + 1}. ${registro.nome} - ${data} - ${registro.horario}`);
          });
        }
      } else {
        console.log('Resposta completa:', JSON.stringify(response, null, 2));
      }
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
      console.log('Resposta bruta:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();