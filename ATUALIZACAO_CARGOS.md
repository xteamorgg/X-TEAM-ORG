# Atualização: Sistema de Cargos Admin

## O Que Mudou

Anteriormente, apenas usuários com **permissão de Administrador** no servidor Discord podiam acessar as páginas admin (X IA e X DOX).

Agora, usuários com **cargos específicos** também têm acesso, mesmo sem permissão de administrador.

## Cargos com Acesso

Os seguintes cargos agora têm acesso às páginas administrativas:

1. **X LEADERS** - ID: `1473718484125880465`
2. **Cargo Especial 2** - ID: `1473791022550089864`
3. **X INVESTIGADORES** - ID: `1473729894356877312`
4. **Cargo Especial 4** - ID: `1473791113650372618`

**Nota**: Usuários com permissão de Administrador no servidor continuam tendo acesso (fallback).

## Arquivos Modificados

### 1. `admin.js`
- Adicionado array `ADMIN_ROLE_IDS` com os IDs dos cargos permitidos
- Modificada função `checkAdminPermissions()` para verificar cargos específicos
- Adicionado fallback para permissão de administrador

**Mudança principal**:
```javascript
// Antes: Verificava apenas permissão de administrador
const hasAdmin = (mainGuild.permissions & 0x8) === 0x8;

// Agora: Verifica cargos específicos primeiro
const hasAllowedRole = memberData.roles.some(roleId => ADMIN_ROLE_IDS.includes(roleId));
```

### 2. `bot/index.js`
- Atualizado OAuth scope para incluir `guilds.members.read`
- Necessário para acessar os cargos do usuário

**Mudança**:
```javascript
// Antes
scope=identify

// Agora
scope=identify%20guilds%20guilds.members.read
```

### 3. Documentação
- `ADMIN_PAGES.md` - Atualizado com informações sobre cargos
- `COMO_TESTAR.md` - Atualizado com IDs dos cargos
- `CARGOS_ADMIN.md` - Novo arquivo com guia completo sobre cargos

## Como Funciona

### Fluxo de Verificação

1. **Usuário faz login** via Discord OAuth
2. **Sistema solicita permissões**:
   - `identify` - Dados básicos do usuário
   - `guilds` - Servidores do usuário
   - `guilds.members.read` - Cargos do usuário
3. **Sistema busca cargos** do usuário no servidor principal
4. **Verifica se tem algum cargo** da lista permitida
5. **Se sim**: Libera acesso às páginas admin
6. **Se não**: Verifica permissão de administrador (fallback)
7. **Se não**: Bloqueia acesso

### Exemplo de Verificação

```javascript
// Busca os cargos do usuário
const memberData = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`);

// Verifica se tem algum cargo permitido
const hasAllowedRole = memberData.roles.some(roleId => 
  ADMIN_ROLE_IDS.includes(roleId)
);

// Se não tiver cargo, verifica permissão de admin
if (!hasAllowedRole) {
  const hasAdmin = (mainGuild.permissions & 0x8) === 0x8;
  return hasAdmin;
}

return hasAllowedRole;
```

## Impacto nos Usuários

### Usuários com Cargos Permitidos
- ✅ Agora podem acessar X IA e X DOX
- ✅ Veem os links na navegação após login
- ✅ Não precisam de permissão de administrador

### Usuários com Permissão de Admin
- ✅ Continuam tendo acesso normalmente
- ✅ Nenhuma mudança no comportamento

### Usuários Sem Cargo/Permissão
- ❌ Não veem os links admin
- ❌ São redirecionados se tentarem acessar diretamente
- ℹ️ Comportamento igual ao anterior

## Testando a Mudança

### Teste 1: Usuário com Cargo Permitido
1. Faça login com conta que tem um dos cargos listados
2. Verifique se os links X IA e X DOX aparecem
3. Acesse as páginas e confirme que funcionam

### Teste 2: Usuário Sem Cargo
1. Faça login com conta sem os cargos
2. Verifique que os links não aparecem
3. Tente acessar `/xia.html` diretamente
4. Confirme que é redirecionado para home

### Teste 3: Administrador
1. Faça login com conta admin (sem os cargos específicos)
2. Verifique que os links aparecem (fallback)
3. Confirme acesso às páginas

## Adicionando Novos Cargos

Para adicionar mais cargos com acesso admin:

1. Abra `admin.js`
2. Adicione o ID no array:
```javascript
const ADMIN_ROLE_IDS = [
  '1473718484125880465',
  '1473791022550089864',
  '1473729894356877312',
  '1473791113650372618',
  'NOVO_ID_AQUI' // Adicione aqui
];
```
3. Salve e recarregue o site

## Removendo Cargos

Para remover um cargo:

1. Abra `admin.js`
2. Remova a linha com o ID
3. Salve e recarregue o site

## Importante

⚠️ **Após esta atualização, usuários precisam fazer logout e login novamente** para que o sistema solicite as novas permissões OAuth (`guilds.members.read`).

Se um usuário já estava logado antes da atualização:
1. Peça para clicar em "Sair"
2. Faça login novamente
3. Autorize as novas permissões
4. Os links admin devem aparecer

## Segurança

### Pontos Positivos
- ✅ Verificação em tempo real via Discord API
- ✅ Token OAuth seguro
- ✅ Redirecionamento automático
- ✅ Múltiplas camadas de verificação

### Considerações
- ⚠️ Verificação feita no cliente (JavaScript)
- ⚠️ Para dados sensíveis, considere verificação no backend
- ⚠️ Token armazenado no localStorage (considere sessionStorage para mais segurança)

### Recomendações Futuras
- Implementar verificação no backend (Node.js)
- Adicionar rate limiting
- Implementar refresh token
- Adicionar logs de acesso

## Rollback

Se precisar voltar ao sistema anterior (apenas administradores):

1. Abra `admin.js`
2. Substitua a função `checkAdminPermissions()` pela versão antiga
3. Reverta o scope OAuth em `bot/index.js` para apenas `identify`

Ou simplesmente remova todos os IDs do array `ADMIN_ROLE_IDS` (deixe vazio).

## Suporte

Se houver problemas:
1. Verifique o console do navegador (F12)
2. Verifique se os IDs dos cargos estão corretos
3. Confirme que o usuário tem o cargo no servidor
4. Peça para fazer logout/login novamente
5. Verifique se o bot está rodando

## Conclusão

O sistema agora é mais flexível, permitindo que membros específicos da equipe (X LEADERS e X INVESTIGADORES) tenham acesso às ferramentas administrativas sem precisar de permissão de administrador no servidor.

Isso facilita a gestão de permissões e permite que mais membros contribuam com as operações da X TEAM.
