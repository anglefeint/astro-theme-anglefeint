---
tags: ['anglefeint', 'config']
title: '設定リファレンス：サイト名、ドメイン、共通ナビゲーション、ソーシャル、フッター'
subtitle: 'サイト情報、環境変数の上書き、固定ナビゲーションと共通リンク。'
description: 'site、social、footer、ナビゲーション文面の型、既定値、制約、環境変数、互換・未使用項目を実装に基づいて説明します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

最初の情報変更は[インストールとサイト情報](/ja/blog/starter-guide-1-configure-your-site/)、ドメインの公開は[配備ガイド](/ja/blog/starter-guide-deployment/)へ。他のモジュールは[総合案内](/ja/blog/config-reference/)から探せます。

設定先は src/site.config.ts です。既定値はテーマパッケージ由来で、デモの名前・アカウント・ドメインではありません。既存 defineThemeConfig({...}) の import、export、他モジュールを残して統合します。

<a id="identity"></a>

## site：サイト情報の6項目

site はオブジェクトで、部分設定では全項目を省略できます。表の全項目は条件付きで有効です。ページが読む際に使い、環境変数やページ固有の詳細な値が優先する場合があります。

| 完全パス           | 型           | テーマ既定値                                                                            | 役割・制約・例                                                                                                                                                  |
| ------------------ | ------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string       | `"My Blog"`                                                                             | ヘッダーブランド、著作権名、RSS、構造化データ、一部ページ・自動共有画像のサイト名。ホームの大見出しとは別で、統一の空値補完はなし。例 `"私のブログ"`。          |
| `site.description` | string       | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | 全体・機械可読索引説明の一部。ホームは messages.siteDescription、About・一覧は固有説明を優先し、全ページを置換しない。例 `"プロジェクト、読書、日々の記録。"`。 |
| `site.url`         | string       | `"https://example.com"`                                                                 | Astro site、canonical、RSS、sitemap、公開出力の絶対 HTTP(S) URL。記事 URL ではない。購入・DNS・証明書・公開を行わない。例 `"https://blog.example.com"`。        |
| `site.author`      | string       | `"Your Name"`                                                                           | 既定著者と構造化データ。記事 author は上書き可。著作権は title で、About・メールも自動変更しない。例 `"林"`。                                                   |
| `site.tagline`     | string       | `""`                                                                                    | trim するフッター短句。空または旧 Built with Astro. は表記重複を避け非表示。例 `"好奇心を持ち、作り続ける。"`。                                                 |
| `site.ogImage`     | string、任意 | `""`                                                                                    | ページ・記事の優先画像がないときの共有画像。空白は内蔵画像。public パス・HTTPS で、アバターや全記事カバー置換ではない。例 `"/images/share.webp"`。              |

