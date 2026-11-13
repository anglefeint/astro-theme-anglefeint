---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: GA4 e complementos de leitura por IA'
subtitle: 'Estatísticas e informações públicas para leitura por máquinas'
description: 'Tipos, padrões, validação, herança e limites de analytics e aiReadableContent.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

As expressões chinesas nos exemplos de `locales.zh` são intencionais: mostram como personalizar o conteúdo em chinês sem alterar os outros idiomas. Os valores padrão em chinês/inglês nas tabelas são citações do tema, não traduções pendentes.

Para publicar pela primeira vez, leia o [guia de implantação](/pt-br/blog/starter-guide-deployment/), que apresenta a obtenção do ID de estatísticas e o uso dos textos públicos. Veja o arquivo de configuração em [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/) e outros módulos no [índice de configuração](/pt-br/blog/config-reference/).

Estas duas configurações ficam no nível superior de `src/site.config.ts`, ao lado de site e theme: analytics coleta estatísticas de acesso; aiReadableContent complementa os textos públicos do site. São independentes: ativar estatísticas não exige complementos de IA, e gerar texto público não exige ID de estatísticas.

<a id="analytics"></a>

## analytics.googleAnalyticsId: identificador GA4

| Caminho                     | Tipo / padrão                                             | Estado, efeito e limites                                                                                                                                                                                                                                                     | Exemplo                               |
| --------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| analytics                   | { googleAnalyticsId: string } / { googleAnalyticsId: '' } | Contêiner de configuração; permite substituições parciais, sem outro campo enabled                                                                                                                                                                                           | { googleAnalyticsId: 'G-XXXXXXXXXX' } |
| analytics.googleAnalyticsId | string / ''                                               | Condicional: carrega GA4 com ID válido em produção, exceto nos endereços locais excluídos. String vazia ou só espaços desativa; remove espaços nas extremidades. Regex: ^G-[A-Z0-9]+$, com prefixo e letras maiúsculos. Formato inválido lança erro ao resolver o componente | 'G-XXXXXXXXXX'                        |

É o Measurement ID de um fluxo web GA4, não um ID numérico de propriedade, contêiner GTM, ID UA antigo ou chave de API. O exemplo demonstra apenas o formato; use seu valor real em produção. A validação não exige uma quantidade fixa de caracteres nem verifica online se o fluxo é válido. Passar na regex não significa que os dados foram recebidos.

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Para desativar, mescle:

```ts
analytics: { googleAnalyticsId: '' },
```

Mescle ao `defineThemeConfig({...})` existente, sem duplicar analytics. Um único ID atende às páginas de todos os idiomas que usam o framework público. Não existe ID separado por idioma ou página.

### Quando o cliente carrega?

| Ambiente ou endereço                                          | Comportamento atual do tema                                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| npm run dev                                                   | Não emite o carregador; o campo ainda é analisado antes, portanto um formato errado não é necessariamente ignorado |
| Compilação de produção, ID vazio                              | Não emite o carregador de estatísticas                                                                             |
| Produção em localhost ou subdomínio .localhost                | O carregador retorna antes de inicializar a fila do tema ou solicitar recursos ao Google                           |
| Produção em endereço iniciado por 127., 0.0.0.0, ::1 ou [::1] | Também ignora; converte o endereço para minúsculas antes de comparar                                               |
| Produção em IP de rede local ou domínio remoto de prévia      | Não exclui automaticamente por ser uma prévia; tenta carregar se houver ID                                         |
| Produção em domínio público com ID de formato válido          | Inicializa uma vez a fila gtag e insere o cliente Google de forma assíncrona                                       |

O tema executa os comandos js e config, sem enviar manualmente outro page_view nem criar eventos de consultas ou ações do player. Um marcador impede inicialização repetida pelo mesmo carregador, mas não detecta outra instalação feita por ferramentas externas. Se já houver scripts manuais ou GTM, confira se não estão duplicados.

window.dataLayer e window.gtag existentes são preservados. O tema não inclui painel de consentimento, consentimento automático, proxy, lista de domínios excluídos ou configuração de eventos personalizados. Não existe substituição automática por uma variável PUBLIC_GA_* dedicada. Controle por ambiente precisa ser implementado explicitamente no próprio site.config; inventar um nome de variável não faz o tema lê-la.

Adaptadores personalizados antigos sem o ramo ANALYTICS são tratados como não configurados pelo componente público. É uma compatibilidade interna, não outro caminho recomendado. Configure somente analytics.googleAnalyticsId.

<a id="supplement"></a>

## aiReadableContent: complemento público global

