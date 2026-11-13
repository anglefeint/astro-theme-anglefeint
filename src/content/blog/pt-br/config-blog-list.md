---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: Blog List e listas de tags'
subtitle: 'Paginação, tags, textos e limites da visualização'
description: 'Campos de listas e tags, padrões de paginação, variantes e textos compartilhados.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**Nota de versão:** A validação estrita de `blogPageSize` exige 0.36.1 ou posterior; não está em 0.36.0. Em versões antigas, informe um inteiro positivo razoável.

[Voltar ao índice de configuração](/pt-br/blog/config-reference/). Este artigo cobre o arquivo do blog, o diretório de tags, as listas de publicações por tag e a paginação compartilhada. A referência é o código atual, não as quantidades ou cores do demo.

A entrada do blog em chinês é `/zh/blog/` e a segunda página `/zh/blog/2/`. O diretório é `/zh/tags/`; use os links gerados para cada tag. Substitua zh nos demais idiomas. O modo de endereço da página inicial do idioma padrão não remove os prefixos de idioma destes caminhos.

Mescle os exemplos TypeScript ao defineThemeConfig existente em `src/site.config.ts`. Se theme, i18n ou pagination já existem, altere os campos internos e preserve o restante, sem duplicar objetos.

## 1. Quantas publicações mostrar por página

<a id="page-size"></a>

### `theme.blogPageSize`

- **Tipo:** `number`.
- **Padrão do tema:** `10`.
- **Efeito:** quantidade por página no arquivo e em cada lista por tag, compartilhada. Filtra pelo idioma atual e ordena pubDate do mais recente ao mais antigo.
- **Estado:** ativo.
- **Limites:** Deve ser um inteiro positivo seguro. Zero, negativos, frações, NaN, Infinity e valores fora do intervalo seguro geram erro explícito ao resolver a configuração; não são truncados nem restaurados ao padrão. Zero não desativa paginação.
- **Escopo:** não altera publicações recentes na página inicial nem a quantidade por página dos Fragments. O diretório de tags não é paginado por este campo.

```ts
theme: { blogPageSize: 12 },
```

Mesmo vazio, o blog gera a primeira página. Com uma só página, não mostra paginação. Alterações exigem recompilar e publicar; páginas altas anteriores podem desaparecer sem redirecionamento automático.

A ordem não usa updatedDate, nome de arquivo ou cliques. Não há filtro de draft ou datas futuras, nem campo de ordenação. Veja regras de conteúdo em [Escreva sua primeira publicação](/pt-br/blog/starter-guide-2-languages-and-routing/).

## 2. Entrada e páginas de tags

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **Tipo:** `boolean`.
- **Padrão do tema:** `true`.
- **Efeito:** controla entrada, diretório e listas por tag do tema, incluindo links de tags em cards e publicações.
- **Estado:** ativo.
- **Limites:** false não apaga tags do frontmatter, publicações ou arquivos já publicados. Não filtra a lista do blog por tag. A entrada rápida na lista também exige tags no idioma atual; ativado sem tags, o diretório mostra aviso vazio.

```ts
theme: { tags: { enabled: false } },
```

Tags vêm do array `tags` no frontmatter, sem cadastro em site.config. Remove espaços nas extremidades, itens vazios e duplicatas na mesma publicação. Maiúsculas importam: Astro e astro são diferentes.

O diretório ordena por número de publicações decrescente e desempata pelo texto da tag. Caracteres especiais, chinês, nomes reservados e tags longas têm codificação estável. Use os links gerados. Renomear pode mudar o caminho sem preservar a URL antiga.

Cards mostram no máximo duas tags, sem opção de quantidade. Isso não limita tags reais nem a inclusão de todas as tags válidas no diretório.

## 3. Janela de páginas e salto

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **Tipo:** `number`.
- **Padrão do tema:** `7`.
- **Efeito:** influencia números, páginas de borda e reticências; não é a quantidade de publicações.
- **Estado:** condicional; só há paginação com mais de uma página.
- **Limites:** valores normais são arredondados para baixo e limitados a 5–21. É um parâmetro da estratégia de janela, não garante que a soma de números, anterior/próxima e reticências seja igual a ele. Use inteiro finito.

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **Tipo:** `number`.
- **Padrão do tema:** `12`.
- **Efeito:** permite a entrada de salto somente quando o total é estritamente maior que o limite e jump.enabled é true.
- **Estado:** condicional.
- **Limites:** valores normais são arredondados para baixo, no mínimo 1. No padrão, 12 páginas não mostram salto; 13 mostram. Não é um limite de publicações e zero não força exibição incondicional.

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **Tipo:** `boolean`.
- **Padrão do tema:** `true`.
- **Efeito:** permite mostrar o formulário de salto.
- **Estado e limites:** condicional ao total superar o limite. false remove só o formulário, mantendo números e anterior/próxima. O salto exige JavaScript; links normais não.

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **Tipo:** `boolean`.
- **Padrão do tema:** `true`.
- **Efeito:** permite navegar com Enter na entrada de salto.
- **Estado e limites:** só vale quando o formulário existe. false impede o envio por Enter, mas mantém o botão. O cliente remove caracteres não numéricos e limita à faixa real, sem navegação para URLs arbitrárias.

