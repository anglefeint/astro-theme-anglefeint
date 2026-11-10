---
tags: ['anglefeint', 'starter']
title: 'Guia 4: Configurar comentários Giscus'
description: 'Guia 4: Configurar comentários Giscus'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Integre os campos de `theme.comments` abaixo ao objeto `defineThemeConfig({...})` existente em `src/site.config.ts`. Preserve outras configurações e não duplique as chaves `theme` ou `comments`.

`shareAcrossLocales: false` — `mapping: 'pathname'`

## Guia de comentários

Prepare um repositório público com Discussions, instale o aplicativo e obtenha os IDs em [giscus.app](https://giscus.app/).

```ts
theme: {
  comments: {
    enabled: true, repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID', category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID', mapping: 'pathname', lang: '',
  },
},
```

Substitua os IDs e a categoria. Não cole um script em cada artigo. Campos essenciais vazios ocultam o componente. lang: '' acompanha o idioma: pt-br usa pt, zh-hant usa zh-TW e zh usa zh-CN. O padrão é inglês fixo.

mapping: 'pathname' associa discussões ao caminho. 'specific' exige term; 'number' exige number como texto com inteiro positivo. Valores inválidos causam erro. strict e reactionsEnabled usam '0' ou '1'. Se não aparecer, verifique IDs, permissões, conexão e bloqueios do navegador.

## Compartilhar comentários entre traduções

Comentários e compartilhamento estão desativados por padrão. Para comentários por caminho, use a configuração acima. Para compartilhar uma discussão entre traduções, mantenha os dados do repositório e da categoria e substitua as opções de associação por:

```ts
theme: {
  comments: {
    // Mantenha seus valores de enabled, repo, repoId, category e categoryId.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

O compartilhamento exige mapping specific, term e number vazios e strict como texto 1. Cada artigo fornece a data-term seu slug completo sem o idioma. As nove traduções usam cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup e other/setup continuam sendo discussões distintas. Um slug ausente causa erro. As traduções precisam do mesmo slug. lang vazio acompanha o idioma da página; um valor explícito o fixa. O texto não é traduzido: apenas discussão e reações são compartilhadas.

Sem compartilhamento, mapping, term, number e strict mantêm o comportamento atual: specific exige term não vazio; number exige inteiro positivo como texto. Com comentários e compartilhamento ativos, mapping incompatível, term/number não vazios ou strict diferente de 1 geram erro claro. Confira duas traduções e outro artigo. Comentar exige autorização do GitHub. Integre os campos ao objeto comments sem substituir outras configurações.

Discussões existentes não são mescladas, movidas ou apagadas automaticamente. Ativar o compartilhamento pode selecionar outra discussão, sem mostrar os comentários antigos nela. Salve mapping, term, number e strict antes da mudança. Para restaurar a associação anterior, use shareAcrossLocales: false e recupere os valores originais. Se precisar transferir comentários, avalie e faça isso manualmente no GitHub; o tema não faz migração.

Em um starter integrado existente, atualize primeiro para uma versão do tema que inclua esta opção. Após alterar a configuração, gere e publique o site novamente; confira os comentários na prévia de produção.

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← Guia 3](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)
