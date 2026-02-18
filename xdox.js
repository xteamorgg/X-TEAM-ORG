// X DOX Terminal functionality
import './admin.js';

const API_URL = 'http://localhost:3000';

const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalSubmit = document.getElementById('terminal-submit');

let commandHistory = [];
let historyIndex = -1;

// Registrar visita (sempre, mesmo IP)
async function registerVisit() {
  // Verificar se já registrou visita nesta sessão
  const visitRegistered = sessionStorage.getItem('visit_registered');
  
  if (visitRegistered) {
    // Já registrou nesta sessão, apenas atualizar contador
    fetchVisitorCount();
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.ok) {
      const data = await response.json();
      updateVisitorCount(data.total);
      // Marcar que já registrou visita nesta sessão
      sessionStorage.setItem('visit_registered', 'true');
    }
  } catch (error) {
    console.error('Erro ao registrar visita:', error);
  }
}

// Buscar contador de visitantes sem registrar visita
async function fetchVisitorCount() {
  try {
    const response = await fetch(`${API_URL}/api/data`);
    const data = await response.json();
    if (data.visitors) {
      updateVisitorCount(data.visitors.total);
    }
  } catch (error) {
    console.error('Erro ao buscar contador:', error);
  }
}

// Atualizar contador de visitantes
function updateVisitorCount(count) {
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    visitorCountEl.textContent = `${count} visitantes`;
  }
}

// Registrar visita ao carregar
registerVisit();

// Terminal commands
const commands = {
  help: () => {
    return `
<span style="color: #00ff88;">Comandos Disponíveis:</span>

  <span style="color: #a855f7;">help</span>        - Mostra esta mensagem de ajuda
  <span style="color: #a855f7;">clear</span>       - Limpa o terminal
  <span style="color: #a855f7;">status</span>      - Mostra status do sistema
  <span style="color: #a855f7;">servers</span>     - Lista todos os servidores monitorados
  <span style="color: #a855f7;">members</span>     - Lista membros da equipe
  <span style="color: #a855f7;">about</span>       - Informações sobre o sistema
  <span style="color: #a855f7;">history</span>     - Mostra histórico de comandos
`;
  },

  clear: () => {
    terminalOutput.innerHTML = '';
    return null;
  },

  status: async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`);
      const data = await response.json();

      const totalServers = 
        data.suspiciousServers.length +
        data.investigatedServers.length +
        data.terminatedServers.length;

      const totalMembers =
        data.members.leaders.length +
        data.members.investigators.length +
        data.members.agents.length +
        data.members.newbies.length;

      return `
<span style="color: #00ff88;">╔═══════════════════════════════════════╗</span>
<span style="color: #00ff88;">║</span>  <span style="color: #a855f7;">STATUS DO SISTEMA</span>                <span style="color: #00ff88;">║</span>
<span style="color: #00ff88;">╚═══════════════════════════════════════╝</span>

<span style="color: #8be9fd;">Servidores Monitorados:</span>
  • Suspeitos: <span style="color: #ffb86c;">${data.suspiciousServers.length}</span>
  • Investigados: <span style="color: #50fa7b;">${data.investigatedServers.length}</span>
  • Desativados: <span style="color: #ff5555;">${data.terminatedServers.length}</span>
  • Total: <span style="color: #a855f7;">${totalServers}</span>

<span style="color: #8be9fd;">Membros da Equipe:</span>
  • Leaders: <span style="color: #ffb86c;">${data.members.leaders.length}</span>
  • Investigadores: <span style="color: #50fa7b;">${data.members.investigators.length}</span>
  • Agents: <span style="color: #8be9fd;">${data.members.agents.length}</span>
  • Newbies: <span style="color: #f1fa8c;">${data.members.newbies.length}</span>
  • Total: <span style="color: #a855f7;">${totalMembers}</span>

<span style="color: #50fa7b;">✓ Sistema operacional</span>
`;
    } catch (error) {
      return `<span style="color: #ff5555;">✗ Erro ao buscar status: ${error.message}</span>`;
    }
  },

  servers: async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`);
      const data = await response.json();

      let output = `
<span style="color: #00ff88;">╔═══════════════════════════════════════╗</span>
<span style="color: #00ff88;">║</span>  <span style="color: #a855f7;">SERVIDORES MONITORADOS</span>           <span style="color: #00ff88;">║</span>
<span style="color: #00ff88;">╚═══════════════════════════════════════╝</span>
`;

      if (data.suspiciousServers.length > 0) {
        output += `\n<span style="color: #ffb86c;">🔍 SUSPEITOS (${data.suspiciousServers.length}):</span>\n`;
        data.suspiciousServers.forEach(server => {
          output += `  • ${server.name} (ID: ${server.id})\n    Status: ${server.status}\n`;
        });
      }

      if (data.investigatedServers.length > 0) {
        output += `\n<span style="color: #50fa7b;">✓ INVESTIGADOS (${data.investigatedServers.length}):</span>\n`;
        data.investigatedServers.forEach(server => {
          output += `  • ${server.name} (ID: ${server.id})\n    Status: ${server.status}\n`;
        });
      }

      if (data.terminatedServers.length > 0) {
        output += `\n<span style="color: #ff5555;">✗ DESATIVADOS (${data.terminatedServers.length}):</span>\n`;
        data.terminatedServers.forEach(server => {
          output += `  • ${server.name} (ID: ${server.id})\n    Status: ${server.status}\n`;
        });
      }

      if (data.suspiciousServers.length === 0 && 
          data.investigatedServers.length === 0 && 
          data.terminatedServers.length === 0) {
        output += `\n<span style="color: #8be9fd;">Nenhum servidor monitorado no momento.</span>`;
      }

      return output;
    } catch (error) {
      return `<span style="color: #ff5555;">✗ Erro ao buscar servidores: ${error.message}</span>`;
    }
  },

  members: async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`);
      const data = await response.json();

      let output = `
