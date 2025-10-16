const http = require('http');

const options = {
  hostname: '192.168.192.185',
  port: 3000,
  path: '/api/agendamentos/todas',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testando rota de todas as reservas...');
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
      if (response.success && response.reservas) {
        console.log('Número de reservas:', response.reservas.length);
        if (response.reservas.length > 0) {
          console.log('Primeira reserva:', response.reservas[0]);
          console.log('Todas as reservas:');
          response.reservas.forEach((reserva, index) => {
            console.log(`${index + 1}. ${reserva.nome} - ${reserva.data} - ${reserva.horario}`);
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