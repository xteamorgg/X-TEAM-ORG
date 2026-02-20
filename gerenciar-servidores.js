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
