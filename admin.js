// Admin authentication and permission checking
const API_URL = 'http://localhost:3000';
const MAIN_GUILD_ID = '1473718425749688442';

// Cargos que têm acesso às páginas admin
const ADMIN_ROLE_IDS = [
  '1473718484125880465', // X LEADERS
  '1473791022550089864', // Cargo 2
  '1473729894356877312', // X INVESTIGADORES
  '1473791113650372618'  // Cargo 4
];

// Check if user is logged in
function getLoggedInUser() {
  const userData = localStorage.getItem('discord_user');
  const token = localStorage.getItem('discord_token');
  
  if (userData && token) {
    return {
      user: JSON.parse(userData),
      token: token
    };
  }
  return null;
}

// Check if user has admin permissions in the Discord server
async function checkAdminPermissions() {
  const auth = getLoggedInUser();
  
  if (!auth) {
    return false;
  }

  try {
    // Buscar os cargos do usuário no servidor principal
    const response = await fetch(`https://discord.com/api/users/@me/guilds/${MAIN_GUILD_ID}/member`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (!response.ok) {
      // Se não conseguir buscar do endpoint específico, tenta verificar permissões gerais
      const guildsResponse = await fetch(`https://discord.com/api/users/@me/guilds`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!guildsResponse.ok) {
        return false;
      }

      const guilds = await guildsResponse.json();
      const mainGuild = guilds.find(g => g.id === MAIN_GUILD_ID);
      
      if (!mainGuild) {
        return false;
      }

      // Se tem permissão de administrador, libera acesso
      const hasAdmin = (mainGuild.permissions & 0x8) === 0x8;
      return hasAdmin;
    }

    const memberData = await response.json();
    
    // Verifica se o usuário tem algum dos cargos permitidos
    const hasAllowedRole = memberData.roles.some(roleId => ADMIN_ROLE_IDS.includes(roleId));
    
    return hasAllowedRole;
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return false;
  }
}

// Show or hide admin navigation links
async function updateAdminUI() {
  const isAdmin = await checkAdminPermissions();
  const adminLinks = document.querySelectorAll('.admin-only');
  
  adminLinks.forEach(link => {
    if (isAdmin) {
      link.style.display = '';
    } else {
      link.style.display = 'none';
    }
  });

  // If on admin page and not admin, redirect to home
  const currentPath = window.location.pathname;
  if ((currentPath.includes('xia.html') || currentPath.includes('xdox.html')) && !isAdmin) {
    alert('⚠️ Acesso negado. Esta página é restrita a administradores.');
    window.location.href = '/';
  }
}

// Handle Discord OAuth callback
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userEncoded = urlParams.get('user');

  if (token && userEncoded) {
    try {
      const user = JSON.parse(decodeURIComponent(userEncoded));
      localStorage.setItem('discord_token', token);
      localStorage.setItem('discord_user', JSON.stringify(user));
      
      // Remove query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Update UI
      updateUserUI(user);
      updateAdminUI();
    } catch (error) {
      console.error('Error parsing OAuth data:', error);
    }
  }
}

// Update user UI (login button / profile)
function updateUserUI(user) {
  const loginBtn = document.getElementById('login-btn');
  const userProfile = document.getElementById('user-profile');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');

  if (user) {
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
    userName.textContent = user.username;
  } else {
    loginBtn.style.display = 'flex';
    userProfile.style.display = 'none';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Handle OAuth callback
  handleOAuthCallback();

  // Check if user is already logged in
  const auth = getLoggedInUser();
  if (auth) {
    updateUserUI(auth.user);
    await updateAdminUI();
  } else {
    // Hide admin links if not logged in
    const adminLinks = document.querySelectorAll('.admin-only');
    adminLinks.forEach(link => link.style.display = 'none');
  }

  // Login button
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      window.location.href = `${API_URL}/api/auth/discord`;
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('discord_token');
      localStorage.removeItem('discord_user');
      window.location.reload();
    });
  }

  // Load Discord invite link
  try {
    const response = await fetch(`${API_URL}/api/data`);
    const data = await response.json();
    
    const discordLink = document.getElementById('discord-link');
    if (discordLink && data.discordInvite) {
      discordLink.href = data.discordInvite;
    }
  } catch (error) {
    console.error('Error loading Discord invite:', error);
  }
});
