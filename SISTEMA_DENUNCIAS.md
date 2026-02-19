# Sistema de Denúncias - X TEAM

## 📋 Visão Geral

O sistema de denúncias permite que qualquer visitante do site possa reportar servidores suspeitos do Discord. As denúncias são enviadas automaticamente para um canal específico no servidor do Discord onde o bot está rodando.

## 🎯 Funcionalidades

- **Botão flutuante roxo** no canto inferior direito de todas as páginas
- **Login obrigatório** com Discord para enviar denúncias
- **Formulário simples** com link do convite e motivo da denúncia
- **Validação automática** do link de convite
- **Notificação no Discord** com embed formatado

## ⚙️ Configuração

### 1. Configurar Canal de Denúncias

No arquivo `.env`, adicione o ID do canal onde as denúncias serão enviadas:

```env
REPORT_CHANNEL_ID=seu_canal_id_aqui
```

Para obter o ID do canal:
1. Ative o Modo Desenvolvedor no Discord (Configurações > Avançado > Modo Desenvolvedor)
2. Clique com botão direito no canal desejado
3. Clique em "Copiar ID"

### 2. Permissões do Bot

O bot precisa ter as seguintes permissões no canal de denúncias:
- Ver Canal
- Enviar Mensagens
- Inserir Links
- Anexar Arquivos

## 🚀 Como Usar (Usuário)

### 1. Acessar o Sistema

- Clique no botão roxo de chat no canto inferior direito
- Um modal será aberto

### 2. Fazer Login

Se não estiver logado:
- Clique em "Login com Discord"
- Autorize o aplicativo
- Você será redirecionado de volta ao site

### 3. Enviar Denúncia

Após o login:
1. Cole o link do convite do servidor suspeito
   - Formatos aceitos: `discord.gg/codigo` ou `https://discord.gg/codigo`
2. Descreva o motivo da denúncia
3. Clique em "Enviar Denúncia"

### 4. Confirmação

- Mensagem de sucesso será exibida
- Modal fecha automaticamente após 3 segundos
- Denúncia é enviada para o canal configurado

## 📨 Formato da Denúncia no Discord

As denúncias aparecem como um embed vermelho com:

```
🚨 Nova Denúncia de Servidor

Servidor Denunciado:
[Nome do Servidor] (ID: [ID])

📝 Motivo
[Texto da denúncia]

👤 Denunciante
[username#discriminator] (ID: [ID])

🔗 Convite
discord.gg/[codigo]
```

## 🔒 Segurança

- **Login obrigatório**: Apenas usuários autenticados podem denunciar
- **Validação de convite**: Sistema verifica se o convite é válido antes de enviar
- **Rastreabilidade**: Todas as denúncias incluem informações do denunciante
- **Rate limiting**: Proteção contra spam (implementado pelo Discord)

## 🎨 Personalização

### Alterar Cor do Botão

No arquivo `style.css`, procure por `.report-float-btn`:

```css
.report-float-btn {
  background: var(--neon-purple); /* Altere aqui */
}
```

### Alterar Posição do Botão

```css
.report-float-btn {
  bottom: 30px; /* Distância do fundo */
  right: 30px;  /* Distância da direita */
}
```

### Alterar Cor do Embed

No arquivo `bot/index.js`, procure por `.setColor('#ef4444')` e altere para a cor desejada.

## 🐛 Troubleshooting

### Botão não aparece
- Verifique se o arquivo `report.js` está sendo carregado
- Verifique o console do navegador por erros

### Erro ao enviar denúncia
- Verifique se o `REPORT_CHANNEL_ID` está configurado corretamente
- Verifique se o bot tem permissões no canal
- Verifique se o bot está online

### Convite inválido
- O convite pode estar expirado
- O convite pode ter sido revogado
- Formato do link pode estar incorreto

## 📝 Notas

- O sistema usa a API do Discord para validar convites
- Convites temporários podem expirar antes da análise
- Denúncias são enviadas em tempo real
- Não há sistema de moderação automática (análise manual necessária)

## 🔄 Próximas Melhorias

- [ ] Sistema de moderação de denúncias
- [ ] Histórico de denúncias por usuário
- [ ] Blacklist de usuários que abusam do sistema
- [ ] Notificações por DM para o denunciante
- [ ] Dashboard de denúncias para admins
