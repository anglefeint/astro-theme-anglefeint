---
tags:
  - anglefeint
  - starter
title: 'Guia 1: Configure seu blog'
subtitle: 'Instalação, identidade, idiomas e publicação.'
description: 'Instalação, identidade, idiomas e publicação.'
pubDate: '2026-03-07'
updatedDate: '2026-11-10'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
---

## Instalar e abrir localmente

Use Node.js 22.12.0 ou superior. Execute no diretório pai: o comando cria my-blog sem instalar dependências. Depois instale e inicie. Se mudar o nome, ajuste o comando de criação e cd juntos.

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Abra o endereço indicado no terminal. Para pnpm, use o mesmo comando de criação e depois pnpm install e pnpm dev em vez dos comandos npm de instalação e início.

## Identidade e endereço inicial

Edite o objeto em src/site.config.ts, mantendo imports e exports. Substitua domínio, nome, autor e textos pelos seus. Mescle o exemplo com suas configurações existentes.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { title: 'My Blog', author: 'Your Name', url: 'https://your-domain.example' },
  i18n: {
    defaultLocale: 'pt-br',
    routing: { defaultLocalePrefix: 'never' },
    locales: {
      'pt-br': {
        site: { hero: 'My Blog' },
        messages: { siteDescription: 'My Blog' },
      },
    },
  },
});
```

site.url define o domínio usado por canonical, RSS, sitemap e imagens sociais. PUBLIC_SITE_URL no ambiente de compilação ou no arquivo .env tem prioridade. Reinicie o desenvolvimento ou reconstrua após alterá-lo. O texto visível da página inicial vem de site.hero do idioma; messages.siteDescription define sua descrição. Alterar apenas site.description não substitui esses textos.

No starter integrado 0.27+, o pacote do tema lê `PUBLIC_SITE_URL` do `.env` na raiz ou do ambiente de build e o prioriza sobre `site.url` para canonical, RSS, sitemap e imagens sociais. Reinicie o desenvolvimento ou reconstrua após mudanças. Mantenha a integração em `astro.config.mjs`; não é necessário manter um resolvedor local de URL nem adapters copiados. Estruturas anteriores a 0.27 precisam da migração inicial do guia de atualização.

Com defaultLocalePrefix: 'never', a página inicial do idioma padrão aparece diretamente em /. O padrão 'always' redireciona / para `/<idioma>/` e pode exibir “Redirecting to home…”. Artigos continuam em /pt-br/blog/ mesmo com 'never'.

Configure `social.links` com `href`, `label` e um `icon`: `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`. Para uma imagem própria, coloque um SVG/PNG/WebP local em `public/icons/` e defina `iconSrc: "/icons/community.svg"`; ele substitui `icon` e mantém as cores originais. Omita ambos para exibir texto. Veja regras de caminhos e exemplos no [README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.pt-BR.md). Uma lista vazia mantém ícones ilustrativos sem links. site.tagline adiciona texto ao rodapé.

O rodapé separa copyright, créditos do tema/Astro e o texto opcional `site.tagline`, com ícones sociais abaixo. Os créditos seguem o idioma da página; seu texto permanece igual em todos os idiomas. Texto vazio não ocupa espaço e textos longos quebram linha no celular. A configuração existente e `PUBLIC_SITE_TAGLINE` continuam funcionando; nenhuma migração é necessária.

## Escolher idiomas

Nove idiomas estão ativos: en, ja, ko, es, zh, pt-br, de, ru e zh-hant. Inglês é o padrão inicial. Para desativar idiomas, mescle entradas como estas:

```ts
i18n: {
  locales: {
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
  },
},
```

Omitir um idioma não o desativa: a configuração é mesclada com os padrões. O idioma padrão permanece ativo. Para um blog em apenas um idioma, desative explicitamente os outros oito. Isso não apaga arquivos nem traduz textos.

## Substituir exemplos e escrever

Cada idioma do starter tem uma página de boas-vindas e três guias. Faça backup e remova os exemplos que não quiser; preserve imagens ainda utilizadas.

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

O comando cria um arquivo por idioma ativo — nove inicialmente. Ele não traduz o conteúdo e não sobrescreve arquivos existentes. Edite título, descrição e corpo em src/content/blog/pt-br/my-first-post.md.

## Verificar e publicar

```bash
npm run doctor
npm run preview
```

doctor inclui verificações e compilação. preview exibe o resultado localmente; não publica na internet. O site estático fica em dist/, com busca e imagens sociais. No provedor, use npm run build e dist como saída. Siga o [guia de implantação do Astro](https://docs.astro.build/en/guides/deploy/) e confira páginas, idiomas, busca e /pt-br/rss.xml após publicar.

Cloudflare é opcional. Veja as [instruções por plataforma no README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.pt-BR.md#deployment), incluindo a limitação atual de publicar na raiz do domínio.

## Regras de configuração

- [Guia 1: Configure seu blog](/pt-br/blog/starter-guide-1-configure-your-site/)
- [Guia 2: Escreva e organize conteúdo](/pt-br/blog/starter-guide-2-languages-and-routing/)
- [Guia 3: Recursos opcionais](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)

---

## Atualizar o tema

O pacote mantém páginas padrão, valores padrão, traduções e funções de build. Artigos, `src/site.config.ts`, músicas, imagens e páginas próprias ficam no projeto.

No novo starter de integração com npm, execute na raiz o comando abaixo. Ele verifica compatibilidade, faz backup dos arquivos de dependências, instala uma versão exata e executa doctor. Em caso de falha, restaura os arquivos e tenta reinstalar as dependências anteriores. Publique pelo fluxo habitual; não há deploy automático.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Projetos anteriores a 0.27 precisam migrar uma vez para um starter novo. Crie-o em outra pasta, copie artigos e recursos e combine os valores pessoais no novo site config. Não copie rotas padrão antigas, adapters ou helpers defaults/schema/runtime. Preserve slugs, caminhos de idiomas, URLs de músicas/imagens e configurações de hospedagem.

O atualizador automático suporta apenas npm e rejeita lockfiles pnpm/yarn/bun. `--check` verifica sem escrever; `--to 0.27.1` escolhe a versão. Veja o [guia](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) e [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

Se a atualização falhar, não publique `dist/`: restaurar dependências não restaura o build anterior. Resolva o erro e execute `npm run doctor` com sucesso antes do deploy. Com pnpm, confira a compatibilidade e atualize manualmente com `pnpm add @anglefeint/astro-theme@latest` e `pnpm run doctor`, mantendo seu lockfile.

## Imagem padrão e IDs curtos de Fragment (0.33.0+)

Adicione site.ogImage ao objeto site existente em src/site.config.ts. Use um caminho a partir de public (/images/share.jpg corresponde a public/images/share.jpg) ou uma URL HTTPS. Em branco, utiliza a imagem Anglefeint incluída de 1200×630. Fragments e todos os links #fragment-ID compartilham essa imagem. As imagens específicas e geradas dos artigos mantêm prioridade; com a geração desativada, a capa do artigo também precede a imagem do site. Reconstrua e publique após alterar; plataformas podem manter a prévia em cache.

```ts
site: {
  ogImage: '/images/share.jpg';
}
```
