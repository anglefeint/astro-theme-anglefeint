---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: página inicial'
subtitle: 'Consulte título, apresentação, recentes, avisos, terminal de telas largas e passagem ao navegar.'
description: 'Tipos, padrões reais, alcance, limites e exemplos dos campos iniciais, incluindo opções compartilhadas e controles ainda não disponíveis.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[Voltar ao índice da referência](/pt-br/blog/config-reference/). Este artigo descreve os campos realmente usados na página inicial, sem alterar o tema nem tratar configurações pessoais do demo como padrões.

Substitua `<语言>` por um código habilitado no projeto. Os exemplos usam zh e só alteram chinês simplificado; não mudam inglês nem habilitam idiomas automaticamente. Mescle os trechos no defineThemeConfig existente de `src/site.config.ts` e preserve os demais campos de theme, i18n e site.

## 1. Título principal, apresentação e metadescrição

<a id="home-title"></a>

### `i18n.locales.<语言>.site.homeTitle`

- **Tipo:** `string` opcional.
- **Padrão do tema:** não definido. Idiomas internos não têm homeTitle específico; usam o nome global, My Blog por padrão.
- **Efeito:** título principal visível da página inicial.
- **Estado e limites:** condicional. Procura títulos não vazios após trim no idioma atual e seus fallbacks, usando o nome global se nenhum servir. `''` ou espaços não ocultam o título. Não altera o nome global no título do navegador, navegação, rodapé, RSS ou SEO.

<a id="home-hero"></a>

### `i18n.locales.<语言>.site.hero`

- **Tipo:** `string` opcional.
- **Padrão do tema:** cada idioma interno tem sua apresentação. Em chinês simplificado: “在这里写一段站点简介，并告诉读者你将发布什么类型的内容。”; em inglês: “Write a short introduction for your site and what readers can expect from your posts.”. Outros idiomas usam seus valores internos.
- **Efeito:** apresentação visível abaixo do título principal.
- **Estado e limites:** condicional. Procura valores definidos na cadeia. `''` limpa explicitamente e interrompe o fallback. É texto, sem interpretar Markdown/HTML nem alterar a metadescrição.

<a id="home-description"></a>

### `i18n.locales.<语言>.messages.siteDescription`

- **Tipo:** substituição opcional `string`.
- **Padrão do tema:** texto interno do idioma atual. Chinês simplificado: “电影感网页界面与 AI 时代工程实践文章。”; inglês: “Cinematic web interfaces and AI-era engineering essays.”.
- **Efeito:** descrição enviada ao head da página inicial, não a apresentação visível.
- **Estado e limites:** condicional. Resolve mensagens e fallbacks primeiro; só um resultado vazio usa a description global. String vazia não desliga todas as descrições. Espaços não são convertidos automaticamente por trim em ausência de descrição.

Os três campos têm funções distintas e podem ser configurados juntos:

