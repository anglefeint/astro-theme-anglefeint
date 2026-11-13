---
tags: ['anglefeint', 'config']
title: '設定リファレンス：About'
subtitle: '自己紹介、連絡先、ツールパネル、Hacker ターミナル。'
description: 'About の内容、文面、ツール、効果を実装に基づいて調べ、既定値、制約、現在未使用の旧項目を示します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

紹介の変更は[ページと機能ガイド](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)、設定位置・導入は[第1回](/ja/blog/starter-guide-1-configure-your-site/)、他の項目は[総合案内](/ja/blog/config-reference/)へ。

本文は Markdown 記事からは読みません。`src/site.config.ts` の `i18n.locales.<语言>.about`、ページと章見出しは同言語の messages.about に置きます。以下はテーマ既定でデモの個人紹介ではありません。

<a id="page-enabled"></a>

## theme.enableAboutPage：ページのスイッチ

- **型 / 既定値：** boolean / true。
- **状態と役割：** 有効。有効言語の `/<语言>/about/` を生成し、無効なら標準 About と公共ナビ・Contact の対応先を提供しません。
- **制約：** 1段落の非表示ではなく内容設定は削除しません。無効ページへの直接アクセスはホームへ自動転送しません。再ビルド・配備が必要で旧配備ファイル・既公開データの削除保証でもありません。
- **例：** `theme: { enableAboutPage: false }`。

<a id="about-content"></a>

## About の内容とツール

表の接頭辞は **`i18n.locales.<语言>.about.`** です。例：sections.who は i18n.locales.zh.about.sections.who。型はマージ前の任意上書きで、省略は言語補完と既定値で補います。現在 zh / en は同じ英語プレースホルダーを使うため同値です。他言語には独自翻訳もあり、英語の既定から推測しないでください。

共通の長さ・URL 検証はないため、用途に合う短文・有効メール・リンクを指定します。配列は string[]、項目別マージでなく全置換です。空文字は汎用停止でなく各行に従います。例は各項目の値で対応階層に入れます。

<a id="body-fields"></a>

### 本文

