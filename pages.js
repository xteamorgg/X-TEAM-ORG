import './admin.js';

const API_URL = 'http://localhost:3000/api';

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
    const response = await fetch(`${API_URL}/visit`, {
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
    const response = await fetch(`${API_URL}/data`);
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

// Fetch and render data
async function fetchData() {
  try {
    const response = await fetch(`${API_URL}/data`);
    const data = await response.json();
    
    // Update Discord link
    if (data.discordInvite) {
      document.getElementById('discord-link').href = data.discordInvite;
    }
    
    // Render based on current page
    const path = window.location.pathname;
    
    if (path.includes('suspeitos')) {
      renderServers('suspicious-servers', data.suspiciousServers);
    } else if (path.includes('investigados')) {
      renderServers('investigated-servers', data.investigatedServers);
    } else if (path.includes('desativados')) {
      renderServers('terminated-servers', data.terminatedServers);
    } else if (path.includes('about')) {
      renderMembers('leaders', data.members.leaders);
      renderMembers('investigators', data.members.investigators);
      renderMembers('agents', data.members.agents);
      renderMembers('newbies', data.members.newbies);
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
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
    
    // Sempre mostrar placeholder para informações
    const onlineInfoHtml = `<div class="server-online-info" data-server-id="${server.id}">
      <span class="loading">Buscando informações...</span>
    </div>`;
    
    return `
      <div class="server-card" data-server-id="${server.id}">
        <div class="server-header">
          <div class="server-icon">${iconHtml}</div>
          <div class="server-info">
            <h3>${server.name}</h3>
            <div class="server-id">ID: ${server.id}</div>
            ${onlineInfoHtml}
          </div>
        </div>
        <div class="server-status">${server.status}</div>
      </div>
    `;
  }).join('');
  
  // Buscar informações para todos os servidores
  servers.forEach(server => {
    if (server.inviteCode) {
      // Prioridade 1: Usar convite se disponível
      fetchServerOnlineInfo(server.inviteCode, server.id);
    } else {
      // Prioridade 2: Tentar buscar por ID usando API da Loritta
      fetchServerInfoById(server.id);
    }
  });
}

// Buscar informações por ID do servidor (API Loritta)
async function fetchServerInfoById(serverId) {
  try {
    const response = await fetch(`${API_URL}/server-info-by-id/${serverId}`);
    
    if (!response.ok) {
      showNoInfoMessage(serverId);
      return;
    }
    
    const data = await response.json();
    updateServerInfo(serverId, data, 'loritta');
  } catch (error) {
    console.error('Erro ao buscar info do servidor por ID:', error);
    showNoInfoMessage(serverId);
  }
}

// Mostrar mensagem quando não há informações disponíveis
function showNoInfoMessage(serverId) {
  const element = document.querySelector(`[data-server-id="${serverId}"] .server-online-info`);
  
  if (!element) return;
  
  element.innerHTML = `
    <div class="no-info-message">
      <span class="no-info-icon">ℹ️</span>
      <span class="no-info-text">Sem informações disponíveis</span>
      <span class="no-info-hint">Adicione o bot Loritta ou use um código de convite</span>
    </div>
  `;
}

// Atualizar informações do servidor (unificado para invite e loritta)
function updateServerInfo(serverId, data, source) {
  const serverCard = document.querySelector(`[data-server-id="${serverId}"]`);
  const infoElement = document.querySelector(`[data-server-id="${serverId}"] .server-online-info`);
  
  if (!infoElement) return;
  
  // Adicionar banner se existir
  if (serverCard && data.banner) {
    const existingBanner = serverCard.querySelector('.server-banner-placeholder');
    if (!existingBanner) {
      const bannerHtml = `<div class="server-banner-placeholder">
        <img src="${data.banner}" alt="Banner" class="server-banner">
      </div>`;
      serverCard.insertAdjacentHTML('afterbegin', bannerHtml);
    }
  }
  
  // Montar HTML com informações
  let infoHtml = '';
  
  // Membros online e total (SEMPRE mostrar se disponível)
  if (data.memberCount > 0 || data.onlineCount > 0) {
    infoHtml += `
      <div class="online-stats">
        <span class="stat">
          <span class="stat-dot online"></span>
          ${data.onlineCount || 0} online
        </span>
        <span class="stat">
          <span class="stat-dot"></span>
          ${data.memberCount || 0} membros
        </span>
      </div>
    `;
  }
  
  // Tag do servidor (vanity URL)
  if (data.vanityUrlCode) {
    infoHtml += `
      <div class="server-vanity">
        <span class="vanity-label">Tag:</span>
        <span class="vanity-code">discord.gg/${data.vanityUrlCode}</span>
      </div>
    `;
  }
  
  // Dono do servidor (apenas Loritta)
  if (source === 'loritta' && data.owner) {
    const ownerTag = data.owner.discriminator && data.owner.discriminator !== '0'
      ? `${data.owner.username}#${data.owner.discriminator}`
      : `@${data.owner.username}`;
    
    infoHtml += `
      <div class="server-owner">
        <span class="owner-label">👑 Dono:</span>
        <span class="owner-name">${ownerTag}</span>
      </div>
    `;
  }
  
  // Quem criou o convite (apenas invite)
  if (source === 'invite' && data.inviter) {
    const inviterTag = data.inviter.discriminator !== '0' 
      ? `${data.inviter.username}#${data.inviter.discriminator}`
      : `@${data.inviter.username}`;
    
    infoHtml += `
      <div class="server-inviter">
        <span class="inviter-label">Convite por:</span>
        <span class="inviter-name">${inviterTag}</span>
      </div>
    `;
  }
  
  // Descrição
  if (data.description) {
    infoHtml += `
      <div class="server-description">
        ${data.description}
      </div>
    `;
  }
  
  // Badges de features
  if (data.features && data.features.length > 0) {
    const importantFeatures = data.features.filter(f => 
      ['VERIFIED', 'PARTNERED', 'COMMUNITY', 'DISCOVERABLE'].includes(f)
    );
    
    if (importantFeatures.length > 0) {
      infoHtml += `
        <div class="server-badges">
          ${importantFeatures.map(feature => {
            const badges = {
              'VERIFIED': '✓ Verificado',
              'PARTNERED': '🤝 Parceiro',
              'COMMUNITY': '👥 Comunidade',
              'DISCOVERABLE': '🔍 Descobrível'
            };
            return `<span class="server-badge">${badges[feature] || feature}</span>`;
          }).join('')}
        </div>
      `;
    }
  }
  
  infoElement.innerHTML = infoHtml;
}

// Buscar informações de membros online via invite
async function fetchServerOnlineInfo(inviteCode, serverId) {
  try {
    const response = await fetch(`${API_URL}/server-info/${inviteCode}`);
    
    if (!response.ok) {
      showNoInfoMessage(serverId);
      return;
    }
    
    const data = await response.json();
    updateServerInfo(serverId, data, 'invite');
  } catch (error) {
    console.error('Erro ao buscar info do servidor:', error);
    showNoInfoMessage(serverId);
  }
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

// Registrar visita ao carregar a página
registerVisit();

fetchData();
setInterval(fetchData, 30000);
