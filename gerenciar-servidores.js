import './admin.js';
import { config } from './config.js';

// Funções para gerenciar dados localmente
function getLocalServers(type) {
  const key = `${type}_servers`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveLocalServers(type, servers) {
  const key = `${type}_servers`;
  localStorage.setItem(key, JSON.stringify(servers));
}

function addLocalServer(type, server) {
  const servers = getLocalServers(type);
  servers.push(server);
  saveLocalServers(type, servers);
}

// Função para buscar informações do servidor pelo ID
async function fetchServerInfo(serverId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/widget.json`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name,
        icon: data.instant_invite ? `https://cdn.discordapp.com/icons/${serverId}/${data.id}.png` : null
      };
    }
  } catch (error) {
    console.error('Erro ao buscar info do servidor:', error);
  }
  
  return null;
}

// Função para mostrar mensagem de sucesso
function showSuccess(type, message) {
  const successEl = document.getElementById(`${type}-success`);
  successEl.textContent = message;
  successEl.style.display = 'block';
  
  setTimeout(() => {
    successEl.style.display = 'none';
  }, 5000);
}

// Função para mostrar mensagem de erro
function showError(type, message) {
  const errorEl = document.getElementById(`${type}-error`);
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
}

// Auto-preencher informações do servidor suspeito
document.getElementById('suspicious-id').addEventListener('blur', async (e) => {
  const serverId = e.target.value.trim();
  if (!serverId) return;
  
  const info = await fetchServerInfo(serverId);
  if (info) {
    document.getElementById('suspicious-name').value = info.name || 'Nome não disponível';
    document.getElementById('suspicious-icon').value = info.icon || '';
  }
});

// Auto-preencher informações do servidor investigado
document.getElementById('investigated-id').addEventListener('blur', async (e) => {
  const serverId = e.target.value.trim();
  if (!serverId) return;
  
  const info = await fetchServerInfo(serverId);
  if (info) {
    document.getElementById('investigated-name').value = info.name || 'Nome não disponível';
    document.getElementById('investigated-icon').value = info.icon || '';
  }
});

// Auto-preencher informações do servidor desativado
document.getElementById('terminated-id').addEventListener('blur', async (e) => {
  const serverId = e.target.value.trim();
  if (!serverId) return;
  
  const info = await fetchServerInfo(serverId);
  if (info) {
    document.getElementById('terminated-name').value = info.name || 'Nome não disponível';
    document.getElementById('terminated-icon').value = info.icon || '';
  }
});

// Adicionar servidor suspeito
document.getElementById('suspicious-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const serverId = document.getElementById('suspicious-id').value.trim();
  const serverName = document.getElementById('suspicious-name').value.trim();
  const status = document.getElementById('suspicious-status').value.trim();
  const icon = document.getElementById('suspicious-icon').value.trim();
  
  const server = {
    id: serverId,
    name: serverName,
    status: status,
    icon: icon || '🔍'
  };
  
  // Salvar localmente primeiro
  addLocalServer('suspicious', server);
  
  // Tentar sincronizar com API (opcional)
  try {
    await fetch(`${config.apiUrl}/servers/suspicious`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(server)
    });
  } catch (error) {
    console.log('API não disponível, servidor salvo localmente');
  }
  
  showSuccess('suspicious', `✅ Servidor "${serverName}" adicionado aos suspeitos!`);
  e.target.reset();
});

// Adicionar servidor investigado
document.getElementById('investigated-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const serverId = document.getElementById('investigated-id').value.trim();
  const serverName = document.getElementById('investigated-name').value.trim();
  const status = document.getElementById('investigated-status').value.trim();
  const icon = document.getElementById('investigated-icon').value.trim();
  
  const server = {
    id: serverId,
    name: serverName,
    status: status,
    icon: icon || '✅'
  };
  
  // Salvar localmente primeiro
  addLocalServer('investigated', server);
  
  // Tentar sincronizar com API (opcional)
  try {
    await fetch(`${config.apiUrl}/servers/investigated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(server)
    });
  } catch (error) {
    console.log('API não disponível, servidor salvo localmente');
  }
  
  showSuccess('investigated', `✅ Servidor "${serverName}" adicionado aos investigados!`);
  e.target.reset();
});

// Adicionar servidor desativado
document.getElementById('terminated-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const serverId = document.getElementById('terminated-id').value.trim();
  const serverName = document.getElementById('terminated-name').value.trim();
  const status = document.getElementById('terminated-status').value.trim();
  const icon = document.getElementById('terminated-icon').value.trim();
  
  const server = {
    id: serverId,
    name: serverName,
    status: status,
    icon: icon || '❌'
  };
  
  // Salvar localmente primeiro
  addLocalServer('terminated', server);
  
  // Tentar sincronizar com API (opcional)
  try {
    await fetch(`${config.apiUrl}/servers/terminated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(server)
    });
  } catch (error) {
    console.log('API não disponível, servidor salvo localmente');
  }
  
  showSuccess('terminated', `✅ Servidor "${serverName}" adicionado aos desativados!`);
  e.target.reset();
});

