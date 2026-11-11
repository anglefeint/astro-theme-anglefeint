[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/pt-br/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Um tema Astro cinematográfico com múltiplas atmosferas para publicação pessoal — feito para leitores humanos e agentes de IA.</p>

Gera automaticamente `llms.txt`, índices multilíngues, coletâneas de texto completo e artigos em Markdown para facilitar a leitura e a citação por agentes de IA e apoiar o GEO (otimização para mecanismos generativos).

[Demo](https://demo.anglefeint.com/pt-br/) · [GitHub](https://github.com/anglefeint/astro-theme-anglefeint)

<p align="center">
  <a href="#ai-assistant">Assistente de IA</a> · <a href="#installation">Instalação</a> · <a href="#setup">Configuração do site</a> · <a href="#writing">Escrever</a> · <a href="#upgrade">Atualizar</a> · <a href="#deployment">Compilar e publicar</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="ai-assistant"></a>

## Usar um assistente de IA

Use Cursor, Codex ou Claude Code para configurar o site, escrever artigos e personalizar páginas. Comece pelo AGENTS.md do projeto atual; o código e a configuração real definem o comportamento. CLAUDE.md e as regras do Cursor apontam para as mesmas instruções.

- **Usuários do blog (starter)**: Comece por [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/AGENTS.md) e consulte os guias de [configuração](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/pt-br/starter-guide-1-configure-your-site.md) / [escrita](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/pt-br/starter-guide-2-languages-and-routing.md) conforme a tarefa.
- **Manutenção do tema (main)**: Leia [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) → [fluxo de IA](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/AI_WORKFLOW.md). Consulte a [arquitetura](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md) e siga o [fluxo de sincronização da documentação](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/DOC_SYNC_WORKFLOW.md) para atualizar a documentação após mudar o código.

<a id="installation"></a>

## Instalação

Este template é baseado no **Astro 7**.

Use Node.js 22.12.0 ou superior. Execute os comandos na pasta onde deseja criar seu blog e abra o endereço informado pelo servidor de desenvolvimento.

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Se o blog já existe, execute `npm install` e `npm run dev` nele, sem criar outra cópia. Pare dev com Ctrl+C antes de outros comandos ou use outro terminal. Com pnpm, use `pnpm install` e `pnpm dev`.

<a id="setup"></a>

## Configuração do site

Edite o objeto existente em `src/site.config.ts`. Esse é o ponto único para identidade do site, links sociais, About e opções do tema. Preserve imports/exports e mescle as configurações no objeto existente.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    author: 'Your Name',
    description: 'My notes and projects.',
    url: 'https://your-domain.example',
  },
});
```

Defina `site.url` com o endereço real do site. Se houver `PUBLIC_SITE_URL`, ele tem prioridade. Compile e publique novamente após alterar conteúdo ou configuração.

<a id="writing"></a>

## Escrever artigos

### Criar um artigo

```bash
npm run new-post -- my-first-post --locales pt-br
```

Para criar somente português, use npm run new-post -- my-first-post --locales pt-br. Use letras minúsculas, números e hífens no slug. O arquivo src/content/blog/pt-br/my-first-post.md gera /pt-br/blog/my-first-post/. Arquivos existentes são preservados. --locales cria arquivos, mas não ativa idiomas.

Traduções usam o mesmo slug. Sem tradução, o menu leva à lista do idioma escolhido; hreflang não apresenta essa lista como tradução do artigo.

### Preencher o cabeçalho

```yaml
---
title: 'My first post'
description: 'My notes and projects'
pubDate: '2026-10-03'
tags: ['astro', 'notes']
---
```

title, description e pubDate são obrigatórios. subtitle, updatedDate e author são opcionais; o autor padrão vem do site. Artigos são ordenados por pubDate. Não há filtro de rascunho ou agendamento: draft: true e datas futuras não ocultam artigos. Guarde textos inacabados fora de src/content/blog/.

heroImage: ./cover.jpg usa uma imagem ao lado do artigo. Se houver imagens em src/assets/blog/default-covers/, cada execução escolhe uma capa aleatória e a usa em todos os arquivos de idioma criados nessa execução. Os arquivos existentes são preservados; heroImage pode ser alterado depois. Não baixa imagens. Tempo de leitura e métricas são estimativas; readMinutes, wordCount, tokenCount, aiLatencyMs e aiConfidence podem substituí-las, sem conectar um serviço de IA.

## Páginas independentes

npm run new-page -- projects --theme cyber cria src/pages/[lang]/projects.astro. Edite seu conteúdo; o comando não traduz nem adiciona navegação. Temas: base, ai, cyber, hacker e matrix. Slugs aceitam caminhos como projects/labs. Um arquivo existente causa erro.

- [Guia 2: Escreva e organize conteúdo](https://demo.anglefeint.com/pt-br/blog/starter-guide-2-languages-and-routing/)

## Fragmentos

Fragmentos requer o tema 0.29.0 ou posterior. Atualize blogs existentes antes de usar a configuração e o comando abaixo.

Publique pensamentos breves em Markdown, com comentários opcionais em uma janela. Adicione ao theme existente em src/site.config.ts. Fragmentos e comentários ficam desativados por padrão. O menu aparece abaixo de Decoder Lab.

```ts
fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
```

A geração padrão para todos os idiomas habilitados exige o tema 0.31.0 ou mais recente. Atualize primeiro; nas versões 0.29–0.30, informe `--locales` explicitamente.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Como `new-post`, por padrão cria esqueletos para todos os idiomas habilitados no projeto, com o mesmo ID e data e hora; não traduz o conteúdo. Prioridade: `--locales` → `ANGLEFEINT_LOCALES` → idiomas habilitados. Listas explícitas removem espaços e duplicatas e são convertidas para minúsculas; ignoram a leitura da configuração e criam apenas os diretórios solicitados, sem habilitar idiomas na configuração.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales pt-br
```

