# 🏢 P.I - Projeto Easy Control

<div align="center">

![Static Badge](https://img.shields.io/badge/Desenvolvido%20%20---%2332ED6F?style=flat&logoColor=white&label=Status&labelColor=gray&color=%2382D19C)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Static Badge](https://img.shields.io/badge/All%20Rights%20Reserved%20%20---%233EF076?style=flat&logoColor=white&label=License&labelColor=gray&color=%235BF087)

**Sistema simplificado para controle e agendamento de salas**

[📋 Equipe](#-equipe) • 
[📋 Funcionalidades](#-funcionalidades) • 
[🛠️ Tecnologias](#️-tecnologias) • 
[📖 Documentação](#-documentação) • 
[🚀 Instalação](#-instalação) • 
[📞 Suporte](#-suporte) • 

</div>

---

## 📋 Equipe

| Desenvolvedor | Função | Contato |
|---------------|--------|---------|
|Petrus Machado Ramos| Full Stack Developer | [![LinkedIn](https://img.shields.io/badge/LinkedIn---0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/petrus-machado-372a8234b/) |
|Micael Paraizo De Oliveira| Analista de Sistemas | [![LinkedIn](https://img.shields.io/badge/LinkedIn---0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/micael-paraizo-8081a934b/) |
|Nathan Eduardo de Lima Oliveira| Analista de Sistemas | [![LinkedIn](https://img.shields.io/badge/LinkedIn---0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nathan-eduardo-56875134a/) |
|Joaz Rodrigues Da Silva Melo| Analista de Requisitos | [![LinkedIn](https://img.shields.io/badge/LinkedIn---0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joaz-rodrigues/) |

## 📋 Funcionalidades

### ✅ Principais Recursos
- 🔐 **Login multiperfil (professor/supervisor)**
- 📅 **Agendamento de salas com aprovação** 
- 👥 **Contagem de objetos via IA (Gemini)** 
- 📊 **Histórico de agendamentos e scans** 
- 🔔 **Interface mobile responsiva**
- 📷 **Scanner de componentes eletrônicos**
- 🎚️ **Gestão de turnos (manhã, tarde, noite)**



## 🛠️ Tecnologias

<div align="center">

| Frontend | Backend | Banco de Dados | Ferramentas |
|----------|---------|----------------|-------------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) |  | ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat&logo=visual-studio-code&logoColor=white) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white) | | ![Static Badge](https://img.shields.io/badge/Gemini%20%20---%23A8DEFF?style=flat&logo=linkedin&logoColor=white&color=%23A8DEFF) |
| | | | ![Static Badge](https://img.shields.io/badge/Vercel%20%20---%2382D19C?style=flat&logo=linkedin&logoColor=white&color=%2382D19C) |




</div>


## 📖 Documentação

### 📚 Estrutura do Projeto
```
projeto-easy-control/
├── 📁 src/
│   ├── 📁 controllers/     # Controladores da aplicação
│   ├── 📁 models/          # Modelos de dados
│   ├── 📁 routes/          # Rotas da API
│   ├── 📁 middleware/      # Middlewares
│   └── 📁 utils/           # Utilitários
├── 📁 public/              # Arquivos estáticos
├── 📁 views/               # Templates
├── 📁 config/              # Configurações
├── 📁 tests/               # Testes
└── 📄 README.md
```


---

### 📊 Análise de Mercado
- Público-alvo: Instituições de ensino (escolas, faculdades, laboratórios)
- Concorrência: Sistemas legacy e planilhas manuais
- Diferenciação: IA integrada, mobile-first, aprovação em fluxo, scanner de componentes

### 📐 Diagramas
#### Caso de Uso
 ![Caso de Uso ](./IMAGENS/Caso_uso.png)

#### Diagrama de Classes
![Diagrama de Classes ](./IMAGENS/Diag_classe.jpeg)


### ✅ Requisitos 
#### Funcionais
- RF01: Login multiperfil
- RF02: Agendamento com validação
- RF03: Scanner com IA Gemini
- RF04: Gestão de turnos
- RF05: Histórico automático

#### Não Funcionais
- RNF01: Responsivo (Ionic)
- RNF02: Performance (Node.js + MySQL)
- RNF03: Deploy automático (Vercel)

### Credenciais de Teste

Usuários: admin/123, user1/123, petrus/123

Supervisor: supervisor/super123

## 🚀 Instalação
---

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

```bash
✅ Node.js (versão 16+) - https://nodejs.org/
✅ npm (vem com Node.js)
✅ Git - https://git-scm.com/
✅ Android Studio (para mobile) - https://developer.android.com/studio
✅ Ionic CLI - npm install -g @ionic/cli
```
Clone os repositorios

```
git clone https://github.com/PetrusMr/P.I/tree/main/mobile-EasyControl
git clone https://github.com/PetrusMr/BackEnd-PI
```
---

### 📁 Estrutura dos Projetos

```
📦 Seus Projetos
├── 📁 \P.I\mobile-EasyControl\     # Frontend Mobile (Ionic Angular)
└── 📁 \backendPI\                 # Backend (Node.js + Express)
```

---

### 🔧 Configuração do Backend

#### 1️⃣ Navegue até o diretório do backend
```bash
cd \backendPI
```

#### 2️⃣ Instale as dependências
```bash
npm install
```

#### 3️⃣ Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
copy .env.example .env

# Edite o arquivo .env com suas configurações
notepad .env
```

**Exemplo de configuração .env:**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=sua_url_do_banco
FIREBASE_PROJECT_ID=seu_projeto_firebase
GEMINI_API_KEY=sua_chave_gemini
```

#### 4️⃣ Inicie o servidor backend
```bash
# Para desenvolvimento
npm run dev

# Ou para produção
npm start
```

**✅ Backend rodando em:** `http://localhost:3000`

---

### 📱 Configuração do Frontend Mobile

#### 1️⃣ Navegue até o diretório do frontend
```bash
cd \P.I\mobile-EasyControl
```

#### 2️⃣ Instale as dependências
```bash
npm install
```

#### 3️⃣ Configure a URL do backend
Edite o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // URL do seu backend
};
```

#### 4️⃣ Execute o projeto no navegador
```bash
ionic serve
```

**✅ Frontend rodando em:** `http://localhost:8100`

#### 5️⃣ Para executar no Android (Opcional)

```bash
# Adicione a plataforma Android
ionic capacitor add android

# Sincronize os arquivos
ionic capacitor sync android

# Abra no Android Studio
ionic capacitor open android
```

---

### 🔄 Comandos Úteis

#### Backend (D:\backendPI)
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start

# Verificar logs
npm run logs
```

#### Frontend (D:\P.I\mobile-EasyControl)
```bash
# Instalar dependências
npm install

# Executar no navegador
ionic serve

# Build para produção
ionic build

# Sincronizar com mobile
ionic capacitor sync

# Executar no Android
ionic capacitor run android
```

---

### 🌐 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Backend API** | `http://localhost:3000` | Servidor Node.js |
| **Frontend Web** | `http://localhost:8100` | Interface Ionic |
| **API Docs** | `http://localhost:3000/api-docs` | Documentação da API |

---

### 🔍 Testando a Conexão

#### 1️⃣ Teste o Backend
```bash
# Abra o navegador e acesse:
http://localhost:3000/api/health

# Deve retornar:
{"status": "OK", "message": "Backend funcionando!"}
```

#### 2️⃣ Teste o Frontend
```bash
# Abra o navegador e acesse:
http://localhost:8100

# Deve carregar a interface do Easy Control
```

---

### 🛠️ Solução de Problemas

#### ❌ Erro: "Port already in use"
```bash
# Mate o processo na porta
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### ❌ Erro: "Module not found"
```bash
# Limpe o cache e reinstale
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Erro: "CORS Policy"
Verifique se o backend está configurado para aceitar requisições do frontend:
```javascript
// No backend, arquivo server.js
app.use(cors({
  origin: 'http://localhost:8100'
}));
```

---

### 📊 Estrutura de Pastas Detalhada

#### Backend (backendPI)
```
backendPI/
├── 📁 api/
│   ├── 📁 routes/          # Rotas da API
│   └── 📄 index.js         # Arquivo principal da API
├── 📁 backend/
│   ├── 📁 config/          # Configurações
│   └── 📁 routes/          # Rotas específicas
├── 📄 .env                 # Variáveis de ambiente
├── 📄 package.json         # Dependências
└── 📄 server.js           # Servidor principal
```

#### Frontend (\P.I\mobile-EasyControl)
```
mobile-EasyControl/
├── 📁 src/
│   ├── 📁 app/            # Componentes Angular
│   ├── 📁 assets/         # Imagens e recursos
│   └── 📁 environments/   # Configurações de ambiente
├── 📁 android/            # Projeto Android nativo
├── 📄 package.json        # Dependências
└── 📄 capacitor.config.ts # Configuração Capacitor
```

---

### 🚀 Deploy (Opcional)

#### Backend - Vercel
```bash
# No diretório do backend
npm install -g vercel
vercel --prod
```

#### Frontend - Netlify
```bash
# No diretório do frontend
ionic build
# Faça upload da pasta www/ para Netlify
```

---
### 🗄️ Configuração do Banco de Dados (MySQL Railway)

#### 📊 Estrutura das Tabelas

O projeto utiliza MySQL hospedado no Railway com as seguintes tabelas:

##### **Tabela: usuarios**
```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin', 'supervisor', 'usuario') DEFAULT 'usuario',
  turno ENUM('manha', 'tarde', 'noite') DEFAULT 'manha',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

##### **Tabela: salas**
```sql
CREATE TABLE salas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  capacidade INT DEFAULT 0,
  equipamentos TEXT,
  status ENUM('disponivel', 'ocupada', 'manutencao') DEFAULT 'disponivel',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##### **Tabela: agendamentos**
```sql
CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  sala_id INT NOT NULL,
  data_inicio DATETIME NOT NULL,
  data_fim DATETIME NOT NULL,
  status ENUM('ativo', 'cancelado', 'finalizado') DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (sala_id) REFERENCES salas(id)
);
```

##### **Tabela: scans**
```sql
CREATE TABLE scans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  sala_id INT NOT NULL,
  tipo ENUM('entrada', 'saida') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (sala_id) REFERENCES salas(id)
);
```

#### 🔧 Configuração Railway

1. **Acesse:** https://railway.app/
2. **Crie um projeto MySQL**
3. **Copie a URL de conexão:**
```env
DATABASE_URL=mysql://usuario:senha@host:porta/database
```

4. **Configure no .env:**
```env
# Railway MySQL
DATABASE_URL=mysql://root:password@containers-us-west-xxx.railway.app:7431/railway
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=7431
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=railway
```

---

### 🚀 Deploy no Vercel

#### 🔧 Configuração do Backend

##### 1️⃣ Instale o Vercel CLI
```bash
npm install -g vercel
```

##### 2️⃣ Configure o arquivo vercel.json
Crie o arquivo `vercel.json` no diretório do backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

##### 3️⃣ Configure as variáveis de ambiente no Vercel
```bash
# No diretório do backend
vercel

# Configure as variáveis:
vercel env add DATABASE_URL
vercel env add FIREBASE_PROJECT_ID
vercel env add GEMINI_API_KEY
vercel env add PORT
```

##### 4️⃣ Deploy
```bash
# Deploy de produção
vercel --prod
```

#### 📱 Configuração do Frontend para Produção

##### 1️⃣ Atualize environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-backend.vercel.app/api'
};
```

##### 2️⃣ Build e Deploy
```bash
# Build para produção
ionic build --prod

# Deploy no Netlify/Vercel
# Faça upload da pasta www/
```

#### 🔗 URLs de Produção

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Backend** | `https://seu-backend.vercel.app` | API em produção |
| **Frontend** | `https://seu-frontend.netlify.app` | App em produção |
| **Database** | `Railway MySQL` | Banco de dados |

---

### 📊 Monitoramento

#### 🔍 Logs do Vercel
```bash
# Ver logs em tempo real
vercel logs

# Ver logs de uma função específica
vercel logs --follow
```

#### 📈 Railway Dashboard
- Acesse o painel do Railway para monitorar:
  - Conexões ativas
  - Uso de CPU/Memória
  - Logs do banco
  - Métricas de performance

---



## 📞 Suporte

Encontrou um bug ou tem uma sugestão? 

 📧 Email: petrusmachado12@gmail.com

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

![Footer](https://img.shields.io/badge/Feito%20com-❤️-red)
![Footer](https://img.shields.io/badge/Powered%20by-Easy%20Control-blue)

</div>