Objeto MachineReadableSupplement opcional, não definido por padrão no tema. Omiti-lo ainda gera arquivos para máquinas, apenas sem essas informações extras. Informar {} não desativa as exportações.

| Caminho completo                | Tipo / padrão                                                           | Estado, efeito e limites                                                                                                                                                          | Exemplo                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| aiReadableContent.notes         | string, opcional / não definido; saída vazia                            | Condicional: acrescenta informações do site em Markdown ao texto público. String vazia ou só espaços omite a seção. Não substitui o corpo nem é uma instrução privada para uma IA | 'Este site reúne anotações pessoais de estudo que podem ser revisadas.' |
| aiReadableContent.links         | { label: string; href: string }[], opcional / não definido; lista vazia | Condicional: links públicos adicionais; substitui o array inteiro, [] limpa. Sem limite público de quantidade; não busca o conteúdo dos destinos                                  | [{ label: 'Página do projeto', href: 'https://example.com/project/' }]  |
| aiReadableContent.links[].label | string, obrigatório / nenhum                                            | Condicional: nome não vazio após trim; converte quebras de linha em espaços e escapa barras invertidas e colchetes. Não obtém automaticamente o título do destino                 | 'Página do projeto'                                                     |
| aiReadableContent.links[].href  | string, obrigatório / nenhum                                            | Condicional: não vazio, resolvido contra a raiz pública. Só HTTP(S), sem usuário ou senha. Valores inválidos causam erro; não verifica se o destino existe ou está acessível      | 'https://example.com/project/'                                          |

notes e links não têm configuração geral de limite de caracteres; devem respeitar os tipos. Tipos errados, nomes de links vazios, protocolos não web ou URLs com credenciais podem impedir a compilação. O tema não executa comandos do complemento nem chama modelos para gerar estas notas.

### Como Markdown e links relativos são tratados?

notes preserva texto, formatação e exemplos de código Markdown. Destinos encontrados em links, imagens e definições de referência são convertidos para URLs absolutas e passam pela mesma validação HTTP(S) sem credenciais. Links de exemplo dentro de blocos de código não são reescritos como destinos reais. Não é um validador completo de HTML arbitrário nem um serviço de captura de páginas.

A base de resolução é a **URL pública raiz do site, incluindo o base do Astro**, e não a publicação atual nem a pasta do idioma. Por exemplo, com https://example.com/project/ como raiz:

| href ou destino Markdown configurado | Resultado                            |
| ------------------------------------ | ------------------------------------ |
| zh/blog/                             | https://example.com/project/zh/blog/ |
| /zh/blog/                            | https://example.com/zh/blog/         |
| https://docs.example.com/guide/      | Mantém a URL externa                 |

Em implantação num subcaminho, um / inicial resolve a partir da raiz do domínio e não mantém /project/ automaticamente. Esta regra difere dos componentes como música, que acrescentam BASE_URL a caminhos raiz. Não misture as regras. mailto:, tel:, file: e javascript: não são aceitos nesses links extras. Links de contato normais do corpo têm regras próprias de exportação, sem implicar os mesmos protocolos aqui.

### Exemplo global

```ts
aiReadableContent: {
  notes: 'Este site reúne anotações pessoais de estudo que podem ser revisadas. Consulte a [lista de artigos](pt-br/blog/).',
  links: [
    { label: 'Página do projeto', href: 'https://example.com/project/' },
  ],
},
```

<a id="locale-supplement"></a>

## Substituir aiReadableContent por idioma

O prefixo completo é `i18n.locales.<locale>.aiReadableContent`, também MachineReadableSupplement opcional e não definido por padrão. Os campos têm o mesmo efeito dos globais, mas herdam cada valor global quando omitidos:

| Campo relativo | Tipo / padrão                                                    | Efeito e limites                                                                                                            | Exemplo                                            |
| -------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| notes          | string, opcional / herda notes global                            | Condicional: complemento público do idioma. String vazia ou só espaços limpa explicitamente, sem fallback para outro idioma | 'O conteúdo em chinês é atualizado continuamente.' |
| links          | { label: string; href: string }[], opcional / herda links global | Condicional: substitui todo o array; [] limpa explicitamente, sem acrescentar à lista global                                | []                                                 |
| links[].label  | string, obrigatório / nenhum                                     | Obrigatório em itens personalizados; mesmas regras globais de validação e escape                                            | 'Artigos em chinês'                                |
| links[].href   | string, obrigatório / nenhum                                     | Obrigatório em itens personalizados; continua resolvendo contra a raiz pública, não a pasta do idioma                       | 'zh/blog/'                                         |

