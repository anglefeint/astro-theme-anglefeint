---
tags: ['anglefeint', 'starter']
title: 'Guia 2: escrever o primeiro artigo'
subtitle: 'Crie o artigo, preencha título e data e organize o corpo com sumário, tags, código e fórmulas.'
description: 'Da criação pelo fluxo padrão ao preview local: campos suportados, Markdown, MDX, sumário, tags, pesquisa e estatísticas.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Esta é a parte 2 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Depois da [instalação e configuração do site](/pt-br/blog/starter-guide-1-configure-your-site/), o trabalho diário consiste principalmente em editar os arquivos de `src/content/blog/`. Título, datas e informações individuais ficam no frontmatter, no início do arquivo; nome do site, autor padrão e opções globais continuam em `src/site.config.ts`.

Primeiro vamos criar e visualizar artigos pelo fluxo padrão do projeto e depois escolher idiomas quando necessário. As tabelas de campos no final servem para consulta.

## 1. Criar um artigo pelo fluxo padrão

Na raiz do projeto, a pasta que contém `package.json`, execute:

```bash
npm run new-post -- my-first-post
```

Se já executou o comando no primeiro guia, abra o arquivo existente e continue escrevendo. Arquivos de mesmo nome são ignorados, não sobrescritos.

Sem `--locales` nem `ANGLEFEINT_LOCALES`, o comando cria `src/content/blog/<locale>/my-first-post.md` para todos os idiomas habilitados. A configuração inicial habilita nove idiomas e gera nove esqueletos; se você mudou os idiomas, usa a lista atual. O comando não traduz o corpo.

Escolha o arquivo do idioma que deseja editar. A URL é `/<locale>/blog/my-first-post/`, e a lista fica em `/<locale>/blog/`. Por exemplo, o artigo em inglês usa `/en/blog/my-first-post/`, e o chinês, `/zh/blog/my-first-post/`; cada idioma precisa estar habilitado. Não é necessário criar rotas manualmente.

`my-first-post` é o slug. Use apenas letras inglesas minúsculas, números e hífens, como `learning-astro-1`, sem espaços, sublinhados ou `/`. Renomear o arquivo muda a URL sem criar um redirecionamento automático para o endereço antigo.

O comando preenche título, descrição, data UTC do dia e corpo provisório. Se houver WebP, PNG ou JPEG em `src/assets/blog/default-covers/`, escolhe uma capa aleatória; caso contrário, omite `heroImage`, sem baixar uma imagem. Depois você pode alterar os textos, a data e a capa.

### Criar apenas os idiomas escolhidos

Estas são alternativas ao comando padrão. Para apenas chinês simplificado, use zh; para inglês e chinês, en,zh. Não é necessário executar todos os exemplos:

```bash
# Criar apenas em chinês
npm run new-post -- my-first-post --locales zh

# Criar em inglês e chinês
npm run new-post -- my-first-post --locales en,zh
```

Sem `--locales`, o comando lê os idiomas habilitados, a menos que `ANGLEFEINT_LOCALES` esteja definido. A prioridade completa é `--locales` → `ANGLEFEINT_LOCALES` → idiomas habilitados. Novos arquivos da mesma execução compartilham a capa escolhida; arquivos existentes não mudam.

O comando só cria arquivos: não traduz nem habilita idiomas automaticamente. Coloque traduções nas pastas correspondentes com o mesmo slug. Ao trocar o idioma em um artigo, o menu abre a tradução de mesmo slug quando ela existe; caso contrário, abre a lista de artigos do idioma de destino.

## 2. Preencher título, descrição e data

Abra o arquivo gerado. O YAML entre as duas primeiras linhas `---` é o frontmatter; o corpo começa depois. Você pode começar assim e manter um `heroImage` já existente:

```md
---
title: 'Meu primeiro artigo'
description: 'Como criei meu blog com Anglefeint.'
pubDate: '2026-11-13'
tags: ['astro', 'anotações']
---

Este é meu primeiro artigo. Vou registrar aqui o que aprender e os problemas que encontrar.

## Por que começar um blog

Registre suas ideias e deixe pistas para seu eu do futuro.

### Comece com um pequeno problema

Hoje vou registrar a instalação e a publicação.
```