site.title は全サイト名、`i18n.locales.<locale>.site.homeTitle` は各言語のホーム表示見出しです。後者は言語チェーンで非空値を探し、最後にサイト名へ戻ります。[ホーム見出し](/ja/blog/config-home/#home-title)を参照してください。messages.siteTitle は現在どちらにも使わないためブランド名変更には使えません。

site.description はホームの可視紹介文とは異なり、可視文は `i18n.locales.<locale>.site.hero`、メタ説明は messages.siteDescription です。[ホーム辞書](/ja/blog/config-home/#site-fallbacks)に優先順位があります。サイト情報を変えても既存 About 紹介は自動変更しません。

### 共有画像の優先順位とパス

共通 head にページ画像がないとき site.ogImage を使います。記事の ogImage、自動生成画像、カバーが優先し得ます。[記事辞書](/ja/blog/config-article/#frontmatter)を参照してください。自動生成が有効なら site.ogImage で全記事を上書きできません。

/images/share.webp は public/images/share.webp で、先に実ファイルを用意します。不在、publicDir 外、不正パスは予備画像の解析時にエラーです。ローカルには公開 base と内容バージョンを付け、HTTPS はそのままで取得検証しません。空・空白は内蔵画像に戻り、共有メタ情報を消す設定ではありません。

site.ogImage は文字列で、Astro image import オブジェクトは指定しません。記事 frontmatter.ogImage の型とは異なります。PUBLIC_SITE_OG_IMAGE の上書きはなく、heroImage も変えません。

<a id="environment"></a>

## 環境変数とドメインの優先順位

以下は site.config の新項目ではなく、現在読み込む string 環境変数です。未指定なら対応 site 値を使います。null 合体で読み、空文字を自動的に未指定とは見なしません。

| 環境変数                | 優先して上書きする項目 | 例                                               |
| ----------------------- | ---------------------- | ------------------------------------------------ |
| PUBLIC_SITE_TITLE       | site.title             | PUBLIC_SITE_TITLE=私のブログ                     |
| PUBLIC_SITE_DESCRIPTION | site.description       | PUBLIC_SITE_DESCRIPTION=プロジェクトと学習ノート |
| PUBLIC_SITE_AUTHOR      | site.author            | PUBLIC_SITE_AUTHOR=林                            |
| PUBLIC_SITE_TAGLINE     | site.tagline           | PUBLIC_SITE_TAGLINE=保持好奇                     |
| PUBLIC_SITE_URL         | site.url               | PUBLIC_SITE_URL=https://blog.example.com         |

統合は dev/build と --mode に対応する Vite dotenv モードで PUBLIC_SITE_URL を読み、Astro site と公開 URL を一致させます。既存プロセス環境は同名 dotenv より優先します。site.url だけ変えてホストの旧変数を忘れないでください。空文字は文面を消したり URL を無効にしたりし、既定へ戻す方法ではありません。

ページ側 SITE_URL には import.meta.env.SITE の互換中間値があり、PUBLIC_SITE_URL → SITE → site.url です。標準統合は変数または設定で Astro site を決め、head は Astro.site を優先します。SITE は adapter 互換用で別のドメイン設定として推奨しません。

ドメインと公開サブパスは別です。Astro base、配備出力、DNS/HTTPS は配備ガイドに従い、site.url に任意の子パスを入れても全ルートは移動しません。変更後は dev 再起動、本番再ビルド・再配備が必要で、サーバー転送は設定しません。

<a id="navigation"></a>

## 共通ナビゲーション：固定入口と機能スイッチ

公開 nav 配列、順序、独自メニュー項目はありません。標準ヘッダーの構成は次のとおりです。

| 位置                  | 現在の出典と制約                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| ブランド              | site.title／環境変数。現在言語のホームへ移動。                                                         |
| ホーム・Blog          | 常に存在する標準入口。messages.nav.home／blog は名前だけで移動先を変えません。                         |
| About                 | theme.enableAboutPage、boolean、既定 true。例 theme: { enableAboutPage: false } はページと入口を停止。 |
| Frontier の Decoder   | theme.enableDecoderPage、boolean、既定 true。ヘッダー表記は固定 Decoder Lab。                          |
| Frontier の Fragments | theme.fragments.enabled、boolean、既定 false。名前は messages.fragments.title。                        |
| Frontier の Contact   | About 有効時。messages.about.contact、現在言語の /about/#contact へ。Decoder と独立。                  |
| 検索                  | theme.search.enabled、boolean、既定 true。[検索辞書](/ja/blog/config-search/#enabled)へ。              |
| 言語・状態            | 有効言語、meta.label、下表の静的状態文面。言語は任意リンク一覧ではありません。                         |

Frontier 自体の名前は固定で、子項目が全部ない場合に非表示です。messages.decoderPage.fullTool は完全ツールとフッターを変えますが、ヘッダーの Decoder Lab は変えません。

[言語・URL](/ja/blog/config-languages/#content-and-seo)と各 About・Fragments・Decoder 辞書を参照してください。空ラベルで入口を止めようとすると、リンクや意味不明なボタンが残ります。

<a id="chrome-messages"></a>

### ヘッダーとフッターの7文面

接頭辞は `i18n.locales.<locale>.messages`、任意 string です。内蔵現在言語と補完を使い、表は簡体中国語／英語の実値です。対応する領域があるときに有効で、文字として描画し Markdown・任意 HTML は解析しません。

| 相対項目           | 簡体中国語 / 英語既定値         | 役割と制約                                          | 例                 |
| ------------------ | ------------------------------- | --------------------------------------------------- | ------------------ |
| `nav.home`         | 首页 / Home                     | ホーム名。ルートは変えない。                        | `"ホーム"`         |
| `nav.blog`         | 博客 / Blog                     | Blog 名。ルートは変えない。                         | `"記事"`           |
| `nav.about`        | 关于 / About                    | About 名。ウィンドウ再表示入口も使う。              | `"私について"`     |
| `nav.status`       | system: online / system: online | 静的状態でネット・API・健康を検出しない。           | `"システム稼働中"` |
| `nav.statusAria`   | 系统状态 / System status        | 状態領域のアクセシブル名。検査スイッチではない。    | `"サイトの状態"`   |
| `footer.theme`     | 主题： / Theme by               | テーマ表記接頭辞。Anglefeint の文字・リンクは固定。 | `"テーマ提供"`     |
| `footer.builtWith` | 构建工具： / Built with         | Astro 表記接頭辞。文字・リンクは固定。              | `"使用"`           |

messages.langLabel は言語控件、選択名は meta.label です。[言語文面](/ja/blog/config-languages/#common-messages)へ。Contact・Fragments は各モジュールを使い、nav に独自項目を作りません。

<a id="social"></a>

## social.links：ヘッダーとフッターの共通リンク

- **型 / 既定値：** SocialLink[] / []。各項目は下表の5フィールドです。
- **状態と役割：** 有効。配列順で共通表示し、全置換します。公開件数上限や言語別設定はありません。
- **制約：** [] は全領域を消さず、クリック不可の Mastodon・Twitter・GitHub を表示します。dev には設定案内も出ます。既存項目の空 href はその仮表示にはならず、リンクを出力します。
- **例：** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }]。

About のメール・GitHub は独立し、自動変更しません。theme.social.enabled・hidePlaceholders の公開スイッチはなく、showPlaceholdersWhenEmpty はレイアウト引数です。

<a id="social-fields"></a>

### SocialLink の5項目

接頭辞は social.links[]。必須項目の自動補完はありません。入力の部分型が部分オブジェクトを認めても、完全で有効な項目を指定してください。

| 項目    | 型 / 既定値                                               | 状態・役割・制約                                                                                                                                        | 例                            |
| ------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | 必須 string / なし                                        | 有効。実 URL。方式・到達性・非空の統一検証や BASE_URL 追加はありません。完全 HTTPS か正しい内部パスを使い、検証済みアカウントとは見なさないでください。 | 'https://github.com/yourname' |
| label   | 必須 string / なし                                        | 有効。アクセシブル名で、アイコンがなければ可視文字。プラットフォーム名や対象タイトルから補いません。明確な非空名を記入します。                          | 'GitHub'                      |
| rel     | 任意 string / 未指定、最終的に noopener noreferrer を含む | 有効。空白区切りを小文字・重複除去し opener を除去。空でも新窓保護は消えず、非文字列はエラー。                                                          | 'me nofollow'                 |
| icon    | 任意内蔵 SocialIcon / 未指定                              | iconSrc がない場合の12候補。未知の非空名はエラー、URL から推定しません。どちらもなければ label。                                                        | 'github'                      |
| iconSrc | 任意 string / 未指定                                      | publicDir のローカル SVG/PNG/WebP。有効非空パスは icon より優先。空白は未指定、非文字列・不正はエラー。                                                 | '/icons/community.svg'        |

実リンクはすべて新タブで、rel は保護値と統合します。ラベルに HTML は使いません。内蔵名は正確・大小文字区別です。

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

### 独自アイコンのファイル制約

public/icons/community.svg は iconSrc: '/icons/community.svg'。実 publicDir 内のファイルで、パッケージや src/assets ではありません。単一 / 始まり、URL・プロトコル相対・クエリ・フラグメント・百分率符号化・. / .. セグメントは不可です。逆斜線・コロン・制御文字も使えません。

ビルドで存在・ファイル種別・実パスの publicDir 内滞在を検証し、シンボリックリンクでの逸脱も不可です。通常の空白・中国語名はコンポーネントが符号化するので事前にしません。出力には base を加えますが href はそのままです。JPG・GIF は未対応です。

有効 iconSrc があれば icon は選択に使いません。寸法・間隔はレイアウト引数で SocialLink ではありません。

<a id="footer"></a>

## theme.footer：リンクとクレジット

| 完全パス                   | 型 / 既定値                            | 状態・役割・制約                                                                                                                 | 例                                                                |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | 有効。テーマ・Astro のリンク表記。著作権、ソーシャル、短句、他リンクは残し、自動共有画像の表記にも反映するが独自画像は変えない。 | false                                                             |
| theme.footer.links         | { label: string; href: string }[] / [] | 有効。配列順・全置換でヘッダーは変えない。レイアウトが Decoder を追加するため [] でも全リンク消去を保証しない。                  | [{ label: 'プロジェクト', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | 必須 string / なし                     | 条件付き。表示名を文字として出力し、対象から自動取得しない。                                                                     | 'プロジェクト'                                                    |
| theme.footer.links[].href  | 必須 string / なし                     | 条件付き。そのままの URL。アイコン同等の検証や base 追加はなく、内部パスは正確に指定。既定は現タブ移動。                         | 'https://example.com/project/'                                    |

独自リンクを自動追加リンクの前に置き、重複除去しません。Decoder 有効なら fullTool 文面の完全ツールリンクを追加します。不要なら対応スイッチを変え、footer.links の消去では止まりません。

著作権はビルド年と有効 SITE_TITLE で、独立 copyright/year 設定はありません。tagline は署名と別で、trim 後 Built with Astro. の旧互換文は省略します。showCredits false は他短句や既存画像表記を自動削除しません。

<a id="examples"></a>

## 統合用サイト・共通リンク例

既存の個人情報を残し、必要な項目だけを統合します。

```ts
site: {
  title: '林のブログ',
  description: 'プロジェクト、読書、日々の記録。',
  url: 'https://blog.example.com',
  author: '林',
  tagline: '好奇心を持ち、作り続ける。',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: 'プロジェクトのホーム', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: 'プロジェクト', href: 'https://example.com/project/' }],
  },
},
```

名前、ドメイン、リンクは実値に変えてください。通信検証はしません。独自アイコンや共有画像は先に public ファイルを準備してから iconSrc・site.ogImage に指定します。

日本語ナビゲーションと表記接頭辞だけを変える例です。

```ts
i18n: {
  locales: {
    ja: {
      messages: {
        nav: { home: 'ホーム', blog: '記事', about: '私について' },
        footer: { theme: 'テーマ提供', builtWith: '使用' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## 現在未使用：messages.siteTitle

完全パスは `i18n.locales.<locale>.messages.siteTitle`。任意 string、簡体中国語・英語の実既定値は共に 'Angle Feint' です。現在の標準ホームと共通サイト情報は読まず、**現在未使用**です。siteTitle: '私のブログ' でも変わりません。

ホームは `i18n.locales.<locale>.site.homeTitle`、共通名は最上位 site.title です。[ホーム](/ja/blog/config-home/#home-title)と[サイト情報](#identity)を参照し、改名のためにこの保持項目を埋める必要はありません。

<a id="boundaries"></a>

## 互換と無効項目の範囲

- site 6項目、ソーシャル、フッター、7文面には使用箇所がありますが、画像優先・環境変数・入口スイッチで実効果が決まります。
- tagline の Built with Astro. は明確な旧既定互換の特殊値で、任意短句がすべて無効という意味ではありません。
- messages.siteTitle は型で受理してもページは読みません。
- homeHref、localeHrefs、extraLinks、showPlaceholdersWhenEmpty、iconSize は引数で公開設定ではありません。nav 配列、仮アイコンのスイッチ、著作権テンプレート、独立健康検査もありません。

保存・素材準備後は再ビルド・再配備し、環境変数は対応モードを再読込します。ドメイン、到達性、アカウント、本番効果は自分の配備で確認し、ローカル型チェックだけで成功と判断しません。[総合案内](/ja/blog/config-reference/)へ。