Configure estes campos juntos:

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

A paginação também atende aos Fragments, cuja quantidade continua controlada por seu próprio pageSize. Não suponha que uma mudança feita para uma tag só afete aquela tag.

## 4. Estratégia visual de paginação

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **Tipo:** `boolean`.
- **Padrão do tema:** `true`.
- **Efeito:** ativa variantes do contêiner e botões de página.
- **Estado e limites:** condicional. false usa a variante base 1, sem apagar paginação ou mudar quantidades. Não desativa todo o Cyberpunk nem controla cores aleatórias dos cards ou controles Cards/List.

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **Tipo:** `'random' | 'sequential' | 'fixed'`.
- **Padrão do tema:** `'random'`.
- **Efeito:** decide a escolha das variantes.
- **Estado e limites:** só aplica a estratégia com style.enabled true. Há três modos:

| Modo       | Comportamento atual                                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| random     | A compilação define uma variante inicial estável. A inicialização do cliente sorteia novamente contêiner e botões, com possíveis repetições; não é uma animação de troca contínua |
| sequential | O contêiner segue o número da página e os botões seus próprios índices. Podem ter cores diferentes; não alterna com o tempo                                                       |
| fixed      | Contêiner e botões usam a mesma variante indicada por fixedVariant                                                                                                                |

Sem JavaScript, mantém o estilo inicial do HTML, sem sorteio no cliente.

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **Tipo:** `number`.
- **Padrão do tema:** `9`.
- **Efeito:** quantidade de variantes numeradas de 1 a N, não um array nem a quantidade de temas do site.
- **Estado e limites:** condicional. O componente arredonda valores normais para baixo e limita a 1–12. As cores neon compartilhadas atuais só definem 1–9; 10–12 não são três paletas completas extras e podem herdar cores ou usar a base. Prefira 1–9 e mantenha 9 como escolha usual. O intervalo não acrescenta cores.

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **Tipo:** `number`.
- **Padrão do tema:** `1`.
- **Efeito:** número da variante no modo fixed.
- **Estado e limites:** condicional. Arredonda valores normais para baixo e limita de 1 a variants atual. random e sequential não usam este campo para fixar estilo. Para cores neon completas, prefira 1–9 e inteiro finito.

Por exemplo, fixe a segunda aparência:

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

Para aparência básica, mescle `theme: { pagination: { style: { enabled: false } } }`. Escolha o exemplo desejado; não precisa copiar os dois sequencialmente e sobrescrever.

## 5. Títulos, descrições e textos de paginação

<a id="archive-messages"></a>

Prefixo completo: `i18n.locales.<locale>.messages.blog`. Todos são substituições opcionais de `string` e condicionais ao uso do título, descrição ou controle. Os padrões usam textos integrados e fallback. A tabela traz só chinês simplificado e inglês; os outros idiomas têm seus próprios textos integrados.

| Campo                | Padrão em chinês simplificado / inglês                                                                           | Efeito e limites                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`              | 博客 / Blog                                                                                                      | Título da primeira página do blog e título oculto da seção; não é o título de uma publicação nem o texto fixo de troca de visualização     |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | Prefixo de título das páginas seguintes do blog e de tags; o código acrescenta o número, sem processar marcadores personalizados           |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | Metadescrição da primeira página do blog e do diretório de tags; não é o resumo de cada card                                               |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | Prefixo da metadescrição das páginas seguintes do blog; acrescenta número e ponto. Não ocupa a mesma posição descritiva nas listas por tag |

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        blog: {
          title: 'Arquivo de artigos',
          pageTitle: 'Arquivo de artigos — página',
          archiveDescription: 'Projetos, leituras e anotações de estudo.',
          pageDescription: 'Página do arquivo de artigos',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

Os campos de paginação usam o mesmo prefixo e tipo string:

| Campo            | Padrão em chinês simplificado / inglês | Efeito e limites                                                                             |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `previous`       | 上一页 / Previous                      | Texto visível e nome acessível do link anterior; ausente na primeira página                  |
| `next`           | 下一页 / Next                          | Texto visível e nome acessível do link seguinte; ausente na última página                    |
| `paginationAria` | 分页导航 / Pagination                  | Nome acessível do nav de paginação; não é outro título grande visível                        |
| `jumpTo`         | 跳转到页 / Jump to page                | Texto ao lado da entrada de salto; aparece somente quando o formulário satisfaz as condições |
| `jumpInputLabel` | 页码 / Page number                     | Rótulo oculto que dá nome acessível à entrada; não altera o formato                          |
| `jumpGo`         | 跳转 / Go                              | Texto do botão de salto; não altera o caminho de destino                                     |

Também atendem às listas por tag e à paginação dos Fragments. As rotas do blog têm fallback inglês extra para jumpTo/jumpInputLabel/jumpGo vazios, mas as rotas de tags passam diretamente os valores resolvidos. Não tente ocultar controles entre páginas com strings vazias. Use jump.enabled e preserve nomes acessíveis significativos.

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        blog: {
          previous: 'Página anterior',
          next: 'Próxima página',
          paginationAria: 'Paginação de artigos',
          jumpTo: 'Ir para a página',
          jumpInputLabel: 'Número da página',
          jumpGo: 'Ir',
        },
      },
    },
  },
},
```

