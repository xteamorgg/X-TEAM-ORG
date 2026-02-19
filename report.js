// Detectar ambiente (produção ou desenvolvimento)
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
// URL da API baseada no ambiente
const API_URL = isProduction ? 'https://xteam-platform.onrender.com/api' : 'http://localhost:3000/api';

// Verificar se usuário está logado
function isUserLoggedIn() {
  return localStorage.getItem('discord_token') !== null;
}

// Obter dados do usuário
function getUserData() {
  const userData = localStorage.getItem('discord_user');
  return userData ? JSON.parse(userData) : null;
}

// Abrir modal de denúncia
function openReportModal() {
  const modal = document.getElementById('report-modal');
  modal.style.display = 'flex';
  
  // Verificar se está logado
  if (!isUserLoggedIn()) {
    showLoginRequired();
  } else {
    showReportForm();
  }
}

// Fechar modal
function closeReportModal() {
  const modal = document.getElementById('report-modal');
  modal.style.display = 'none';
  
  // Limpar formulário
  document.getElementById('report-invite').value = '';
  document.getElementById('report-message').value = '';
  document.getElementById('report-error').style.display = 'none';
  document.getElementById('report-success').style.display = 'none';
}

// Mostrar que precisa fazer login
function showLoginRequired() {
  const modalContent = document.querySelector('.report-modal-content');
  modalContent.innerHTML = `
    <div class="report-header">
      <h2>🚨 Denunciar Servidor</h2>
      <button class="close-modal" onclick="closeReportModal()">×</button>
    </div>
    <div class="report-body">
      <div class="login-required">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h3>Login Necessário</h3>
        <p>Você precisa fazer login com Discord para enviar denúncias</p>
        <button class="discord-login-btn" onclick="loginWithDiscord()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Login com Discord
        </button>
      </div>
    </div>
  `;
}

// Mostrar formulário de denúncia
function showReportForm() {
  const user = getUserData();
  const modalContent = document.querySelector('.report-modal-content');
  
  modalContent.innerHTML = `
    <div class="report-header">
      <h2>🚨 Denunciar Servidor</h2>
      <button class="close-modal" onclick="closeReportModal()">×</button>
    </div>
    <div class="report-body">
      <div class="user-info">
        <img src="${user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="${user.username}">
        <span>${user.username}</span>
      </div>
      
      <form id="report-form" onsubmit="submitReport(event)">
        <div class="form-group">
          <label for="report-invite">Link do Convite do Servidor</label>
          <input 
            type="text" 
            id="report-invite" 
            placeholder="discord.gg/exemplo ou https://discord.gg/exemplo"
            required
          >
          <small>Cole o link de convite do servidor que deseja denunciar</small>
        </div>
        
        <div class="form-group">
          <label for="report-message">Motivo da Denúncia</label>
          <textarea 
            id="report-message" 
            rows="4" 
            placeholder="Descreva o motivo da denúncia..."
            required
          ></textarea>
        </div>
        
        <div id="report-error" class="report-message error" style="display: none;"></div>
        <div id="report-success" class="report-message success" style="display: none;"></div>
        
        <button type="submit" class="submit-report-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
          Enviar Denúncia
        </button>
      </form>
    </div>
  `;
}

// Fazer login com Discord
function loginWithDiscord() {
  window.location.href = `${API_URL}/auth/discord`;
}

// Enviar denúncia
async function submitReport(event) {
  event.preventDefault();
  
  const inviteInput = document.getElementById('report-invite').value.trim();
  const message = document.getElementById('report-message').value.trim();
  const errorDiv = document.getElementById('report-error');
  const successDiv = document.getElementById('report-success');
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  // Limpar mensagens anteriores
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  
  // Extrair código do convite
  let inviteCode = inviteInput;
  if (inviteInput.includes('discord.gg/')) {
    inviteCode = inviteInput.split('discord.gg/')[1].split(/[?&#]/)[0];
  } else if (inviteInput.includes('discord.com/invite/')) {
    inviteCode = inviteInput.split('discord.com/invite/')[1].split(/[?&#]/)[0];
  }
  
  if (!inviteCode) {
    errorDiv.textContent = '❌ Link de convite inválido';
    errorDiv.style.display = 'block';
    return;
  }
  
  // Desabilitar botão
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';
  
  try {
    const user = getUserData();
    const response = await fetch(`${API_URL}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inviteCode,
        message,
        reporter: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator
        }
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      successDiv.textContent = '✅ Denúncia enviada com sucesso! Os administradores foram notificados.';
      successDiv.style.display = 'block';
      
      // Limpar formulário
      document.getElementById('report-invite').value = '';
      document.getElementById('report-message').value = '';
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        closeReportModal();
      }, 3000);
    } else {
      errorDiv.textContent = `❌ ${data.error || 'Erro ao enviar denúncia'}`;
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao enviar denúncia:', error);
    errorDiv.textContent = '❌ Erro ao enviar denúncia. Tente novamente.';
    errorDiv.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
      Enviar Denúncia
    `;
  }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById('report-modal');
  if (event.target === modal) {
    closeReportModal();
  }
}
