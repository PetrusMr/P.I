const http = require('http');

function testarRota(path, nome) {
  return new Promise((resolve) => {
    const options = {
      hostname: '192.168.192.185',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(`\n=== Testando ${nome} ===`);
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
          console.log('Resposta:', JSON.stringify(response, null, 2));
          resolve(response);
        } catch (e) {
          console.log('Erro ao parsear JSON:', e.message);
          console.log('Resposta bruta:', data);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Erro: ${e.message}`);
      resolve(null);
    });

    req.setTimeout(5000, () => {
      console.log('Timeout');
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}

async function executarTestes() {
  // Teste 1: Rota de teste do histórico
  await testarRota('/api/test-historico', 'Teste Histórico');
  
  // Teste 2: Nova rota do histórico
  await testarRota('/api/historico-reservas', 'Nova Rota Histórico');
  
  // Teste 3: Rota original (para comparar)
  await testarRota('/api/agendamentos/historico', 'Rota Original');
}

executarTestes();