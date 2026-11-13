---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: busca e descoberta de conteúdo'
subtitle: 'Busca interna, índice e outras entradas de conteúdo'
description: 'Campos de busca, textos, limites de indexação, idiomas, RSS e descoberta de conteúdo.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Antes de começar a escrever, leia [Escreva sua primeira publicação](/pt-br/blog/starter-guide-2-languages-and-routing/); para prévia local e implantação, veja o [guia de publicação](/pt-br/blog/starter-guide-deployment/). O arquivo de configuração e a instalação estão no [primeiro tutorial](/pt-br/blog/starter-guide-1-configure-your-site/). Acesse os outros módulos pelo [índice de configuração](/pt-br/blog/config-reference/).

Este artigo distingue duas coisas: a caixa de busca pesquisa publicações no índice gerado na compilação; publicações recentes na página inicial, tags, relacionados e RSS são outras entradas de conteúdo, sem controle unificado pelo botão de busca. Os padrões vêm do pacote do tema, não das substituições do demo.

<a id="enabled"></a>

## theme.search.enabled: ativar a busca do site

- **Tipo / padrão:** boolean / true.
- **Estado e efeito:** ativo. Mostra a busca no cabeçalho público, emite os marcadores das publicações indexáveis e gera os arquivos estáticos do Pagefind após a compilação.
- **Limites:** false desativa a entrada do cabeçalho padrão e a geração do índice desta compilação. search: true de uma publicação não supera o controle global. Desativar não apaga publicações, não impede a indexação por mecanismos externos e não remove índices de implantações anteriores da hospedagem.
- **Exemplo:** theme: { search: { enabled: false } }.

Este é o único campo folha público de theme.search. Não há configurações públicas de endereço do serviço, API key, pasta de índice, ordenação, peso de palavras ou busca entre idiomas. O tema usa Pagefind na compilação; não exige um servidor de busca separado após publicar.

<a id="article-search"></a>

## search por publicação: não é um campo de site.config

| Local                                                          | Tipo / padrão                                                 | Estado, efeito e limites                                                                                                                                                                   | Exemplo       |
| -------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| frontmatter.search de `src/content/blog/<locale>/um-artigo.md` | boolean, opcional / não definido no schema; o layout usa true | Condicional: quando a busca global está ativa, controla o marcador raiz do índice desta publicação; false não afeta listas, relacionados, RSS, exportações para máquinas nem a URL pública | search: false |

Para excluir somente esta publicação da busca interna, adicione ao frontmatter existente:

```yaml
search: false
```

