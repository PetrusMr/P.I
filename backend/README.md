# Backend EasyControl

API REST para o sistema EasyControl de controle de sala e contagem de itens.

## Tecnologias

- Node.js
- Express.js
- MySQL
- CORS

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Configurar banco de dados MySQL:
```sql
CREATE DATABASE easycontrol;
```

3. Executar scripts de criação das tabelas:
```bash
mysql -u root -p easycontrol < setup_database.sql
```

4. Iniciar servidor:
```bash
npm start
```

## Endpoints

### Autenticação
- `POST /api/login` - Login de usuário

### Agendamentos
- `POST /api/agendamentos` - Criar agendamento
- `GET /api/agendamentos/:data` - Verificar horários ocupados
- `GET /api/agendamentos/usuario/:nome` - Buscar agendamentos do usuário
- `DELETE /api/agendamentos/:id` - Cancelar agendamento

### Scans
- `POST /api/scans` - Salvar scan
- `GET /api/agendamentos/ativo/:nome` - Verificar agendamento ativo

## Configuração

O servidor roda na porta 3000 por padrão e aceita conexões de qualquer origem (CORS configurado).