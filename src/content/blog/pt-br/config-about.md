---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: About'
subtitle: 'Apresentação, contato, ferramentas e textos das janelas'
description: 'Campos About, padrões reais, limites de texto, ferramentas e opções antigas sem efeito.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Para substituir sua apresentação, leia o [tutorial de páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/). Instalação e configuração estão no [primeiro tutorial](/pt-br/blog/starter-guide-1-configure-your-site/). Outros módulos estão no [índice de configuração](/pt-br/blog/config-reference/).

About não lê o corpo de uma publicação Markdown. O conteúdo fica em `i18n.locales.<locale>.about` de `src/site.config.ts`; os títulos de página e seções ficam em messages.about do mesmo idioma. Abaixo estão os padrões do pacote, não a apresentação pessoal do demo.

<a id="page-enabled"></a>

## theme.enableAboutPage: ativar a página

- **Tipo / padrão:** boolean / true.
- **Estado e efeito:** ativo. Gera `/<locale>/about/` nos idiomas ativos. Desativar remove a geração padrão e os destinos About da navegação pública e Contact.
- **Limites:** não oculta uma só seção nem apaga a configuração. Acesso direto à página desativada não redireciona automaticamente. Exige nova compilação e implantação; desativar não garante apagar arquivos antigos ou dados já públicos.
- **Exemplo:** `theme: { enableAboutPage: false }`.

<a id="about-content"></a>

## Conteúdo e ferramentas do About

Todas as tabelas abaixo têm prefixo **`i18n.locales.<locale>.about.`**. Por exemplo, `sections.who` completo é `i18n.locales.zh.about.sections.who`. Os tipos são os campos substituíveis antes da mescla; todos são opcionais, preenchidos por fallback e padrões. zh/en usam a mesma configuração de placeholders ingleses de about, portanto compartilham os padrões abaixo. Outros idiomas podem ter traduções próprias; não deduza seus valores a partir destes.

Strings não têm validação universal de comprimento ou URL. Use textos curtos, emails e links válidos conforme a função. Arrays precisam ser string[] e substituem o conjunto inteiro, sem mescla por item. String vazia não é um controle universal de desativação; veja cada linha. Os exemplos são valores dos campos, no nível de objeto adequado.

<a id="body-fields"></a>

### Corpo

