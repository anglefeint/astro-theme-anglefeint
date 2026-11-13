---
tags: ['anglefeint', 'starter']
title: 'Guia 1: instalar o blog e colocar suas informações'
subtitle: 'Execute o blog localmente, personalize suas informações e crie artigos pelo fluxo padrão; ajuste idiomas e textos quando precisar.'
description: 'Da instalação e das informações pessoais à criação padrão e verificação local, com opções de idiomas e instruções para atualizar projetos existentes.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Esta é a parte 1 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Ao terminar este artigo, você poderá abrir o blog no seu computador, substituir o nome do site, a apresentação da página inicial e os contatos pelos seus e saberá onde escrever artigos. Música, comentários e personalização de páginas podem ser configurados quando precisar.

Se você já tem um projeto Anglefeint, edite as configurações nesse projeto. Para atualizar o tema, consulte “Como atualizar um projeto existente” no final; não é necessário instalar outro blog.

<a id="tutorial-order"></a>

## Como ler os oito guias?

Na primeira utilização, você pode seguir a ordem abaixo. Fragments, comentários e ajustes de idiomas são opcionais: não é necessário ativá-los para concluir a instalação. O idioma deste guia não exige mudar o idioma padrão do projeto; faça essa alteração apenas quando precisar, seguindo a seção correspondente. Depois, para alterar apenas um campo, consulte diretamente o [índice da referência de configuração](/pt-br/blog/config-reference/).

| Ordem | Guia                                                                                                     | O que você poderá fazer                                                                  |
| ----- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1     | [Instalar o blog e colocar suas informações](/pt-br/blog/starter-guide-1-configure-your-site/)           | Executar o blog, alterar suas informações e entender o fluxo padrão.                     |
| 2     | [Escrever o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/)                         | Criar artigos e usar datas, títulos, tags, código e fórmulas.                            |
| 3     | [Adicionar imagens a artigos e Fragments](/pt-br/blog/starter-guide-images/)                             | Colocar originais, definir capas, preparar e versionar imagens derivadas.                |
| 4     | [Publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/)                                           | Criar um Fragment, preservar seu ID estável e adicionar imagens e código.                |
| 5     | [Ajustar páginas e recursos ao seu gosto](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/) | Alterar páginas, música e paginação e criar páginas personalizadas.                      |
| 6     | [Permitir comentários dos leitores](/pt-br/blog/starter-guide-4-giscus-comments/)                        | Conectar o Giscus e escolher como associar discussões de artigos, Fragments e traduções. |
| 7     | [Receber leitores de outros idiomas](/pt-br/blog/starter-guide-languages/)                               | Escolher idiomas, ajustar o endereço inicial e adicionar traduções.                      |
| 8     | [Publicar o blog no seu domínio](/pt-br/blog/starter-guide-deployment/)                                  | Conferir os arquivos gerados, publicar o site completo e conectar um domínio.            |

Você pode voltar a este índice pelo início ou pelo final de cada artigo para continuar ou encontrar o assunto desejado.

## 1. Instalar e abrir o blog

Prepare Node.js 22.12.0 ou mais recente e npm. Execute os dois comandos abaixo no terminal e confirme que exibem os números de versão:

```bash
node --version
npm --version
```

Crie o blog no diretório onde deseja guardar o projeto. O comando abaixo cria a pasta `my-blog`, sem instalar as dependências automaticamente:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Você pode substituir `my-blog` por outro nome; altere também o nome depois de `cd`. Abra o endereço local exibido no terminal. Não presuma uma porta fixa: ela pode mudar se estiver ocupada. O servidor de desenvolvimento permanece em execução; pressione `Ctrl+C` para pará-lo.

Todos os próximos comandos devem ser executados na raiz desse projeto, a pasta que contém `package.json`. Para reabrir um projeto existente, entre nessa pasta e execute `npm run dev`. Só é necessário executar `npm install` na primeira instalação ou quando as dependências mudarem.

