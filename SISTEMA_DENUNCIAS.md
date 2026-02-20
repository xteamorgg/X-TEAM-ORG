# 🚨 Sistema de Denúncias - X TEAM

## Visão Geral

O sistema de denúncias permite que usuários logados reportem servidores suspeitos diretamente através do site. As denúncias são enviadas automaticamente para um canal do Discord via webhook.

## Como Funciona

### 1. Requisitos
- Usuário deve estar logado com Discord
- Link de convite válido do servidor a ser denunciado
- Motivo/descrição da denúncia

### 2. Fluxo de Denúncia

1. Usuário clica no botão "Denunciar Servidor" (disponível em todas as páginas)
2. Se não estiver logado, é solicitado login com Discord
3. Preenche o formulário:
   - Link do convite do servidor (discord.gg/xxx)
   - Motivo da denúncia
4. Sistema valida o convite e busca informações do servidor
5. Denúncia é enviada diretamente para o webhook do Discord
6. Administradores recebem notificação no canal configurado

### 3. Informações Enviadas

A denúncia inclui:
- **Nome e ID do servidor** denunciado
- **Ícone do servidor** (se disponível)
- **Motivo** da denúncia
- **Denunciante**: username e ID do Discord
- **Link do convite** para investigação
- **Timestamp** da denúncia

## Configuração Técnica

### Webhook do Discord

O webhook está configurado diretamente no código do site (`report.js`):

```javascript
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1474333015080702077/tB4XypRDxQWlodBK_V-lEUA-sO8YRIKzE-fCb0pZ5aLWtoq78WNI9SvwcXCdMLFPSomK';
```

### Vantagens do Webhook

✅ **Não depende do bot** - funciona mesmo se o bot estiver offline
✅ **Mais rápido** - envio direto sem intermediários
✅ **Mais confiável** - menos pontos de falha
✅ **Sem rate limits** - webhooks têm limites separados da API do bot

## Formato da Mensagem

As denúncias são enviadas como embeds do Discord com:

- **Cor**: Vermelho (#ef4444)
- **Título**: 🚨 Nova Denúncia de Servidor
- **Campos**:
  - 📝 Motivo
  - 👤 Denunciante (username + ID)
  - 🔗 Convite (link clicável)
- **Thumbnail**: Ícone do servidor denunciado
- **Footer**: X TEAM - Sistema de Denúncias
- **Timestamp**: Data/hora da denúncia

## Segurança

- Apenas usuários autenticados podem denunciar
- Validação do convite antes de enviar
- Informações do denunciante são registradas (previne spam/abuso)
- Webhook URL não é exposta publicamente (apenas no código)

## Manutenção

### Trocar Canal de Denúncias

Para mudar o canal que recebe as denúncias:

1. Crie um novo webhook no canal desejado (Configurações do Canal > Integrações > Webhooks)
2. Copie a URL do webhook
3. Atualize a constante `DISCORD_WEBHOOK_URL` em `report.js`
4. Faça commit e deploy das alterações

### Desabilitar Sistema

Para desabilitar temporariamente:
- Remova ou desative o webhook no Discord
- As denúncias falharão silenciosamente

## Testes

Para testar o sistema:

1. Faça login no site com Discord
2. Clique em "Denunciar Servidor"
3. Use um convite válido de teste (ex: discord.gg/discord-testers)
4. Preencha o motivo
5. Verifique se a mensagem aparece no canal do Discord

## Troubleshooting

### Denúncia não chega no Discord
- Verifique se o webhook ainda existe e está ativo
- Confirme que a URL do webhook está correta
- Verifique o console do navegador para erros

### Erro "Convite inválido"
- Convite pode estar expirado
- Servidor pode ter sido deletado
- Link pode estar mal formatado

### Erro ao enviar
- Webhook pode ter sido deletado
- Rate limit do webhook (30 mensagens/minuto)
- Problemas de conexão com Discord API

## Endpoints Removidos

O endpoint `/api/report` do bot não é mais necessário e pode ser removido se desejar, já que as denúncias agora vão direto para o webhook.
