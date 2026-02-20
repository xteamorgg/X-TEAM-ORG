# 🚀 COMANDOS PARA ATUALIZAR O SITE

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ VERIFICAR STATUS
```bash
git status
```
Mostra quais arquivos foram modificados

---

### 2️⃣ ADICIONAR ARQUIVOS MODIFICADOS

**Opção A - Adicionar TODOS os arquivos:**
```bash
git add .
```

**Opção B - Adicionar arquivos específicos:**
```bash
git add gerenciar-servidores.html
git add gerenciar-servidores.js
git add pages.js
git add sync-data.js
git add members-data.json
```

---

### 3️⃣ FAZER COMMIT
```bash
git commit -m "fix: corrigido sistema de membros e servidores"
```

**Ou com mensagem mais detalhada:**
```bash
git commit -m "fix: membros aparecem imediatamente, sync funcionando"
```

---

### 4️⃣ ENVIAR PARA GITHUB
```bash
git push origin main
```

**Se der erro, usar:**
```bash
git push -f origin main
```

---

## ⚡ COMANDO RÁPIDO (TUDO DE UMA VEZ)

```bash
git add . && git commit -m "fix: sistema de gerenciamento corrigido" && git push origin main
```

---

## 🔄 ATUALIZAR APENAS members-data.json

Quando sincronizar dados do botão "Sincronizar Dados":

```bash
git add members-data.json
git commit -m "update: sincronização de membros e servidores"
git push origin main
```

---

## 📊 VERIFICAR SE ATUALIZOU

### No Terminal:
```bash
git log --oneline -5
```
Mostra os últimos 5 commits

### No GitHub:
1. Abrir: https://github.com/xteamorgg/X-TEAM-ORG
2. Ir em "Actions"
3. Ver se deploy está rodando (bolinha amarela 🟡)
4. Aguardar ficar verde (✅)
5. Site atualizado em 2-3 minutos!

---

## 🛠️ COMANDOS ÚTEIS

### Ver diferenças antes de commitar:
```bash
git diff
```

### Ver histórico de commits:
```bash
git log
```

### Desfazer último commit (mantém alterações):
```bash
git reset --soft HEAD~1
```

### Desfazer alterações em arquivo específico:
```bash
git checkout -- arquivo.js
```

### Ver branch atual:
```bash
git branch
```

### Puxar atualizações do GitHub:
```bash
git pull origin main
```

---

## 🚨 RESOLVER CONFLITOS

Se der erro ao fazer push:

```bash
# 1. Puxar mudanças do GitHub
git pull origin main

# 2. Resolver conflitos manualmente nos arquivos

# 3. Adicionar arquivos resolvidos
git add .

# 4. Fazer commit
git commit -m "fix: conflitos resolvidos"

# 5. Enviar
git push origin main
```

---

## 📝 MENSAGENS DE COMMIT RECOMENDADAS

```bash
# Correção de bug
git commit -m "fix: corrigido problema com membros"

# Nova funcionalidade
git commit -m "feat: adicionado botão de sincronização"

# Atualização de dados
git commit -m "update: membros e servidores atualizados"

# Melhoria
git commit -m "improve: performance da lista de membros"

# Documentação
git commit -m "docs: atualizado guia de uso"

# Estilo/formatação
git commit -m "style: ajustado CSS dos cards"
```

---

## ⏱️ TEMPO DE DEPLOY

Após fazer `git push`:
- GitHub Actions inicia: ~10 segundos
- Build do site: ~30 segundos
- Deploy: ~1 minuto
- Modo manutenção: 10 segundos
- **Total: 2-3 minutos**

---

## 🎯 FLUXO COMPLETO DE ATUALIZAÇÃO

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar tudo
git add .

# 3. Commitar com mensagem
git commit -m "fix: sistema corrigido e funcionando"

# 4. Enviar para GitHub
git push origin main

# 5. Aguardar 2-3 minutos

# 6. Abrir site e verificar
# https://xteamorgg.github.io/X-TEAM-ORG/
```

---

## 🔥 COMANDOS PARA EMERGÊNCIA

### Site quebrou? Voltar para versão anterior:
```bash
# Ver commits anteriores
git log --oneline

# Voltar para commit específico (copiar o código)
git reset --hard abc1234

# Forçar push
git push -f origin main
```

### Limpar tudo e começar do zero:
```bash
# CUIDADO! Apaga TODAS as mudanças não commitadas
git reset --hard HEAD
git clean -fd
```

---

## ✅ CHECKLIST ANTES DE ATUALIZAR

- [ ] Testei localmente?
- [ ] Sem erros no console?
- [ ] Arquivos corretos adicionados?
- [ ] Mensagem de commit clara?
- [ ] Tenho backup dos dados importantes?

---

## 🎉 PRONTO!

Agora você pode atualizar o site sempre que quiser!

**Comando mais usado:**
```bash
git add . && git commit -m "update: atualizações" && git push origin main
```

**Aguardar 2-3 minutos e site está atualizado! 🚀**
