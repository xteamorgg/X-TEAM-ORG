# X TEAM - Central de Operações

Site estático hospedado no GitHub Pages.

## 🚀 Deploy

O site foi construído com Vite e está pronto para deploy no GitHub Pages.

### Arquivos importantes:
- `dist/` - Arquivos buildados para produção
- `.nojekyll` - Desabilita Jekyll no GitHub Pages
- `site.png.png` - Logo/ícone do site

### Como funciona:
1. Site estático servido pelo GitHub Pages
2. Bot Discord rodando separadamente (precisa de hospedagem)
3. API do bot conectada via HTTP

## 📁 Estrutura

```
dist/
├── index.html          # Página principal
├── assets/
│   ├── index-*.js     # JavaScript bundle
│   ├── index-*.css    # CSS bundle
│   └── site-*.png     # Logo otimizado
└── .nojekyll         # Config GitHub Pages
```

## 🔗 Links

- **Site:** https://[seu-usuario].github.io/[repositorio]/
- **Bot:** Precisa ser hospedado separadamente
- **API:** http://localhost:3000 (desenvolvimento)

---

*Gerado automaticamente para deploy no GitHub Pages*
