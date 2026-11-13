---
tags: ['anglefeint', 'starter']
title: 'Guia 5: ajustar páginas e recursos ao seu gosto'
subtitle: 'Encontre a área que deseja alterar: início, About, Decoder, redes sociais, rodapé, música e paginação.'
description: 'Ajustes pontuais de conteúdo e recursos, com padrões reais, alcance, mesclagem e verificação local.'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta é a parte 5 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Com o blog funcionando, comece pelo que deseja alterar. Não é necessário preencher todas as opções nem copiar todos os exemplos abaixo.

Mescle cada trecho TypeScript no `defineThemeConfig({...})` existente de `src/site.config.ts`. Mantenha apenas um `theme`, um `i18n` e um `social` por objeto, alterando campos existentes e preservando suas outras escolhas. Objetos são mesclados com os padrões; arrays são substituídos inteiramente. Ao acrescentar links, músicas ou itens, inclua também o que deseja manter.

Este artigo oferece configurações comuns por objetivo, não um catálogo completo de campos. Encontre a área da página que quer mudar e leia a seção correspondente.

## 1. Ajustar avisos e efeitos da página inicial

Para diferenciar nome do site, título principal e apresentação, veja [instalar o blog e colocar suas informações](/pt-br/blog/starter-guide-1-configure-your-site/). Aqui alteramos avisos e interações iniciais:

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| Campo                             | Padrão  | Efeito                                                                                                                                          |
| --------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`  | Mostra o trecho Initialize/done; false o oculta.                                                                                                |
| `theme.home.showFollow`           | `true`  | Mostra o trecho Wake Up/Follow; false o oculta independentemente.                                                                               |
| `theme.home.showTrace`            | `true`  | Mostra PIRATE SIGNAL/TRACE na parte inferior; false oculta essa área.                                                                           |
| `theme.effects.enableHomePassage` | `false` | Permite uma passagem Matrix de cerca de 8 segundos antes de navegar pelo título do artigo; com redução de movimento, mantém a navegação direta. |

Esses campos não desligam a chuva de código inteira nem trocam as cores globais. `showTrace` também não controla o terminal de telas largas no canto inferior direito.

### Alterar o texto do terminal de telas largas

O padrão é `Knock, knock.`. Você pode definir primeiro uma configuração em inglês para os idiomas sem substituição própria:

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '记录想法，也留下一点线索。' } } },
  },
},
```

Para uma versão específica, defina `messages.home.transmission` naquele idioma. A prioridade é configuração atual → configuração inglesa → `Knock, knock.`, sem percorrer toda a cadeia normal de textos. O terminal aparece em telas largas; sua ausência no celular não significa erro. O botão de fechadura abre a prévia do corredor.

A entrada Oracle de About usa uma prévia independente, sem depender da passagem de artigos da página inicial. Esse texto e os estados inferiores criam atmosfera; não indicam máquinas, rede ou segurança reais.

