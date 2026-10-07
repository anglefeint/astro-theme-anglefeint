---
tags:
  - anglefeint
  - starter
title: 'Guia 3: Recursos opcionais'
subtitle: 'Música, comentários, Sobre, paginação e opções visuais.'
description: 'Música, comentários, Sobre, paginação e opções visuais.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/matrix-02.webp
---

## Música

Coloque o áudio em public/music/ e mescle:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

Faixas aceitam title, src e artist opcional. Sem faixas, o player fica oculto. A primeira reprodução exige clique. A sessão guarda faixa, posição e volume; retomar depende das permissões do navegador, e pode haver uma pausa entre páginas. Ao terminar a última faixa, a primeira recomeça.

O arquivo completo é baixado antes de tocar; arquivos grandes aumentam espera e memória. Faixas externas exigem CORS. Prefira arquivos locais. enabled: false desativa o player.

## Comentários Giscus

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

mapping: 'pathname' associa discussões ao caminho. 'specific' exige term; 'number' exige number como texto com inteiro positivo. Valores inválidos causam erro. strict e reactionsEnabled usam '0' ou '1'. Se não aparecer, verifique IDs, permissões, conexão e bloqueios do navegador.

## Página Sobre

Os parágrafos e a assinatura de Sobre preservam quebras de linha da configuração: `\n` inicia outra linha e `\n\n` deixa uma linha em branco. Frases longas continuam quebrando automaticamente. É texto simples, sem Markdown ou HTML; não insira `<br>`.

Edite i18n.locales['pt-br'].about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals e effects. ethos é uma lista. Edite os demais idiomas separadamente. As ferramentas da página são demonstrações visuais, não serviços reais de IA. Um e-mail vazio oculta o link. theme.enableAboutPage: false remove página e navegação.

## Contagens e recursos

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 9,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

Use false para desativar um recurso. enableRedQueen controla somente o monitor do artigo. toc: true no artigo pode prevalecer sobre a configuração global. socialImage desativa geração, mas mantém ogImage manual. Os ambientes são definidos pelos layouts, não por um seletor global.

homeLatestCount controla recentes; blogPageSize controla listas e tags. pagination.windowSize varia de 5 a 21. A entrada de salto aparece quando jump.enabled é true e o total excede showJumpThreshold, inicialmente 12. jump.enterToGo controla Enter. style.mode aceita fixed, sequential ou random; random é estável por página, não muda a cada atualização. style.enabled: false mantém paginação básica.

## Mais idiomas e endereço inicial

Adicione um código em i18n.locales com meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages e about. Depois crie artigos com --locales. fallback fornece textos de configuração ausentes; não traduz artigos nem mistura idiomas nas listas. O idioma padrão entra na cadeia de fallback quando necessário. Alterar label muda apenas o nome no menu.

defaultLocalePrefix: 'always' redireciona / para a página inicial localizada; 'never' faz o inverso para o idioma padrão. As rotas dos artigos continuam localizadas.

## Rodapé e verificação

footer.showCredits: false oculta os créditos do tema e do Astro, preservando o ano gerado e site.title. site.tagline adiciona texto independente. O antigo valor Built with Astro. é tratado como crédito interno para evitar duplicação.

Os cartões automáticos usam um fundo incluído de chuva de código, terminais e redes de neon, com o nome do seu site, título e autor. O pequeno crédito `Theme by Anglefeint` no canto inferior direito segue `theme.footer.showCredits` (padrão `true`); `false` oculta os créditos do rodapé e da imagem. Compile e publique novamente após alterar. Arquivos `ogImage` personalizados não são modificados. O fundo funciona offline e não adiciona JavaScript ao navegador.

Mescle todas as opções no mesmo theme ou i18n. Listas substituem listas anteriores. Teste em desenvolvimento, execute npm run doctor e use npm run preview para conferir a busca. Reconstrua e publique para aplicar mudanças.

- [Guia 1: Configure seu blog](/pt-br/blog/starter-guide-1-configure-your-site/)
- [Guia 2: Escreva e organize conteúdo](/pt-br/blog/starter-guide-2-languages-and-routing/)
- [Guia 3: Recursos opcionais](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)
