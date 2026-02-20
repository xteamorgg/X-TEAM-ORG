import './admin.js';
import { config } from './config.js';

// Funções para gerenciar dados localmente
function getLocalServers(type) {
  // Para membros, não adiciona _servers
  const key = type.includes('_members') || type.includes('_roles') ? type : `${type}_servers`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Carregar dados do arquivo JSON do GitHub
async function loadGitHubData() {
  try {
    const response = await fetch('./members-data.json?t=' + Date.now());
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Usando apenas dados locais');
  }
  return null;
}

// Combinar dados do GitHub com localStorage
function combineData(githubData, localKey) {
  const localData = getLocalServers(localKey);
  if (!githubData) return localData;
  
  const githubArray = githubData[localKey] || [];
  
  // Combinar e remover duplicatas
  const combined = [...githubArray, ...localData];
  
  // Para membros, remover duplicatas por nick
  if (localKey.includes('_members')) {
    return combined.filter((item, index, self) =>
      index === self.findIndex((t) => t.nick === item.nick)
    );
  }
  
  // Para servidores, remover duplicatas por ID
  if (item => item.id) {
    return combined.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
  }
  
  return combined;
}

// Registrar visita (sempre, mesmo IP)
async function registerVisit() {
  // Verificar se já registrou visita nesta sessão
  const visitRegistered = sessionStorage.getItem('visit_registered');
  
  if (visitRegistered) {
    fetchVisitorCount();
    return;
  }
  
  // Incrementar contador local
  let localCount = parseInt(localStorage.getItem('visitor_count') || '0');
  localCount++;
  localStorage.setItem('visitor_count', localCount.toString());
  
  // Tentar registrar na API também
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
      // Usar o maior valor entre local e API
      const finalCount = Math.max(localCount, data.total || 0);
      localStorage.setItem('visitor_count', finalCount.toString());
      updateVisitorCount(finalCount);
      sessionStorage.setItem('visit_registered', 'true');
    } else {
      // Se API falhar, usar contador local
      updateVisitorCount(localCount);
      sessionStorage.setItem('visit_registered', 'true');
    }
  } catch (error) {
    console.error('Erro ao registrar visita na API:', error);
    // Se API falhar, usar contador local
    updateVisitorCount(localCount);
    sessionStorage.setItem('visit_registered', 'true');
  }
}

// Buscar contador de visitantes sem registrar visita
async function fetchVisitorCount() {
  const localCount = parseInt(localStorage.getItem('visitor_count') || '0');
  
  try {
    const response = await fetch(`${config.apiUrl}/data`);
    const data = await response.json();
    if (data.visitors) {
      // Usar o maior valor entre local e API
      const finalCount = Math.max(localCount, data.visitors.total || 0);
      localStorage.setItem('visitor_count', finalCount.toString());
      updateVisitorCount(finalCount);
    } else {
      updateVisitorCount(localCount);
    }
  } catch (error) {
    console.error('Erro ao buscar contador:', error);
    // Se API falhar, usar contador local
    updateVisitorCount(localCount);
  }
}

// Atualizar contador de visitantes
function updateVisitorCount(count) {
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    visitorCountEl.textContent = `${count} visitantes`;
  }
}