Consulte as definições completas desses campos na [referência da página inicial](/pt-br/blog/config-home/#startup-switches).

## 2. Colocar sua apresentação em About

Abra `/zh/about/` para ver o exemplo em chinês. Corpo e contatos são configurados por idioma, sem editar o template da página:

```ts
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: '我是小林，喜欢开发与写作。',
          what: '这里记录我的项目和学习笔记。',
          ethos: ['保持好奇。', '把想法变成可以使用的东西。'],
          now: '最近在整理个人博客。',
          contactLead: '欢迎联系我。',
          signature: '> 谢谢你来这里。',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

Substitua nome e endereços. `metaLine` é o estado no topo do painel. `who`, `what`, `ethos` e `now` representam apresentação, atividades, princípios e momento atual; `contactLead` introduz o contato e `signature` é a assinatura. `ethos` é um array de strings: um array novo substitui todos os itens antigos.

Parágrafos e assinatura são texto simples: `\n` quebra a linha e `\n\n` deixa uma linha vazia. Não interpretam Markdown nem HTML; não use `<br>`. O exemplo altera apenas chinês simplificado. Outros idiomas precisam de textos próprios, sem tradução automática. Campos ausentes seguem as regras de fallback daquele idioma.

Os controles de janela permitem fechar, minimizar ou colocar o painel em tela cheia, guardando o estado localmente no navegador. A saída AI e o progresso de download são demonstrações do tema, sem conectar um serviço de IA ao preencher textos. O decodificador processa a entrada localmente no navegador.

Para dispensar About, use `enableAboutPage: false` dentro de `theme`; o padrão é `true`. As rotas, navegação pública e entradas relacionadas de contato ficam desabilitadas. Links escritos por você no corpo ou rodapé não são apagados automaticamente: confira-os também.

Outros campos estão na [referência de About](/pt-br/blog/config-about/#about-content). Avisos de comandos e do leitor somente leitura estão na [referência do terminal](/pt-br/blog/config-terminal/#messages).

## 3. Ajustar Decoder e os cards de leitura

Decoder Lab fica em `/zh/decoder/` no exemplo e vem habilitado. Sua estética homenageia pioneiros cypherpunk e da liberdade digital. O processamento local e a imagem de redes ponto a ponto remetem à autonomia sobre ferramentas e dados.

Ele decodifica texto, interpreta chamadas de tokens suportadas e verifica formatos de endereço, sem RPC, conexão de carteira ou API Key. Não consulta saldo, executa transações nem comprova propriedade; inserir calldata não verifica o comportamento real de um contrato.

`enableDecoderPage: false` em `theme` desliga a página e suas entradas fornecidas pelo tema. Desabilitar About não desliga Decoder nem o contrário. Links personalizados continuam sob sua responsabilidade.

Textos de homenagem e cards são definidos por idioma. Por exemplo, para substituir a lista em chinês:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        decoderPage: {
          readings: {
            tribute: '思想与代码，让隐私和自由更进一步。',
            links: [
              { title: '我的阅读资料', href: 'https://example.com/', author: '作者名', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` oculta a homenagem, `links: []` oculta os cards e omitir mantém os padrões. Cada item recebe `title` e `href`; `author`, `year` e `cover` são opcionais. `cover` aceita um nome interno, como `privacy-code` ou `bitcoin`, um caminho public ou uma imagem HTTPS. Sem ele, o card não tem imagem.

`links` substitui a lista inteira, sem acrescentar só um card. Inclua os antigos se quiser mantê-los. São links para materiais escolhidos por você; o tema não extrai, republica nem valida automaticamente os recursos externos.

Tipos de campos, capas internas e lista padrão estão na [referência de Decoder](/pt-br/blog/config-decoder/#readings).

## 4. Ajustar redes sociais e rodapé

As contas ficam em `social.links`, compartilhadas pelo topo e rodapé na ordem do array. Para um ícone próprio, coloque primeiro `public/icons/community.svg`:

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: '我的社区', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` aceita SVG, PNG e WebP locais de public, com caminho iniciado em `/`, sem URL remota, query, hash ou caracteres codificados. Tem prioridade sobre `icon` e preserva as cores. Sem ambos, aparece o texto. `label` fornece o nome acessível. Arquivo ausente ou nome de ícone interno não suportado causa erro.

`rel` é opcional e informa relações, por exemplo `rel: 'me'` para sua conta Mastodon. O tema sempre mantém `noopener noreferrer` e não adiciona `me` automaticamente por plataforma. A verificação de identidade é feita pela plataforma: publique o site e informe no perfil o endereço real de uma página com o link de retorno. O tema não garante o resultado.

No celular, as redes do topo ficam ocultas, mas as do rodapé permanecem. `links: []` mantém três ícones provisórios sem clique, não oculta toda a região.

### Créditos, texto e links adicionais do rodapé

```ts
site: { tagline: '保持好奇，持续记录。' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目源码', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` é texto simples próprio; vazio, fica oculto e não é traduzido automaticamente. O antigo padrão `Built with Astro.` é tratado como crédito interno para evitar duplicação.
- `theme.footer.showCredits` é `true` por padrão e controla os créditos do tema e do Astro. Desligar preserva copyright, texto próprio e links. Também controla o crédito do tema nas imagens automáticas de artigos, sem alterar imagens próprias.
- `theme.footer.links` é um array vazio por padrão, exibido entre copyright e créditos, independente dos ícones sociais. Os rótulos mantêm seu texto, sem tradução automática nem dependência de showCredits.

O copyright usa o nome global, com ano definido no build. Depois de mudar textos, créditos ou resultados ligados ao ano, faça novo build e publicação.

Caminhos de ícones, links e créditos estão nos [campos sociais](/pt-br/blog/config-site-chrome/#social-fields) e de [rodapé](/pt-br/blog/config-site-chrome/#footer).

## 5. Habilitar o player de música

Coloque primeiro seu áudio em `public/music/my-song.mp3` e mescle:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: '我的一首歌', artist: '作者', src: '/music/my-song.mp3' }],
  },
},
```

Música vem desabilitada, sem faixas incluídas. Cada faixa exige `title` e `src`; `artist` é opcional. Uma lista vazia não mostra o player. Ao adicionar músicas, mantenha os itens desejados no array. A URL omite `public`, não aceita caminhos do computador nem páginas de compartilhamento. Links HTTPS diretos são suportados, sem espaços ou barras invertidas. Título vazio ou formato de endereço inválido causa erro; formato válido não prova que o arquivo está acessível.

O player aparece nas páginas com o layout comum, sem opção por página. Cada página nova começa recolhida. Na primeira visita, PLAY inicia o carregamento. Ao terminar, passa à próxima faixa; a última volta à primeira. No celular, abrir o player oculta temporariamente o botão de voltar ao topo.

A sessão da aba guarda faixa, posição e volume. Se tocava antes, navegar ou recarregar tenta retomar; uma pausa manual permanece pausada. Não é reprodução sem interrupções, e o navegador pode bloquear o início automático. Sem armazenamento, a reprodução manual continua, mas sem retomada de sessão.

A implementação baixa a faixa inteira e a reproduz como Blob, permitindo buscar na posição sem depender de Range do servidor. Arquivos grandes aumentam espera e memória. Servidores externos precisam permitir CORS; arquivos public da mesma origem não exigem esse ajuste. Confira a URL real e use `theme.music.enabled: false` quando não quiser música.

Campos de faixas, mensagens e limites de retomada estão na [referência do player](/pt-br/blog/config-music/#track-fields).

## 6. Ajustar quantidades e paginação

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` vale 3 por padrão e controla os artigos recentes iniciais. `blogPageSize` vale 10 e controla artigos por página do blog e das tags. Use inteiros positivos razoáveis. Eles não alteram a prévia de até três Fragments; a lista completa usa `theme.fragments.pageSize`.

