# 🌐 Configurar ngrok para Expor o Bot

## 📋 O que é ngrok?

O ngrok cria um túnel seguro que expõe seu localhost para a internet. Isso permite que o site no GitHub Pages se conecte ao bot rodando no seu computador.

## 🚀 Passo a Passo

### 1️⃣ Instalar ngrok

Abra um novo terminal e rode:

```bash
npm install -g ngrok
```

### 2️⃣ Criar conta no ngrok (opcional mas recomendado)

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita
3. Copie seu authtoken
4. No terminal, rode:
   ```bash
   ngrok config add-authtoken SEU_TOKEN_AQUI
   ```

### 3️⃣ Iniciar o Bot

Em um terminal, rode:

```bash
npm run bot
```

Deixe esse terminal aberto!

### 4️⃣ Expor a Porta 3000

Em OUTRO terminal (novo), rode:

```bash
ngrok http 3000
```

### 5️⃣ Copiar a URL do ngrok

O ngrok vai mostrar algo assim:

```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

Copie a URL `https://abc123.ngrok.io`

### 6️⃣ Atualizar os Arquivos

Você precisa atualizar 3 arquivos com a URL do ngrok:

#### A) `.env`
```env
REDIRECT_URI=https://abc123.ngrok.io/api/auth/callback
FRONTEND_URL=https://xteamorgg.github.io/X-TEAM-ORG
```

#### B) `report.js` (linha 3)
```javascript
const API_URL = 'https://abc123.ngrok.io/api';
```

#### C) `admin.js` (linha 2)
```javascript
const API_URL = 'https://abc123.ngrok.io';
```

#### D) `main.js` (linha 3)
```javascript
const API_URL = 'https://abc123.ngrok.io/api';
```

#### E) `pages.js` (linha 3)
```javascript
const API_URL = 'https://abc123.ngrok.io/api';
```

### 7️⃣ Atualizar Discord OAuth

1. Acesse: https://discord.com/developers/applications
2. Selecione seu bot
3. Vá em **OAuth2** → **General**
4. Em **Redirects**, adicione:
   ```
   https://abc123.ngrok.io/api/auth/callback
   ```
5. Salve

### 8️⃣ Reiniciar o Bot

No terminal onde o bot está rodando:
1. Ctrl + C (parar)
2. `npm run bot` (iniciar novamente)

### 9️⃣ Fazer Deploy

```bash
git add .
git commit -m "Configurar ngrok"
git push origin main
npm run build
npm run deploy
```

### 🎉 Testar

1. Acesse: https://xteamorgg.github.io/X-TEAM-ORG
2. Faça login
3. Tente enviar uma denúncia
4. Deve funcionar!

## ⚠️ IMPORTANTE

- **Mantenha o ngrok rodando**: Se fechar o terminal do ngrok, a URL para de funcionar
- **URL muda**: Toda vez que reiniciar o ngrok, a URL muda (na versão gratuita)
- **Quando a URL mudar**: Você precisa atualizar todos os arquivos novamente

## 💡 Dica

Para evitar que a URL mude, você pode:
1. Usar ngrok pago (URL fixa)
2. Ou hospedar o bot em um servidor 24/7 (Railway, Heroku, VPS)

## 🔄 Comandos Resumidos

Terminal 1 (Bot):
```bash
npm run bot
```

Terminal 2 (ngrok):
```bash
ngrok http 3000
```

Deixe os dois rodando!
