# Correção de Autenticação - Usuários vs Supervisores

## Problema Corrigido
Os usuários da tabela `usuarios` conseguiam fazer login no supervisor. Isso foi corrigido implementando uma verificação que impede usuários comuns de acessar o sistema como supervisor.

## Mudanças Implementadas

### 1. Verificação no Backend
- Modificada a rota `/api/login-supervisor` para verificar se o usuário não existe na tabela `usuarios`
- Se o usuário existir na tabela `usuarios`, o acesso como supervisor é negado

### 2. Separação de Usuários
- Removidos usuários duplicados entre as tabelas `usuarios` e `supervisor`
- Criado supervisor padrão exclusivo

## Credenciais de Acesso

### Usuários Comuns (tabela usuarios)
- **admin** / **admin123**
- **user** / **123456**

### Supervisor (tabela supervisor)
- **supervisor** / **supervisor123**

## Como Testar

1. **Login como usuário comum:**
   - Use: admin/admin123 ou user/123456
   - Toggle do supervisor deve estar DESLIGADO
   - Deve acessar a tela de professor

2. **Login como supervisor:**
   - Use: supervisor/supervisor123
   - Toggle do supervisor deve estar LIGADO
   - Deve acessar a tela de supervisor

3. **Teste de segurança:**
   - Tente usar admin/admin123 com toggle do supervisor LIGADO
   - Deve mostrar erro: "Acesso negado: usuário não é supervisor"

## Arquivos Modificados
- `server.js` - Adicionada verificação de segurança na rota de login do supervisor
- `fix_user_separation.js` - Script para separar usuários e criar supervisor padrão