```ts
i18n: {
  locales: {
    zh: {
      site: {
        homeTitle: '我的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: { siteDescription: '个人项目与学习笔记。' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### Campos globais relacionados: `site.title` e `site.description`

Aqui tratamos apenas da relação com a página inicial: site.title é o último fallback sem homeTitle válido, e site.description é o recurso quando a metadescrição localizada está vazia. Não são campos exclusivos da página inicial. Tipos, padrões, variáveis de ambiente e exemplos completos estão na [referência de identidade do site](/pt-br/blog/config-site-chrome/#identity).

## 2. Quantidade de artigos recentes

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **Tipo:** `number`.
- **Padrão do tema:** `3`.
- **Efeito:** pega os primeiros N artigos do idioma atual ordenados por pubDate decrescente. Se houver menos, mostra apenas os disponíveis. A contagem ao lado é quantidade real/total do idioma.
- **Estado e limites:** em uso. Atualmente usa slice diretamente, sem validação específica de inteiro positivo. Use inteiros positivos razoáveis, sem negativos, frações, NaN ou Infinity. `0` cria uma lista vazia e mostra o aviso de ausência de artigos mesmo que existam; não oculta a área inteira.
- **Independência:** não muda a quantidade por página do Blog List nem a prévia fixa de até três Fragments.

```ts
theme: { homeLatestCount: 5 },
```

Título, data e resumo vêm do conteúdo do artigo, não de subcampos desta opção. Não há preenchimento automático com artigos de outros idiomas para completar a quantidade.

## 3. Avisos iniciais e estado inferior

<a id="startup-switches"></a>

Os três campos abaixo são `boolean`, padrão `true`, e estão em uso. false oculta só a parte correspondente; omitir preserva o padrão.

| Caminho completo            | Efeito                                     | Limites                                                                                                      |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `theme.home.showInitialize` | Trecho inicial Initialize/done.            | Controla só esse trecho, não o corpo nem o carregamento do fundo.                                            |
| `theme.home.showFollow`     | Aviso Wake Up/Follow The White Rabbit.     | Independente do trecho anterior; não é requisito para navegar.                                               |
| `theme.home.showTrace`      | Área PIRATE SIGNAL/TRACE PROGRAM inferior. | Não controla o terminal de telas largas; os textos são decorativos, sem rastreamento ou estado real de rede. |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

Desligar as duas primeiras opções remove seus componentes de texto inicial. Não há campos site.config para trocar essas frases fixas, os estados inferiores ou seus tempos; não invente nomes como startupText ou traceText.

## 4. Textos da interface inicial

<a id="home-messages"></a>

Os campos ficam em `i18n.locales.<语言>.messages.home` e são substituições opcionais `string`. Campos comuns seguem o fallback de interface. A tabela lista padrões reais em chinês simplificado e inglês; outros idiomas internos têm seus textos.

| Campo final do caminho | Padrão em chinês simplificado / inglês                          | Efeito e limites                                                                                                        |
| ---------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `latest`               | 最新 / Latest                                                   | Título da área de recentes; não muda a ordem ou a quantidade.                                                           |
| `viewAll`              | 全部 / All                                                      | Texto do acesso ao arquivo de artigos, também usado na descrição acessível do arquivo de Fragments; não muda o destino. |
| `noPosts`              | 该语言暂时没有文章。 / No posts available in this language yet. | Mensagem quando latestPosts está vazio; não controla rascunhos ou publicação.                                           |
| `openDoor`             | 开门 / Open door                                                | Nome acessível da fechadura do terminal e rótulo da prévia; normalmente não é um título permanentemente visível.        |

São condicionais: a região correspondente precisa existir. Strings vazias limpam o texto, mas não removem contêineres nem desligam recursos; também podem deixar botões sem um nome acessível útil. Use as opções de recurso para controlar a exibição.

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        home: {
          latest: '最近更新',
          viewAll: '全部文章',
          noPosts: '这里还没有文章。',
          openDoor: '打开走廊预览',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<语言>.messages.home.transmission`

- **Tipo:** substituição opcional `string`.
- **Padrão do tema:** `'Knock, knock.'`, compartilhado sem personalização inclusive pelo chinês.
- **Efeito:** texto selecionável e rolável no terminal de telas largas.
- **Estado e limites:** condicional. O terminal aparece a partir de 1440px de largura. A ordem própria é configuração pessoal atual → pessoal inglesa → frase padrão, não a cadeia completa de mensagens. `''` limpa o texto, sem ocultar o terminal ou desligar o corredor.

