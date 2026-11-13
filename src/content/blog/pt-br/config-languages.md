---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: idiomas, endereços e fallback'
subtitle: 'Registro de idiomas, traduções da interface e resolução'
description: 'Tipos, padrões e limites de i18n, idiomas ativos, endereços, metadados e cadeia de fallback.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

As expressões chinesas nos exemplos de `locales.zh` são intencionais: mostram como personalizar o conteúdo em chinês sem alterar os outros idiomas. Os valores padrão em chinês/inglês nas tabelas são citações do tema, não traduções pendentes.

Para ativar idiomas ou publicar traduções passo a passo, veja o [tutorial multilíngue](/pt-br/blog/starter-guide-languages/). O arquivo de configuração está em [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/). Outros módulos estão no [índice de configuração](/pt-br/blog/config-reference/).

Este artigo cobre registro, endereços e resolução i18n, sem repetir todos os textos funcionais. Consulte padrões e exemplos por campo de página inicial, publicações, Fragments, About, Decoder, música e comentários nos respectivos dicionários. Os padrões abaixo vêm do pacote, não das substituições pessoais do demo.

<a id="registry"></a>

## i18n.defaultLocale e i18n.locales

| Caminho completo        | Tipo / padrão do tema                                                                                           | Estado, efeito e limites                                                                                                                                                                                        | Exemplo                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale      | string / 'en'                                                                                                   | Ativo: define o idioma usado ou destino da raiz inicial, fallback necessário e links padrão. String vazia normaliza para en. Não detecta navegador; o idioma padrão fica sempre ativo, mesmo com enabled: false | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales            | Record<string, LocaleConfig> / nove idiomas integrados abaixo                                                   | Ativo: chaves são códigos reais que definem pastas e URLs. Mescla recursivamente; omitir um idioma integrado não o remove. Idiomas novos precisam de textos e conteúdo próprios                                 | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<locale>` | LocaleConfig, substituição parcial / configuração existente para idiomas integrados; nenhuma para códigos novos | Ativo: inclui meta, site, messages, about e aiReadableContent. Campos omitidos seguem mescla/fallback; objeto vazio não apaga idioma existente                                                                  | locales: { zh: { meta: { enabled: false } } }              |

A chave de idioma não é o nome do menu nem hreflang. A implementação não converte EN em en ou a pasta zh-CN em zh. Use códigos minúsculos coerentes nas pastas, configuração e comandos, como zh, en, pt-br e zh-hant. O scaffolding aceita duas ou três letras e um segmento opcional separado por hífen. A normalização do runtime não é um validador completo de código ou caminho; não informe caminhos ou pontuação arbitrária.

Se o padrão não estiver registrado, a normalização acrescenta uma configuração com código como label. Isso não substitui conteúdo e traduções. Alterar defaultLocale não move arquivos para outra pasta.

### Padrões efetivos dos idiomas integrados

Sem substituições, os nove idiomas estão ativos. en é padrão sem fallback; os outros usam en. A ordem segue o registro no objeto, não meta.label. Não há campo separado de ordenação do menu.

| Código    | meta.label         | meta.hreflang | meta.ogLocale | enabled efetivo | fallback efetivo |
| --------- | ------------------ | ------------- | ------------- | --------------- | ---------------- |
| `en`      | English            | `en`          | `en_US`       | true            | `[]`             |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true            | `["en"]`         |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true            | `["en"]`         |
| `es`      | Español            | `es`          | `es_ES`       | true            | `["en"]`         |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true            | `["en"]`         |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true            | `["en"]`         |
| `de`      | Deutsch            | `de`          | `de_DE`       | true            | `["en"]`         |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true            | `["en"]`         |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true            | `["en"]`         |

<a id="meta"></a>

## `i18n.locales.<locale>.meta`: cinco campos de metadados

Os campos relativos abaixo ficam em meta. Veja padrões específicos dos idiomas integrados acima e normalização ao omitir em idiomas novos abaixo. A entrada aceita substituições parciais; os tipos não exigem reescrever tudo sempre.

| Caminho relativo | Tipo / ao omitir em idioma novo                                          | Estado, efeito e limites                                                                                                                                                   | Exemplo      |
| ---------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label       | string / código do idioma                                                | Ativo: nome no menu; string vazia usa o código. Não aplica trim a espaços. Não renomeia pastas ou URLs                                                                     | 'Français'   |
| meta.hreflang    | string, opcional / código do idioma                                      | Ativo: html lang, hreflang e idioma de alguns dados estruturados, sem mudar a chave de caminho. Vazio usa código; sem validação de formato                                 | 'fr'         |
| meta.ogLocale    | string, opcional / não definido                                          | Condicional: idioma Open Graph e alternates disponíveis. Omitido ou vazio não emite tag, sem inferir região. Vazio pode limpar o valor integrado                           | 'fr_FR'      |
| meta.enabled     | boolean, opcional / true                                                 | Ativo: só false desativa idiomas não padrão; o padrão sempre fica ativo. Afeta páginas padrão e menu, sem apagar arquivos/páginas personalizadas. Não é controle de acesso | false        |
| meta.fallback    | string[], opcional / acrescenta o padrão aos não padrão; vazio no padrão | Ativo: cadeia direta de resolução. Substitui o array; remove próprio idioma, duplicatas, vazios e não registrados. Idiomas não padrão sempre recebem o padrão              | ['zh', 'en'] |

hreflang e ogLocale são distintos e não substituem a chave. O tema não garante convenções regionais para idiomas personalizados; use valores coerentes com seu conteúdo.

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix: endereço da página inicial padrão

- **Tipo / padrão:** 'always' | 'never' / 'always'.
- **Estado e efeito:** ativo, mas só muda a entrada canônica inicial do idioma padrão; não remove o prefixo de todas as páginas. String vazia não pertence ao tipo público. O runtime usa always como fallback, mas não dependa de valor inválido.
- **Limites:** não gera automaticamente /blog/, /about/ ou outras páginas sem idioma. Recompile/publique; não migra links antigos nem regras de redirecionamento da hospedagem.
- **Exemplo:** i18n: { routing: { defaultLocalePrefix: 'never' } }.

Com defaultLocale en:

| Endereço          | always                                  | never                                   |
| ----------------- | --------------------------------------- | --------------------------------------- |
| /                 | Redireciona por HTML estático a /en/    | Mostra página inicial em inglês         |
| /en/              | Mostra página inicial em inglês         | Redireciona por HTML estático a /       |
| /en/blog/         | Lista em inglês                         | Lista em inglês                         |
| /en/blog/my-post/ | Publicação em inglês                    | Publicação em inglês                    |
| /en/about/        | About em inglês, se ativo               | About em inglês, se ativo               |
| /zh/              | Página inicial chinesa, se idioma ativo | Página inicial chinesa, se idioma ativo |

O redirecionamento entre raiz e página inicial do idioma é HTML estático com meta refresh, canonical e noindex. Não escolhe idioma pela localização nem é um 301 de servidor configurado pelo tema. Ferramentas internas normalmente ainda geram `/<locale>/.../`; cada entrada decide se leva à raiz.

<a id="overrides"></a>

## site, messages e about: onde colocar substituições?

Prefixo: `i18n.locales.<locale>`. Objetos mesclam recursivamente, arrays substituem tudo e undefined não sobrescreve. String vazia, false e arrays vazios são preservados conforme cada campo.

| Caminho relativo | Tipo / padrão                                                                                         | Efeito, limites e exemplo                                                                                                                                                           | Detalhes por campo                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| site             | { homeTitle?: string; hero?: string } / configuração inicial integrada de cada idioma                 | Só conteúdo inicial do idioma; não substitui a identidade site global. Exemplo site: { homeTitle: 'Meu blog' }                                                                      | [Página inicial](/pt-br/blog/config-home/#site-fallbacks)  |
| site.homeTitle   | string, opcional / não definido                                                                       | Procura título com trim não vazio no idioma atual e fallbacks diretos, depois SITE_TITLE global. Exemplo 'Meu blog'. Vazio não impede fallback                                      | [Título inicial](/pt-br/blog/config-home/#home-title)      |
| site.hero        | string, opcional / apresentação integrada por idioma; não definido em idioma novo                     | Primeiro valor definido na cadeia. String vazia limpa explicitamente e interrompe fallback. Sem valor, há messages.home.hero como alternativa. Exemplo 'Projetos e vida cotidiana.' | [Apresentação inicial](/pt-br/blog/config-home/#home-hero) |
| messages         | DeepPartial<Messages> / substituições normalmente não definidas; runtime acrescenta textos integrados | Textos de botões, estados e metadescrições; exemplo messages: { nav: { home: 'Início' } }. Não cria recursos nem traduz conteúdo                                                    | [Índice de configuração](/pt-br/blog/config-reference/)    |
| about            | DeepPartial<AboutConfig> / configuração About integrada de cada idioma                                | Parte do About base e mescla recursivamente pela cadeia. Exemplo about: { sections: { who: 'Sou desenvolvedor.' } }. Não lê corpo Markdown automaticamente                          | [About](/pt-br/blog/config-about/#about-content)           |

Padrões exatos de hero por idioma abaixo. A configuração padrão não fornece homeTitle:

| Idioma    | Padrão de site.hero                                                                        |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## Ordem exata da cadeia de fallback

Se fr tem meta.fallback efetivo ['zh', 'en'], a cadeia é fr → zh → en. Consulta diretamente essa lista ou mescla na ordem inversa, sem expandir o fallback de zh. Para usar ja, inclua-o diretamente no array de fr.

1. Sem fallback ou com [], idiomas não padrão ainda recebem o padrão. O padrão pode não ter fallback ou apontar para outros idiomas registrados.
2. Remove o próprio idioma, duplicatas e idiomas não registrados. Verifica registro, não ativação; idiomas desativados ainda podem fornecer fallback de configuração.
3. Acrescenta o padrão no final se ausente em idioma não padrão. Se já explícito, preserva sua posição original, sem movê-lo ao fim.
4. messages comuns começam no inglês integrado. Percorre a cadeia efetiva ao contrário e mescla, por idioma, pacote integrado e substituições pessoais. Assim, a tradução integrada atual pode substituir textos pessoais de um fallback.

Mudar en.nav.home para 'Start' não transforma o “首页” integrado de zh em 'Start'. Substitua zh.messages.nav.home diretamente. Idiomas novos sem pacote integrado recebem textos dos fallbacks, mas não uma tradução completa automática.

Tipos de conteúdo não compartilham um único algoritmo:

| Conteúdo                         | Comportamento atual                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| messages comuns                  | Inglês integrado → pacotes e substituições dos fallbacks → pacote e substituições do idioma atual                                                    |
| site.homeTitle                   | Primeiro valor não vazio com trim na cadeia direta; depois título global                                                                             |
| site.hero                        | Primeiro valor definido na cadeia direta; string vazia interrompe a busca                                                                            |
| about                            | Começa em DEFAULT_ABOUT_CONFIG base e mescla os idiomas na ordem inversa da cadeia direta                                                            |
| messages.home.transmission       | Exceção: valor pessoal atual → valor pessoal inglês → texto autoral inglês integrado. Não usa a cadeia completa comum; o texto atual é Knock, knock. |
| aiReadableContent                | Campos do idioma substituem o complemento global, sem meta.fallback; veja abaixo                                                                     |
| Corpo de publicações e fragments | Sem fallback de interface; lê só o conteúdo do próprio idioma                                                                                        |

Fallback não acrescenta publicações inglesas à lista chinesa, gera arquivos traduzidos, busca outros idiomas para completar quantidades iniciais ou considera slugs diferentes como traduções.

<a id="common-messages"></a>

## Seletor de idiomas e textos compartilhados

São campos string opcionais em `i18n.locales.<locale>.messages`, resolvidos pela cadeia comum. siteTitle localizado não muda a identidade padrão; tipo, padrão e estado não usado estão no [dicionário do site](/pt-br/blog/config-site-chrome/#legacy-site-title).

| Campo relativo  | Padrão em chinês simplificado / inglês                                                           | Estado, efeito e limites                                                                                                | Exemplo                                       |
| --------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| langLabel       | 语言 / Language                                                                                  | Ativo: dica e nome acessível do seletor público, não o nome de cada opção, que usa meta.label                           | 'Selecionar idioma'                           |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | Condicional: metadescrição inicial, não apresentação visível ou descrição universal. Outras páginas têm fontes próprias | 'Meus projetos e minhas anotações de estudo.' |

Consulte textos internos de funções nos respectivos dicionários. Um campo no tipo sem consumo não produz efeito. O idioma do iframe de comentários também depende de theme.comments.lang, fixo em inglês por padrão. Veja [comentários](/pt-br/blog/config-comments/#appearance).

<a id="ai-context"></a>

## aiReadableContent: fallback especial do complemento público por idioma

`i18n.locales.<locale>.aiReadableContent` substitui notes / links globais por campo, sem meta.fallback. Omitir herda o global; notes vazio ou links [] limpa explicitamente. O objeto {} não apaga o complemento global.

Tipos, padrões, validação e exemplo completo estão em [complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#locale-supplement). Não é tradução da página nem corpo do About; todo complemento é público. Links são relativos à raiz de publicação, e / inicial ignora o base. Compare na [resolução de links](/pt-br/blog/config-analytics-ai/#supplement).

<a id="examples"></a>

## Exemplos para mesclar

Mescle no defineThemeConfig({...}) existente em src/site.config.ts, preservando configurações pessoais e sem duplicar i18n. Os objetos abaixo ainda mesclam com os nove idiomas integrados; informar só dois não desativa os demais.

### Manter apenas páginas chinesas

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
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

O padrão zh não pode ser desativado. Mesmo com páginas inglesas desativadas, seu registro pode fornecer fallback. Para página inicial na raiz, troque always por never; publicações continuam em /zh/blog/.../.

### Adicionar francês e textos próprios

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

O exemplo fornece só alguns textos franceses, não um pacote completo. Publique conteúdo em src/content/blog/fr/ e fragments em src/content/fragments/fr/. O scaffolding cria placeholders para idiomas ativos por padrão, sem traduzir o corpo.

<a id="content-and-seo"></a>

## Limites de URLs, troca de conteúdo e SEO

- O menu público mostra só idiomas ativos e normalmente preserva o subcaminho. Rotas específicas podem definir destinos próprios. Não garante localizar uma tradução existente de qualquer página.
- Publicações padrão procuram traduções pelo slug completo sem pasta de idioma. Se existe, abre a publicação; se não, o Blog List daquele idioma. SEO só declara publicações existentes com o mesmo slug, sem tratar lista como tradução. Se falta a versão padrão, não inventa seu x-default.
- Fragments troca para a primeira página da lista do destino, sem procurar tradução por ID. Compartilhamento de discussão por ID é outro mecanismo. Desativar idioma não apaga arquivos ou discussões GitHub.
- meta.label altera só o menu; mudar a chave muda a convenção de URLs e pastas. Não migra links nem escolhe idioma por Accept-Language, navegador ou país.
- Mensagens públicas são configuração textual, não entrada universal de HTML ou Markdown. Suporte a quebras, arrays ou formatos depende do módulo. Substituir arrays não acrescenta itens de menu ou funções.
- Sem languageOrder, autoDetect, tradução automática de ausências, rotas globais sem prefixo ou playlist por idioma públicos. localeHrefs / seoLocaleHrefs de páginas personalizadas são parâmetros de componente, não site.config.

Após salvar, releia a configuração dev. Produção exige nova compilação e implantação. Desativar idioma não limpa arquivos antigos da hospedagem nem protege conteúdo privado. Volte ao [índice de configuração](/pt-br/blog/config-reference/).