// ========== GERENCIAR MEMBROS ==========

// Adicionar Leader
document.getElementById('leaders-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nick = document.getElementById('leaders-nick').value.trim();
  const avatar = document.getElementById('leaders-avatar').value.trim();
  
  const member = {
    nick: nick,
    avatar: avatar,
    role: 'X LEADERS – FOUNDERS'
  };
  
  // Salvar localmente
  const members = getLocalServers('leaders_members');
  members.push(member);
  saveLocalServers('leaders_members', members);
  
  showSuccess('leaders', `✅ Membro "${nick}" adicionado aos Leaders!`);
  e.target.reset();
});

// Adicionar Investigador
document.getElementById('investigators-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nick = document.getElementById('investigators-nick').value.trim();
  const avatar = document.getElementById('investigators-avatar').value.trim();
  
  const member = {
    nick: nick,
    avatar: avatar,
    role: 'X INVESTIGADORES'
  };
  
  // Salvar localmente
  const members = getLocalServers('investigators_members');
  members.push(member);
  saveLocalServers('investigators_members', members);
  
  showSuccess('investigators', `✅ Membro "${nick}" adicionado aos Investigadores!`);
  e.target.reset();
});

// Adicionar Agent
document.getElementById('agents-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nick = document.getElementById('agents-nick').value.trim();
  const avatar = document.getElementById('agents-avatar').value.trim();
  
  const member = {
    nick: nick,
    avatar: avatar,
    role: 'X AGENTS'
  };
  
  // Salvar localmente
  const members = getLocalServers('agents_members');
  members.push(member);
  saveLocalServers('agents_members', members);
  
  showSuccess('agents', `✅ Membro "${nick}" adicionado aos Agents!`);
  e.target.reset();
});

// Adicionar Newbie
document.getElementById('newbies-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nick = document.getElementById('newbies-nick').value.trim();
  const avatar = document.getElementById('newbies-avatar').value.trim();
  
  const member = {
    nick: nick,
    avatar: avatar,
    role: 'X NEWBIES'
  };
  
  // Salvar localmente
  const members = getLocalServers('newbies_members');
  members.push(member);
  saveLocalServers('newbies_members', members);
  
  showSuccess('newbies', `✅ Membro "${nick}" adicionado aos Newbies!`);
  e.target.reset();
});

// ========== LISTAR E REMOVER ==========

