# Configuração da API Gemini

## Passos para configurar a análise de componentes eletrônicos:

1. **Obter chave da API Gemini:**
   - Acesse: https://makersuite.google.com/app/apikey
   - Faça login com sua conta Google
   - Clique em "Create API Key"
   - Copie a chave gerada

2. **Configurar a chave no projeto:**
   - Abra o arquivo: `src/environments/environment.ts`
   - Substitua `YOUR_GEMINI_API_KEY_HERE` pela sua chave da API

3. **Funcionalidade:**
   - Ao capturar uma foto ou selecionar da galeria
   - A imagem é enviada para a API Gemini
   - O resultado da análise é exibido em um popup
   - A análise identifica componentes eletrônicos relacionados a Arduino

## Exemplo de uso:
- Clique no ícone da câmera na tela inicial
- Tire uma foto de componentes eletrônicos
- Aguarde a análise
- Veja o resultado no popup