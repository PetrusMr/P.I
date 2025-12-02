# 🏢 P.I - Projeto Easy Control

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Sistema simplificado para controle e agendamento de salas**

[📋 Funcionalidades](#-funcionalidades) • 
[🚀 Instalação](#-instalação) • 
[💻 Uso](#-uso) • 
[🛠️ Tecnologias](#️-tecnologias) • 
[📖 Documentação](#-documentação) • 
[🤝 Contribuição](#-contribuição)

</div>

---

## 📋 Funcionalidades

### ✅ Principais Recursos
- 🔐 **Controle de Acesso** - Sistema de autenticação para salas
- 📅 **Agendamento** - Interface para reserva de salas
- 👥 **Gerenciamento de Usuários** - Controle de permissões
- 📊 **Relatórios** - Visualização de uso das salas
- 🔔 **Notificações** - Alertas de reservas e disponibilidade

### 🎯 Foco do Sistema
> As funcionalidades de contagem de itens foram removidas para focar exclusivamente no **controle de acesso às salas**, proporcionando uma experiência mais simplificada e eficiente.

---

## 🚀 Instalação

### Pré-requisitos
```bash
# Certifique-se de ter instalado:
- Node.js (versão 14+)
- npm ou yarn
- Banco de dados (MySQL/PostgreSQL)
```

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/projeto-easy-control.git
   cd projeto-easy-control
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure o ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute as migrações**
   ```bash
   npm run migrate
   ```

5. **Inicie o servidor**
   ```bash
   npm start
   # ou para desenvolvimento
   npm run dev
   ```

---

## 💻 Uso

### Interface Principal

#### 🏠 Dashboard
- Visualização geral das salas disponíveis
- Status em tempo real das reservas
- Acesso rápido às funcionalidades principais

#### 📅 Sistema de Agendamento
```javascript
// Exemplo de uso da API
const reserva = {
  sala: "Sala de Reunião 01",
  data: "2024-01-15",
  horario: "14:00-16:00",
  usuario: "admin@empresa.com"
};

await criarReserva(reserva);
```

#### 👤 Gerenciamento de Usuários
- Cadastro e edição de usuários
- Definição de níveis de acesso
- Histórico de atividades

---

## 🛠️ Tecnologias

<div align="center">

| Frontend | Backend | Banco de Dados | Ferramentas |
|----------|---------|----------------|-------------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat&logo=visual-studio-code&logoColor=white) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white) | | ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white) |

</div>

---

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

### 🔗 Links Úteis
- [📋 Documentação da API](./docs/api.md)
- [🎨 Guia de Estilo](./docs/style-guide.md)
- [🧪 Testes](./docs/testing.md)
- [🚀 Deploy](./docs/deployment.md)

### 📊 Diagramas
- [🏗️ Arquitetura do Sistema](./docs/architecture.md)
- [🗄️ Modelo de Dados](./docs/database.md)
- [🔄 Fluxo de Processos](./docs/workflows.md)

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

### 🔄 Processo de Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Diretrizes
- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use mensagens de commit descritivas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

<div align="center">

| Desenvolvedor | Função | Contato |
|---------------|--------|---------|
| **Seu Nome** | Full Stack Developer | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-perfil) |

</div>

---

## 📞 Suporte

Encontrou um bug ou tem uma sugestão? 

- 🐛 [Reportar Bug](https://github.com/seu-usuario/projeto-easy-control/issues/new?template=bug_report.md)
- 💡 [Sugerir Feature](https://github.com/seu-usuario/projeto-easy-control/issues/new?template=feature_request.md)
- 📧 Email: suporte@empresa.com

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

![Footer](https://img.shields.io/badge/Feito%20com-❤️-red)
![Footer](https://img.shields.io/badge/Powered%20by-Easy%20Control-blue)

</div>