Compartilhamento a partir da versão 0.32.0: a data aponta para o fragmento na lista, com um controle de cópia ao lado. Compartilhe `/pt-br/fragments/#fragment-ID`, usando o id do frontmatter Markdown. Somente quando o fragmento não está na página atual é carregado um pequeno índice estático por idioma para localizar sua página. Reconstrua após adicionar conteúdo ou alterar datas ou pageSize, mantendo os IDs. A localização entre páginas e a cópia exigem JavaScript.

Paginação a partir da versão 0.32.0: os fragmentos compartilham com o Blog os números de página, os estilos de neon e o salto de página exibido conforme o limite configurado. `theme.pagination` controla as duas listas; `theme.fragments.pageSize` continua definindo separadamente os fragmentos por página.

[Guia 5: Publicar fragmentos](https://demo.anglefeint.com/pt-br/blog/starter-guide-5-fragments/)

<a id="upgrade"></a>

## Atualizar o tema

O pacote mantém páginas padrão, valores padrão, traduções e funções de build. Artigos, `src/site.config.ts`, músicas, imagens e páginas próprias ficam no projeto.

No novo starter de integração com npm, execute na raiz o comando abaixo. Ele verifica compatibilidade, faz backup dos arquivos de dependências, instala uma versão exata e executa doctor. Em caso de falha, restaura os arquivos e tenta reinstalar as dependências anteriores. Publique pelo fluxo habitual; não há deploy automático.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Projetos anteriores a 0.27 precisam migrar uma vez para um starter novo. Crie-o em outra pasta, copie artigos e recursos e combine os valores pessoais no novo site config. Não copie rotas padrão antigas, adapters ou helpers defaults/schema/runtime. Preserve slugs, caminhos de idiomas, URLs de músicas/imagens e configurações de hospedagem.

O atualizador automático suporta apenas npm e rejeita lockfiles pnpm/yarn/bun. `--check` verifica sem escrever; `--to 0.27.1` escolhe a versão. Veja o [guia](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) e [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## Compilar e publicar

```bash
npm run build
```

O site estático é gerado em `dist/`. Publique **todo o conteúdo** dessa pasta em qualquer hospedagem estática. Não é necessário servidor Node.js em produção nem adaptador de hospedagem.

Use `npm run preview` para conferir o resultado localmente; ele não publica o site. `npm run doctor` reúne verificações e compilação.

Publique na raiz do domínio e sirva o index.html de cada diretório. Subdiretórios exigem adaptação adicional; configurar Astro `base` não é suficiente.

O sitemap usa `updatedDate` ou `pubDate`. A integração combina `X-Robots-Tag: noindex` do JSON do terminal em `dist/_headers`, preservando regras e arquivos originais. Cloudflare Pages e hosts compatíveis aplicam as regras; outros precisam de cabeçalhos equivalentes. Confira a resposta publicada: Astro preview não aplica regras da hospedagem.

<a id="reference"></a>

## Referência de recursos e configuração

Os arquivos do blog e de tags permitem alternar entre cartões e lista e lembram a escolha neste navegador.

### Efeitos da página inicial e decodificadores

Em `src/site.config.ts`, `theme.home.showInitialize` controla Initialize/done, `showFollow` controla Wake Up/Follow e `showTrace` controla o status inferior direito. Todos são `true` por padrão; `false` oculta cada parte separadamente. 0.18.1: Os dois estados inferiores começam ocultos e aparecem separadamente ao passar o mouse ou selecionar o texto. Selecionar tudo revela ambos; o cursor luminoso acompanha apenas o rastreamento à direita.

Configure o título principal da página inicial por idioma em `i18n.locales.<code>.site.homeTitle`, no arquivo `src/site.config.ts`, por exemplo `"pt-br": { site: { homeTitle: "Meu jardim digital" } }`. Também funciona com idiomas adicionados. Valores ausentes ou em branco seguem `meta.fallback` e depois usam `site.title` global ou `PUBLIC_SITE_TITLE`. Apenas o título visível muda; o título do navegador, a navegação, o rodapé, RSS e a identidade SEO mantêm o nome global. Compile e publique novamente.

About inclui um índice localizado e uma seção Contact em destaque. O índice fica ao lado do painel de leitura em telas largas e dentro dele em telas menores. Contact no Frontier abre `/<locale>/about/#contact`; desativar About remove esse link, enquanto Decoder Lab mantém sua opção independente.

About permite fechar, minimizar ou exibir o painel de leitura em tela cheia, com estado local e comandos do terminal. A página padrão da integração é atualizada com o pacote; projetos anteriores a 0.27 seguem a migração inicial acima.

About inclui **Hacker Decryptor**: decodifique Base64/Base64URL, texto URL, hexadecimal, entidades HTML, escapes Unicode e cabeçalho/payload JWT no navegador, com detecção automática e animação numérica com as cores da página. Abra Decryptor na barra lateral; não exige API nem configuração extra.

A versão completa do **Decoder Lab** fica em `/<locale>/decoder/`: histórico local, interpretação ERC-20/TRC-20 (EVM/HyperEVM/TRON) e inspeção de endereços EVM/TRON/Bitcoin. Abra pelo diálogo do About. Use `theme.enableDecoderPage: false` em `src/site.config.ts` para desativar página e link independentemente do About. Sem RPC, conexão de carteira ou chave API.

A partir da versão 0.20.0: a seta independente **Frontier** no cabeçalho também abre o Decoder Lab. Os cartões ilustrados apontam para textos originais e sites de referência ou projetos; os textos não são reproduzidos. Personalize `tribute` e a lista completa `links` em `src/site.config.ts`, em `i18n.locales.<code>.messages.decoderPage.readings`. Texto vazio oculta a homenagem; `links: []` oculta os cartões. Todas as entradas são exibidas, até oito por linha no desktop. Veja o [exemplo](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration).

O visual do Decoder Lab se inspira no movimento **cypherpunk**, em homenagem às suas contribuições à liberdade humana, à privacidade e ao código aberto. A rede ponto a ponto e o processamento local refletem a ideia de manter ferramentas e dados nas mãos de cada pessoa.

Passagem Matrix opcional: `theme.effects.enableHomePassage` é `false` por padrão. Ao ativar, os links de posts na página inicial exibem uma passagem verde de 8 segundos antes da navegação. `Oracle` em About funciona separadamente: cada clique escolhe uma de quatro paletas sem repetir a anterior; após chegar, arraste para olhar ao redor, clique com o botão direito para voltar ao corredor e use Escape ou × para fechar. Com movimento reduzido, a navegação é direta e Oracle mostra uma prévia estática.

Em telas de 1440px ou mais, o terminal inferior direito mostra `Knock, knock.`. O texto pode ser selecionado, copiado e rolado; o botão separado com fechadura inicia o corredor compartilhado. Configure `i18n.locales.en.messages.home.transmission` em `src/site.config.ts` para todos os idiomas e sobrescreva apenas os necessários em `i18n.locales.<code>.messages.home.transmission`. Ordem: configuração do idioma atual → configuração inglesa → `Knock, knock.`; difere da cadeia normal de traduções da interface. Após alterar, gere o build e publique novamente.

## Conteúdo legível por IA

O starter correspondente gera automaticamente `/llms.txt`, índices e arquivos de texto completo por idioma e versões Markdown dos artigos durante `npm run build`. Não é necessária configuração extra: publique todo o conteúdo de `dist/` como de costume. Os arquivos ficam disponíveis após o build e no preview. Para projetos existentes, veja [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

As opções `aiReadableContent.notes` (Markdown) e `aiReadableContent.links` (`{ label, href }[]`) em `src/site.config.ts` acrescentam contexto aos índices, coletâneas e artigos Markdown. Cada campo pode ser substituído em `i18n.locales.<code>.aiReadableContent`: campos omitidos herdam o valor global; `notes: ''` / `links: []` os ocultam. [Detalhes](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#optional-machine-readable-context).

## Links sociais

Configure `social.links` em `src/site.config.ts`; cabeçalho e rodapé compartilham a ordem do array. Adicione apenas os links que você usa:

```ts
// src/site.config.ts — defineThemeConfig({ ... })
social: {
  links: [
    { href: "https://www.youtube.com/@your-channel", label: "YouTube", icon: "youtube" },
    { href: "https://bsky.app/profile/your-handle.bsky.social", label: "Bluesky", icon: "bluesky" },
  ],
},
```

Nomes de `icon` incluídos: `mastodon`, `twitter`, `github`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`.

O campo opcional `rel` aceita valores separados por espaços, como `me` ou `me nofollow`, com ícones, imagens próprias ou texto. Ausente ou vazio mantém `noopener noreferrer`. Os valores são convertidos para minúsculas e deduplicados; as proteções são mantidas e `opener` é ignorado. Nenhuma plataforma adiciona `me` automaticamente: use apenas para sua própria identidade. Para a [verificação do Mastodon](https://docs.joinmastodon.org/user/profile/#link-verification), publique e salve a URL HTTPS nos campos do perfil. Use uma página com o link de retorno, como `/en/`; a página de redirecionamento HTML da raiz pode não contê-lo. A verificação é feita pelo servidor Mastodon.

```ts
{ href: "https://mastodon.social/@yourname", label: "Mastodon", icon: "mastodon", rel: "me" },
```

Para uma imagem própria, coloque `community.svg` em `public/icons/` e defina `iconSrc: "/icons/community.svg"` no link. São aceitos SVG, PNG e WebP locais. Use um caminho iniciado por `/`, sem URL remota, consulta, fragmento ou caracteres codificados. O `base` do Astro é adicionado automaticamente. Arquivos ausentes ou nomes de ícones não suportados geram erro de configuração no desenvolvimento/build.

Prioridade: `iconSrc` → `icon` → texto. Ícones incluídos herdam a cor do menu; imagens próprias mantêm suas cores. `label` fornece o nome acessível. No rodapé, os links quebram linha quando necessário; o cabeçalho mantém uma linha com rolagem horizontal quando falta espaço. Em larguras de até 720px, continuam ocultos no cabeçalho e visíveis no rodapé. Um array `links` vazio mantém os três marcadores não clicáveis. Refaça o build e o deploy após alterações.

## Guia 1: Configure seu blog

### Identidade e endereço inicial

Edite o objeto em src/site.config.ts, mantendo imports e exports. Substitua domínio, nome, autor e textos pelos seus. Mescle o exemplo com suas configurações existentes.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { title: 'My Blog', author: 'Your Name', url: 'https://your-domain.example' },
  i18n: {
    defaultLocale: 'pt-br',
    routing: { defaultLocalePrefix: 'never' },
    locales: {
      'pt-br': {
        site: { hero: 'My Blog' },
        messages: { siteDescription: 'My Blog' },
      },
    },
  },
});
```

site.url define o domínio usado por canonical, RSS, sitemap e imagens sociais. PUBLIC_SITE_URL no ambiente de compilação ou no arquivo .env tem prioridade. Reinicie o desenvolvimento ou reconstrua após alterá-lo. O texto visível da página inicial vem de site.hero do idioma; messages.siteDescription define sua descrição. Alterar apenas site.description não substitui esses textos.

Com defaultLocalePrefix: 'never', a página inicial do idioma padrão aparece diretamente em /. O padrão 'always' redireciona / para /<idioma>/ e pode exibir “Redirecting to home…”. Artigos continuam em /pt-br/blog/ mesmo com 'never'.

Configure social.links com href, label e icon (github, twitter ou mastodon). Uma lista vazia mantém ícones ilustrativos sem links. site.tagline adiciona texto ao rodapé.

Os parágrafos e a assinatura de Sobre preservam quebras de linha da configuração: `\n` inicia outra linha e `\n\n` deixa uma linha em branco. Frases longas continuam quebrando automaticamente. É texto simples, sem Markdown ou HTML; não insira `<br>`.

O rodapé separa copyright, créditos do tema/Astro e o texto opcional `site.tagline`, com ícones sociais abaixo. Os créditos seguem o idioma da página; seu texto permanece igual em todos os idiomas. Texto vazio não ocupa espaço e textos longos quebram linha no celular. A configuração existente e `PUBLIC_SITE_TAGLINE` continuam funcionando; nenhuma migração é necessária.

A opção `theme.footer.links` adiciona uma linha independente ao rodapé: cada item contém `label` e `href`, com pontos entre os links. Omitir a opção ou usar um array vazio oculta a linha. Os rótulos mantêm o texto configurado em todos os idiomas; a linha é independente dos ícones sociais e de `showCredits`.

### Escolher idiomas

Nove idiomas estão ativos: en, ja, ko, es, zh, pt-br, de, ru e zh-hant. Inglês é o padrão inicial. Para desativar idiomas, mescle entradas como estas:

```ts
i18n: {
  locales: {
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
  },
},
```

Omitir um idioma não o desativa: a configuração é mesclada com os padrões. O idioma padrão permanece ativo. Para um blog em apenas um idioma, desative explicitamente os outros oito. Isso não apaga arquivos nem traduz textos.

### Substituir exemplos e escrever

Cada idioma do starter tem uma página de boas-vindas e três guias. Faça backup e remova os exemplos que não quiser; preserve imagens ainda utilizadas.

```bash
npm run new-post -- my-first-post --locales pt-br
```

Comece com um artigo em português do Brasil. Sem `--locales pt-br`, o comando cria modelos para todos os idiomas ativos (inicialmente nove), sem tradução automática. Os arquivos existentes são preservados. Edite título, descrição e corpo em src/content/blog/pt-br/my-first-post.md.

### Regras de configuração

- [Guia 2: Escreva e organize conteúdo](https://demo.anglefeint.com/pt-br/blog/starter-guide-2-languages-and-routing/)

## Idiomas

Nove idiomas ativos por padrão: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`. `new-post` cria nove arquivos inicialmente, sem traduzir o texto. Desative os idiomas desnecessários com `meta.enabled: false` em `src/site.config.ts`; omitir uma entrada não a desativa. O idioma padrão permanece ativo. Para criar só português: `npm run new-post -- my-post --locales pt-br`.

### Sumário e tags

Use títulos Markdown ## e ###. O sumário aparece à direita em telas largas e acima do texto em telas pequenas. Sem títulos, ele fica oculto. toc: false desativa por artigo; toc: true prevalece sobre o padrão do site. Títulos criados por componentes MDX ou HTML não são coletados automaticamente.

tags: ['astro', 'notes'] cria arquivos de tags em /pt-br/tags/. Maiúsculas e minúsculas diferem; espaços nas pontas e duplicatas são removidos. Nomes não latinos recebem URLs codificadas. Renomear uma tag altera seu endereço. theme.tags.enabled: false desativa links e páginas.

### Imagens e código

Use `![Descrição](./photo.jpg)` ou `![Descrição](https://demo.anglefeint.com/images/photo.jpg)`, fornecendo o arquivo correspondente. Imagens comuns do corpo abrem com clique ou Enter/Espaço e fecham com Escape, botão ou fundo. Capas e imagens dentro de links ou botões ficam de fora. A prévia usa a imagem já selecionada pelo navegador, sem baixar um original maior.

Blocos Markdown cercados por três crases recebem um botão de cópia. Ele preserva a formatação e exige HTTPS ou localhost; em caso de falha, copie manualmente.

### Busca

Execute npm run build e npm run preview. A busca pesquisa títulos e corpo no idioma atual. Em dev há apenas um aviso. search: false exclui um artigo do índice, mas não o esconde das listas ou do acesso direto. theme.search.enabled: false desativa a busca e o índice. Reconstrua após editar artigos.

### Imagens de compartilhamento

Sem ogImage, a compilação gera um PNG de 1200×630 com título, autor e nome do site. Isso não altera heroImage. Use ogImage: ./share.png ou /images/share.png para uma imagem própria; HTTPS também funciona. Arquivos locais ausentes causam erro. Imagens externas dependem do serviço externo.

Os cartões automáticos usam um fundo incluído de chuva de código, terminais e redes de neon, com o nome do seu site, título e autor. O pequeno crédito `Theme by Anglefeint` no canto inferior direito segue `theme.footer.showCredits` (padrão `true`); `false` oculta os créditos do rodapé e da imagem. Compile e publique novamente após alterar. Arquivos `ogImage` personalizados não são modificados. O fundo funciona offline e não adiciona JavaScript ao navegador.

ogImage explícito tem prioridade. theme.socialImage.enabled: false desativa só a geração; as demais imagens usam capa ou imagem padrão. Confira og:image no HTML e os arquivos em dist/\_social/. Plataformas podem manter prévias antigas em cache. Emojis e todas as escritas do mundo não são garantidos.

## Guia 3: Recursos opcionais

A demonstração pública usa oito faixas do Free Music Archive; a música continua desativada no starter. Consulte os [créditos musicais](https://demo.anglefeint.com/music/credits.html) para autores, fontes e licenças individuais (CC0 1.0 ou CC BY 4.0). As gravações são separadas da licença MIT do código e não são distribuídas no pacote npm nem no starter. Ao adicionar ou reutilizar música, respeite sua licença e os requisitos de atribuição.

### Música

Coloque o áudio em public/music/ e mescle:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

0.18.1: o player ativado começa compacto em cada página nova; clique em OPEN para expandir. Posição, volume e retomada independem do tamanho inicial.

Faixas aceitam title, src e artist opcional. Sem faixas, o player fica oculto. A primeira reprodução exige clique. A sessão guarda faixa, posição e volume; retomar depende das permissões do navegador, e pode haver uma pausa entre páginas. Ao terminar a última faixa, a primeira recomeça.

O arquivo completo é baixado antes de tocar; arquivos grandes aumentam espera e memória. Faixas externas exigem CORS. Prefira arquivos locais. enabled: false desativa o player.

### Opcional: Google Analytics 4

Adicione ou edite esta opção no nível superior do objeto `defineThemeConfig({...})` existente em `src/site.config.ts` (ao lado de `site`, não dentro de `theme`):

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Copie o **ID de medição** (`G-...`) em Google Analytics → Administrador → Fluxos de dados → seu fluxo da Web. Não é o nome nem o ID numérico da propriedade. Deixe vazio para desativar. Um ID atende todos os idiomas e páginas do tema; compare idiomas pelo caminho da página. Compile e publique novamente, visite o site e confira o relatório Em tempo real do GA4.

O modo de desenvolvimento e as prévias em localhost/loopback não enviam dados. Prévias remotas ou por endereço LAN coletam dados quando configuradas. O starter padrão não carrega scripts do Google. Evite instalação duplicada por GTM, Zaraz ou código manual. Não inclui banner nem gerenciamento de consentimento; se seu site precisar, configure-os antes de ativar a coleta. Bloqueadores podem impedir a medição. Projetos existentes precisam dos arquivos auxiliares de configuração e do adaptador correspondentes; consulte o [guia de atualização](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

### Comentários Giscus

`shareAcrossLocales: false` (default) — `mapping: 'pathname'`

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

`shareAcrossLocales: false`: mapping: 'pathname' associa discussões ao caminho. 'specific' exige term; 'number' exige number como texto com inteiro positivo. Valores inválidos causam erro. strict e reactionsEnabled usam '0' ou '1'. Se não aparecer, verifique IDs, permissões, conexão e bloqueios do navegador.

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

[Guia de comentários](https://demo.anglefeint.com/pt-br/blog/starter-guide-4-giscus-comments/)

### Página Sobre

Edite i18n.locales['pt-br'].about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals e effects. ethos é uma lista. Edite os demais idiomas separadamente. As ferramentas da página são demonstrações visuais, não serviços reais de IA. Um e-mail vazio oculta o link. theme.enableAboutPage: false remove página e navegação.

### Contagens e recursos

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 10,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

Use false para desativar um recurso. enableRedQueen controla somente o monitor do artigo. toc: true no artigo pode prevalecer sobre a configuração global. socialImage desativa geração, mas mantém ogImage manual. Os ambientes são definidos pelos layouts, não por um seletor global.

homeLatestCount controla recentes; blogPageSize controla listas e tags. pagination.windowSize varia de 5 a 21. A entrada de salto aparece quando jump.enabled é true e o total excede showJumpThreshold, inicialmente 12. jump.enterToGo controla Enter.

Os modos são `fixed`, `sequential` e `random`. Com JavaScript, o padrão `random` escolhe novamente as cores do contêiner e dos botões a cada carregamento; os resultados podem se repetir. Sem JavaScript, o HTML gerado mantém uma variante estável do contêiner e cores estáticas nos botões. `style.enabled: false` usa a variante básica sem desativar a paginação.

### Mais idiomas e endereço inicial

Adicione um código em i18n.locales com meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages e about. Depois crie artigos com --locales. fallback fornece textos de configuração ausentes; não traduz artigos nem mistura idiomas nas listas. O idioma padrão entra na cadeia de fallback quando necessário. Alterar label muda apenas o nome no menu.

defaultLocalePrefix: 'always' redireciona / para a página inicial localizada; 'never' faz o inverso para o idioma padrão. As rotas dos artigos continuam localizadas.

### Rodapé e verificação

footer.showCredits: false oculta os créditos do tema e do Astro, preservando o ano gerado e site.title. site.tagline adiciona texto independente. O antigo valor Built with Astro. é tratado como crédito interno para evitar duplicação.

Mescle todas as opções no mesmo theme ou i18n. Listas substituem listas anteriores. Teste em desenvolvimento, execute npm run doctor e use npm run preview para conferir a busca. Reconstrua e publique para aplicar mudanças.

- [Guia 2: Escreva e organize conteúdo](https://demo.anglefeint.com/pt-br/blog/starter-guide-2-languages-and-routing/)

## Prévia

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Capturas das páginas

![Home](public/images/theme-previews/preview-home.jpg)

![Blog](public/images/theme-previews/preview-blog-list.jpg)

| Blog · Visualização em lista                                               |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

![Article](public/images/theme-previews/preview-blog-post.jpg)

![About](public/images/theme-previews/preview-about.jpg)

![Paginação do blog](public/images/theme-previews/preview-blog-list-pagination.jpg)

![Artigos relacionados](public/images/theme-previews/preview-blog-post-related.jpg)

![Decoder Lab](public/images/theme-previews/preview-decoder.jpg)

| Decoder Lab · Recursos cypherpunk                                                    |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |

## Licença

MIT — [LICENSE](LICENSE).

## Fórmulas matemáticas

Artigos Markdown e MDX aceitam matemática no estilo LaTeX globalmente por padrão. Use `$C_{saved}$` em linha ou uma fórmula entre linhas separadas com `$$`. Não é necessário configurar cada artigo nem instalar plugins adicionais.

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

Desative com `theme: { math: { enabled: false } }` em `src/site.config.ts`. Escape dólares ambíguos como `\$`; trechos de código permanecem literais. Ao desativar, voltam as regras normais de MDX, incluindo expressões JavaScript entre chaves.

A renderização ocorre na compilação, com estilos e fontes locais e MathML acessível, sem motor matemático no navegador. Fórmulas longas têm rolagem horizontal. Erros interrompem a compilação indicando origem e causa. Mantenha títulos e descrições em texto simples; fórmulas ficam fora da busca. O suporte é à sintaxe matemática do KaTeX, não a documentos LaTeX completos.

No starter integrado 0.27+, o pacote conecta automaticamente o processador Markdown e as fórmulas. Somente estruturas anteriores a 0.27 precisam da migração inicial; não copie implementações de processadores nem adapters para o projeto novo.

## Estatísticas dos artigos

A contagem é aproximada: caracteres CJK individualmente e o restante principalmente por espaços. Tokens são estimados por `round(max(words, 1) × 1.3)`, não por um tokenizador nem pelo uso real de IA. A partir de 1.000, usa-se uma casa decimal e k. `wordCount`, `tokenCount` e `readMinutes` no frontmatter substituem valores separadamente; mudar apenas wordCount não recalcula tokens. O código-fonte de fórmulas e MDX pode afetar as estimativas.

## Imagem padrão e IDs curtos de Fragment (0.33.0+)

Adicione site.ogImage ao objeto site existente em src/site.config.ts. Use um caminho a partir de public (/images/share.jpg corresponde a public/images/share.jpg) ou uma URL HTTPS. Em branco, utiliza a imagem Anglefeint incluída de 1200×630. Fragments e todos os links #fragment-ID compartilham essa imagem. As imagens específicas e geradas dos artigos mantêm prioridade; com a geração desativada, a capa do artigo também precede a imagem do site. Reconstrua e publique após alterar; plataformas podem manter a prévia em cache.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment gera um Nano ID de oito letras e dígitos, diferencia maiúsculas e minúsculas, verifica IDs Markdown de todos os idiomas e repete em caso de colisão. Cada execução compartilha ID e data entre idiomas. São aceitos apenas IDs alfanuméricos com exatamente oito caracteres. UUIDs e IDs longos antigos não são suportados: exclua e publique novamente, sem migração ou compatibilidade com links antigos. Preserve o novo ID publicado; alterá-lo cria outra associação de comentários.
