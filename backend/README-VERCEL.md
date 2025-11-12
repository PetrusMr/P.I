# Deploy no Vercel

## Configuração necessária:

1. **Variáveis de ambiente no Vercel:**
   - `DB_HOST`: Host do banco de dados
   - `DB_USER`: Usuário do banco
   - `DB_PASSWORD`: Senha do banco
   - `DB_NAME`: Nome do banco

2. **Banco de dados:**
   - Use um serviço como PlanetScale, Railway ou Aiven para MySQL
   - Configure as variáveis de ambiente com os dados de conexão

3. **Deploy:**
   - Conecte o repositório GitHub ao Vercel
   - Configure as variáveis de ambiente
   - Deploy automático

## Estrutura preparada:
- ✅ vercel.json configurado
- ✅ Variáveis de ambiente implementadas
- ✅ Export do app para serverless
- ✅ .gitignore criado