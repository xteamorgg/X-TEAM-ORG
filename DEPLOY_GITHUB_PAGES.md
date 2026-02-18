# Deploy no GitHub Pages - X TEAM

## Problema Atual

O site está mostrando sem estilos porque o GitHub Pages está servindo os arquivos HTML diretamente, sem fazer o build do Vite.

## Solução: Deploy Automático com GitHub Actions

### Passo 1: Fazer Build Local (Teste)

Primeiro, teste o build localmente:

```bash
npm run build
```

Isso vai criar uma pasta `dist/` com os arquivos compilados.

### Passo 2: Configurar GitHub Pages

1. Vá no seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Clique em **Save**

### Passo 3: Fazer Push dos Arquivos

Agora faça commit e push dos novos arquivos:

```bash
git add .
git commit -m "Configurar deploy automático GitHub Pages"
git push origin main
```

### Passo 4: Aguardar Deploy

1. Vá em **Actions** no seu repositório
2. Você verá o workflow "Deploy to GitHub Pages" rodando
3. Aguarde finalizar (leva 1-2 minutos)
4. Quando terminar, o site estará atualizado

### Passo 5: Acessar o Site

Seu site estará disponível em:
```
https://seu-usuario.github.io/X-TEAM-ORG/
```

---

## Alternativa: Deploy Manual

Se preferir fazer deploy manual:

### 1. Build do projeto
```bash
npm run build
```

### 2. Instalar gh-pages
```bash
npm install -D gh-pages
```

### 3. Adicionar script no package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 4. Fazer deploy
```bash
npm run deploy
```

---

## Importante: Backend (Bot)

⚠️ **O GitHub Pages só serve arquivos estáticos (HTML, CSS, JS)**

O bot Discord (backend) NÃO pode rodar no GitHub Pages. Você precisa hospedar o bot em outro lugar:

### Opções para o Bot:

1. **Railway** (Recomendado - Grátis até $5/mês)
   - https://railway.app
   - Deploy automático via GitHub
   - Suporta Node.js

2. **Render** (Grátis com limites)
   - https://render.com
   - Hiberna após 15 min de inatividade

3. **Heroku** (Pago - $5/mês)
   - https://heroku.com
   - Mais estável

4. **VPS** (Controle total - $4-6/mês)
   - DigitalOcean, Vultr, Linode

### Configurar URLs após Deploy

Depois de hospedar o bot, você precisa atualizar as URLs no código:

#### No Frontend (todos os arquivos .js):
```javascript
// Trocar de:
const API_URL = 'http://localhost:3000';

// Para:
const API_URL = 'https://seu-bot.railway.app';
```

Arquivos para atualizar:
- `main.js`
- `pages.js`
- `admin.js`
- `xdox.js`

#### No Backend (bot/index.js):
```javascript
REDIRECT_URI=https://seu-bot.railway.app/api/auth/callback
FRONTEND_URL=https://seu-usuario.github.io/X-TEAM-ORG
```

---

## Checklist de Deploy

### Frontend (GitHub Pages)
- [ ] Criar arquivo `.github/workflows/deploy.yml`
- [ ] Atualizar `vite.config.js` com todas as páginas HTML
- [ ] Fazer commit e push
- [ ] Configurar GitHub Pages para usar branch `gh-pages`
- [ ] Aguardar deploy automático
- [ ] Testar site

### Backend (Railway/Render)
- [ ] Criar conta na plataforma escolhida
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy
- [ ] Copiar URL do backend
- [ ] Atualizar URLs no frontend
- [ ] Fazer novo commit e push do frontend
- [ ] Atualizar redirect URI no Discord Developer Portal

---

## Troubleshooting

### Site ainda sem estilos após deploy
1. Limpar cache do navegador (Ctrl+Shift+R)
2. Verificar se workflow do GitHub Actions terminou
3. Verificar se branch `gh-pages` foi criado
4. Verificar configuração do GitHub Pages

### Erro 404 nas páginas
- Verificar se `base: '/X-TEAM-ORG/'` está correto no vite.config.js
- Verificar se todas as páginas HTML estão no `rollupOptions.input`

### Login Discord não funciona
- Backend precisa estar rodando
- Atualizar `REDIRECT_URI` no backend
- Atualizar redirect URI no Discord Developer Portal
- Atualizar `API_URL` no frontend

### Contador de visitantes não funciona
- Backend precisa estar rodando
- Verificar se `API_URL` está correto no frontend
- Verificar CORS no backend

---

## Estrutura Final

```
Frontend (GitHub Pages)
└── https://seu-usuario.github.io/X-TEAM-ORG/

Backend (Railway/Render)
└── https://seu-bot.railway.app/
    ├── /api/data
    ├── /api/visit
    └── /api/auth/discord
```

---

## Próximos Passos

1. ✅ Fazer push do código atualizado
2. ✅ Aguardar deploy automático do GitHub Pages
3. ⏳ Hospedar bot no Railway/Render
4. ⏳ Atualizar URLs no código
5. ⏳ Testar tudo funcionando

---

## Comandos Úteis

```bash
# Build local para testar
npm run build

# Servir build localmente
npx serve dist

# Ver logs do GitHub Actions
# Vá em: https://github.com/seu-usuario/X-TEAM-ORG/actions

# Forçar novo deploy
git commit --allow-empty -m "Trigger deploy"
git push
```

---

## Suporte

Se tiver problemas:
1. Verificar logs do GitHub Actions
2. Verificar console do navegador (F12)
3. Verificar se todas as URLs estão corretas
4. Limpar cache do navegador
