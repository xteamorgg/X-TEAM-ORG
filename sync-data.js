// Script para sincronizar dados do localStorage com o GitHub
// Este script deve ser executado após adicionar membros/servidores

function exportAllData() {
  const data = {
    leaders_members: JSON.parse(localStorage.getItem('leaders_members') || '[]'),
    investigators_members: JSON.parse(localStorage.getItem('investigators_members') || '[]'),
    agent_girls_members: JSON.parse(localStorage.getItem('agent_girls_members') || '[]'),
    agents_members: JSON.parse(localStorage.getItem('agents_members') || '[]'),
    newbies_members: JSON.parse(localStorage.getItem('newbies_members') || '[]'),
    custom_roles: JSON.parse(localStorage.getItem('custom_roles') || '[]'),
    suspicious_servers: JSON.parse(localStorage.getItem('suspicious_servers') || '[]'),
    investigated_servers: JSON.parse(localStorage.getItem('investigated_servers') || '[]'),
    terminated_servers: JSON.parse(localStorage.getItem('terminated_servers') || '[]')
  };
  
  return data;
}

function showSyncButton() {
  // Verificar se já existe o botão
  if (document.getElementById('sync-data-btn')) return;
  
  // Criar botão flutuante de sincronização
  const button = document.createElement('button');
  button.id = 'sync-data-btn';
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
    <span style="margin-left: 8px;">Sincronizar Dados</span>
  `;
  
  button.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 15px 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    z-index: 9998;
    display: flex;
    align-items: center;
    font-family: 'Space Grotesk', sans-serif;
    transition: all 0.3s ease;
  `;
  
  button.onmouseover = () => {
    button.style.transform = 'translateY(-3px)';
    button.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
  };
  
  button.onmouseout = () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
  };
  
  button.onclick = () => {
    const data = exportAllData();
    showSyncModal(data);
  };
  
  document.body.appendChild(button);
}

function showSyncModal(data) {
  // Criar modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: #1a1a24;
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 16px;
    padding: 30px;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  const jsonString = JSON.stringify(data, null, 2);
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="color: #fff; margin: 0; font-size: 24px;">
        📤 Sincronizar Dados com GitHub
      </h2>
      <button onclick="this.closest('[style*=fixed]').remove()" style="background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; padding: 0; width: 32px; height: 32px;">×</button>
    </div>
    
    <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="color: rgba(255, 255, 255, 0.8); margin: 0; line-height: 1.6;">
        <strong style="color: #a855f7;">Passo 1:</strong> Copie o JSON abaixo (clique no botão "Copiar")<br>
        <strong style="color: #a855f7;">Passo 2:</strong> Abra o arquivo <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">members-data.json</code> no GitHub<br>
        <strong style="color: #a855f7;">Passo 3:</strong> Cole o JSON e faça commit<br>
        <strong style="color: #a855f7;">Passo 4:</strong> Aguarde 2-3 minutos para o deploy
      </p>
    </div>
    
    <div style="position: relative;">
      <pre id="json-output" style="background: #0a0a0f; border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; padding: 20px; color: #a855f7; font-family: 'JetBrains Mono', monospace; font-size: 12px; overflow-x: auto; max-height: 400px;">${jsonString}</pre>
      <button id="copy-json-btn" style="position: absolute; top: 10px; right: 10px; background: #a855f7; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-weight: 600; font-size: 14px;">
        Copiar JSON
      </button>
    </div>
    
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <a href="https://github.com/xteamorgg/X-TEAM-ORG/edit/main/members-data.json" target="_blank" style="flex: 1; background: #a855f7; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; text-align: center; font-weight: 600;">
        Abrir members-data.json no GitHub
      </a>
      <button onclick="this.closest('[style*=fixed]').remove()" style="background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        Fechar
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Adicionar funcionalidade de copiar
  document.getElementById('copy-json-btn').onclick = () => {
    const jsonOutput = document.getElementById('json-output');
    navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
      const btn = document.getElementById('copy-json-btn');
      btn.textContent = '✓ Copiado!';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent = 'Copiar JSON';
        btn.style.background = '#a855f7';
      }, 2000);
    });
  };
}

// Mostrar botão apenas na página de gerenciar
if (window.location.pathname.includes('gerenciar-servidores')) {
  window.addEventListener('load', () => {
    setTimeout(showSyncButton, 1000);
  });
}
