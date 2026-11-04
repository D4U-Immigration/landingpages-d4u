// Registro das LPs publicadas: idiomas disponíveis, formulário HubSpot por idioma
// (catálogo oficial de forms — embed v2) e o resumo usado no /llms.txt.

export const LPS = {
  'eb2-niw': {
    name: 'Visto EB-2 NIW',
    locales: ['pt-br', 'en', 'es'],
    forms: {
      'pt-br': '91794fe9-8c62-438f-b134-bbc3bf4e65d0',
      en: 'd5e3a02c-fe22-4406-b8a1-8a82243053e1',
      es: '7df2971e-59fe-4e84-888b-d12d1d1e39d4',
    },
    // URLs antigas (estrutura /lp/{nome}/{idioma}/) que redirecionam para a nova
    legacy: true,
    llms: {
      'pt-br': 'O que é o EB-2 NIW, quem pode considerar, requisitos (formação acadêmica avançada ou habilidade excepcional), vantagens, perfis compatíveis e perguntas frequentes sobre essa categoria de imigração baseada em emprego que pode levar ao Green Card.',
      en: 'What the EB-2 NIW is, who may consider it, requirements (advanced degree or exceptional ability), benefits, eligible profiles and frequently asked questions about this employment-based immigration category that can lead to a Green Card.',
      es: 'Qué es la EB-2 NIW, quién puede considerarla, requisitos (formación académica avanzada o habilidad excepcional), ventajas, perfiles compatibles y preguntas frecuentes sobre esta categoría de inmigración basada en el empleo que puede conducir a la Green Card.',
    },
  },
  o1: {
    name: 'Visto O-1',
    locales: ['pt-br', 'en', 'es'],
    forms: {
      'pt-br': '2dd7345f-3e4b-46d5-a452-5dd9ccb42534',
      en: 'b55004cd-5da3-45a3-bb99-7e29cf36755c',
      es: 'a59db510-e4e5-43c5-a3bd-256a9308eb73',
    },
    legacy: true,
    llms: {
      'pt-br': 'O que é o visto O-1 (visto de trabalho temporário para profissionais com habilidades extraordinárias), quem pode solicitar, requisitos e evidências, benefícios, uso enquanto se aguarda o Green Card e perguntas frequentes.',
      en: 'What the O-1 visa is (temporary work visa for professionals with extraordinary ability), who can apply, requirements and evidence, benefits, using it while waiting for a Green Card and frequently asked questions.',
      es: 'Qué es la visa O-1 (visa de trabajo temporal para profesionales con habilidades extraordinarias), quién puede solicitarla, requisitos y evidencias, beneficios, su uso mientras se espera la Green Card y preguntas frecuentes.',
    },
  },
};

/** URL da LP neste projeto (ex.: "/pt-br/eb2-niw/"), ou null se ela ainda não foi migrada para cá. */
export function lpUrl(slug, locale = 'pt-br') {
  return LPS[slug]?.locales.includes(locale) ? `/${locale}/${slug}/` : null;
}