// Fetch and render data
async function fetchData() {
  try {
    // Carregar dados do GitHub primeiro
    const githubData = await loadGitHubData();
    
    // Tentar buscar da API
    const response = await fetch(config.apiUrl);
    const data = await response.json();
    
    // Update Discord link
    if (data.discordInvite) {
      const discordLink = document.getElementById('discord-link');
      if (discordLink) {
        discordLink.href = data.discordInvite;
      }
    }
    
    // Render based on current page
    const path = window.location.pathname;
    
    if (path.includes('suspeitos')) {
      const servers = combineData(githubData, 'suspicious_servers');
      renderServers('suspicious-servers', servers);
    } else if (path.includes('investigados')) {
      const servers = combineData(githubData, 'investigated_servers');
      renderServers('investigated-servers', servers);
    } else if (path.includes('desativados')) {
      const servers = combineData(githubData, 'terminated_servers');
      renderServers('terminated-servers', servers);
    } else if (path.includes('about')) {
      // Carregar membros do GitHub + localStorage
      renderMembers('leaders', combineData(githubData, 'leaders_members'));
      renderMembers('investigators', combineData(githubData, 'investigators_members'));
      renderMembers('agent-girls', combineData(githubData, 'agent_girls_members'));
      renderMembers('agents', combineData(githubData, 'agents_members'));
      renderMembers('newbies', combineData(githubData, 'newbies_members'));
      
      // Renderizar cargos personalizados
      renderCustomRoles();
    }
  } catch (error) {
    console.error('Erro ao carregar dados da API, usando dados locais:', error);
    
    // Se API falhar, usar apenas dados locais
    const path = window.location.pathname;
    
    if (path.includes('suspeitos')) {
      renderServers('suspicious-servers', getLocalServers('suspicious'));
    } else if (path.includes('investigados')) {
      renderServers('investigated-servers', getLocalServers('investigated'));
    } else if (path.includes('desativados')) {
      renderServers('terminated-servers', getLocalServers('terminated'));
    } else if (path.includes('about')) {
      renderMembers('leaders', getLocalServers('leaders_members'));
      renderMembers('investigators', getLocalServers('investigators_members'));
      renderMembers('agent-girls', getLocalServers('agent_girls_members'));
      renderMembers('agents', getLocalServers('agents_members'));
      renderMembers('newbies', getLocalServers('newbies_members'));
    }
  }
}

function renderServers(containerId, servers) {
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  if (!servers || servers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Nenhum servidor registrado nesta categoria</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = servers.map(server => {
    const isUrl = server.icon && (server.icon.startsWith('http') || server.icon.startsWith('https'));
    const iconHtml = isUrl 
      ? `<img src="${server.icon}" alt="${server.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" onerror="this.style.display='none'; this.parentElement.textContent='🔍';">`
      : server.icon || '🔍';
    
    return `
      <div class="server-card" data-server-id="${server.id}">
        <div class="server-header">
          <div class="server-icon">${iconHtml}</div>
          <div class="server-info">
            <h3>${server.name}</h3>
            <div class="server-id">ID: ${server.id}</div>
          </div>
        </div>
        <div class="server-status">${server.status}</div>
      </div>
    `;
  }).join('');
}



function renderMembers(containerId, members) {
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  if (!members || members.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum membro neste cargo</p></div>';
    return;
  }
  
  container.innerHTML = members.map(member => `
    <div class="member-card">
      <img src="${member.avatar}" alt="${member.nick}" class="member-avatar" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect fill=%22%231a1a24%22 width=%2256%22 height=%2256%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23a855f7%22 font-size=%2224%22%3E${member.nick.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'">
      <div class="member-info">
        <div class="member-nick">${member.nick}</div>
        <div class="member-role">${member.role}</div>
      </div>
    </div>
  `).join('');
}

// Renderizar cargos personalizados
function renderCustomRoles() {
  const customRoles = JSON.parse(localStorage.getItem('custom_roles') || '[]');
  
  if (customRoles.length === 0) return;
  
  // Ordenar por ordem
  customRoles.sort((a, b) => a.order - b.order);
  
  // Encontrar onde inserir (após newbies)
  const newbiesSection = document.querySelector('.team-section:last-of-type');
  if (!newbiesSection) return;
  
  customRoles.forEach(role => {
    const members = getLocalServers(role.id);
    
    if (members.length === 0) return;
    
    // Criar seção do cargo
    const section = document.createElement('div');
    section.className = 'team-section';
    section.innerHTML = `
      <h2 class="section-title" style="color: ${role.color};">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${role.color}" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        ${role.name}
      </h2>
      <div class="members-grid" id="custom-${role.id}"></div>
    `;
    
    newbiesSection.parentNode.insertBefore(section, newbiesSection.nextSibling);
    
    // Renderizar membros
    const container = document.getElementById(`custom-${role.id}`);
    container.innerHTML = members.map(member => `
      <div class="member-card">
        <img src="${member.avatar}" alt="${member.nick}" class="member-avatar" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect fill=%22%231a1a24%22 width=%2256%22 height=%2256%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22${role.color}%22 font-size=%2224%22%3E${member.nick.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E'">
        <div class="member-info">
          <div class="member-nick">${member.nick}</div>
          <div class="member-role" style="color: ${role.color};">${member.role}</div>
        </div>
      </div>
    `).join('');
  });
}

// Registrar visita ao carregar a página
registerVisit();

fetchData();
setInterval(fetchData, 30000);
