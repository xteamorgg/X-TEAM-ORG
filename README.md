# X TEAM - Plataforma Oficial

Painel de Operações da X TEAM com integração Discord.

## Instalação

```bash
npm install
```

## Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis no `.env`:
   - `DISCORD_TOKEN` - Token do bot
   - `DISCORD_CLIENT_ID` - Client ID da aplicação OAuth2
   - `DISCORD_CLIENT_SECRET` - Client Secret da aplicação OAuth2
3. No Discord Developer Portal:
   - Ative OAuth2
   - Adicione redirect: `http://localhost:3000/api/auth/callback`
   - Scope: `identify`

## Executar

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Bot Discord:
```bash
npm run bot
```

## Comandos do Bot

- `/xteam-config-role` - Configura IDs dos cargos da hierarquia
- `/xteam-config-invite` - Define link do servidor Discord
- `/adicionarservesuspeito` - Adiciona servidor suspeito (busca foto automaticamente)
- `/adicionarserveinvestigado` - Adiciona servidor investigado (busca foto automaticamente)
- `/adicionarservedesativado` - Adiciona servidor desativado (busca foto automaticamente)
- `/xteam-sync` - Sincroniza membros manualmente

## Como Adicionar Servidores

Use os comandos slash no Discord:

```
/adicionarservesuspeito id:123456789 status:Sob investigação por atividades suspeitas
/adicionarserveinvestigado id:123456789 status:Investigação concluída - Confirmado
/adicionarservedesativado id:123456789 status:Desativado após denúncias
```

O bot automaticamente:
- Busca o nome do servidor
- Pega a foto/ícone do servidor
- Adiciona ao site em tempo real

## Estrutura

- `index.html` - Interface principal
- `style.css` - Estilo dark mode cyberpunk
- `main.js` - Lógica frontend
- `bot/index.js` - Bot Discord + API