Não escreva theme.search: false nem adicione search: false no nível superior de site.config. frontmatter.search também não torna uma publicação privada. Atualmente não há filtro de draft ou de datas futuras; mantenha conteúdo não publicado fora da coleção. Veja os [campos da publicação](/pt-br/blog/config-article/#frontmatter).

### O que entra no índice?

O layout padrão emite o marcador raiz data-anglefeint-search quando os controles global e individual permitem. A área marcada inclui título, subtítulo visível e corpo. context igual ao subtítulo é tratado apenas na posição do subtítulo, sem um campo de índice independente para todos os context.

Navegação, player, rodapé, comentários e relacionados não entram junto com o corpo. frontmatter.description não é o resumo diretamente usado por esta interface, e tags não são filtros configuráveis da busca. Os resultados usam os metadados de título e os trechos retornados pelo Pagefind. O tema não faz OCR nem transcreve texto presente apenas em imagens, vídeos ou áudio.

About, Fragments, Decoder, página inicial e listas padrão não têm o marcador raiz de publicações e não viram resultados automaticamente. Páginas personalizadas precisam seguir a convenção de marcação; adicionar um campo inexistente em site.config não ativa essa função.

<a id="messages"></a>

## messages.search: onze textos da busca

O prefixo completo é `i18n.locales.<locale>.messages.search.`. Todos são string opcionais e usam os textos integrados do idioma atual e sua cadeia de fallback. A tabela mostra apenas os padrões em chinês simplificado / inglês; cada exemplo é o valor do campo. Todos se aplicam condicionalmente, quando a entrada de busca existe e a interface ou o estado correspondente aparece.

| Campo         | Padrão em chinês simplificado / inglês                                                                                               | Efeito, limites e marcadores                                                                                                                 | Exemplo                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `label`       | 搜索 / Search                                                                                                                        | Nome acessível do botão de busca, dica e título da janela; não é a palavra pesquisada                                                        | `"Buscar artigos"`                              |
| `close`       | 关闭搜索 / Close search                                                                                                              | Nome acessível e dica do botão de fechar; a indicação esc e o ícone são fixos na implementação                                               | `"Fechar busca"`                                |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | Placeholder e rótulo acessível do campo; não preenche uma consulta                                                                           | `"Digite palavras-chave"`                       |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | Mensagem em produção antes de informar uma consulta                                                                                          | `"Busque artigos no idioma atual."`             |
| `loading`     | 正在搜索… / Searching…                                                                                                               | Mensagem ao pesquisar ou preparar a busca; não altera o atraso nem a estratégia de carregamento                                              | `"Buscando…"`                                   |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | Mensagem sem resultados; também pode aparecer quando não há índice no idioma atual                                                           | `"Nenhum artigo relacionado foi encontrado."`   |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | Falha ao carregar manifesto, módulo ou detalhes dos resultados; não representa erros de geração do índice                                    | `"A busca está indisponível; tente novamente."` |
| `retry`       | 重试 / Retry                                                                                                                         | Texto para tentar novamente; recarrega o mecanismo, sem reconstruir o índice no navegador                                                    | `"Recarregar"`                                  |
| `more`        | 加载更多 / Load more                                                                                                                 | Botão para carregar os resultados restantes; não altera o tamanho do lote                                                                    | `"Mais resultados"`                             |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | Contagem total de resultados; mantenha o marcador literal {count}. O script substitui a primeira ocorrência; não é o total de cards exibidos | `"{count} artigos encontrados"`                 |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | Aviso do modo dev, que não faz buscas reais; mudar o texto não gera um índice                                                                | `"Compile e teste a busca em preview."`         |

Os textos são exibidos como texto, sem executar HTML da configuração. Uma string vazia substitui o texto, mas não esconde o botão; seu uso indevido pode remover um nome acessível claro. O {count} de results não é acrescentado automaticamente à frase personalizada: mantenha uma ocorrência para mostrar a contagem.

### Exemplo para mesclar à configuração

Mescle em defineThemeConfig({...}) já existente em src/site.config.ts; preserve import, export e as configurações pessoais, sem duplicar theme ou i18n:

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    'pt-br': {
      messages: {
        search: {
          label: 'Buscar artigos',
          placeholder: 'Digite palavras-chave',
          results: '{count} artigos encontrados',
          empty: 'Nenhum artigo relacionado foi encontrado.',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## Idiomas, carregamento e resultados

- A compilação gera pagefind/, com o manifesto de idiomas anglefeint.json e os módulos Pagefind. O navegador carrega o manifesto e o mecanismo ao abrir a busca; o script da interface já é carregado nas páginas com a entrada. Nem todo código espera o clique.
- Os caminhos incluem automaticamente BASE_URL do Astro. Publicar só o HTML, omitir pagefind/ ou reescrever seus caminhos para HTML pode causar falhas. Não existe configuração separada de caminho do índice em site.config.
- O cliente compara html lang do documento ao manifesto sem distinguir maiúsculas. Sem índice do idioma atual, retorna resultados vazios e não muda para inglês. Usa o idioma efetivo da página, não o idioma de fallback dos textos.
- A pesquisa ocorre após cerca de 200 ms; ao digitar com um IME chinês, espera o fim da composição. Enviar o formulário pode disparar imediatamente. Uma consulta vazia não pesquisa o texto integral. O atraso não é configurável nem envolve IA remota.
- Cada lote carrega detalhes de até 8 resultados; o botão de mais carrega os seguintes. Não existe pageSize. A contagem indica o total encontrado, não o lote atual. Só são mantidos links da mesma origem; os trechos mantêm texto e realces mark, sem renderizar HTML arbitrário da publicação.
- A ordem vem do Pagefind, sem parâmetro de ordenação ou recomendação do tema. O fallback comum de tradução não acrescenta publicações de outro idioma.

Veja metadados, ativação e fallback no [dicionário de idiomas](/pt-br/blog/config-languages/#meta). Os textos search alteram apenas a interface; não geram publicações nem mudam o idioma do índice.

<a id="preview"></a>

## Por que não há busca real em dev?

O índice é gerado ao terminar a compilação do Astro; npm run dev não executa essa etapa. O ambiente de desenvolvimento mostra messages.search.dev e não pesquisa mesmo ao digitar. Esse é o comportamento atual, não uma falha nem uma configuração ausente.

Depois de preparar o conteúdo, execute localmente:

```bash
npm run build
npm run preview
```

preview usa os arquivos compilados. Alterações em publicações, metadados de idioma, controle individual de indexação ou caminhos exigem nova compilação para testar o novo índice. Publique páginas e arquivos pagefind juntos. Alterar textos com dev aberto não atualiza o índice em produção.

Mesmo sem publicações indexáveis, é gerado um manifesto vazio reconhecível e a interface pode mostrar resultados vazios. Falhas de indexação na compilação produzem erro, sem simular sucesso. Tentar novamente só recarrega arquivos existentes; não repara a compilação nem gera publicações no navegador do visitante.

<a id="discovery"></a>

## Configurações das outras entradas de conteúdo

A tabela reutiliza os campos e padrões dos módulos existentes. A explicação principal continua no dicionário original; não cria outra configuração de busca.

| Caminho ou local                                  | Tipo / padrão                                                                            | Efeito, limites e exemplo                                                                                                                                             | Detalhes                                                              |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| theme.homeLatestCount                             | number / 3                                                                               | Número de publicações recentes na página inicial; exemplo: theme: { homeLatestCount: 5 }. Não altera lotes de busca nem relacionados                                  | [Quantidade na página inicial](/pt-br/blog/config-home/#latest-count) |
| theme.blogPageSize                                | number / 10                                                                              | Publicações por página no Blog List e nas listas de tags; exemplo: theme: { blogPageSize: 8 }. Não é a quantidade de resultados de busca                              | [Paginação das listas](/pt-br/blog/config-blog-list/#page-size)       |
| theme.tags.enabled                                | boolean / true                                                                           | Entrada de tags e páginas padrão de tags; exemplo: theme: { tags: { enabled: false } }. Desativar não apaga tags nem desliga a busca de texto                         | [Ativar tags](/pt-br/blog/config-blog-list/#tags-enabled)             |
| frontmatter.tags da publicação                    | string[], opcional / não definido                                                        | Usado no arquivo de tags e nas tags visíveis; exemplo: ['Astro', 'reflexões']. Não determina relevância de relacionados nem funciona como lista de permissão da busca | [Campos da publicação](/pt-br/blog/config-article/#frontmatter)       |
| `i18n.locales.<locale>.messages.blog.related`     | string / texto integrado do idioma atual; padrões em chinês simplificado e inglês abaixo | Título dos relacionados abaixo da publicação; altera apenas o texto; exemplo: 'Continue lendo'                                                                        | [Textos da publicação](/pt-br/blog/config-article/#article-messages)  |
| `i18n.locales.<locale>.messages.blog.relatedAria` | string / texto integrado do idioma atual; padrões em chinês simplificado e inglês abaixo | Nome acessível da seção de relacionados; exemplo: 'Outros artigos'                                                                                                    | [Textos da publicação](/pt-br/blog/config-article/#article-messages)  |

Os relacionados são as três publicações mais recentes do idioma atual, excluindo a própria. Não usam tags em comum, canonicalTopic ou semelhança de conteúdo. Não há relatedCount, controle de relacionados ou lista manual de recomendações em site.config. A seção não aparece sem outras publicações. Uma publicação com search: false ainda pode ser recomendada.

| Texto                     | Padrão em chinês simplificado / inglês |
| ------------------------- | -------------------------------------- |
| messages.blog.related     | 相关文章 / Related                     |
| messages.blog.relatedAria | 相关文章 / Related posts               |

<a id="public-outputs"></a>

## RSS, SEO e leitura por máquinas não são a busca interna

| Entrada                                 | Comportamento atual e relação com as configurações                                                                                                                                                                                                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/<locale>/rss.xml`                     | Feed de resumos das publicações de cada idioma ativo; usa o nome global no título e messages.blog.archiveDescription do idioma na descrição. Os itens usam title, description, pubDate e a URL pública das publicações nesse idioma; search: false não os exclui. Não é RSS de texto integral e theme.search não contém um controle de RSS |
| Metadados e mecanismos de busca         | Saída independente do índice interno; search: false não adiciona noindex nem desativa sitemap. Não controla a indexação por mecanismos da internet                                                                                                                                                                                         |
| Texto público para leitura por máquinas | Publicações, About e Fragments têm seus próprios fluxos de exportação, independentes do Pagefind. Veja os complementos públicos por idioma no [dicionário de idiomas](/pt-br/blog/config-languages/#ai-context). search: false não é um filtro de privacidade para esses arquivos                                                          |

Preencha nome do site, domínio e descrição do feed com valores reais. Veja implantação e URL pública no [guia de publicação](/pt-br/blog/starter-guide-deployment/) e archiveDescription nos [textos das listas](/pt-br/blog/config-blog-list/#archive-messages). Ausência de resultados internos não significa que o conteúdo não esteja público.

O controle global, search individual e os onze textos são consumidos pelo código atual; não há campos antigos de compatibilidade de busca a preencher. Campos não consumidos, como canonicalTopic, não se tornam categorias do índice por aparecerem perto da busca; veja o [estado dos campos da publicação](/pt-br/blog/config-article/#legacy-frontmatter). Não existem opções públicas de busca unificada entre idiomas, OCR, análise de consultas, peso dos resultados ou novos tipos de índice.

Volte ao [índice de configuração](/pt-br/blog/config-reference/) para consultar outros módulos.
