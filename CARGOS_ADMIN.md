# Cargos com Acesso Admin

## Cargos Permitidos

Os seguintes cargos do Discord têm acesso às páginas administrativas (X IA e X DOX):

| Cargo | ID | Descrição |
|-------|-----|-----------|
| X LEADERS | `1473718484125880465` | Fundadores e líderes da equipe |
| Cargo Especial 2 | `1473791022550089864` | Cargo com acesso admin |
| X INVESTIGADORES | `1473729894356877312` | Investigadores da equipe |
| Cargo Especial 4 | `1473791113650372618` | Cargo com acesso admin |

## Permissão Alternativa

Além dos cargos específicos, usuários com **permissão de Administrador** no servidor também têm acesso às páginas admin.

## Como Adicionar/Remover Cargos

Para modificar quais cargos têm acesso, edite o arquivo `admin.js`:

```javascript
// Cargos que têm acesso às páginas admin
const ADMIN_ROLE_IDS = [
  '1473718484125880465', // X LEADERS
  '1473791022550089864', // Cargo 2
  '1473729894356877312', // X INVESTIGADORES
  '1473791113650372618'  // Cargo 4
];
```

### Para Adicionar um Cargo:
1. Abra `admin.js`
2. Adicione o ID do cargo no array `ADMIN_ROLE_IDS`
3. Adicione um comentário descritivo
4. Salve o arquivo
5. Recarregue o site

Exemplo:
```javascript
const ADMIN_ROLE_IDS = [
  '1473718484125880465', // X LEADERS
  '1473791022550089864', // Cargo 2
  '1473729894356877312', // X INVESTIGADORES
  '1473791113650372618', // Cargo 4
  '1234567890123456789'  // NOVO CARGO AQUI
];
```

### Para Remover um Cargo:
1. Abra `admin.js`
2. Remova a linha com o ID do cargo
3. Salve o arquivo
4. Recarregue o site

## Como Obter o ID de um Cargo

### Método 1: Modo Desenvolvedor do Discord
1. Ative o Modo Desenvolvedor:
   - Configurações do Discord > Avançado > Modo Desenvolvedor
2. Vá até o servidor
3. Clique com botão direito no cargo
4. Clique em "Copiar ID"

### Método 2: Via Bot
Use o comando do bot para listar cargos:
```
/xteam-config-role
```
O Discord mostrará os cargos disponíveis com seus IDs.

## Verificação de Acesso

O sistema verifica o acesso da seguinte forma:

1. **Usuário faz login** via Discord OAuth
2. **Sistema busca os cargos** do usuário no servidor principal
3. **Verifica se tem algum cargo** da lista `ADMIN_ROLE_IDS`
4. **Se sim**: Mostra links admin e permite acesso
5. **Se não**: Verifica se tem permissão de Administrador
6. **Se sim**: Permite acesso
7. **Se não**: Oculta links e bloqueia acesso

## Scopes OAuth Necessários

Para que o sistema funcione, o OAuth precisa dos seguintes scopes:

- `identify` - Informações básicas do usuário
- `guilds` - Lista de servidores do usuário
- `guilds.members.read` - Cargos do usuário nos servidores

Estes scopes já estão configurados em `bot/index.js`.

## Segurança

- ✅ Verificação feita no lado do cliente via Discord API
- ✅ Token OAuth armazenado localmente
- ✅ Verificação em tempo real ao acessar páginas
- ✅ Redirecionamento automático se não autorizado
- ⚠️ Para segurança adicional, considere implementar verificação no backend

## Troubleshooting

### Usuário com cargo correto não consegue acessar
1. Verifique se o ID do cargo está correto em `admin.js`
2. Verifique se o usuário realmente tem o cargo no servidor
3. Peça para o usuário fazer logout e login novamente
4. Verifique o console do navegador (F12) para erros

### Links admin não aparecem
1. Verifique se o usuário está logado
2. Verifique se o token OAuth não expirou
3. Verifique se o servidor ID está correto (`1473718425749688442`)
4. Verifique se os scopes OAuth estão corretos

### Erro ao verificar permissões
1. Verifique se o bot está rodando
2. Verifique se a API está acessível
3. Verifique se o token OAuth é válido
4. Verifique logs do console do navegador
