# X TEAM Bot - Deploy na Discloud

## Estrutura do Projeto
```
X-TEAM-ORG/
├── bot/
│   ├── index.js
│   └── register-commands.js
├── package.json
├── discloud.config.json
├── .env.discloud
├── START_DISCLOUD.sh
└── README_DISCLOUD.md
```

## Configuração

### 1. Variáveis de Ambiente
Copie `.env.discloud` para `.env` e atualize:
- `REDIRECT_URI`: https://SEU-ID.discloud.app/api/auth/callback
- `FRONTEND_URL`: https://xteamorgg.github.io/X-TEAM-ORG

### 2. Discord Developer Portal
Atualize o Redirect URI para:
```
https://SEU-ID.discloud.app/api/auth/callback
```

## Deploy na Discloud

### Passo 1: Compactar
Compacte todos os arquivos em `X-TEAM-BOT.zip`

### Passo 2: Upload
1. Faça login na Discloud
2. Crie novo projeto
3. Upload do arquivo ZIP
4. Configure as variáveis de ambiente

### Passo 3: Configurar
No painel da Discloud, adicione:
```
DISCORD_TOKEN=seu_token
DISCORD_CLIENT_ID=1473728010933764288
DISCORD_CLIENT_SECRET=AjFarYqfYlcfbOBacNOcslDrL9U46JUQ
REDIRECT_URI=https://SEU-ID.discloud.app/api/auth/callback
FRONTEND_URL=https://xteamorgg.github.io/X-TEAM-ORG
MAIN_GUILD_ID=1473718425749688442
REPORT_CHANNEL_ID=ID_DO_CANAL_DE_DENUNCIAS
```

## URLs Finais
- **Bot API**: https://SEU-ID.discloud.app
- **Site**: https://xteamorgg.github.io/X-TEAM-ORG
- **Login**: https://discord.com/api/oauth2/authorize?client_id=1473728010933764288&redirect_uri=https://SEU-ID.discloud.app/api/auth/callback&response_type=code&scope=identify%20guilds%20guilds.members.read

## Comandos Úteis
- `/xteam-sync` - Sincronizar membros
- `/xteam-config-invite` - Configurar link do Discord
- `/xteam-report` - Fazer denúncia

## Suporte
- Documentação: DISCLOUD_DEPLOY.md
- Configuração: .env.discloud
- Inicialização: START_DISCLOUD.sh
