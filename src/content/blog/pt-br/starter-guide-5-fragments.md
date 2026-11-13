---
tags: ['anglefeint', 'starter']
title: 'Guia 4: publicar um Fragment'
subtitle: 'Registre ideias curtas em Markdown, acrescente imagens ou código e compartilhe um link estável; habilite comentários quando precisar.'
description: 'Da habilitação e criação de Fragments à edição, prévia inicial, paginação, compartilhamento, traduções e comentários Giscus opcionais.'
pubDate: '2026-11-11'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta é a parte 4 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Para registrar uma ideia curta, uma imagem ou código, não é preciso escrever um artigo inteiro. Fragments organiza esses registros em uma lista cronológica e oferece uma prévia dos mais recentes na página inicial.

Este guia considera o starter integrado atual. Se seu projeto não tiver os comandos ou recursos descritos, siga primeiro as instruções de atualização em [instalar o blog e colocar suas informações](/pt-br/blog/starter-guide-1-configure-your-site/).

## 1. Habilitar a lista de Fragments

Abra `src/site.config.ts` e mescle `fragments` no `theme` existente. Adicione ou altere os campos desse objeto, sem criar outro com o mesmo nome:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| Campo                              | Valor padrão e efeito real                                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `theme.fragments.enabled`          | `false` por padrão; habilita listas nos idiomas ativos e permite uma prévia inicial quando há conteúdo naquele idioma. |
| `theme.fragments.pageSize`         | `20` por padrão; quantidade por página, um inteiro de 1 a 100, independente dos artigos do blog.                       |
| `theme.fragments.comments.enabled` | `false` por padrão; habilita o popup de comentários e exige também a configuração Giscus explicada adiante.            |

Execute `npm run dev` e abra `/<locale>/fragments/`, como `/en/fragments/` ou `/zh/fragments/`. O idioma correspondente precisa estar habilitado. Sem conteúdo, aparece uma lista vazia, sem criar um arquivo de página. Desabilitar Fragments remove as rotas e a prévia inicial, mas não apaga os arquivos Markdown.

## 2. Criar Fragments pelo fluxo padrão

Na raiz do projeto, execute:

```bash
npm run new-fragment
```

Sem `--locales` nem `ANGLEFEINT_LOCALES`, o comando cria o esqueleto do mesmo Fragment para todos os idiomas habilitados; na configuração inicial, são nove arquivos em `src/content/fragments/<locale>/`. Eles compartilham ID e data da mesma execução, sem tradução automática. O terminal mostra os caminhos reais. O nome se parece com `2026-11-13-q8Lm3XzP.md`, com data UTC e ID aleatório: abra o arquivo realmente gerado, sem criar manualmente esse nome de exemplo.

Para criar apenas chinês simplificado, use `npm run new-fragment -- --locales zh`; para idiomas específicos, `--locales en,zh`. São alternativas: escolha uma, sem executar todas, e habilite os idiomas separadamente. Antes de publicar, retire da coleção os esqueletos de outros idiomas ainda incompletos.

**Cada execução cria um novo Fragment.** Para continuar escrevendo um existente, edite o arquivo original em vez de executar o comando novamente. O comando não pede slug nem sobrescreve arquivos existentes.

O starter atual inclui o script `new-fragment`. Se um projeto antigo não o tiver, confirme que o tema foi atualizado e use a CLI instalada no projeto:

```bash
npx @anglefeint/astro-theme new-fragment
```

Essa é uma alternativa ao comando anterior, não outro passo para criar “o mesmo” Fragment.

## 3. Substituir o texto provisório e preservar o ID

O frontmatter fica no início; o corpo começa depois do segundo `---`. Preserve `id` e `pubDate` gerados e substitua o texto provisório pela sua ideia. O exemplo mostra apenas o formato: não troque seu ID pelo ID do exemplo.

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

