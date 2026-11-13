---
tags: ['anglefeint', 'config']
title: '設定リファレンス：Giscus コメントと翻訳間の議論共有'
subtitle: '記事・Fragments の独立スイッチ、議論の対応、言語と共有規則。'
description: '全 Giscus 公開設定の既定値、型、検証条件、記事翻訳の共有、Fragments の上書き規則を実装で確認します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

初回は[コメントガイド](/ja/blog/starter-guide-4-giscus-comments/)でリポジトリと値を用意します。設定位置は[インストール](/ja/blog/starter-guide-1-configure-your-site/)、他モジュールは[総合案内](/ja/blog/config-reference/)へ。

src/site.config.ts の theme.comments に指定し、既定は無効です。以下はパッケージ既定値でデモの個人リポジトリではありません。接続情報はページへ公開するため、GitHub token や秘密は入れないでください。

<a id="controls"></a>

## 2つのスイッチを区別する

| パス                             | 型 / 既定値     | 状態・役割・制約                                                                                                 | 例                                                                   |
| -------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | 条件付きで記事コメントを表示。Fragments は制御しない。接続不足なら非表示になり得るが外部接続成功の証明ではない。 | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | Fragments 一覧用。fragments.enabled も true が必要。記事とは独立し、接続不足はページ生成エラー。                 | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

