---
tags: ['anglefeint', 'starter']
title: '利用ガイド 1：ブログを立ち上げる'
subtitle: 'インストールからサイト情報と言語の設定、サンプル記事の置き換え、ビルドと公開まで。'
description: 'インストールからサイト情報と言語の設定、サンプル記事の置き換え、ビルドと公開まで。'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## まずは最小限の設定から

このガイドは対応する 0.8.0 starter を対象とし、サイトの準備、記事の執筆、任意機能の順で説明します。最初からすべての設定を理解する必要はありません。サイト情報と内容を自分のものに置き換え、ほかは既定値のままで始められます。このガイド自体も通常のブログ記事なので、目次やコードコピー、検索を試せます。

## 1. インストールしてローカルで開く

Node.js 22.12.0 以降を用意して実行します。

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

ウィザードで作成先を指定します。たとえば `my-blog` です。実際に作成したディレクトリに移動するよう、次の 1 行目を調整してください。依存関係をウィザードでインストール済みなら `npm install` は省略できます。

```bash
cd my-blog
npm install
npm run dev
```

ターミナルに表示されるローカル URL を開きます。ポートが使用中なら番号が変わる場合があります。pnpm を使う場合も作成には上の npm コマンドを使い、ウィザードの依存関係インストールをスキップしてから `pnpm install`、`pnpm dev` を実行できます。

## 2. サイト名・トップページの紹介・リンクを変更する

`src/site.config.ts` を開きます。import と export は残し、`defineThemeConfig({...})` 内のオブジェクトを編集します。以下は設定宣言全体の例です。ドメイン、名前、文章、リンクを自分のものに置き換えてください。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
  },
  i18n: {
    defaultLocale: 'ja',
    locales: {
      ja: {
        site: { hero: 'Welcome to my blog.' },
        messages: { siteDescription: 'My notes and projects.' },
      },
    },
  },
  social: {
    links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
  },
});
```

`site.title` はサイト名です。`site.url` には公開先の完全な URL を指定します。canonical、RSS、sitemap、共有画像の URL に影響します。`site.author` は記事の既定の著者、`site.tagline` はフッターの文言です。

トップページの大きな見出しの下に出る紹介文は、その言語の `site.hero` で設定します。`site.description` はサイトの既定の説明ですが、トップページのメタ説明では言語別の `messages.siteDescription` が優先されます。`site.description` だけを変えても、画面の紹介文は変わりません。

ソーシャルアイコンは `github`、`twitter`、`mastodon` に対応します。`social: { links: [] }` でリンクを空にできます。空の場合もヘッダーとフッターに Mastodon、Twitter、GitHub のクリックできないプレースホルダーアイコンが表示されます。項目を設定すると、設定した項目だけが表示されます。`.env` の `PUBLIC_SITE_TITLE`、`PUBLIC_SITE_URL` などの上書き値は設定ファイルより優先されます。変更が反映されない場合はこちらも確認してください。

プロジェクト直下の `.env` またはホスティング先のビルド環境で `PUBLIC_SITE_URL=https://your-domain.example` を設定すると、`site.url` を上書きできます。変更後は開発サーバーを再起動するか再ビルドし、canonical、RSS、サイトマップ、共有画像の絶対 URL がそのドメインを使うか確認してください。対応する starter の `astro.config.mjs` と URL 解決スクリプトが必要です。npm テーマパッケージの更新だけではこれらのファイルは更新されません。

## 3. 使用する言語だけを残す

既定では `en`、`ja`、`ko`、`es`、`zh` が有効です。最初の例は既定言語を `ja` にするだけで、ほかの言語は無効になりません。日本語だけにするなら、紹介文の設定を残しつつ、既存の `i18n` に以下を統合します。

```ts
i18n: {
  defaultLocale: 'ja',
  locales: {
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: true } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    zh: { meta: { enabled: false } },
  },
},
```

設定は既定値と深くマージされます。言語を省略しても削除にはならず、`meta.enabled: false` の明示が必要です。既定言語は常に有効です。言語設定はメニューとルートを制御しますが、記事の翻訳やファイルの削除は行いません。`/ja/` で言語メニューを確認してください。

## 4. サンプルを置き換えて最初の記事を書く

記事は `src/content/blog/<言語コード>/` にあります。各既定言語の `welcome-to-anglefeint.md` と 3 つの `starter-guide-*.md` は、このガイドを含むサンプル記事です。バックアップ後、不要なサンプル Markdown を削除しても、手元の資料として残しても構いません。設定ディレクトリや、残す記事が参照する画像は削除しないでください。

```bash
npm run new-post -- my-first-post
```

現在有効な言語ごとに同名の記事ファイルを作成します。本文の自動翻訳はしません。生成された `src/content/blog/ja/my-first-post.md` のタイトル、説明、本文を書き換え、`/ja/blog/my-first-post/` を開きます。記事の項目、画像、タグはガイド 2 で説明します。

## 5. チェック・ビルド・公開

開発中は `npm run dev` を使います。公開前にプロジェクトディレクトリで次を実行します。

```bash
npm run check
npm run build
npm run preview
```

`check` は設定・アダプター、Astro ファイル、ビルド後の About 設定を検査します。`build` は検索インデックスと既定の自動共有画像を含む静的ファイルを `dist/` に出力します。`preview` はその成果物をローカルで確認するもので、インターネットへ公開するコマンドではありません。終了は Ctrl+C です。

静的ホスティングのビルドコマンドを `npm run build`、出力ディレクトリを `dist` に設定し、先に `site.url` を実際のドメインに変更します。リポジトリ接続やドメイン、公開手順は [Astro のデプロイガイド](https://docs.astro.build/en/guides/deploy/) の各サービスの説明を参照してください。公開後はトップページ、記事、言語切り替え、検索、`/<言語コード>/rss.xml` を確認します。記事や設定の変更後は再ビルドと再デプロイが必要です。

## 6. 設定の 3 つの基本

編集するのは `src/site.config.ts` の設定オブジェクトです。`src/config/*` などの生成されるアダプターに例を貼り付けないでください。

同じオブジェクトに `theme` と `i18n` はそれぞれ 1 つだけ置きます。機能ごとの例は既存のオブジェクトに統合し、同じキーを追加しないでください。省略した項目は既定値を使い、曲やソーシャルリンクなどの配列は全体が置き換わります。

古いプロジェクトで npm パッケージを更新しても、ローカルの starter ファイルは自動更新されません。設定や機能が見当たらなければ [アップグレードガイド](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) を確認し、エラーを消すために設定の補助ファイルを削除しないでください。

## このガイドの構成

- [利用ガイド 1：ブログを立ち上げる](/ja/blog/starter-guide-1-configure-your-site/)
- [利用ガイド 2：記事を書く・コンテンツを整理する](/ja/blog/starter-guide-2-languages-and-routing/)
- [利用ガイド 3：必要な機能を有効化・カスタマイズする](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)
