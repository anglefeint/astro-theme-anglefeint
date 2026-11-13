---
tags: ['anglefeint', 'starter']
title: 'Guia 7: receber leitores de outros idiomas'
subtitle: 'Escolha idiomas, ajuste o endereço inicial e os textos localizados e adicione traduções de artigos e Fragments.'
description: 'Habilitação de idiomas, padrão, rotas iniciais, fallback, novos idiomas e associações de artigos e Fragments conforme a implementação.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

As expressões chinesas nos exemplos de `locales.zh` são intencionais: mostram como personalizar o conteúdo em chinês sem alterar os outros idiomas. Os valores padrão em chinês/inglês nas tabelas são citações do tema, não traduções pendentes.

Esta é a parte 7 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Você pode escrever em um idioma primeiro e adicionar traduções depois. O tema fornece interface e rotas multilíngues, mas não traduz artigos automaticamente. Habilitar um idioma, alterar textos da interface e publicar uma tradução são operações distintas.

Mescle as configurações abaixo no `defineThemeConfig({...})` existente de `src/site.config.ts`. Preserve `i18n` e suas outras configurações, sem duplicar objetos.

## 1. Decidir quais idiomas usar

Nove idiomas vêm habilitados e o padrão é `en`:

| Código    | Idioma             |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

Se quiser manter apenas chinês simplificado e inglês, mudando também o padrão para chinês, escolha a configuração abaixo. Se não precisar desses ajustes, mantenha os padrões do projeto:

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

Omitir um idioma não o desabilita, pois a configuração é mesclada aos padrões. Defina explicitamente `meta.enabled: false`. O idioma padrão continua habilitado: não espere ocultar zh definindo `defaultLocale: 'zh'` e desligando zh ao mesmo tempo.

Desabilitar um idioma remove suas entradas do tema e as páginas padrão correspondentes, sem apagar os arquivos dos artigos. Reabilitar permite gerá-los novamente. Trocar o código de idioma altera diretórios e URLs, não apenas o nome mostrado; sites existentes precisam cuidar dos links antigos.

## 2. Escolher a URL inicial do idioma padrão

Adicione ou altere `routing` no `i18n` existente:

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

Usando zh como padrão do exemplo:

| Opção                      | `/`                                   | `/zh/`                             | `/en/`                          |
| -------------------------- | ------------------------------------- | ---------------------------------- | ------------------------------- |
| `'always'`, padrão do tema | Redirecionamento estático para `/zh/` | Início em chinês                   | Início em inglês, se habilitado |
| `'never'`                  | Início em chinês diretamente          | Redirecionamento estático para `/` | Início em inglês, se habilitado |

O padrão é definido pela configuração, não escolhido automaticamente pelo idioma do navegador. O redirecionamento é uma página HTML gerada no build, sem servidor de aplicação adicional; pode aparecer brevemente uma mensagem de redirecionamento.

**Essa opção afeta apenas a página inicial do idioma padrão.** Blog, artigos, About, Decoder e Fragments em chinês continuam com `/zh/`, como `/zh/blog/my-first-post/`, sem virar `/blog/my-first-post/`. Alterar o padrão não move nem traduz arquivos existentes.

## 3. Preencher textos iniciais e de interface por idioma