Por exemplo, para uma mensagem compartilhada pelos idiomas sem substituição própria:

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '这里留下一点线索。' } } },
  },
},
```

Preencher o mesmo campo em zh altera apenas chinês. Trocar o texto não consulta sinal de rede real nem muda a fechadura que abre o corredor.

<a id="message-hero"></a>

### `i18n.locales.<语言>.messages.home.hero`

- **Tipo:** substituição opcional `string`.
- **Padrão do tema:** apresentação interna do idioma, com os mesmos valores de site.hero mostrados acima para chinês e inglês.
- **Efeito:** alternativa usada apenas quando getSiteHero não encontra valor definido no idioma atual nem em seus fallbacks.
- **Estado e limites:** condicional, não obsoleto. Todos os idiomas internos já têm site.hero, então alterar só este campo geralmente não muda a página. Definir site.hero como `''` também não ativa a alternativa. Normalmente, edite site.hero diretamente.

```ts
i18n: {
  locales: {
    zh: { messages: { home: { hero: '仅在没有可用 site.hero 时使用的介绍。' } } },
  },
},
```

O exemplo mostra caminho e tipo, sem ultrapassar a prioridade de site.hero. Não apague padrões nem altere dependências para editar a apresentação inicial.

## 5. Passagem Matrix ao clicar em artigos

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **Tipo:** `boolean`.
- **Padrão do tema:** `false`.
- **Efeito:** em cliques comuns nos títulos de recentes e entradas de blog marcadas da navegação inicial, executa a passagem Matrix antes de navegar. A sequência normal dura cerca de 8 segundos e tem navegação alternativa após conclusão ou falha.
- **Estado e limites:** condicional, exige JavaScript. Redução de movimento, teclas modificadoras, botões que não sejam o esquerdo, downloads, links externos ou de nova janela preservam a ação nativa. Não atrasa o corpo inicial nem controla Oracle de About ou a prévia do terminal largo.

```ts
theme: { effects: { enableHomePassage: true } },
```

Quando desligado, os links navegam diretamente. Essa opção booleana não configura duração, cores ou destino; não acrescente homePassageDuration ou outros campos não publicados.

## 6. Opções compartilhadas usadas na página inicial

<a id="shared-settings"></a>

Estes campos não são exclusivos do início. A tabela explica a relação; suas definições completas ficam nos módulos principais.

| Caminho completo                               | Uso na página inicial                                                                                         | Referência principal                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `theme.fragments.enabled`                      | Mostra o avatar se há Fragments no idioma atual e também controla a lista completa; no máximo três na prévia. | [Opção Fragments](/pt-br/blog/config-fragments/#enabled)                     |
| `i18n.locales.<语言>.messages.blog.allPosts`   | Descrição acessível da contagem de recentes e do link do arquivo.                                             | [Textos compartilhados da lista](/pt-br/blog/config-blog-list/#tag-messages) |
| `i18n.locales.<语言>.messages.fragments.title` | Nome acessível do avatar, sem título ao lado dele.                                                            | [Textos de Fragments](/pt-br/blog/config-fragments/#fragment-messages)       |
| `i18n.locales.<语言>.messages.fragments.close` | Nome acessível do botão de fechar a prévia, sem mudar o ícone.                                                | [Textos de Fragments](/pt-br/blog/config-fragments/#fragment-messages)       |

Se habilitou sem aparecer avatar, confira conteúdo no idioma atual. Não copie IDs existentes só para mostrar o avatar. Imagens, código e alturas estão na [referência de Fragments](/pt-br/blog/config-fragments/#preview-and-links), e a publicação em [publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/).

## 7. Configurações iniciais ainda não disponíveis

<a id="unsupported-settings"></a>

`messages.siteTitle` não muda a página inicial padrão nem o nome global. Não o use no lugar de homeTitle ou site.title. Tipo, padrão e exemplo estão em [campo de título sem uso atual](/pt-br/blog/config-site-chrome/#legacy-site-title).

Densidade/cor da chuva de código, botão espelhado, avatar, quantidade de Fragments, frases iniciais e duração da passagem não têm campos site.config próprios. São implementação de layout, estilo ou script. Acrescentar um nome num exemplo TypeScript não cria o recurso. Reduced Motion afeta a exibição, mas não é uma opção nova desta referência.

A relação entre `/` e as páginas de idioma é controlada por i18n.defaultLocale e i18n.routing.defaultLocalePrefix; veja [idiomas e endereços](/pt-br/blog/config-languages/#routing). Navegação pública, rodapé, música e estatísticas também não são opções exclusivas do início.

## Como conferir as alterações?

Abra a página inicial do idioma em dev e confirme se alterou título, apresentação, metadescrição ou nome acessível. Confira o terminal com largura mínima de 1440px; metadescrição está no head, e nomes de botões são verificados pelo nome acessível ou title, não apenas pelo texto grande na tela.

Reinicie dev após mudanças de variáveis de ambiente. Reconstrua e publique o site real. Antes de publicar, pare dev, execute npm run doctor e depois npm run preview; doctor já inclui build, sem repetir check/build imediatamente. Veja [instalação](/pt-br/blog/starter-guide-1-configure-your-site/) e [publicação](/pt-br/blog/starter-guide-deployment/).