Este artigo usa npm. Um projeto novo com pnpm pode usar `pnpm install` e `pnpm dev` para instalar e iniciar, mas o atualizador automático apresentado no final aceita apenas projetos npm. Use o mesmo gerenciador de pacotes ao longo do projeto.

## 2. Colocar suas informações e os textos da página inicial

O projeto instalado já contém `src/site.config.ts`. Abra esse arquivo e edite-o; não crie outro arquivo de configuração nem declare outro objeto. O starter omite `site` por padrão, usando os valores do tema. Adicione os campos abaixo dentro do `defineThemeConfig({ ... })` existente. Se o arquivo já tiver `site`, altere seus campos, preserve as outras configurações e não adicione outro objeto com o mesmo nome. Mantenha os imports, exports e o restante do arquivo.

```ts
site: {
  title: '小林的博客',
  description: '记录开发、阅读和生活。',
  url: 'https://example.com',
  author: '小林',
  tagline: '保持好奇，持续记录。',
},
```

Este trecho mostra membros do objeto existente, não um novo arquivo completo. Substitua o nome, os textos e o domínio pelos seus; ele não altera o idioma padrão nem a lista de idiomas habilitados. Em `site.url`, coloque o domínio definitivo, como `https://your-domain.example`, e não o endereço local ou a URL de um artigo. Se ainda não tiver domínio, mantenha o exemplo temporariamente e troque antes de publicar. O tema considera publicação na raiz do domínio; definir apenas o `base` do Astro não garante compatibilidade com subdiretórios.

Cada campo controla:

| Campo              | Efeito real                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `site.title`       | Nome global usado no título das páginas, na navegação, no rodapé etc.; também é o último recurso para o título principal da página inicial quando não há um título específico. |
| `site.author`      | Autor padrão dos artigos sem um autor próprio.                                                                                                                                 |
| `site.url`         | Endereço público usado em canonical, RSS, sitemap, imagens de compartilhamento e outras saídas.                                                                                |
| `site.description` | Descrição padrão do site; a página inicial prefere o `messages.siteDescription` resolvido e usa este valor se aquele estiver vazio.                                            |
| `site.tagline`     | Texto adicional do rodapé; `''` o oculta. Os créditos do tema e do Astro têm outra opção.                                                                                      |

### Alterar os textos iniciais de um idioma quando precisar

A apresentação visível e a metadescrição da página inicial são configuradas por idioma. O exemplo abaixo usa a página inicial em inglês, idioma padrão do projeto. Adicione ou mescle `i18n` no objeto existente; se ele já existir, altere apenas os campos correspondentes:

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero` controla a apresentação visível abaixo do título principal em inglês; `messages.siteDescription` controla sua descrição SEO. Definir o primeiro como `''` limpa o texto visível sem limpar o segundo. Substitua en por outro código habilitado para alterar os textos daquele idioma. Isso não altera o idioma padrão nem traduz os demais automaticamente.

O título principal usa o nome global por padrão. Para usar outro título, adicione `homeTitle` ao mesmo `en.site`, mantendo `hero`:

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

Esse `site` fica em `i18n.locales.en`, não no `site` de nível superior. `homeTitle` altera apenas o título visível da página inicial, sem substituir o nome do site no título do navegador, navegação, rodapé ou RSS. Quando ausente ou composto apenas por espaços, a resolução segue a cadeia de fallback e, por último, usa o nome global. Consulte a [referência da página inicial](/pt-br/blog/config-home/#home-title) para os detalhes.

### Colocar seus links sociais

Adicione ou altere `social.links` no objeto existente e substitua `yourname` pela sua conta real:

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

Cada link tem `href`, o destino, e `label`, o nome acessível. `icon` é um nome opcional de ícone interno. Os nomes disponíveis são `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp` e `line`.

`social.links` é compartilhado entre o topo e o rodapé, respeitando a ordem do array. Em telas de celular, os links do topo ficam ocultos, mas os do rodapé permanecem. Arrays substituem a lista inteira: ao adicionar uma conta, mantenha os itens que deseja continuar exibindo. Se ainda não quiser contas, use `social: { links: [] }`. A lista vazia deixa três ícones de exemplo sem links, não oculta toda a área.

### Alterou e nada mudou?

Verifique primeiro `.env`, os arquivos `.env.*` aplicáveis na raiz do projeto e as variáveis de build da hospedagem:

- `PUBLIC_SITE_TITLE` substitui o nome do site.
- `PUBLIC_SITE_AUTHOR` substitui o autor padrão.
- `PUBLIC_SITE_URL` substitui o endereço público.
- `PUBLIC_SITE_DESCRIPTION` substitui a descrição global, mas não uma descrição inicial localizada não vazia.
- `PUBLIC_SITE_TAGLINE` substitui o texto adicional do rodapé.

Remova as variáveis que não precisar e centralize esses valores no arquivo de configuração; não é necessário criar `.env` para usar o tema. Depois de alterar variáveis, reinicie o servidor de desenvolvimento. O site publicado precisa de novo build e nova publicação: salvar arquivos locais não altera a página online.

## 3. Manter os idiomas padrão e ajustar quando precisar

A configuração inicial habilita nove idiomas: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru` e `zh-hant`. O padrão é `en`. Acessar `/` redireciona para `/en/`. Ler este guia não exige mudar o blog para outro idioma nem desabilitar idiomas para escrever o primeiro artigo.

