// X DOX Terminal functionality
import './admin.js';
import { config } from './config.js';

const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalSubmit = document.getElementById('terminal-submit');

let commandHistory = [];
let historyIndex = -1;

// Registrar visita (sempre, mesmo IP)
async function registerVisit() {
  const visitRegistered = sessionStorage.getItem('visit_registered');
  
  if (visitRegistered) {
    fetchVisitorCount();
    return;
  }
  
  try {
    const response = await fetch(`${config.apiUrl}/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.ok) {
      const data = await response.json();
      updateVisitorCount(data.total);
      sessionStorage.setItem('visit_registered', 'true');
    }
  } catch (error) {
    console.error('Erro ao registrar visita:', error);
  }
}

// Buscar contador de visitantes sem registrar visita
async function fetchVisitorCount() {
  try {
    const response = await fetch(`${config.apiUrl}/data`);
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

  <span style="color: #a855f7;">help</span>           - Mostra esta mensagem de ajuda
  <span style="color: #a855f7;">clear</span>          - Limpa o terminal
  <span style="color: #a855f7;">status</span>         - Mostra status do sistema
  <span style="color: #a855f7;">servers</span>        - Lista todos os servidores monitorados
  <span style="color: #a855f7;">members</span>        - Lista membros da equipe
  <span style="color: #a855f7;">about</span>          - Informações sobre o sistema
  <span style="color: #a855f7;">history</span>        - Mostra histórico de comandos
  <span style="color: #a855f7;">dox <nome></span>     - Busca informações de uma pessoa na API
  <span style="color: #a855f7;">dox-list</span>       - Lista registros DOX em cache
  <span style="color: #a855f7;">dox-clear</span>      - Limpa cache de registros DOX
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
  },

  dox: async (args) => {
    if (!args || args.length === 0) {
      return `<span style="color: #ff5555;">✗ Uso: dox <nome_completo></span>\n<span style="color: #8be9fd;">Exemplo: dox João Silva Santos</span>`;
    }

    const nomeCompleto = args.join(' ');

    // Mostrar mensagem de busca
    addLine(`<span style="color: #8be9fd;">🔍 Buscando informações de: ${nomeCompleto}...</span>`, 'response');

    try {
      // IMPORTANTE: Substitua pela URL da sua API real de consulta
      const DOX_API_URL = 'https://sua-api-de-consulta.com/api/buscar';
      
      // Fazer requisição para a API de consulta
      const response = await fetch(`${DOX_API_URL}?nome=${encodeURIComponent(nomeCompleto)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('API de consulta não disponível');
      }

      const apiData = await response.json();

      // Verificar se encontrou dados
      if (!apiData || !apiData.cpf) {
        return `<span style="color: #ff5555;">✗ Nenhuma informação encontrada para: ${nomeCompleto}</span>\n<span style="color: #8be9fd;">A pessoa pode não estar cadastrada nos bancos de dados disponíveis.</span>`;
      }

      // Criar registro com os dados encontrados
      const doxRecord = {
        id: Date.now().toString(),
        nomeCompleto: apiData.nome || nomeCompleto,
        cpf: apiData.cpf || 'Não encontrado',
        nomeMae: apiData.nomeMae || 'Não encontrado',
        nomePai: apiData.nomePai || 'Não encontrado',
        dataNascimento: apiData.dataNascimento || 'Não encontrado',
        endereco: apiData.endereco || 'Não encontrado',
        telefone: apiData.telefone || 'Não encontrado',
        email: apiData.email || 'Não encontrado',
        rg: apiData.rg || 'Não encontrado',
        observacoes: apiData.observacoes || 'Nenhuma',
        buscadoEm: new Date().toISOString(),
        timestamp: Date.now()
      };

      // Salvar no cache local (opcional)
      const cachedRecords = JSON.parse(localStorage.getItem('doxCache') || '[]');
      const existingIndex = cachedRecords.findIndex(r => r.cpf === doxRecord.cpf);
      if (existingIndex !== -1) {
        cachedRecords[existingIndex] = doxRecord;
      } else {
        cachedRecords.push(doxRecord);
      }
      localStorage.setItem('doxCache', JSON.stringify(cachedRecords));

      const dataBusca = new Date(doxRecord.buscadoEm).toLocaleString('pt-BR');

      return `
<span style="color: #00ff88;">╔═══════════════════════════════════════════════════════════╗</span>
<span style="color: #00ff88;">║</span>  <span style="color: #a855f7;">REGISTRO DOX - INFORMAÇÕES PESSOAIS</span>                  <span style="color: #00ff88;">║</span>
<span style="color: #00ff88;">╚═══════════════════════════════════════════════════════════╝</span>

<span style="color: #8be9fd;">📋 DADOS PESSOAIS:</span>
  • Nome Completo: <span style="color: #f1fa8c;">${doxRecord.nomeCompleto}</span>
  • CPF: <span style="color: #f1fa8c;">${doxRecord.cpf}</span>
  • RG: <span style="color: #f1fa8c;">${doxRecord.rg}</span>
  • Data de Nascimento: <span style="color: #f1fa8c;">${doxRecord.dataNascimento}</span>

<span style="color: #8be9fd;">👨‍👩‍👦 FILIAÇÃO:</span>
  • Nome da Mãe: <span style="color: #f1fa8c;">${doxRecord.nomeMae}</span>
  • Nome do Pai: <span style="color: #f1fa8c;">${doxRecord.nomePai}</span>

<span style="color: #8be9fd;">📍 CONTATO:</span>
  • Endereço: <span style="color: #f1fa8c;">${doxRecord.endereco}</span>
  • Telefone: <span style="color: #f1fa8c;">${doxRecord.telefone}</span>
  • E-mail: <span style="color: #f1fa8c;">${doxRecord.email}</span>

<span style="color: #8be9fd;">📝 OBSERVAÇÕES:</span>
  ${doxRecord.observacoes}

<span style="color: #8be9fd;">ℹ️ METADADOS:</span>
  • ID do Registro: <span style="color: #a855f7;">${doxRecord.id}</span>
  • Data da Busca: <span style="color: #a855f7;">${dataBusca}</span>

<span style="color: #50fa7b;">✓ Informações obtidas com sucesso</span>
<span style="color: #ff5555;">⚠️ CONFIDENCIAL - USO RESTRITO</span>
`;
    } catch (error) {
      return `<span style="color: #ff5555;">✗ Erro ao buscar informações: ${error.message}</span>\n\n<span style="color: #8be9fd;">Possíveis causas:</span>\n  • API de consulta não configurada\n  • Servidor offline\n  • Pessoa não encontrada nos bancos de dados\n\n<span style="color: #ffb86c;">Configure a API no arquivo de configuração do sistema.</span>`;
    }
  },

  'dox-list': async () => {
    try {
      // Buscar do cache local
      const cachedRecords = JSON.parse(localStorage.getItem('doxCache') || '[]');

      if (cachedRecords.length === 0) {
        return `<span style="color: #ff5555;">✗ Nenhum registro DOX em cache.</span>\n<span style="color: #8be9fd;">Use 'dox <nome>' para buscar informações de uma pessoa.</span>`;
      }

      let output = `
<span style="color: #00ff88;">╔═══════════════════════════════════════════════════════════╗</span>
<span style="color: #00ff88;">║</span>  <span style="color: #a855f7;">REGISTROS DOX EM CACHE</span>                              <span style="color: #00ff88;">║</span>
<span style="color: #00ff88;">╚═══════════════════════════════════════════════════════════╝</span>

<span style="color: #8be9fd;">Total de registros: ${cachedRecords.length}</span>

`;

      cachedRecords.forEach((record, index) => {
        const dataBusca = new Date(record.buscadoEm).toLocaleDateString('pt-BR');
        output += `<span style="color: #a855f7;">${index + 1}.</span> ${record.nomeCompleto} - CPF: ${record.cpf} (${dataBusca})\n`;
      });

      output += `\n<span style="color: #8be9fd;">Use 'dox-clear' para limpar o cache.</span>`;

      return output;
    } catch (error) {
      return `<span style="color: #ff5555;">✗ Erro ao listar registros: ${error.message}</span>`;
    }
  },

  'dox-clear': () => {
    try {
      localStorage.removeItem('doxCache');
      return `<span style="color: #50fa7b;">✓ Cache de registros DOX limpo com sucesso.</span>`;
    } catch (error) {
      return `<span style="color: #ff5555;">✗ Erro ao limpar cache: ${error.message}</span>`;
    }
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

  // Parse command and arguments
  const parts = trimmedInput.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Execute command
  if (commands[command]) {
    try {
      const result = await commands[command](args);
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
