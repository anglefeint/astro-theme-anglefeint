---
tags: ['anglefeint', 'config']
title: '設定リファレンス：Fragments'
subtitle: '一覧、ホームプレビュー、独立コメント、安定リンク。'
description: 'スイッチ、ページ分割、コメント、文面、内容項目を実装に沿って調べ、有効設定と未使用項目を区別します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

初投稿は[Fragment ガイド](/ja/blog/starter-guide-5-fragments/)、設定位置は[第1回](/ja/blog/starter-guide-1-configure-your-site/)へ。他モジュールは[総合案内](/ja/blog/config-reference/)にあります。

既定値はデモでなくテーマパッケージの値です。`src/site.config.ts` の既存 defineThemeConfig({...}) に統合し、theme・i18n を重複させません。

## 変更箇所を探す

| 目的                        | パス・位置                                                      |
| --------------------------- | --------------------------------------------------------------- |
| 一覧とホーム入口            | `theme.fragments.enabled`                                       |
| 全一覧の1ページ件数         | `theme.fragments.pageSize`                                      |
| 独立コメント                | `theme.fragments.comments.enabled`、接続は共通 `theme.comments` |
| 見出し、説明、案内、閉じる  | `i18n.locales.<语言>.messages.fragments`                        |
| ページ番号・ジャンプ        | `theme.pagination`、文面は `messages.blog`                      |
| 各項目の ID、日時、タイトル | Markdown frontmatter。site.config ではありません。              |
| ホーム件数、高さ、アバター  | 現在対応する公開項目なし。                                      |

<a id="enabled"></a>

## theme.fragments.enabled：有効化

- **型 / 既定値：** boolean / `false`。
- **状態 / 役割：** 有効。`src/content/fragments/<语言>/**/*.md` を読み、有効言語の一覧と位置索引を生成し、その言語に内容があればホーム入口を出します。
- **制約：** 無効なら集合とルートを生成せずファイルは残ります。有効で内容なしなら空一覧でホーム入口なし。.md のみで .mdx は対象外です。
- **例：** `theme: { fragments: { enabled: true } }`。

最初は `/<语言>/fragments/`、2ページ目以降は `/<语言>/fragments/2/` などです。/1/ を加えないでください。言語も[有効化](/ja/blog/starter-guide-languages/)が必要です。

`theme.fragments.enabled: false` の間、dev、build、prepare-covers／doctor は Fragment 本文の画像参照を読みません。その参照だけで処理対象になる画像は原画像や派生ファイルを要求しません。ただし記事カバーの参照と `src/assets/blog/default-covers/`、`src/assets/blog/covers/originals/` の画像プールは、Fragment 専用画像でも準備・検証します。ファイルは削除せず、再有効化すると Fragment 画像処理を再開します。

**バージョンについて：** 無効時の画像分離は 0.36.1 以降で提供し、0.36.0 には含まれません。旧版で使えるとは考えないでください。

<a id="page-size"></a>

## theme.fragments.pageSize：全一覧の件数

- **型 / 既定値：** number / `20`。
- **状態 / 役割：** 有効。ページ分割と ID・ページ対応索引を制御。
- **制約：** **1–100の安全整数**必須。小数・0・負数・範囲外はエラーで自動補正しません。機能無効でも検証します。ホーム最新3件はこの値や homeLatestCount に従いません。
- **例：** `theme: { fragments: { pageSize: 10 } }`。

言語内で pubDate 降順、同時刻は ID の localeCompare 順です。ファイル名順でも未来日除外でもありません。件数変更でページが変わるため共有は安定リンクを使います。

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled：コメント