<span style="color: #00ff88;">╔═══════════════════════════════════════╗</span>
<span style="color: #00ff88;">║</span>  <span style="color: #a855f7;">MEMBROS DA EQUIPE</span>                <span style="color: #00ff88;">║</span>
<span style="color: #00ff88;">╚═══════════════════════════════════════╝</span>
`;

      if (data.members.leaders.length > 0) {
        output += `\n<span style="color: #ffb86c;">👑 X LEADERS (${data.members.leaders.length}):</span>\n`;
        data.members.leaders.forEach(member => {
          output += `  • ${member.nick}\n`;
        });
      }

      if (data.members.investigators.length > 0) {
        output += `\n<span style="color: #50fa7b;">🔍 X INVESTIGADORES (${data.members.investigators.length}):</span>\n`;
        data.members.investigators.forEach(member => {
          output += `  • ${member.nick}\n`;
        });
      }

      if (data.members.agents.length > 0) {
        output += `\n<span style="color: #8be9fd;">🎯 X AGENTS (${data.members.agents.length}):</span>\n`;
        data.members.agents.forEach(member => {
          output += `  • ${member.nick}\n`;
        });
      }

      if (data.members.newbies.length > 0) {
        output += `\n<span style="color: #f1fa8c;">⭐ X NEWBIES (${data.members.newbies.length}):</span>\n`;
        data.members.newbies.forEach(member => {
          output += `  • ${member.nick}\n`;
        });
      }

      const totalMembers =
        data.members.leaders.length +
        data.members.investigators.length +
        data.members.agents.length +
        data.members.newbies.length;

      output += `\n<span style="color: #a855f7;">Total: ${totalMembers} membros</span>`;

      return output;
    } catch (error) {
      return `<span style="color: #ff5555;">✗ Erro ao buscar membros: ${error.message}</span>`;
    }
  },

  about: () => {
    return `
<span style="color: #00ff88;">╔═══════════════════════════════════════╗</span>
<span style="color: #00ff88;">║</span>  <span style="color: #a855f7;">X TEAM - CYBER OPS</span>               <span style="color: #00ff88;">║</span>
<span style="color: #00ff88;">╚═══════════════════════════════════════╝</span>

<span style="color: #8be9fd;">Sistema:</span> X DOX Terminal v1.0.0
<span style="color: #8be9fd;">Desenvolvido por:</span> X TEAM
<span style="color: #8be9fd;">Propósito:</span> Monitoramento e análise de servidores

<span style="color: #a855f7;">A X TEAM é uma organização focada em cibersegurança,
monitoramento digital e análise técnica.</span>

<span style="color: #50fa7b;">✓ Sistema operacional</span>
`;
  },

  history: () => {
    if (commandHistory.length === 0) {
      return '<span style="color: #8be9fd;">Nenhum comando no histórico.</span>';
    }

    let output = '<span style="color: #00ff88;">Histórico de comandos:</span>\n';
    commandHistory.forEach((cmd, index) => {
      output += `  <span style="color: #a855f7;">${index + 1}.</span> ${cmd}\n`;
    });
    return output;
  }
};

// Add line to terminal
function addLine(content, type = 'response') {
  const line = document.createElement('div');
  line.className = `terminal-line terminal-${type}`;
  line.innerHTML = content;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Execute command
async function executeCommand(input) {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) return;

  // Add command to history
  commandHistory.push(trimmedInput);
  historyIndex = commandHistory.length;

  // Show command in terminal
  addLine(`<span class="terminal-prompt">X-TEAM@admin:~$</span> <span class="terminal-command">${trimmedInput}</span>`, 'command');

  // Parse command
  const parts = trimmedInput.split(' ');
  const command = parts[0].toLowerCase();

  // Execute command
  if (commands[command]) {
    try {
      const result = await commands[command]();
      if (result !== null) {
        addLine(result, 'response');
      }
    } catch (error) {
      addLine(`<span style="color: #ff5555;">✗ Erro ao executar comando: ${error.message}</span>`, 'error');
    }
  } else {
    addLine(`<span style="color: #ff5555;">✗ Comando não encontrado: ${command}</span>\n<span style="color: #8be9fd;">Digite 'help' para ver os comandos disponíveis.</span>`, 'error');
  }
}

// Event listeners
terminalSubmit.addEventListener('click', async () => {
  const input = terminalInput.value;
  await executeCommand(input);
  terminalInput.value = '';
});

terminalInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const input = terminalInput.value;
    await executeCommand(input);
    terminalInput.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      terminalInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      terminalInput.value = '';
    }
  }
});

// Focus input on load
terminalInput.focus();
