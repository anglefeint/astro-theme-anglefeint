---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: Giscus e discussões compartilhadas'
subtitle: 'Comentários de publicações, traduções e fragments'
description: 'Conexão, mapeamento, padrões, limites e compartilhamento de discussões Giscus entre idiomas.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Para a primeira configuração, leia [Permita comentários dos leitores](/pt-br/blog/starter-guide-4-giscus-comments/), com preparação do repositório e obtenção dos parâmetros. Veja o arquivo em [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/) e outros módulos no [índice de configuração](/pt-br/blog/config-reference/).

A configuração compartilhada fica em theme.comments de src/site.config.ts. Comentários vêm desativados. Os padrões abaixo são do pacote, não do repositório pessoal do demo. IDs e repositório aparecem na página como conexão pública: não informe tokens GitHub ou segredos.

<a id="controls"></a>

## Distinga os dois controles de comentários

| Caminho                          | Tipo / padrão   | Estado, efeito e limites                                                                                                                                                                    | Exemplo                                                              |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | Condicional: comentários de publicações, sem controlar botões dos fragments. Conexão ausente pode omitir a seção; isso não valida o serviço remoto                                          | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | Condicional: comentários na lista de fragments; exige theme.fragments.enabled true. Independente do controle de publicações; conexão obrigatória ausente gera erro nas páginas de fragments | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