Substitua a data pela publicação real. `title`, `description` e `pubDate` são obrigatórios; `tags` é opcional. O layout já mostra o título, então o corpo normalmente começa com `##`, sem repetir `# Meu primeiro artigo`.

- `title` aparece no artigo, nas listas e nos metadados relacionados.
- `description` é a descrição do artigo e da página; sem `context` próprio, também aparece na linha de contexto abaixo do título.
- `pubDate` determina a ordem da lista, da publicação mais recente à mais antiga.
- Depois de uma alteração substancial em um artigo publicado, adicione um `updatedDate` real. Ele aparece como data de atualização e tem prioridade no sitemap, mas não substitui `pubDate` na ordenação.

Prefira datas `YYYY-MM-DD` entre aspas. Para horário exato, use ISO com fuso, como `'2026-11-13T09:00:00+08:00'`. O artigo mostra a data UTC, que pode cair em outro dia após a conversão do fuso.

**Não há filtro de rascunhos nem de publicação agendada.** Os esqueletos de outros idiomas também ficam públicos no build. Complete o que for publicar e mova arquivos não públicos para fora de `src/content/blog/`. `draft: true`, um `pubDate` futuro e `search: false` não tornam um artigo privado.

## 3. Escrever o corpo e organizar com títulos

Separe parágrafos com uma linha vazia. Exemplos comuns de Markdown:

```md
Este parágrafo aceita **negrito**, _ênfase_ e `código em linha`.

- Primeiro ponto
- Segundo ponto

[Texto do link](https://example.com/)

> Esta é uma citação.
```

Os títulos `##` e `###` geram o sumário automaticamente. Em telas largas ele fica à direita do corpo; em telas estreitas, antes dele. Sem títulos de segundo ou terceiro nível, não aparece. Títulos de quarto nível ou mais profundos funcionam no corpo, mas não entram nesse sumário.

Para dispensar o sumário em um artigo, adicione ao frontmatter existente:

```yaml
toc: false
```

Sem `toc`, o artigo herda `theme.toc.enabled` de `src/site.config.ts`, habilitado por padrão. `toc: true` pode sobrescrever a opção global desabilitada. O sumário usa os títulos Markdown fornecidos pelo compilador; títulos dentro de componentes MDX ou gerados por HTML/JSX bruto não são coletados automaticamente.

### Organizar artigos com tags

Adicione `tags: ['astro', 'anotações']` ao frontmatter para gerar links de tags e listas no idioma atual, sem criar rotas. Com tags habilitadas, consulte `/zh/tags/` no exemplo em chinês.

Tags distinguem maiúsculas de minúsculas: `Astro` e `astro` são diferentes. Espaços nas extremidades são removidos e tags duplicadas no mesmo artigo contam uma vez. Use os links gerados; caracteres chineses e especiais recebem codificação estável, sem precisar adivinhar o caminho. Renomear uma tag muda seu link.

`theme.tags.enabled: false` desabilita os links e a geração das páginas de tags, mantendo os artigos.

## 4. Inserir código e fórmulas

Blocos de código usam cercas de três crases, seguidas do nome da linguagem:

````md
```js
const message = 'Hello, world!';
console.log(message);
```
````

Blocos no corpo do artigo recebem um botão de cópia, que preserva quebras de linha e indentação. Ele copia texto; escrever JavaScript no bloco não o executa. Se a área de transferência não estiver disponível, aparece uma mensagem de falha e você pode selecionar e copiar manualmente. O botão exige JavaScript habilitado.

Fórmulas são habilitadas por padrão, sem instalar outro plugin. Use `$...$` em linha e `$$` em linhas separadas para fórmulas destacadas:

```md
A quantidade economizada é $C_{saved}$。

$$
\frac{a}{b} = x_1 + x_2
$$
```

Quando um cifrão comum for ambíguo, escreva `\$`; o conteúdo de código em linha e de blocos permanece intacto. O build renderiza fórmulas com KaTeX e sua sintaxe matemática, não documentos LaTeX completos. Fórmulas inválidas fazem a compilação ou o build falhar, indicando a origem. Fórmulas destacadas longas podem rolar horizontalmente.

