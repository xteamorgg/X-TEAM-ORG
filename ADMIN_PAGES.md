# Páginas de Administrador - X TEAM

## Páginas Criadas

### 1. X IA (`xia.html`)
- **Descrição**: Página para ferramentas de Inteligência Artificial
- **Status**: Estrutura criada, conteúdo em desenvolvimento
- **Acesso**: Somente administradores do servidor Discord

### 2. X DOX (`xdox.html`)
- **Descrição**: Terminal de comando interativo (estilo CMD)
- **Status**: Totalmente funcional
- **Acesso**: Somente administradores do servidor Discord

## Sistema de Autenticação Admin

### Cargos com Acesso Admin

Os seguintes cargos do Discord têm acesso às páginas administrativas:

- **1473718484125880465** - X LEADERS
- **1473791022550089864** - Cargo Especial 2
- **1473729894356877312** - X INVESTIGADORES  
- **1473791113650372618** - Cargo Especial 4

### Arquivos Criados

#### `admin.js`
Sistema centralizado de autenticação e verificação de permissões:

- **Funções principais**:
  - `getLoggedInUser()` - Verifica se usuário está logado
  - `checkAdminPermissions()` - Verifica se usuário tem algum dos cargos permitidos
  - `updateAdminUI()` - Mostra/esconde links de navegação admin
  - `handleOAuthCallback()` - Processa callback do Discord OAuth

- **Comportamento**:
  - Links admin (X IA, X DOX) ficam ocultos por padrão
  - Após login, verifica se usuário tem algum dos cargos permitidos no servidor principal (ID: `1473718425749688442`)
  - Se usuário tiver um dos cargos, mostra os links
  - Se usuário tentar acessar página admin sem permissão, é redirecionado para home
  - Também aceita usuários com permissão de administrador no servidor como fallback

#### `xdox.js`
Sistema de terminal interativo para a página X DOX:

- **Comandos disponíveis**:
  - `help` - Mostra lista de comandos
  - `clear` - Limpa o terminal
  - `status` - Mostra estatísticas do sistema
  - `servers` - Lista todos os servidores monitorados
  - `members` - Lista membros da equipe
  - `about` - Informações sobre o sistema
  - `history` - Mostra histórico de comandos

- **Recursos**:
  - Histórico de comandos (setas ↑/↓)
  - Execução com Enter ou botão
  - Output colorido estilo terminal
  - Integração com API para dados em tempo real

## Como Funciona

### Fluxo de Autenticação

1. **Usuário não logado**:
   - Links admin ficam ocultos
   - Pode navegar normalmente nas páginas públicas

2. **Usuário faz login**:
   - Clica em "Login" no header
   - É redirecionado para Discord OAuth
   - Após autorizar, retorna ao site com token

3. **Verificação de permissões**:
   - Sistema verifica se usuário está no servidor principal
   - Verifica se tem algum dos cargos permitidos:
     - X LEADERS (1473718484125880465)
     - Cargo Especial 2 (1473791022550089864)
     - X INVESTIGADORES (1473729894356877312)
     - Cargo Especial 4 (1473791113650372618)
   - Ou verifica se tem permissão de administrador (flag 0x8) como fallback
   - Se sim, mostra links admin na navegação

4. **Acesso às páginas admin**:
   - Usuário pode clicar nos links X IA ou X DOX
   - Se tentar acessar diretamente sem permissão, é redirecionado

### Integração com Páginas Existentes

- `main.js` - Importa `admin.js` para home page
- `pages.js` - Importa `admin.js` para páginas de servidores e sobre
- `xia.html` - Importa `admin.js` para verificação de acesso
- `xdox.html` - Importa `admin.js` + `xdox.js` para terminal

## Comandos do Bot Atualizados

### `/setpainelcargo`
- **Status**: Corrigido e funcional
- **Descrição**: Cria painel de verificação para cargo X NEWBIES
- **Comportamento atualizado**:
  - ✅ Qualquer membro do servidor pode clicar no botão
  - ✅ Não requer verificação de bio (Discord API não expõe bios)
  - ✅ Dá o cargo X NEWBIES automaticamente ao clicar
  - ✅ Verifica se usuário já tem o cargo antes de adicionar

### Correções Aplicadas

Todos os comandos agora têm:
- ✅ Try-catch blocks para tratamento de erros
- ✅ Return statements para evitar timeout
- ✅ Mensagens de erro apropriadas
- ✅ Logs de erro no console

## Próximos Passos (Sugestões)

### Para X IA:
- Adicionar ferramentas de análise de dados
- Integração com APIs de IA
- Dashboard de métricas

### Para X DOX:
- Adicionar mais comandos administrativos
- Comandos para gerenciar servidores
- Comandos para gerenciar membros
- Logs de atividades

### Melhorias Gerais:
- Cache de permissões para reduzir chamadas à API
- Refresh automático de token quando expirar
- Notificações quando novos servidores são adicionados
