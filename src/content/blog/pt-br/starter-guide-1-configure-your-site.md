---
tags:
  - anglefeint
  - starter
title: 'Guia 1: Configure seu blog'
subtitle: 'Instalação, identidade, idiomas e publicação.'
description: 'Instalação, identidade, idiomas e publicação.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
---

## Instalar e abrir localmente

Use Node.js 22.12.0 ou superior. No assistente, escolha uma pasta como my-blog; ajuste o comando cd à pasta criada. Se o assistente já instalou as dependências, pule npm install.

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
cd my-blog
npm install
npm run dev
```

Abra o endereço indicado no terminal. Para pnpm, crie o projeto com o mesmo comando npm, pule a instalação no assistente e execute pnpm install e pnpm dev.

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

Com defaultLocalePrefix: 'never', a página inicial do idioma padrão aparece diretamente em /. O padrão 'always' redireciona / para `/<idioma>/` e pode exibir “Redirecting to home…”. Artigos continuam em /pt-br/blog/ mesmo com 'never'.

Configure social.links com href, label e icon (github, twitter ou mastodon). Uma lista vazia mantém ícones ilustrativos sem links. site.tagline adiciona texto ao rodapé.

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

## Regras de configuração

Mantenha um único objeto theme e um único i18n. Mescle opções; listas substituem listas anteriores. Não edite os adaptadores gerados em src/config/. Atualizar o pacote npm não atualiza arquivos locais do starter. Consulte o [guia de atualização](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) antes de migrar.

- [Guia 1: Configure seu blog](/pt-br/blog/starter-guide-1-configure-your-site/)
- [Guia 2: Escreva e organize conteúdo](/pt-br/blog/starter-guide-2-languages-and-routing/)
- [Guia 3: Recursos opcionais](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)