| 項目                   | 型       | zh / en 既定値                                                                                       | 状態・役割・制約                                            | 例                                  |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | 有効。見出し上の状態行で、空ならこの行を隠す。              | `"profile ready"`                   |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | 有効。Who 本文で章見出しは変えない。                        | `"我是一名前端开发者。"`            |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | 有効。What 本文。                                           | `"我在构建个人博客与开源工具。"`    |
| `sections.ethos`       | string[] | [配列の既定値](#array-defaults)： sections.ethos                                                     | 有効。各要素が原則1件。空配列は項目だけを消し見出しは残す。 | `["先保证清晰。","持续小步交付。"]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | 有効。Now 本文。                                            | `"最近在学习 Astro。"`              |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | 有効。後の案内・リンクに接続する連絡段落の冒頭。            | `"欢迎交流。"`                      |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | 有効。末尾引用と仮想 about.md に使用。                      | `"保持好奇。"`                      |

<a id="contact-fields"></a>

### 連絡先

| 項目                  | 型     | zh / en 既定値                  | 状態・役割・制約                                                                                      | 例                              |
| --------------------- | ------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`             | 条件付き。trim 後空ならメールと contactEmailLead は非表示。リンクは元文字列なので前後空白を入れない。 | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"` | 有効。social.links と独立。空でも全リンクを自動非表示にしない。完全 HTTPS 推奨。                      | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                      | 有効。そのリンクの表示名で GitHub 固定ではない。                                                      | `"我的 GitHub"`                 |

<a id="tool-fields"></a>

### ツール入口

| 項目                 | 型     | zh / en 既定値         | 状態・役割・制約                                                                   | 例                 |
| -------------------- | ------ | ---------------------- | ---------------------------------------------------------------------------------- | ------------------ |
| `sidebar.dlData`     | string | `"DL Data"`            | 有効。側欄 DL Data ボタンとアクセシブル名。改名で動作は変わらない。                | `"数据面板"`       |
| `sidebar.ai`         | string | `"AI"`                 | 有効。側欄 AI ボタンと名前。                                                       | `"我的工具栈"`     |
| `sidebar.decryptor`  | string | `"Decryptor"`          | 有効。デコーダー入口で内部ボタン文面ではない。                                     | `"解码工具"`       |
| `sidebar.help`       | string | `"Help"`               | 有効。側欄キーボードパネルの入口。                                                 | `"键盘"`           |
| `sidebar.allScripts` | string | `"All Scripts"`        | 有効。現在言語の記事目次入口。                                                     | `"全部文章"`       |
| `scriptsPath`        | string | `"/root/bash/scripts"` | 有効。目次表示パス、仮想接頭辞、初期ディレクトリ。本機・サーバーディスクではない。 | `"/home/me/notes"` |

<a id="label-fields"></a>

### 共通文面

| 項目                        | 型     | zh / en 既定値    | 状態・役割・制約                                                                     | 例             |
| --------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------------ | -------------- |
| `labels.modalOutput`        | string | `"Output"`        | 開いた後のタイトルには未使用。初期 HTML 仮値のみで、各 modals.title に上書きされる。 | `"输出"`       |
| `labels.modalClose`         | string | `"Close"`         | 有効。ツールと本文ウィンドウを閉じる名前。機能停止ではない。                         | `"关闭"`       |
| `labels.responseOutput`     | string | `"Output"`        | 有効。本文上の OUTPUT ラベル。                                                       | `"OUTPUT"`     |
| `labels.contactEmailLead`   | string | `"Reach me via"`  | 条件付き。メールが非空の場合の前文。                                                 | `"邮箱："`     |
| `labels.contactConnectLead` | string | `"or connect on"` | 有効。メール空でも常に連絡リンク前に表示するので文の接続に注意。                     | `"也可以访问"` |
| `labels.backToTop`          | string | `"Back to top"`   | 条件付き。トップへ戻るヒント・名前。表示閾値は変えない。                             | `"回到顶部"`   |
| `labels.quickAccess`        | string | `"Quick access"`  | 有効。側欄ツールナビのアクセシブル名。                                               | `"快捷工具"`   |
| `labels.contactEmailLabel`  | string | `"email"`         | 条件付き。メール非空時の可視文字でメールアドレスではない。                           | `"发邮件"`     |

<a id="modal-fields"></a>

### ツールダイアログ

| 項目                                      | 型       | zh / en 既定値                                    | 状態・役割・制約                                                         | 例                                          |
| ----------------------------------------- | -------- | ------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                | 条件付き。データ演出のタイトル。                                         | `"数据传输"`                                |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                 | 条件付き。演出内副題でファイルは取得しない。                             | `"演示数据"`                                |
| `modals.ai.title`                         | string   | `"AI"`                                            | 条件付き。AI テキストパネルのタイトル。                                  | `"工具与工作流"`                            |
| `modals.ai.lines`                         | string[] | [配列の既定値](#array-defaults)： modals.ai.lines | 条件付き。改行接続の静的テキストで AI 要求なし。[] でも空 pre を開ける。 | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                              | 条件付き。現在のデコーダーのタイトルとして使用。                         | `"本地解码工具"`                            |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                            | 現在未使用。旧計算器本文で DecoderForm は読まない。                      | `"计算中"`                                  |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                   | 現在未使用。現デコーダーは変えない。                                     | `"已尝试密钥"`                              |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                           | 現在未使用。現デコーダーは変えない。                                     | `"当前口令"`                                |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                    | 現在未使用。現デコーダーは変えない。                                     | `"主密钥"`                                  |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                 | 現在未使用。現デコーダーは変えない。                                     | `"临时密钥"`                                |
| `modals.help.title`                       | string   | `"Help"`                                          | 条件付き。キーボードパネルのタイトル。                                   | `"键盘面板"`                                |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                          | 条件付き。統計見出し。空は内蔵英語へ戻る。                               | `"输入统计"`                                |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                    | 条件付き。入力数の接頭辞。空は内蔵英語。                                 | `"已输入："`                                |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                    | 条件付き。入力数の接尾辞。空は内蔵英語。                                 | `"个字符"`                                  |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                            | 条件付き。目次ダイアログ名。scriptsPath と独立して自動連動しない。       | `"文章目录"`                                |

<a id="effect-fields"></a>

### 効果

| 項目                       | 型       | zh / en 既定値                                            | 状態・役割・制約                                                                | 例                      |
| -------------------------- | -------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------- |
| `effects.backgroundLines`  | string[] | [配列の既定値](#array-defaults)： effects.backgroundLines | 標準ページでは表示せず、対話 session がない縮退分岐のみ。背景スイッチではない。 | `["~ $ hello","ready"]` |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                        | 条件付き。スクロール30%案内。空は context parsed。                              | `"读到这里了"`          |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                      | 条件付き。スクロール60%案内。空は inference stable。                            | `"继续探索"`            |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                      | 条件付き。スクロール90%案内。空は output finalized。                            | `"感谢阅读"`            |

本文はプレーンテキストで Markdown・HTML は解析しません。改行は CSS が維持しますが、**太字**、リンク、HTML はリッチ表示になりません。空でも章見出し・目次は自動削除せず、who / what / ethos / now / contact の順序とアンカーは固定です。

scriptsPath は /home/me/notes のような / 始まりの短い絶対仮想パスを推奨し、改行・null・ファイル競合を避けます。.・..・連続 / を正規化します。1024文字超や不正制御文字は初期化失敗の原因です。shell 実行や任意サーバー参照はしません。現在言語の生成記事と about.md を読み、All Scripts は任意スクリプト実行リストではありません。

DL Data は進捗アニメーションで実ダウンロードではありません。AI の model・latency も静的でリアルタイムではないため、実際の個人情報に変えるかデモと明示してください。

Help の3統計文は script が HTML に組み込むため、信頼する短い純テキストを指定し、外部入力を入れないでください。空は英語へ戻りラベル消去ではありません。本文・AI 行とは異なり、全設定が HTML 対応とは限りません。

スクロール案内は文書全体の進捗で、スクロール開始後に各閾値が初期化ごと最大1回発火します。読んだ語数・AI 処理ではなく、閾値・時間の設定もありません。空文字でも止まりません。

<a id="array-defaults"></a>

### 3配列の既定値

以下は zh / en の正確な全配列で、順序と空行も意味を持ちます。例の配列指定は全要素を置換します。

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## ページタイトルと共通控件の文面

`i18n.locales.<语言>.messages` に指定し about 内ではありません。任意 string、内蔵現在言語と補完を使います。表は簡体中国語／英語の実既定値。文面の変更では機能・章 ID を変えません。

### messages.about

| 項目                | 簡体中国語 / 英語既定値                                                                                 | 役割と制約                                                                  | 例                         |
| ------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | 条件付き：ページ、h1、ウィンドウ、仮想 about.md の見出し。                  | `"关于我"`                 |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | 条件付き：メタ説明。本文見出しの下に紹介を自動追加しない。                  | `"我的经历、工作与兴趣。"` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | 条件付き：Who 見出し・目次。本文やアンカーは変えない。                      | `"我是谁"`                 |
| `about.what`        | 我在构建什么 / What I Build                                                                             | 条件付き：What 見出し・目次。                                               | `"我在做什么"`             |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | 条件付き：Ethos 見出し・目次。                                              | `"我的原则"`               |
| `about.now`         | 现在 / Now                                                                                              | 条件付き：Now 見出し・目次。                                                | `"最近在忙"`               |
| `about.contact`     | 联系 / Contact                                                                                          | 条件付き：Contact 見出し・目次。アンカーは contact のまま。                 | `"联系我"`                 |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | 条件付き：スキャンボタンの文面・ヒント・名前。視覚だけで AI・本文生成なし。 | `"重新扫描"`               |

### messages.windowControls

| 項目                        | 簡体中国語 / 英語既定値     | 役割と制約                                             | 例         |
| --------------------------- | --------------------------- | ------------------------------------------------------ | ---------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content | 条件付き：本文最小化・ツール折畳みの文面。             | `"最小化"` |
| `windowControls.expand`     | 放大窗口 / Expand window    | 条件付き：ツール拡大。本文の全画面は fullscreen。      | `"放大"`   |
| `windowControls.restore`    | 还原窗口 / Restore window   | 条件付き：ウィンドウ復元と再表示の文面。               | `"还原"`   |
| `windowControls.fullscreen` | 全屏阅读 / Full screen      | 条件付き：本文ブラウザー全画面の文面。権限は変えない。 | `"全屏"`   |

### messages.scriptFolders

| 項目                      | 簡体中国語 / 英語既定値                                                                                      | 役割と制約                                                                 | 例                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------ |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | 条件付き：All Scripts の記事タイトルコピー名・ヒント。全文コピーではない。 | `"复制标题"`             |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | 条件付き：コピー成功状態。                                                 | `"标题已复制"`           |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | 条件付き：コピー失敗。空なら script で英語へ戻る場合がある。               | `"复制失败，请手动复制"` |

<a id="example"></a>

## 統合用設定例

既存の defineThemeConfig({...}) に統合し import、export、他設定を残し、theme・i18n を重複させません。

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: '我是一名前端开发者。',
          what: '我在构建个人博客与开源工具。',
          ethos: ['先保证清晰。', '持续小步交付。'],
          now: '最近在学习 Astro。',
          contactLead: '欢迎交流。',
          signature: '保持好奇。',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: '文章目录' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: '关于我', description: '我的经历、工作与兴趣。' },
      },
    },
  },
},
```

補完チェーンを低優先から高優先へ再帰マージし、現在言語が参照言語を上書き、最後に基礎 About で補います。配列は全置換、undefined は既存を変えません。zh だけでは全言語は変わりません。[多言語ガイド](/ja/blog/starter-guide-languages/)へ。

<a id="boundaries"></a>

## 関連設定と未提供機能

- **ナビと目次：** `i18n.locales.<语言>.messages.nav.about` は共通 About とウィンドウ再表示入口。string、簡体中国語既定「关于」／英語既定「About」、例「关于我」。messages.blog.toc は About 目次の見出し・名前で、簡体中国語既定「文章目录」／英語既定「On this page」、例「本页目录」。記事にも適用します。[記事文面](/ja/blog/config-article/#article-messages)へ。
- **完全 Decoder：** theme.enableDecoderPage は boolean、既定 true。`theme: { enableDecoderPage: false }` は独立ページと完全ツールへのリンクを止め、About 内蔵フォームは止めません。現在の内部文面は messages.decoder・messages.decoderPage で、旧5項目ではありません。[Decoder](/ja/blog/config-decoder/)へ。
- **ターミナル：** messages.terminal は共通文面で backgroundLines ではありません。範囲を限った仮想ファイルシステムで、設定では本機実行を許可できません。16項目、置換、未使用状態は[ターミナル辞書](/ja/blog/config-terminal/)へ。
- **ウィンドウと効果：** About 専用サイズ、初期閉鎖、本文フェード、ツール非表示、目次順、Oracle 改名・独立停止はありません。状態は runtime とローカル保存で管理します。JS なしでも本文は読めますがツールは保証しません。本文は最初から可視で observer 待ちではありません。動き軽減は runtime が扱い、新スイッチではありません。
- **連絡先：** contact と social.links は独立し、フッター変更で About を自動更新しません。

旧 decryptor 本文5項目は型で受理しても未使用、backgroundLines は縮退分岐のみ、modalOutput は初期仮値です。現ツール設定に使ったり、旧文面に合わせるため実装を変えたりする必要はありません。