Se quiser outro idioma padrão, apenas alguns idiomas ou uma página inicial padrão diretamente em `/`, siga o [sétimo guia: receber leitores de outros idiomas](/pt-br/blog/starter-guide-languages/). São opções. Omitir um idioma da configuração não o desabilita: é preciso definir `meta.enabled: false`. O idioma padrão permanece habilitado. Desabilitar idiomas não apaga os artigos.

Os tipos, valores padrão e endereços estão na [referência de idiomas](/pt-br/blog/config-languages/#registry). O sistema não traduz artigos nem textos iniciais. Ao seguir a criação padrão abaixo, observe quais arquivos de idioma foram gerados.

## 4. Substituir os exemplos pelos seus artigos

As publicações ficam em `src/content/blog/<语言代码>/`. `welcome-to-anglefeint.md`, `starter-guide-*.md` e `config-*.md` são publicações comuns do starter: boas-vindas, oito tutoriais e dicionário de configuração. Após backup ou commit, mantenha ou remova conteúdo por idioma. Apagar boas-vindas e tutoriais não apaga o dicionário. Não apague imagens ainda referenciadas.

Crie um artigo pelo fluxo padrão:

```bash
npm run new-post -- my-first-post
```

Sem `--locales` nem `ANGLEFEINT_LOCALES`, o comando cria um esqueleto de mesmo nome para todos os idiomas habilitados; na configuração inicial, são nove arquivos. Ele não traduz o conteúdo e ignora arquivos existentes, sem sobrescrevê-los.

Abra `src/content/blog/<语言代码>/my-first-post.md` e preencha título, descrição e corpo. A URL é `/<语言代码>/blog/my-first-post/`. Por exemplo, o arquivo em inglês fica em en e usa `/en/blog/my-first-post/`; em chinês simplificado, fica em zh e usa `/zh/blog/my-first-post/`. Antes de publicar, mova os esqueletos incompletos e não públicos para fora da coleção. Eles não são rascunhos ocultados automaticamente.

Se quiser criar apenas um idioma, use `npm run new-post -- my-first-post --locales zh`. Para idiomas específicos, use `--locales en,zh`. São alternativas opcionais, não etapas para executar todas; `--locales` não habilita um idioma.

Para campos, capas, código e fórmulas, consulte [escrever artigos e gerenciar conteúdo](/pt-br/blog/starter-guide-2-languages-and-routing/).

## 5. Conferir as alterações localmente

Volte à página de desenvolvimento e confira se o nome e a apresentação foram trocados, o menu de idiomas está como deseja, o artigo abre e os links sociais apontam para contas reais. Artigos de outros idiomas só geram rotas quando o idioma correspondente está habilitado.

Antes de conferir o build, pare o servidor com `Ctrl+C` e execute:

```bash
npm run doctor
npm run preview
```

O `doctor` local prepara imagens responsivas ausentes ou desatualizadas, executa a verificação do Astro e faz o build; com About habilitado, verifica também sua configuração de execução. Após o sucesso, não é necessário repetir `check` ou `build` imediatamente. Se uma etapa falhar, resolva o erro do terminal antes de executar `doctor` novamente. Não publique um `dist/` remanescente de uma falha.

`preview` serve o site estático já gerado em `dist/`; abra o endereço do terminal. Ele não publica o blog na internet. A pesquisa de artigos precisa ser verificada nesse preview, pois `dev` não tem pesquisa completa em tempo real. Pare a prévia com `Ctrl+C`.

Ao publicar, a hospedagem usa `npm run build` e o diretório de saída `dist`, com todos os arquivos. Após adicionar ou trocar imagens locais, execute dev ou doctor localmente e faça commit dos originais e de todo `src/assets/blog/covers/` gerado. O build de publicação e o doctor em CI apenas validam essas imagens e falham se faltarem ou estiverem desatualizadas; não as geram na hospedagem. Mudanças de conteúdo ou configuração exigem novo build e publicação.

## Como atualizar um projeto existente

Um blog recém-instalado não precisa executar esta seção. Em um projeto existente, salve suas mudanças, por exemplo com um commit, pare dev e preview e execute na raiz original:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check` consulta a versão alvo e verifica o projeto e a compatibilidade de Node.js e Astro, sem alterar arquivos, instalar ou construir. Depois que passar, faça a atualização:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

A atualização automática aceita o starter integrado com npm e `package-lock.json`. O `package.json` deve conter `anglefeint.projectSchema: 1`, e o pacote do tema fornece as páginas padrão. A presença de lockfiles de pnpm, yarn ou bun interrompe o processo: não os apague para contornar a proteção. Projetos com outro gerenciador devem preservar esse gerenciador, verificar a compatibilidade antes de atualizar e executar o doctor do projeto; o atualizador automático não fornece rollback desse fluxo.

O atualizador troca a dependência do tema e executa doctor sem reescrever artigos, configurações, músicas, imagens ou páginas próprias. Ele copia `package.json` e `package-lock.json` para `.anglefeint/backups/`; isso não é um backup do site inteiro. Se a instalação ou o doctor falhar, restaura esses dois arquivos e tenta reinstalar as dependências antigas. Se essa reinstalação também falhar, corrija a dependência indicada e execute `npm run doctor` com sucesso. Os arquivos de build anteriores não são restaurados: não publique `dist/` após uma falha.

Se Node.js, Astro ou o schema do starter forem incompatíveis, a atualização para; ela não migra o Astro automaticamente. `--to` permite escolher uma versão explícita e compatível do tema, sem downgrade automático. Consulte as mudanças em [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases). Após o sucesso, use diretamente `npm run preview` para conferir o build e publique pelo fluxo habitual, sem construir tudo novamente só por ter atualizado.

O esqueleto copiado anterior a 0.27 não aceita atualização automática no lugar. Instale um starter novo em outro diretório conforme este artigo, mantenha o projeto antigo, migre artigos e recursos e mescle seus valores no novo `src/site.config.ts`. Não copie rotas padrão antigas, adapters nem auxiliares defaults/schema/runtime. Confira slugs, caminhos de idioma, URLs de música e imagens, domínio e hospedagem antes das verificações e da publicação.

## Navegação e referência de configuração

[Próximo: escrever o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [site, redes sociais e rodapé](/pt-br/blog/config-site-chrome/), [título e apresentação inicial](/pt-br/blog/config-home/) e [idiomas](/pt-br/blog/config-languages/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
