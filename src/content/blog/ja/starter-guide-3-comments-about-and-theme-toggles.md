---
tags: ['anglefeint', 'starter']
title: '利用ガイド 3：必要な機能を有効化・カスタマイズする'
subtitle: '音楽、コメント、About、ページ分割、機能スイッチ、多言語を必要に応じて設定します。'
description: '音楽、コメント、About、ページ分割、機能スイッチ、多言語を必要に応じて設定します。'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

## 既定の状態を見て必要なものだけ変更する

対応する 0.8.0 starter 向けの説明です。TypeScript の例はすべて `src/site.config.ts` の `defineThemeConfig({...})` に統合します。変更したい項目だけを設定してください。

| 機能                                         | 既定の状態     |
| -------------------------------------------- | -------------- |
| 検索・記事目次・タグ・自動共有画像           | 有効           |
| 本文画像プレビュー・コードコピー             | 自動、設定不要 |
| About・記事の Red Queen モニター             | 有効           |
| 音楽・Giscus コメント                        | 無効           |
| トップの最新記事数 / ブログ 1 ページの記事数 | 3 / 9          |

## 1. 音楽プレーヤーを有効にする

音源を `public/music/my-song.mp3` に置きます。必要ならディレクトリを作成し、設定を追加します。

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      { title: 'My Song', artist: 'Artist Name', src: '/music/my-song.mp3' },
    ],
  },
},
```

URL に `public` は含めません。各曲の `title` と `src` は必須、`artist` は任意です。曲を増やすには `tracks` 配列にオブジェクトを追加します。HTTPS の音声直リンクも使えますが、ローカルのディスクパスや音楽サービスの共有ページは使えません。空白・バックスラッシュを避け、簡単なファイル名を推奨します。曲は同梱していません。

空の曲リストでは表示されません。有効時にタイトルや URL の形式が不正なら設定エラーになります。共通テーマレイアウトを使うページに表示され、ページ単位のスイッチはありません。デスクトップでは左下、モバイルでは各ページで折りたたまれた状態から始まり、展開中はトップへ戻るボタンを一時的に隠します。

まず `/music/my-song.mp3` を直接開いて音源にアクセスできるか確認し、ページで PLAY を押します。再生操作をして初めて音声を読み込み、ページを開いただけでは再生しません。再生開始後は曲の終了時に次の曲へ自動で進み、最後の曲の後は最初の曲に戻ります。同じタブのセッション内で曲・位置・音量を保存します。ページ移動で停止し、次のページでは再生を押して再開します。ページをまたぐ連続再生ではありません。ストレージが使えなくても再生できますが、状態の記憶は保証されません。`enabled: false` で無効にできます。

## 2. Giscus コメントを有効にする

[Giscus 設定ページ](https://giscus.app/) に従い、公開 GitHub リポジトリ、Discussions、Giscus アプリ、分類を準備します。生成された設定から実際の repository/category ID を取得します。

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

2 つの `REPLACE_WITH_...` と、実際の分類名に置き換えてください。テーマ設定だけを入力し、記事ごとに Giscus の script 全体を貼る必要はありません。

コメントは記事ページに表示されます。主要な repo/category の 4 項目が欠けると表示されず、仮の値を入れても動作しません。`lang: ''` は記事の言語に追従します（`zh` は `zh-CN`）。既定値は固定の `en` です。

通常は `mapping: 'pathname'` のまま、記事のパスで議論を紐付けます。`specific` なら空でない `term`、`number` なら正の整数を文字列として `number` に指定します。この 2 モードで値が不正・不足しているとエラーになります。

記事末尾で確認し、表示されなければ ID、リポジトリ権限、ネットワーク、ブラウザーのブロックを調べます。`inputPosition`、`theme`、`reactionsEnabled` などは既定値で構いません。`strict` と `reactionsEnabled` は文字列の `'0'` / `'1'` です。

## 3. About の内容を置き換える

About は既定で有効です。テンプレートを直接編集せず、言語ごとに本文を設定できます。

```ts
i18n: {
  locales: {
    ja: {
      about: {
        metaLine: '$ profile booted | mode: builder',
        sections: {
          who: 'Introduce yourself here.',
          what: 'Describe what you build.',
          ethos: ['Keep learning.', 'Build useful things.'],
          now: 'What you are working on now.',
          contactLead: 'Get in touch.',
          signature: '> Your signature',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

この例は日本語の About だけを変更します。ほかの言語は別途記入し、自動翻訳はされません。`sidebar`、`labels`、`modals`、`effects` も上書きできますが、まず本文と連絡先から始めてください。About のツールウィンドウはテーマの対話的なデモで、文言を入力しても実際の AI サービスには接続しません。

`/ja/about/` で本文とメール・GitHub リンクを確認します。不要なら `theme.enableAboutPage: false` にするとナビゲーションが消え、About ルートも生成されません。変更後は再ビルドします。

## 4. 記事数とページ分割を調整する

件数の 2 項目だけでも設定できます。ページ分割の外観を固定したい場合に `pagination` を加えます。

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 9,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` はトップの最新記事数、`blogPageSize` はブログ 1 ページの記事数で、タグの記事一覧にも使われます。適切な正の整数を指定してください。

`windowSize` はページ番号の表示範囲で、コードでは 5～21 に制限されます。記事数ではありません。ジャンプ入力欄は `jump.enabled` が真で、総ページ数が `showJumpThreshold` を超える場合のみ表示されます。既定では 12 ページ超です。`enterToGo` は Enter での移動を制御します。

スタイルは `fixed`、`sequential`、`random` があります。例では 1 番に固定します。既定の `random` は言語・パス・ページ情報などから安定した値を選び、再読み込みのたびに変わるものではありません。`style.enabled: false` は基本の外観を使うだけで、ページ分割を無効にはしません。記事が増えたら一覧下部で確認してください。

## 5. 不要な拡張機能を無効にする

以下は無効化できる項目の例で、すべて無効にする推奨ではありません。変更したい項目だけを使います。

```ts
theme: {
  enableAboutPage: false,
  effects: { enableRedQueen: false },
  search: { enabled: false },
  toc: { enabled: false },
  tags: { enabled: false },
  socialImage: { enabled: false },
},
```

`enableRedQueen` は記事の Red Queen モニターだけを制御し、AI テーマ全体や全エフェクトを無効にしません。`toc` はサイトの既定値で、記事の `toc: true` が優先されます。`socialImage` を無効にしても手動の `ogImage` は有効です。検索とタグは入口と生成物の両方に影響します。4 種の雰囲気は既存レイアウトが決めており、サイト全体を 4 テーマ間で切り替える設定はありません。

## 6. 言語を追加しトップページの URL を調整する

フランス語を追加する例です。

```ts
i18n: {
  locales: {
    fr: {
      meta: { label: 'Français', hreflang: 'fr', ogLocale: 'fr_FR', enabled: true, fallback: ['en'] },
      site: { hero: 'Bienvenue sur mon blog.' },
      messages: { nav: { home: 'Accueil' }, siteDescription: 'Mes notes et projets.' },
    },
  },
},
```

`npm run new-post -- french-note --locales fr` で記事を作成します。UI 文言、トップの紹介、About、記事の翻訳は自分で用意します。`fallback` は不足する設定・文言を補い、記事の翻訳や別言語の記事の一覧への挿入はしません。必要に応じて既定言語がフォールバックチェーンに加わります。

メニュー名は `meta.label` で変えます。たとえば `zh` の既定表示は「简体中文」です。`hreflang` / `ogLocale` は言語メタ情報で、表示名の変更は言語コードや URL を変えません。

既定の `i18n.routing.defaultLocalePrefix: 'always'` は `/` から既定言語のトップへ転送します。`'never'` は `/` を既定言語のトップとし、`/<既定言語>/` から `/` へ転送します。対象は既定言語のトップのみで、`/ja/blog/` が `/blog/` になるわけではありません。

## 7. 設定を統合して動作確認する

たとえば記事数と音楽を同時に変更する場合、1 つの `theme` にまとめます。

```ts
theme: {
  homeLatestCount: 5,
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

既存の `theme.comments` なども同じオブジェクトに残します。例で自分の設定全体を上書きしないでください。配列は全体を置き換えるので、曲やリンクを追加するときは以前の項目も残します。

開発画面で機能を確認後、`npm run check` と `npm run build` を実行します。検索はビルド後の `npm run preview` で確認します。プロジェクトや更新の問題を診断するときだけ、より広い検査を含む `npm run doctor` を使います。公開には新しい成果物の再デプロイが必要です。

## 8. フッターのクレジットを表示・非表示にする

フッターにはビルド時の年と `site.title` が表示されます。既定ではテーマと Astro へのリンクも表示されます：`© 2026 My Blog · Theme by Anglefeint · Built with Astro`。年はビルド時に生成され、固定値ではありません。

両方の技術クレジットを非表示にするには、次の設定を `src/site.config.ts` に統合します：

```ts
export const THEME_CONFIG = defineThemeConfig({
  theme: {
    footer: { showCredits: false },
  },
});
```

`showCredits: true` で再表示できます。非表示にすると両方のリンクが削除され、著作権表示は残ります。任意の `site.tagline` は、このスイッチとは独立したプレーンテキストです。既定値は空です。旧既定値の `Built with Astro.` は重複を避けるため組み込みクレジットとして扱います。`All rights reserved` は追加しません。

公開デモは専用のサイト名、ドメイン、翻訳済みの紹介文を使います。新しい starter は汎用の既定値を使い、ユーザーは引き続き `src/site.config.ts` だけで設定できます。古い starter の更新では、アップグレードガイドに従って対応する設定ファイルも移行してください。npm パッケージだけの更新では、古いアダプターにこの設定は追加されません。

## このガイドの構成

- [利用ガイド 1：ブログを立ち上げる](/ja/blog/starter-guide-1-configure-your-site/)
- [利用ガイド 2：記事を書く・コンテンツを整理する](/ja/blog/starter-guide-2-languages-and-routing/)
- [利用ガイド 3：必要な機能を有効化・カスタマイズする](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)
