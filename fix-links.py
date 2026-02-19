#!/usr/bin/env python3
import re
import glob

# Arquivos HTML para atualizar
html_files = glob.glob('*.html')

# Substituições a fazer
replacements = [
    (r'href="/"', 'href="./index.html"'),
    (r'href="/suspeitos\.html"', 'href="./suspeitos.html"'),
    (r'href="/investigados\.html"', 'href="./investigados.html"'),
    (r'href="/desativados\.html"', 'href="./desativados.html"'),
    (r'href="/about\.html"', 'href="./about.html"'),
    (r'href="/xia\.html"', 'href="./xia.html"'),
    (r'href="/xdox\.html"', 'href="./xdox.html"'),
]

for html_file in html_files:
    print(f'Processando {html_file}...')
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Aplicar todas as substituições
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✓ {html_file} atualizado')

print('\n✅ Todos os arquivos HTML foram atualizados!')
