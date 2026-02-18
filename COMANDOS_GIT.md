# Comandos Git - Guia Rápido

## 📤 Enviar para o GitHub

### Primeira vez (se ainda não tem repositório remoto)

```bash
# 1. Inicializar Git (se ainda não fez)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer commit
git commit -m "Initial commit - X TEAM Platform"

# 4. Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/X-TEAM-ORG.git

# 5. Enviar para o GitHub
git push -u origin main
```

### Se já tem repositório configurado

```bash
# 1. Ver status dos arquivos
git status

# 2. Adicionar arquivos modificados
git add .

# 3. Fazer commit com mensagem
git commit -m "Descrição das mudanças"

# 4. Enviar para o GitHub
git push
```

## 🔄 Atualizar do GitHub

```bash
# Baixar últimas mudanças
git pull
```

## 📋 Comandos Úteis

### Ver histórico de commits
```bash
git log
git log --oneline  # Versão resumida
```

### Ver diferenças
```bash
git diff           # Ver mudanças não commitadas
git diff --staged  # Ver mudanças no stage
```

### Desfazer mudanças
```bash
# Desfazer mudanças em arquivo específico
git checkout -- arquivo.js

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças)
git reset --hard HEAD~1
```

### Branches
```bash
# Criar nova branch
git checkout -b nome-da-branch

# Mudar de branch
git checkout main

# Listar branches
git branch

# Deletar branch
git branch -d nome-da-branch
```

### Remover arquivos do Git
```bash
# Remover arquivo do Git mas manter no disco
git rm --cached arquivo.txt

# Remover pasta do Git mas manter no disco
git rm -r --cached pasta/
```

## 🚀 Workflow Recomendado

### Para mudanças pequenas
```bash
git add .
git commit -m "Descrição curta"
git push
```

### Para features novas
```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer mudanças e commits
git add .
git commit -m "Adiciona nova funcionalidade"

# 3. Voltar para main
git checkout main

# 4. Fazer merge
git merge feature/nova-funcionalidade

# 5. Enviar para GitHub
git push
```

## 📝 Mensagens de Commit

### Boas práticas

```bash
# ✅ Bom
git commit -m "Adiciona contador de visitantes"
git commit -m "Corrige bug no login Discord"
git commit -m "Atualiza cores dos badges"

# ❌ Ruim
git commit -m "mudanças"
git commit -m "fix"
git commit -m "atualizações"
```

### Tipos de commit
```bash
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação, espaços
refactor: Refatoração de código
test: Testes
chore: Tarefas de manutenção
```

Exemplos:
```bash
git commit -m "feat: Adiciona terminal X DOX"
git commit -m "fix: Corrige contador de visitantes"
git commit -m "docs: Atualiza README"
git commit -m "style: Ajusta cores dos badges"
```

## 🔐 Arquivos Sensíveis

### Nunca commitar:
- `.env` (senhas, tokens)
- `node_modules/` (dependências)
- `bot/data.json` (dados do bot)
- `dist/` (build)

### Verificar .gitignore
```bash
# Ver conteúdo do .gitignore
cat .gitignore

# Deve conter:
node_modules
.env
bot/config.json
bot/data.json
dist
```

## 🆘 Problemas Comuns

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/seu-usuario/X-TEAM-ORG.git
```

### "Your branch is ahead of 'origin/main'"
```bash
git push
```

### "Your branch is behind 'origin/main'"
```bash
git pull
```

### Conflitos de merge
```bash
# 1. Ver arquivos com conflito
git status

# 2. Abrir arquivo e resolver conflitos manualmente
# Procure por: <<<<<<< HEAD

# 3. Depois de resolver
git add .
git commit -m "Resolve conflitos"
git push
```

### Commitou arquivo sensível (.env)
```bash
# 1. Remover do Git
git rm --cached .env

# 2. Adicionar ao .gitignore
echo ".env" >> .gitignore

# 3. Commit
git add .gitignore
git commit -m "Remove .env do repositório"
git push

# 4. IMPORTANTE: Trocar todas as senhas/tokens!
```

## 📦 Preparar para GitHub

### Checklist antes do push

- [ ] Verificar .gitignore
- [ ] Remover arquivos sensíveis
- [ ] Testar build: `npm run build`
- [ ] Atualizar README.md
- [ ] Verificar package.json
- [ ] Fazer commit com mensagem clara
- [ ] Push para GitHub

### Comando completo
```bash
# 1. Verificar status
git status

# 2. Adicionar tudo
git add .

# 3. Commit
git commit -m "Prepara projeto para deploy no GitHub Pages"

# 4. Push
git push origin main
```

## 🌐 Após o Push

1. Vá no GitHub: https://github.com/seu-usuario/X-TEAM-ORG
2. Verifique se os arquivos estão lá
3. Vá em Actions para ver o deploy
4. Configure GitHub Pages em Settings > Pages
5. Aguarde deploy finalizar
6. Acesse: https://seu-usuario.github.io/X-TEAM-ORG/

## 💡 Dicas

### Commit frequente
```bash
# Ao invés de fazer 1 commit gigante
git add .
git commit -m "Adiciona 50 funcionalidades"

# Faça commits menores
git add arquivo1.js
git commit -m "Adiciona função X"

git add arquivo2.js
git commit -m "Adiciona função Y"
```

### Ver o que vai ser commitado
```bash
git diff --staged
```

### Commitar apenas alguns arquivos
```bash
git add arquivo1.js arquivo2.js
git commit -m "Atualiza arquivos específicos"
```

### Alterar última mensagem de commit
```bash
git commit --amend -m "Nova mensagem"
```

## 🔗 Links Úteis

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Pronto para fazer push?**

```bash
git add .
git commit -m "Seu projeto X TEAM está pronto! 🚀"
git push origin main
```