Por exemplo, altere apenas as notas em chinês e oculte os links adicionais desse idioma:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容持续更新。',
        links: [],
      },
    },
  },
},
```

Substituir só notes ainda herda links global; {} herda os dois campos. undefined é ignorado, não limpa. Este objeto não usa meta.fallback nem copia complementos do inglês ou de outro idioma de fallback. Veja o [dicionário de idiomas](/pt-br/blog/config-languages/#fallback).

O llms.txt raiz sempre usa o complemento global. Substituições por idioma atendem aos índices, coletâneas e Markdown individuais desse idioma. Portanto, limpar todos os idiomas não contorna um complemento global inválido: o índice raiz ainda o processa.

<a id="outputs"></a>

## Em quais arquivos públicos o complemento aparece?

Os caminhos abaixo são relativos à raiz pública; acrescente o prefixo de implantação quando houver subcaminho. Só idiomas com conteúdo efetivamente exportado recebem índice e coletânea; preencher complementos não cria publicações.

| Arquivo gerado                        | Posição e conteúdo do complemento                                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| llms.txt                              | Entrada raiz; notes global antes do diretório de idiomas, links como seção adicional. Pode conter o complemento global mesmo sem conteúdo exportável             |
| `<locale>/llms.txt`                   | Entrada do idioma; aplica suas substituições de notas e links e organiza documentos existentes em Articles / Fragments / About                                   |
| `<locale>/llms-full.txt`              | Coletânea pública integral do idioma; notas e links antes dos corpos dos documentos                                                                              |
| Markdown da publicação, como index.md | Acrescenta separador, marcador de complemento do site e notas válidas após o corpo, sem misturar ao texto do autor                                               |
| `<locale>/about/index.md`             | Apresentação e contato públicos do About e painéis estáticos de IA acessíveis; acrescenta o complemento ao fim, sem exportar toda a configuração das ferramentas |
| `<locale>/fragments/index.md`         | Conteúdo público dos fragments paginados reunidos, com links de ID estável; complemento ao fim, sem duplicar a coletânea integral por página                     |

O caminho real do Markdown individual deriva da posição do HTML compilado: index.html corresponde a index.md. Saídas Astro personalizadas podem diferir; não invente caminhos nem sobrescreva os arquivos gerados. As páginas exportadas também recebem links de descoberta para o Markdown e o índice do idioma.

O exportador só processa publicações, About e Fragments marcados, publicamente indexáveis e com canonical da mesma origem. Não exporta por padrão a página inicial, listas, formulários Decoder ou iframes de comentários como publicações. Links, código e tabelas vêm do conteúdo compilado; não empacota arquivos arbitrários de configuração não renderizados. Os painéis de IA do About são textos estáticos públicos acessíveis; trate-os como informação pública ao preencher.

search: false sai apenas do Pagefind, não dessas exportações. Limpar notes/links não desativa a exportação do corpo. Não existem aiReadableContent.enabled, exclusão individual, endereço de IA, parâmetros de modelo ou API key. Os arquivos oferecem material público legível, sem garantir que modelos o busquem, citem ou melhorem a classificação.

O gerador protege arquivos com o mesmo nome que não pertencem ao seu manifesto histórico e falha em conflitos. Não coloque manualmente llms.txt ou Markdown nos mesmos caminhos de public ou da pasta compilada. Corrija a origem e compile novamente; publique todos os arquivos gerados. Compilar com sucesso não comprova atualização online nem leitura por um modelo.

<a id="boundaries"></a>

## Configurações relacionadas e limites atuais

- A URL pública combina site.url, substituições de ambiente e base do Astro. Título e descrição do índice raiz usam o contexto atual do site. Veja informações do site e implantação no [guia de publicação](/pt-br/blog/starter-guide-deployment/). Alterar uma URL no complemento não muda o canonical.
- Ativar ou desativar idiomas afeta a geração das páginas padrão; desativar não apaga automaticamente arquivos antigos da hospedagem. Notas não criam traduções; veja o [dicionário de idiomas](/pt-br/blog/config-languages/#ai-context).
- GA4 controla apenas o carregamento de estatísticas, sem controlar busca, RSS ou leitura por máquinas. O complemento estático não tem botão próprio, textos de interface ou controle de estatísticas.
- O ID GA4 e todos os campos do complemento são consumidos atualmente. Não há campos obsoletos extras a preencher. A ausência do ramo de estatísticas em um adaptador antigo apenas mantém o recurso desativado por compatibilidade.

Após alterar, compile e publique novamente. Bloqueios do navegador, rede e configurações do serviço ainda podem afetar estatísticas. Verificar a geração local de texto não substitui a validação das estatísticas online. Volte ao [índice de configuração](/pt-br/blog/config-reference/) para outros módulos.
