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
  renderManageList();
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
  renderManageList();
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
  renderManageList();
});

// ========== GERENCIAR MEMBROS ==========

// Funções para gerenciar cargos personalizados
function getCustomRoles() {
  const data = localStorage.getItem('custom_roles');
  return data ? JSON.parse(data) : [];
}

function saveCustomRoles(roles) {
  localStorage.setItem('custom_roles', JSON.stringify(roles));
}

function updateRoleSelect() {
  const select = document.getElementById('custom-member-role');
  const customRoles = getCustomRoles();
  
  // Limpar opções personalizadas antigas
  const options = select.querySelectorAll('option[data-custom="true"]');
  options.forEach(opt => opt.remove());
  
  // Adicionar cargos personalizados (evitar duplicatas)
  customRoles.forEach(role => {
    // Verificar se já existe uma opção com este value
    const existingOption = select.querySelector(`option[value="${role.id}"]`);
    if (existingOption) return; // Pular se já existe
    
    const option = document.createElement('option');
    option.value = role.id;
    option.textContent = role.name;
    option.setAttribute('data-custom', 'true');
    select.appendChild(option);
  });
}

// Criar novo cargo
document.getElementById('role-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('role-name').value.trim();
  const color = document.getElementById('role-color').value;
  const order = parseInt(document.getElementById('role-order').value);
  
  const roleId = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_members';
  
  const customRoles = getCustomRoles();
  
  // Verificar se já existe
  if (customRoles.find(r => r.id === roleId)) {
    showError('role', '❌ Já existe um cargo com este nome!');
    return;
  }
  
  const newRole = {
    id: roleId,
    name: name,
    color: color,
    order: order
  };
  
  customRoles.push(newRole);
  saveCustomRoles(customRoles);
  updateRoleSelect();
  
  showSuccess('role', `✅ Cargo "${name}" criado com sucesso!`);
  e.target.reset();
  document.getElementById('role-color').value = '#a855f7';
  document.getElementById('role-order').value = '5';
  renderManageList();
});

// Adicionar membro a cargo personalizado
document.getElementById('custom-member-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const roleId = document.getElementById('custom-member-role').value;
  const nick = document.getElementById('custom-member-nick').value.trim();
  const avatar = document.getElementById('custom-member-avatar').value.trim();
  
  const select = document.getElementById('custom-member-role');
  const roleName = select.options[select.selectedIndex].text;
  
  const member = {
    nick: nick,
    avatar: avatar,
    role: roleName
  };
  
  // Salvar localmente
  const members = getLocalServers(roleId);
  members.push(member);
  saveLocalServers(roleId, members);
  
  showSuccess('custom-member', `✅ Membro "${nick}" adicionado ao cargo ${roleName}!`);
  e.target.reset();
  renderManageList();
});

// Inicializar select de cargos
updateRoleSelect();

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
  renderManageList();
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
  renderManageList();
});

