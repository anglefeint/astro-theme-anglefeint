---
tags: ['anglefeint', 'starter']
title: 'Guia 8: publicar o blog no seu domínio'
subtitle: 'Confirme o endereço público, prepare imagens e verifique o build antes de publicar arquivos estáticos e conectar o domínio.'
description: 'Publicação estática, domínio e variáveis, arquivos de build e imagens, busca e exportações públicas, além do GA4 opcional.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-01.webp'
---

As expressões chinesas nos exemplos de `locales.zh` são intencionais: mostram como personalizar o conteúdo em chinês sem alterar os outros idiomas. Os valores padrão em chinês/inglês nas tabelas são citações do tema, não traduções pendentes.

Esta é a parte 8 de 8 do guia inicial. [Veja a ordem completa](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Consulte a referência por campo](/pt-br/blog/config-reference/).

Com o blog funcionando localmente, publicar exige três coisas: confirmar o domínio final, gerar todos os arquivos estáticos e configurar a hospedagem para servi-los nesse domínio. O tema não compra domínio, altera DNS nem entra automaticamente na plataforma.

O starter atual gera um site estático. Não precisa manter Node.js rodando em produção nem adicionar um adapter SSR para publicar páginas estáticas. Os exemplos abaixo usam npm e o diretório padrão `dist/`.

## 1. Definir o endereço público final

Escolha um domínio administrado por você, como `https://blog.example.com`. Mescle no `site` de nível superior existente em `src/site.config.ts`:

```ts
site: {
  url: 'https://blog.example.com',
},
```

Use o endereço público final, não localhost, URL de um artigo ou painel da hospedagem. Preserve as outras informações.

Esse valor gera canonical, RSS, sitemap, imagens de compartilhamento e links públicos. Ele não muda o endereço do servidor local nem conecta automaticamente um domínio ainda não configurado.

### Procurar variáveis antigas sobrescrevendo o domínio

`PUBLIC_SITE_URL` em `.env`, nos `.env.*` aplicáveis ou no ambiente de build tem prioridade. Se alterar site.url e continuar vendo o domínio antigo, confira todos esses locais. dev normalmente usa development e build usa production. Um `--mode` próprio também lê seus arquivos de modo; verificar só `.env` não basta.

Se não precisar da variável, remova-a e use site.url. Se precisar de ambientes diferentes, configure os valores corretos em cada build. Reconstrua depois; não altere manualmente um único link em uma saída antiga.

### Publicar na raiz do domínio

O tema considera URLs como `https://blog.example.com/`. Publicar em `https://example.com/my-blog/` ainda exige adaptação. Definir só base no Astro não comprova compatibilidade de páginas e recursos.

