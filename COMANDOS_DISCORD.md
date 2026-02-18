# Comandos Discord - X TEAM

## Como Registrar os Comandos

Execute este comando ANTES de iniciar o bot:

```bash
npm run register-commands
```

Isso vai registrar todos os comandos slash no Discord.

## Comandos Disponíveis

### Configuração

#### `/xteam-config-role`
Configura um cargo da hierarquia
- **cargo**: Tipo de cargo (leaders, investigators, agents, newbies)
- **role**: Cargo do Discord (@mencionar)

**Exemplo:**
```
/xteam-config-role cargo:leaders role:@X LEADERS
```

#### `/xteam-config-invite`
Define o link de convite do Discord
- **link**: URL do convite

**Exemplo:**
```
/xteam-config-invite link:https://discord.gg/seu-link
```

---

### Adicionar Servidores

#### `/adicionarservesuspeito`
Adiciona um servidor suspeito ao painel
- **id**: ID do servidor Discord
- **status**: Descrição da investigação

**Exemplo:**
```
/adicionarservesuspeito id:123456789 status:Sob investigação por atividades suspeitas
```

#### `/adicionarserveinvestigado`
Adiciona um servidor investigado ao painel
- **id**: ID do servidor Discord
- **status**: Relatório da investigação

**Exemplo:**
```
/adicionarserveinvestigado id:123456789 status:Investigação concluída - Confirmado
```

#### `/adicionarservedesativado`
Adiciona um servidor desativado ao painel
- **id**: ID do servidor Discord
- **status**: Motivo da desativação

**Exemplo:**
```
/adicionarservedesativado id:123456789 status:Desativado após denúncias
```

---

### Sincronização

#### `/xteam-sync`
Sincroniza membros manualmente

**Exemplo:**
```
/xteam-sync
```

Mostra estatísticas:
- Total de membros
- Membros por cargo

---

## Ordem de Execução

1. **Registrar comandos:**
   ```bash
   npm run register-commands
   ```

2. **Iniciar o bot:**
   ```bash
   npm run bot
   ```

3. **No Discord, usar os comandos:**
   - Configurar cargos
   - Configurar link do Discord
   - Sincronizar membros
   - Adicionar servidores

---

## Notas Importantes

⚠️ **Comandos globais podem levar até 1 hora para aparecer**

Se quiser testar imediatamente, você pode:
1. Ir no Discord Developer Portal
2. OAuth2 → URL Generator
3. Selecionar `applications.commands`
4. Adicionar o bot novamente com essa permissão

Ou aguardar até 1 hora para os comandos aparecerem automaticamente.