Mescle `math: { enabled: false }` no `theme` existente em `src/site.config.ts` para desabilitar matemática globalmente. Mantenha títulos e descrições em texto simples; não dependa de marcadores matemáticos nesses campos.

### Quando usar MDX?

Use `.md` para escrita comum. Se precisar importar e usar componentes no artigo, use `.mdx`. O tema coleta ambas as extensões e oferece matemática também em MDX, sem conectar outro processador.

`new-post` gera `.md`. Quando precisar, renomeie para `.mdx` e mantenha o frontmatter. Não deixe `.md` e `.mdx` com o mesmo nome base no mesmo idioma como se fossem artigos diferentes: eles usam a mesma URL. Componentes e expressões precisam respeitar a sintaxe MDX; a mudança de extensão não transforma qualquer texto em MDX válido.

## 5. Adicionar imagens

Imagens do corpo podem ficar junto do artigo ou em `public/images/`. Coloque primeiro o arquivo real e use o caminho correspondente:

```md
![Descrição do conteúdo da foto](./photo.jpg)

![Descrição do conteúdo da foto](/images/photo.jpg)
```

O primeiro caminho é relativo ao artigo; o segundo corresponde a `public/images/photo.jpg` e omite `public` na URL. A descrição é o texto alternativo da imagem.

Para trocar a capa, coloque `cover.jpg` junto do artigo e defina `heroImage: ./cover.jpg` no frontmatter. `heroImage` aceita imagens locais e pode ser omitido. Imagem no corpo, capa e imagem de compartilhamento têm funções diferentes; definir uma capa não a insere automaticamente no corpo.

Imagens comuns do corpo podem ser ampliadas ao clicar ou ao focar e pressionar Enter/espaço. Esc, o botão de fechar ou a máscara fecham a prévia. Capas e imagens dentro de links ou botões não participam. A ampliação reutiliza a fonte escolhida pelo navegador, sem buscar um original de maior resolução nem oferecer navegação de galeria.

Dev, build e doctor, inclusive em CI, reutilizam as capas derivadas válidas e completam as ausentes, desatualizadas ou danificadas. Preserve os originais; versionar também `src/assets/blog/covers/`, com manifest.json e generated/, permite reutilizar os arquivos. Essa preparação cobre capas e imagens locais compatíveis de Fragments; imagens comuns de artigos seguem o processamento Markdown/MDX existente.

**Requer 0.36.2 ou posterior:** Dev, build e doctor (inclusive em CI) reutilizam derivados válidos e geram os ausentes, desatualizados ou danificados. Na versão 0.36.1, prepare as imagens primeiro com dev ou `prepare-covers` antes de build/CI. `prepare-covers --check` e a sincronização da configuração continuam sendo verificações somente de leitura.

## 6. Visualizar localmente e preparar a publicação

Execute `npm run dev` e abra `/<locale>/blog/my-first-post/` no endereço do terminal, como `/en/blog/my-first-post/` ou `/zh/blog/my-first-post/`. Confira título, data, corpo, sumário, tags e imagens. Se adicionar traduções, verifique também os destinos do seletor de idioma.

Antes de publicar, pare dev e execute:

```bash
npm run doctor
npm run preview
```

doctor inclui verificação e build; após o sucesso não é preciso executar check ou build imediatamente. preview mostra o `dist/` gerado e não publica o site. Corrija falhas de build antes de publicar, sem usar arquivos remanescentes.

### Por que a pesquisa não encontra artigos em dev?

O índice completo é gerado no build. A busca em `npm run dev` mostra um aviso de desenvolvimento. Pesquise uma frase do corpo no preview do build para conferir a busca real e o link do artigo.

Por padrão, a busca usa títulos e corpos de artigos do idioma atual. Para excluir um artigo da busca interna, adicione `search: false` ao frontmatter; omitido, ele participa. Isso não remove o artigo das listas, RSS, sitemap ou links públicos. `theme.search.enabled: false` desabilita tanto o botão global quanto a geração do índice.

Depois de editar artigos, faça novo build e publicação para atualizar a busca online. Fórmulas e elementos decorativos não integram o texto pesquisável.