Escolha hospedagem que sirva o site na raiz, os index.html dos diretórios e os caminhos internos normalmente. No GitHub Pages, prefira o fluxo do domínio do site ou um domínio próprio; não presuma que o tutorial de subdiretório de projeto já se aplica ao tema. Consulte a [documentação de publicação do Astro](https://docs.astro.build/en/guides/deploy/) e o guia da plataforma.

## 2. Preparar todos os arquivos de origem necessários

Publique seu próprio projeto e o ramo que contém seus artigos. Não use o conteúdo demo do repositório de manutenção como se fosse seu blog pessoal. Inclua pelo menos configuração, conteúdo, dependências e recursos usados.

Após adicionar ou trocar capas locais e imagens de Fragments, prepare os responsivos em dev ou doctor local e faça commit de:

- Artigos, Fragments, páginas próprias e `src/site.config.ts`.
- Originais referenciados, imagens public, ícones, músicas usadas e outros recursos.
- Todo `src/assets/blog/covers/`, incluindo manifest.json, generated/ e os originals/ usados.
- `package.json`, `package-lock.json`, configuração Astro e arquivos de hospedagem existentes.

Originais podem ficar junto do artigo ou em public, não apenas originals. Inclua esses arquivos também. A preparação é explicada em [adicionar imagens a artigos e Fragments](/pt-br/blog/starter-guide-images/).

**O build comum na hospedagem prepara as imagens responsivas utilizadas**, assim como dev e doctor, inclusive em CI. Os derivados válidos são reutilizados; os ausentes, desatualizados ou danificados são gerados. Preservar os derivados no Git permite reutilizá-los sem depender do cache da plataforma. Originais ausentes ou inválidos continuam interrompendo a preparação.

**Requer 0.36.2 ou posterior:** Dev, build e doctor (inclusive em CI) reutilizam derivados válidos e geram os ausentes, desatualizados ou danificados. Na versão 0.36.1, prepare as imagens primeiro com dev ou `prepare-covers` antes de build/CI. `prepare-covers --check` e a sincronização da configuração continuam sendo verificações somente de leitura.

Em publicação por Git, não versione node_modules, `.astro` nem dist: a plataforma instala e constrói. Não envie dependências locais como site estático. Se arquivos de ambiente não estiverem no repositório, configure as variáveis necessárias na plataforma. Variáveis PUBLIC_ são para dados públicos, não segredos.

## 3. Verificar localmente o build real

Pare dev com Ctrl+C, confirme que está na raiz e execute:

```bash
npm run doctor
npm run preview
```

Abra o endereço de preview e confira página inicial, artigos, imagens, idiomas e busca. Confira também as entradas de novos idiomas ou páginas opcionais. Serviços externos, como comentários, precisam de conexão real no navegador; um build local não comprova permissões remotas.

Cada comando tem uma função:

| Comando           | Função                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Desenvolvimento local, com preparação de imagens aplicáveis, sem índice de busca do build.                     |
| `npm run doctor`  | Prepara imagens localmente, verifica Astro e constrói; com About ativo, verifica sua configuração de execução. |
| `npm run check`   | No starter atual chama o mesmo doctor; não precisa executá-los em sequência.                                   |
| `npm run build`   | Prepara ou reutiliza os derivados utilizados e constrói o site.                                                |
| `npm run preview` | Serve o dist existente, sem reconstruir nem publicar.                                                          |

Corrija qualquer falha antes de publicar, sem usar dist remanescente. Depois do doctor bem-sucedido, o build já existe: não repita check e build imediatamente. Pare preview com Ctrl+C.

## 4. Publicar todos os arquivos estáticos

Você pode conectar um repositório Git ao serviço ou enviar o build local manualmente. Ambas as formas servem a mesma saída estática.

### Opção 1: build da plataforma a partir do Git

Conecte seu repositório e configure:

| Item                | Configuração do starter atual                                                          |
| ------------------- | -------------------------------------------------------------------------------------- |
| Ramo de build       | O ramo em que você mantém seu blog.                                                    |
| Raiz do projeto     | Pasta com o package.json do blog, não necessariamente a raiz do repositório.           |
| Node.js             | Versão compatível com o projeto e dependências; o starter declara 22.12.0 ou superior. |
| Instalação          | Em npm, `npm ci`, com package-lock.json versionado e compatível com package.json.      |
| Comando de build    | `npm run build`                                                                        |
| Diretório publicado | `dist`, relativo à raiz do projeto.                                                    |

Se a plataforma já instala dependências, não acrescente uma segunda instalação. Se pedir um script completo, instale antes de build. Não execute doctor, check e build em sequência redundante nem gere imagens na plataforma para esconder arquivos que faltaram no commit.

Os presets de framework, ramos e etapas dependem da plataforma. Use a publicação estática; npm run dev e npm run preview não são comandos de produção.

### Opção 2: enviar o build local

Após o doctor local passar, envie todo o conteúdo de `dist/` para a raiz do site. Se o serviço pedir uma pasta de saída, selecione dist. Se pedir os arquivos do site, envie o conteúdo, sem acrescentar outra camada dist na URL.

Além do HTML, inclua `_astro/`, `_blog-covers/`, `_social/`, índices de pesquisa e todos os outros arquivos gerados. Diretórios iniciados por sublinhado não são temporários descartáveis. Enviar só HTML deixa estilos, scripts, imagens ou busca ausentes.

Use publicação completa ou substituição integral na atualização. Apenas sobrescrever arquivos novos pode deixar artigos apagados, paginações e idiomas antigos acessíveis. Apagar Markdown local não apaga automaticamente o HTML de um servidor com upload manual.

## 5. Conectar domínio e DNS

Adicione seu domínio na plataforma e depois crie ou altere os registros DNS conforme os valores fornecidos. Domínio raiz e subdomínio podem usar tipos e destinos diferentes. Use os dados reais, sem copiar um IP de exemplo.

Espere a plataforma confirmar domínio e certificado HTTPS e abra o endereço final. Se usar domínio sem www e com www, escolha um principal, redirecione os demais na hospedagem e coloque o principal em site.url.

canonical é um metadado, não um redirecionamento. site.url não configura DNS, certificados ou múltiplos domínios: isso pertence ao domínio e à hospedagem. Ao trocar o domínio principal, reconstrua, publique e atualize variáveis que ainda tenham o antigo.

## 6. Conferir páginas e saídas públicas depois de publicar

Abra o link direto de um artigo pelo domínio real e recarregue. Conseguir navegar desde o início não basta para comprovar rotas internas. Confira imagens, código, troca de idioma e busca. O que só foi testado em dev precisa ser conferido no site construído.

O tema já fornece estas saídas, sem instalar integrações duplicadas:

| Endereço de exemplo                            | Função                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| `/robots.txt`                                  | Regras de rastreamento e endereço do sitemap, sem controle de acesso.    |
| `/sitemap-index.xml`                           | Entrada do sitemap, com links usando o domínio final.                    |
| `/zh/rss.xml`                                  | Feed de artigos chineses; troque zh para outros idiomas ativos.          |
| `/llms.txt`                                    | Índice geral legível por IA.                                             |
| `/zh/llms.txt`, `/zh/llms-full.txt`            | Índice e coletânea completa quando há conteúdo exportado naquele idioma. |
| `/zh/blog/my-first-post/index.md`              | Markdown do artigo público; substitua o slug de exemplo pelo real.       |
| `/zh/fragments/index.md`, `/zh/about/index.md` | Conteúdo público das páginas habilitadas e elegíveis para exportação.    |

O sitemap usa updatedDate ou, se ausente, pubDate. Não inventa outra data a cada build. Idiomas ou páginas desabilitados não devem ter exportações correspondentes. search: false não torna um artigo privado nem bloqueia outras saídas públicas.

As exportações de IA incluem artigos públicos, Fragments e About habilitados; comentários e ferramentas decorativas ficam fora do corpo exportado. Páginas noindex ou com canonical externo são excluídas. Conflitos com arquivos próprios interrompem o build em vez de sobrescrevê-los. Os documentos e seus links de descoberta são atualizados no build e precisam ser publicados juntos.

Metadados e textos ajudam na descoberta e leitura, sem garantir indexação, citações por IA ou tráfego.

### Diferenças de headers da hospedagem

O build acrescenta `X-Robots-Tag: noindex` para `/:locale/terminal/*` em dist/_headers, preservando regras existentes, sem alterar public/_headers. Plataformas que reconhecem o formato aplicam essas regras; outras precisam de configuração equivalente.

Astro preview não simula _headers da hospedagem. Confira a resposta do serviço real, não apenas a existência do arquivo. Não é necessário adicionar um servidor Node só para essa regra.

A prioridade de domínio e variáveis está na [referência do site](/pt-br/blog/config-site-chrome/#environment). Campos da explicação pública estão na [referência de GA4 e complemento para IA](/pt-br/blog/config-analytics-ai/#supplement).

## 7. Acrescentar uma explicação pública para IA, se precisar

Uma publicação comum não exige essa opção. Para contextualizar o site ou apontar materiais adicionais, mescle no nível superior:

```ts
aiReadableContent: {
  notes: 'Este site registra meus estudos pessoais e pode ser revisado.',
  links: [{ label: 'Página do projeto', href: 'https://example.com/project' }],
},
```

notes aceita Markdown e cada item de links tem label e href. Use endereços HTTP(S) públicos; caminhos relativos e de raiz são resolvidos pelo endereço do site. É informação pública complementar, sem substituir o corpo nem criar restrição de privacidade para artigos.

Para sobrescrever por idioma, use `i18n.locales.<locale>.aiReadableContent`. Por exemplo, texto próprio em chinês sem links adicionais:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容是作者自己的学习笔记。',
        links: [],
      },
    },
  },
},
```

Campos omitidos herdam o global; notes: '' e links: [] ocultam a parte correspondente. O complemento entra nos índices, coletâneas e Markdown individuais. Preencha apenas o que deseja publicar e reconstrua após mudar.

## 8. Habilitar GA4 quando precisar

O padrão não carrega scripts Google Analytics. Se quiser estatísticas, obtenha no fluxo de dados web um Measurement ID iniciado por G-. Veja a [explicação oficial Google](https://support.google.com/analytics/answer/9539598). O tema aceita apenas IDs G-, não IDs numéricos de propriedade, contêiner GTM ou outros identificadores.

Mescle no nível superior, ao lado de site:

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Substitua pelo ID real; string vazia desliga. Formato incorreto causa erro. Um único ID pode acompanhar páginas de todos os idiomas, distinguindo-os pelo caminho. Não cole scripts separados por idioma ou atmosfera.

O carregador só é incluído em produção com ID configurado; dev não envia dados. Endereços localhost, subdomínios localhost e loopback são ignorados no navegador. IP de rede local ou domínio de preview remoto acessando um build de produção pode enviar dados: nem todo preview é excluído.

Depois de publicar, acesse o domínio real e confira o relatório em tempo real do GA4. Bloqueios, rede e configurações do serviço influenciam o resultado. Evite instalar a mesma estatística por código manual, GTM e tema simultaneamente. O recurso não inclui interface de consentimento; adicione uma solução própria se necessário.

## 9. Quando a publicação falha ou o site aparece errado

| Sintoma                                 | O que conferir primeiro                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| npm ci falha                            | Requisitos de Node/dependências e package-lock versionado e compatível com package.json.                               |
| Imagens missing/stale/modified          | Dev, build ou doctor regenera os derivados. Preserve os originais; investigue caminhos e arquivos ilegíveis se falhar. |
| Build passa, mas página dá 404          | Pasta publicada, ramo, raiz e index de diretórios; possível subcaminho não adaptado.                                   |
| Início abre, artigo recarregado dá 404  | Caminhos estáticos reais, publicação só do início ou fallback SPA indevido.                                            |
| Sem estilos, imagens ou busca           | Todo dist publicado, subdiretórios completos e ausência de reescritas incorretas.                                      |
| canonical/RSS mantém domínio de exemplo | site.url, PUBLIC_SITE_URL, variáveis do modo e novo build/publicação.                                                  |
| Mudança de configuração não aparece     | Projeto, ramo e commit realmente publicados, não só arquivos locais alterados.                                         |
| Link de artigo apagado continua abrindo | Arquivos ou cache antigos; use substituição completa e confira o cache da hospedagem.                                  |
| GA4 sem dados                           | ID G- real, build de produção, endereço não local e bloqueadores.                                                      |

Para atualizar conteúdo, siga “editar e preparar localmente → verificar no preview → fazer commit das fontes → construir e publicar”. A atualização do tema está no [guia de instalação](/pt-br/blog/starter-guide-1-configure-your-site/) e as rotas no [guia de idiomas](/pt-br/blog/starter-guide-languages/).

## Navegação e referência de configuração

A primeira publicação termina aqui. Depois, volte ao guia correspondente à alteração desejada ou consulte a referência.

[Anterior: receber leitores de outros idiomas](/pt-br/blog/starter-guide-languages/) · [Índice dos oito guias](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [domínio e variáveis](/pt-br/blog/config-site-chrome/), [GA4 e complemento para IA](/pt-br/blog/config-analytics-ai/) e [recursos da busca](/pt-br/blog/config-search/). Consulte caminhos completos, valores padrão e limites no [índice da referência](/pt-br/blog/config-reference/).
