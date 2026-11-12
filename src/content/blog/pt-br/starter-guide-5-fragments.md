---
tags: ['anglefeint', 'starter']
title: 'Guia 5: Publicar fragmentos'
description: 'Publique pensamentos breves em Markdown, com comentários opcionais em uma janela.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
updatedDate: '2026-11-12'
---

## Conteúdo legível por IA

O build inclui artigos públicos, Fragments e About habilitados em `/llms.txt`, índices e textos completos por idioma. As URLs Markdown dos artigos não mudam. Cada idioma tem `/pt-br/fragments/index.md` e `/pt-br/about/index.md` (substitua o idioma). Fragments reúne todas as páginas públicas, preservando ID, data, corpo e links estáveis `/<locale>/fragments/#ID`. O HTML anuncia o Markdown. Disponível após `npm run build` e no preview; publique todo `dist/`.

About exporta a biografia pública, contatos e o painel de texto AI acessível; exclui configurações do terminal, ferramentas e decoração. Não exporta comentários. Páginas/idiomas desativados, conteúdo removido, noindex e canonical externos são excluídos; reconstruir limpa arquivos gerados e links obsoletos. Arquivos do usuário são protegidos e conflitos interrompem o build. Suplementos do site/idioma valem para todos os documentos. JSON-LD inclui o idioma; About usa AboutPage. Sem nova configuração, servidor ou biblioteca UI, nem garantia de indexação ou citação por IA.

A partir de 0.33.2, Fragments compartilha o botão de voltar ao topo dos artigos: aparece após a rolagem e respeita a preferência por movimento reduzido. Não exige configuração.

Se já tem um blog, atualize primeiro para o tema 0.29.0 ou posterior:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Adicione ao theme existente em `src/site.config.ts`. Fragmentos e comentários ficam desativados por padrão. O menu aparece abaixo de Decoder Lab.

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

Após ativar, acesse `/<locale>/fragments/`. `pageSize` aceita inteiros de 1 a 100. Os arquivos usam `.md`; não há filtro de rascunhos ou datas futuras. Guarde os fragmentos ainda não publicados fora de `src/content/fragments/`.

Crie esqueletos do mesmo fragmento em todos os idiomas habilitados:

A geração padrão para todos os idiomas habilitados exige o tema 0.31.0 ou mais recente. Atualize primeiro; nas versões 0.29–0.30, informe `--locales` explicitamente.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Como `new-post`, por padrão cria esqueletos para todos os idiomas habilitados no projeto, com o mesmo ID e data e hora; não traduz o conteúdo. Prioridade: `--locales` → `ANGLEFEINT_LOCALES` → idiomas habilitados. Listas explícitas removem espaços e duplicatas e são convertidas para minúsculas; ignoram a leitura da configuração e criam apenas os diretórios solicitados, sem habilitar idiomas na configuração.

Novos starters também oferecem `npm run new-fragment`; projetos existentes podem usar npx sem adicionar scripts.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales pt-br
```

Edite o Markdown gerado em `src/content/fragments/<locale>/`. O título é opcional:

Para adicionar uma tradução depois, copie o Markdown original para a pasta do idioma, mantenha id e traduza o texto.

```md
---
id: 'q8Lm3XzP'
pubDate: 2026-11-11T08:30:00+08:00
---

Fragmentos.
```

Mantenha id ao editar ou renomear. Apenas traduções do mesmo fragmento compartilham ID. IDs duplicados no mesmo idioma impedem a compilação. pubDate inclui horário e fuso; exibição em UTC e ordem do mais recente.

Ative `theme.fragments.comments.enabled` e preencha repo, repoId, category e categoryId em `theme.comments` com os valores do Giscus. Consulte o Guia 4. Comentários dos artigos podem continuar desativados. [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

Usa specific, correspondência estrita e `fragment/<id>`. Ignora mapping, term, number, shareAcrossLocales e lang dos artigos; a interface segue o idioma da página. Traduções com o mesmo ID compartilham comentários e reações. Discussões de artigos não mudam. O cliente de comentários carrega no primeiro clique. Fechar oculta a janela; ao reabrir ou trocar de fragmento, a mesma instância de comentários é reutilizada.

Fragments continua separado da busca de artigos e RSS, mas gera seu próprio Markdown para IA durante o build. Imagens em `public/images/` podem ser usadas como `/images/...`.

Atualize para o tema 0.29.0 ou posterior e ative a configuração. Conteúdo, configuração, músicas e imagens pessoais são preservados. Guias pessoais não são substituídos; consulte o demo atual. Discussões do GitHub não são mescladas nem excluídas.

Os comentários carregam remotamente. O aviso permanece até o Giscus estar pronto; em caso de falha ou após 15 segundos aparece Tentar novamente. Verifique a rede ou a configuração. A janela reutiliza a integração Giscus dos artigos; não é necessário instalar outro pacote npm do Giscus e as associações existentes não mudam.

```bash
npm run build
```

Paginação a partir da versão 0.32.0: os fragmentos compartilham com o Blog os números de página, os estilos de neon e o salto de página exibido conforme o limite configurado. `theme.pagination` controla as duas listas; `theme.fragments.pageSize` continua definindo separadamente os fragmentos por página.

## Links estáveis para compartilhar (0.32.0+)

Compartilhamento a partir da versão 0.32.0: a data aponta para o fragmento na lista, com um controle de cópia ao lado. Compartilhe `/pt-br/fragments/#ID`, usando o id do frontmatter Markdown. Somente quando o fragmento não está na página atual é carregado um pequeno índice estático por idioma para localizar sua página. Reconstrua após adicionar conteúdo ou alterar datas ou pageSize, mantendo os IDs. A localização entre páginas e a cópia exigem JavaScript.

O endereço de navegação pode incluir um número de página; compartilhe pelo link da data ou pelo controle de cópia. Páginas antigas ainda existentes corrigem âncoras desatualizadas; um número de página removido continua mostrando o 404 normal do site. O recurso não intercepta páginas 404.

Fragmentos ausentes ou falhas de rede mostram uma mensagem, sem saltos repetidos. Se a área de transferência estiver bloqueada, um link selecionável permite copiar manualmente. O recurso exige o tema 0.32.0 ou posterior; atualize antes de usar a localização automática.

## Imagem padrão e IDs curtos de Fragment (0.33.0+)

Adicione site.ogImage ao objeto site existente em src/site.config.ts. Use um caminho a partir de public (/images/share.jpg corresponde a public/images/share.jpg) ou uma URL HTTPS. Em branco, utiliza a imagem Anglefeint incluída de 1200×630. Fragments e todos os links #ID compartilham essa imagem. As imagens específicas e geradas dos artigos mantêm prioridade; com a geração desativada, a capa do artigo também precede a imagem do site. Reconstrua e publique após alterar; plataformas podem manter a prévia em cache.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment gera um Nano ID de oito letras e dígitos, diferencia maiúsculas e minúsculas, verifica IDs Markdown de todos os idiomas e repete em caso de colisão. Cada execução compartilha ID e data entre idiomas. São aceitos apenas IDs alfanuméricos com exatamente oito caracteres. UUIDs e IDs longos antigos não são suportados: exclua e publique novamente, sem migração ou compatibilidade com links antigos. Preserve o novo ID publicado; alterá-lo cria outra associação de comentários.