Publicações não têm comments: false individual no frontmatter. Fragments também não têm controle por entrada; a prévia inicial não mostra botão de comentários. Veja outras opções no [dicionário Fragments](/pt-br/blog/config-fragments/#comments-enabled).

## Todos os campos de theme.comments

O prefixo completo é theme.comments.; repo, por exemplo, é theme.comments.repo. Todos podem ser omitidos na configuração parcial e recebem os padrões do tema. Mantenha aspas nos indicadores string, sem trocar por boolean ou número.

Todos são condicionais: publicações exigem comentários ativos e condições de saída satisfeitas. Fragments usam só parte deles e substituem ou ignoram o restante. Não existe regra geral de string vazia restaurar padrão; confira cada linha. Além das restrições de mapeamento validadas, tipo correto e não vazio não comprovam configuração remota correta.

<a id="connection"></a>

### Repositório e categoria

| Campo        | Tipo   | Padrão | Efeito, condições e limites                                                                                                                                        | Exemplo                           |
| ------------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `repo`       | string | `""`   | owner/repo do GitHub. Publicações exigem valor verdadeiro; fragments também exigem trim não vazio. Evite espaços nas extremidades; não verifica permissões remotas | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`   | ID do repositório fornecido pelo configurador Giscus, não nome, número ou token; compartilhado por publicações e fragments                                         | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`   | Nome de categoria de discussão fornecido pelo Giscus, correspondente a categoryId; não é tag do blog                                                               | `"Announcements"`                 |
| `categoryId` | string | `""`   | ID de categoria Giscus, não seu nome. Publicações exigem valor verdadeiro; fragments, trim não vazio. Não valida remotamente                                       | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### Mapeamento de publicações e correspondência estrita

| Campo     | Tipo                                                                   | Padrão       | Efeito, condições e limites                                                                                                                                                                | Exemplo                 |
| --------- | ---------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | Vínculo entre publicação e discussão; valores explicados abaixo. Compartilhamento exige specific. Fragments não usam este campo                                                            | `"pathname"`            |
| `term`    | string                                                                 | `""`         | Usado em specific sem compartilhamento; não vazio após trim e fixo para todo o site. No compartilhamento deve ficar vazio e é preenchido pelo slug ao renderizar; omitido nos outros modos | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | Usado em number sem compartilhamento; string de inteiro positivo seguro após trim, sem zeros iniciais, sinal ou frações. Vazio no compartilhamento; omitido nos outros modos               | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | Correspondência estrita das publicações, string e não boolean. Compartilhamento exige 1; fragments fixam 1. Não mescla automaticamente discussões de títulos iguais                        | `"1"`                   |

<a id="appearance"></a>

### Aparência, idioma e carregamento

| Campo              | Tipo                             | Padrão        | Efeito, condições e limites                                                                                                                                                   | Exemplo       |
| ------------------ | -------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | Mostra reações do tópico principal, compartilhado; não desativa todas as interações                                                                                           | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | Giscus envia metadados à janela pai. Publicações passam o valor sem exibir contagem automaticamente; fragments fixam 1 para verificar carregamento e troca                    | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | Posição da entrada acima/abaixo dos comentários, compartilhada; não muda a seção inteira na página                                                                            | `"top"`       |
| `theme`            | string                           | `"dark"`      | Tema do iframe Giscus, não a atmosfera Matrix/Cyber/Hacker/AI. Compartilhado; não valida nomes suportados nem muda com a página                                               | `"dark"`      |
| `lang`             | string                           | `"en"`        | Idioma da interface nas publicações: valor não vazio é passado diretamente; vazio mapeia idioma da página. Fragments ignoram e seguem sempre a página. Não traduz comentários | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | Dica de carregamento do iframe de publicações; não adia todo client.js. Fragments fixam eager, mas só inserem o cliente após clicar                                           | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | Atributo crossorigin do script Giscus, compartilhado. Não é credencial do repositório, token GitHub ou solução para permissões                                                | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales: compartilhar entre traduções

- **Tipo / padrão:** boolean, opcional / false.
- **Estado e efeito:** condicional a comentários de publicações ativos. Versões de idiomas diferentes com o mesmo slug completo usam a mesma discussão; slugs diferentes continuam separados.
- **Limites:** exige mapping 'specific', term e number vazios após trim, strict string '1'. Caso contrário, gera erro; não basta ativar o boolean. Desativar comentários das publicações pula estas restrições de ativação, mas fragments continuam com validação própria da conexão.
- **Exemplo:** trecho de compartilhamento abaixo. Não traduz comentários, mescla discussões antigas ou altera o vínculo dos fragments.

| Arquivo da publicação                | term efetivo no compartilhamento |
| ------------------------------------ | -------------------------------- |
| src/content/blog/zh/my-first-post.md | my-first-post                    |
| src/content/blog/en/my-first-post.md | my-first-post                    |
| src/content/blog/zh/guides/setup.md  | guides/setup                     |
| src/content/blog/en/other/setup.md   | other/setup                      |

Relaciona pelo slug completo sem pasta de idioma, não pelo título, canonicalTopic ou corpo. No modo compartilhado, a rota padrão passa articleSlug. Chamadas personalizadas de BlogPost também devem fornecer slug completo não vazio, sem espaços nas extremidades, segmentos vazios nem segmentos `.` ou `..`. Esse parâmetro do componente não é um campo de site.config.

Sites distintos com o mesmo repositório, categoria e slug podem usar a mesma discussão; não é um banco isolado também por domínio. Preservando o caminho, mudar o título não muda o term compartilhado. Mudar slug, repositório, categoria ou estratégia pode vincular outra discussão.

<a id="mapping-values"></a>

## Significado dos valores de mapping

| Valor    | Base usada pelo Giscus         | Limites e exemplos                                                                                            |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| pathname | Caminho da URL da página       | Padrão; caminhos de idiomas geralmente diferem. Alterar o caminho pode mudar o vínculo                        |
| url      | URL completa da página         | Mudar domínio ou URL pode afetar o vínculo                                                                    |
| title    | title do documento             | Alterar título do site ou publicação pode afetar; não usa apenas h1 do corpo                                  |
| og:title | Título Open Graph da página    | Usa os metadados da página, sem informar título em theme.comments                                             |
| specific | term informado                 | Sem compartilhamento, termo fixo global; com compartilhamento, gerado pelo slug                               |
| number   | Número de Discussion existente | Aponta globalmente ao número fixo, como string '42'. Não é número de issue nem cria discussão automaticamente |

Giscus realiza o vínculo e a criação. Sem discussão correspondente, ela pode ser criada na primeira reação ou comentário; abrir a página não garante criar. O repositório deve ser público, ter Discussions ativo e o aplicativo instalado. Veja o tutorial e o [configurador oficial Giscus](https://giscus.app/). O tema não mantém banco local de comentários.

Com strict '1', Giscus usa um hash do título no corpo da discussão para correspondência estrita; o tema não compara títulos localmente. Discussões antigas podem precisar do marcador. Veja [correspondência estrita do Giscus](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict). Ativar compartilhamento ou mudar mapeamento não migra, mescla nem remove discussões antigas. Comentários podem continuar no GitHub sem aparecer no novo vínculo. Mapeie discussões existentes para os novos terms antes de migrar.

Sem compartilhamento, specific com term fixo faz todas as publicações procurarem a mesma discussão; number também aponta todo o site ao mesmo número. Não alocam um ID automático por publicação. term/number irrelevantes ao modo não são enviados, mas ambos passam por trim; não substitua strings por null ou números.

<a id="examples"></a>

## Exemplos para mesclar

Mescle ao defineThemeConfig({...}) de src/site.config.ts, preservando import, export e configurações pessoais, sem duplicar theme. Obtenha os quatro valores de conexão na sua configuração Giscus. Os placeholders mostram apenas estrutura e não permitem validação online.

### Separar publicações pelo caminho

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### Compartilhar discussão entre traduções da mesma publicação

Preserve sua conexão e mescle o mapeamento:

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

O lang padrão é 'en', não “seguir a página”. O exemplo usa string vazia explicitamente para mapear o idioma da página: zh vira zh-CN, zh-hant vira zh-TW e pt-br vira pt; os demais passam diretamente. O suporte depende do Giscus. Mudar idioma altera só a interface, sem mudar a discussão ou traduzir comentários. theme.comments é global, sem cópias separadas em i18n.locales.

A string theme vai diretamente ao Giscus; exemplos usuais são 'dark' e 'light'. Temas disponíveis e URLs de CSS personalizado pertencem ao serviço e não mudam o painel AI externo. Veja [temas oficiais](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme). O pacote não valida conteúdo ou disponibilidade do CSS personalizado.

<a id="fragment-overrides"></a>

## Que partes da configuração compartilhada Fragments usa?

| Campo compartilhado                                    | Comportamento dos fragments                                                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| repo / repoId / category / categoryId                  | Compartilhado; os quatro não vazios após trim. Passa os valores originais, portanto evite espaços. Não valida permissões remotas |
| theme / reactionsEnabled / inputPosition / crossorigin | Compartilha os valores originais                                                                                                 |
| enabled                                                | Ignora o controle das publicações e usa theme.fragments.comments.enabled                                                         |
| shareAcrossLocales                                     | Não usa; o ID estável já vincula a mesma discussão                                                                               |
| mapping / term / number                                | Fixa specific, term `fragment/<ID>`, sem enviar number                                                                           |
| strict / emitMetadata                                  | Fixa '1' / '1'                                                                                                                   |
| lang                                                   | Ignora lang compartilhado; mapeia o idioma da página de fragments                                                                |
| loading                                                | Fixa eager, mas insere o cliente só no primeiro clique no botão                                                                  |

Por exemplo, ative só comentários dos fragments:

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

Fragments com o mesmo ID compartilham `fragment/<ID>` entre idiomas, por regra separada do slug das publicações. Não altere IDs estáveis para mudar ordem ou paginação. O primeiro clique carrega a janela; fechar preserva iframe. Trocar conteúdo atualiza a discussão por mensagens de configuração Giscus. Sem resposta válida após cerca de 15 segundos, mostra falha e nova tentativa. Sem timeout ou pré-carregamento públicos. Se comentários de publicações também estiverem ativos, sua validação continua mesmo que você só queira configurar fragments.

<a id="messages"></a>

## Textos de comentários na própria página

Campos string opcionais em `i18n.locales.<语言>.messages`, com textos integrados do idioma atual e fallback. Coloque os exemplos no objeto correspondente. Alteram só os rótulos externos, não os botões dentro do iframe Giscus. A tabela mostra padrões em chinês simplificado / inglês.

| Campo relativo       | Padrão em chinês simplificado / inglês                                                                                    | Estado, efeito e limites                                                                     | Exemplo              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | Condicional: nome acessível da área de comentários da publicação; não é outro título visível | `"文章讨论"`         |
| `fragments.comments` | 评论 / Comments                                                                                                           | Condicional: botão de comentários e título da janela de fragments                            | `"参与讨论"`         |
| `fragments.close`    | 关闭 / Close                                                                                                              | Condicional: fechar janela; também nome acessível para fechar fragments na página inicial    | `"关闭窗口"`         |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | Condicional: carregamento de comentários dos fragments                                       | `"正在加载讨论…"`    |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Condicional: falha de comentários dos fragments                                              | `"讨论暂时不可用。"` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | Condicional: botão de nova tentativa nos fragments                                           | `"重新加载"`         |

Veja outros textos no [dicionário de publicações](/pt-br/blog/config-article/#article-messages) e no [dicionário Fragments](/pt-br/blog/config-fragments/#fragment-messages). Esses campos não definem o idioma interno do iframe, controlado por lang acima.

<a id="limits"></a>

## Limites de carregamento e validação

Publicações emitem client.js assíncrono. loading: 'lazy' é passado ao iframe Giscus, sem esperar rolar até os comentários para inserir o script. Fragments emitem um template e inserem o cliente após clicar; eager se refere ao iframe após esse clique. A [documentação oficial](https://giscus.app/) distingue essas duas camadas.

O código local verifica restrições de mapeamento e conexão obrigatória dos fragments, sem comprovar login GitHub, autorização do aplicativo, visibilidade, categoria, rede ou serviço. Conexão vazia nas publicações pode impedir a renderização; strings só com espaços ainda podem passar na condição de saída, sem serem configuração correta. Fragments verificam não vazio com mais rigor, mas também não validam a autenticidade dos IDs.

Todos os campos theme.comments são consumidos atualmente, mas nem todos se aplicam a fragments; as substituições estão na tabela. Não existem controle por publicação, endereço de serviço próprio, ordem de comentários, token de administrador ou banco local. O cliente é fixo em https://giscus.app/client.js. Configurações de repositório do próprio Giscus não são campos adicionais de site.config.

Recompile e publique após alterar. Compilação aprovada não valida o serviço real. Migrações e permissões são tratadas no GitHub/Giscus, não automaticamente ao salvar site.config. Volte ao [índice de configuração](/pt-br/blog/config-reference/) para outros módulos.
