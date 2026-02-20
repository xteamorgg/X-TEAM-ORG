# 🧪 TESTE COMPLETO DO SISTEMA

## ✅ CHECKLIST DE TESTES

### 1. ADICIONAR MEMBROS
- [ ] Abrir `gerenciar-servidores.html`
- [ ] Fazer login com Discord (admin)
- [ ] Adicionar membro ao cargo "X LEADERS"
  - Nick: TestLeader
  - Avatar: https://cdn.discordapp.com/embed/avatars/0.png
- [ ] Verificar se aparece mensagem de sucesso
- [ ] Verificar se o membro aparece na lista de "Membros da Equipe" abaixo
- [ ] Adicionar membro ao cargo "X AGENT GIRLS"
  - Nick: TestGirl
  - Avatar: https://cdn.discordapp.com/embed/avatars/1.png
- [ ] Verificar se aparece na lista

### 2. ADICIONAR SERVIDORES
- [ ] Adicionar servidor suspeito
  - ID: 123456789
  - Nome: Servidor Teste
  - Status: Teste de suspeita
  - Ícone: (deixar vazio)
- [ ] Verificar se aparece na lista "Servidores Suspeitos" abaixo
- [ ] Adicionar servidor investigado
- [ ] Adicionar servidor desativado
- [ ] Verificar se todos aparecem nas listas

### 3. CRIAR CARGO PERSONALIZADO
- [ ] Criar novo cargo
  - Nome: X MODERADORES
  - Cor: #00ff00 (verde)
  - Ordem: 2.5
- [ ] Verificar se aparece no dropdown "Selecionar Cargo"
- [ ] Adicionar membro ao cargo personalizado
- [ ] Verificar se aparece na lista

### 4. REMOVER ITENS
- [ ] Clicar em "Remover" em um servidor
- [ ] Confirmar remoção
- [ ] Verificar se desapareceu da lista
- [ ] Clicar em "Remover" em um membro
- [ ] Confirmar remoção
- [ ] Verificar se desapareceu da lista

### 5. SINCRONIZAR DADOS
- [ ] Clicar no botão flutuante "Sincronizar Dados" (canto inferior direito)
- [ ] Verificar se abre modal com JSON
- [ ] Clicar em "Copiar JSON"
- [ ] Verificar se mostra "✓ Copiado!"
- [ ] Abrir link do GitHub
- [ ] Colar JSON no arquivo `members-data.json`
- [ ] Fazer commit
- [ ] Aguardar 2-3 minutos

### 6. VERIFICAR SINCRONIZAÇÃO
- [ ] Abrir `about.html` em outra aba/navegador
- [ ] Verificar se os membros aparecem
- [ ] Verificar se os cargos personalizados aparecem
- [ ] Verificar se as cores estão corretas

### 7. VERIFICAR PÁGINAS DE SERVIDORES
- [ ] Abrir `suspeitos.html`
- [ ] Verificar se servidores suspeitos aparecem
- [ ] Abrir `investigados.html`
- [ ] Verificar se servidores investigados aparecem
- [ ] Abrir `desativados.html`
- [ ] Verificar se servidores desativados aparecem

### 8. TESTAR MODO MANUTENÇÃO
- [ ] Editar `maintenance.json` e mudar `"maintenance": true`
- [ ] Fazer commit
- [ ] Aguardar deploy
- [ ] Abrir qualquer página
- [ ] Verificar se mostra overlay de manutenção
- [ ] Aguardar 10 segundos
- [ ] Verificar se página recarrega automaticamente

## 🐛 PROBLEMAS CONHECIDOS E SOLUÇÕES

### Membro não aparece após adicionar
**Solução:** 
1. Verificar se mensagem de sucesso apareceu
2. Rolar para baixo até "Membros da Equipe"
3. Aguardar 2 segundos (atualização automática)
4. Se não aparecer, recarregar página (F5)

### Servidor não aparece na página
**Solução:**
1. Adicionar servidor em `gerenciar-servidores.html`
2. Clicar em "Sincronizar Dados"
3. Copiar JSON e colar em `members-data.json` no GitHub
4. Aguardar 2-3 minutos para deploy
5. Recarregar página

### Botão "Sincronizar Dados" não aparece
**Solução:**
1. Verificar se está na página `gerenciar-servidores.html`
2. Aguardar 1 segundo após carregar
3. Verificar se está logado como admin
4. Recarregar página se necessário

### Dados não sincronizam entre usuários
**Solução:**
1. Dados ficam apenas no localStorage até sincronizar
2. SEMPRE clicar em "Sincronizar Dados" após adicionar
3. Copiar JSON e fazer commit no GitHub
4. Aguardar deploy (2-3 minutos)
5. Outros usuários verão após recarregar

## 📝 NOTAS IMPORTANTES

1. **localStorage vs GitHub:**
   - Dados são salvos PRIMEIRO no localStorage (instantâneo)
   - Para outros usuários verem, precisa sincronizar com GitHub
   - Botão "Sincronizar Dados" exporta tudo para JSON

2. **Ordem dos Cargos:**
   - Leaders: 1
   - Investigators: 2
   - Agent Girls: 2.5
   - Agents: 3
   - Newbies: 4
   - Cargos personalizados: definir ordem manualmente

3. **Atualização Automática:**
   - Lista de membros/servidores atualiza a cada 2 segundos
   - Não precisa recarregar página após adicionar
   - Se não atualizar, F5 resolve

4. **Modo Manutenção:**
   - Ativa automaticamente durante deploy do GitHub
   - Duração: 10 segundos
   - Página recarrega automaticamente após

## 🚀 FLUXO COMPLETO DE USO

1. Admin faz login
2. Adiciona membros/servidores em `gerenciar-servidores.html`
3. Verifica se aparecem nas listas abaixo
4. Clica em "Sincronizar Dados"
5. Copia JSON
6. Abre `members-data.json` no GitHub
7. Cola JSON e faz commit
8. Aguarda 2-3 minutos
9. Outros usuários veem os dados em `about.html` e páginas de servidores
10. Dados persistem para todos!

## ✨ TUDO FUNCIONANDO?

Se todos os testes passarem:
- ✅ Membros aparecem imediatamente após adicionar
- ✅ Servidores aparecem nas listas
- ✅ Sincronização funciona
- ✅ Dados aparecem para todos após sync
- ✅ Modo manutenção funciona
- ✅ Sem erros no console

**Sistema 100% operacional! 🎉**