記事に個別 comments: false はなく、Fragment ごとのスイッチもありません。ホームプレビューにコメントボタンは出ません。[Fragments 設定](/ja/blog/config-fragments/#comments-enabled)も参照してください。

## theme.comments の全項目

完全接頭辞は theme.comments. です。例：theme.comments.repo。部分設定では省略可能で既定値を補います。文字列フラグは引用符を残し、true/false や数値にしないでください。

全項目は条件付きで、記事は有効かつ出力条件を満たす必要があります。Fragments は一部だけを使い、他は上書き・無視します。空文字で既定に戻る共通規則はなく、各行を確認します。型と非空だけでは外部 Giscus 設定を保証しません。

<a id="connection"></a>

### リポジトリとカテゴリ

| 項目         | 型     | 既定値 | 役割・条件・制約                                                                                         | 例                                |
| ------------ | ------ | ------ | -------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `repo`       | string | `""`   | GitHub owner/repo。記事は truthy、Fragments は trim 後非空も必要。前後空白を避け、外部権限は検証しない。 | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`   | 設定ツールの repo ID。名前、番号、token ではなく共通使用。                                               | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`   | Giscus の議論カテゴリ名で categoryId と対応し、記事タグではない。                                        | `"Announcements"`                 |
| `categoryId` | string | `""`   | カテゴリ ID で名前ではない。記事は truthy、Fragments は trim 後非空。外部の実在検証なし。                | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### 記事の対応と厳密照合

| 項目      | 型                                                                     | 既定値       | 役割・条件・制約                                                                                      | 例                      |
| --------- | ---------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | 記事対応方式。共有は specific 必須。Fragments は使わない。                                            | `"pathname"`            |
| `term`    | string                                                                 | `""`         | 非共有 specific は trim 後非空の全体固定 term。共有は空で描画時 slug を設定。他方式は送らない。       | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | 非共有 number は trim 後、安全範囲の正整数文字列。先頭0・正号・小数不可。共有は空、他方式は送らない。 | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | 厳密照合の文字列フラグ。共有は1、Fragments は1に固定。同タイトル議論の自動統合ではない。              | `"1"`                   |

<a id="appearance"></a>

### 表示、言語、ロード

| 項目               | 型                               | 既定値        | 役割・条件・制約                                                                                                | 例            |
| ------------------ | -------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | 主投稿のリアクション。記事・Fragments 共通で、全コメント操作の停止ではない。                                    | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | 親へ議論メタを送信。記事は設定どおりで統計自動表示なし。Fragments は準備・切替判断用に1固定。                   | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | 入力欄をリストの上・下へ。全コメント領域のページ位置は変えない。                                                | `"top"`       |
| `theme`            | string                           | `"dark"`      | Giscus iframe の色で、ブログのシーンではない。共通使用し、対応名の検証やシーン追従はしない。                    | `"dark"`      |
| `lang`             | string                           | `"en"`        | 記事 UI 言語。非空は直接、空はページ対応。Fragments は無視してページに従う。本文は翻訳しない。                  | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | 記事 iframe 用のロード指定。client.js 全体を遅らせない。Fragments は eager でもクリック後にクライアントを追加。 | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | クライアント script の crossorigin。共通使用で、repo 認証・token・権限修復ではない。                            | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales：記事翻訳の共有

- **型 / 既定値：** 任意 boolean / false。
- **状態と役割：** 記事コメント有効時に、同じ完全 slug の翻訳を同じ議論に結び、異なる slug は分けます。
- **制約：** mapping 'specific'、trim 後の term・number が空、strict が文字列 '1' であることが必須です。不一致は設定エラーでスイッチだけでは不十分です。記事コメント無効時はこの条件をスキップしますが、Fragments の接続検証は残ります。
- **例：** 下記共有設定。翻訳・旧議論統合・Fragment 対応変更は行いません。

| 記事ファイル                         | 共有時の実 term |
| ------------------------------------ | --------------- |
| src/content/blog/zh/my-first-post.md | my-first-post   |
| src/content/blog/en/my-first-post.md | my-first-post   |
| src/content/blog/zh/guides/setup.md  | guides/setup    |
| src/content/blog/en/other/setup.md   | other/setup     |

言語ディレクトリを除く完全 slug で対応し、タイトル・canonicalTopic・本文では識別しません。標準ルートは articleSlug を渡します。独自 BlogPost も非空、前後空白なし、空セグメントと . / .. なしの完全 slug が必要です。これはコンポーネント引数で公開設定ではありません。

同じリポジトリ・カテゴリを使う複数サイトでも同 slug は同議論になり得ます。ドメイン別 DB ではありません。パスが同じなら改題で term は変わらず、slug・repo・category・方式の変更は別議論になる場合があります。

<a id="mapping-values"></a>

## mapping の各値

| 値       | Giscus の基準        | 制約と例                                                  |
| -------- | -------------------- | --------------------------------------------------------- |
| pathname | URL パス             | 既定。言語で異なり、パス変更が対応に影響し得る。          |
| url      | 完全 URL             | ドメイン・URL 変更が影響し得る。                          |
| title    | 文書 title           | 記事・サイト名の変更が影響し、本文 h1 だけではない。      |
| og:title | Open Graph タイトル  | 既存メタ情報を使い、theme.comments にタイトルを入れない。 |
| specific | 指定 term            | 非共有は全体固定語、共有は各記事 slug。                   |
| number   | 既存 Discussion 番号 | 全体固定番号。例 '42'。Issue 番号でなく自動作成しない。   |

照合と作成は Giscus が行います。見つからない場合、初コメント・反応で作ることがあり、ページを開くだけでは保証しません。公開 repo、Discussions、アプリ導入が必要です。[公式設定](https://giscus.app/)とガイドへ。ローカル DB はありません。

strict '1' は議論本文のタイトルハッシュで厳密照合し、テーマのローカル比較ではありません。旧議論には印追加が必要な場合があります。[厳密照合](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict)へ。共有や対応変更で旧議論は自動移行・統合・削除せず、GitHub にあっても新対応で見えない場合があります。先に既存と新 term の関係を確認します。

非共有の specific + 固定 term と number は全体で同議論を探し、記事別 ID 自動割当てではありません。他方式の term・number は送信しませんが trim は実行するため null・数値を入れないでください。

<a id="examples"></a>

## 統合用設定例

既存 defineThemeConfig({...}) に統合し import・export・他設定を残して theme を重複させません。4接続値は自分の Giscus 設定から取得し、仮値は構造例だけで本番確認には使えません。

### 記事をパスごとに分ける

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### 記事翻訳で共有する

自分の接続値を維持し、対応部分を統合します。

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

既定 lang は 'en' でページ追従ではありません。例は空文字で追従を有効にします。zh → zh-CN、zh-hant → zh-TW、pt-br → pt、他はそのままです。対応言語はサービス次第で、UI だけを変え識別・本文は変えません。全体設定なので i18n.locales に複製しません。

theme は Giscus に直接渡し、一般例は 'dark'・'light'。対応色や独自 CSS URL は Giscus の責任で外側 AI パネルは変わりません。[公式テーマ](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme)を参照し、パッケージは CSS 内容・到達性を検証しません。

<a id="fragment-overrides"></a>

## Fragments が共通設定を使う範囲

| 共通項目                                               | Fragments の実動作                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| repo / repoId / category / categoryId                  | 共通。trim 後非空が必須だが元値を送るので前後空白を入れない。外部権限は検証しない。 |
| theme / reactionsEnabled / inputPosition / crossorigin | 共通設定をそのまま使用。                                                            |
| enabled                                                | 記事スイッチを無視し theme.fragments.comments.enabled を使う。                      |
| shareAcrossLocales                                     | 不使用。同一安定 ID が同じ議論へ対応。                                              |
| mapping / term / number                                | specific 固定、term は `fragment/<ID>`、number は送らない。                         |
| strict / emitMetadata                                  | '1' / '1' 固定。                                                                    |
| lang                                                   | 共通値を使わず、現在の Fragment ページ言語へ対応。                                  |
| loading                                                | eager 固定。ただし初クリック後にクライアント追加。                                  |

Fragments だけを有効にする例です。

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

多言語の同 ID は `fragment/<ID>` を共有し、記事 slug とは別規則です。順序やページ変更のために ID を変えません。初回クリックで読み、閉じても iframe を保ち、Giscus メッセージで議論を切替えます。約15秒失敗で再試行を出し、公開 timeout・先読設定はありません。Fragments だけを設定したい場合も、記事を有効にしていれば記事検証を実行します。

<a id="messages"></a>

## 外側ページのコメント文面

`i18n.locales.<语言>.messages` の任意 string で、現在言語と補完を使います。例は対応オブジェクトに入れます。外ラベルだけを変え iframe 内のボタンは変えません。表は簡体中国語／英語の実既定値です。

| 相対項目             | 簡体中国語 / 英語既定値                                                                                                   | 状態・役割・制約                                             | 例                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | 条件付き：記事領域のアクセシブル名。追加可視見出しではない。 | `"文章讨论"`         |
| `fragments.comments` | 评论 / Comments                                                                                                           | 条件付き：Fragments ボタンとダイアログ名。                   | `"参与讨论"`         |
| `fragments.close`    | 关闭 / Close                                                                                                              | 条件付き：ダイアログを閉じる。ホーム閉じる名前も使用。       | `"关闭窗口"`         |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | 条件付き：Fragments ロード状態。                             | `"正在加载讨论…"`    |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 条件付き：Fragments 読込失敗。                               | `"讨论暂时不可用。"` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | 条件付き：Fragments 再試行ボタン。                           | `"重新加载"`         |

他文面は[記事](/ja/blog/config-article/#article-messages)と[Fragments](/ja/blog/config-fragments/#fragment-messages)へ。iframe 内の言語はこれらでなく前述 lang です。

<a id="limits"></a>

## ロードと検証の範囲

記事は非同期 client.js を出し、loading 'lazy' は iframe 用でスクロールまで script を遅らせる意味ではありません。Fragments はテンプレートを出してクリック後に追加し、eager はその後の iframe 動作です。[公式](https://giscus.app/)も2層を区別します。

ローカル検証は mapping 条件と必須項目であり、GitHub 認証、権限、公開設定、カテゴリ、ネット、サービスを証明しません。記事の空接続値は非描画になり、空白だけでも出力条件を通る場合があり正設定ではありません。Fragments は厳しい非空検査でも ID の真偽は検証しません。

全 theme.comments に使用箇所はありますが Fragments では一部を上書きします。個別スイッチ、自前ホスト、順序、管理 token、ローカル DB はなく、クライアントは固定 https://giscus.app/client.js。Giscus の repo 設定は site.config 新項目ではありません。

変更後は再ビルド・再配備します。ビルド成功は実サービス確認を意味しません。旧議論の移行・権限は GitHub/Giscus で扱い、設定保存時に自動実行しません。[総合案内](/ja/blog/config-reference/)へ。
