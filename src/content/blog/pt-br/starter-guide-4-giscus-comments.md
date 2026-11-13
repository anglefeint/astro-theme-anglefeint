---
tags: ['anglefeint', 'starter']
title: 'Guia 6: permitir comentários dos leitores'
subtitle: 'Conecte Giscus, habilite comentários de artigos ou Fragments e escolha se traduções compartilham discussões.'
description: 'Preparação do Giscus, configuração, associação de artigos, compartilhamento entre idiomas, diferenças dos Fragments e diagnóstico de carregamento.'
pubDate: '2026-11-10'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta é a parte 6 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Anglefeint usa Giscus para comentários, desabilitados por padrão. Artigos e Fragments têm opções independentes. Comentários e reações ficam nas GitHub Discussions configuradas por você, sem adicionar um banco de comentários ao site estático.

Prepare o repositório uma vez e depois decida se traduções compartilham a discussão. Não é necessário alterar templates de artigos nem colar scripts em cada um.

## 1. Preparar o repositório e a categoria

Abra a [configuração Giscus em chinês simplificado](https://giscus.app/zh-CN) e siga as verificações:

1. Escolha um repositório GitHub público seu para os comentários, o mesmo do blog ou outro dedicado.
2. Habilite Discussions.
3. Instale e autorize o aplicativo Giscus nesse repositório.
4. Selecione uma categoria e guarde as informações geradas de repositório e categoria.

A página gera um script, mas o tema só precisa destes valores:

| Atributo Giscus    | Campo do tema                                               |
| ------------------ | ----------------------------------------------------------- |
| `data-repo`        | `theme.comments.repo`, como `yourname/your-repository`.     |
| `data-repo-id`     | `theme.comments.repoId`, ID do repositório, não seu nome.   |
| `data-category`    | `theme.comments.category`, nome real da categoria.          |
| `data-category-id` | `theme.comments.categoryId`, ID da categoria, não seu nome. |

Não use IDs de exemplo, URL do repositório ou nome de usuário como ID real. A categoria não precisa se chamar Announcements: use o nome e o ID que você selecionou. Não instale outro pacote npm Giscus nem informe token ou senha do GitHub.

Comentários dependem de serviços externos: a página precisa acessar Giscus e GitHub. Para comentar, o visitante autoriza o GitHub; também pode participar diretamente na Discussion correspondente. O tema não oferece comentários anônimos próprios. Consulte o comportamento externo na [documentação oficial Giscus](https://giscus.app/zh-CN).

## 2. Habilitar comentários de artigos

Mescle no `defineThemeConfig({...})` existente de `src/site.config.ts`:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

Substitua conta, repositório, categoria e os dois IDs de exemplo. Se `theme` ou `comments` já existir, altere os campos preservando as outras opções, sem duplicar objetos.

O exemplo habilita comentários e associa discussões pelo caminho da URL. `/zh/blog/my-first-post/` e `/en/blog/my-first-post/` são caminhos distintos e não compartilham discussão automaticamente. O padrão de compartilhamento é `false`. Se você já o habilitou antes, restaure o mapeamento conforme a seção adiante; alterar apenas este trecho pode não bastar.

O componente aparece no artigo apenas com comentários habilitados e os quatro campos de repositório/categoria preenchidos. Se faltarem, a área pode não aparecer. Valores provisórios podem passar na verificação local de não vazio sem provar a configuração remota. Não há opção de frontmatter por artigo: `comments: false` não desliga só um deles.

`lang: ''` no exemplo faz a interface seguir o idioma do artigo. O padrão real é fixo em `lang: 'en'`, então é preciso esvaziar explicitamente para seguir a página. `zh` vira `zh-CN`, `zh-hant` vira `zh-TW` e `pt-br` vira `pt`. Isso muda a interface, sem traduzir comentários.

## 3. Confirmar a conexão real

Salve e abra um artigo no servidor local. Vá à área de comentários e confira se aponta ao repositório certo e se login, comentários e reações estão disponíveis. Uma discussão inicialmente vazia não significa falha: Giscus pode criá-la na primeira resposta ou reação, não necessariamente ao abrir a página.

Antes de publicar, pare dev e execute:

```bash
npm run doctor
npm run preview
```

doctor verifica e constrói; depois do sucesso não repita build imediatamente. preview mostra o resultado local, sem publicá-lo; o site real exige nova publicação. O build comprova apenas a geração local, não permissões e conexão do repositório real no navegador.

Artigos usam `loading: 'lazy'` por padrão. Esse valor vai ao iframe Giscus; não significa que o script cliente só será inserido ao rolar. O artigo inclui um script Giscus assíncrono. Já o popup de Fragments só carrega o cliente ao clicar no botão de comentários.

Tipos, padrões e exemplos estão na [referência Giscus](/pt-br/blog/config-comments/#connection). Em sites com comentários antigos, confira especialmente as restrições de mapeamento e compartilhamento.

## 4. Escolher como associar artigos e discussões

Para uso comum, mantenha `pathname`. Antes de mudar, entenda a associação e evite trocas arbitrárias em um site que já tenha comentários:

| Valor de `mapping` | Associação e limites                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `'pathname'`       | Caminho da URL, sem domínio; alterar o caminho pode apontar a outra discussão.                 |
| `'url'`            | URL completa; mudar o domínio também pode mudar a associação.                                  |
| `'title'`          | title do documento no navegador; título do artigo ou nome do site podem afetar a associação.   |
| `'og:title'`       | Título Open Graph da página.                                                                   |
| `'specific'`       | `term` fixo informado por você, obrigatório e não vazio fora do compartilhamento.              |
| `'number'`         | Número de Discussion existente em `number`, não um issue; não cria discussões automaticamente. |

Giscus faz a busca; o tema não cria um banco local de comentários. `strict: '1'` reduz correspondências aproximadas entre títulos semelhantes; o padrão é `'0'`.

Sem compartilhamento, `term` e `number` são globais. Usar `specific` com um único term faz os artigos procurarem a mesma discussão; number aponta para um número fixo. Não são opções que atribuem automaticamente uma discussão diferente a cada artigo.

Com comentários de artigos habilitados, o tema exige term não vazio após trim em `specific` e uma string de inteiro positivo em `number`, como `'42'`, não número `42`, `'0'` ou fração. Parâmetros inválidos fazem a validação falhar e podem impedir dev ou build.

## 5. Compartilhar comentários entre traduções do mesmo artigo

Para traduções em chinês e inglês compartilharem uma discussão, mantendo artigos distintos separados, preserve os dados reais de conexão e mescle:

```ts
theme: {
  comments: {
    // 保留 enabled: true 和自己的 repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

O compartilhamento exige specific, term vazio, number vazio e strict como string `'1'`. O term vazio é proposital: o artigo o preenche com o slug completo, sem o diretório de idioma, em vez de uma palavra fixa global.

`src/content/blog/zh/my-first-post.md` e `src/content/blog/en/my-first-post.md` usam `my-first-post`. Conteúdos aninhados `guides/setup` e `other/setup` mantêm o caminho completo e discussões diferentes. As traduções precisam ter slug igual; semelhança de título ou corpo não basta.

Com compartilhamento e comentários habilitados, mapping incorreto, term/number não vazios ou strict diferente de `'1'` causam erro explícito. As rotas padrão fornecem o slug; páginas próprias que chamam BlogPost precisam passar articleSlug válido. lang ainda controla a interface, sem traduzir respostas.

Confira duas traduções do mesmo artigo e depois outro artigo: as primeiras devem compartilhar uma discussão e o terceiro, outra. Idioma da interface e aparência do campo não provam compartilhamento.

### E os comentários já existentes?

O tema não mescla, move nem apaga discussões antigas. Ativar compartilhamento pode mudar a discussão escolhida. Comentários antigos podem continuar no GitHub sem aparecer na nova associação.

Antes de mudar, guarde repo, categoria, mapping, term, number e strict originais. Para restaurar, defina `shareAcrossLocales: false` e recoloque os valores anteriores; só desligar o compartilhamento e deixar specific com term vazio causa erro. Se precisar organizar discussões, confira no GitHub as associações e os dados: não há migração automática.

## 6. Habilitar comentários de Fragments separadamente

Para aceitar comentários apenas em Fragments, informe os mesmos dados de repositório/categoria e configure:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

`theme.comments.enabled: false` desliga só comentários de artigos; Fragments usa `theme.fragments.comments.enabled`. Se artigos também precisarem de comentários, mantenha true sem mudar seu mapeamento apenas por habilitar Fragments.

Fragments fixa specific, strict e `fragment/<id>`, ignorando mapping, term, number, shareAcrossLocales e lang fixo dos artigos. A interface segue a página e traduções com o mesmo ID compartilham a discussão. Reações, cores e posição do campo continuam compartilhadas. A ausência de um dos quatro campos de conexão gera erro ao habilitar comentários de Fragments.

O primeiro clique carrega o cliente. Fechar preserva a instância e reabrir ou trocar itens a reutiliza. Falha ou cerca de 15 segundos sem ficar pronto oferecem nova tentativa; o aviso de carregamento não comprova a conexão. Publicação, IDs e links estão em [publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/).

## Opções adicionais de exibição e carregamento

Os campos abaixo ficam em `theme.comments`. Normalmente, os padrões bastam.

| Campo              | Padrão do tema | Uso                                                                                                                      |
| ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `reactionsEnabled` | `'1'`          | Mostra reações à postagem principal; `'0'` desliga.                                                                      |
| `inputPosition`    | `'bottom'`     | Posição do campo: `'top'` ou `'bottom'`.                                                                                 |
| `theme`            | `'dark'`       | Identificador de cores Giscus, com valores suportados na configuração do serviço; não troca o tema do blog.              |
| `strict`           | `'0'`          | Correspondência estrita de artigos; compartilhamento e Fragments exigem `'1'`.                                           |
| `emitMetadata`     | `'0'`          | Envia metadados da discussão à página pai, não metadados de publicação; Fragments força a opção para detectar prontidão. |
| `lang`             | `'en'`         | Idioma fixo para artigos; `''` segue a página. Fragments sempre segue a página.                                          |
| `loading`          | `'lazy'`       | iframe de artigos: `'lazy'` ou `'eager'`; o popup usa eager depois de aberto.                                            |
| `crossorigin`      | `'anonymous'`  | Atributo do script, `'anonymous'` ou `'use-credentials'`; normalmente não exige mudança nem substitui o login GitHub.    |

`enabled` e `shareAcrossLocales` são booleanos true/false. `strict`, `reactionsEnabled` e `emitMetadata` são strings `'0'`/`'1'`. Não misture tipos por terem aparência parecida.

## Quando comentários não aparecem ou apontam ao lugar errado

| Sintoma                                      | O que conferir                                                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Nenhuma área no artigo                       | Opção de artigos true e quatro campos preenchidos; a opção de Fragments não controla artigos.                          |
| Erro ao habilitar Fragments                  | Preenchimento de todos os dados de repositório/categoria, além do botão de ativação.                                   |
| Erro remoto ou carregamento contínuo         | IDs reais, repositório público, Discussions ativa, autorização do app, categoria, rede e bloqueadores.                 |
| Artigos diferentes mostram a mesma discussão | term/number globais fixos, compartilhamento e correspondência realmente realizada pelo Giscus.                         |
| Traduções não compartilham                   | shareAcrossLocales, igualdade de slug e restrições do modo compartilhado.                                              |
| Comentários “somem” após mudar mapping       | Verifique a discussão antiga no GitHub; não tente recuperar trocando repetidamente títulos/IDs ou apagando discussões. |
| Interface sempre em inglês                   | lang padrão é en; use `''` para seguir a página, sem traduzir respostas.                                               |
| Mudou localmente, não online                 | Novo build, publicação e eventual uso de configuração antiga pelo site.                                                |

Use `theme.comments.enabled: false` para artigos e `theme.fragments.comments.enabled: false` para Fragments. Isso remove entradas/embeds correspondentes, sem apagar dados do GitHub Discussions. O atualizador não migra discussões: preserve o mapping ao atualizar e confira depois. A atualização está no [guia de instalação](/pt-br/blog/starter-guide-1-configure-your-site/).

## Navegação e referência de configuração

[Anterior: ajustar páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Próximo: receber leitores de outros idiomas](/pt-br/blog/starter-guide-languages/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [parâmetros Giscus e discussões compartilhadas](/pt-br/blog/config-comments/) e [opção de comentários de Fragments](/pt-br/blog/config-fragments/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
