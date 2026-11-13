[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/pt-br/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Tema Astro de publicação pessoal com atmosferas cinematográficas para leitores humanos e agentes de IA.</p>

Gera `llms.txt`, índices multilíngues, coletâneas integrais e Markdown de publicações para leitura e citação por agentes de IA, com suporte a GEO (otimização para mecanismos generativos).

<p align="center">
  <a href="https://demo.anglefeint.com/">Demo online</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Repositório</a>
</p>

<p align="center">
  <a href="#ai-assistant">Assistente de IA</a> · <a href="#installation">Instalação</a> · <a href="#setup">Configuração</a> · <a href="#writing">Escrever</a> · <a href="#upgrade">Atualização</a> · <a href="#deployment">Compilação e implantação</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## O que o Anglefeint oferece?

Escreva publicações com Markdown/MDX e ideias curtas com Fragments. Inclui idiomas, busca, tags, sumário, cópia de código, prévia de imagens, matemática e imagens sociais automáticas. Comentários, música e GA4 podem ser ativados conforme necessário.

| Página                 | Atmosfera visual                                                         |
| ---------------------- | ------------------------------------------------------------------------ |
| Página inicial         | Matrix: chuva verde de código, terminal e avatar em pixels               |
| Blog e listas de tags  | Cyberpunk: neon, chuva e feixes de luz urbanos                           |
| About                  | Hacker: apresentação pessoal, terminal virtual e ferramentas interativas |
| Detalhes da publicação | AI: rede de fundo, monitores e painel de leitura OUTPUT                  |

A compilação também gera Markdown público de publicações, About e Fragments, `llms.txt` e coletâneas multilíngues para ferramentas de IA. Não exige servidor de produção separado e não garante inclusão ou citação por modelos.

<a id="ai-assistant"></a>

## Colabore com um assistente de IA

Cursor, Codex ou Claude Code podem configurar o site e gerenciar conteúdo seguindo o `AGENTS.md` do projeto atual. `CLAUDE.md` e regras Cursor existentes apontam às orientações correspondentes. Explique o que deseja alterar e peça ao assistente que consulte a configuração real e a seção deste documento; para detalhes de campos, use os dicionários do demo.

Para desenvolver o tema, comece por [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) e pelo [guia de contribuição](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md). Quem usa o blog não precisa aprender primeiro o fluxo de publicação dos mantenedores.

<a id="installation"></a>

## 1. Instale e inicie

Requer **Node.js 22.12.0 ou superior**. O template usa **Astro 7**. Execute na pasta onde deseja guardar o blog:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

No assistente, aceite instalar as dependências (Yes). `--no-ai` evita instruções genéricas adicionais de IA; o starter já inclui as orientações do tema. Se optar por pular a instalação, execute `npm install` dentro de `my-blog` antes de iniciar dev.

Abra a URL exibida no terminal. Em projeto existente, execute `npm install` e `npm run dev` na pasta original; não recrie o blog. Pare com Ctrl+C. Execute os próximos comandos na raiz do projeto após parar dev ou em outro terminal.

Projetos novos também podem usar `pnpm install` e `pnpm dev`. Mantenha um gerenciador por projeto. Os exemplos seguintes usam npm; o atualizador automático só atende projetos npm atualmente.

Passo a passo: [Instale o blog e coloque suas informações](https://demo.anglefeint.com/pt-br/blog/starter-guide-1-configure-your-site/).

<a id="setup"></a>

## 2. Primeira configuração: suas informações

O projeto instalado já inclui `src/site.config.ts`. **Abra e edite esse arquivo; não crie outro arquivo nem declare um novo objeto de configuração.**

Acrescente o trecho `site` dentro do `defineThemeConfig({ ... })` existente e troque nome, autor, descrição e domínio. O starter omite site para usar os padrões do tema. Se já existir, edite os campos internos e preserve o resto, sem duplicar o objeto. Mantenha import, export e as outras configurações.

```ts
site: {
  title: 'Meu blog',
  author: 'Seu nome',
  description: 'Projetos, leituras e vida cotidiana.',
  url: 'https://your-domain.example',
},
```

Isso altera apenas as informações globais, sem mudar idiomas. Sem `homeTitle` localizado, o título grande inicial usa `title` global. Apresentação inicial, conteúdo About e links sociais também podem ser seus; consulte o tutorial e os dicionários ao fim desta seção.

`site.url` é o endereço público de produção, não a URL dev local. `PUBLIC_SITE_URL` da hospedagem tem prioridade; confira essa variável se o domínio antigo continuar após alterar a configuração.

A configuração inicial ativa nove idiomas, com inglês padrão; `/` leva a `/en/`. Ler este README em português não exige mudar o idioma do blog. Para trocar padrão ou publicar só alguns idiomas, siga o [tutorial de idiomas](https://demo.anglefeint.com/pt-br/blog/starter-guide-languages/). Omitir um idioma não o desativa; o padrão fica sempre ativo e o sistema não traduz publicações automaticamente. Pode apagar exemplos após backup ou commit Git, sem apagar imagens ainda referenciadas.

Tutoriais: [Instalação e configuração inicial](https://demo.anglefeint.com/pt-br/blog/starter-guide-1-configure-your-site/), [Idiomas e endereço inicial](https://demo.anglefeint.com/pt-br/blog/starter-guide-languages/). Referências: [Site e interface pública](https://demo.anglefeint.com/pt-br/blog/config-site-chrome/), [Página inicial](https://demo.anglefeint.com/pt-br/blog/config-home/).

<a id="writing"></a>

## 3. Escreva sua primeira publicação

Crie uma publicação na raiz do projeto:

```bash
npm run new-post -- my-first-post
```

Sem `--locales` ou `ANGLEFEINT_LOCALES`, lê todos os idiomas ativos do projeto e cria um esqueleto com o mesmo nome em cada um. A configuração inicial tem nove idiomas, portanto cria nove arquivos; se você alterou os controles de idioma, usa a seleção ativa. Não traduz o corpo nem sobrescreve arquivos existentes.

Os arquivos ficam em `src/content/blog/<locale>/my-first-post.md`, com URL `/<locale>/blog/my-first-post/` e lista `/<locale>/blog/`. Inglês usa `src/content/blog/en/my-first-post.md`; chinês usa `src/content/blog/zh/my-first-post.md`. Abra os arquivos desejados e edite título, descrição e corpo, sem criar rotas manualmente. Exemplo mínimo:

```md
---
title: 'Meu primeiro artigo'
description: 'Reflexões sobre começar este blog.'
pubDate: '2026-11-13'
---

Comece a escrever aqui.
```

O exemplo mostra só os obrigatórios. Pode manter a capa e outros campos opcionais já gerados. Use nomes em letras minúsculas, dígitos e hífens, como `my-first-post`.

Para criar apenas idiomas específicos, use `--locales`. São alternativas, não etapas para executar todas:

```bash
# 只生成英文
npm run new-post -- my-first-post --locales en

# 只生成中文
npm run new-post -- my-first-post --locales zh

# 生成指定的多种语言
npm run new-post -- my-first-post --locales en,zh
```

`--locales` seleciona arquivos, sem ativar idiomas. Eles precisam estar ativos na configuração para gerar páginas. Os arquivos novos da mesma chamada compartilham uma capa padrão aleatória, se houver imagens no conjunto de origem. Arquivos existentes continuam preservados.

Também pode selecionar com `ANGLEFEINT_LOCALES`. Prioridade: `--locales` → ambiente → idiomas ativos do projeto. Em Bash, `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`. Em PowerShell, use diretamente os comandos `--locales` acima.

**Não há ocultação automática de rascunhos ou datas futuras.** Os esqueletos de todos os idiomas também são públicos na compilação. Termine o conteúdo desejado antes de publicar e retire arquivos ainda privados da coleção. `draft: true` e `search: false` não tornam uma publicação privada.

Tutoriais: [Primeira publicação](https://demo.anglefeint.com/pt-br/blog/starter-guide-2-languages-and-routing/), [Imagens](https://demo.anglefeint.com/pt-br/blog/starter-guide-images/). Referência: [Detalhes e frontmatter](https://demo.anglefeint.com/pt-br/blog/config-article/).

## 4. Publique um fragment

Fragments servem para texto curto, imagens ou código. **O tema e um starter novo vêm com fragments desativados; o demo os ativa por conta própria.** Para ativar, configure `fragments.enabled: true` dentro do objeto `theme` existente em `src/site.config.ts`. Abaixo está a estrutura mesclada; não duplique theme:

```ts
theme: {
  fragments: { enabled: true },
},
```

Se já estiver `enabled: true`, não repita. Se for false, troque por true. Controla a lista e a entrada de prévia inicial; comentários continuam desativados por padrão.

Crie um fragment. Por padrão, gera esqueletos do mesmo conteúdo em todos os idiomas ativos:

```bash
npm run new-fragment
```

Para idiomas específicos, escolha os parâmetros:

```bash
# 只生成中文
npm run new-fragment -- --locales zh

# 生成指定的多种语言
npm run new-fragment -- --locales en,zh
```

Cada execução cria uma entrada nova. Escolha a alternativa necessária; não execute todas. A seleção do CLI não muda os controles de idioma do site.

Arquivos em `src/content/fragments/<locale>/`, com nomes como `2026-11-13-aB3dE6gH.md`. O terminal mostra os caminhos reais. Edite o corpo e preserve o ID alfanumérico de oito caracteres. Traduções da mesma chamada compartilham ID e data. Não execute novamente a criação para editar a mesma entrada.

A lista fica em `/<locale>/fragments/`, como `/en/fragments/` e `/zh/fragments/`. Com conteúdo no idioma atual, a página inicial mostra a entrada do avatar. Links estáveis usam `/<locale>/fragments/#ID`; página não é identidade. Mudar ID afeta links e comentários. Comentários de fragments vêm desativados.

Tutorial: [Publique um fragment](https://demo.anglefeint.com/pt-br/blog/starter-guide-5-fragments/). Referência: [Fragments](https://demo.anglefeint.com/pt-br/blog/config-fragments/).

## 5. Crie páginas personalizadas

Use `new-post` para publicações e `new-page` para apresentações de projetos, portfólio e outras páginas:

```bash
npm run new-page -- projects
```

Gera `src/pages/[lang]/projects.astro` com tema `base`. Edite o conteúdo e abra `/<locale>/projects/`, como `/en/projects/`. Um arquivo gera páginas para todos os idiomas ativos, sem traduzir conteúdo nem acrescentar navegação automaticamente.

Para escolher estilo, use `--theme`: `base`, `matrix`, `cyber`, `hacker` ou `ai`. Por exemplo, `npm run new-page -- portfolio --theme cyber` cria outra página Cyberpunk.

Aceita caminhos aninhados:

```bash
npm run new-page -- projects/labs --theme hacker
```

Cada segmento usa minúsculas, números e hífens, sem maiúsculas, sublinhado ou barras nas extremidades. Não sobrescreve arquivos nem recria caminhos padrão reservados do tema.

Passo a passo: [Personalização de páginas](https://demo.anglefeint.com/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/).

## 6. Prepare imagens e preserve os arquivos gerados

Use imagens Markdown comuns no corpo. Coloque `photo.jpg` ao lado da publicação e escreva `![Descrição da imagem](./photo.jpg)`. Configure a capa com `heroImage: ./cover.jpg` no frontmatter, preparando o arquivo. URLs de public não incluem o prefixo public.

Capas e imagens locais compatíveis dos fragments precisam de arquivos responsivos persistentes. Prepare localmente ou apenas valide os arquivos atuais:

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

Dev, build e doctor, inclusive em CI, preparam as imagens locais utilizadas e reutilizam os derivados válidos. Preserve os originais; versionar também `src/assets/blog/covers/`, com `manifest.json` e `generated/`, permite reutilizar derivados sem depender do cache da plataforma. Originais ausentes ou inválidos continuam causando erros.

**Requer 0.36.2 ou posterior:** Dev, build e doctor (inclusive em CI) reutilizam derivados válidos e geram os ausentes, desatualizados ou danificados. Na versão 0.36.1, prepare as imagens primeiro com dev ou `prepare-covers` antes de build/CI. `prepare-covers --check` e a sincronização da configuração continuam sendo verificações somente de leitura.

Esse comando não significa comprimir todas as imagens comuns do corpo. Veja escopo, caminhos e imagens sociais no [tutorial de imagens](https://demo.anglefeint.com/pt-br/blog/starter-guide-images/).

<a id="reference"></a>

## Configure recursos quando precisar

Esta página cobre comandos comuns e primeiras operações. Para ajustar recursos, abra o tutorial ou a referência correspondente. Os dicionários explicam tipo, padrão, limites, exemplos e campos não usados.

| Objetivo                                              | Tutorial                                                                                                                                                                                   | Dicionário                                                                                                                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Página inicial, identidade, navegação, redes e rodapé | [Páginas e recursos](https://demo.anglefeint.com/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                             | [Página inicial](https://demo.anglefeint.com/pt-br/blog/config-home/), [Site e interface pública](https://demo.anglefeint.com/pt-br/blog/config-site-chrome/)                                         |
| Quantidade, tags e paginação                          | [Páginas e recursos](https://demo.anglefeint.com/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                             | [Blog List e tags](https://demo.anglefeint.com/pt-br/blog/config-blog-list/)                                                                                                                          |
| Sumário, matemática, OUTPUT ou inclusão na busca      | [Primeira publicação](https://demo.anglefeint.com/pt-br/blog/starter-guide-2-languages-and-routing/)                                                                                       | [Publicações](https://demo.anglefeint.com/pt-br/blog/config-article/), [Busca e descoberta](https://demo.anglefeint.com/pt-br/blog/config-search/)                                                    |
| About, terminal ou Decoder                            | [Páginas e recursos](https://demo.anglefeint.com/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                             | [About](https://demo.anglefeint.com/pt-br/blog/config-about/), [Terminal](https://demo.anglefeint.com/pt-br/blog/config-terminal/), [Decoder](https://demo.anglefeint.com/pt-br/blog/config-decoder/) |
| Ativar música ou comentários                          | [Música](https://demo.anglefeint.com/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/), [Comentários](https://demo.anglefeint.com/pt-br/blog/starter-guide-4-giscus-comments/) | [Música](https://demo.anglefeint.com/pt-br/blog/config-music/), [Giscus e discussões compartilhadas](https://demo.anglefeint.com/pt-br/blog/config-comments/)                                         |
| Idiomas, estatísticas ou complemento público          | [Idiomas](https://demo.anglefeint.com/pt-br/blog/starter-guide-languages/), [Publicação](https://demo.anglefeint.com/pt-br/blog/starter-guide-deployment/)                                 | [Idiomas e fallback](https://demo.anglefeint.com/pt-br/blog/config-languages/), [GA4 e complementos IA](https://demo.anglefeint.com/pt-br/blog/config-analytics-ai/)                                  |

Sem saber onde procurar, abra o [índice de configuração](https://demo.anglefeint.com/pt-br/blog/config-reference/). Alterar textos de um idioma não traduz conteúdo. Alterações de configuração e conteúdo exigem nova compilação e implantação.

<a id="upgrade"></a>

## 7. Atualize um blog existente

Instalações novas podem pular para [validação, prévia e primeira implantação](#deployment).

Salve alterações, por exemplo em commit Git. Pare dev e preview. Na raiz original, confira compatibilidade e depois atualize:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` não modifica arquivos, instala ou compila. Atualização efetiva atende ao starter integrado com npm, `package-lock.json` e `anglefeint.projectSchema: 1`. Projetos pnpm/yarn/bun não podem contornar a restrição apagando o lockfile.

O atualizador muda a dependência do tema e executa doctor, preservando publicações, configuração pessoal, música, imagens e páginas próprias. Guarda os dois arquivos de dependências em `.anglefeint/backups/`; não é backup integral. Em falha de instalação/verificação, restaura esses arquivos e tenta reinstalar dependências antigas. Não publique `dist/` remanescente após falha.

Para uma versão específica, `npx @anglefeint/astro-theme@latest upgrade --to <versão>`, substituindo pelo número explícito compatível. Sem downgrade automático. A atualização bem-sucedida já verificou e compilou: use `npm run preview` sem repetir build imediatamente. Não publica o site automaticamente nem migra versões Astro incompatíveis.

Estruturas copiadas anteriores a 0.27 exigem criar outro starter, preservar o projeto antigo e migrar conteúdo/recursos pessoais. Não suportam atualização direta no mesmo lugar. Não copie rotas padrão ou implementações de adaptadores antigos.

Passos e recuperação: [Atualizar projeto existente](https://demo.anglefeint.com/pt-br/blog/starter-guide-1-configure-your-site/), [Guia de atualização](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md), [Versões](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## 8. Valide, visualize e publique pela primeira vez

Pare dev na raiz, valide e compile, depois abra a prévia:

```bash
npm run doctor
npm run preview
```

`npm run doctor` inclui validação e compilação. `npm run check` é sinônimo; escolha um, sem repetir check ou build imediatamente após sucesso. Para só verificar Astro/TypeScript, `npm run check:no-build`. preview mostra os arquivos compilados localmente; Ctrl+C para parar e não envia o site. Busca real também exige preview após compilação; dev só mostra um aviso.

Se só precisa compilar sem a validação completa, use este outro grupo. Escolha apenas um:

```bash
npm run build
npm run preview
```

Em pnpm, use `pnpm run doctor` / `pnpm preview` ou `pnpm build` / `pnpm preview`. Não abrevie para `pnpm doctor`, pois executa diagnósticos do próprio pnpm. Escolha um grupo e evite compilar duas vezes.

Na primeira implantação estática:

1. Defina `site.url` ou `PUBLIC_SITE_URL` para a URL oficial. Versione conteúdo-fonte, imagens originais e derivados.
2. Configure `npm run build` como comando e `dist` como pasta publicada. Em envio manual, publique **todo o conteúdo de dist** de uma compilação bem-sucedida.
3. Inclua `_astro/`, `pagefind/`, `_social/` e textos públicos gerados, não só HTML.
4. Use a raiz do domínio e roteamento por index de diretórios. Subcaminhos arbitrários ainda exigem adaptação; definir base do Astro não garante suporte integral.
5. Vincule domínio e HTTPS na hospedagem e confira página inicial, publicações, idiomas, imagens e busca.

A saída é estática, sem servidor Node.js de produção ou adaptador extra de hospedagem. Cabeçalhos noindex do JSON do terminal são mesclados em `dist/_headers`. Plataformas compatíveis aplicam o arquivo; outras precisam de configuração equivalente. Astro preview não simula cabeçalhos da hospedagem. Recompile e publique tudo após mudar conteúdo/configuração.

Passo a passo: [Publique o blog em seu domínio](https://demo.anglefeint.com/pt-br/blog/starter-guide-deployment/).

## Licença

Este tema usa a [MIT License](LICENSE).

## Prévias

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Prévia de compartilhamento

![Imagem social padrão Anglefeint](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### Capturas de páginas

| Página inicial                                                 | Lista do blog                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · Modo lista                                                          |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| Publicação                                                               |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| Paginação do blog                                                                   | Publicações relacionadas                                                                |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ![Paginação do blog](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![Publicações relacionadas](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · Recursos cypherpunk                                                    |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
