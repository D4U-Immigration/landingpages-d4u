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
  '4encontrodemobilidade': {
    name: '4º Encontro de Mobilidade Global',
    locales: ['pt-br'],
    // Sem form: o CTA leva à compra do ingresso na Sympla (Lead ticket_redirect no clique)
    forms: {},
    legacy: true,
    llms: {
      'pt-br': 'Evento presencial da D4U Immigration em São Paulo (TRIO SP Hall, 14 de novembro de 2026) para brasileiros que querem morar, trabalhar e investir nos EUA: participantes, programação de palestras e painéis, público-alvo, parceiros e inscrição pela Sympla.',
    },
  },
  doctor24: {
    name: 'Benefício Doctor24',
    locales: ['pt-br', 'en', 'es'],
    // Sem família própria no catálogo: form "Fale conosco" (decisão do usuário, 2026-11-04);
    // depois do envio, vai para doctor24-thank-you no mesmo idioma
    forms: {
      'pt-br': '479eb867-ae60-4c27-a5fa-a2103a4dcaaf',
      en: 'a6c15d79-c7ee-4b28-8d98-e74453e54e9e',
      es: '1b376f3c-018f-4ed5-bc05-22d7879c15a5',
    },
    legacy: true,
    llms: {
      'pt-br': 'Benefício exclusivo para clientes D4U: 6 meses de acesso gratuito à plataforma de telemedicina Doctor24 (triagem com IA, teleconsultas, receitas e atestados digitais) para o aplicante e seus dependentes nos EUA.',
      en: 'Exclusive benefit for D4U clients: 6 months of free access to the Doctor24 telemedicine platform (AI triage, teleconsultations, digital prescriptions and medical notes) for the applicant and their dependents in the U.S.',
      es: 'Beneficio exclusivo para clientes de D4U: 6 meses de acceso gratuito a la plataforma de telemedicina Doctor24 (triaje con IA, teleconsultas, recetas y certificados digitales) para el solicitante y sus dependientes en EE. UU.',
    },
  },
  // Página de obrigado do form da Doctor24: fora do índice, do sitemap e do llms.txt
  'doctor24-thank-you': {
    name: 'Doctor24 — obrigado',
    locales: ['pt-br', 'en', 'es'],
    forms: {},
    legacy: true,
    noindex: true,
  },
  eb5: {
    name: 'Visto EB-5',
    locales: ['pt-br', 'en', 'es'],
    // Catálogo: caixa "US$ 800 mil" obrigatória — sem marcar, o form não envia
    forms: {
      'pt-br': '255b735d-7acb-4daa-9e8c-3170e7f2a045',
      en: 'ae5b3877-d7b2-4a69-a9b4-07ac370d38da',
      es: '19d4bec2-7fe3-47ae-93f4-44b36ecaf466',
    },
    legacy: true,
    llms: {
      'pt-br': 'O que é o EB-5, quanto é necessário investir (US$ 800 mil em TEA ou determinados projetos de infraestrutura; US$ 1,05 milhão nos demais casos, com reajuste previsto para 2027), como funciona o processo em 5 etapas, quem pode considerar, inclusão de familiares elegíveis e perguntas frequentes sobre essa categoria imigratória baseada em investimento que pode levar ao Green Card.',
      en: 'What the EB-5 is, how much you need to invest (US$800,000 in a TEA or certain infrastructure projects; US$1.05 million otherwise, with an adjustment scheduled for 2027), how the 5-step process works, who may consider it, inclusion of eligible family members and frequently asked questions about this investment-based immigrant category that can lead to a Green Card.',
      es: 'Qué es la EB-5, cuánto es necesario invertir (US$800.000 en una TEA o en determinados proyectos de infraestructura; US$1,05 millones en los demás casos, con un ajuste previsto para 2027), cómo funciona el proceso en 5 etapas, quiénes pueden considerarla, inclusión de familiares elegibles y preguntas frecuentes sobre esta categoría de inmigración basada en inversión que puede conducir a la Green Card.',
    },
  },
  'indique-um-amigo': {
    name: 'Indique um Amigo',
    locales: ['pt-br'],
    // Catálogo: família "Indique um amigo" (página /pt-br/indique-um-amigo do site)
    forms: { 'pt-br': '7b47bd4e-e8be-44fe-a1c9-c278a0392410' },
    legacy: true,
    llms: {
      'pt-br': 'Modelos de indicação e parceria da D4U Immigration: indicação com Gift Card (até US$ 400 por contrato fechado), Programa de Parceiros (comissões de 3% a 5%) e Programa de Embaixadores (5% a 7%, conforme o número de contratos).',
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
