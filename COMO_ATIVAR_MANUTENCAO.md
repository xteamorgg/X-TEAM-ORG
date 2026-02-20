# 🔧 COMO ATIVAR MODO MANUTENÇÃO

## ⚠️ MODO MANUTENÇÃO MANUAL

O modo manutenção agora é **MANUAL** para evitar loops infinitos durante deploys.

---

## 🎯 QUANDO USAR

Use o modo manutenção quando:
- Fazer manutenção programada no site
- Atualizar banco de dados
- Fazer mudanças grandes que levam tempo
- Quiser avisar usuários sobre atualização

**NÃO é mais automático durante deploys!**

---

## ✅ COMO ATIVAR

### 1. Editar `maintenance.json`

Mudar de:
```json
{"maintenance":false,"message":"Servidor em atualização. Aguarde 10 segundos...","duration":10}
```

Para:
```json
{"maintenance":true,"message":"Servidor em manutenção. Voltamos em breve!","duration":30}
```

### 2. Fazer commit e push

```bash
git add maintenance.json
git commit -m "🔧 Ativa modo manutenção"
git push origin main
```

### 3. Aguardar deploy (2-3 minutos)

O site mostrará o overlay de manutenção para todos os usuários.

---

## ❌ COMO DESATIVAR

### 1. Editar `maintenance.json`

Mudar de volta para:
```json
{"maintenance":false,"message":"Servidor em atualização. Aguarde 10 segundos...","duration":10}
```

### 2. Fazer commit e push

```bash
git add maintenance.json
git commit -m "✅ Desativa modo manutenção"
git push origin main
```

### 3. Aguardar deploy (2-3 minutos)

O site voltará ao normal.

---

## 🎨 PERSONALIZAR MENSAGEM

Você pode personalizar a mensagem e duração:

```json
{
  "maintenance": true,
  "message": "Estamos atualizando o sistema. Voltamos em 5 minutos!",
  "duration": 300
}
```

- `maintenance`: `true` = ativo, `false` = desativado
- `message`: Texto que aparece para o usuário
- `duration`: Tempo em segundos do countdown (300 = 5 minutos)

---

## 🚨 IMPORTANTE

- **Sempre desative após terminar a manutenção!**
- Usuários verão o overlay e não conseguirão usar o site
- O countdown recarrega a página automaticamente ao chegar em 0
- Se esquecer desativado, usuários ficarão presos no loop

---

## 📝 EXEMPLO DE USO

```bash
# Ativar manutenção
echo '{"maintenance":true,"message":"Manutenção programada. Voltamos em 10 minutos!","duration":600}' > maintenance.json
git add maintenance.json
git commit -m "🔧 Manutenção programada"
git push origin main

# Fazer as mudanças necessárias...

# Desativar manutenção
echo '{"maintenance":false,"message":"Servidor em atualização. Aguarde 10 segundos...","duration":10}' > maintenance.json
git add maintenance.json
git commit -m "✅ Manutenção concluída"
git push origin main
```

---

## ✨ RESULTADO

Quando ativado, usuários veem:
- Overlay escuro cobrindo toda a página
- Ícone de loading girando
- Mensagem personalizada
- Countdown em segundos
- Página recarrega automaticamente ao fim

**Modo manutenção agora é totalmente controlado por você! 🎮**
