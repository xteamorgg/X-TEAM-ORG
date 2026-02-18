# Guia de Hospedagem - X TEAM Platform

## Visão Geral

O projeto X TEAM consiste em duas partes que precisam ser hospedadas:

1. **Frontend** (Site estático) - HTML, CSS, JavaScript
2. **Backend** (Bot Discord + API) - Node.js

## Opções de Hospedagem

### Opção 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend na Vercel (GRÁTIS)

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Deploy automático via Git
- ✅ SSL/HTTPS automático
- ✅ CDN global
- ✅ Muito rápido

**Passos:**

1. **Criar conta na Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Preparar o projeto**
   ```bash
   # Criar arquivo vercel.json na raiz do projeto
   ```

3. **Fazer deploy**
   - Clique em "New Project"
   - Importe o repositório do GitHub
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Clique em "Deploy"

4. **Configurar variáveis de ambiente**
   - No painel da Vercel, vá em Settings > Environment Variables
   - Adicione as variáveis necessárias (se houver)

#### Backend no Railway (GRÁTIS com limites)

**Vantagens:**
- ✅ $5 de crédito grátis por mês
- ✅ Deploy via Git
- ✅ Suporta Node.js
- ✅ Banco de dados incluído

**Passos:**

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório

3. **Configurar variáveis de ambiente**
   - Clique em "Variables"
   - Adicione todas as variáveis do `.env`:
     ```
     DISCORD_TOKEN=seu_token
     DISCORD_CLIENT_ID=seu_client_id
     DISCORD_CLIENT_SECRET=seu_client_secret
     MAIN_GUILD_ID=1473718425749688442
     REDIRECT_URI=https://seu-dominio.railway.app/api/auth/callback
     FRONTEND_URL=https://seu-site.vercel.app
     ```

4. **Configurar start command**
   - Em Settings > Deploy
   - Start Command: `npm start`

5. **Obter URL do backend**
   - Railway vai gerar uma URL tipo: `https://seu-projeto.railway.app`
   - Copie essa URL

6. **Atualizar frontend**
   - No código do frontend, atualize `API_URL` para a URL do Railway
   - Em `main.js`, `pages.js`, `admin.js`, `xdox.js`:
     ```javascript
     const API_URL = 'https://seu-projeto.railway.app';
     ```

---

### Opção 2: Netlify (Frontend) + Render (Backend)

#### Frontend na Netlify (GRÁTIS)

Similar à Vercel, totalmente gratuito.

**Passos:**

1. Acesse: https://netlify.com
2. Conecte com GitHub
3. Selecione o repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy

#### Backend no Render (GRÁTIS com limites)

**Vantagens:**
- ✅ Plano gratuito disponível
- ✅ Deploy via Git
- ✅ SSL automático

**Desvantagens:**
- ⚠️ Serviço gratuito "hiberna" após 15 min de inatividade
- ⚠️ Pode demorar 30s para "acordar"

**Passos:**

1. Acesse: https://render.com
2. Crie conta com GitHub
3. New > Web Service
4. Conecte o repositório
5. Configure:
   - Name: xteam-bot
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Adicione variáveis de ambiente
7. Deploy

---

### Opção 3: VPS (Servidor Próprio)

Para controle total, use um VPS como:
- DigitalOcean ($4-6/mês)
- Vultr ($2.50-6/mês)
- Linode ($5/mês)
- Contabo (€4/mês)

**Vantagens:**
- ✅ Controle total
- ✅ Sem limites
- ✅ Sempre online
- ✅ Pode hospedar tudo junto

**Desvantagens:**
- ❌ Requer conhecimento técnico
- ❌ Custo mensal
- ❌ Você gerencia tudo

**Passos básicos:**

1. **Criar VPS**
   - Escolha Ubuntu 22.04 LTS
   - Mínimo: 1GB RAM, 1 CPU

2. **Conectar via SSH**
   ```bash
   ssh root@seu-ip
   ```

3. **Instalar Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Instalar PM2 (gerenciador de processos)**
   ```bash
   npm install -g pm2
   ```

5. **Clonar projeto**
   ```bash
   git clone seu-repositorio
   cd seu-projeto
   npm install
   ```

6. **Configurar .env**
   ```bash
   nano .env
   # Cole suas variáveis
   ```

7. **Iniciar bot com PM2**
   ```bash
   pm2 start bot/index.js --name xteam-bot
   pm2 save
   pm2 startup
   ```

8. **Instalar Nginx (para servir frontend)**
   ```bash
   sudo apt install nginx
   ```