- **型 / 既定値：** boolean / `false`。
- **状態 / 役割：** 条件付き。一覧カードにボタンを表示し、共用ダイアログで対象議論を読みます。ホームにはボタンを出しません。
- **制約：** 記事の theme.comments.enabled と独立。Giscus 接続も必須で、不足はページ生成エラーになり空一覧でも回避できません。外部サービス・権限の設定も必要です。
- **例：** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`。

Fragments だけを有効にしてコメントを使わない例です。

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

記事スイッチ false でも repo・repoId・category・categoryId は必須です。[接続項目](/ja/blog/config-comments/#connection)と[Fragments のみの完全例](/ja/blog/config-comments/#fragment-overrides)を参照してください。ローカル検証は外部権限・ID の正しさを証明しません。

`fragment/<稳定ID>` で対応し、同 ID の訳文は共有します。記事の mapping・term・number・shareAcrossLocales は使わず、specific・strict `'1'`・emitMetadata `'1'` に固定し、言語はページに追従して comments.lang を使いません。記事も有効なら記事側の検証は別途実行します。

色、リアクション、入力位置は共通 Giscus を使います。初回クリックで script を追加し、loading eager はクリック後即ロードの意味で初画面先読みではありません。閉じても iframe は保持し、対象変更で議論を切り替えます。約15秒応答なしなら失敗と再試行を表示し、公開 timeout 設定はありません。

<a id="fragment-messages"></a>

## UI 文面：messages.fragments

接頭辞は `i18n.locales.<语言>.messages.fragments`。すべて **string** で機能は変えません。内蔵現在言語と補完を使い、表は簡体中国語／英語の実既定値です。省略は既定、空文字は上書きで控件消去を保証しません。例は fragments 内に置きます。

| 項目             | 簡体中国語 / 英語既定値                                                                                                   | 状態・役割・制約                                                                 | 例                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | 条件付き：一覧・ページ見出しとホーム入口のアクセシブル名。個別タイトルではない。 | `title: '随手记'`                       |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | 条件付き：一覧紹介とメタ説明。ホーム展開には表示しない。                         | `description: '记录工作与生活的小事。'` |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | 条件付き：全一覧が空の案内。ホーム入口を強制しない。                             | `empty: '稍后再来看看。'`               |
| `comments`       | 评论 / Comments                                                                                                           | 条件付き：コメント有効時のボタン。                                               | `comments: '参与讨论'`                  |
| `close`          | 关闭 / Close                                                                                                              | 条件付き：コメントを閉じる文面とホーム閉じるボタンの名前。                       | `close: '关闭窗口'`                     |
| `previous`       | 上一页 / Previous                                                                                                         | **現在未使用**：型は受け付けるが実際は messages.blog.previous。                  | `previous: '上一页'`                    |
| `next`           | 下一页 / Next                                                                                                             | **現在未使用**：型は受け付けるが実際は messages.blog.next。                      | `next: '下一页'`                        |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | 条件付き：コメントのロード状態。                                                 | `loading: '正在连接讨论…'`              |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 条件付き：コメント読込失敗で、位置索引エラーではない。                           | `error: '讨论暂时不可用，请重试。'`     |
| `retry`          | 重试 / Retry                                                                                                              | 条件付き：コメント失敗の再試行。                                                 | `retry: '重新连接'`                     |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | 条件付き：共有ボタンの title と名前。script で有効化。                           | `copyLink: '复制本条链接'`              |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | 条件付き：コピー成功。                                                           | `linkCopied: '已复制'`                  |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | 条件付き：クリップボード失敗の手動コピー案内。                                   | `copyLinkFailed: '请手动复制此链接。'`  |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | 条件付き：安定 ID が見つからない場合。汎用404ではない。                          | `notFound: '这条记录已不存在。'`        |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | 条件付き：位置索引の要求・検証失敗。                                             | `indexError: '定位失败，请刷新重试。'`  |

簡体中国語の見出しと説明だけを上書きする例です。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        fragments: {
          title: '随手记',
          description: '记录工作与生活的小事。',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Fragments が使う共通設定

| パス                                                                                                         | 既定値と役割                                 | 制約、例、詳細                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                         | Blog List の8項目と既定値を共有              | 複数ページで表示。例 `theme: { pagination: { windowSize: 5 } }`。[ページ分割](/ja/blog/config-blog-list/#pagination-window)以降を参照。 |
| `i18n.locales.<语言>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string、現在言語の内蔵表示・アクセシブル文面 | 例 `previous: '上一页'`。[ページ文面](/ja/blog/config-blog-list/#pagination-messages)。同名 fragments 項目ではありません。              |
| `i18n.locales.<语言>.messages.blog.backToTop`                                                                | string、内蔵現在言語                         | 一覧のトップへ戻る。例 `backToTop: '回到顶部'`。[記事文面](/ja/blog/config-article/#article-messages)。                                 |
| `i18n.locales.<语言>.messages.home.viewAll`                                                                  | string、内蔵現在言語                         | ホーム下部リンク名は Fragment 見出しと組合せ。例 `viewAll: '查看全部'`。[ホーム文面](/ja/blog/config-home/#home-messages)。             |
| `theme.math.enabled`                                                                                         | boolean / `true`                             | 各ページ内容で数学 CSS を判断。例 `theme: { math: { enabled: false } }`。[数学](/ja/blog/config-article/#feature-switches)。            |

Giscus の全項目は[コメント辞書](/ja/blog/config-comments/)にあります。ここは接続と差異だけで、記事 mapping を Fragment 設定と見なしません。記事の目次、OUTPUT、Red Queen は一覧を制御せず、Cards/List 切替もありません。

<a id="content-fields"></a>

## 各 Fragment の3つの frontmatter

`src/content/fragments/<语言>/` の Markdown に書き、**site.config には書きません**。公開 schema は3項目のみで追加互換項目はありません。

| 項目      | 型 / 既定値                        | 役割・状態・制約                                                                  | 例                                    |
| --------- | ---------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | 必須 string / なし                 | 有効。ASCII 英数字8文字、同言語で重複不可。リンク・コメントが依存し公開後は維持。 | `id: 'aB3dE6gH'`                      |
| `pubDate` | Date に変換可能な日付 / 必須、なし | 解析可能で並び順を決め UTC 表示。タイムゾーン付き ISO を推奨。                    | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | 任意 string / 未指定               | カードとホームの見出し。省略可能でファイル名から自動生成しない。                  | `title: '今天的小发现'`               |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: '今天的小发现'
---

这里写正文。图片和代码直接放在 Markdown 正文中。
```

`npm run new-fragment -- --locales zh,en` は新 ID・現在日時を共有するファイル群を生成します。毎回新 ID なので、後日の訳文には元 ID を維持します。言語間は共有可能、同言語重複はエラーです。名前を変えても ID を変えず、旧形式の自動移行はありません。任意変更は共有とコメントを変えます。

description、heroImage、tags、draft、個別 comments の使用処理はなく、記事の項目を流用しないでください。draft: true で下書きにはならず、未公開内容は有効集合に置きません。

<a id="preview-and-links"></a>

## ホームプレビュー、画像、リンクの固定動作

以下に追加公開項目はありません。

- **件数：** 現在言語の最新3件まで。下部は表示数／その言語の総数で、他言語から補いません。
- **抜粋：** 描画内容から文面、最初の有効 HTTP(S) 画像、最初のコードを抽出。文面180 Unicode 符号点、コード8行・800符号点までで省略記号を加えます。高さ超過は隠し、全内容は一覧へ。タイトルは別。完全 Markdown ではなく previewCount・previewHeight もありません。
- **画像：** 対応ローカル画像は既存マニフェストからサイズ・srcset を得ます。外部・未対応は最適化を保証しません。各一覧ページ最初は eager/high、他は lazy、全て async デコード。[画像ガイド](/ja/blog/starter-guide-images/)に従い、heroImage は不要です。
- **安定リンク：** `/<语言>/fragments/#<ID>`。索引で現ページを探して必要なら移動し、追加・pageSize 変更にも ID で追従します。削除・改 ID は旧対象を保てません。JS なしでも通常ページ分割は可能ですが自動横断・コピーは頼れません。
- **言語切替：** 対象言語の最初の一覧へ移り、同 ID の訳文へ直接位置合わせは保証しません。
- **公開内容：** `/<语言>/fragments/index.md` に統合。検索・記事 RSS のスイッチではなく、公開内容に秘密を入れないでください。

アバター、hover、枠、高さは現在 site.config 項目ではありません。存在しない設定は提供しません。[総合案内](/ja/blog/config-reference/)へ。
