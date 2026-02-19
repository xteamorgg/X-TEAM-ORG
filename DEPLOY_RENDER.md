# X Team Platform - Deploy na Render.com

## Deploy Automático

O deploy na Render é automático. Basta conectar seu repositório GitHub à Render e o deploy será feito automaticamente a cada push na branch main.

## Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Render:

### Obrigatórias
- `DISCORD_TOKEN` - Token do seu bot Discord
- `CLIENT_ID` - ID do seu bot Discord  
- `GUILD_ID` - ID do servidor Discord
- `NODE_ENV` - Deixe como `production`

### Opcionais
- `MONGODB_URI` - URI do MongoDB (se usar banco de dados)
- `PORT` - Porta do servidor (padrão: 10000)

## Comandos

- **Build**: `npm install`
- **Start**: `npm start`

## URL de Acesso

Após o deploy, sua aplicação estará disponível em:
`https://xteam-platform.onrender.com`

## Health Check

A Render verifica a saúde da aplicação acessando `/` a cada 30 segundos.

## Logs

Monitore os logs no painel da Render para detectar problemas.

## Dicas

1. **Free Tier**: O plano gratuito tem limitações de uso (750 horas/mês)
2. **Cold Start**: A aplicação pode demorar para iniciar após inatividade
3. **Persistência**: Dados locais são perdidos a cada deploy
4. **Domínio Personalizado**: Configure um domínio personalizado nas configurações do serviço