Hoje resolvi um problema antigo; registro este pequeno avanço.
```

Há três campos de frontmatter suportados:

| Campo     | Como preencher                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | Obrigatório, exatamente 8 letras inglesas ou números, com distinção de maiúsculas. A CLI gera e verifica IDs existentes; não é preciso inventá-lo. |
| `pubDate` | Obrigatório, data de publicação interpretável; prefira o ISO gerado ou informe horário com fuso.                                                   |
| `title`   | String opcional mostrada como título do card; publicar sem ela também funciona.                                                                    |

Para adicionar um título, acrescente `title: 'Um pequeno avanço'` ao mesmo frontmatter. Fragments não exige `description` de artigo nem tem o campo de capa `heroImage`; imagens ficam no corpo.

A ordenação usa `pubDate` do mais recente ao mais antigo e depois ID em caso de empate, não o nome do arquivo. As datas aparecem em UTC e podem diferir do horário local informado. Alterar só o corpo ou o nome não muda a identidade de compartilhamento ou comentários; alterar a data muda a ordenação e a página.

**Preserve o ID depois de publicar.** Repetir ID dentro do mesmo idioma gera erro; registros diferentes não devem reutilizá-lo. UUIDs e IDs antigos longos não são válidos no formato atual. Faça backup antes de tratar a compatibilidade: o tema não migra automaticamente IDs, links ou comentários antigos. Não considere uma troca de IDs em massa uma simples organização de arquivos.

A coleção lê apenas `.md` em `src/content/fragments/`, não `.mdx`. Não há filtro de rascunhos nem de datas futuras: `draft: true` e horários futuros não ocultam conteúdo. Mantenha fora desse diretório o que não estiver pronto para ser público.

## 4. Adicionar imagens, código e fórmulas

Você pode usar parágrafos, links, listas e citações Markdown. Exemplo de imagem:

```md
![Captura deste avanço](/images/fragments/progress.png)
```

Coloque antes o arquivo real em `public/images/fragments/progress.png`. Outra opção é `photo.png` junto do Fragment, referenciado por `![Descrição da imagem](./photo.png)`. Mais exemplos, dimensões e arquivos para commit estão em [adicionar imagens a artigos e Fragments](/pt-br/blog/starter-guide-images/).

Preserve as cercas e a indentação dos blocos:

````md
```js
const progress = {
  done: true,
};
```
````

O código é conteúdo exibido; JavaScript escrito nele não é executado. Não presuma que os botões de copiar código e ampliar imagens dos artigos também existam nos Fragments: a lista atual não usa essas duas interações.

Com matemática global habilitada, Fragments aceita fórmulas em linha como `$x_1$` e fórmulas destacadas entre linhas `$$`. São renderizadas no build; fórmulas inválidas causam falha de compilação ou build. `theme.math.enabled` desabilitado interrompe esse processamento. Consulte a sintaxe em [escrever o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/).

Dev, build e doctor, inclusive em CI, preparam as imagens locais compatíveis, reutilizando derivados válidos e gerando os ausentes, desatualizados ou danificados. Faça commit do Markdown e dos originais; incluir também `src/assets/blog/covers/` permite reutilizar os derivados. Não envie só o texto deixando os originais de fora.

**Requer 0.36.2 ou posterior:** Dev, build e doctor (inclusive em CI) reutilizam derivados válidos e geram os ausentes, desatualizados ou danificados. Na versão 0.36.1, prepare as imagens primeiro com dev ou `prepare-covers` antes de build/CI. `prepare-covers --check` e a sincronização da configuração continuam sendo verificações somente de leitura.

## 5. Prévia inicial e paginação da lista

Com Fragments habilitado e conteúdo no idioma atual, aparece um avatar pixelado abaixo do header da página inicial. Ao abri-lo, você vê no máximo os três registros mais recentes. Não há outra opção inicial para ligar, e `homeLatestCount` controla artigos, não essa quantidade.

A prévia pode conter resumo de texto, a primeira imagem válida e o primeiro bloco de código, não o corpo completo. Imagens e código têm altura limitada e excesso recortado; múltiplas imagens ou blocos não aparecem integralmente. Clique no card para abrir o registro. O link inferior “itens mostrados / total do idioma →” abre a lista completa: com dois itens, mostra `2 / 2`, não três fixos. Sem conteúdo, o avatar não aparece.

A lista completa usa `theme.fragments.pageSize`. No exemplo em chinês, a primeira página é `/zh/fragments/` e a segunda `/zh/fragments/2/`. Estilo e salto de página compartilham `theme.pagination`; `blogPageSize` não define a quantidade de Fragments.

A troca de idioma abre a primeira página da lista de destino, sem garantir o mesmo item ou número de página. Cada idioma pode ter outra quantidade de traduções e seu próprio total.

## 6. Compartilhar um Fragment

Fragments são exibidos na lista, sem uma página de detalhe individual. Compartilhe pelo link da data ou pelo botão de copiar ao lado, por exemplo:

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

Substitua domínio e ID pelos valores reais. O link da data e a cópia usam a raiz da lista mais o ID, sem depender da página atual do registro. Depois de adicionar conteúdo, mudar a data ou pageSize, novo build e publicação atualizam também o índice de localização.

Se o item não estiver na página atual, JavaScript lê sob demanda o índice estático daquele idioma, navega para a página correta e o localiza. Sem JavaScript, a paginação comum continua disponível, mas não a localização automática entre páginas nem a cópia. Se a área de transferência impedir a cópia, o link fica selecionável para copiar manualmente.

Não use um endereço com `/2/` como link permanente. Uma página antiga ainda existente pode corrigir um hash desatualizado; se o número da página já não existir, ocorre o 404 normal, que o script não intercepta. Conteúdo apagado, ID inexistente ou falha do índice geram avisos, sem restaurar registros removidos.

Todos os links de Fragments usam a imagem de compartilhamento da lista daquele idioma, sem imagem por ID. Para alterar a padrão, veja as [instruções de compartilhamento do guia de imagens](/pt-br/blog/starter-guide-images/).

## 7. Adicionar uma tradução do mesmo Fragment

Para gerar apenas os esqueletos em chinês e inglês, use este comando no lugar do padrão:

```bash
npm run new-fragment -- --locales zh,en
```

Os arquivos da mesma execução compartilham ID e timestamp; traduza o corpo manualmente. `--locales` escolhe arquivos, não habilita idiomas. A prioridade é `--locales` → `ANGLEFEINT_LOCALES` → idiomas habilitados. Omitir parâmetros não ativa tradução automática.

Para traduzir um Fragment chinês já existente, copie-o para `src/content/fragments/en/`, preserve `id` e `pubDate` e traduza título e corpo. Não execute de novo o comando de criação para completar “o mesmo” item: ele gera outra identidade. Traduções podem compartilhar ID entre idiomas, mas um idioma não pode conter dois arquivos do mesmo ID.

Traduções com ID igual compartilham comentários. Texto ou nome de arquivo igual não associa IDs diferentes.

## 8. Habilitar comentários quando precisar

Se quiser apenas registrar conteúdo, mantenha comentários desabilitados. Para receber respostas, siga primeiro o [guia Giscus](/pt-br/blog/starter-guide-4-giscus-comments/) e prepare repositório público, Discussions, aplicativo e categoria. Obtenha os IDs reais e mescle na configuração existente:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

Substitua conta, repositório, categoria e os dois IDs de exemplo. Preserve os outros campos de um `theme.comments` existente. A falta de um dos quatro campos de conexão causa erro; valores provisórios não demonstram validade no serviço remoto. Não é preciso colar um script Giscus nem instalar outro pacote npm Giscus.

A opção de Fragments é `theme.fragments.comments.enabled`. Ela não exige habilitar `theme.comments.enabled` dos artigos. Se os comentários de artigos já estiverem ativos, mantenha essa escolha.

Fragments fixa `specific`, correspondência estrita e `fragment/<id>`. Não usa mapping, term, number, shareAcrossLocales ou lang fixo dos artigos. A interface segue o idioma atual, e traduções do mesmo ID compartilham discussão e reações; as respostas não são traduzidas. As demais opções visuais compartilhadas continuam em `theme.comments`.

O cliente só carrega ao clicar no botão de comentários do card. Fechar preserva a instância, reutilizada ao reabrir ou trocar o item. Falha ou cerca de 15 segundos sem ficar pronto oferecem nova tentativa. Um aviso de carregamento não prova conexão bem-sucedida. Para comentar, o visitante precisa autorizar o GitHub.

Mudar o ID não move comentários antigos; apagar um Fragment não apaga a discussão no GitHub. Avalie a migração separadamente, sem esperar uma mesclagem automática do tema.

## 9. Conferir antes de publicar

Em dev, confira conteúdo, horário, prévia inicial e paginação. Antes de publicar, pare dev e execute:

```bash
npm run doctor
npm run preview
```

doctor inclui preparação local de imagens, verificações e build; após o sucesso não é preciso repetir build imediatamente. No preview do build, confira imagens e localização dos links e, se configurado, o popup de comentários. A prévia não publica: é necessário republicar os arquivos estáticos atualizados para mudar o site online.

Fragments não entra na busca completa de artigos nem no RSS de artigos. O build gera `/zh/fragments/index.md` no exemplo, trocando `zh` pelos demais idiomas. Ele reúne os Fragments públicos daquele idioma com ID, data, corpo e links estáveis e participa dos índices legíveis por IA. É uma saída pública, não um backup privado; comentários ficam de fora.

- Lista ausente: confira a opção fragments e se o idioma está habilitado.
- Sem avatar inicial: confira se há Fragments no idioma atual; conteúdo em outro idioma não basta.
- Criação falha por arquivos antigos: confira o formato do ID no frontmatter. A CLI lê IDs existentes para evitar duplicações.
- Build aponta ID repetido: procure cópias no mesmo idioma; traduções devem ficar na pasta de outro idioma.
- Build falha por imagens: siga o [guia de imagens](/pt-br/blog/starter-guide-images/) e prepare e versione originais, manifesto e derivados.
- Comentários falham: confira IDs reais, autorização do aplicativo, categoria, rede e bloqueios do navegador, sem trocar repetidamente os IDs dos Fragments.

Para atualizar o tema, veja as [instruções do primeiro guia](/pt-br/blog/starter-guide-1-configure-your-site/).

## Navegação e referência de configuração

[Anterior: adicionar imagens a artigos e Fragments](/pt-br/blog/starter-guide-images/) · [Próximo: ajustar páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [opções, paginação e conteúdo de Fragments](/pt-br/blog/config-fragments/) e [comentários de Fragments](/pt-br/blog/config-comments/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
