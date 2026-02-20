import './admin.js';
import { config } from './config.js';

// Funções para gerenciar dados localmente
function getLocalServers(type) {
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
  if (combined.length > 0 && combined[0].id) {
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
      const finalCount = Math.max(localCount, data.total || 0);
      localStorage.setItem('visitor_count', finalCount.toString());
      updateVisitorCount(finalCount);
      sessionStorage.setItem('visit_registered', 'true');
    } else {
      updateVisitorCount(localCount);
      sessionStorage.setItem('visit_registered', 'true');
    }
  } catch (error) {
    console.error('Erro ao registrar visita na API:', error);
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
      const finalCount = Math.max(localCount, data.visitors.total || 0);
      localStorage.setItem('visitor_count', finalCount.toString());
      updateVisitorCount(finalCount);
    } else {
      updateVisitorCount(localCount);
    }
  } catch (error) {
    console.error('Erro ao buscar contador:', error);
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

async function fetchData() {
  try {
    // Carregar dados do GitHub primeiro
    const githubData = await loadGitHubData();
    
    // Combinar com localStorage
    const suspiciousServers = combineData(githubData, 'suspicious_servers');
    const investigatedServers = combineData(githubData, 'investigated_servers');
    const terminatedServers = combineData(githubData, 'terminated_servers');
    
    const leadersMembers = combineData(githubData, 'leaders_members');
    const investigatorsMembers = combineData(githubData, 'investigators_members');
    const agentGirlsMembers = combineData(githubData, 'agent_girls_members');
    const agentsMembers = combineData(githubData, 'agents_members');
    const newbiesMembers = combineData(githubData, 'newbies_members');
    
    // Tentar buscar da API também
    try {
      const response = await fetch(config.apiUrl);
      const data = await response.json();
      
      if (data.discordInvite) {
        document.getElementById('discord-link').href = data.discordInvite;
      }
    } catch (error) {
      console.log('API não disponível, usando dados locais');
    }
    
    // Update stats com dados combinados
    document.getElementById('stat-suspicious').textContent = suspiciousServers.length;
    document.getElementById('stat-investigated').textContent = investigatedServers.length;
    document.getElementById('stat-terminated').textContent = terminatedServers.length;
    
    // Count total members
    const totalMembers = 
      leadersMembers.length +
      investigatorsMembers.length +
      agentGirlsMembers.length +
      agentsMembers.length +
      newbiesMembers.length;
    
    document.getElementById('stat-members').textContent = totalMembers;
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    
    // Fallback para dados locais apenas
    const suspiciousServers = getLocalServers('suspicious');
    const investigatedServers = getLocalServers('investigated');
    const terminatedServers = getLocalServers('terminated');
    
    document.getElementById('stat-suspicious').textContent = suspiciousServers.length;
    document.getElementById('stat-investigated').textContent = investigatedServers.length;
    document.getElementById('stat-terminated').textContent = terminatedServers.length;
    
    const totalMembers = 
      getLocalServers('leaders_members').length +
      getLocalServers('investigators_members').length +
      getLocalServers('agent_girls_members').length +
      getLocalServers('agents_members').length +
      getLocalServers('newbies_members').length;
    
    document.getElementById('stat-members').textContent = totalMembers;
  }
}

// Registrar visita ao carregar a página
registerVisit();

fetchData();
// Atualizar a cada 5 segundos para pegar mudanças do localStorage
setInterval(fetchData, 5000);
