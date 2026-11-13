---
tags: ['anglefeint', 'starter']
title: 'Guia 3: adicionar imagens a artigos e Fragments'
subtitle: 'Coloque os originais, use os caminhos corretos e prepare arquivos responsivos, capas e prévias de compartilhamento.'
description: 'Diferenças reais entre imagens de artigos, capas, Fragments e compartilhamento, com preparação, commits e diagnóstico de publicação.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Esta é a parte 3 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Você não precisa criar várias resoluções manualmente nem trocar os links dos artigos pelos nomes gerados. Coloque o original, referencie-o no artigo ou Fragment e deixe o servidor local preparar os arquivos responsivos necessários.

Este guia considera os diretórios padrão `src/` e `public/` do starter. Primeiro identifique o uso da imagem:

| Uso                        | Onde configurar                                        | Processamento atual                                                                           |
| -------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Imagem no corpo do artigo  | Imagem Markdown ou dentro de MDX                       | Usa o fluxo Markdown/MDX existente, fora da preparação persistente de capas descrita abaixo.  |
| Capa de artigo             | `heroImage` no frontmatter                             | Arquivos responsivos preparados localmente, compartilhados pela lista e pelo artigo.          |
| Imagem de Fragment         | Imagem Markdown, por referência ou HTML `img` no corpo | Imagens locais suportadas usam os mesmos arquivos persistentes, na lista e na prévia inicial. |
| Imagem de compartilhamento | `ogImage` do artigo ou `site.ogImage`                  | Fluxo próprio, distinto das miniaturas de capa.                                               |

## 1. Colocar o original no projeto

Uma imagem usada em um único artigo pode ficar ao lado dele:

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

Fragments aceitam a mesma organização, com imagens ao lado do Markdown. Imagens compartilhadas entre páginas podem ficar em `public/images/`:

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

Crie os diretórios se não existirem. Prefira nomes simples com letras inglesas, números e hífens, evitando confusão de maiúsculas e minúsculas. URLs usam `/`, não caminhos locais como `C:\...`, `D:\...` ou barras invertidas. Em sistemas que distinguem maiúsculas, `Photo.jpg` e `photo.jpg` podem ser arquivos diferentes.

Mantenha o original. O WebP gerado para exibição é um derivado, não um backup substituto.

## 2. Inserir imagens no corpo de um artigo

Abra o Markdown do artigo e insira no local desejado:

```md
![Descrição do que aparece na foto](./photo.jpg)
```

`./photo.jpg` é relativo ao arquivo do artigo. Na organização acima, aponta para `photo.jpg` na mesma pasta. Para arquivos de public:

```md
![Descrição do que aparece na foto](/images/shared-photo.jpg)
```

Esse caminho corresponde a `public/images/shared-photo.jpg` e omite `public` na URL. O texto entre colchetes é a descrição alternativa: descreva o conteúdo real, em vez de escrever apenas “imagem”.

Imagens comuns do corpo podem ser ampliadas por clique ou por foco seguido de Enter/espaço. Esc, o botão de fechar ou a máscara fecham a prévia. Capas e imagens dentro de links ou botões ficam de fora. A ampliação usa a fonte já escolhida pelo navegador, sem baixar automaticamente um original de maior resolução e sem navegação entre imagens.

Executar `prepare-covers` não significa que todas as imagens do corpo foram comprimidas. Ele processa os conjuntos de capas, as capas referenciadas e as imagens locais de Fragments. Imagens public no corpo de artigos ainda podem baixar o original diretamente. Prepare arquivos de tamanho adequado, especialmente evitando screenshots de vários MB.

## 3. Definir a capa do artigo

Coloque `cover.jpg` ao lado do artigo e adicione ou altere no frontmatter existente:

```yaml
heroImage: ./cover.jpg
```

`heroImage` é opcional, mas, quando usado, deve apontar para um arquivo local do projeto, não uma URL HTTPS direta. Não use `/images/cover.jpg` como se esse campo tivesse a mesma regra de URLs public das imagens no corpo.

Para centralizar novas capas, use `src/assets/blog/covers/originals/`. Se o artigo está em `src/content/blog/zh/my-first-post.md` e o original em `src/assets/blog/covers/originals/my-cover.jpg`, escreva:

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

A capa não é inserida automaticamente no corpo. Ela aparece nas listas do blog/tags e na área de capa do artigo. O layout pode recortar a área visível, mas os arquivos gerados preservam a proporção original; não escolhem automaticamente uma pessoa ou o foco da composição.

A seleção automática de `new-post` usa apenas `src/assets/blog/default-covers/`. Colocar uma imagem em `covers/originals/` não a inclui nessa seleção: referencie o novo original no artigo.

## 4. Adicionar imagens a Fragments

Com `theme.fragments.enabled: false`, dev, build e prepare-covers/doctor ignoram referências de imagens no corpo dos Fragments. Imagens incluídas somente por essas referências deixam de exigir originais ou derivados. Referências de capas e os conjuntos `src/assets/blog/default-covers/` e `src/assets/blog/covers/originals/` continuam preparados e validados, mesmo para imagens usadas só em Fragments. Nenhum arquivo é apagado; reativar restaura o processamento de Fragments.

