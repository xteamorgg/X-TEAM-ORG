# Como Funciona o Modo Manutenção Automático

## O que é?
O modo manutenção é ativado **automaticamente** sempre que você faz um push para o GitHub. Os visitantes veem uma tela de atualização enquanto o site está sendo deployado.

## Processo Automático

### 1. Você faz um commit e push
```bash
git add .
git commit -m "Atualiza membros"
git push
```

### 2. GitHub Actions detecta o push
- O workflow de deploy é iniciado automaticamente

### 3. Modo Manutenção é ATIVADO
- O GitHub Actions ativa automaticamente o modo manutenção
- Arquivo `maintenance.json` é atualizado para `"maintenance": true`
- Visitantes veem a tela de manutenção com contador de 10 segundos

### 4. Build e Deploy
- O site é compilado (npm run build)
- Arquivos são enviados para GitHub Pages
- Deploy é realizado

### 5. Aguarda 10 segundos
- O workflow aguarda 10 segundos após o deploy

### 6. Modo Manutenção é DESATIVADO
- O GitHub Actions desativa automaticamente o modo manutenção
- Arquivo `maintenance.json` é atualizado para `"maintenance": false`
- Site volta ao normal

## Você NÃO precisa fazer nada!

✅ Tudo é automático
✅ Manutenção ativa durante o deploy
✅ Manutenção desativa após o deploy
✅ Visitantes são avisados automaticamente

## O que os visitantes veem?

Durante o deploy (2-3 minutos):
- 🔧 Tela de manutenção
- "Servidor em atualização. Aguarde 10 segundos..."
- Contador regressivo
- Página recarrega automaticamente

## Fluxo Completo

```
1. git push
   ↓
2. GitHub Actions inicia
   ↓
3. 🔧 MANUTENÇÃO ATIVADA (automático)
   ↓
4. Build do site
   ↓
5. Deploy para GitHub Pages
   ↓
6. Aguarda 10 segundos
   ↓
7. ✅ MANUTENÇÃO DESATIVADA (automático)
   ↓
8. Site funcionando normalmente
```

## Tempo Total

- **Build + Deploy**: ~2-3 minutos
- **Manutenção ativa**: Durante todo o processo
- **Visitantes**: Veem tela de manutenção e página recarrega automaticamente

## Vantagens

✅ **Automático**: Não precisa ativar/desativar manualmente
✅ **Profissional**: Visitantes sabem que o site está sendo atualizado
✅ **Sem erros**: Visitantes não veem site quebrado durante deploy
✅ **Transparente**: Contador mostra quanto tempo falta

## Modo Manual (Opcional)

Se quiser ativar manualmente (para manutenção programada):

### Ativar
```bash
echo '{"maintenance":true,"message":"Manutenção programada...","duration":10}' > maintenance.json
git add maintenance.json
git commit -m "Ativa manutenção manual"
git push
```

### Desativar
```bash
echo '{"maintenance":false,"message":"Servidor em atualização. Aguarde 10 segundos...","duration":10}' > maintenance.json
git add maintenance.json
git commit -m "Desativa manutenção manual"
git push
```

## Personalizar Mensagem

Edite o workflow `.github/workflows/deploy.yml` para mudar a mensagem:

```yaml
- name: Ativar Modo Manutenção
  run: |
    echo '{"maintenance":true,"message":"SUA MENSAGEM AQUI","duration":15}' > maintenance.json
```

## Troubleshooting

**Problema**: Manutenção não aparece
- Solução: Aguarde 1-2 minutos após o push, limpe cache (Ctrl+F5)

**Problema**: Manutenção fica ativa para sempre
- Solução: O workflow desativa automaticamente. Se não desativar, faça manualmente

**Problema**: Quero desabilitar o modo automático
- Solução: Remova os steps de manutenção do arquivo `.github/workflows/deploy.yml`

## Logs do GitHub Actions

Para ver o processo:
1. Vá no repositório GitHub
2. Clique em "Actions"
3. Veja o workflow rodando
4. Veja os logs de "Ativar Modo Manutenção" e "Desativar Modo Manutenção"
