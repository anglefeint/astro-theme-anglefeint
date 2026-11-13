---
tags: ['anglefeint', 'config']
title: '設定リファレンス：言語の有効化、URL、UI 翻訳、フォールバック'
subtitle: '言語登録、既定言語、ページ URL、内容ごとの補完規則。'
description: 'i18n の型、既定値、スイッチ、ホーム接頭辞、翻訳、補完チェーン、内容・SEO の範囲を実装で説明します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

言語と訳文の追加手順は[多言語ガイド](/ja/blog/starter-guide-languages/)、設定ファイルは[インストール](/ja/blog/starter-guide-1-configure-your-site/)へ。他は[総合案内](/ja/blog/config-reference/)にあります。

ここは i18n の登録、URL、解決規則を扱います。各モジュールの文面を重複掲載せず、ホーム・記事・Fragments・About・Decoder・音楽・コメントは担当辞書で型や既定値を確認します。以下はデモでなくパッケージ既定です。

<a id="registry"></a>

## i18n.defaultLocale と i18n.locales

| 完全パス                | 型 / テーマ既定値                                    | 状態・役割・制約                                                                                                                  | 例                                                         |
| ----------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale      | string / 'en'                                        | 有効。根ホーム・転送先・必要補完・既定リンクを決めます。空は en へ。ブラウザーで自動選択せず、常に有効で false でも止まりません。 | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales            | Record<string, LocaleConfig> / 下表9言語             | キーがディレクトリと URL。再帰マージで省略では内蔵言語を削除しません。新言語は独自文面・記事が必要です。                          | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<locale>` | 部分 LocaleConfig / 内蔵は設定済み、新コードは未設定 | meta・site・messages・about・aiReadableContent を含む。省略はマージ・補完し、{} で既存言語は消えません。                          | locales: { zh: { meta: { enabled: false } } }              |

キーは表示名や hreflang とは別です。EN を en、zh-CN を zh へ自動変換しません。ディレクトリ・設定・生成コマンドは zh、en、pt-br、zh-hant などの小文字をそろえます。作成器は2–3英文字と任意1ハイフン区切りに対応します。実行時正規化は完全な言語・パス検証ではなく、任意記号やパスを入れないでください。

既定言語が未登録ならコードを label にした設定を補いますが、記事・翻訳の代わりにはなりません。defaultLocale 変更でも既存ファイルは移動しません。

### 内蔵言語の実既定値

上書きなしの実メタデータです。9言語有効、en の補完は空、他は en。順序は登録順で meta.label 順ではなく、独立の並替え項目もありません。

| コード    | meta.label         | meta.hreflang | meta.ogLocale | 有効 enabled | 有効 fallback |
| --------- | ------------------ | ------------- | ------------- | ------------ | ------------- |
| `en`      | English            | `en`          | `en_US`       | true         | `[]`          |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true         | `["en"]`      |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true         | `["en"]`      |
| `es`      | Español            | `es`          | `es_ES`       | true         | `["en"]`      |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true         | `["en"]`      |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true         | `["en"]`      |
| `de`      | Deutsch            | `de`          | `de_DE`       | true         | `["en"]`      |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true         | `["en"]`      |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true         | `["en"]`      |

<a id="meta"></a>

## `i18n.locales.<locale>.meta`：5つのメタ項目

以下は meta 内の相対パスです。内蔵の具体値は上表、新言語の未指定規則は下表です。部分設定が可能で、毎回全項目を書き直す必要はありません。

| 相対パス      | 型 / 新言語で省略時                              | 状態・役割・制約                                                                                                              | 例           |
| ------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label    | string / コード                                  | メニュー名。空ならコード、純空白は trim しません。ディレクトリ・URL は変えません。                                            | 'Français'   |
| meta.hreflang | 任意 string / コード                             | html lang、hreflang、一部構造化データ。パスキーは変えず、空はコードへ。形式検証なし。                                         | 'fr'         |
| meta.ogLocale | 任意 string / 未指定                             | Open Graph と alternate。未指定・空は非出力で地域を自動推定しません。空で内蔵値を消せます。                                   | 'fr_FR'      |
| meta.enabled  | 任意 boolean / true                              | 非既定は false のみ無効、既定は常に有効。標準ページとメニューを変え、ファイル・独自ページを削除せずアクセス権でもありません。 | false        |
| meta.fallback | 任意 string[] / 非既定は既定言語を補い、既定は空 | 直接チェーン。配列全置換、自己・重複・空・未登録を除き、非既定には必ず既定を追加。                                            | ['zh', 'en'] |

hreflang と ogLocale は別でキーの代わりには使いません。各地域の慣例への自動適合は保証しないため、内容に合う値を指定してください。

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix：既定ホーム URL

- **型 / 既定値：** 'always' | 'never' / 'always'。
- **状態と役割：** 有効ですが既定ホームの正規入口のみを変更し、全ページから接頭辞を消すわけではありません。空は公開型外で、実行時は always と扱いますが不正値に依存しないでください。
- **制約：** /blog/・/about/ などを自動生成せず、変更には再ビルド・配備が必要です。旧リンクやホストの転送規則は移行しません。
- **例：** i18n: { routing: { defaultLocalePrefix: 'never' } }。

defaultLocale が en の場合です。

| URL               | always                   | never                    |
| ----------------- | ------------------------ | ------------------------ |
| /                 | /en/ へ静的 HTML 転送    | 英語ホーム               |
| /en/              | 英語ホーム               | / へ静的 HTML 転送       |
| /en/blog/         | 英語一覧                 | 英語一覧                 |
| /en/blog/my-post/ | 英語記事                 | 英語記事                 |
| /en/about/        | 英語 About（要有効化）   | 英語 About（要有効化）   |
| /zh/              | 中国語ホーム（要有効化） | 中国語ホーム（要有効化） |

meta refresh、canonical、noindex 付き静的転送です。訪問地で言語を選ぶ処理でもサーバー301設定でもありません。内部パスは通常 `/<コード>/.../` を生成し、根ホームへの転送は各入口が処理します。

<a id="overrides"></a>

## site、messages、about：上書き場所

接頭辞は `i18n.locales.<locale>`。オブジェクトは再帰マージ、配列は全置換、undefined は上書きしません。空文字・false・空配列は保持し、意味は各項目次第です。

| 相対パス       | 型 / 既定値                                                      | 役割・制約・例                                                                                                        | 詳細                                           |
| -------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / 各言語の内蔵設定         | ホーム専用で最上位サイト情報は置換しません。例 site: { homeTitle: '私のブログ' }。                                    | [ホーム](/ja/blog/config-home/#site-fallbacks) |
| site.homeTitle | 任意 string / 未指定                                             | 現言語と直接参照言語の trim 後非空を順に探し、最後に SITE_TITLE。例 '私のブログ'。空でも補完は止めません。            | [大見出し](/ja/blog/config-home/#home-title)   |
| site.hero      | 任意 string / 各内蔵紹介、新言語は未指定                         | 最初の定義済み値、空は明示消去。なければ messages.home.hero。例 'プロジェクトと日々のことを記録します。'。            | [紹介](/ja/blog/config-home/#home-hero)        |
| messages       | DeepPartial<Messages> / 個人上書き通常未指定、実行時に内蔵を統合 | ボタン・状態・メタ説明。例 messages: { nav: { home: 'ホーム' } }。機能・訳文は増やしません。                          | [総合案内](/ja/blog/config-reference/)         |
| about          | DeepPartial<AboutConfig> / 各言語の内蔵設定                      | 基本 About からチェーンに沿って統合。例 about: { sections: { who: '私は開発者です。' } }。Markdown からは読みません。 | [About](/ja/blog/config-about/#about-content)  |

内蔵 site.hero の正確な既定値です。homeTitle は既定にありません。

| 言語      | site.hero 既定値                                                                           |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## 補完チェーンの正確な順序

fr の有効 meta.fallback が ['zh', 'en'] なら、fr → zh → en の直接列挙で探索、または逆順マージします。zh 自身の fallback は展開しません。ja も使うなら fr の配列へ直接入れます。

1. fallback 未指定や [] でも、非既定は既定言語を補います。既定言語は空にでき、他の登録済み言語も参照可能です。
2. 自己・重複・未登録を除外。判定は登録の有無で、有効でない言語も設定補完に使えます。
3. 非既定の列に既定がなければ末尾に追加し、すでにあれば元位置を維持します。
4. messages は内蔵英語から始め、有効チェーンの逆順で各内蔵パック→個人設定を統合します。現在言語の内蔵訳が参照言語の個人文面を上書きする場合があります。

en の nav.home を 'Start' にしても、内蔵 zh の「首页」は変わりません。変更は zh.messages.nav.home に指定します。内蔵パックのない新言語は参照言語で補えますが、その言語への完全翻訳にはなりません。

項目で補完アルゴリズムが異なります。

| 内容                       | 現在の動作                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------- |
| 通常 messages              | 内蔵英語 → 参照言語の内蔵・上書き → 現在言語の内蔵・上書き。                       |
| site.homeTitle             | 直接チェーンの非空 trim 値、最後にサイト名。                                       |
| site.hero                  | 定義済み値を直接探索し、空文字で停止。                                             |
| about                      | DEFAULT_ABOUT_CONFIG から直接チェーンを逆順マージ。                                |
| messages.home.transmission | 例外：現言語の個人値 → 英語個人値 → 内蔵 Knock, knock.。完全な通常補完は使わない。 |
| aiReadableContent          | 各言語から最上位補足へ項目別に上書きし、meta.fallback を使わない。次節参照。       |
| 記事・Fragment 本文        | 文面補完を使わず、その言語の内容だけを読む。                                       |

補完は英語記事を中国語一覧に混ぜたり、訳ファイル・他言語検索で件数を補ったり、異なる slug を訳文と見なしたりしません。

<a id="common-messages"></a>

## 言語選択と共通文面

`i18n.locales.<locale>.messages` の任意 string で通常補完を使います。siteTitle は現在標準サイト情報を変えません。型・既定・未使用状態は[サイト辞書](/ja/blog/config-site-chrome/#legacy-site-title)にあります。

| 相対項目        | 簡体中国語 / 英語既定値                                                                          | 状態・役割・制約                                                         | 例                               |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------- |
| langLabel       | 语言 / Language                                                                                  | 有効。共通選択のヒント・アクセシブル名。選択肢は meta.label。            | '言語を選択'                     |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | 条件付き。ホームメタ説明で紹介・全ページ説明ではなく、他ページは固有値。 | '私のプロジェクトと学習ノート。' |

各機能文面は担当辞書へ。型に存在しても使用箇所がなければ有効になりません。コメント iframe は comments.lang にも従い既定固定英語です。[コメント](/ja/blog/config-comments/#appearance)へ。

<a id="ai-context"></a>

## aiReadableContent：言語別公開補足の特別規則

`i18n.locales.<locale>.aiReadableContent` の notes・links が最上位を個別上書きし、meta.fallback は使いません。省略は全体継承、空 notes・links は消去、{} は全体を消しません。

型、既定、検証、全例は[AI 補足](/ja/blog/config-analytics-ai/#locale-supplement)へ。ページ翻訳や About 本文ではなく全て公開です。リンクは公開ルート基準で、先頭単一 / は base を飛ばします。[URL 解決](/ja/blog/config-analytics-ai/#supplement)を参照してください。

<a id="examples"></a>

## 統合用設定例

既存 defineThemeConfig({...}) に統合し個人設定を残して i18n を重複させません。9言語と再帰マージするため、2言語だけ書いても他を無効にしません。

### 簡体中国語ページだけにする

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
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

既定 zh は無効化できません。英語ページを止めても登録設定は補完に使えます。根ホームなら always を never に変えますが記事は /zh/blog/.../ です。

### フランス語と独自文面を加える

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

一部のフランス語だけで完全言語パックではありません。記事は src/content/blog/fr/、Fragments は src/content/fragments/fr/ に置きます。作成器は有効言語の仮ファイルを生成し、自動翻訳しません。

<a id="content-and-seo"></a>

## URL、切り替え、SEO の範囲

- 共通メニューは有効言語だけで、既定は現在ページのサブパスを維持します。ルートは独自の行先も指定でき、全ページの実訳文を保証する探索器ではありません。
- 記事は言語を除く完全 slug で探し、存在すれば訳文、なければ Blog List へ。SEO は実在同 slug のみで一覧を訳文と偽りません。既定訳文なしでも偽の x-default 記事 URL は作りません。
- Fragments は対象言語一覧の最初へ移動し、ID 位置合わせではありません。同 ID コメント共有は別です。無効化でもファイル・GitHub 議論は削除しません。
- meta.label は名前だけ、キー変更は URL・ディレクトリを変えます。旧リンク移行や Accept-Language・ブラウザー・国による選択はありません。
- 公共 messages は文面で、汎用 HTML・Markdown 入口ではありません。改行・配列・書式は各定義を確認します。配列全置換でメニューや機能が増えるわけではありません。
- languageOrder、autoDetect、自動翻訳、全ページ接頭辞なし、言語別共通曲の設定はありません。localeHrefs・seoLocaleHrefs はコンポーネント引数です。

保存後に開発設定を再読込し、本番は再ビルド・再配備します。言語停止はホストの旧ファイル整理や非公開化ではありません。[総合案内](/ja/blog/config-reference/)へ。