| Campo                  | Tipo     | Padrão zh / en                                                                                       | Estado, efeito e limites                                                       | Exemplo                                                            |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | Ativo: linha de estado acima do título; string vazia oculta a linha            | `"profile ready"`                                                  |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | Ativo: corpo da seção Who, sem mudar o título                                  | `"Sou desenvolvedor front-end."`                                   |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | Ativo: corpo da seção What                                                     | `"Estou criando um blog pessoal e ferramentas de código aberto."`  |
| `sections.ethos`       | string[] | sections.ethos nos [arrays padrão](#array-defaults)                                                  | Ativo: cada item é um princípio. Array vazio limpa itens, sem ocultar o título | `["Clareza em primeiro lugar.","Entregas pequenas e constantes."]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | Ativo: corpo da seção Now                                                      | `"Ultimamente estou estudando Astro."`                             |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | Ativo: início do contato, combinado com introduções e links seguintes          | `"Vamos conversar."`                                               |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | Ativo: citação final, também incluída no about.md virtual                      | `"Mantenha a curiosidade."`                                        |

<a id="contact-fields"></a>

### Contato

| Campo                 | Tipo   | Padrão zh / en                  | Estado, efeito e limites                                                                                                       | Exemplo                         |
| --------------------- | ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`             | Condicional: email vazio após trim omite link e contactEmailLead. O link usa a string original; evite espaços nas extremidades | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"` | Ativo: URL de contato independente de social.links. Vazio não oculta automaticamente todo o link. Prefira HTTPS completo       | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                      | Ativo: texto visível do link anterior; pode ter nome diferente de GitHub                                                       | `"Meu GitHub"`                  |

<a id="tool-fields"></a>

### Entradas de ferramentas

| Campo                | Tipo   | Padrão zh / en         | Estado, efeito e limites                                                                                              | Exemplo                         |
| -------------------- | ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `sidebar.dlData`     | string | `"DL Data"`            | Ativo: botão lateral DL Data e nome acessível; renomear não altera a função                                           | `"Painel de dados"`             |
| `sidebar.ai`         | string | `"AI"`                 | Ativo: botão AI e nome acessível                                                                                      | `"Minhas ferramentas"`          |
| `sidebar.decryptor`  | string | `"Decryptor"`          | Ativo: entrada lateral do decoder, não os botões internos                                                             | `"Ferramenta de decodificação"` |
| `sidebar.help`       | string | `"Help"`               | Ativo: entrada do painel de teclado                                                                                   | `"Teclado"`                     |
| `sidebar.allScripts` | string | `"All Scripts"`        | Ativo: entrada do diretório de publicações do idioma atual                                                            | `"Todos os artigos"`            |
| `scriptsPath`        | string | `"/root/bash/scripts"` | Ativo: caminho exibido, prefixo dos arquivos virtuais e diretório inicial do terminal. Não é disco local nem servidor | `"/home/me/notes"`              |

<a id="label-fields"></a>

### Textos gerais

| Campo                       | Tipo   | Padrão zh / en    | Estado, efeito e limites                                                                                                             | Exemplo            |
| --------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `labels.modalOutput`        | string | `"Output"`        | Só placeholder inicial no HTML da janela; ao abrir é substituído pelo title correspondente de modals, sem nomear a ferramenta aberta | `"Saída"`          |
| `labels.modalClose`         | string | `"Close"`         | Ativo: nome acessível do fechamento de ferramentas e conteúdo, sem desativar a função                                                | `"Fechar"`         |
| `labels.responseOutput`     | string | `"Output"`        | Ativo: rótulo OUTPUT acima do corpo                                                                                                  | `"OUTPUT"`         |
| `labels.contactEmailLead`   | string | `"Reach me via"`  | Condicional: antes do link de email não vazio                                                                                        | `"E-mail:"`        |
| `labels.contactConnectLead` | string | `"or connect on"` | Ativo: sempre antes do contato, mesmo sem email. Cuide da continuidade da frase                                                      | `"Visite também"`  |
| `labels.backToTop`          | string | `"Back to top"`   | Condicional: dica e nome acessível do topo, sem mudar o limite de exibição                                                           | `"Voltar ao topo"` |
| `labels.quickAccess`        | string | `"Quick access"`  | Ativo: nome acessível da navegação de ferramentas                                                                                    | `"Atalhos"`        |
| `labels.contactEmailLabel`  | string | `"email"`         | Condicional: texto visível do email, não o endereço. Só aparece com email não vazio                                                  | `"Enviar e-mail"`  |

<a id="modal-fields"></a>

### Janelas de ferramentas

| Campo                                     | Tipo     | Padrão zh / en                                       | Estado, efeito e limites                                                                                      | Exemplo                                     |
| ----------------------------------------- | -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                   | Condicional: título da janela da animação de dados                                                            | `"Transferência de dados"`                  |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                    | Condicional: subtítulo da animação; não baixa arquivos                                                        | `"Dados de demonstração"`                   |
| `modals.ai.title`                         | string   | `"AI"`                                               | Condicional: título do painel de texto AI                                                                     | `"Ferramentas e fluxos de trabalho"`        |
| `modals.ai.lines`                         | string[] | modals.ai.lines nos [arrays padrão](#array-defaults) | Condicional: texto estático unido por quebras, sem chamar IA. Array vazio gera pre vazio; o painel ainda abre | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                 | Condicional: título atual da janela de decoder; ainda utilizado                                               | `"Decodificador local"`                     |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                               | Não usado atualmente: texto do calculador antigo, não lido por DecoderForm                                    | `"Calculando"`                              |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                      | Não usado atualmente; não altera o decoder atual                                                              | `"Chaves testadas"`                         |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                              | Não usado atualmente; não altera o decoder atual                                                              | `"Senha atual"`                             |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                       | Não usado atualmente; não altera o decoder atual                                                              | `"Chave principal"`                         |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                    | Não usado atualmente; não altera o decoder atual                                                              | `"Chave temporária"`                        |
| `modals.help.title`                       | string   | `"Help"`                                             | Condicional: título do painel de teclado                                                                      | `"Painel do teclado"`                       |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                             | Condicional: título das estatísticas; string vazia usa inglês integrado                                       | `"Estatísticas de digitação"`               |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                       | Condicional: prefixo da contagem digitada; string vazia usa inglês integrado                                  | `"Você digitou:"`                           |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                       | Condicional: sufixo da contagem; string vazia usa inglês integrado                                            | `"caracteres"`                              |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                               | Condicional: título do diretório, independente de scriptsPath e sem sincronização automática                  | `"Índice de artigos"`                       |

<a id="effect-fields"></a>

### Efeitos

| Campo                      | Tipo     | Padrão zh / en                                               | Estado, efeito e limites                                                                                        | Exemplo                   |
| -------------------------- | -------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `effects.backgroundLines`  | string[] | effects.backgroundLines nos [arrays padrão](#array-defaults) | Não aparece no About padrão atual; só usado no fallback sem sessão de terminal interativo. Não controla o fundo | `["~ $ hello","ready"]`   |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                           | Condicional: aviso ao atingir 30% de rolagem; vazio usa context parsed                                          | `"Você chegou até aqui"`  |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                         | Condicional: aviso a 60%; vazio usa inference stable                                                            | `"Continue explorando"`   |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                         | Condicional: aviso a 90%; vazio usa output finalized                                                            | `"Obrigado pela leitura"` |

O corpo é texto simples, sem interpretar Markdown/HTML. O estilo preserva quebras de parágrafo; sintaxes de **negrito**, links ou tags HTML não viram texto rico. Esvaziar o corpo não remove automaticamente títulos e sumário. A ordem e as cinco âncoras who / what / ethos / now / contact são fixas.

Para `scriptsPath`, use um diretório virtual absoluto curto iniciado por /, como /home/me/notes, sem quebras, caracteres nulos ou conflito com arquivos. O terminal normaliza . e .. e barras repetidas. Caminhos com mais de 1024 caracteres ou controles inválidos podem impedir inicialização do sistema virtual. Não executa shell do sistema nem lê diretórios arbitrários do servidor. Os arquivos vêm das publicações atuais do idioma e de `about.md` gerados pelo tema. All Scripts não é uma lista configurável de scripts executáveis.

DL Data é só animação de progresso, sem download real. model, latency e outros textos padrão do painel AI também são estáticos, sem estado de modelo em tempo real. Troque por informações pessoais verdadeiras ou identifique a demonstração.

Os três textos de estatísticas Help são inseridos pelo script no HTML do painel. Use textos curtos confiáveis, sem entradas externas na configuração. Strings vazias nesses três campos voltam ao inglês, sem limpar rótulos. Corpo About e linhas AI usam outra renderização; nem toda configuração aceita HTML.

Avisos de rolagem usam o progresso do documento inteiro. Após iniciar a rolagem, cada limite dispara no máximo uma vez por inicialização. Não contam palavras lidas ou progresso IA. Sem limites/duração públicos; string vazia não desativa avisos.

<a id="array-defaults"></a>

### Padrões dos três arrays

São os arrays completos efetivos de zh/en. Ordem e linhas vazias têm significado; substituir o array troca todos os itens.

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## Títulos e textos de controles compartilhados

Ficam em `i18n.locales.<locale>.messages`, não no objeto about de conteúdo. Todos string opcionais, com textos integrados atuais e fallback. A tabela mostra só padrões em chinês simplificado / inglês. Preencha o campo correspondente. Mudar texto não ativa funções nem altera IDs de seção.

### messages.about

| Campo               | Padrão em chinês simplificado / inglês                                                                  | Efeito e limites                                                                                               | Exemplo                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | Condicional: título da página, h1, título da janela e about.md virtual                                         | `"Sobre mim"`                                         |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | Condicional: metadescrição; não acrescenta apresentação automática abaixo do título                            | `"Minha trajetória, meu trabalho e meus interesses."` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | Condicional: título e sumário da seção Who, sem alterar corpo ou âncora                                        | `"Quem sou"`                                          |
| `about.what`        | 我在构建什么 / What I Build                                                                             | Condicional: título e sumário What                                                                             | `"O que faço"`                                        |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | Condicional: título e sumário Ethos                                                                            | `"Meus princípios"`                                   |
| `about.now`         | 现在 / Now                                                                                              | Condicional: título e sumário Now                                                                              | `"No que estou trabalhando"`                          |
| `about.contact`     | 联系 / Contact                                                                                          | Condicional: título e sumário Contact; âncora continua contact                                                 | `"Fale comigo"`                                       |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | Condicional: texto, dica e nome acessível do botão de varredura final; só efeito visual, sem IA ou regeneração | `"Repetir varredura"`                                 |

### messages.windowControls

| Campo                       | Padrão em chinês simplificado / inglês | Efeito e limites                                                                   | Exemplo        |
| --------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content            | Condicional: minimizar conteúdo e recolher ferramentas                             | `"Minimizar"`  |
| `windowControls.expand`     | 放大窗口 / Expand window               | Condicional: ampliar ferramentas; conteúdo usa fullscreen para tela cheia          | `"Ampliar"`    |
| `windowControls.restore`    | 还原窗口 / Restore window              | Condicional: restaurar janela e entradas de restauração                            | `"Restaurar"`  |
| `windowControls.fullscreen` | 全屏阅读 / Full screen                 | Condicional: solicita tela cheia do navegador para leitura, sem alterar permissões | `"Tela cheia"` |

### messages.scriptFolders

| Campo                     | Padrão em chinês simplificado / inglês                                                                       | Efeito e limites                                                                              | Exemplo                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | Condicional: dica e nome acessível de copiar título em All Scripts; não copia o texto inteiro | `"Copiar título"`                              |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | Condicional: confirmação de cópia                                                             | `"Título copiado"`                             |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | Condicional: falha de cópia; string vazia pode usar aviso inglês no script                    | `"Não foi possível copiar; copie manualmente"` |

<a id="example"></a>

## Exemplo para mesclar

Mescle ao `defineThemeConfig({...})` existente de `src/site.config.ts`. Preserve import, export e configurações pessoais, sem duplicar theme ou i18n.

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    'pt-br': {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: 'Sou desenvolvedor front-end.',
          what: 'Estou criando um blog pessoal e ferramentas de código aberto.',
          ethos: ['Clareza em primeiro lugar.', 'Entregas pequenas e constantes.'],
          now: 'Ultimamente estou estudando Astro.',
          contactLead: 'Vamos conversar.',
          signature: 'Mantenha a curiosidade.',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: 'Índice de artigos' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: 'Sobre mim', description: 'Minha trajetória, meu trabalho e meus interesses.' },
      },
    },
  },
},
```

Mescla recursivamente a cadeia de idiomas da prioridade menor para maior; o idioma atual supera os fallbacks e a base About completa o restante. Arrays substituem tudo; undefined não sobrescreve. Configurar só zh não muda todos os idiomas. Veja ativação e cadeia no [tutorial multilíngue](/pt-br/blog/starter-guide-languages/).

<a id="boundaries"></a>

## Configurações relacionadas e opções ausentes

- **Navegação e sumário:** `i18n.locales.<locale>.messages.nav.about` controla a entrada pública e reabertura após fechar, string, padrão chinês “关于” / inglês “About”; exemplo “Sobre mim”. `messages.blog.toc` define título e nome acessível do sumário About, string, padrão chinês “文章目录” / inglês “On this page”; exemplo “Nesta página”. Também afeta publicações; veja [textos de publicações](/pt-br/blog/config-article/#article-messages).
- **Página completa do decoder:** `theme.enableDecoderPage` é boolean, padrão true. `theme: { enableDecoderPage: false }` desativa a página independente e o link de ferramenta completa da janela, sem desativar o decoder embutido. Usa messages.decoder e messages.decoderPage, detalhados no [dicionário Decoder](/pt-br/blog/config-decoder/), não os cinco campos antigos de corpo decryptor acima.
- **Terminal:** messages.terminal é texto compartilhado de interação, distinto de about.effects.backgroundLines. O terminal é um sistema virtual limitado no navegador; configuração não autoriza programas locais. Veja os dezesseis campos, placeholders e estados não usados no [dicionário do terminal](/pt-br/blog/config-terminal/).
- **Janelas e animação:** sem opções públicas About para dimensões, fechamento inicial, fade do corpo, ocultar ferramentas, ordenar sumário, renomear ou desativar Oracle independentemente. Runtime e armazenamento local controlam janelas. O corpo é legível sem JavaScript, mas ferramentas podem não funcionar. O corpo fica visível desde o início, sem depender de observador de rolagem. Redução de movimento do sistema é tratada pelo runtime, não um novo controle desta página.
- **Contato:** contact de About é independente de `social.links`. Mudar links do rodapé não muda automaticamente o contato.

Os cinco campos antigos decryptor continuam aceitos pelo tipo, mas não são consumidos. `backgroundLines` só tem ramo de fallback e `modalOutput` é placeholder inicial, ambos explicitados. Não os use para configurar ferramentas atuais nem altere a implementação para corresponder aos textos antigos.
