# Comandos do Terminal X DOX

## Visão Geral

O X DOX é um terminal interativo estilo CMD/Bash que permite aos administradores executar comandos para visualizar informações do sistema X TEAM.

## Acesso

- **URL**: `/xdox.html`
- **Requisito**: Permissão de administrador no servidor Discord X TEAM
- **Autenticação**: Login via Discord OAuth

## Comandos Disponíveis

### `help`
Mostra a lista de todos os comandos disponíveis.

```bash
X-TEAM@admin:~$ help
```

**Output**: Lista formatada com todos os comandos e suas descrições.

---

### `clear`
Limpa o terminal, removendo todo o histórico de comandos e outputs.

```bash
X-TEAM@admin:~$ clear
```

**Output**: Terminal limpo (sem output).

---

### `status`
Mostra o status atual do sistema, incluindo estatísticas de servidores e membros.

```bash
X-TEAM@admin:~$ status
```

**Output**:
```
╔═══════════════════════════════════════╗
║  STATUS DO SISTEMA                    ║
╚═══════════════════════════════════════╝

Servidores Monitorados:
  • Suspeitos: 5
  • Investigados: 12
  • Desativados: 3
  • Total: 20

Membros da Equipe:
  • Leaders: 2
  • Investigadores: 4
  • Agents: 8
  • Newbies: 15
  • Total: 29

✓ Sistema operacional
```

---

### `servers`
Lista todos os servidores monitorados, organizados por categoria.

```bash
X-TEAM@admin:~$ servers
```

**Output**:
```
╔═══════════════════════════════════════╗
║  SERVIDORES MONITORADOS               ║
╚═══════════════════════════════════════╝

🔍 SUSPEITOS (2):
  • Servidor A (ID: 123456789)
    Status: Em análise

✓ INVESTIGADOS (3):
  • Servidor B (ID: 987654321)
    Status: Limpo

✗ DESATIVADOS (1):
  • Servidor C (ID: 456789123)
    Status: Banido
```

---

### `members`
Lista todos os membros da equipe, organizados por cargo.

```bash
X-TEAM@admin:~$ members
```

**Output**:
```
╔═══════════════════════════════════════╗
║  MEMBROS DA EQUIPE                    ║
╚═══════════════════════════════════════╝

👑 X LEADERS (2):
  • herobrisf
  • afinaleorafiks

🔍 X INVESTIGADORES (1):
  • maxsturmm

🎯 X AGENTS (2):
  • thisistrs_
  • baluleka

Total: 5 membros
```

---

### `about`
Mostra informações sobre o sistema X DOX e X TEAM.

```bash
X-TEAM@admin:~$ about
```

**Output**:
```
╔═══════════════════════════════════════╗
║  X TEAM - CYBER OPS                   ║
╚═══════════════════════════════════════╝

Sistema: X DOX Terminal v1.0.0
Desenvolvido por: X TEAM
Propósito: Monitoramento e análise de servidores

A X TEAM é uma organização focada em cibersegurança,
monitoramento digital e análise técnica.

✓ Sistema operacional
```

---

### `history`
Mostra o histórico de comandos executados na sessão atual.

```bash
X-TEAM@admin:~$ history
```

**Output**:
```
Histórico de comandos:
  1. status
  2. servers
  3. members
  4. history
```

---

## Recursos do Terminal

### Navegação no Histórico
- **Seta ↑**: Navega para o comando anterior no histórico
- **Seta ↓**: Navega para o próximo comando no histórico

### Execução de Comandos
- **Enter**: Executa o comando digitado
- **Botão "Executar"**: Alternativa ao Enter

### Auto-scroll
O terminal automaticamente rola para o final quando novos outputs são adicionados.

### Cores e Formatação
- **Verde (#00ff88)**: Comandos e títulos
- **Roxo (#a855f7)**: Prompts e destaques
- **Azul (#8be9fd)**: Informações gerais
- **Amarelo (#ffb86c)**: Avisos e contadores
- **Vermelho (#ff5555)**: Erros

---

## Exemplos de Uso

### Verificar status do sistema
```bash
X-TEAM@admin:~$ status
```

### Listar todos os servidores suspeitos
```bash
X-TEAM@admin:~$ servers
```

### Ver quantos membros tem cada cargo
```bash
X-TEAM@admin:~$ members
```

### Limpar terminal e começar de novo
```bash
X-TEAM@admin:~$ clear
X-TEAM@admin:~$ help
```

---

## Tratamento de Erros

### Comando não encontrado
```bash
X-TEAM@admin:~$ comando_invalido
✗ Comando não encontrado: comando_invalido
Digite 'help' para ver os comandos disponíveis.
```

### Erro ao buscar dados
```bash
X-TEAM@admin:~$ status
✗ Erro ao buscar status: Failed to fetch
```

---

## Notas Técnicas

- **API**: Conecta-se a `http://localhost:3000/api/data`
- **Dados**: Busca informações em tempo real do bot Discord
- **Cache**: Não utiliza cache, sempre busca dados atualizados
- **Persistência**: Histórico de comandos é mantido apenas durante a sessão

---

## Comandos Futuros (Planejados)

Possíveis comandos para implementação futura:

- `add-server <tipo> <id> <nome>` - Adicionar servidor via terminal
- `remove-server <id>` - Remover servidor
- `sync` - Forçar sincronização de membros
- `logs` - Ver logs de atividades
- `config` - Configurar sistema
- `backup` - Fazer backup dos dados
- `restore` - Restaurar backup
