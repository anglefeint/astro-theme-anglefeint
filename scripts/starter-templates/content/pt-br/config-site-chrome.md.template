---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: identidade, navegação e rodapé'
subtitle: 'Nome, domínio, redes sociais e elementos públicos'
description: 'Campos de identidade do site, ambiente, navegação, links sociais, créditos e compatibilidade.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

Para trocar suas informações pela primeira vez, veja [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/); para domínio, veja o [guia de publicação](/pt-br/blog/starter-guide-deployment/). Outros módulos estão no [índice de configuração](/pt-br/blog/config-reference/).

As configurações ficam em src/site.config.ts. Os padrões são do pacote, não o nome, contas ou domínio pessoais do demo. Preserve import, export e os outros módulos do defineThemeConfig({...}) existente e mescle os trechos.

<a id="identity"></a>

## site: seis campos de identidade global

site é um objeto; todos os campos podem ser omitidos na configuração parcial. Todos os estados abaixo são condicionais ao consumo pela página. Ambiente ou parâmetros mais específicos da página podem ter prioridade.

| Caminho completo   | Tipo             | Padrão do tema                                                                          | Efeito, limites e exemplo                                                                                                                                                                                                                   |
| ------------------ | ---------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string           | `"My Blog"`                                                                             | Marca do cabeçalho, nome do copyright, título RSS, nome nos dados estruturados e informações em algumas páginas e imagens sociais automáticas. Não é o título grande inicial; sem fallback uniforme para string vazia. Exemplo `"我的博客"` |
| `site.description` | string           | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | Uma fonte da descrição global e do índice para máquinas. A página inicial prioriza messages.siteDescription; About e listas têm descrições próprias. Não substitui todas as páginas. Exemplo `"记录项目、阅读和生活。"`                     |
| `site.url`         | string           | `"https://example.com"`                                                                 | URL pública absoluta usada em Astro site, canonical, RSS, sitemap e exportações. Use HTTP(S) real, não URL de uma publicação. Não compra domínio nem configura DNS, certificado ou publicação. Exemplo `"https://blog.example.com"`         |
| `site.author`      | string           | `"Your Name"`                                                                           | Autor padrão e dados estruturados; author da publicação pode substituir. Copyright usa site.title. Não altera automaticamente About ou email. Exemplo `"小林"`                                                                              |
| `site.tagline`     | string           | `""`                                                                                    | Frase extra do rodapé, com trim; vazio não aparece. O valor antigo Built with Astro. também é oculto para não duplicar os créditos. Exemplo `"保持好奇，持续构建。"`                                                                        |
| `site.ogImage`     | string, opcional | `""`                                                                                    | Imagem social global quando não há imagem prioritária de página/publicação. Em branco usa a imagem do tema. Caminho public local ou HTTPS; não troca avatar ou todas as capas. Exemplo `"/images/share.webp"`                               |

