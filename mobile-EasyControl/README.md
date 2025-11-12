# Mobile EasyControl

Aplicativo móvel para controle de sala e contagem de itens.

## Tecnologias

- Ionic 8
- Angular 20
- Capacitor 7
- TypeScript

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Executar em modo desenvolvimento:
```bash
ionic serve
```

3. Build para produção:
```bash
ionic build
```

4. Executar no Android:
```bash
ionic capacitor run android
```

## Funcionalidades

- Login de usuários
- Agendamento de horários
- Contagem de objetos com IA
- Histórico de scans
- Interface responsiva

## Estrutura

- `/src/app/pages` - Páginas da aplicação
- `/src/app/services` - Serviços e APIs
- `/src/app/guards` - Guards de autenticação
- `/src/app/shared` - Componentes compartilhados




 
Projeto: Easy Control
 
Objetivo do projeto:
O objetivo do aplicativo Easy Control, é facilitar a forma em que o professor agenda o uso de uma sala, com a supervisão do seus superiores, e facilita a forma em que ele faz contagem de itens pequenos.
 
 
Arquitetura e stack:
A interface foi feita pelo framework ionic
O backend (login, reserva, scan) foi feito em javascript
Foi utilizado o vercel para hospedar o server.js (arquivo onde é executado o backend) para que funcione sem a necessidade de start
Utilizando o banco de dados do Railway
 
 
após fazer o login selecione o database/ mysql, aguarde, selecione e crie as tabelas ...
//
  const db = createConnection();
  const queries = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50) UNIQUE NOT NULL,
      senha VARCHAR(50) NOT NULL,
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS agendamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL,
      data DATE NOT NULL,
      horario VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS supervisor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50) UNIQUE NOT NULL,
      senha VARCHAR(50) NOT NULL,
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS historico_agendamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(50) NOT NULL,
      data DATE NOT NULL,
      horario VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `INSERT IGNORE INTO usuarios (usuario, senha, email) VALUES 
      ('admin', '123', 'admin@teste.com'),
      ('user1', '123', 'user1@teste.com'),
      ('petrus', '123', 'petrus@teste.com')`,
    `INSERT IGNORE INTO supervisor (usuario, senha, email) VALUES 
      ('supervisor', 'admin123', 'supervisor@teste.com')`
//
 
 
Substitua os dados de conexão em variables com os seus dados que aparecem no server.js, logo em seguida vá em .env e adicione sua chave gemini(ou outra IA de sua preferência), depois crie um repositório no GitHub e faça o deploy no vercel, em settings/Environments Variables adicione as variaveis e a sua chave api.
Instalar dependências:
npm install

Executar em modo desenvolvimento:
ionic serve

Build para produção:
ionic build

Executar no Android:
ionic capacitor run android
 
Funcionalidades:
Login de usuários
Agendamento de horários
Contagem de objetos com IA
Histórico de scans
Interface responsiva
 
Estrutura:
/src/app/pages - Páginas da aplicação
/src/app/services - Serviços e APIs
/src/app/guards - Guards de autenticação
/src/app/shared - Componentes compartilhados
 
Testes e Validação
 
Ao implementar algo novo (tela ou função) era feito o teste para verificar se ela estava funcionando de acordo, após isso era feito o deploy, Github após isso era feito o teste para todos para ver se há algum problema, caso tivesse era feito o concerto do erro e a verificação do erros e do implementado, teste era feito com a conexão ao pc rodando os serviços localmente