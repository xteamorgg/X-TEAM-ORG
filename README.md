# X TEAM - Central de Operações

<div align="center">

![X TEAM Logo](https://img.shields.io/badge/X%20TEAM-CYBER%20OPS-9d00ff?style=for-the-badge)

**Plataforma de monitoramento e análise de servidores Discord**

[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-success?style=flat-square)](https://github.com/seu-usuario/X-TEAM-ORG)
[![Bot](https://img.shields.io/badge/Bot-Discord-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Demo](https://seu-usuario.github.io/X-TEAM-ORG/) • [Documentação](#documentação) • [Instalação](#instalação)

</div>

---

## 📋 Sobre

X TEAM é uma plataforma completa para monitoramento de servidores Discord, com:

- 🔍 **Rastreamento de Servidores** - Suspeitos, Investigados e Desativados
- 👥 **Gestão de Equipe** - Hierarquia com 4 níveis de cargos
- 🤖 **Bot Discord** - Comandos slash para gerenciamento
- 🔐 **Sistema de Login** - OAuth2 do Discord
- 📊 **Painel Admin** - Terminal interativo e ferramentas de IA
- 📈 **Contador de Visitantes** - Rastreamento de acessos

## ✨ Funcionalidades

### Site (Frontend)
- ✅ Design cyberpunk com tema dark
- ✅ Páginas para cada categoria de servidor
- ✅ Sistema de autenticação Discord OAuth2
- ✅ Páginas administrativas (X IA, X DOX)
- ✅ Terminal interativo com comandos
- ✅ Contador de visitantes em tempo real
- ✅ Responsivo e otimizado

### Bot Discord (Backend)
- ✅ Comandos slash para adicionar servidores
- ✅ Sincronização automática de membros
- ✅ Sistema de verificação de cargos
- ✅ API REST para o frontend
- ✅ Persistência de dados em JSON
- ✅ Suporte a fotos customizadas

## 🚀 Tecnologias

### Frontend
- **Vite** - Build tool
- **Vanilla JavaScript** - Sem frameworks
- **CSS3** - Animações e gradientes
- **HTML5** - Estrutura semântica

### Backend
- **Node.js** - Runtime
- **Discord.js** - Bot Discord
- **Express** - API REST
- **Discord OAuth2** - Autenticação

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Discord Developer
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/X-TEAM-ORG.git
cd X-TEAM-ORG
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id
DISCORD_CLIENT_SECRET=seu_client_secret
MAIN_GUILD_ID=seu_servidor_id
REDIRECT_URI=http://localhost:3000/api/auth/callback
FRONTEND_URL=http://localhost:5173
```

### 4. Configure os cargos
Edite `bot/config.json`:
```json
{
  "roleIds": {
    "leaders": "ID_DO_CARGO_LEADERS",
    "investigators": "ID_DO_CARGO_INVESTIGATORS",
    "agents": "ID_DO_CARGO_AGENTS",
    "newbies": "ID_DO_CARGO_NEWBIES"
  },
  "discordInvite": "https://discord.gg/seu-convite"
}
```

### 5. Registre os comandos do bot
```bash
npm run register-commands
```

### 6. Inicie o bot
```bash
npm start
```

### 7. Inicie o frontend (em outro terminal)
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🎮 Comandos do Bot

### Configuração
- `/xteam-config-role` - Configura um cargo da hierarquia
- `/xteam-config-invite` - Define o link de convite do Discord
- `/xteam-sync` - Sincroniza membros manualmente

### Gerenciamento de Servidores
- `/adicionarservidorsuspeito` - Adiciona servidor suspeito
- `/adicionarservidorinvestigado` - Adiciona servidor investigado
- `/adicionarservidordesativado` - Adiciona servidor desativado

### Sistema de Cargos
- `/setpainelcargo` - Cria painel de verificação para X NEWBIES

## 🔐 Cargos com Acesso Admin

Os seguintes cargos têm acesso às páginas administrativas:

- **X LEADERS** - Fundadores
- **X INVESTIGADORES** - Investigadores
- Cargos especiais configurados

## 📊 Terminal X DOX

Terminal interativo com comandos:

- `help` - Lista de comandos
- `status` - Status do sistema
- `servers` - Lista servidores
- `members` - Lista membros
- `clear` - Limpa terminal
- `history` - Histórico de comandos

## 🌐 Deploy

### Render.com (Recomendado)

Deploy completo e automático na Render.com:

1. **Conecte seu repositório** GitHub à Render
2. **Configure as variáveis de ambiente** no painel da Render:
   - `DISCORD_TOKEN` - Token do bot Discord
   - `CLIENT_ID` - ID do bot Discord  
   - `GUILD_ID` - ID do servidor Discord
   - `NODE_ENV` - `production`

3. **Deploy automático** a cada push na branch `main`

📖 **Guia completo**: [DEPLOY_RENDER.md](DEPLOY_RENDER.md)

### Frontend (GitHub Pages)

O frontend pode ser publicado separadamente no GitHub Pages:

1. Faça push para o branch `main`
2. GitHub Actions faz build automaticamente
3. Site publicado em `gh-pages` branch

📖 **Guia**: [DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md)

## 📁 Estrutura do Projeto

```
X-TEAM-ORG/
├── bot/                    # Backend (Bot Discord)
│   ├── index.js           # Servidor principal
│   ├── register-commands.js
│   ├── config.json        # Configurações
│   └── data.json          # Dados persistidos
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions
├── *.html                 # Páginas do site
├── *.js                   # Scripts do frontend
├── *.css                  # Estilos
├── vite.config.js         # Configuração Vite
└── package.json           # Dependências
```

## 📚 Documentação

- [Comandos Discord](COMANDOS_DISCORD.md)
- [Comandos Terminal X DOX](COMANDOS_XDOX.md)
- [Configuração de Cargos](CONFIGURACAO_CARGOS.md)
- [Deploy na Render](DEPLOY_RENDER.md)
- [Deploy GitHub Pages](DEPLOY_GITHUB_PAGES.md)
- [Páginas Admin](ADMIN_PAGES.md)
- [Cargos Admin](CARGOS_ADMIN.md)

## 🎨 Cores do Tema

```css
--bg-primary: #0a0a0f
--bg-secondary: #1a1a24
--neon-purple: #9d00ff
--neon-green: #00ff88
--neon-blue: #3b82f6
```

## 🔧 Scripts Disponíveis

```bash
npm start              # Inicia o bot
npm run dev            # Inicia frontend (dev)
npm run build          # Build do frontend
npm run preview        # Preview do build
npm run register-commands  # Registra comandos do bot
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **X LEADERS** - Fundadores e líderes
- **X INVESTIGADORES** - Investigadores
- **X AGENTS** - Agentes operacionais
- **X NEWBIES** - Novos membros

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/X-TEAM-ORG/issues)

## 💬 Suporte

- Discord: [Servidor X TEAM](https://discord.gg/seu-convite)
- Issues: [GitHub Issues](https://github.com/seu-usuario/X-TEAM-ORG/issues)

## 🌟 Agradecimentos

Obrigado a todos que contribuíram para este projeto!

---

<div align="center">

**[⬆ Voltar ao topo](#x-team---central-de-operações)**

Feito com 💜 pela X TEAM

</div>