Defina os textos na entrada do idioma correspondente, por exemplo:

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` é o nome no menu. Trocar “简体中文” por “中文” não renomeia zh nem a URL.
- `site.homeTitle` altera apenas o título visível inicial daquele idioma; o nome global continua em `site.title` ou sua variável de ambiente.
- `site.hero` é a apresentação visível abaixo do título inicial.
- `messages.siteDescription` é a metadescrição, não a apresentação. Só mudar `site.description` global pode não substituir o texto interno localizado.
- `messages.nav` altera o texto das entradas, sem modificar rotas nem conteúdo dos artigos.

Da mesma forma, `i18n.locales.<locale>.about` altera About naquele idioma, e os módulos de `messages` mudam seus textos de interface. About, Decoder e outras páginas ainda dependem dos botões globais: escrever uma tradução não as habilita. Exemplos estão em [ajustar páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/).

Metadados e endereço inicial estão na [referência de idiomas](/pt-br/blog/config-languages/#registry). Os três tipos de texto inicial são explicados na [referência da página inicial](/pt-br/blog/config-home/#home-title).

## 4. Entender de onde vêm os campos omitidos

`meta.fallback` escolhe os idiomas de fallback da configuração. Por exemplo, para usar inglês quando faltar configuração em chinês:

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

en precisa existir nas configurações do projeto. O idioma padrão é acrescentado à cadeia necessária dos idiomas não padrão; o próprio idioma, duplicações e idiomas inexistentes são filtrados. Arrays substituem a lista inteira: informe todos os fallbacks na ordem desejada.

As regras variam conforme o conteúdo:

| Conteúdo                     | Comportamento atual                                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages` comuns            | Começa no inglês interno e mescla pacotes e substituições conforme a cadeia, dando prioridade ao idioma atual; traduções internas também participam. |
| `homeTitle` inicial          | Procura título não vazio após trim no idioma atual e seus fallbacks e, por último, usa o nome global.                                                |
| `hero` inicial               | Procura um valor definido na cadeia; `''` limpa explicitamente e não continua para outro idioma.                                                     |
| Configuração About           | Parte de About padrão e mescla as configurações pessoais dos idiomas da cadeia.                                                                      |
| `messages.home.transmission` | Usa exclusivamente configuração pessoal atual → pessoal inglesa → `Knock, knock.`, sem a cadeia comum completa.                                      |

Assim, mudar a navegação inglesa não faz a tradução interna chinesa herdar automaticamente seu texto. Para alterar uma interface, sobrescreva no próprio idioma. Desabilitar páginas de um idioma não apaga sua configuração; ela ainda pode participar da cadeia.

Fallback só completa configuração e textos de interface. Não inclui artigos ingleses na lista chinesa nem cria arquivos em outro idioma. Não é tradução automática de conteúdo.

## 5. Adicionar um idioma novo

Para adicionar francês, acrescente fr em locales e mantenha as decisões anteriores de habilitação:

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr é o código do diretório e das rotas. Prefira códigos minúsculos padronizados. A CLI aceita duas ou três letras e um sufixo opcional separado por hífen, como `fr`, `pt-br` ou `zh-hant`, sem caminhos ou espaços. O exemplo mantém o idioma padrão atual, sem tornar francês o padrão.

`hreflang` identifica o idioma nos links alternativos e usa o código quando omitido. `ogLocale` identifica idioma/região no Open Graph e tem outro formato, como fr_FR no exemplo. Esses metadados não traduzem o corpo nem garantem indexação.

Um idioma novo não recebe um pacote interno completo. O trecho traduz apenas algumas entradas; outros textos usam fallback. Para uma interface francesa completa, preencha os módulos usados, como busca, paginação, comentários, ferramentas e About. Comece pelos textos que realmente aparecem, sem alterar a implementação só para exibir um artigo.

## 6. Adicionar uma tradução de artigo

Crie esqueletos em chinês e inglês simultaneamente:

```bash
npm run new-post -- my-first-post --locales zh,en
```

Escreva chinês em `src/content/blog/zh/my-first-post.md` e inglês em `src/content/blog/en/my-first-post.md`. Para o novo idioma do exemplo, use `npm run new-post -- french-note --locales fr` e preencha o conteúdo depois.

Para traduzir um artigo existente, você também pode copiá-lo para a pasta de destino, mantendo o nome base e traduzindo título, descrição e corpo. Caminhos relativos de imagens partem do novo arquivo: confira ao copiar para outra profundidade. Se o arquivo já existe, a CLI o ignora sem sobrescrever.

As traduções são associadas pelo slug completo sem o diretório de idioma. zh/my-first-post e en/my-first-post são traduções; renomear o inglês para my-story cria outro artigo, mesmo com título idêntico. Diretórios aninhados também precisam corresponder.

