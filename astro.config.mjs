// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import { LOCALES, DEFAULT_LOCALE } from './src/config/locales.js';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const SITE_URL = env.SITE_URL || 'https://usa.d4uimmigration.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // URLs no formato /idioma/nome-da-lp/ (cada página vira uma pasta com index.html)
  trailingSlash: 'always',
  // CSS embutido no HTML: elimina a requisição que bloqueia a primeira pintura
  build: { format: 'directory', inlineStylesheets: 'always' },
  env: {
    schema: {
      SITE_URL: envField.string({ context: 'server', access: 'public', default: 'https://usa.d4uimmigration.com' }),
      HUBSPOT_PORTAL_ID: envField.string({ context: 'server', access: 'public', default: '44736563' }),
      HUBSPOT_REGION: envField.string({ context: 'server', access: 'public', default: 'na1' }),
      TRACKING_LOADER_URL: envField.string({ context: 'server', access: 'public', default: 'https://track.d4uimmigration.com/scripts/loader.js?t=7' }),
    },
  },
  integrations: [
    sitemap({
      // Páginas de redirecionamento das URLs antigas (/lp/...) ficam fora do sitemap
      // Fora do sitemap: redirects (/lp/…, /pt-br/, /en/, /es/), a 404 e as páginas de obrigado
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith('/lp/') && !/^\/[a-z-]+\/$/.test(path) && path !== '/404/' && !path.includes('-thank-you/');
      },
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(Object.entries(LOCALES).map(([k, v]) => [k, v.hreflang])),
      },
    }),
  ],
});
