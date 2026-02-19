# 🔄 Script para Atualizar URL do ngrok

Quando você rodar o ngrok, ele vai te dar uma URL. Siga esses passos:

## 1. Rode o ngrok
```bash
ngrok http 3000
```

## 2. Copie a URL
Exemplo: `https://abc123.ngrok.io`

## 3. Atualize os arquivos

Me mande a URL que o ngrok gerou e eu atualizo todos os arquivos para você!

Ou você pode atualizar manualmente:

### Arquivos para atualizar:

1. `.env` - linha REDIRECT_URI
2. `report.js` - linha 3
3. `admin.js` - linha 2  
4. `main.js` - linha 3
5. `pages.js` - linha 3

### Exemplo:

Se o ngrok gerou: `https://abc123.ngrok.io`

Substitua em todos os arquivos:
- `http://localhost:3000` por `https://abc123.ngrok.io`

## 4. Reinicie o bot
```bash
# Ctrl + C para parar
npm run bot
```

## 5. Faça deploy
```bash
npm run build
npm run deploy
```

Pronto! Agora o site no GitHub Pages vai conseguir se conectar ao bot.
