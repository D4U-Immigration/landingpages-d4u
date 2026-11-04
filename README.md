# Landing pages e ebooks D4U

Projeto [Astro](https://astro.build) que gera as landing pages (e, em seguida, os ebooks) da D4U Immigration como **HTML estático** — sem JavaScript de framework no navegador. A plataforma de webinars não faz parte deste repositório.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor local em `http://localhost:4321` (recarrega ao salvar) |
| `npm run build` | Gera o site final em `dist/` |
| `npm run preview` | Serve o `dist/` localmente para conferir o build |
| `npm run images` | Gera as versões menores das fotos (`-640`/`-960` e `hero-bg-800`) para o srcset |

## Estrutura de URLs

Todas as páginas seguem `/{idioma}/{nome-da-lp}/`:

- `/pt-br/eb2-niw/`, `/en/eb2-niw/`, `/es/eb2-niw/`
- `/pt-br/o1/`, `/en/o1/`, `/es/o1/`

A raiz (`/`) é a home: réplica da página "Link na Bio" da D4U (`WPShortcodes/link-bio`), com os mesmos textos. Os botões das LPs usam `lpUrl()` (`src/config/lps.js`): enquanto a LP não existe neste projeto, o botão mantém o link atual do site da D4U; quando a LP é registrada, a home passa a apontar para `/pt-br/{lp}/` sozinha (EB-2 NIW, EB-5, O-1, Indique um amigo e 4º Encontro de Mobilidade Global já estão ligados assim).

As URLs antigas (`/lp/{nome}/` e `/lp/{nome}/{idioma}/`) continuam funcionando: o build gera páginas de redirecionamento que preservam UTMs, `gclid`, `fbclid` e a âncora (`src/pages/lp/[...legacy].astro`). Elas ficam fora do sitemap e com `noindex`.

## Onde fica cada coisa

```
src/
  config/
    lps.js          registro das LPs: idiomas, form HubSpot por idioma, texto do llms.txt, redirects; lpUrl()
    locales.js      idiomas (lang, hreflang, og:locale)
    helpers.js      imageSet() e stripHtml()
  content/lps/{lp}/{idioma}.json   textos de cada LP (literais aos PDFs aprovados)
  layouts/BaseLayout.astro         <head> completo: tracking, SEO, Open Graph, hreflang, JSON-LD, fontes
  layouts/LpLayout.astro           BaseLayout + CSS dos componentes, barra de leitura e lp.js (usar nas LPs)
  components/       header, hero com formulário, checklist, vídeos, números da D4U, prêmios, FAQ, CTA final, rodapé, CTA fixo
  pages/index.astro                home (raiz): réplica da Link na Bio apontando para as LPs
  pages/[lang]/{lp}/index.astro    template de cada LP (gera os 3 idiomas)
  pages/lp/[...legacy].astro       redirects das URLs antigas
  pages/llms.txt.ts                gera /llms.txt a partir de config/lps.js
  styles/base.css, components.css  estilos compartilhados (base.css é importado por quem usa o BaseLayout, sempre primeiro)
  styles/home.css                  estilos da home
  scripts/base.js, lp.js           comportamentos (FAQ, CTA fixo, revelar ao rolar, contadores, vídeos…)
public/assets/
  lp/{lp}/          fotos de cada LP (WebP + JPG, Pexels) e imagem de compartilhamento
  home/             banners e selos da home
  shared/premios/   selos da faixa de prêmios
  fonts/            Montserrat (woff2)
scripts/images.mjs  gera as versões responsivas das fotos (npm run images)
```

O sitemap (`sitemap-index.xml`) é gerado automaticamente com `hreflang` entre os idiomas.

## Variáveis de ambiente

Copie `.env.example` para `.env` se precisar mudar algo. Todas têm valor padrão de produção e são validadas no build (`astro:env`).

| Variável | Uso |
| --- | --- |
| `SITE_URL` | Domínio (padrão `https://usa.d4uimmigration.com`) em canonical, hreflang, Open Graph, JSON-LD, sitemap e llms.txt |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_REGION` | Formulários HubSpot (embed v2) |
| `TRACKING_LOADER_URL` | Loader de tracking D4U (GA4 + `pmaTrack`) |

## Regras das páginas

- **Textos literais:** o conteúdo vem do PDF/briefing aprovado — não acrescentar nem remover informação.
- **Tracking:** o `BaseLayout` já inclui o loader, carregado na primeira interação ou 5 s após o carregamento (decisão de desempenho de 2026-11-02; o Lead do form não é afetado). Ele registra sozinho o Lead dos forms HubSpot, `tel:`, `mailto:` e WhatsApp — **não** chamar `pmaTrack('Lead')` manualmente nesses casos (duplica o lead).
- **Formulários:** IDs do catálogo oficial de forms HubSpot, em `src/config/lps.js`, sempre com embed v2 (`hbspt.forms.create`).
- **Nomes que não quebram linha:** nomes de visto e siglas (`EB-2 NIW`, `EE. UU.`) vão em `<span class="nowrap">`. Dentro de botões, `h1` em coluna e checklist, o texto inteiro precisa estar num único `<span>` (os componentes já fazem isso).
- **Imagens:** fotos do Pexels, em WebP + JPG, com `width`/`height` e `loading="lazy"` abaixo da dobra. Depois de adicionar fotos, rode `npm run images`.

## Desempenho (meta: 100 no PageSpeed)

- **Sem fonte nem CSS de terceiros:** a Montserrat é servida de `public/assets/fonts/` (licença SIL OFL), pré-carregada, com fallback de métricas ajustadas para o texto não pular. O CSS vai embutido no HTML.
- **Formulário HubSpot sob demanda:** o script do HubSpot só carrega na primeira interação (rolar, tocar, mover o mouse, teclar) ou se a URL vier com a âncora do form. O espaço do form fica reservado (`#hsForm` em `components.css`) — se um form novo tiver altura diferente, meça-o já carregado e passe `heights` ao `HeroForm` para não haver deslocamento de layout.
- **Hero:** foto leve (`hero-bg-800.webp`) no celular, pré-carregada por media query.
- **Tracking adiado:** o loader (GA4 + pixel da Meta) entra na primeira interação ou 5 s após o load. Visitas de menos de 5 s sem nenhum toque/rolagem podem não aparecer no GA4/Meta.
- **Resultado (Lighthouse):** 100/100/100/100 no celular e no desktop — EB-2 NIW e O-1 nos 3 idiomas e home.
- **No servidor de produção:** ativar gzip/brotli e cache longo (`Cache-Control: public, max-age=31536000, immutable`) para `/_astro/` e `/assets/`.

## Como adicionar uma LP

1. Coloque as fotos em `public/assets/lp/{nome}/`.
2. Crie `src/content/lps/{nome}/{idioma}.json` com os textos de cada idioma.
3. Registre a LP em `src/config/lps.js` (idiomas, forms, resumo do llms.txt; `legacy: true` só se ela já existia em `/lp/{nome}/`).
4. Crie `src/pages/[lang]/{nome}/index.astro` com o `LpLayout`, reaproveitando os componentes (use a EB-2 NIW como modelo).
5. `npm run build` e confira `dist/{idioma}/{nome}/`.

## Publicação

Domínio: **https://usa.d4uimmigration.com** (padrão de `SITE_URL`).

O repositório tem `Dockerfile` + `nginx.conf`: a imagem faz o build do Astro e serve o `dist/` com nginx, já com gzip, `Cache-Control` (1 ano em `/_astro/`, 30 dias em `/assets/`, `no-cache` no HTML), barra final nas URLs e 404. Para publicar numa plataforma com deploy pelo GitHub (ex.: Coolify), crie a aplicação a partir deste repositório, branch `main`, tipo **Dockerfile**, porta **80**, domínio `usa.d4uimmigration.com` — cada push no `main` gera um novo deploy.

Sem Docker: `npm run build` e envie o conteúdo de `dist/` para a raiz do servidor (configure gzip e cache no servidor).

As URLs antigas das LPs no domínio principal (`d4uimmigration.com/lp/...`) não passam por este projeto: quando cada LP for publicada aqui, o servidor do domínio principal precisa redirecionar `/lp/{lp}/…` para `https://usa.d4uimmigration.com/{idioma}/{lp}/` (mantendo a query string).