function renderManageList() {
  // Renderizar servidores suspeitos
  const suspiciousServers = getLocalServers('suspicious');
  const suspiciousList = document.getElementById('list-suspicious-servers');
  if (suspiciousServers.length === 0) {
    suspiciousList.innerHTML = '<div class="empty-list">Nenhum servidor suspeito cadastrado</div>';
  } else {
    suspiciousList.innerHTML = suspiciousServers.map((server, index) => {
      const isUrl = server.icon && (server.icon.startsWith('http') || server.icon.startsWith('https'));
      const iconHtml = isUrl 
        ? `<img src="${server.icon}" alt="${server.name}" onerror="this.style.display='none'; this.parentElement.textContent='🔍';">`
        : server.icon || '🔍';
      
      return `
        <div class="manage-item">
          <div class="manage-item-info">
            <div class="manage-item-icon">${iconHtml}</div>
            <div class="manage-item-details">
              <div class="manage-item-name">${server.name}</div>
              <div class="manage-item-id">ID: ${server.id}</div>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem('suspicious', ${index})">Remover</button>
        </div>
      `;
    }).join('');
  }

  // Renderizar servidores investigados
  const investigatedServers = getLocalServers('investigated');
  const investigatedList = document.getElementById('list-investigated-servers');
  if (investigatedServers.length === 0) {
    investigatedList.innerHTML = '<div class="empty-list">Nenhum servidor investigado cadastrado</div>';
  } else {
    investigatedList.innerHTML = investigatedServers.map((server, index) => {
      const isUrl = server.icon && (server.icon.startsWith('http') || server.icon.startsWith('https'));
      const iconHtml = isUrl 
        ? `<img src="${server.icon}" alt="${server.name}" onerror="this.style.display='none'; this.parentElement.textContent='✅';">`
        : server.icon || '✅';
      
      return `
        <div class="manage-item">
          <div class="manage-item-info">
            <div class="manage-item-icon">${iconHtml}</div>
            <div class="manage-item-details">
              <div class="manage-item-name">${server.name}</div>
              <div class="manage-item-id">ID: ${server.id}</div>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem('investigated', ${index})">Remover</button>
        </div>
      `;
    }).join('');
  }

  // Renderizar servidores desativados
  const terminatedServers = getLocalServers('terminated');
  const terminatedList = document.getElementById('list-terminated-servers');
  if (terminatedServers.length === 0) {
    terminatedList.innerHTML = '<div class="empty-list">Nenhum servidor desativado cadastrado</div>';
  } else {
    terminatedList.innerHTML = terminatedServers.map((server, index) => {
      const isUrl = server.icon && (server.icon.startsWith('http') || server.icon.startsWith('https'));
      const iconHtml = isUrl 
        ? `<img src="${server.icon}" alt="${server.name}" onerror="this.style.display='none'; this.parentElement.textContent='❌';">`
        : server.icon || '❌';
      
      return `
        <div class="manage-item">
          <div class="manage-item-info">
            <div class="manage-item-icon">${iconHtml}</div>
            <div class="manage-item-details">
              <div class="manage-item-name">${server.name}</div>
              <div class="manage-item-id">ID: ${server.id}</div>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem('terminated', ${index})">Remover</button>
        </div>
      `;
    }).join('');
  }

  // Renderizar membros
  const allMembers = [
    ...getLocalServers('leaders_members').map(m => ({...m, type: 'leaders_members'})),
    ...getLocalServers('investigators_members').map(m => ({...m, type: 'investigators_members'})),
    ...getLocalServers('agents_members').map(m => ({...m, type: 'agents_members'})),
    ...getLocalServers('newbies_members').map(m => ({...m, type: 'newbies_members'}))
  ];
  
  const membersList = document.getElementById('list-members');
  if (allMembers.length === 0) {
    membersList.innerHTML = '<div class="empty-list">Nenhum membro cadastrado</div>';
  } else {
    membersList.innerHTML = allMembers.map((member, index) => {
      return `
        <div class="manage-item">
          <div class="manage-item-info">
            <div class="manage-item-icon">
              <img src="${member.avatar}" alt="${member.nick}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%231a1a24%22 width=%2248%22 height=%2248%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23a855f7%22 font-size=%2220%22%3E${member.nick.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="manage-item-details">
              <div class="manage-item-name">${member.nick}</div>
              <div class="manage-item-id">${member.role}</div>
            </div>
          </div>
          <button class="remove-btn" onclick="removeMember('${member.type}', '${member.nick}')">Remover</button>
        </div>
      `;
    }).join('');
  }
}

// Função global para remover servidor
window.removeItem = function(type, index) {
  if (confirm('Tem certeza que deseja remover este servidor?')) {
    const servers = getLocalServers(type);
    servers.splice(index, 1);
    saveLocalServers(type, servers);
    renderManageList();
  }
};

// Função global para remover membro
window.removeMember = function(type, nick) {
  if (confirm(`Tem certeza que deseja remover ${nick}?`)) {
    const members = getLocalServers(type);
    const filtered = members.filter(m => m.nick !== nick);
    saveLocalServers(type, filtered);
    renderManageList();
  }
};

// Renderizar lista ao carregar
renderManageList();

// Atualizar lista após adicionar
const originalShowSuccess = showSuccess;
showSuccess = function(type, message) {
  originalShowSuccess(type, message);
  renderManageList();
};
