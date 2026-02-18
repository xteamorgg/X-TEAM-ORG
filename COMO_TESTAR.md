# Como Testar as Novas Funcionalidades

## 1. Iniciar o Sistema

### Passo 1: Registrar Comandos do Bot
```bash
npm run register-commands
```

**Resultado esperado**:
```
✅ Comandos registrados com sucesso no servidor!
Comandos disponíveis:
/xteam-config-role
/xteam-config-invite
/adicionarservidorsuspeito
/adicionarservidorinvestigado
/adicionarservidordesativado
/xteam-sync
/setpainelcargo
```

### Passo 2: Iniciar o Bot
```bash
npm start
```

**Resultado esperado**:
```
✅ Bot conectado como [Nome do Bot]
✅ Comandos registrados no servidor
✅ Bot pronto - use /xteam-sync para sincronizar membros
✅ API rodando na porta 3000
```

### Passo 3: Iniciar o Frontend
Em outro terminal:
```bash
npm run dev
```

**Resultado esperado**:
```
VITE v[versão] ready in [tempo] ms
➜  Local:   http://localhost:5173/
```

---

## 2. Testar Comandos do Bot

### Teste 1: `/setpainelcargo`
1. No Discord, digite `/setpainelcargo`
2. O bot deve responder com um embed roxo
3. Clique no botão "Verificar"
4. Você deve receber o cargo X NEWBIES

**Verificação**:
- ✅ Comando responde imediatamente (não dá timeout)
- ✅ Embed aparece com botão verde
- ✅ Ao clicar, recebe mensagem de sucesso
- ✅ Cargo X NEWBIES é adicionado

### Teste 2: `/adicionarservidorsuspeito`
```
/adicionarservidorsuspeito
  id: 123456789
  nome: Servidor Teste
  status: Em análise
  foto: https://exemplo.com/foto.png
```

**Verificação**:
- ✅ Comando responde com mensagem de sucesso
- ✅ Servidor aparece no site em /suspeitos.html
- ✅ Foto aparece corretamente (se URL válida)

### Teste 3: `/xteam-sync`
1. Execute `/xteam-sync`
2. Aguarde alguns segundos

**Verificação**:
- ✅ Comando mostra estatísticas de membros
- ✅ Números batem com os cargos no servidor
- ✅ Site atualiza com os membros corretos

---

## 3. Testar Páginas Admin

### Teste 1: Acesso Sem Login
1. Abra `http://localhost:5173/xia.html`
2. Você deve ser redirecionado para home
3. Alerta aparece: "Acesso negado"

**Verificação**:
- ✅ Não consegue acessar sem login
- ✅ Links admin não aparecem na navegação

### Teste 2: Login com Usuário Comum
1. Clique em "Login" no header
2. Autorize no Discord
3. Volte ao site

**Verificação**:
- ✅ Avatar e nome aparecem no header
- ✅ Links admin continuam ocultos (se não for admin)

### Teste 3: Login com Usuário Autorizado
1. Faça login com conta que tem um dos cargos permitidos:
   - X LEADERS (1473718484125880465)
   - Cargo Especial 2 (1473791022550089864)
   - X INVESTIGADORES (1473729894356877312)
   - Cargo Especial 4 (1473791113650372618)
2. Observe a navegação

**Verificação**:
- ✅ Links "X IA" e "X DOX" aparecem
- ✅ Pode acessar ambas as páginas
- ✅ Não é redirecionado

---

## 4. Testar Terminal X DOX

### Pré-requisito
- Estar logado como administrador

### Teste 1: Comando `help`
1. Acesse `http://localhost:5173/xdox.html`
2. Digite `help` e pressione Enter

**Verificação**:
- ✅ Lista de comandos aparece
- ✅ Formatação colorida está correta

### Teste 2: Comando `status`
1. Digite `status` e pressione Enter

**Verificação**:
- ✅ Mostra estatísticas de servidores
- ✅ Mostra estatísticas de membros
- ✅ Números batem com os dados reais

### Teste 3: Comando `servers`
1. Digite `servers` e pressione Enter

**Verificação**:
- ✅ Lista servidores por categoria
- ✅ Mostra IDs e status
- ✅ Cores diferentes para cada categoria

### Teste 4: Comando `members`
1. Digite `members` e pressione Enter

**Verificação**:
- ✅ Lista membros por cargo
- ✅ Mostra total de membros
- ✅ Nomes corretos

### Teste 5: Histórico de Comandos
1. Execute vários comandos
2. Pressione seta ↑