9. **Build do frontend**
   ```bash
   npm run build
   ```

10. **Configurar Nginx**
    ```bash
    sudo nano /etc/nginx/sites-available/xteam
    ```
    
    Adicione:
    ```nginx
    server {
        listen 80;
        server_name seu-dominio.com;
        
        root /caminho/para/dist;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /api {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Ativar site**
    ```bash
    sudo ln -s /etc/nginx/sites-available/xteam /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

12. **Instalar SSL (Certbot)**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d seu-dominio.com
    ```

---

## Configurações Importantes

### Atualizar URLs no Código

Após hospedar, você precisa atualizar as URLs no código:

#### 1. Frontend (`main.js`, `pages.js`, `admin.js`, `xdox.js`)
```javascript
// Antes (desenvolvimento)
const API_URL = 'http://localhost:3000';

// Depois (produção)
const API_URL = 'https://seu-backend.railway.app';
```

#### 2. Backend (`bot/index.js`)
```javascript
// Variáveis de ambiente
REDIRECT_URI=https://seu-backend.railway.app/api/auth/callback
FRONTEND_URL=https://seu-site.vercel.app
```

#### 3. Discord Developer Portal
- Acesse: https://discord.com/developers/applications
- Selecione seu bot
- OAuth2 > Redirects
- Adicione: `https://seu-backend.railway.app/api/auth/callback`

### Variáveis de Ambiente Necessárias

```env
# Bot Discord
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id
DISCORD_CLIENT_SECRET=seu_client_secret

# Servidor Principal
MAIN_GUILD_ID=1473718425749688442

# URLs (IMPORTANTE: Atualizar para produção)
REDIRECT_URI=https://seu-backend.railway.app/api/auth/callback
FRONTEND_URL=https://seu-site.vercel.app
```

---

## Checklist de Deploy

### Antes de Hospedar

- [ ] Testar tudo localmente
- [ ] Verificar se todos os comandos do bot funcionam
- [ ] Verificar se o site carrega corretamente
- [ ] Verificar se login Discord funciona
- [ ] Verificar se páginas admin funcionam

### Durante o Deploy

- [ ] Criar conta nas plataformas escolhidas
- [ ] Fazer deploy do backend primeiro
- [ ] Anotar URL do backend
- [ ] Atualizar URLs no código frontend
- [ ] Fazer deploy do frontend
- [ ] Anotar URL do frontend
- [ ] Atualizar variáveis de ambiente no backend

### Após o Deploy

- [ ] Atualizar redirect URI no Discord Developer Portal
- [ ] Testar login Discord
- [ ] Testar comandos do bot
- [ ] Testar páginas admin
- [ ] Testar contador de visitantes
- [ ] Verificar se dados persistem

---

## Recomendação

Para começar, recomendo:

**Frontend:** Vercel (grátis, rápido, fácil)
**Backend:** Railway (grátis até $5/mês, fácil de usar)

Quando o projeto crescer, considere migrar para VPS.

---

## Custos Estimados

### Opção Gratuita
- Vercel: $0
- Railway: $0 (até $5 de uso)
- **Total: $0/mês** (com limites)

### Opção VPS
- VPS básico: $4-6/mês
- Domínio: $10-15/ano
- **Total: ~$5/mês**

---

## Domínio Personalizado

Para usar domínio próprio (ex: xteam.com):

1. **Comprar domínio**
   - Namecheap, GoDaddy, Registro.br

2. **Configurar DNS**
   - Para Vercel/Netlify: Adicionar CNAME
   - Para VPS: Adicionar A record apontando para IP

3. **Configurar SSL**
   - Vercel/Netlify: Automático
   - VPS: Usar Certbot

---

## Suporte e Troubleshooting

### Bot não inicia
- Verificar variáveis de ambiente
- Verificar logs da plataforma
- Verificar se token do Discord é válido

### Site não carrega
- Verificar build do Vite
- Verificar se dist/ foi gerado
- Verificar configurações de deploy

### Login Discord não funciona
- Verificar REDIRECT_URI
- Verificar Discord Developer Portal
- Verificar CORS no backend

### Contador de visitantes não funciona
- Verificar se API está acessível
- Verificar se bot/data.json tem permissão de escrita
- Verificar logs do backend

---

## Próximos Passos

Após hospedar:

1. Compartilhar link do site
2. Convidar bot para servidor
3. Configurar cargos com `/xteam-config-role`
4. Sincronizar membros com `/xteam-sync`
5. Testar todas as funcionalidades
6. Monitorar logs e erros
