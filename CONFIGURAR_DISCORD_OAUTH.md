# 🔧 Como Configurar Discord OAuth (Resolver Erro de redirect_uri)

## ❌ Erro que você está vendo:
```
redirect_uri de OAuth2 inválido
```

## ✅ Solução Passo a Passo:

### 1️⃣ Acesse o Discord Developer Portal

1. Vá em: https://discord.com/developers/applications
2. Faça login com sua conta do Discord
3. Clique no seu aplicativo (bot X TEAM)

### 2️⃣ Configure os Redirect URIs

1. No menu lateral esquerdo, clique em **OAuth2**
2. Clique em **General** (se não estiver já selecionado)
3. Role até a seção **Redirects**
4. Clique em **Add Redirect**

### 3️⃣ Adicione as URLs

Você precisa adicionar **DUAS URLs**:

#### Para Desenvolvimento (localhost):
```
http://localhost:3000/api/auth/callback
```

#### Para Produção (quando hospedar no Railway):
```
https://x-team-org-production.up.railway.app/api/auth/callback
```

**IMPORTANTE:** Substitua `x-team-org-production.up.railway.app` pela URL real do Railway quando você hospedar.

### 4️⃣ Salvar

1. Depois de adicionar as URLs, clique em **Save Changes** no final da página
2. Aguarde alguns segundos para as mudanças serem aplicadas

### 5️⃣ Testar

1. Volte ao seu site
2. Tente fazer login novamente
3. Agora deve funcionar!

## 📋 Checklist

- [ ] Acessei o Discord Developer Portal
- [ ] Selecionei meu aplicativo
- [ ] Fui em OAuth2 → General
- [ ] Adicionei `http://localhost:3000/api/auth/callback` nos Redirects
- [ ] Cliquei em Save Changes
- [ ] Testei o login novamente

## 🎯 URLs Corretas por Ambiente

### Desenvolvimento (localhost):
```
REDIRECT_URI: http://localhost:3000/api/auth/callback
FRONTEND_URL: http://localhost:5173
```

### Produção (GitHub Pages + Railway):
```
REDIRECT_URI: https://[URL-DO-RAILWAY]/api/auth/callback
FRONTEND_URL: https://xteamorgg.github.io/X-TEAM-ORG
```

## 🆘 Ainda não funciona?

### Verifique:

1. **Bot está rodando?**
   ```bash
   npm run bot
   ```
   Deve mostrar: "✅ Bot conectado" e "✅ API rodando na porta 3000"

2. **URL está exatamente igual?**
   - Não pode ter espaços
   - Não pode ter barra `/` no final
   - Deve ter `/api/auth/callback` no final

3. **Salvou as mudanças?**
   - Clique em "Save Changes" no Discord Developer Portal
   - Aguarde alguns segundos

4. **Limpe o cache do navegador**
   - Ctrl + Shift + Delete
   - Limpe cookies e cache
   - Tente novamente

## 📸 Como Deve Ficar no Discord

Na seção **Redirects** do Discord Developer Portal, você deve ver:

```
✓ http://localhost:3000/api/auth/callback
✓ https://x-team-org-production.up.railway.app/api/auth/callback
```

## 🔄 Próximos Passos

Depois de configurar o OAuth:

1. Teste o login no localhost
2. Hospede o bot no Railway
3. Adicione a URL do Railway nos Redirects
4. Atualize o `config.js` com a URL do Railway
5. Faça deploy no GitHub Pages
6. Teste o login em produção

## 💡 Dica

Você pode adicionar múltiplas URLs de redirect. Isso é útil para ter uma URL para desenvolvimento (localhost) e outra para produção (Railway).
