# Deploy do Bot na Discloud

## Arquivos necessários para upload:
1. **bot/** - Pasta completa do bot
2. **package.json** - Dependências do projeto
3. **discloud.config.json** - Configuração da Discloud

## Configuração necessária:
- No arquivo `.env`, atualize as URLs para a Discloud:
  ```
  REDIRECT_URI=https://seu-id.discloud.app/api/auth/callback
  FRONTEND_URL=https://seu-id.discloud.app
  ```

## Passos para deploy:
1. Compacte todos os arquivos em um ZIP
2. Faça upload na Discloud
3. Configure as variáveis de ambiente no painel
4. Inicie o bot

## URLs após deploy:
- Bot API: https://seu-id.discloud.app
- Site: https://xteamorgg.github.io/X-TEAM-ORG (continua no GitHub Pages)
- Callback URL: https://seu-id.discloud.app/api/auth/callback

## Importante:
- O site continua no GitHub Pages
- Apenas o bot será hospedado na Discloud
- Atualize o REDIRECT_URI no Discord Developer Portal
