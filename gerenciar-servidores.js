import './admin.js';
import { config } from './config.js';

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
  
  try {
    const response = await fetch(`${config.apiUrl}/servers/suspicious`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: serverId,
        name: serverName,
        status: status,
        icon: icon || '🔍'
      })
    });
    
    if (response.ok) {
      showSuccess('suspicious', `✅ Servidor "${serverName}" adicionado aos suspeitos!`);
      e.target.reset();
    } else {
      throw new Error('Erro ao adicionar servidor');
    }
  } catch (error) {
    showError('suspicious', `❌ Erro: ${error.message}`);
  }
});

// Adicionar servidor investigado
document.getElementById('investigated-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const serverId = document.getElementById('investigated-id').value.trim();
  const serverName = document.getElementById('investigated-name').value.trim();
  const status = document.getElementById('investigated-status').value.trim();
  const icon = document.getElementById('investigated-icon').value.trim();
  
  try {
    const response = await fetch(`${config.apiUrl}/servers/investigated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: serverId,
        name: serverName,
        status: status,
        icon: icon || '✅'
      })
    });
    
    if (response.ok) {
      showSuccess('investigated', `✅ Servidor "${serverName}" adicionado aos investigados!`);
      e.target.reset();
    } else {
      throw new Error('Erro ao adicionar servidor');
    }
  } catch (error) {
    showError('investigated', `❌ Erro: ${error.message}`);
  }
});

// Adicionar servidor desativado
document.getElementById('terminated-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const serverId = document.getElementById('terminated-id').value.trim();
  const serverName = document.getElementById('terminated-name').value.trim();
  const status = document.getElementById('terminated-status').value.trim();
  const icon = document.getElementById('terminated-icon').value.trim();
  
  try {
    const response = await fetch(`${config.apiUrl}/servers/terminated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: serverId,
        name: serverName,
        status: status,
        icon: icon || '❌'
      })
    });
    
    if (response.ok) {
      showSuccess('terminated', `✅ Servidor "${serverName}" adicionado aos desativados!`);
      e.target.reset();
    } else {
      throw new Error('Erro ao adicionar servidor');
    }
  } catch (error) {
    showError('terminated', `❌ Erro: ${error.message}`);
  }
});
