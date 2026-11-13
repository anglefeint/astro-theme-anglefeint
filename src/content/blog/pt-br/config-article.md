---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: detalhes da publicação'
subtitle: 'Recursos, frontmatter, estatísticas e textos da publicação'
description: 'Tipos, padrões, prioridade, compatibilidade e limites da página de publicação.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**Nota de versão:** Resposta em tempo real a movimento reduzido e consistência entre autor e chave da imagem social exigem 0.36.1 ou posterior; não estão em 0.36.0.

[Voltar ao índice de configuração](/pt-br/blog/config-reference/). Primeiro confirme onde escrever: recursos globais e textos ficam em `src/site.config.ts`; título, datas, imagens e estatísticas individuais ficam no frontmatter do Markdown/MDX. Não os troque.

Este artigo usa as rotas padrão do pacote. Elas geram páginas dos idiomas ativos e fornecem sumário, estatísticas, traduções e até três outras publicações conforme o conteúdo real. Páginas personalizadas que chamam BlogPost diretamente precisam fornecer as propriedades correspondentes; não herdam todos os comportamentos da rota automaticamente.

## 1. Controles globais

<a id="feature-switches"></a>

Os campos abaixo ficam em theme de site.config, todos `boolean` com padrão `true`. Cada linha fornece um exemplo para mesclar em theme conforme necessário; não é recomendação para desligar tudo.