**Nota de versão:** O isolamento de imagens ao desativar exige 0.36.1 ou posterior; não está em 0.36.0. Não presuma esse comportamento em versões antigas.

Coloque o original em `public/images/fragments/my-photo.png` e escreva no corpo do Fragment existente:

```md
![Descrição da imagem desta nota](/images/fragments/my-photo.png)
```

Você também pode colocar `photo.png` junto do Fragment e usar `![Descrição da imagem](./photo.png)`. Apenas copiar uma imagem para public não inicia uma varredura geral de biblioteca: ela precisa ser referenciada em um Fragment real.

Imagens por referência também funcionam:

```md
![Descrição da imagem][photo]

[photo]: /images/fragments/my-photo.png
```

Para tamanhos manuais, use HTML:

```html
<img src="/images/fragments/my-photo.png" alt="Descrição da imagem" width="640" height="360" />
```

As dimensões são exemplos; preencha valores de acordo com a proporção real. Imagens locais suportadas recebem dimensões ausentes automaticamente. Dimensões já preenchidas são mantidas; se houver apenas uma, a outra é calculada pela proporção original. Valores existentes incorretos não são corrigidos.

A primeira imagem de cada página da lista de Fragments tem prioridade de carregamento; as outras e as miniaturas iniciais são lazy. A página inicial mostra apenas uma prévia com altura limitada e recorta o excesso. Não é um visualizador completo: clique no card para abrir o Fragment original. Criação, ID estável e comentários estão em [publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/).

## 5. Preparar os arquivos responsivos localmente

Depois de referenciar ou trocar um original, inicie o servidor local na raiz do projeto:

```bash
npm run dev
```

Dev, build e doctor, inclusive em CI, reutilizam derivados válidos e preparam os ausentes, desatualizados ou danificados. Dev também acompanha alterações nas fontes e referências. Se quiser apenas preparar imagens sem iniciar páginas nem a verificação completa, pare dev e execute:

```bash
npx @anglefeint/astro-theme prepare-covers
```

Para conferir os arquivos atuais sem gerar o que estiver faltando:

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

Não é necessário recodificar tudo a cada execução. A preparação usa hashes do original, das regras e dos arquivos de saída para decidir o que reutilizar. Um original alterado atualiza seus derivados; uma única saída ausente ou modificada exige reparar apenas a parte necessária. Não edite o manifesto, renomeie saídas ou grave suas URLs geradas no artigo.

As regras atuais são:

- Imagens raster estáticas viram WebP com qualidade 80: é um objetivo de codificação com perdas, não uma garantia de pixels idênticos.
- As larguras candidatas são 400, 640, 800, 960 e 1200px. Mantêm-se as adequadas ao original e, se necessário, sua largura até 1200px, sem ampliar imagens pequenas.
- A orientação EXIF é aplicada e a proporção é preservada, sem criar recortes com composições diferentes.
- SVG e animações com vários quadros mantêm o formato; não viram WebP estático. GIF de um quadro pode ser processado como imagem estática: a extensão sozinha não determina a preservação.
- Os conjuntos default-covers, originals e as referências reais definem o alcance. Nem todas as imagens de public são convertidas.

O navegador escolhe a candidata por `srcset`, `sizes`, tela e densidade de pixels. Você não precisa manter diretórios de vários tamanhos. Como a maior largura é 1200px, não se garante detalhe equivalente ao original em telas grandes com alta densidade.

## 6. O que versionar e o que acontece na publicação?

Depois da preparação, os arquivos ficam em:

```text
src/assets/blog/covers/
  originals/      # se você usar este diretório de originais
  manifest.json  # origens, dimensões, regras e hashes de saída
  generated/     # arquivos responsivos persistentes
```

Faça commit em conjunto de:

1. Markdown do artigo ou Fragment e dos originais adicionados ou substituídos.
2. Todo `src/assets/blog/covers/`, incluindo manifesto e arquivos gerados.

Se o original estiver em public ou junto do artigo, inclua também esse arquivo, não apenas originals. Mesmo com o nome blog/covers, o diretório também guarda os derivados de Fragments.

Antes de publicar, pare dev e execute `npm run doctor` localmente; após o sucesso, `npm run preview` mostra o build. doctor já constrói, sem necessidade de build imediato adicional. A hospedagem continua usando `npm run build` e `dist`, publicando todos os arquivos de saída.

**Dev, build e doctor, inclusive em CI, preparam automaticamente os derivados utilizados:** reutilizam os válidos e geram os ausentes, desatualizados ou danificados. Guardar os derivados no Git permite reutilizá-los sem depender do cache da plataforma. Originais ausentes, ilegíveis ou fora dos caminhos permitidos continuam causando erros.