## 6. Textos do diretório de tags e entradas compartilhadas

<a id="tag-messages"></a>

Usam `i18n.locales.<locale>.messages.blog`, com substituições opcionais string e fallback normal. Dependem da existência da área correspondente:

| Campo         | Padrão em chinês simplificado / inglês | Efeito e limites                                                                                                               |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `tags`        | 标签 / Tags                            | Entrada rápida, diretório, título de listas por tag e nomes acessíveis relacionados; não altera textos ou slugs das tags reais |
| `allPosts`    | 全部文章 / All posts                   | Texto para voltar a todas as publicações, também usado na página inicial; não altera a contagem                                |
| `noTags`      | 暂无标签 / No tags yet.                | Aviso sem tags válidas no diretório; não é o aviso sem publicações no blog                                                     |
| `taggedPosts` | 文章 / Posts                           | Texto da quantidade por tag e da descrição da página; não define contagem manual                                               |

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        blog: {
          tags: 'Explorar por tags',
          allPosts: 'Voltar a todos os artigos',
          noTags: 'Ainda não há tags para explorar.',
          taggedPosts: 'artigos',
        },
      },
    },
  },
},
```

Esvaziar texto não desativa funções; pode deixar links vazios ou descrições incompletas. Desative tags com theme.tags.enabled, não com false ou string vazia no texto tags.

## 7. Cards/List, capas e outros limites

<a id="view-and-limits"></a>

São comportamentos atuais, não novos campos:

- Blog e listas por tag compartilham Cards/List. Sem preferência salva, começa em cards. JavaScript permite trocar; localStorage usa a mesma chave entre blog, tags e idiomas. Sem armazenamento, ainda troca, mas pode não lembrar.
- Não há campo em site.config para visão padrão, desativar a troca, textos da visão, nomes de colunas ou cores de cards. Controles e barra de arquivo usam tabelas de idioma internas do componente e inglês para idiomas personalizados sem entrada própria. messages.blog.title não os altera.
- Cards mostram título, data, capa e até duas tags. Sem opção para resumos, quantidade de candidatos prioritários de capa ou ordem por updatedDate. Alterar a metadescrição não transforma description em resumo do card.
- As duas primeiras candidatas que realmente têm capa usam eager/high; as demais, lazy. Ocultar capas em List não garante que essas candidatas não baixem. Veja preparação e tamanho no [tutorial de imagens](/pt-br/blog/starter-guide-images/).
- Ao trocar idioma na paginação principal, preserva a página se existir no destino; caso contrário, abre a primeira. Em listas por tag, procura o mesmo texto da tag e abre sua primeira página; sem correspondência, abre o diretório do destino. Não traduz tags nem busca sinônimos.
- Quantidade de recentes e efeito de travessia da página inicial estão no [dicionário da página inicial](/pt-br/blog/config-home/). Navegação, busca, rodapé e comentários não são redefinidos aqui.

Não há campos específicos de lista que precisem ser documentados como compatibilidade. blogView, showExcerpt e cardTheme não são campos aceitos. Adicionar chaves arbitrárias não ativa recursos visuais sem configuração pública.

## Como confirmar as alterações?

Em dev, confira primeira e demais páginas do blog, diretório e lista de uma tag. O salto exige páginas suficientes; distinga fixed de random. Veja metadescrições no head. Não avalie nomes acessíveis ou tags ocultas apenas pelos títulos grandes.

Após mudar quantidade ou nomes de tags, recompile e publique tudo, observando arquivos antigos de páginas ou tags. Antes de publicar, pare dev, execute npm run doctor e depois npm run preview. doctor já compila; não repita check e build imediatamente. Veja [instalação](/pt-br/blog/starter-guide-1-configure-your-site/) e [implantação](/pt-br/blog/starter-guide-deployment/).
