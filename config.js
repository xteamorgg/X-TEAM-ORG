// Configuração de URLs da API
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// URL do servidor de API em produção (Railway)
const PRODUCTION_API_URL = 'https://x-team-org-production.up.railway.app/api';

export const API_URL = isProduction ? PRODUCTION_API_URL : 'http://localhost:3000/api';

export const config = {
  apiUrl: API_URL,
  isProduction: isProduction
};
