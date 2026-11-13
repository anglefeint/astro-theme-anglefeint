---
tags: ['anglefeint', 'starter']
title: 'ユーザーガイド7：より多くの言語の読者に届ける'
subtitle: '言語とホーム URL を選び、ローカライズした文面と記事・Fragments の翻訳を追加します。'
description: '言語の有効・無効、既定言語、ホームのルート、フォールバック、新言語、記事と Fragments の翻訳の対応を実際の設定で説明します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

入門ガイドの第7 / 8回です。[全ガイドの順序](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order) · [設定リファレンス](/ja/blog/config-reference/)。

最初は1言語で書き、後で翻訳を追加できます。テーマは多言語の UI とルートを提供しますが、記事を自動翻訳しません。言語の有効化、UI の変更、訳文の投稿は別の操作です。

すべての設定は `src/site.config.ts` の既存 `defineThemeConfig({...})` に統合し、既存の `i18n` と個人設定を残して同名オブジェクトを重複させないでください。

## 1. 使う言語を決める

既定では次の9言語が有効で、既定言語は `en` です。

| コード    | 言語               |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

簡体中国語と英語だけを残し、既定言語を簡体中国語に変更したい場合は次を選べます。不要ならプロジェクトの既定値をそのまま使ってください。

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

設定は既定値に統合するため、言語の省略は無効化ではありません。`meta.enabled: false` を明示します。既定言語は常に有効なので、`defaultLocale: 'zh'` にしながら zh の無効化で隠すことはできません。

無効化すると言語入口と標準ページの生成を止めますが、記事ファイルは削除しません。再有効化すれば残した内容を再生成できます。コードの変更は表示名だけでなくディレクトリと URL の変更になり、旧リンクは自分で処理する必要があります。

## 2. 既定言語のホーム URL を選ぶ

既存の `i18n` に `routing` を追加・編集します。

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

既定言語を zh にした例です。

| 設定                     | `/`                        | `/zh/`           | `/en/`                 |
| ------------------------ | -------------------------- | ---------------- | ---------------------- |
| `'always'`（テーマ既定） | `/zh/` への静的転送        | 簡体中国語ホーム | 英語ホーム（要有効化） |
| `'never'`                | 簡体中国語ホームを直接表示 | `/` への静的転送 | 英語ホーム（要有効化） |

既定言語は設定で決まり、訪問者のブラウザー言語で自動変更しません。転送はビルド済み HTML によるものでアプリサーバーは不要ですが、短い転送案内が見える場合があります。

**変更するのは既定言語のホームだけです。** ブログ、記事、About、Decoder、Fragments は `/zh/` などの接頭辞を維持し、`/zh/blog/my-first-post/` が自動的に `/blog/my-first-post/` にはなりません。既定言語を変えてもファイルの移動・翻訳は行いません。

## 3. 言語ごとのホームと UI を設定する

