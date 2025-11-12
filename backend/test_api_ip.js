const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/historico',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando API no IP: 192.168.192.185:3000');
console.log('Rota: /api/agendamentos/historico\n');

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
      console.log('Success:', response.success);
      console.log('Registros encontrados:', response.historico ? response.historico.length : 0);
      
      if (response.historico && response.historico.length > 0) {
        console.log('\nPrimeiros registros:');
        response.historico.slice(0, 5).forEach((item, index) => {
          const data = new Date(item.data).toLocaleDateString('pt-BR');
          console.log(`${index + 1}. ${item.nome} - ${data} - ${item.horario}`);
        });
      } else {
        console.log('Nenhum registro encontrado no histórico');
      }
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
      console.log('Resposta bruta:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro na requisição: ${e.message}`);
  console.log('Verifique se o servidor está rodando no IP 192.168.192.185:3000');
});

req.end();