---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: Fragments'
subtitle: 'Lista, prévia inicial, comentários e campos do conteúdo'
description: 'Tipos, padrões e limites das configurações de Fragments, textos, paginação e IDs estáveis.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Para publicar primeiro, leia [Publique um fragment](/pt-br/blog/starter-guide-5-fragments/). Este artigo é uma referência. Veja instalação e localização da configuração no [primeiro tutorial](/pt-br/blog/starter-guide-1-configure-your-site/) e outros módulos no [índice de configuração](/pt-br/blog/config-reference/).

Os padrões são os do pacote do tema, não os valores atuais do demo. Mescle todos os trechos ao `defineThemeConfig({...})` existente em `src/site.config.ts`, sem duplicar theme ou i18n.

## Encontre o que deseja alterar

| O que alterar                                             | Caminho ou local                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Ativar a lista de fragments e a entrada na página inicial | `theme.fragments.enabled`                                                      |
| Quantidade por página na lista completa                   | `theme.fragments.pageSize`                                                     |
| Comentários independentes dos fragments                   | `theme.fragments.comments.enabled`; conexão compartilhada com `theme.comments` |
| Título, descrição, avisos e texto de fechar               | `i18n.locales.<locale>.messages.fragments`                                     |
| Paginação e salto de página                               | `theme.pagination`, com textos de `messages.blog`                              |
| ID, data e título do conteúdo                             | Frontmatter Markdown; não é site.config                                        |
| Quantidade na página inicial, altura e avatar             | Sem campos públicos correspondentes atualmente                                 |

<a id="enabled"></a>

## theme.fragments.enabled: ativar fragments

- **Tipo / padrão:** boolean / `false`.
- **Estado / efeito:** ativo. Carrega `src/content/fragments/<locale>/**/*.md` e gera listas e índice de localização dos idiomas ativos. A entrada inicial aparece quando há conteúdo no idioma atual.
- **Limites:** desativar impede o carregamento da coleção e a geração das rotas, mas preserva os arquivos. Ativado sem conteúdo, mostra estado vazio na lista e nenhuma entrada inicial. Só lê `.md`, não `.mdx`.
- **Exemplo:** `theme: { fragments: { enabled: true } }`.

A primeira página é `/<locale>/fragments/`; a segunda começa em `/<locale>/fragments/2/`. Não acrescente `/1/` à primeira. O idioma precisa estar ativo; veja o [tutorial de idiomas](/pt-br/blog/starter-guide-languages/).

Com `theme.fragments.enabled: false`, dev, build e prepare-covers/doctor ignoram referências de imagens no corpo dos Fragments. Imagens incluídas somente por essas referências deixam de exigir originais ou derivados. Referências de capas e os conjuntos `src/assets/blog/default-covers/` e `src/assets/blog/covers/originals/` continuam preparados e validados, mesmo para imagens usadas só em Fragments. Nenhum arquivo é apagado; reativar restaura o processamento de Fragments.

**Nota de versão:** O isolamento de imagens ao desativar exige 0.36.1 ou posterior; não está em 0.36.0. Não presuma esse comportamento em versões antigas.

<a id="page-size"></a>

## theme.fragments.pageSize: quantidade por página da lista completa

- **Tipo / padrão:** number / `20`.
- **Estado / efeito:** ativo; controla a paginação completa e o índice de ID para página.
- **Limites:** deve ser **inteiro seguro de 1 a 100**. Frações, zero, negativos ou valores fora do intervalo geram erro, sem truncamento automático. pageSize é validado mesmo com fragments desativados. A prévia inicial continua com as três entradas mais recentes, independente deste campo e de `theme.homeLatestCount`.
- **Exemplo:** `theme: { fragments: { pageSize: 10 } }`.

No mesmo idioma, ordena pubDate do mais novo ao mais antigo e desempata por `localeCompare` do ID. Não ordena por nome de arquivo nem exclui datas futuras. Mudar a quantidade pode mudar a página de um conteúdo; compartilhe o link estável abaixo.

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled: comentários dos fragments

