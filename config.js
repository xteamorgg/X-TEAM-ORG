// Configuração de URLs da API
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// URL do servidor de API em produção (Render)
const PRODUCTION_API_URL = 'https://x-team-org.onrender.com/api';

// URL do servidor de API (apenas para desenvolvimento local)
const LOCAL_API_URL = 'http://localhost:3000/api';

export const API_URL = isProduction ? PRODUCTION_API_URL : LOCAL_API_URL;

export const config = {
  apiUrl: API_URL,
  isProduction: isProduction,
  useGitHub: false // Agora usa API do Render, não GitHub
};
