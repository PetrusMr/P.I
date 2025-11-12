const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

// Função para listar modelos disponíveis
async function listarModelos() {
  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    console.log('Modelos disponíveis:', response.data.models?.map(m => m.name));
    
    // Procurar modelo que suporte generateContent e vision
    const modeloComImagem = response.data.models?.find(model => 
      model.supportedGenerationMethods?.includes('generateContent') &&
      (model.name.includes('vision') || model.name.includes('1.5'))
    );
    
    if (modeloComImagem) {
      console.log('Usando modelo:', modeloComImagem.name);
      return `https://generativelanguage.googleapis.com/v1beta/${modeloComImagem.name}:generateContent`;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao listar modelos:', error.response?.data);
    return null;
  }
}

router.post('/analisar-componentes', async (req, res) => {
  console.log('Requisição recebida para análise de componentes');
  try {
    const { imageBase64 } = req.body;
    console.log('Tamanho da imagem base64:', imageBase64 ? imageBase64.length : 'undefined');

    if (!imageBase64) {
      console.log('Erro: Imagem base64 não fornecida');
      return res.status(400).json({ error: 'Imagem base64 é obrigatória' });
    }

    // Usar modelo disponível
    const urlFuncionando = await listarModelos();
    if (!urlFuncionando) {
      return res.status(500).json({ error: 'Nenhum modelo Gemini com suporte a imagem disponível' });
    }

    const payload = {
      contents: [{
        parts: [
          {
            text: "Analise esta imagem e conte os componentes eletrônicos relacionados a Arduino ou pequenos circuitos. Formate a resposta EXATAMENTE assim:\n\nTotal [número]\n[nome do componente] [quantidade]\n[nome do componente] [quantidade]\n\nExemplo:\nTotal 3\nresistores 2\nled 1\n\nSe não houver componentes, responda: Total 0"
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }]
    };

    console.log('Enviando para API Gemini...');
    const response = await axios.post(`${urlFuncionando}?key=${GEMINI_API_KEY}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta da API Gemini recebida');
    const resultado = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível analisar a imagem';
    
    res.json({ resultado });
  } catch (error) {
    console.error('Erro na API Gemini:', error.response?.data || error.message);
    console.error('Status do erro:', error.response?.status);
    res.status(500).json({ error: 'Erro ao analisar imagem', details: error.response?.data || error.message });
  }
});

module.exports = router;