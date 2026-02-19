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

// Registrar visita ao carregar a página
registerVisit();

fetchData();
setInterval(fetchData, 30000);
