# Sistema de Membros Online

## Como Funciona

O sistema pode mostrar quantos membros estão online em servidores suspeitos **sem o bot estar no servidor**, usando a API pública do Discord através de códigos de convite.

## Adicionar Servidor com Contador de Membros

### Comando Atualizado

```
/adicionarservidorsuspeito
  id: 123456789
  nome: Servidor Suspeito
  status: Em análise
  foto: https://exemplo.com/foto.png (opcional)
  invite: xteam (NOVO - código do convite)
```

### Parâmetros

- **id**: ID do servidor Discord
- **nome**: Nome do servidor
- **status**: Descrição/status da investigação
- **foto**: URL da foto (opcional)
- **invite**: Código do convite Discord (opcional)

### Exemplo Completo

```
/adicionarservidorsuspeito
  id: 1234567890
  nome: Servidor Teste
  status: Monitoramento ativo
  invite: abc123
```

## Como Obter o Código de Convite

### Método 1: Criar Convite Permanente

1. Entre no servidor suspeito
2. Clique com botão direito em um canal
3. Selecione "Convidar Pessoas"
4. Clique em "Editar link de convite"
5. Configure:
   - Expirar após: **Nunca**
   - Máximo de usos: **Sem limite**
6. Copie o link: `https://discord.gg/abc123`
7. Use apenas o código: `abc123`

### Método 2: Usar Convite Existente

Se o servidor já tem um convite público:
1. Copie o link: `https://discord.gg/xteam`
2. Use apenas o código: `xteam`

## O Que é Exibido

Quando você adiciona um servidor com código de convite, o site mostra:

```
┌─────────────────────────────────┐
│ 🔍 Servidor Teste               │
│ ID: 1234567890                  │
│ ● 150 online  ○ 1,234 membros  │
│                                 │
│ Status: Monitoramento ativo     │
└─────────────────────────────────┘
```

### Informações Exibidas

- **● X online**: Membros online agora (bolinha verde)
- **○ X membros**: Total de membros (bolinha cinza)

## Atualização Automática

- As informações são buscadas quando a página carrega
- Atualiza automaticamente a cada 30 segundos
- Não precisa recarregar a página

## Limitações

### ✅ Funciona:
- Servidores com convites públicos
- Servidores onde você tem acesso
- Convites permanentes ou temporários válidos

### ❌ Não funciona:
- Servidores sem convites públicos
- Convites expirados
- Servidores privados sem convite

## Vantagens

✅ **Não precisa do bot no servidor**
- Usa API pública do Discord
- Funciona com qualquer servidor que tenha convite

✅ **Informações em tempo real**
- Membros online atualizados
- Total de membros do servidor

✅ **Sem rate limit**
- API pública tem limites maiores
- Não afeta o bot

## Exemplos de Uso

### Servidor Público

```
/adicionarservidorsuspeito
  id: 1234567890
  nome: Servidor Público Suspeito
  status: Investigando atividades
  invite: publicserver
```

Resultado: Mostra membros online ✅

### Servidor Privado (sem convite)

```
/adicionarservidorsuspeito
  id: 9876543210
  nome: Servidor Privado
  status: Sem acesso
```

Resultado: Não mostra membros online (normal)

### Servidor com Foto e Convite

```
/adicionarservidorsuspeito
  id: 5555555555
  nome: Servidor Completo
  status: Análise detalhada
  foto: https://cdn.discord.com/icons/555/icon.png
  invite: complete
```

Resultado: Mostra foto + membros online ✅

## Troubleshooting

### "Convite inválido"

**Causas:**
- Convite expirado
- Código errado
- Servidor deletado

**Solução:**
- Verificar se o convite ainda funciona
- Criar novo convite permanente
- Atualizar o código no comando

### Não mostra membros online

**Causas:**
- Servidor não tem convite público
- Parâmetro `invite` não foi fornecido
- API do Discord temporariamente indisponível

**Solução:**
- Adicionar parâmetro `invite` ao comando
- Verificar se o convite é válido
- Aguardar alguns minutos e recarregar

### Números não atualizam

**Causas:**
- Cache do navegador
- API do Discord com delay

**Solução:**
- Recarregar página (F5)
- Limpar cache (Ctrl+Shift+R)
- Aguardar 30 segundos para atualização automática

## API Endpoint

O sistema usa o endpoint:

```
GET /api/server-info/:inviteCode
```

**Resposta:**
```json
{
  "name": "Nome do Servidor",
  "icon": "https://cdn.discord.com/icons/...",
  "memberCount": 1234,
  "onlineCount": 150,
  "description": "Descrição do servidor"
}
```

## Segurança

✅ **Seguro:**
- Usa API pública oficial do Discord
- Não requer permissões especiais
- Não expõe dados sensíveis

⚠️ **Considerações:**
- Qualquer pessoa com o convite pode ver as mesmas informações
- Não mostra lista de membros, apenas contagem
- Não mostra atividades ou mensagens

## Comandos Relacionados

### Atualizar Servidor

Para adicionar convite a servidor já existente, você precisa:
1. Remover o servidor antigo (manualmente no `bot/data.json`)
2. Adicionar novamente com o parâmetro `invite`

### Remover Convite

Para parar de mostrar membros online:
1. Edite `bot/data.json`
2. Remova o campo `inviteCode` do servidor
3. Reinicie o bot

## Exemplo Completo de Uso

```bash
# 1. Adicionar servidor suspeito com convite
/adicionarservidorsuspeito id:123 nome:Teste status:Ativo invite:abc123

# 2. Acessar página de suspeitos
https://seu-site.github.io/X-TEAM-ORG/suspeitos.html

# 3. Ver informações em tempo real
● 150 online  ○ 1,234 membros
```

## Dicas

💡 **Use convites permanentes** para não precisar atualizar
💡 **Teste o convite** antes de adicionar ao comando
💡 **Monitore servidores públicos** facilmente sem entrar neles
💡 **Combine com foto** para visualização completa

---

**Pronto!** Agora você pode monitorar membros online de servidores suspeitos sem precisar estar neles! 🎯