site.title é diferente de `i18n.locales.<语言>.site.homeTitle`: o primeiro é o nome global, o segundo altera só o título grande visível da página inicial do idioma. Procura um valor não vazio na cadeia de idiomas e só então usa o nome global. Veja [título inicial](/pt-br/blog/config-home/#home-title). messages.siteTitle não é usado na identidade padrão nem no título grande; preenchê-lo não muda a marca.

site.description também não é a apresentação inicial visível. Ela usa `i18n.locales.<语言>.site.hero`; a metadescrição inicial ainda tem messages.siteDescription. Veja a prioridade no [dicionário da página inicial](/pt-br/blog/config-home/#site-fallbacks). Alterar a identidade global não reescreve uma apresentação pessoal já preenchida no About.

### Prioridade e caminhos da imagem social

site.ogImage só é usado quando o head público não tem imagem da página. ogImage da publicação, imagem social automática ou capa podem ter prioridade; veja o [dicionário de publicações](/pt-br/blog/config-article/#frontmatter). Com geração automática global, site.ogImage não substitui todas as imagens individuais.

/images/share.webp corresponde a public/images/share.webp; prepare o arquivo antes. Arquivo ausente, caminho fora de publicDir ou inválido gera erro ao resolver essa imagem de fallback. Imagens locais recebem base e parâmetro de versão de conteúdo. HTTPS mantém a URL remota, sem download de validação. Vazio ou só espaços usa a imagem do tema, sem remover metadados sociais.

site.ogImage é string, não um objeto de importação de imagem Astro; frontmatter.ogImage aceita tipos diferentes. Não há substituição por PUBLIC_SITE_OG_IMAGE e o campo não muda heroImage.

<a id="environment"></a>

## Substituições de ambiente e prioridade do domínio

Não são novos campos site.config, mas variáveis lidas atualmente. Todas são string e usam o campo site correspondente quando não definidas. A resolução usa coalescência nula: string vazia não vira automaticamente “não definido”.

| Variável de ambiente    | Substitui prioritariamente | Exemplo                                  |
| ----------------------- | -------------------------- | ---------------------------------------- |
| PUBLIC_SITE_TITLE       | site.title                 | PUBLIC_SITE_TITLE=我的博客               |
| PUBLIC_SITE_DESCRIPTION | site.description           | PUBLIC_SITE_DESCRIPTION=项目与学习笔记   |
| PUBLIC_SITE_AUTHOR      | site.author                | PUBLIC_SITE_AUTHOR=小林                  |
| PUBLIC_SITE_TAGLINE     | site.tagline               | PUBLIC_SITE_TAGLINE=保持好奇             |
| PUBLIC_SITE_URL         | site.url                   | PUBLIC_SITE_URL=https://blog.example.com |

A integração lê PUBLIC_SITE_URL com o modo dotenv do Vite correspondente a dev/build e --mode para manter Astro site e a URL pública coerentes. Ambiente do processo tem prioridade sobre dotenv. Não altere só site.url e esqueça PUBLIC_SITE_URL na hospedagem. String vazia pode apagar texto ou invalidar endereço; não restaura padrões.

Na página, SITE_URL mantém import.meta.env.SITE como fallback intermediário: PUBLIC_SITE_URL → SITE → site.url. Na integração padrão, Astro site usa PUBLIC_SITE_URL ou a URL configurada, e o head prioriza Astro.site. SITE é compatibilidade do adaptador, não outro domínio independente recomendado.

Domínio e subcaminho de publicação são distintos. base do Astro, saída da hospedagem e DNS/HTTPS ainda exigem configuração conforme o tutorial. Colocar uma pasta em site.url não move automaticamente todas as rotas. Reinicie dev e recompile/publique em produção; não configura redirecionamentos no servidor.

<a id="navigation"></a>

## Navegação pública: entradas fixas e controles de recursos

Não existem array nav, ordem de menu ou itens personalizados públicos. O cabeçalho padrão combina as entradas assim:

| Local                 | Origem e limites atuais                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Marca                 | site.title / ambiente; link para a página inicial do idioma atual                                                          |
| Página inicial e Blog | Mantém as duas entradas padrão; nomes em messages.nav.home / blog, sem alterar destinos por texto                          |
| About                 | theme.enableAboutPage, boolean, padrão true; theme: { enableAboutPage: false } desativa página e entrada                   |
| Decoder em Frontier   | theme.enableDecoderPage, boolean, padrão true; texto do cabeçalho fixo Decoder Lab                                         |
| Fragments em Frontier | theme.fragments.enabled, boolean, padrão false; texto em messages.fragments.title                                          |
| Contact em Frontier   | Aparece com About ativo; texto em messages.about.contact, destino /about/#contact do idioma atual, independente de Decoder |
| Busca                 | theme.search.enabled, boolean, padrão true; veja [busca](/pt-br/blog/config-search/#enabled)                               |
| Idioma e estado       | Idiomas ativos, meta.label e textos estáticos de estado abaixo; opções não são uma lista arbitrária de links               |

O título e nome Frontier são fixos e a área só desaparece sem nenhum subitem. messages.decoderPage.fullTool altera a ferramenta completa e seu link no rodapé, mas não o Decoder Lab fixo do cabeçalho.

Veja idiomas e endereços no [dicionário de idiomas](/pt-br/blog/config-languages/#content-and-seo), e os campos próprios de About, Fragments e Decoder em seus dicionários. Não desligue navegação com texto vazio: o endereço pode continuar ou o botão perder clareza.

<a id="chrome-messages"></a>

### Sete textos do cabeçalho e rodapé

Prefixo: `i18n.locales.<语言>.messages`. São strings opcionais, com padrões integrados e fallback; a tabela mostra apenas chinês simplificado / inglês. Todos são condicionais à navegação ou área de créditos correspondente existir. Renderizados como texto, sem Markdown ou HTML arbitrário.

| Campo relativo     | Padrão em chinês simplificado / inglês | Efeito e limites                                                   | Exemplo      |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------ | ------------ |
| `nav.home`         | 首页 / Home                            | Texto da navegação inicial, sem alterar a rota                     | `"首页"`     |
| `nav.blog`         | 博客 / Blog                            | Texto da entrada Blog, sem alterar a rota                          | `"文章"`     |
| `nav.about`        | 关于 / About                           | Navegação About e entrada para reabrir a janela de conteúdo        | `"关于我"`   |
| `nav.status`       | system: online / system: online        | Estado estático do cabeçalho; não verifica rede, APIs ou serviços  | `"系统在线"` |
| `nav.statusAria`   | 系统状态 / System status               | Nome acessível da área de estado; não ativa monitoramento          | `"站点状态"` |
| `footer.theme`     | 主题： / Theme by                      | Prefixo dos créditos do tema; texto e destino Anglefeint são fixos | `"主题来自"` |
| `footer.builtWith` | 构建工具： / Built with                | Prefixo dos créditos Astro; texto e destino Astro são fixos        | `"使用"`     |

messages.langLabel atende ao seletor de idiomas, cujas opções usam meta.label. Veja [textos de idioma](/pt-br/blog/config-languages/#common-messages). Contact e Fragments usam seus próprios módulos, sem inventar campos em messages.nav.

<a id="social"></a>

## social.links: links sociais compartilhados pelo cabeçalho e rodapé

- **Tipo / padrão:** SocialLink[] / []; cinco campos por item abaixo.
- **Estado e efeito:** ativo. Ambos usam os mesmos links na ordem do array. Substitui tudo; sem limite público nem configuração por idioma.
- **Limites:** [] não esconde toda a área. Componentes padrão mostram placeholders não clicáveis de Mastodon, Twitter e GitHub; dev também mostra uma dica de configuração. Um item real com href vazio continua um link, sem virar placeholder.
- **Exemplo:** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }].

Email e contato GitHub do About são independentes. Alterar o array não altera o texto de contato. Não há theme.social.enabled ou hidePlaceholders em site.config. showPlaceholdersWhenEmpty é parâmetro de layout.

<a id="social-fields"></a>

### Cinco campos de cada SocialLink

Prefixo: social.links[]. Campos obrigatórios não recebem valores automáticos. Mesmo que o tipo de entrada parcial aceite objetos parciais, forneça itens completos e válidos.

| Campo   | Tipo / padrão                                                                  | Estado, efeito e limites                                                                                                                                                                          | Exemplo                       |
| ------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | string, obrigatório / nenhum                                                   | Ativo: destino real, sem validação uniforme de protocolo, disponibilidade ou valor não vazio e sem BASE_URL automático. Use HTTPS completo ou caminho interno correto; não é uma conta verificada | 'https://github.com/yourname' |
| label   | string, obrigatório / nenhum                                                   | Ativo: nome acessível e texto visível sem ícone. Não infere plataforma ou título; informe nome claro não vazio                                                                                    | 'GitHub'                      |
| rel     | string, opcional / não definido; resultado inclui ao menos noopener noreferrer | Ativo: relações separadas por espaços, em minúsculas e sem duplicatas; remove opener e preserva proteção de nova janela. String vazia não desliga a proteção; tipo não string gera erro           | 'me nofollow'                 |
| icon    | SocialIcon integrado, opcional / não definido                                  | Condicional: um dos doze nomes abaixo, usado sem iconSrc. Nome desconhecido não vazio gera erro; não identifica a plataforma pela URL. Sem ícone usa label                                        | 'github'                      |
| iconSrc | string, opcional / não definido                                                | Condicional: caminho SVG/PNG/WebP local em publicDir. Válido e não vazio tem prioridade sobre icon. Só espaços significa não definido; tipo ou caminho inválido gera erro                         | '/icons/community.svg'        |

Todos os itens reais abrem em nova aba; rel personalizado é combinado com as proteções. Os rótulos não interpretam HTML. Nomes de ícone são exatos e distinguem maiúsculas:

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### Restrições dos arquivos de ícone personalizado

public/icons/community.svg corresponde a iconSrc: '/icons/community.svg'. É um arquivo real em publicDir, não recurso do pacote ou src/assets. Começa com um único /; não aceita URL, protocolo relativo, query, fragmento, caminho codificado em percentual ou segmentos `.` ou `..`. Barras invertidas, dois-pontos e controles também não são aceitos.

A compilação verifica existência, arquivo e caminho real dentro de publicDir, inclusive após links simbólicos. Espaços comuns e nomes chineses são codificados pelo componente; não os codifique antes em percentual. O caminho recebe base do Astro automaticamente, mas a prioridade do ícone não muda o tratamento literal de href. JPG e GIF não são extensões aceitas aqui.

Com iconSrc válido, icon integrado não participa da escolha. Dimensões e espaçamento são parâmetros de layout do componente, não campos SocialLink.

<a id="footer"></a>

## theme.footer: links e créditos

| Caminho completo           | Tipo / padrão                          | Estado, efeito e limites                                                                                                                                                                                                 | Exemplo                                                   |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | Ativo: créditos com links do tema e Astro. Não apaga copyright, redes, frase ou outros links. Também participa dos créditos de imagens sociais automáticas de publicações, sem alterar imagens personalizadas existentes | false                                                     |
| theme.footer.links         | { label: string; href: string }[] / [] | Ativo: links personalizados em ordem, substituindo todo o array. Não muda o cabeçalho. O layout pode acrescentar Decoder; [] não garante rodapé sem links                                                                | [{ label: '项目', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | string, obrigatório / nenhum           | Condicional: nome visível como texto, sem obter título do destino                                                                                                                                                        | '项目'                                                    |
| theme.footer.links[].href  | string, obrigatório / nenhum           | Condicional: URL literal, sem a validação de caminhos das imagens sociais personalizadas nem prefixo base automático. Preencha caminhos internos corretamente. Navega na aba atual por padrão                            | 'https://example.com/project/'                            |

Links personalizados vêm antes dos adicionais do layout, sem deduplicação. Com Decoder ativo, o framework acrescenta seu link completo com messages.decoderPage.fullTool. Desative Decoder pelo controle próprio; limpar footer.links não remove esse link.

O copyright usa ano da compilação e SITE_TITLE efetivo, sem copyright/year independentes. site.tagline aparece separadamente dos créditos. Após trim, o antigo Built with Astro. é omitido por compatibilidade. showCredits: false não afeta outras frases nem apaga créditos de imagens existentes.

<a id="examples"></a>

## Exemplo para mesclar identidade e links públicos

Preserve suas informações atuais e mescle só os campos desejados:

```ts
site: {
  title: '小林的博客',
  description: '记录项目、阅读和生活。',
  url: 'https://blog.example.com',
  author: '小林',
  tagline: '保持好奇，持续构建。',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: '项目主页', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目', href: 'https://example.com/project/' }],
  },
},
```

Troque contas, domínios e links de exemplo pelos seus; o tema não os verifica online. Para ícones sociais ou imagem global personalizada, prepare os arquivos public antes de informar iconSrc ou site.ogImage.

Para alterar só a navegação chinesa e prefixos de créditos:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        nav: { home: '首页', blog: '文章', about: '关于我' },
        footer: { theme: '主题来自', builtWith: '使用' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## Não usado atualmente: messages.siteTitle

Caminho completo: `i18n.locales.<语言>.messages.siteTitle`, string opcional. Os padrões em chinês simplificado / inglês são 'Angle Feint'. O título grande inicial padrão e a identidade pública não o leem. **Não usado atualmente**: siteTitle: '我的博客' não muda esses nomes.

O título inicial usa `i18n.locales.<语言>.site.homeTitle` e a marca pública usa site.title global. Veja [título inicial](/pt-br/blog/config-home/#home-title) e [identidade](#identity). Não precisa preencher esse campo reservado para renomear o site.

<a id="boundaries"></a>

## Compatibilidade e campos sem efeito

- Os seis campos site, os campos sociais/de rodapé e os sete textos acima são consumidos, mas prioridade de imagens, ambiente e controles determinam o efeito em cada página.
- Built with Astro. de site.tagline é um valor especial de compatibilidade com o padrão antigo. Sua supressão não significa que qualquer frase seja desativada.
- O estado não usado de messages.siteTitle está acima. Ser aceito pelo tipo não significa ser lido pela página.
- homeHref, localeHrefs, extraLinks, showPlaceholdersWhenEmpty e iconSize são parâmetros de componentes, não site.config. Sem array nav, controle de placeholders, modelo de copyright ou monitoramento independente públicos.

Prepare os arquivos, salve e recompile/publique. Mudanças de ambiente exigem reler o modo correspondente. Confirme domínio, disponibilidade dos links, contas e aparência no seu ambiente; tipos locais válidos não comprovam sucesso online. Volte ao [índice de configuração](/pt-br/blog/config-reference/) para outros módulos.