対応する言語に自分の文面を指定します。例：

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` は言語メニュー名です。「简体中文」を「中文」に変えてもコード zh や URL は変わりません。
- `site.homeTitle` はその言語のホームの表示見出しだけで、サイト名は最上位 `site.title` または環境変数で決まります。
- `site.hero` はホームの大見出し下の表示紹介文です。
- `messages.siteDescription` はホームのメタ説明で表示紹介文ではありません。最上位 `site.description` の変更だけでは内蔵説明を置換しない場合があります。
- `messages.nav` は対応する入口の文面を変え、ルートや記事内容を変えません。

同様に `i18n.locales.<コード>.about` はその言語の About、`messages` 内の各モジュールは UI 文面を変えます。About や Decoder は全体のスイッチにも従い、翻訳を記入しても自動有効化しません。例は[ページと機能のカスタマイズ](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)を参照してください。

言語メタ情報とホーム URL は[言語リファレンス](/ja/blog/config-languages/#registry)、ホームの3種類の文面は[ホームリファレンス](/ja/blog/config-home/#home-title)を参照してください。

## 4. 未指定項目の補完元を理解する

`meta.fallback` は設定の参照言語を選びます。簡体中国語に不足があれば英語を参照する例です。

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

en は言語設定に存在する必要があります。非既定言語の必要なチェーンには既定言語を追加し、自分自身、重複、存在しない言語は除外します。配列は全置換なので、複数の参照言語は希望順にまとめて指定してください。

補完方法は項目によって異なります。

| 内容                         | 現在の動作                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| 通常の `messages`            | 内蔵英語から始め、チェーンに沿って内蔵言語パックと個人上書きを統合し、現在言語を優先します。  |
| ホームの `homeTitle`         | 現在言語と参照言語の空白除去後の非空タイトルを順に探し、最後にサイト名を使います。            |
| ホームの `hero`              | 現在言語と参照言語の定義済み値を探します。`''` は意図した空値で、先へ進みません。             |
| About                        | 既定 About から始め、チェーンの各言語の個人 About 設定を統合します。                          |
| `messages.home.transmission` | 現在言語の個人設定 → 英語の個人設定 → `Knock, knock.`。通常文面の完全なチェーンは使いません。 |

英語ナビゲーションを変えても、内蔵の簡体中国語 UI が同じ設定に変わるとは限りません。特定言語を変えるにはその言語に上書きを指定します。ページの無効化は設定の削除ではなく、チェーンに残る設定は補完に参加できます。

補完は設定と UI だけです。英語の記事を中国語一覧に加えたり、別言語のファイルを生成したりしません。翻訳サービスではありません。

## 5. 新しい言語を加える

フランス語なら既存 locales に fr を加え、他言語の有効・無効設定を残します。

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr はディレクトリとルートのコードです。標準的な小文字を推奨します。作成コマンドは2–3英文字と任意のハイフン接尾辞1つに対応し、例は `fr`・`pt-br`・`zh-hant` です。パスや空白は使えません。例は既存の既定言語を維持し、フランス語を自動で既定にしません。

`hreflang` は言語代替リンクの識別子で、省略時は言語コードです。`ogLocale` は Open Graph の地域言語識別子で、パスと形式が異なり例では fr_FR です。これらは本文を翻訳せず、検索エンジン登録を保証しません。

新言語には完全な内蔵翻訳はありません。例は一部入口だけで、他文面はフォールバックします。完全なフランス語 UI には検索、ページ分割、コメント案内、ツール、About などを追加します。まず実際に表示する部分から始め、1記事の表示のためにテーマ実装を変更する必要はありません。

## 6. 記事の訳文を加える

簡体中国語と英語のひな形を同時に作成します。

```bash
npm run new-post -- my-first-post --locales zh,en
```

`src/content/blog/zh/my-first-post.md` に中国語、`src/content/blog/en/my-first-post.md` に英語を書きます。新言語の例は `npm run new-post -- french-note --locales fr` で、内容は自分で記入します。

既存記事はベース名を維持して対象言語へコピーし、タイトル・説明・本文を翻訳しても構いません。画像の相対パスは新しい位置から計算するため、階層を変えたら確認します。同名ファイルは作成コマンドがスキップし、旧原稿を上書きしません。

訳文の対応は言語ディレクトリを除いた完全な slug で決まります。zh/my-first-post と en/my-first-post は翻訳ですが、英語を my-story に改名すると別記事で、同タイトルでも対応しません。入れ子のディレクトリもそろえます。

記事の言語メニューでは同じ slug があれば訳文へ、なければ対象言語の一覧へ移動します。検索エンジン用の代替言語リンクは実在して有効な訳文のみを示し、一覧を別言語の記事と偽りません。

`--locales` はファイル選択だけで言語を有効にしません。省略時は `ANGLEFEINT_LOCALES`、なければ有効言語です。明示パラメーターは環境変数より優先します。ひな形作成と本文翻訳は別の手順です。

## 7. Fragments と他ページの言語切り替え

Fragment は frontmatter の同じ `id` で対応し、ファイル名ではありません。後で翻訳を追加するときは id・pubDate を残してコピーし、タイトル・本文を翻訳します。new-fragment を再実行すると別 ID になるため、同じ項目の訳文追加には使えません。

同じ `npm run new-fragment -- --locales zh,en` は2言語に同じ ID・日時のひな形を作ります。一覧の言語切り替えは対象言語の1ページ目で、同じ訳文への直接移動は保証しません。詳細は[Fragment ガイド](/ja/blog/starter-guide-5-fragments/)を参照してください。

記事コメントの共有は `theme.comments.shareAcrossLocales` を別途有効にし、既定は無効です。Fragments は同じ ID で共有します。UI 言語と議論対応は別で、コメントも自動翻訳しません。[コメントガイド](/ja/blog/starter-guide-4-giscus-comments/)を参照してください。

`new-page` は有効言語のルートを生成しますが、Astro のソースは1つです。言語ごとに内容を用意する必要があり、自動コピーや翻訳は行いません。

## 8. 変更後の確認

dev で有効言語のホームを開き、メニュー名、見出し、紹介文、About を確認します。訳文がある記事とない記事で切り替えを確認し、設定とディレクトリのコードを完全に一致させてください。

公開前に dev を止めて実行します。

```bash
npm run doctor
npm run preview
```

doctor は検証とビルドを含むため直後の check・build は不要です。preview で各言語の検索を確認します。索引は現在言語だけを検索し、全言語を混ぜません。有効言語の RSS は `/<コード>/rss.xml` で、その言語の記事だけを含みます。

サイト URL を確認し、`dist/` 全体を再配備します。言語の有効・無効、既定 URL、内容の変更は再ビルドが必要で、ローカル設定だけではオンラインは変わりません。再配備時は旧成果物の整理に注意し、言語無効化が旧 URL の自動リダイレクトを作るわけではありません。

| 症状                         | 最初に確認すること                                                           |
| ---------------------------- | ---------------------------------------------------------------------------- |
| 不要な言語がメニューに残る   | 上書きを削除しただけでなく、enabled: false を明示したか。                    |
| 既定言語が無効にならない     | defaultLocale のままではないか。先に別の既定言語を選ぶ。                     |
| ファイルはあるがページがない | 有効言語、ディレクトリコード、再ビルド。                                     |
| 英語が残る                   | 新言語の一部しか翻訳していないか、About 内容の不足。                         |
| 見出しが変わらない           | 全体 site.title、ホーム homeTitle、hero、messages のどれか。環境変数も確認。 |
| 切り替え先が一覧             | 同じ slug の訳文がない場合の現在のフォールバック動作。                       |
| never でも記事に言語接頭辞   | 変更は既定ホームだけなので想定どおり。                                       |

サイト情報と更新は[インストールガイド](/ja/blog/starter-guide-1-configure-your-site/)、日常の執筆は[最初の記事を書く](/ja/blog/starter-guide-2-languages-and-routing/)を参照してください。

## ガイドと設定リファレンス

[前の記事：読者がコメントできるようにする](/ja/blog/starter-guide-4-giscus-comments/) · [次の記事：自分のドメインで公開する](/ja/blog/starter-guide-deployment/) · [8本のガイドの総合案内](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order)。

関連項目：[言語・URL・フォールバック](/ja/blog/config-languages/)、[言語間コメント共有](/ja/blog/config-comments/)。完全なパス、既定値、制約は[設定リファレンス総合案内](/ja/blog/config-reference/)を参照してください。
