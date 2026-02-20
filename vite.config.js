import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173
  },
  base: '/X-TEAM-ORG/',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        suspeitos: './suspeitos.html',
        investigados: './investigados.html',
        desativados: './desativados.html',
        about: './about.html',
        xia: './xia.html',
        xdox: './xdox.html',
        'gerenciar-servidores': './gerenciar-servidores.html'
      }
    }
  }
});