Para tipos, valores padrão e campos não usados, consulte a [referência de artigos](/pt-br/blog/config-article/#frontmatter). As regras específicas de busca estão na [referência de pesquisa](/pt-br/blog/config-search/#article-search). Abaixo fica uma consulta rápida para a escrita diária.

## Consulta opcional: outros campos de artigos

Todos os campos abaixo pertencem ao frontmatter do artigo, não aos objetos `site` ou `theme` de `src/site.config.ts`. Artigos comuns não precisam preencher todos.

### Área do título e imagens

| Campo       | Comportamento atual                                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subtitle`  | Subtítulo opcional, não repetido se for idêntico à linha de contexto.                                                                                                |
| `context`   | Contexto abaixo do título; usa `description` quando omitido. `''` oculta a linha sem alterar a metadescrição.                                                        |
| `author`    | Autor do artigo; ausente ou apenas com espaços, usa o autor do site.                                                                                                 |
| `heroImage` | Capa local usada nas listas e no detalhe; opcional.                                                                                                                  |
| `ogImage`   | Imagem manual de compartilhamento, com prioridade sobre a automática; aceita imagem relativa ao artigo, caminho public como `/images/share.png` ou URL HTTPS direta. |

Artigos sem `ogImage` recebem por padrão uma imagem 1200×630 com título, autor e nome do site; ela não substitui a capa. `theme.socialImage.enabled: false` desliga a geração automática, mantendo o `ogImage` manual; os demais artigos usam a capa ou a imagem padrão do site. Faça novo build e publicação; plataformas de compartilhamento podem manter uma imagem antiga em cache.

### Estatísticas OUTPUT e textos de estado opcionais

| Campo               | Comportamento atual                                                          |
| ------------------- | ---------------------------------------------------------------------------- |
| `wordCount`         | Sobrescreve a contagem automática; inteiro não negativo.                     |
| `tokenCount`        | Sobrescreve independentemente a estimativa de tokens; inteiro não negativo.  |
| `aiModel`           | Rótulo informado por você, mostrado na área de estado do título e em OUTPUT. |
| `aiMode`, `aiState` | Textos informados por você para modo e estado na área do título.             |

Sem valores manuais, o tema estima a contagem pelo texto fonte: caracteres Han CJK, kana e hangul contam individualmente; o restante é dividido principalmente por espaços. Tokens padrão são `round(max(contagem automática, 1) × 1.3)`, uma estimativa, não o resultado de um tokenizador de modelo. Sobrescrever só `wordCount` não recalcula tokens; preencha ambos quando necessário.

A contagem remove parte do Markdown, mas não mede exatamente o texto visível; fórmulas e código MDX podem influenciá-la. Valores a partir de 1.000 aparecem com uma casa decimal e `k`. Modelo, modo e estado apenas exibem texto, sem conectar serviços de IA, verificar a origem do artigo ou executar tarefas.

### Campos compatíveis ou sem efeito visual atual

- `readMinutes`, `aiLatencyMs` e `aiConfidence`: dados antigos continuam aceitos, mas o artigo não mostra tempo de leitura, latência ou confiança. Se mantidos, seus tipos são respectivamente inteiro positivo, inteiro não negativo e número entre 0 e 1. Artigos novos não precisam deles.
- `canonicalTopic`: string aceita, atualmente sem uso na página, canonical ou exportação. Não cria tópicos nem muda a URL.
- `sourceLinks`: array de endereços, aceita HTTP(S) e adiciona `https://` a domínios sem protocolo. Atualmente só valida os dados, sem mostrar referências ou adicioná-las ao conteúdo exportado. Para exibir fontes aos leitores, escreva links Markdown no corpo.

Campos desconhecidos não viram recursos automaticamente; por exemplo, `draft` não implementa rascunhos. Prefira os campos disponíveis e o corpo do artigo.

## Navegação e referência de configuração

[Anterior: instalar o blog e colocar suas informações](/pt-br/blog/starter-guide-1-configure-your-site/) · [Próximo: adicionar imagens a artigos e Fragments](/pt-br/blog/starter-guide-images/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [artigos, sumário e OUTPUT](/pt-br/blog/config-article/), [tags e listas](/pt-br/blog/config-blog-list/) e [inclusão na busca](/pt-br/blog/config-search/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
