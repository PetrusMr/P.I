const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/historico-temp',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando rota temporária: /api/agendamentos/historico-temp');

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
      console.log('\n✅ JSON parseado com sucesso!');
      console.log('Success:', json.success);
      console.log('Registros encontrados:', json.historico ? json.historico.length : 0);
      
      if (json.historico && json.historico.length > 0) {
        console.log('\n📋 Primeiros registros:');
        json.historico.slice(0, 5).forEach((item, index) => {
          const data = new Date(item.data).toLocaleDateString('pt-BR');
          console.log(`${index + 1}. ${item.nome} - ${data} - ${item.horario}`);
        });
        console.log('\n🎉 HISTÓRICO FUNCIONANDO PERFEITAMENTE!');
      } else {
        console.log('\n⚠️ Nenhum registro no histórico');
      }
    } catch (e) {
      console.log('❌ Erro ao parsear JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();