`windowSize` vale 7, limita a janela de números a 5–21 ao renderizar e não define itens por página. O salto exige `jump.enabled` true e total de páginas maior que `showJumpThreshold`. Por padrão aparece acima de 12 páginas. `enterToGo` permite ou não saltar com Enter.

O padrão de estilo é `random`; o exemplo escolhe `fixed` para fixar uma variante. `sequential` segue a ordem das páginas. `random` sorteia de novo na inicialização do cliente, podendo repetir. Sem JavaScript, permanece o estilo estático do build. `variants` limita a quantidade de variantes a 1–12; `fixedVariant` é limitado ao intervalo atual.

`style.enabled: false` usa o estilo básico, sem remover a paginação. Blog, tags e Fragments compartilham essas opções; confira os efeitos nas três áreas.

Intervalos, variantes e mensagens estão na [referência de Blog List e tags](/pt-br/blog/config-blog-list/#pagination-window).

## 7. Desabilitar só o que não precisa

A tabela mostra o alcance das opções. Configurar um recurso não exige desligar todos os demais.

| Caminho                        | Padrão | Efeito de false                                                           |
| ------------------------------ | ------ | ------------------------------------------------------------------------- |
| `theme.enableAboutPage`        | `true` | Não gera About e oculta as entradas relacionadas do tema.                 |
| `theme.enableDecoderPage`      | `true` | Não gera Decoder e oculta as entradas relacionadas do tema.               |
| `theme.effects.enableRedQueen` | `true` | Oculta o monitor Red Queen do artigo, mantendo os demais efeitos AI.      |
| `theme.search.enabled`         | `true` | Desabilita a entrada da busca de artigos e a geração de índices.          |
| `theme.toc.enabled`            | `true` | Desabilita o sumário padrão; `toc: true` no artigo ainda pode prevalecer. |
| `theme.tags.enabled`           | `true` | Desabilita entradas e páginas de tags, sem apagar artigos.                |
| `theme.math.enabled`           | `true` | Desabilita o processamento matemático Markdown/MDX.                       |
| `theme.socialImage.enabled`    | `true` | Desliga imagens automáticas de artigos; ogImage manual continua válido.   |

Por exemplo, mescle `theme: { effects: { enableRedQueen: false } }` para desligar só o monitor, sem mudar busca, música ou About.

Comentários e Fragments vêm desabilitados e não precisam ser ativados para outros recursos. Quando precisar, consulte [Giscus](/pt-br/blog/starter-guide-4-giscus-comments/) e [publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/). Sumário, fórmulas e imagens de compartilhamento estão em [escrever o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/) e no [guia de imagens](/pt-br/blog/starter-guide-images/).

## 8. Criar uma página própria para projetos

Para apresentar projetos separadamente, execute na raiz:

```bash
npm run new-page -- projects
```

O comando cria `src/pages/[lang]/projects.astro`, com layout `base` por padrão, e gera `/<语言代码>/projects/` para os idiomas ativos, como `/en/projects/` ou `/zh/projects/`. Edite o arquivo Astro para preencher o corpo. Ele não traduz nem acrescenta uma entrada ao menu automaticamente. Ofereça um link no conteúdo ou em links do rodapé.

Use `--theme` quando quiser um estilo específico. Por exemplo, `npm run new-page -- portfolio --theme cyber` cria outra página Cyberpunk. As opções `base`, `ai`, `cyber`, `hacker` e `matrix` alteram o layout daquela página, não as quatro atmosferas globais. Use letras inglesas minúsculas, números e hífens no slug; caminhos aninhados como `projects/labs` são aceitos. Evite rotas padrão do pacote. Arquivos existentes geram erro: não execute as cinco variantes de tema para o mesmo caminho.

## 9. Conferir depois de salvar

Abra em dev as páginas alteradas e confira textos, links e entradas de recursos. Se variáveis antigas estiverem sobrescrevendo valores, siga o [diagnóstico do primeiro guia](/pt-br/blog/starter-guide-1-configure-your-site/). Ícones ausentes, áudios inacessíveis e links externos devem ser investigados pelos caminhos e pela rede, não sobrescrevendo toda a configuração repetidamente.

Antes de publicar, pare dev e execute:

```bash
npm run doctor
npm run preview
```

doctor já prepara arquivos locais, verifica e constrói. Após o sucesso, não repita check ou build imediatamente. A busca precisa ser conferida no preview do build; preview não publica. Atualize o site enviando todo `dist/`. Salvar a configuração local não muda o site online.

## Navegação e referência de configuração

[Anterior: publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/) · [Próximo: permitir comentários dos leitores](/pt-br/blog/starter-guide-4-giscus-comments/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [página inicial](/pt-br/blog/config-home/), [About](/pt-br/blog/config-about/), [terminal](/pt-br/blog/config-terminal/), [Decoder](/pt-br/blog/config-decoder/), [navegação, redes e rodapé](/pt-br/blog/config-site-chrome/), [player](/pt-br/blog/config-music/) e [listas/paginação](/pt-br/blog/config-blog-list/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
