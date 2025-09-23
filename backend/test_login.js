const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testando login...');
    
    const response = await axios.post('http://192.168.0.104:3000/api/login', {
      usuario: 'admin',
      senha: 'admin123'
    });
    
    console.log('Login bem-sucedido:', response.data);
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error.message);
  }
}

testLogin();