**Verificação**:
- ✅ Navega pelos comandos anteriores
- ✅ Seta ↓ vai para frente
- ✅ Comando `history` mostra lista

### Teste 6: Comando `clear`
1. Digite `clear` e pressione Enter

**Verificação**:
- ✅ Terminal é limpo
- ✅ Histórico de comandos é mantido (use seta ↑)

---

## 5. Testar Integração

### Teste 1: Adicionar Servidor e Ver no Terminal
1. No Discord: `/adicionarservidorsuspeito id:999 nome:Teste status:Ativo`
2. No terminal X DOX: `servers`

**Verificação**:
- ✅ Servidor aparece na lista
- ✅ Dados corretos

### Teste 2: Sincronizar Membros e Ver no Terminal
1. No Discord: `/xteam-sync`
2. No terminal X DOX: `members`

**Verificação**:
- ✅ Membros atualizados
- ✅ Contagem correta

### Teste 3: Site Funciona com Bot Offline
1. Pare o bot (Ctrl+C)
2. Recarregue o site

**Verificação**:
- ✅ Site continua funcionando
- ✅ Dados persistidos aparecem
- ✅ Último estado salvo é exibido

---

## 6. Testar Erros

### Teste 1: Comando Inválido no Terminal
1. Digite `comando_invalido`

**Verificação**:
- ✅ Mensagem de erro em vermelho
- ✅ Sugere usar `help`

### Teste 2: Bot Offline
1. Pare o bot
2. No terminal: `status`

**Verificação**:
- ✅ Mensagem de erro apropriada
- ✅ Terminal não trava

### Teste 3: Comando do Bot com Parâmetros Inválidos
1. `/adicionarservidorsuspeito` (sem parâmetros)

**Verificação**:
- ✅ Discord mostra erro de parâmetros obrigatórios
- ✅ Bot não trava

---

## 7. Checklist Final

### Bot Discord
- [ ] Todos os comandos respondem sem timeout
- [ ] `/setpainelcargo` funciona e dá cargo
- [ ] Comandos de adicionar servidor funcionam
- [ ] `/xteam-sync` sincroniza membros
- [ ] Erros são tratados corretamente

### Site - Páginas Públicas
- [ ] Home carrega estatísticas
- [ ] Páginas de servidores mostram dados
- [ ] Página sobre mostra membros
- [ ] Login funciona
- [ ] Logout funciona

### Site - Páginas Admin
- [ ] Links admin ocultos sem login
- [ ] Links admin ocultos para não-admin
- [ ] Links admin visíveis para admin
- [ ] X IA acessível apenas para admin
- [ ] X DOX acessível apenas para admin
- [ ] Redirecionamento funciona

### Terminal X DOX
- [ ] Todos os comandos funcionam
- [ ] Histórico funciona (setas)
- [ ] Clear limpa terminal
- [ ] Cores e formatação corretas
- [ ] Dados em tempo real
- [ ] Erros tratados

---

## Problemas Comuns

### "O aplicativo não respondeu"
**Causa**: Comando sem try-catch ou sem return
**Solução**: Já corrigido em todos os comandos

### Links admin não aparecem
**Causa**: Usuário não tem um dos cargos permitidos
**Solução**: Verificar se tem algum destes cargos no servidor:
- X LEADERS (1473718484125880465)
- Cargo Especial 2 (1473791022550089864)
- X INVESTIGADORES (1473729894356877312)
- Cargo Especial 4 (1473791113650372618)
Ou permissão de administrador

### Terminal não carrega dados
**Causa**: Bot offline ou API não respondendo
**Solução**: Verificar se bot está rodando na porta 3000

### Foto do servidor não aparece
**Causa**: URL inválida ou CORS
**Solução**: Usar URLs de CDN do Discord ou imagens públicas

---

## Logs Úteis

### Ver logs do bot
```bash
# No terminal onde o bot está rodando
# Procure por:
✅ Bot conectado
✅ Comandos registrados
❌ Erro ao... (se houver problemas)
```

### Ver logs do navegador
```
F12 > Console
# Procure por:
- Erros de fetch
- Erros de autenticação
- Mensagens de admin.js
```

---

## Próximos Passos Após Testes

Se tudo funcionar:
1. ✅ Sistema está pronto para uso
2. ✅ Pode adicionar mais comandos ao terminal
3. ✅ Pode desenvolver conteúdo para X IA
4. ✅ Pode adicionar mais funcionalidades admin

Se houver problemas:
1. Verificar logs do bot
2. Verificar console do navegador
3. Verificar se portas 3000 e 5173 estão livres
4. Verificar variáveis de ambiente (.env)
