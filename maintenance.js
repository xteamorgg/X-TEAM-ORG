// Sistema de Manutenção
(async function() {
  try {
    const response = await fetch('./maintenance.json?t=' + Date.now());
    const data = await response.json();
    
    if (data.maintenance) {
      showMaintenanceOverlay(data.message, data.duration);
    }
  } catch (error) {
    console.log('Maintenance check failed, continuing normally');
  }
})();

function showMaintenanceOverlay(message, duration) {
  // Criar overlay
  const overlay = document.createElement('div');
  overlay.id = 'maintenance-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 15, 0.98);
    backdrop-filter: blur(10px);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
  `;
  
  // Criar conteúdo
  const content = document.createElement('div');
  content.style.cssText = `
    text-align: center;
    padding: 40px;
    max-width: 500px;
  `;
  
  content.innerHTML = `
    <div style="margin-bottom: 30px;">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" style="animation: spin 2s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>
    <h1 style="color: #fff; font-size: 32px; margin-bottom: 15px; font-weight: 700;">
      🔧 Servidor em Atualização
    </h1>
    <p style="color: rgba(255, 255, 255, 0.7); font-size: 18px; margin-bottom: 20px;">
      ${message}
    </p>
    <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 20px; margin-top: 30px;">
      <div style="font-size: 48px; font-weight: 700; color: #a855f7; margin-bottom: 10px;" id="countdown">
        ${duration}
      </div>
      <div style="color: rgba(255, 255, 255, 0.5); font-size: 14px;">
        segundos restantes
      </div>
    </div>
    <div style="margin-top: 30px; color: rgba(255, 255, 255, 0.4); font-size: 14px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      A página será recarregada automaticamente
    </div>
  `;
  
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  
  // Adicionar animação de spin
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Countdown
  let timeLeft = duration;
  const countdownEl = document.getElementById('countdown');
  
  const interval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      // Recarregar página
      window.location.reload();
    }
  }, 1000);
  
  // Bloquear interação com a página
  overlay.addEventListener('click', (e) => e.stopPropagation());
  document.body.style.overflow = 'hidden';
}
