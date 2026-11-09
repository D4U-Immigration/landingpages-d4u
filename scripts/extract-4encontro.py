"""Extrai a LP do 4º Encontro (lp/4encontrodemobilidade/index.html) para
landingpages-d4u/src/content/lps/4encontrodemobilidade/pt-br.json, com as otimizações da migração.
Uso (na raiz do repo): python scripts/extract-4encontro.py ..   — <WPShortcodes> = pasta que contém lp/ e landingpages-d4u/.
Rodar de novo sempre que a LP original mudar; o CSS (styles/4encontrodemobilidade.css) é o page.css
original + os ajustes marcados no fim do arquivo e o contraste do cargo dos palestrantes.
Só usa a biblioteca padrão do Python."""
import io, json, re, sys, os, shutil

root = sys.argv[1]
SRC = f'{root}/lp/4encontrodemobilidade'
OUT = f'{root}/landingpages-d4u/src/content/lps/4encontrodemobilidade/pt-br.json'
IMG_DST = f'{root}/landingpages-d4u/public/assets/lp/4encontrodemobilidade'
A = '/assets/lp/4encontrodemobilidade/'

s = io.open(f'{SRC}/index.html', encoding='utf-8').read().replace('\r', '')
b = s[s.index('<body>') + len('<body>'):s.index('<script src="assets/js/main.js')].strip('\n')

# imagens usadas: copia para public/
used = sorted(set(re.findall(r'(?:src|srcset)="images/([^"?\s]+)', b)))
for f in used:
    shutil.copy2(f'{SRC}/images/{f}', f'{IMG_DST}/{f}')

b = re.sub(r'(src|srcset)="images/', rf'\1="{A}', b)
b = re.sub(r'(\.(?:png|jpg|webp))\?v=\d+"', r'\1"', b)

# 1) PNGs decorativos e logo -> WebP (mesmo desenho, mais leve) — só se o WebP existir
for f in ['logo-4encontro', 'linhas-azul-2', 'linhas-vermelhas', 'linhas-amarelas', 'linhas-verdes', 'linhas-verdes-2', 'x-amarelo', 'x-vermelho', 'x-branco']:
    if os.path.exists(f'{IMG_DST}/{f}.webp'):
        b = b.replace(f'src="{A}{f}.png"', f'src="{A}{f}.webp"')
# 2) mosaico do hero (cards de ~160 px): versão de 320 px
def mosaic(m):
    name = m.group(2)
    return m.group(1) + (f'{name}-320.webp"' if os.path.exists(f'{IMG_DST}/{name}-320.webp') else f'{name}.webp"')
b = re.sub(r'(<picture class="cut-card-sm"><source srcset="' + re.escape(A) + r')([a-z0-9-]+)\.webp"', mosaic, b)
# 3) capa do vídeo: 640 px no celular, original no desktop
b = b.replace(f'<source srcset="{A}video-capa.webp" type="image/webp">',
              f'<source srcset="{A}video-capa-640.webp 640w, {A}video-capa.webp 1065w" sizes="(min-width: 900px) 900px, 100vw" type="image/webp">')
# 4) imagens depois do hero: carregamento sob demanda
i = b.index('id="hero"'); j = b.index('</section>', i)
b = b[:j] + re.sub(r'<img (?![^>]*loading=)', '<img loading="lazy" ', b[j:])
# 5) mosaico: 1ª foto de cada coluna com prioridade alta, cópias do loop com prioridade baixa
def track(m):
    t = m.group(0)
    imgs = list(re.finditer(r'<img decoding="async"', t))
    half = len(imgs) // 2
    out, last = [], 0
    for k, im in enumerate(imgs):
        out.append(t[last:im.start()])
        pr = ' fetchpriority="high"' if k == 0 else (' fetchpriority="low"' if k >= half else '')
        out.append('<img decoding="async"' + pr)
        last = im.end()
    out.append(t[last:])
    return ''.join(out)
b = re.sub(r'<div class="photo-marquee__track">.*?</div>', track, b, flags=re.S)
b = b.replace('<img decoding="async" class="hero__art', '<img decoding="async" fetchpriority="low" class="hero__art')

ld = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S).group(1))
meta = {
    'title': re.search(r'<title>(.*?)</title>', s).group(1),
    'description': re.search(r'<meta name="description" content="([^"]*)"', s).group(1),
    'ogTitle': re.search(r'<meta property="og:title" content="([^"]*)"', s).group(1),
    'ogDescription': re.search(r'<meta property="og:description" content="([^"]*)"', s).group(1),
}
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(json.dumps({'meta': meta, 'jsonLd': ld, 'body': b}, ensure_ascii=False, indent=2) + '\n')
print('ok', len(b), 'imagens:', used)