- **Tipo / padrão:** boolean / `false`.
- **Estado / efeito:** condicional. Com fragments ativos, mostra um botão em cada card da lista completa; abre a janela compartilhada e carrega a discussão da entrada. A prévia inicial não mostra comentários.
- **Limites:** independente de `theme.comments.enabled`, o controle dos comentários de publicações. Exige também a conexão Giscus compartilhada; dados ausentes causam erro ao gerar páginas de fragments, mesmo com lista vazia. Serviço e permissões do repositório precisam estar corretos.
- **Exemplo:** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`.

Ativar apenas fragments, sem comentários:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

Para comentários só nos fragments, o controle das publicações pode continuar false, mas repo, repoId, category e categoryId ainda são obrigatórios. Veja tipos, padrões e validação em [conexão Giscus](/pt-br/blog/config-comments/#connection) e um exemplo completo em [comentários apenas nos fragments](/pt-br/blog/config-comments/#fragment-overrides). A validação local não comprova permissões nem IDs remotos.

A discussão usa `fragment/<ID-estavel>`. Conteúdos de idiomas diferentes com o mesmo ID compartilham a discussão. Não usa mapping, term, number nem shareAcrossLocales das publicações. Fragments fixam mapping specific, strict `'1'` e emitMetadata `'1'`; o idioma acompanha a página, sem usar `theme.comments.lang`. Se comentários de publicações também estiverem ativos, sua própria validação continua sendo executada.

Tema, reações e posição do campo compartilham as opções Giscus; veja a operação completa no tutorial de comentários. O script só é inserido no primeiro clique. loading é fixo em eager: carrega imediatamente após clicar, sem antecipar na primeira tela. Fechar mantém o iframe criado; mudar de entrada troca a discussão. Sem resposta válida após cerca de 15 segundos, mostra falha e nova tentativa; não há timeout público configurável.

<a id="fragment-messages"></a>

## Textos da interface: messages.fragments

Prefixo completo: `i18n.locales.<locale>.messages.fragments`. Cada campo abaixo é **string** e só altera textos. Os padrões são os textos integrados do idioma atual, com fallback. A tabela mostra apenas padrões em chinês simplificado / inglês. Omitir mantém o padrão; string vazia é uma substituição explícita e não garante ocultar controles. Os exemplos pertencem ao objeto fragments.

| Campo            | Padrão em chinês simplificado / inglês                                                                                    | Estado, efeito e limites                                                                                               | Exemplo                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | Condicional: título da lista, parte do título da página e nome acessível da entrada inicial; não é o título individual | `title: 'Anotações rápidas'`                                            |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | Condicional: apresentação visível e descrição da lista; não aparece na janela inicial                                  | `description: 'Pequenas notas sobre trabalho e vida cotidiana.'`        |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | Condicional: lista completa sem conteúdo; não força a entrada na página inicial                                        | `empty: 'Volte mais tarde.'`                                            |
| `comments`       | 评论 / Comments                                                                                                           | Condicional: botão quando comentários de fragments estão ativos                                                        | `comments: 'Participar da discussão'`                                   |
| `close`          | 关闭 / Close                                                                                                              | Condicional: fechar comentários e nome acessível do botão da janela inicial                                            | `close: 'Fechar janela'`                                                |
| `previous`       | 上一页 / Previous                                                                                                         | **Não usado atualmente**: aceito pelo tipo, mas a paginação usa messages.blog.previous                                 | `previous: 'Página anterior'`                                           |
| `next`           | 下一页 / Next                                                                                                             | **Não usado atualmente**: aceito pelo tipo, mas a paginação usa messages.blog.next                                     | `next: 'Próxima página'`                                                |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | Condicional: estado de carregamento dos comentários                                                                    | `loading: 'Conectando à discussão…'`                                    |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Condicional: falha ao carregar comentários; não representa erro do índice de localização                               | `error: 'A discussão está indisponível; tente novamente.'`              |
| `retry`          | 重试 / Retry                                                                                                              | Condicional: botão para tentar novamente após falha nos comentários                                                    | `retry: 'Reconectar'`                                                   |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | Condicional: título e nome acessível do botão de compartilhar, ativado por script                                      | `copyLink: 'Copiar link desta nota'`                                    |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | Condicional: confirmação de cópia                                                                                      | `linkCopied: 'Copiado'`                                                 |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | Condicional: cópia automática falhou; pede cópia manual                                                                | `copyLinkFailed: 'Copie este link manualmente.'`                        |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | Condicional: falha ao localizar ID estável; não é um texto geral de 404                                                | `notFound: 'Esta nota não existe mais.'`                                |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | Condicional: falha ao solicitar ou validar o índice de localização                                                     | `indexError: 'Não foi possível localizar; atualize e tente novamente.'` |

Por exemplo, substitua só título e descrição em português brasileiro:

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        fragments: {
          title: 'Anotações rápidas',
          description: 'Pequenas notas sobre trabalho e vida cotidiana.',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Quais configurações gerais Fragments também usa?

| Caminho                                                                                                        | Padrão e efeito                                                                | Limites, exemplo e detalhes                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                           | Compartilha os oito campos e padrões de paginação do Blog List                 | Paginação só aparece com mais de uma página; exemplo `theme: { pagination: { windowSize: 5 } }`. Tipos, limites e exemplos em [paginação](/pt-br/blog/config-blog-list/#pagination-window) e nas seções seguintes |
| `i18n.locales.<locale>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string, textos integrados do idioma atual para a paginação visível e acessível | Exemplo `previous: 'Página anterior'`; veja os [textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages), sem alterar campos homônimos de fragments                                                |
| `i18n.locales.<locale>.messages.blog.backToTop`                                                                | string, texto integrado do idioma atual                                        | Botão de voltar ao topo na lista completa; exemplo `backToTop: 'Voltar ao topo'`, veja os [textos da publicação](/pt-br/blog/config-article/#article-messages)                                                    |
| `i18n.locales.<locale>.messages.home.viewAll`                                                                  | string, texto integrado do idioma atual                                        | O nome acessível do arquivo na janela inicial combina também o título dos fragments; exemplo `viewAll: 'Ver tudo'`, veja [textos da página inicial](/pt-br/blog/config-home/#home-messages)                       |
| `theme.math.enabled`                                                                                           | boolean / `true`                                                               | A lista completa avalia se o conteúdo da página precisa de estilos matemáticos; exemplo `theme: { math: { enabled: false } }`, veja [ativar matemática](/pt-br/blog/config-article/#feature-switches)             |

Veja todos os parâmetros compartilhados de `theme.comments` no [dicionário Giscus](/pt-br/blog/config-comments/). Este artigo distingue conexão e vínculo dos fragments, sem tratar mapeamentos de publicações como configurações de fragments. `theme.toc.enabled`, OUTPUT e Red Queen das publicações não controlam a lista de fragments, que também não tem a troca Cards/List do Blog List.

<a id="content-fields"></a>

## Os três campos de frontmatter de um fragment

São campos dos arquivos Markdown em `src/content/fragments/<locale>/`; **não os escreva em site.config**. O schema público atual tem só estes três campos, sem campos adicionais de compatibilidade.

| Campo     | Tipo / padrão                                           | Efeito, estado e limites                                                                                                                       | Exemplo                               |
| --------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string / nenhum, obrigatório                            | Ativo. Exatamente 8 letras ASCII ou dígitos, sem repetição no mesmo idioma. Links e comentários dependem dele; não altere após publicar        | `id: 'aB3dE6gH'`                      |
| `pubDate` | Valor de data convertível em Date / nenhum, obrigatório | Ativo. Precisa ser uma data válida; define ordenação e aparece em UTC. Prefira string ISO com fuso para evitar ambiguidade                     | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | string, opcional / não definido                         | Condicional. Título opcional do card, também usado na prévia inicial. Pode publicar sem ele; o nome do arquivo não vira título automaticamente | `title: 'Uma descoberta de hoje'`     |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: 'Uma descoberta de hoje'
---

Escreva o conteúdo aqui. Insira imagens e código diretamente no corpo Markdown.
```

`npm run new-fragment -- --locales zh,en` gera arquivos com um novo ID compartilhado e a data atual. Cada execução gera outro ID. Para traduzir uma entrada existente, preserve o ID original. Idiomas diferentes podem usar o mesmo ID; duplicatas no mesmo idioma geram erro. O nome do arquivo pode mudar, mas o ID não acompanha nome ou página. IDs antigos não são migrados automaticamente; alterá-los muda o vínculo dos comentários e a URL compartilhada.

`description`, `heroImage`, `tags`, `draft` e `comments` individual não têm lógica correspondente para fragments. Não copie o frontmatter das publicações. Em especial, `draft: true` não torna o fragment um rascunho; não coloque conteúdo privado numa coleção ativa.

<a id="preview-and-links"></a>

## Comportamentos fixos da prévia, imagens e links

São definidos pela implementação, sem campos públicos adicionais:

- **Quantidade inicial:** as três entradas mais recentes do idioma atual, ou a quantidade real se houver menos. O link do arquivo mostra “quantidade exibida / total do idioma”. Não busca outros idiomas para completar.
- **Resumo inicial:** extrai texto, primeira imagem HTTP(S) utilizável e primeiro bloco de código do conteúdo renderizado. Texto até 180 pontos de código Unicode; código até 8 linhas e 800 pontos, acrescentando reticências ao exceder. Os cards limitam a altura e ocultam o excesso; o conteúdo completo continua na lista. O título aparece separado. Não é renderização Markdown completa nem há previewCount ou previewHeight configuráveis.
- **Imagens:** imagens locais compatíveis recebem dimensões e srcset pelo manifesto existente. Imagens remotas ou não compatíveis não têm otimização garantida. Na lista completa, a primeira imagem de cada página é eager / high e as demais lazy, todas com decodificação assíncrona. Veja originais, tamanhos e validação no [tutorial de imagens](/pt-br/blog/starter-guide-images/); não precisa adicionar heroImage aos fragments.
- **Links estáveis:** `/<locale>/fragments/#<ID>`. O script encontra a página pelo índice e redireciona se necessário. Novas entradas ou alterações de pageSize preservam a localização por ID; remover conteúdo ou mudar o ID perde o destino antigo. Sem JavaScript, a paginação normal funciona, mas não dependa da localização automática entre páginas ou do botão de copiar.
- **Troca de idioma:** leva à primeira página de fragments do idioma escolhido, sem garantir localizar diretamente a tradução do mesmo ID.
- **Conteúdo público:** a saída Markdown agregada é `/<locale>/fragments/index.md`. Não controla a busca interna nem RSS de publicações. Não inclua informações sensíveis em conteúdo público.

Avatar, animação de hover, bordas da janela e altura da prévia de código não são opções de site.config atualmente. O dicionário não oferece configurações inexistentes. Volte ao [índice de configuração](/pt-br/blog/config-reference/) para outros módulos.
