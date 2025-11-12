const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/lista/historico',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando nova rota: /api/agendamentos/lista/historico');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta completa:');
    console.log(data);
    
    try {
      const json = JSON.parse(data);
      console.log('\nJSON parseado:');
      console.log('Success:', json.success);
      
      if (json.historico !== undefined) {
        console.log('✅ HISTÓRICO FUNCIONANDO!');
        console.log('Registros encontrados:', json.historico.length);
        
        if (json.historico.length > 0) {
          console.log('\nPrimeiros registros:');
          json.historico.slice(0, 3).forEach((item, index) => {
            const data = new Date(item.data).toLocaleDateString('pt-BR');
            console.log(`${index + 1}. ${item.nome} - ${data} - ${item.horario}`);
          });
        }
      } else {
        console.log('❌ Resposta não contém histórico');
      }
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();