// Adicionar Agent Girl
document.getElementById('agent-girls-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nick = document.getElementById('agent-girls-nick').value.trim();
  const avatar = document.getElementById('agent-girls-avatar').value.trim();
  
  const member = {
    nick: nick,
    avatar: avatar,
    role: 'X AGENT GIRLS'
  };
  
  // Salvar localmente
  const members = getLocalServers('agent_girls_members');
  members.push(member);
  saveLocalServers('agent_girls_members', members);
  
  showSuccess('agent-girls', `✅ Membro "${nick}" adicionado às Agent Girls!`);
  e.target.reset();
  renderManageList();
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
  renderManageList();
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
  renderManageList();
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
  const customRoles = getCustomRoles();
  const allMembers = [
    ...getLocalServers('leaders_members').map(m => ({...m, type: 'leaders_members', order: 1})),
    ...getLocalServers('investigators_members').map(m => ({...m, type: 'investigators_members', order: 2})),
    ...getLocalServers('agent_girls_members').map(m => ({...m, type: 'agent_girls_members', order: 2.5})),
    ...getLocalServers('agents_members').map(m => ({...m, type: 'agents_members', order: 3})),
    ...getLocalServers('newbies_members').map(m => ({...m, type: 'newbies_members', order: 4}))
  ];
  
  // Adicionar membros de cargos personalizados
  customRoles.forEach(role => {
    const roleMembers = getLocalServers(role.id);
    roleMembers.forEach(member => {
      allMembers.push({
        ...member,
        type: role.id,
        order: role.order,
        customColor: role.color
      });
    });
  });
  
  // Ordenar por ordem do cargo
  allMembers.sort((a, b) => a.order - b.order);
  
  const membersList = document.getElementById('list-members');
  if (allMembers.length === 0) {
    membersList.innerHTML = '<div class="empty-list">Nenhum membro cadastrado</div>';
  } else {
    membersList.innerHTML = allMembers.map((member) => {
      const roleStyle = member.customColor ? `style="color: ${member.customColor};"` : '';
      return `
        <div class="manage-item">
          <div class="manage-item-info">
            <div class="manage-item-icon">
              <img src="${member.avatar}" alt="${member.nick}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%231a1a24%22 width=%2248%22 height=%2248%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23a855f7%22 font-size=%2220%22%3E${member.nick.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="manage-item-details">
              <div class="manage-item-name">${member.nick}</div>
              <div class="manage-item-id" ${roleStyle}>${member.role}</div>
            </div>
          </div>
          <button class="remove-btn" onclick="removeMember('${member.type}', '${member.nick}')">Remover</button>
        </div>
      `;
    }).join('');
  }
  
  // Renderizar lista de cargos personalizados
  if (customRoles.length > 0) {
    const rolesHtml = customRoles.map(role => `
      <div class="manage-item">
        <div class="manage-item-info">
          <div class="manage-item-icon" style="background-color: ${role.color}20; border-color: ${role.color};">
            <svg viewBox="0 0 24 24" fill="none" stroke="${role.color}" stroke-width="2" style="width: 24px; height: 24px;">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="manage-item-details">
            <div class="manage-item-name" style="color: ${role.color};">${role.name}</div>
            <div class="manage-item-id">Ordem: ${role.order} • ${getLocalServers(role.id).length} membros</div>
          </div>
        </div>
        <button class="remove-btn" onclick="removeRole('${role.id}')">Remover Cargo</button>
      </div>
    `).join('');
    
    // Adicionar seção de cargos se não existir
    let rolesSection = document.getElementById('list-custom-roles');
    if (!rolesSection) {
      const container = document.createElement('div');
      container.className = 'form-container';
      container.innerHTML = `
        <div class="form-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h2>Cargos Personalizados</h2>
        </div>
        <div id="list-custom-roles" class="server-list-manage"></div>
      `;
      membersList.parentElement.insertBefore(container, membersList.parentElement);
      rolesSection = document.getElementById('list-custom-roles');
    }
    rolesSection.innerHTML = rolesHtml;
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

// Função global para remover cargo personalizado
window.removeRole = function(roleId) {
  const customRoles = getCustomRoles();
  const role = customRoles.find(r => r.id === roleId);
  
  if (!role) return;
  
  const members = getLocalServers(roleId);
  const memberCount = members.length;
  
  let confirmMsg = `Tem certeza que deseja remover o cargo "${role.name}"?`;
  if (memberCount > 0) {
    confirmMsg += `\n\nAVISO: Este cargo tem ${memberCount} membro(s). Todos serão removidos também!`;
  }
  
  if (confirm(confirmMsg)) {
    // Remover cargo
    const filtered = customRoles.filter(r => r.id !== roleId);
    saveCustomRoles(filtered);
    
    // Remover membros do cargo
    localStorage.removeItem(roleId);
    
    // Atualizar select
    updateRoleSelect();
    
    // Atualizar lista
    renderManageList();
  }
};

// Renderizar lista ao carregar
renderManageList();

// Recarregar lista a cada 2 segundos para pegar novos dados
setInterval(() => {
  renderManageList();
}, 2000);
