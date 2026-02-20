# Como Atualizar Membros e Servidores para Todo Mundo Ver

## Problema
Quando você adiciona membros ou servidores pela página "Gerenciar", eles são salvos apenas no seu navegador (localStorage). Outras pessoas não conseguem ver.

## Solução
Para que todos vejam, você precisa atualizar o arquivo `members-data.json` no GitHub.

## Passo a Passo

### 1. Adicionar Membros/Servidores
1. Acesse a página "Gerenciar"
2. Adicione os membros ou servidores normalmente
3. Eles serão salvos no seu navegador

### 2. Exportar Dados do Navegador
Abra o Console do navegador (F12) e execute:

```javascript
// Exportar todos os dados
const data = {
  leaders_members: JSON.parse(localStorage.getItem('leaders_members') || '[]'),
  investigators_members: JSON.parse(localStorage.getItem('investigators_members') || '[]'),
  agent_girls_members: JSON.parse(localStorage.getItem('agent_girls_members') || '[]'),
  agents_members: JSON.parse(localStorage.getItem('agents_members') || '[]'),
  newbies_members: JSON.parse(localStorage.getItem('newbies_members') || '[]'),
  custom_roles: JSON.parse(localStorage.getItem('custom_roles') || '[]'),
  suspicious_servers: JSON.parse(localStorage.getItem('suspicious_servers') || '[]'),
  investigated_servers: JSON.parse(localStorage.getItem('investigated_servers') || '[]'),
  terminated_servers: JSON.parse(localStorage.getItem('terminated_servers') || '[]')
};

console.log(JSON.stringify(data, null, 2));
```

### 3. Copiar o JSON
1. O console vai mostrar um JSON formatado
2. Copie todo o conteúdo (Ctrl+C)

### 4. Atualizar o Arquivo no GitHub
1. Abra o arquivo `members-data.json` no repositório
2. Clique em "Edit" (ícone de lápis)
3. Cole o JSON copiado
4. Clique em "Commit changes"
5. Adicione uma mensagem: "Atualiza membros e servidores"
6. Clique em "Commit changes" novamente

### 5. Aguardar Deploy
1. O GitHub Actions vai fazer o deploy automaticamente
2. Aguarde 2-3 minutos
3. Recarregue o site
4. Agora todos vão ver os membros/servidores!

## Método Alternativo (Git)

Se você tem o repositório clonado localmente:

```bash
# 1. Copie o JSON do console
# 2. Cole no arquivo members-data.json
# 3. Faça commit e push

git add members-data.json
git commit -m "Atualiza membros e servidores"
git push
```

## Dicas

- Sempre faça backup antes de atualizar
- Você pode editar o JSON manualmente se preferir
- O formato deve ser válido (use um validador JSON se necessário)
- Após o deploy, limpe o cache do navegador (Ctrl+F5)

## Estrutura do JSON

```json
{
  "leaders_members": [
    {
      "nick": "Nome do Membro",
      "avatar": "https://cdn.discordapp.com/avatars/...",
      "role": "X LEADERS – FOUNDERS"
    }
  ],
  "investigators_members": [],
  "agent_girls_members": [],
  "agents_members": [],
  "newbies_members": [],
  "custom_roles": [
    {
      "id": "nome_do_cargo_members",
      "name": "Nome do Cargo",
      "color": "#a855f7",
      "order": 5
    }
  ],
  "suspicious_servers": [],
  "investigated_servers": [],
  "terminated_servers": []
}
```

## Automatização Futura

Para automatizar este processo, seria necessário:
1. Um backend com banco de dados
2. Sistema de autenticação
3. API para salvar dados

Por enquanto, o método manual é a solução mais simples e segura.
