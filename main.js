import './admin.js';

const API_URL = 'https://xteam-platform.onrender.com/api';

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

async function fetchData() {
  try {
    const response = await fetch(`${API_URL}/data`);
    const data = await response.json();
    
    if (data.discordInvite) {
      document.getElementById('discord-link').href = data.discordInvite;
    }
    
    // Update stats
    document.getElementById('stat-suspicious').textContent = data.suspiciousServers?.length || 0;
    document.getElementById('stat-investigated').textContent = data.investigatedServers?.length || 0;
    document.getElementById('stat-terminated').textContent = data.terminatedServers?.length || 0;
    
    // Count total members
    const totalMembers = (
      (data.members?.leaders?.length || 0) +
      (data.members?.investigators?.length || 0) +
      (data.members?.agents?.length || 0) +
      (data.members?.newbies?.length || 0)
    );
    document.getElementById('stat-members').textContent = totalMembers;
    
    // Update visitor count
    if (data.visitors) {
      updateVisitorCount(data.visitors.total);
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// Registrar visita ao carregar a página
registerVisit();

fetchData();
setInterval(fetchData, 30000);