O menu do artigo abre a tradução de mesmo slug quando ela existe; caso contrário, abre a lista daquele idioma. Links alternativos SEO só declaram traduções reais habilitadas, sem apresentar uma lista como tradução de um artigo.

`--locales` cria arquivos, não habilita idiomas. Sem o parâmetro, lê primeiro `ANGLEFEINT_LOCALES` e, se ausente, os idiomas ativos. O parâmetro explícito tem prioridade. Criar esqueletos e traduzir o corpo são etapas separadas.

## 7. Trocar idioma em Fragments e outras páginas

Traduções de Fragments usam o mesmo `id` de frontmatter, não o mesmo nome de arquivo. Para adicionar uma depois, copie o arquivo à pasta de destino, preserve id e pubDate e traduza título e corpo. Executar new-fragment novamente cria outra identidade, não completa a tradução do item existente.

Uma execução de `npm run new-fragment -- --locales zh,en` cria esqueletos com ID e timestamp compartilhados. Trocar o idioma na lista sempre abre a primeira página de destino, sem garantir a localização da mesma tradução. Veja [publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/).

Compartilhar comentários de artigos exige `theme.comments.shareAcrossLocales`, desabilitado por padrão. Fragments compartilha por ID. Idioma de interface e associação de discussão são distintos, e respostas não são traduzidas. Consulte [comentários dos leitores](/pt-br/blog/starter-guide-4-giscus-comments/).

`new-page` gera rotas nos idiomas ativos, mas um único arquivo Astro de origem. Você precisa fornecer conteúdo de acordo com o idioma; o comando não copia nem traduz uma página para cada idioma.

## 8. O que conferir depois das mudanças?

Abra as páginas iniciais dos idiomas ativos em dev e confira nomes do menu, títulos, apresentação e About. Teste um artigo com tradução e outro sem para confirmar os destinos. Os códigos da configuração e dos diretórios precisam ser idênticos.

Antes de publicar, pare dev e execute:

```bash
npm run doctor
npm run preview
```

doctor inclui verificação e build; não repita check ou build imediatamente após o sucesso. Use preview para testar a busca de artigos por idioma; o índice usa o idioma atual, sem misturar todos. O RSS de cada idioma ativo fica em `/<locale>/rss.xml` e contém apenas seus artigos.

Confira o domínio e publique todo `dist/` novamente. Ativar/desativar idiomas, alterar o endereço inicial ou conteúdo exige novo build; salvar localmente não muda o site online. Remova saídas antigas ao publicar: desabilitar idiomas não cria redirecionamentos automaticamente.

| Sintoma                                  | O que conferir                                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Menu mantém idioma indesejado            | Remover uma substituição não basta; defina enabled: false explicitamente.                |
| Idioma padrão não pode ser desligado     | Verifique defaultLocale e escolha primeiro outro idioma padrão.                          |
| Arquivo criado sem página                | Idioma habilitado, código de pasta correto e novo build.                                 |
| Ainda há textos em inglês                | Tradução parcial da interface ou conteúdo About ausente.                                 |
| Título alterado sem efeito               | Diferencie site.title global, homeTitle, hero e messages; confira variáveis de ambiente. |
| Trocar idioma abre a lista               | Falta uma tradução com mesmo slug; é o fallback atual esperado.                          |
| Artigos continuam com prefixo após never | A opção afeta só a página inicial padrão; o comportamento é esperado.                    |

Informações do site e atualização estão no [guia de instalação](/pt-br/blog/starter-guide-1-configure-your-site/). Para escrever, consulte [o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/).

## Navegação e referência de configuração

[Anterior: permitir comentários dos leitores](/pt-br/blog/starter-guide-4-giscus-comments/) · [Próximo: publicar o blog no seu domínio](/pt-br/blog/starter-guide-deployment/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [idiomas, endereços e fallback](/pt-br/blog/config-languages/) e [compartilhamento de comentários](/pt-br/blog/config-comments/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