**Requer 0.36.2 ou posterior:** Dev, build e doctor (inclusive em CI) reutilizam derivados válidos e geram os ausentes, desatualizados ou danificados. Na versão 0.36.1, prepare as imagens primeiro com dev ou `prepare-covers` antes de build/CI. `prepare-covers --check` e a sincronização da configuração continuam sendo verificações somente de leitura.

Derivados usados no build são copiados para `_blog-covers/`. Não publique só HTML nem deixe esse diretório de fora. Arquivos antigos ou sem uso em generated não são apagados automaticamente. Antes de limpar, confira as referências e não apague originais ainda necessários.

Consulte os campos em [heroImage e ogImage de artigos](/pt-br/blog/config-article/#frontmatter) e as [regras de prévia de Fragments](/pt-br/blog/config-fragments/#preview-and-links).

## 7. Qual imagem aparece ao compartilhar um link?

A imagem de compartilhamento é a prévia do cartão do link, diferente da capa exibida na página.

Por padrão, o build gera para cada artigo um PNG 1200×630 com título, autor e nome do site, sem serviço de imagens nem geração no navegador. Ao mudar essas informações, reconstrua e publique. `theme.footer.showCredits` também controla o crédito do tema nessa imagem automática, sem alterar imagens próprias.

### Escolher uma imagem para um artigo

Coloque `share.png` ao lado do artigo e preencha no frontmatter:

```yaml
ogImage: ./share.png
```

Ou coloque o arquivo em `public/images/share.png` e use `ogImage: /images/share.png`. O campo também aceita URL HTTPS direta. Imagens locais relativas são tratadas pelo schema de imagens do artigo; caminhos public têm sua existência verificada. Links externos dependem do servidor de origem.

### Definir uma imagem padrão para páginas sem imagem própria

Mescle no `site` de nível superior existente em `src/site.config.ts`:

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

Coloque primeiro o arquivo em `public/images/site-share.jpg`. `site.ogImage` também aceita HTTPS. Ausente ou vazio, usa a imagem 1200×630 interna do tema. Não aceita caminhos relativos ao artigo.

A prioridade atual é:

1. `ogImage` explícito do artigo.
2. Imagem automática do artigo, com geração habilitada.
3. `heroImage` do artigo quando `theme.socialImage.enabled` está desabilitado.
4. `site.ogImage` para páginas sem imagem específica e, por último, a imagem interna.

Assim, alterar apenas `site.ogImage` não substitui as imagens automáticas dos artigos. A página Fragments e todos os links `#ID` compartilham a imagem padrão do site, sem um cartão específico para cada item.

As imagens automáticas ficam em `dist/_social/`. Plataformas leem os metadados do site publicado e podem manter imagens antigas em cache; uma imagem local nova não significa atualização imediata da prévia externa.

## 8. Como investigar problemas de imagens

| Sintoma                                       | O que conferir primeiro                                                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Imagem não aparece                            | Existência do arquivo, maiúsculas/minúsculas e caminho relativo ao Markdown atual; URLs public não levam `public`.                         |
| Preparação da capa falha                      | `heroImage` precisa apontar para arquivo local do projeto, sem confundir com URL externa ou public; veja o erro completo no terminal.      |
| Aviso missing/stale/modified derivatives      | Execute dev, build ou doctor para regenerar os derivados; use prepare-covers para preparação explícita. Confira os originais se persistir. |
| Imagem em public sem tamanhos gerados         | Verifique se um Fragment a referencia; imagens public comuns do corpo de artigos ficam fora dessa varredura.                               |
| GIF ou SVG continua grande                    | Animações e vetores preservam o original; o comando não converte para vídeo nem comprime animações.                                        |
| Imagem remota de Fragment lenta ou com saltos | Links externos não são convertidos nem têm dimensões inferidas; otimize na origem e preencha largura e altura corretas.                    |
| Imagem local funciona, publicada não          | Versione os originais; os derivados podem ser regenerados. Publique todo dist e confira reescritas de caminhos.                            |
| Prévia de compartilhamento antiga             | Verifique novo build/publicação, prioridade da imagem do artigo e cache da plataforma.                                                     |

Se personalizar srcDir, publicDir ou fontes com base no Astro, prepare usando dev com essas configurações. O comando prepare-covers independente usa os diretórios padrão. Suporte parcial a base no processamento de imagens não equivale a suporte integral a qualquer subdiretório de publicação.

Para instalar ou atualizar, consulte [instalar o blog e colocar suas informações](/pt-br/blog/starter-guide-1-configure-your-site/); campos e corpo dos artigos estão em [escrever o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/).

## Navegação e referência de configuração

[Anterior: escrever o primeiro artigo](/pt-br/blog/starter-guide-2-languages-and-routing/) · [Próximo: publicar um Fragment](/pt-br/blog/starter-guide-5-fragments/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [capas e compartilhamento de artigos](/pt-br/blog/config-article/), [imagens na prévia de Fragments](/pt-br/blog/config-fragments/) e [imagem padrão do site](/pt-br/blog/config-site-chrome/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
