## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Projeto

Landing pages e ebooks da D4U Immigration, gerados como HTML estático. Antes de mexer, leia o `README.md` (estrutura, variáveis de ambiente e regras das páginas: textos literais aos PDFs, tracking sem `pmaTrack('Lead')` manual em forms HubSpot, forms em embed v2, `.nowrap` para nomes de visto). URLs no formato `/{idioma}/{nome-da-lp}/`; URLs antigas `/lp/...` redirecionam via `src/pages/lp/[...legacy].astro`.