| Caminho completo               | Efeito e condições                                                                                         | Limites e exemplo                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | Mostra o sumário por padrão com h2/h3 Markdown fornecidos pelo compilador; ausente sem títulos utilizáveis | toc: true/false individual tem prioridade; títulos internos de componentes e HTML bruto não entram automaticamente. Exemplo `toc: { enabled: false }` |
| `theme.math.enabled`           | Ativa matemática Markdown/MDX; estilos entram só quando o corpo contém marcadores matemáticos              | Global, sem math individual. Fórmulas inválidas falham na compilação; desativar muda a análise. Exemplo `math: { enabled: false }`                    |
| `theme.effects.enableRedQueen` | Mostra o monitor Red Queen ao lado da publicação                                                           | false não desativa rede de fundo, Canvas da capa ou atmosfera AI. Exemplo `effects: { enableRedQueen: false }`                                        |
| `theme.search.enabled`         | Ativa entrada e índice de busca; definição em [busca](/pt-br/blog/config-search/#enabled)                  | search: false individual exclui a publicação; true não reativa a busca global desligada. Exemplo `search: { enabled: false }`                         |
| `theme.tags.enabled`           | Mostra links de tags e controla diretório e listas de tags                                                 | false preserva tags. Exemplo `tags: { enabled: false }`; escopo em [listas](/pt-br/blog/config-blog-list/#tags-enabled)                               |
| `theme.socialImage.enabled`    | Gera imagem social 1200×630 para publicações sem ogImage explícito                                         | false mantém ogImage manual e usa capa/imagem global como fallback. Não oculta a capa. Exemplo `socialImage: { enabled: false }`                      |

São condicionais ao conteúdo, à área da página e às prioridades indicadas. Por exemplo, desative só o sumário padrão e mantenha o restante:

```ts
theme: { toc: { enabled: false } },
```

h3 podem ficar sob h2 no sumário; h3 isolados também viram entradas. h4 e níveis mais profundos não entram. O corpo aparece diretamente; o sumário não é uma etapa de carregamento obrigatória.

## 2. Autor, créditos, imagens sociais e comentários

<a id="shared-controls"></a>

Pertencem a módulos gerais; esta seção explica apenas o efeito nas publicações:

| Caminho completo           | Efeito nas publicações                                                                                  | Referência principal                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `site.author`              | Fallback de autor quando author é omitido ou em branco; também usado nas imagens sociais                | [Identidade do site](/pt-br/blog/config-site-chrome/#identity)                  |
| `theme.enableAboutPage`    | Com About ativo e autor igual ao do site, cria link para About do idioma; caso contrário, texto simples | [Ativar About](/pt-br/blog/config-about/#page-enabled)                          |
| `theme.footer.showCredits` | Afeta créditos das imagens sociais automáticas, sem alterar imagens personalizadas                      | [Rodapé](/pt-br/blog/config-site-chrome/#footer)                                |
| `site.ogImage`             | Imagem social global quando não há outra de maior prioridade                                            | [Identidade e prioridade das imagens](/pt-br/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | Exige conexão completa e restrições de mapeamento satisfeitas; sem controle individual no frontmatter   | [Comentários Giscus](/pt-br/blog/config-comments/#controls)                     |

## 3. Campos individuais: não colocar em site.config

<a id="frontmatter"></a>

São os 22 campos completos de frontmatter, não novos campos site.config. Os tipos partem dos valores informados pelo autor; datas viram Date e imagens locais viram metadados.

### Conteúdo e metadados

| Campo         | Tipo e comportamento padrão                                                 | Efeito, limites e exemplo                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`       | string obrigatório, sem padrão                                              | Título e metadados da publicação, não nome global. Exemplo `title: 'Minhas anotações'`                                                                       |
| `description` | string obrigatório, sem padrão                                              | Metadescrição e contexto abaixo do título quando context não definido; não é o corpo inteiro. Exemplo `description: 'Anotações de uma sessão de depuração.'` |
| `pubDate`     | Data válida obrigatória, sem padrão                                         | Data de publicação, ordem da lista e metadados. Detalhe mostra data UTC; datas futuras não ocultam. Exemplo `pubDate: '2026-11-13'`                          |
| `updatedDate` | Data opcional, não definida                                                 | Mostra atualização e tem prioridade no sitemap; não substitui pubDate na ordem. Exemplo `updatedDate: '2026-11-14'`                                          |
| `author`      | string opcional; omitido ou em branco usa autor do site                     | Não cria página de autor automaticamente. Exemplo `author: 'Outro autor'`                                                                                    |
| `subtitle`    | string opcional, não definido                                               | Subtítulo; não duplica quando idêntico ao contexto. Exemplo `subtitle: 'Do sintoma ao diagnóstico'`                                                          |
| `context`     | string opcional; omitido usa description                                    | Contexto abaixo do título; string vazia oculta a linha sem limpar a metadescrição. Exemplo `context: 'Resolver um problema concreto.'`                       |
| `tags`        | Array string opcional; sem entradas ao omitir                               | Links também dependem do controle global. Exemplo `tags: ['astro', 'anotações']`                                                                             |
| `heroImage`   | Caminho de imagem local opcional; sem capa ao omitir                        | Não aceita URL remota nem trata URL public pela mesma regra. Prepare o arquivo. Exemplo `heroImage: ./cover.jpg`                                             |
| `ogImage`     | Imagem local / caminho public / HTTPS opcional; omitido usa fallback social | Não altera capa do corpo; prepare o arquivo. Exemplo `ogImage: /images/share.png`                                                                            |
| `toc`         | boolean opcional; herda sumário global                                      | true supera sumário global desligado, mas sem títulos não aparece. Exemplo `toc: false`                                                                      |
| `search`      | boolean opcional, padrão true                                               | false sai da busca interna sem ocultar publicação, RSS, sitemap ou exportação IA. Exemplo `search: false`                                                    |

Comece só com os obrigatórios e acrescente os demais conforme necessário:

```yaml
---
title: 'Minhas anotações'
description: 'Anotações de uma sessão de depuração.'
pubDate: '2026-11-13'
subtitle: 'Do sintoma ao diagnóstico'
context: 'Resolver um problema concreto.'
tags: ['astro', 'anotações']
toc: true
search: true
---
```

Não há draft, publicação agendada, comments individual, Red Queen individual ou matemática individual. Guarde conteúdo incompleto fora das pastas de conteúdo; campos desconhecidos não são controles de privacidade.

<a id="output-fields"></a>

### Estatísticas OUTPUT e textos de estado

| Campo        | Tipo e comportamento padrão                                             | Efeito, limites e exemplo                                                                                            |
| ------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `wordCount`  | Inteiro não negativo opcional; calcula do texto-fonte                   | Substitui a contagem independentemente, sem alterar tokenCount. Exemplo `wordCount: 800`                             |
| `tokenCount` | Inteiro não negativo opcional; round(max(contagem automática, 1) × 1.3) | Estimativa, não tokenizer de modelo ou consumo real. Exemplo `tokenCount: 1040`                                      |
| `aiModel`    | string opcional; sem rótulo ao omitir                                   | Mostra na área de estado e OUTPUT, sem validar modelo real. Exemplo `aiModel: 'Nome do modelo informado pelo autor'` |
| `aiMode`     | string opcional; sem rótulo ao omitir                                   | Só texto de modo, sem executar tarefas. Exemplo `aiMode: 'notes'`                                                    |
| `aiState`    | string opcional; sem rótulo ao omitir                                   | Só texto de estado, sem consultar saúde do serviço. Exemplo `aiState: 'edited'`                                      |

A contagem automática remove parte de Markdown, código e links. Ideogramas CJK, kana e coreano são contados por caractere; outros textos principalmente por espaços. Fórmulas e fontes MDX ainda podem influenciar a estimativa. Informar só wordCount não recalcula tokenCount. A partir de 1.000, ambos aparecem como k com uma casa decimal, sem mudar os valores originais.

```yaml
wordCount: 800
tokenCount: 1040
aiModel: 'Nome do modelo informado pelo autor'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### Compatibilidade e campos não usados atualmente

| Campo            | Tipo e padrão                               | Estado, limites e exemplo                                                                                                                                                          |
| ---------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | Inteiro positivo opcional, não definido     | Compatibilidade; duração de leitura não aparece atualmente. `readMinutes: 3` não a restaura                                                                                        |
| `aiLatencyMs`    | Inteiro não negativo opcional, não definido | Compatibilidade; latência não aparece atualmente. `aiLatencyMs: 150` não é uma medição real                                                                                        |
| `aiConfidence`   | number de 0 a 1 opcional, não definido      | Compatibilidade; confiança não aparece atualmente. `aiConfidence: 0.9` não avalia a correção                                                                                       |
| `canonicalTopic` | string opcional, não definido               | Não usado atualmente. `canonicalTopic: 'astro'` não gera tópicos nem muda canonical                                                                                                |
| `sourceLinks`    | Array de endereços opcional, não definido   | Só validação/normalização atualmente. Aceita HTTP(S), acrescenta https a domínios nus. `sourceLinks: ['https://example.com/']` não mostra referências nem entra no corpo exportado |

Para mostrar referências, coloque links Markdown no corpo. Aceitar campos antigos não significa manter a interface correspondente, nem exige apagá-los ao atualizar.

## 4. Textos da interface de publicação

<a id="article-messages"></a>

Prefixo: `i18n.locales.<locale>.messages.blog`. Todos são substituições opcionais string, resolvidas pelas regras normais de idioma. A tabela mostra padrões integrados em chinês simplificado/inglês. Os exemplos são membros do objeto blog, não frontmatter.

Textos ativos são condicionais à área correspondente. String vazia pode limpar rótulos, mas não ocultar o recurso inteiro; não esvazie nomes acessíveis. Campos marcados como não usados não produzem efeito na página.

| Campo                | Padrão em chinês simplificado / inglês | Efeito e limites                                                    | Estado               | Exemplo de membro                            |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------- | -------------------- | -------------------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed              | Selo do monitor, só com Red Queen ativo; sem monitoramento real     | Condicional          | `rqBadge: "Sinal do monitor"`                |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed   | Nome de replay do monitor; não altera arquivos ou estratégia        | Condicional          | `rqReplayAria: "Repetir sinal do monitor"`   |
| `backToTop`          | 返回顶部 / Back to top                 | Nome do botão de topo, cuja exibição depende da rolagem             | Condicional          | `backToTop: "Voltar ao topo"`                |
| `toastP10`           | 语境解析 10% / context parsed 10%      | Aviso inicial de progresso de leitura, não de solicitação IA        | Condicional          | `toastP10: "Contexto analisado: 10%"`        |
| `toastP30`           | 语境解析 30% / context parsed 30%      | Progresso de leitura, não resultado de análise semântica            | Condicional          | `toastP30: "Contexto analisado: 30%"`        |
| `toastP60`           | 推理稳定 60% / inference stable 60%    | Progresso de leitura, não estado de inferência do modelo            | Condicional          | `toastP60: "Inferência estável: 60%"`        |
| `toastDone`          | 输出完成 / output finalized            | Aviso ao concluir leitura; não comprova geração ou validação        | Condicional          | `toastDone: "Saída concluída"`               |
| `metaPublished`      | 发布 / published                       | Rótulo da data de publicação, sem alterar a data                    | Condicional          | `metaPublished: "Publicado"`                 |
| `metaAuthor`         | 作者 / by                              | Rótulo do autor, sem alterar seu valor                              | Condicional          | `metaAuthor: "Autor"`                        |
| `metaUpdated`        | 更新 / updated                         | Rótulo de atualização, exige updatedDate                            | Condicional          | `metaUpdated: "Atualizado"`                  |
| `systemStatusAria`   | 模型状态 / Model status                | Nome acessível da área de estado, exige ao menos um campo de estado | Condicional          | `systemStatusAria: "Estado do modelo"`       |
| `systemModelLabel`   | 模型 / model                           | Rótulo de modelo, exige aiModel; também no OUTPUT                   | Condicional          | `systemModelLabel: "Modelo"`                 |
| `systemModeLabel`    | 模式 / mode                            | Rótulo de modo, exige aiMode                                        | Condicional          | `systemModeLabel: "Modo"`                    |
| `systemStateLabel`   | 状态 / state                           | Rótulo de estado, exige aiState                                     | Condicional          | `systemStateLabel: "Estado"`                 |
| `promptContextLabel` | 语境 / Context                         | Rótulo do contexto, exige contexto não vazio                        | Condicional          | `promptContextLabel: "Contexto"`             |
| `heroMonitor`        | 神经监视器 / neural monitor            | Texto do monitor de capa, exige heroImage                           | Condicional          | `heroMonitor: "Monitor neural"`              |
| `heroSignalSync`     | 信号同步中 / signal sync active        | Decoração estática de sinal, sem consultar sincronização            | Condicional          | `heroSignalSync: "Sincronizando sinal"`      |
| `heroModelOnline`    | 模型在线 / model online                | Decoração estática de modelo, sem consultar serviço                 | Condicional          | `heroModelOnline: "Modelo conectado"`        |
| `toc`                | 文章目录 / On this page                | Nome do sumário, exige ativação e títulos disponíveis               | Condicional          | `toc: "Índice de artigos"`                   |
| `responseOutput`     | 输出 / Output                          | Nome da barra OUTPUT, sem controlar o corpo                         | Condicional          | `responseOutput: "Saída"`                    |
| `statsWords`         | 词 / words                             | Rótulo de palavras, sem alterar a contagem                          | Condicional          | `statsWords: "Palavras"`                     |
| `statsTokens`        | 令牌 / tokens                          | Rótulo de tokens, sem alterar a estimativa                          | Condicional          | `statsTokens: "Tokens"`                      |
| `copySectionLink`    | 复制本节链接 / Copy section link       | Nome da cópia de links h2/h3, sem mudar algoritmo de âncoras        | Condicional          | `copySectionLink: "Copiar link desta seção"` |
| `regenerate`         | 重播扫描 / Replay scan                 | Botão de repetir varredura, só efeito visual                        | Condicional          | `regenerate: "Repetir varredura"`            |
| `relatedAria`        | 相关文章 / Related posts               | Nome acessível dos relacionados, exige outras publicações           | Condicional          | `relatedAria: "Artigos relacionados"`        |
| `related`            | 相关文章 / Related                     | Título dos relacionados, sem controlar algoritmo                    | Condicional          | `related: "Artigos relacionados"`            |
| `backToBlogAria`     | 返回博客 / Back to blog                | Nome acessível do retorno ao blog                                   | Condicional          | `backToBlogAria: "Voltar ao blog"`           |
| `backToBlog`         | 返回博客 / Back to blog                | Texto visível do retorno, sem alterar destino                       | Condicional          | `backToBlog: "Voltar ao blog"`               |
| `comments`           | 评论 / Comments                        | Nome acessível dos comentários, exige configuração válida           | Condicional          | `comments: "Comentários"`                    |
| `metaReadMinutes`    | 分钟阅读 / min read                    | Não usado atualmente; alterar não restaura duração de leitura       | Não usado atualmente | `metaReadMinutes: "minutos de leitura"`      |
| `latencyLabel`       | 延迟估计 / latency est                 | Não usado atualmente; alterar não restaura latência                 | Não usado atualmente | `latencyLabel: "Latência estimada"`          |
| `confidenceLabel`    | 置信度 / confidence                    | Não usado atualmente; alterar não restaura confiança                | Não usado atualmente | `confidenceLabel: "Confiança"`               |

Estados, marcas de capa e avisos de rolagem expressam principalmente a atmosfera. Não comprovam modelo IA online, sincronização ou precisão reais. O botão regenerate apenas repete a varredura visual, sem reescrever o artigo ou solicitar IA.

Por exemplo, altere OUTPUT e o texto de copiar seção:

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        blog: {
          responseOutput: 'Conteúdo',
          statsWords: 'Palavras',
          statsTokens: 'Tokens estimados',
          copySectionLink: 'Copiar endereço desta seção',
          regenerate: 'Repetir efeito de varredura',
        },
      },
    },
  },
},
```

O retorno ao blog continua levando à lista do idioma atual. Alterar texto não muda destino. Relacionados são até três publicações mais recentes do mesmo idioma, excluindo a atual, sem similaridade IA ou opções de quantidade/similaridade. related/relatedAria só mudam título e nome acessível.

<a id="interaction-messages"></a>

### Textos de cópia de código e prévia de imagens

O prefixo passa a `i18n.locales.<locale>.messages`. Todos são string opcionais e condicionais; não alteram permissões de cópia, origem das imagens ou controles de recursos.

| Sufixo do caminho    | Padrão em chinês simplificado / inglês                              | Efeito e limites                                                     | Exemplo de membro                                                                  |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | Texto de copiar código, sem alterar conteúdo copiado                 | `codeCopy: { copy: "Copiar código" }`                                              |
| `codeCopy.copied`    | 已复制 / Copied                                                     | Confirmação de cópia de código e links de seção                      | `codeCopy: { copied: "Copiado" }`                                                  |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | Falha de cópia de código e links; não concede permissão de clipboard | `codeCopy: { failed: "Não foi possível copiar; selecione o código manualmente." }` |
| `imagePreview.open`  | 查看大图 / View image                                               | Nome acessível da entrada e janela de prévia                         | `imagePreview: { open: "Ampliar imagem" }`                                         |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | Nome do botão de fechar, sem alterar a fonte da imagem               | `imagePreview: { close: "Fechar prévia da imagem" }`                               |

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        codeCopy: { copy: 'Copiar conteúdo', copied: 'Conteúdo copiado', failed: 'Não foi possível copiar; selecione manualmente.' },
        imagePreview: { open: 'Ampliar esta imagem', close: 'Fechar imagem' },
      },
    },
  },
},
```

Só h2/h3 do corpo com id recebem botão de link de seção; sucesso/falha reutilizam codeCopy.copied/failed. Cópia e prévia exigem JavaScript. A prévia de imagens comuns exclui capa e imagens dentro de links/botões. Amplia a fonte escolhida pelo navegador, sem solicitar original de alta resolução separado. Não têm campo enabled em site.config.

## 5. Limites e validação atuais

A página da publicação acompanha mudanças na preferência de movimento reduzido do sistema sem recarregar. Ao ativar, capa e rede de fundo ficam estáticas e Red Queen para e se oculta; ao desativar, os efeitos voltam com os tempos de início existentes. Não redefine o progresso de leitura nem reconecta cópia de código, links de seção ou prévia de imagens. Não há novo controle em site.config.

Corpo e painel aparecem diretamente e ficam estáticos; rede de fundo, faixa luminosa do título e efeitos da capa são independentes. Não há opções públicas de troca global do tema AI, duração de entrada do corpo, respiração do painel, quantidade de relacionados, enabled de prévia ou cópia. Adicionar chaves com esses nomes não produz efeito.

locale, articleSlug, headings, filePath, related, localeHrefs e seoLocaleHrefs são propriedades do componente BlogPost, não site.config ou frontmatter. As rotas padrão fornecem esses dados. Não os preencha manualmente ao criar publicações comuns.

Em dev, confira conteúdo real com/sem títulos e capa, além de cópia, links de seção e prévia. Valide busca no preview compilado. Antes de publicar, pare dev, execute npm run doctor e depois npm run preview; não repita check/build imediatamente após sucesso. O site online só muda após nova implantação.

Veja instalação e atualização no [primeiro tutorial](/pt-br/blog/starter-guide-1-configure-your-site/), escrita em [primeira publicação](/pt-br/blog/starter-guide-2-languages-and-routing/) e publicação no [guia de implantação](/pt-br/blog/starter-guide-deployment/).
