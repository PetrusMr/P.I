# Deploy no Vercel - EasyControl Backend

## Configuração das Variáveis de Ambiente

Após fazer o deploy no Vercel, você precisa configurar as seguintes variáveis de ambiente no painel do Vercel:

### Variáveis Obrigatórias:

1. **DB_HOST** - Host do banco de dados MySQL
2. **DB_USER** - Usuário do banco de dados
3. **DB_PASSWORD** - Senha do banco de dados
4. **DB_NAME** - Nome do banco de dados (easycontrol)
5. **GEMINI_API_KEY** - Sua chave da API do Google Gemini
6. **PORT** - Porta do servidor (opcional, Vercel define automaticamente)

### Como configurar no Vercel:

1. Acesse o painel do Vercel
2. Vá para o projeto EasyControl
3. Clique em "Settings"
4. Vá para "Environment Variables"
5. Adicione cada variável com seus respectivos valores

### Exemplo de valores:
```
DB_HOST=seu-host-mysql.com
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=easycontrol
GEMINI_API_KEY=AIzaSyD61brqsqzlZMLszfWh791tfHM7bURVT-0
```

## Comandos para Deploy:

1. Instalar dependências:
```bash
npm install
```

2. Fazer commit das mudanças:
```bash
git add .
git commit -m "Configuração para deploy no Vercel"
git push
```

3. Deploy automático será feito pelo Vercel após o push.

## Notas Importantes:

- O arquivo `.env` não é commitado (está no .gitignore)
- As chaves de API agora são carregadas via variáveis de ambiente
- O projeto está pronto para deploy no Vercel