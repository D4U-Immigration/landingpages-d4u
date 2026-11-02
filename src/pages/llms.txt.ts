// Gera /llms.txt a partir do registro de LPs (config/lps.js).
import type { APIRoute } from 'astro';
import { SITE_URL } from 'astro:env/server';
import { LPS } from '../config/lps.js';

const LABELS: Record<string, string> = { 'pt-br': 'Portuguese (pt-BR)', en: 'English (en)', es: 'Español (es)' };

export const GET: APIRoute = () => {
  const site = SITE_URL.replace(/\/$/, '');
  const sections = Object.entries(LPS).map(([slug, lp]) => {
    const links = lp.locales.map((l) => `- [${LABELS[l]}](${site}/${l}/${slug}/): ${lp.llms[l]}`);
    return `## ${lp.name}\n\n${links.join('\n')}`;
  });
  const body = `# D4U Immigration — Landing Pages

> D4U Immigration presta serviços de planejamento e suporte administrativo para processos de imigração para os Estados Unidos. Esta seção do site reúne landing pages informativas sobre categorias específicas de visto, com conteúdo dedicado sobre requisitos, elegibilidade e o processo de aplicação.

D4U Immigration is not a law firm. Legal aspects of each immigration case are handled by partner U.S.-licensed immigration attorneys.

${sections.join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
