const http = require('http');

// Função para testar se o servidor está rodando
function testarServidor() {
  const options = {
    hostname: '192.168.192.185',
    port: 3000,
    path: '/api/agendamentos/historico',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 5000
  };

  console.log('Testando API do histórico...');

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Resposta da API:');
      try {
        const response = JSON.parse(data);
        console.log('Resposta completa:', JSON.stringify(response, null, 2));
        if (response.success && response.historico) {
          console.log('Número de registros no histórico:', response.historico.length);
          if (response.historico.length > 0) {
            console.log('Primeiro registro:', response.historico[0]);
          }
        }
      } catch (e) {
        console.log('Resposta não é JSON válido:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Erro na requisição: ${e.message}`);
    console.log('O servidor pode não estar rodando. Tente iniciar o servidor com: node server.js');
  });

  req.on('timeout', () => {
    console.log('Timeout na requisição');
    req.destroy();
  });

  req.end();
}

testarServidor();