---
tags:
  - anglefeint
  - starter
title: 'Guia 2: Escreva e organize conteúdo'
subtitle: 'Artigos, imagens, tags, sumário, busca e compartilhamento.'
description: 'Artigos, imagens, tags, sumário, busca e compartilhamento.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-03.webp
---

## Criar um artigo

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

Para criar somente português, use npm run new-post -- my-first-post --locales pt-br. Use letras minúsculas, números e hífens no slug. O arquivo src/content/blog/pt-br/my-first-post.md gera /pt-br/blog/my-first-post/. Arquivos existentes são preservados. --locales cria arquivos, mas não ativa idiomas.

Traduções usam o mesmo slug. Sem tradução, o menu leva à lista do idioma escolhido; hreflang não apresenta essa lista como tradução do artigo.

## Preencher o cabeçalho

```yaml
---
title: 'My first post'
description: 'My notes and projects'
pubDate: '2026-10-03'
tags: ['astro', 'notes']
---
```

title, description e pubDate são obrigatórios. subtitle, updatedDate e author são opcionais; o autor padrão vem do site. Artigos são ordenados por pubDate. Não há filtro de rascunho ou agendamento: draft: true e datas futuras não ocultam artigos. Guarde textos inacabados fora de src/content/blog/.

heroImage: ./cover.jpg usa uma imagem ao lado do artigo. O comando escolhe uma capa estável quando há arquivos em src/assets/blog/default-covers/. Não baixa imagens. Tempo de leitura e métricas são estimativas; readMinutes, wordCount, tokenCount, aiLatencyMs e aiConfidence podem substituí-las, sem conectar um serviço de IA.

## Sumário e tags

Use títulos Markdown ## e ###. O sumário aparece à direita em telas largas e acima do texto em telas pequenas. Sem títulos, ele fica oculto. toc: false desativa por artigo; toc: true prevalece sobre o padrão do site. Títulos criados por componentes MDX ou HTML não são coletados automaticamente.

tags: ['astro', 'notes'] cria arquivos de tags em /pt-br/tags/. Maiúsculas e minúsculas diferem; espaços nas pontas e duplicatas são removidos. Nomes não latinos recebem URLs codificadas. Renomear uma tag altera seu endereço. theme.tags.enabled: false desativa links e páginas.

## Imagens e código

Use `![Descrição](./photo.jpg)` ou `![Descrição](/images/photo.jpg)`, fornecendo o arquivo correspondente. Imagens comuns do corpo abrem com clique ou Enter/Espaço e fecham com Escape, botão ou fundo. Capas e imagens dentro de links ou botões ficam de fora. A prévia usa a imagem já selecionada pelo navegador, sem baixar um original maior.

Blocos Markdown cercados por três crases recebem um botão de cópia. Ele preserva a formatação e exige HTTPS ou localhost; em caso de falha, copie manualmente.

## Busca

Execute npm run build e npm run preview. A busca pesquisa títulos e corpo no idioma atual. Em dev há apenas um aviso. search: false exclui um artigo do índice, mas não o esconde das listas ou do acesso direto. theme.search.enabled: false desativa a busca e o índice. Reconstrua após editar artigos.

## Imagens de compartilhamento

Sem ogImage, a compilação gera um PNG de 1200×630 com título, autor e nome do site. Isso não altera heroImage. Use ogImage: ./share.png ou /images/share.png para uma imagem própria; HTTPS também funciona. Arquivos locais ausentes causam erro. Imagens externas dependem do serviço externo.

Os cartões automáticos usam um fundo incluído de chuva de código, terminais e redes de neon, com o nome do seu site, título e autor. O pequeno crédito `Theme by Anglefeint` no canto inferior direito segue `theme.footer.showCredits` (padrão `true`); `false` oculta os créditos do rodapé e da imagem. Compile e publique novamente após alterar. Arquivos `ogImage` personalizados não são modificados. O fundo funciona offline e não adiciona JavaScript ao navegador.

ogImage explícito tem prioridade. theme.socialImage.enabled: false desativa só a geração; as demais imagens usam capa ou imagem padrão. Confira og:image no HTML e os arquivos em dist/\_social/. Plataformas podem manter prévias antigas em cache. Emojis e todas as escritas do mundo não são garantidos.

## Páginas independentes

npm run new-page -- projects --theme cyber cria src/pages/[lang]/projects.astro. Edite seu conteúdo; o comando não traduz nem adiciona navegação. Temas: base, ai, cyber, hacker e matrix. Slugs aceitam caminhos como projects/labs. Um arquivo existente causa erro.

- [Guia 1: Configure seu blog](/pt-br/blog/starter-guide-1-configure-your-site/)
- [Guia 2: Escreva e organize conteúdo](/pt-br/blog/starter-guide-2-languages-and-routing/)
- [Guia 3: Recursos opcionais](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)
