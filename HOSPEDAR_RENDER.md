# 🚀 Como Hospedar no Render.com

Guia completo para hospedar o bot X TEAM no Render.com (100% gratuito).

## 📋 Pré-requisitos

- Conta no GitHub (com o repositório X-TEAM-ORG)
- Conta no Discord Developer Portal
- Tokens e IDs configurados no `.env`

---

## 🎯 Passo 1: Criar conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"**
3. Faça login com sua conta do GitHub
4. Autorize o Render a acessar seus repositórios

---

## 🔧 Passo 2: Criar Web Service

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório **X-TEAM-ORG**
4. Configure:

### Configurações Básicas:
```
Name: x-team-bot
Region: Oregon (US West) ou Frankfurt (Europe)
Branch: main
Root Directory: (deixe vazio)
Runtime: Node
Build Command: npm install
Start Command: node bot/index.js
```

### Plano:
- Selecione **"Free"** (gratuito)

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

```env
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
MAIN_GUILD_ID=1473718425749688442
REPORT_CHANNEL_ID=id_do_canal_de_denuncias

# URLs de produção (Render vai fornecer a URL)
REDIRECT_URI=https://seu-app.onrender.com/api/auth/callback
FRONTEND_URL=https://xteamorgg.github.io/X-TEAM-ORG
```

⚠️ **IMPORTANTE:** Substitua `seu-app` pela URL que o Render vai gerar para você.

---

## 🌐 Passo 4: Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (pode levar 2-5 minutos)
3. Quando terminar, você verá: **"Your service is live 🎉"**
4. Copie a URL fornecida (ex: `https://x-team-bot.onrender.com`)

---

## 🔄 Passo 5: Atualizar URLs

### 5.1 Atualizar variável REDIRECT_URI no Render:

1. Vá em **"Environment"** no painel do Render
2. Edite `REDIRECT_URI` para: `https://SUA-URL.onrender.com/api/auth/callback`
3. Clique em **"Save Changes"**

### 5.2 Atualizar Discord Developer Portal:

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione seu bot
3. Vá em **"OAuth2"** → **"Redirects"**
4. Adicione: `https://SUA-URL.onrender.com/api/auth/callback`
5. Salve

### 5.3 Atualizar config.js no repositório:

Edite o arquivo `config.js`:

```javascript
// Configuração de URLs da API
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// URL do servidor de API em produção (Render)
const PRODUCTION_API_URL = 'https://SUA-URL.onrender.com/api';

export const API_URL = isProduction ? PRODUCTION_API_URL : 'http://localhost:3000/api';

export const config = {
  apiUrl: API_URL,
  isProduction: isProduction,
  useGitHub: false
};
```

Faça commit e push para o GitHub.

---

## ✅ Passo 6: Testar

1. Acesse seu site: `https://xteamorgg.github.io/X-TEAM-ORG`
2. Teste o login via Discord
3. Adicione um servidor suspeito via comando Discord
4. Verifique se aparece no site

---

## 📊 Monitoramento

### Ver logs do bot:
1. No painel do Render, clique em **"Logs"**
2. Veja os logs em tempo real

### Verificar status:
- **"Live"** = Bot online ✅
- **"Building"** = Fazendo deploy 🔄
- **"Failed"** = Erro ❌

---

## ⚠️ Limitações do Plano Gratuito

- **750 horas/mês** (suficiente para 1 bot)
- **Dorme após 15 minutos sem uso** (acorda em ~30 segundos)
- **512 MB de RAM**
- **0.1 CPU**

### Como evitar que durma:
Use um serviço de ping como [UptimeRobot](https://uptimerobot.com):
1. Crie conta gratuita
2. Adicione monitor HTTP
3. URL: `https://SUA-URL.onrender.com/api/data`
4. Intervalo: 5 minutos

---

## 🔄 Atualizações Automáticas

O Render faz deploy automático quando você faz push no GitHub:

1. Faça alterações no código
2. Commit e push para o GitHub
3. Render detecta e faz deploy automaticamente
4. Aguarde 2-3 minutos

---

## 🐛 Solução de Problemas

### Bot não inicia:
- Verifique os logs no painel do Render
- Confirme que todas as variáveis de ambiente estão corretas
- Verifique se o token do Discord está válido

### Site não sincroniza:
- Confirme que a URL no `config.js` está correta
- Limpe o cache do navegador (Ctrl + Shift + R)
- Verifique se o bot está online no Render

### Erro de OAuth:
- Confirme que o `REDIRECT_URI` está correto no Render
- Verifique se a URL está cadastrada no Discord Developer Portal
- Certifique-se que `FRONTEND_URL` aponta para o GitHub Pages

---

## 💡 Dicas

1. **Mantenha o bot ativo**: Use UptimeRobot para pingar a cada 5 minutos
2. **Monitore os logs**: Verifique regularmente se há erros
3. **Backup dos dados**: Faça backup do `bot/data.json` periodicamente
4. **Variáveis sensíveis**: Nunca commite o `.env` no GitHub

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Render
2. Consulte a [documentação do Render](https://render.com/docs)
3. Verifique se todas as URLs estão corretas

---

## 🎉 Pronto!

Seu bot X TEAM está hospedado no Render e sincronizando automaticamente com o site no GitHub Pages!
