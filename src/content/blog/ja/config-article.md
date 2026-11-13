---
tags: ['anglefeint', 'config']
title: '設定リファレンス：記事詳細ページ'
subtitle: '全体スイッチ、記事項目、UI 文面を区別し、目次、数式、モニター、OUTPUT、読書操作を調べます。'
description: '記事詳細設定の型、既定値、役割、制約を説明し、frontmatter の互換・未使用項目をすべて明記します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**バージョンについて：** 動きの軽減への即時追従と、記事著者・共有画像キーの整合性修正は 0.36.1 以降で提供します。0.36.0 には含まれません。

[総合案内へ](/ja/blog/config-reference/)。機能と文面は `src/site.config.ts`、記事ごとのタイトル・日時・画像・統計は Markdown／MDX 冒頭の frontmatter に指定し、両者を入れ替えないでください。

パッケージ標準ルートを前提とし、有効言語の記事ページに内容由来の目次・統計・訳文リンク・最大3関連記事を提供します。BlogPost を直接呼ぶ独自ページは属性を自分で渡す必要があり、全ルート動作が自動で付くわけではありません。

## 1. 全体の機能スイッチ

<a id="feature-switches"></a>

site.config の theme にある **boolean**、既定はすべて **true** です。各行の例は必要なものだけを統合し、全部停止する推奨ではありません。

| 完全パス                       | 役割と条件                                                               | 制約と例                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | コンパイラーのレベル2・3 Markdown 見出しから目次を表示。なければ非表示。 | 記事 toc が優先。コンポーネント・生 HTML 見出しは自動対象外。例 `toc: { enabled: false }`。                      |
| `theme.math.enabled`           | Markdown／MDX の数学処理。実本文に数式がある場合のみ CSS を導入。        | 全体設定で記事別 math はなし。誤式はコンパイル失敗。例 `math: { enabled: false }`。                              |
| `theme.effects.enableRedQueen` | 側面の Red Queen モニター。                                              | false でも背景ネット、カバー Canvas、AI 全体は止めない。例 `effects: { enableRedQueen: false }`。                |
| `theme.search.enabled`         | 入口と索引生成。[検索](/ja/blog/config-search/#enabled)へ。              | 記事 false は除外可、true でも全体停止は覆せない。例 `search: { enabled: false }`。                              |
| `theme.tags.enabled`           | 記事タグリンクと目次・一覧。                                             | false でも元 tags は残す。例 `tags: { enabled: false }`。[範囲](/ja/blog/config-blog-list/#tags-enabled)。       |
| `theme.socialImage.enabled`    | ogImage 未指定に1200×630共有画像を自動生成。                             | false でも手動値は有効で、カバー・サイト画像へ戻る。カバー非表示ではない。例 `socialImage: { enabled: false }`。 |

各項目は内容・領域・優先順位に応じて有効です。たとえば目次だけを止め、他既定を維持できます。

```ts
theme: { toc: { enabled: false } },
```

レベル3はレベル2内に入り、独立したレベル3も項目になります。レベル4以降は対象外です。本文は直接表示し、目次ロードを待ちません。

## 2. 著者、クレジット、共有画像、コメントの関連項目

<a id="shared-controls"></a>

共通モジュールのため記事への影響だけを示します。

| 完全パス                   | 記事への影響                                                                | 主説明                                              |
| -------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------- |
| `site.author`              | 記事 author 未指定・空白時と共有画像の著者。                                | [サイト情報](/ja/blog/config-site-chrome/#identity) |
| `theme.enableAboutPage`    | 有効かつ記事著者がサイト著者なら、その言語 About へリンク。それ以外は文字。 | [About](/ja/blog/config-about/#page-enabled)        |
| `theme.footer.showCredits` | 自動共有画像のテーマ表記。独自画像は変更しない。                            | [フッター](/ja/blog/config-site-chrome/#footer)     |
| `site.ogImage`             | 優先画像がない場合のサイト共有画像。                                        | [画像優先](/ja/blog/config-site-chrome/#identity)   |
| `theme.comments.enabled`   | 接続項目と mapping 条件も必要。記事別 frontmatter スイッチなし。            | [Giscus](/ja/blog/config-comments/#controls)        |

## 3. 記事の項目：site.config に書かない

<a id="frontmatter"></a>

記事 frontmatter の全22項目です。日付は Date、ローカル画像は画像メタデータに解析しますが、型は執筆者の入力を基準に記します。

### 内容とメタ情報

| 項目          | 型と既定動作                                       | 役割・制約・例                                                                                         |
| ------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `title`       | 必須 string、既定なし                              | 記事名とメタ情報でサイト名ではない。例 `title: '私のノート'`。                                         |
| `description` | 必須 string、既定なし                              | メタ説明。context 未指定なら見出し下にも使用。本文ではない。例 `description: 'デバッグの記録です。'`。 |
| `pubDate`     | 必須の解析可能日付、既定なし                       | 公開日・並び順・メタ。詳細は UTC 日付、未来でも隠れない。例 `pubDate: '2026-11-13'`。                  |
| `updatedDate` | 任意日付、未指定                                   | 更新表示と sitemap に優先。pubDate の順序は変えない。例 `updatedDate: '2026-11-14'`。                  |
| `author`      | 任意 string、未指定・空白はサイト著者              | 著者ページは自動作成しない。例 `author: '別の著者'`。                                                  |
| `subtitle`    | 任意 string、未指定                                | 副題。context と完全一致なら重複しない。例 `subtitle: '現象から原因の特定まで'`。                      |
| `context`     | 任意 string、未指定なら description                | 見出し下の文脈。空で行だけを消しメタは残す。例 `context: '具体的な問題を解決します。'`。               |
| `tags`        | 任意 string 配列、未指定ならタグなし               | 表示は全体スイッチにも従う。例 `tags: ['astro', 'メモ']`。                                             |
| `heroImage`   | 任意ローカル画像パス、未指定ならカバーなし         | 外部 URL・public URL は同規則で使えない。実画像を置き `heroImage: ./cover.jpg`。                       |
| `ogImage`     | 任意ローカル画像・public パス・HTTPS、未指定は補完 | 本文カバーは変えない。実画像を置き `ogImage: /images/share.png`。                                      |
| `toc`         | 任意 boolean、全体目次を継承                       | true は全体停止を上書き可だが見出しなしなら出さない。例 `toc: false`。                                 |
| `search`      | 任意 boolean、既定 true                            | false はサイト内検索だけを除外し、一覧・RSS・sitemap・AI 出力は残す。例 `search: false`。              |

まず必須項目だけを書き、必要なら追加できます。

```yaml
---
title: '私のノート'
description: 'デバッグの記録です。'
pubDate: '2026-11-13'
subtitle: '現象から原因の特定まで'
context: '具体的な問題を解決します。'
tags: ['astro', 'メモ']
toc: true
search: true
---
```

draft、予約公開、記事別 comments・Red Queen・math はありません。未完成内容は集合外に置き、未知項目を非公開制御に使いません。

<a id="output-fields"></a>

### OUTPUT の統計と状態文字

| 項目         | 型と既定動作                                     | 役割・制約・例                                                                      |
| ------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `wordCount`  | 任意非負整数、本文ソースから計算                 | 独立上書き。例 `wordCount: 800` は tokenCount を変えない。                          |
| `tokenCount` | 任意非負整数、既定 round(max(自動語数, 1) × 1.3) | モデルの tokenizer・実使用量ではない推定。例 `tokenCount: 1040`。                   |
| `aiModel`    | 任意 string、未指定はラベルなし                  | 見出し状態と OUTPUT。実モデルは検証しない。例 `aiModel: '著者が記入するモデル名'`。 |
| `aiMode`     | 任意 string、未指定はラベルなし                  | モード文だけで実行しない。例 `aiMode: 'notes'`。                                    |
| `aiState`    | 任意 string、未指定はラベルなし                  | 状態文だけで健康を検査しない。例 `aiState: 'edited'`。                              |

自動統計は一部 Markdown・コード・リンクを除外し、CJK 漢字・仮名・韓国語は文字単位、他は主に空白区切りです。数式・MDX も影響します。wordCount だけで tokens は再計算しません。1000以上は小数1桁 k 表示で、元値は変えません。

```yaml
wordCount: 800
tokenCount: 1040
aiModel: '著者が記入するモデル名'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### 互換項目と現在未使用の項目

| 項目             | 型と既定値             | 状態・制約・例                                                                                                                           |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | 任意正整数、未指定     | 互換保持、現在読了時間は非表示。`readMinutes: 3` でも復帰しない。                                                                        |
| `aiLatencyMs`    | 任意非負整数、未指定   | 互換保持、現在遅延は非表示。`aiLatencyMs: 150` も実測ではない。                                                                          |
| `aiConfidence`   | 任意0–1 number、未指定 | 互換保持、信頼度は非表示。`aiConfidence: 0.9` は正確性評価ではない。                                                                     |
| `canonicalTopic` | 任意 string、未指定    | 現在未使用。`canonicalTopic: 'astro'` はトピックや canonical を変えない。                                                                |
| `sourceLinks`    | 任意 URL 配列、未指定  | 現在は検証・正規化のみ。HTTP(S)、裸ドメインに https 補完。`sourceLinks: ['https://example.com/']` でも参考リンク表示・出力追加はしない。 |

出典は本文に Markdown リンクで書いてください。旧項目を受け付けても UI が残るとは限らず、更新のために元内容を消す必要もありません。

## 4. 記事 UI の文面

<a id="article-messages"></a>

接頭辞は `i18n.locales.<locale>.messages.blog`、任意 string、通常の言語補完です。表は簡体中国語／英語の実既定値。例は blog 内の1メンバーで frontmatter ではありません。

対応領域がある場合だけ有効です。空文字はラベルだけを消して機能を隠さず、アクセシブル名は消さないでください。未使用項目には表示効果がありません。

| 項目                 | 簡体中国語既定 / 英語既定            | 役割と制約                                            | 状態           | メンバー例                                  |
| -------------------- | ------------------------------------ | ----------------------------------------------------- | -------------- | ------------------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed            | Red Queen 有効時のバッジ。実監視ではない。            | 条件付きで有効 | `rqBadge: "モニター信号"`                   |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed | 再生ボタン名。素材・再生方法は変えない。              | 条件付きで有効 | `rqReplayAria: "モニター信号を再生"`        |
| `backToTop`          | 返回顶部 / Back to top               | トップへ戻る名前。表示はスクロール次第。              | 条件付きで有効 | `backToTop: "先頭に戻る"`                   |
| `toastP10`           | 语境解析 10% / context parsed 10%    | 初期読書進捗で AI 要求進捗ではない。                  | 条件付きで有効 | `toastP10: "文脈を解析 10%"`                |
| `toastP30`           | 语境解析 30% / context parsed 30%    | 読書進捗で意味解析結果ではない。                      | 条件付きで有効 | `toastP30: "文脈を解析 30%"`                |
| `toastP60`           | 推理稳定 60% / inference stable 60%  | 読書進捗でモデル推論ではない。                        | 条件付きで有効 | `toastP60: "推論が安定 60%"`                |
| `toastDone`          | 输出完成 / output finalized          | 読了案内で生成・検証完了の証明ではない。              | 条件付きで有効 | `toastDone: "出力完了"`                     |
| `metaPublished`      | 发布 / published                     | 公開日前のラベル。日付は変えない。                    | 条件付きで有効 | `metaPublished: "公開"`                     |
| `metaAuthor`         | 作者 / by                            | 著者のラベル。値は変えない。                          | 条件付きで有効 | `metaAuthor: "著者"`                        |
| `metaUpdated`        | 更新 / updated                       | updatedDate がある場合のラベル。                      | 条件付きで有効 | `metaUpdated: "更新"`                       |
| `systemStatusAria`   | 模型状态 / Model status              | 状態項目が1つ以上ある場合の領域名。                   | 条件付きで有効 | `systemStatusAria: "モデルの状態"`          |
| `systemModelLabel`   | 模型 / model                         | aiModel のラベル。OUTPUT でも使用。                   | 条件付きで有効 | `systemModelLabel: "モデル"`                |
| `systemModeLabel`    | 模式 / mode                          | aiMode のラベル。                                     | 条件付きで有効 | `systemModeLabel: "モード"`                 |
| `systemStateLabel`   | 状态 / state                         | aiState のラベル。                                    | 条件付きで有効 | `systemStateLabel: "状態"`                  |
| `promptContextLabel` | 语境 / Context                       | 非空 context の前ラベル。                             | 条件付きで有効 | `promptContextLabel: "文脈"`                |
| `heroMonitor`        | 神经监视器 / neural monitor          | heroImage がある場合のモニター文字。                  | 条件付きで有効 | `heroMonitor: "ニューラルモニター"`         |
| `heroSignalSync`     | 信号同步中 / signal sync active      | 静的信号装飾で同期状態は照会しない。                  | 条件付きで有効 | `heroSignalSync: "信号を同期中"`            |
| `heroModelOnline`    | 模型在线 / model online              | 静的モデル装飾でサービスは照会しない。                | 条件付きで有効 | `heroModelOnline: "モデルはオンライン"`     |
| `toc`                | 文章目录 / On this page              | 有効かつ見出しがある目次の名前。                      | 条件付きで有効 | `toc: "記事一覧"`                           |
| `responseOutput`     | 输出 / Output                        | OUTPUT 見出しで本文は変えない。                       | 条件付きで有効 | `responseOutput: "出力"`                    |
| `statsWords`         | 词 / words                           | 語数ラベル。値は変えない。                            | 条件付きで有効 | `statsWords: "語"`                          |
| `statsTokens`        | 令牌 / tokens                        | tokens ラベル。推定は変えない。                       | 条件付きで有効 | `statsTokens: "トークン"`                   |
| `copySectionLink`    | 复制本节链接 / Copy section link     | 本文 h2/h3 リンクのコピー名。アンカー算法は変えない。 | 条件付きで有効 | `copySectionLink: "この節のリンクをコピー"` |
| `regenerate`         | 重播扫描 / Replay scan               | スキャン再生文字。視覚効果だけ。                      | 条件付きで有効 | `regenerate: "スキャンを再生"`              |
| `relatedAria`        | 相关文章 / Related posts             | 他記事がある場合の領域名。                            | 条件付きで有効 | `relatedAria: "関連記事"`                   |
| `related`            | 相关文章 / Related                   | 関連記事見出し。算法は変えない。                      | 条件付きで有効 | `related: "関連記事"`                       |
| `backToBlogAria`     | 返回博客 / Back to blog              | 戻るナビのアクセシブル名。                            | 条件付きで有効 | `backToBlogAria: "ブログに戻る"`            |
| `backToBlog`         | 返回博客 / Back to blog              | 戻るリンク文。行先は変えない。                        | 条件付きで有効 | `backToBlog: "ブログに戻る"`                |
| `comments`           | 评论 / Comments                      | 有効コメント領域の名前。                              | 条件付きで有効 | `comments: "コメント"`                      |
| `metaReadMinutes`    | 分钟阅读 / min read                  | 現在未使用。読了時間は復帰しない。                    | 現在未使用     | `metaReadMinutes: "分で読めます"`           |
| `latencyLabel`       | 延迟估计 / latency est               | 現在未使用。遅延は復帰しない。                        | 現在未使用     | `latencyLabel: "推定待ち時間"`              |
| `confidenceLabel`    | 置信度 / confidence                  | 現在未使用。信頼度は復帰しない。                      | 現在未使用     | `confidenceLabel: "信頼度"`                 |

状態・カバー・スクロール案内は主に雰囲気の演出で、AI オンライン、ネット同期、正確性の測定ではありません。regenerate はスキャン効果だけで記事を書き直したり AI を要求したりしません。

OUTPUT と章リンクコピーの文面を変える例です。

```ts
i18n: {
  locales: {
    ja: {
      messages: {
        blog: {
          responseOutput: '本文',
          statsWords: '文字・単語',
          statsTokens: '推定 tokens',
          copySectionLink: 'この節の URL をコピー',
          regenerate: 'スキャン演出を再生',
        },
      },
    },
  },
},
```

戻る先は現在言語の一覧で、文字変更は URL を変えません。関連記事は同言語で自分を除く最新最大3件です。AI 類似推薦ではなく件数・類似度設定もありません。related と relatedAria は文面・名前だけです。

<a id="interaction-messages"></a>

### コードコピーと画像プレビュー

接頭辞は `i18n.locales.<locale>.messages`。すべて任意 string・条件付きで、コピー権限・画像ソース・機能スイッチは変えません。

| パス末尾             | 簡体中国語既定 / 英語既定                                           | 役割と制約                                             | メンバー例                                                                         |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | コピー文字で内容は変えない。                           | `codeCopy: { copy: "コードをコピー" }`                                             |
| `codeCopy.copied`    | 已复制 / Copied                                                     | コード・章リンクの成功案内。                           | `codeCopy: { copied: "コピーしました" }`                                           |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | コード・章リンク失敗。クリップボード権限は付与しない。 | `codeCopy: { failed: "コピーできませんでした。コードを手動で選択してください。" }` |
| `imagePreview.open`  | 查看大图 / View image                                               | 画像入口とダイアログのアクセシブル名。                 | `imagePreview: { open: "画像を拡大" }`                                             |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | 閉じる名前で画像ソースは変えない。                     | `imagePreview: { close: "画像プレビューを閉じる" }`                                |

```ts
i18n: {
  locales: {
    ja: {
      messages: {
        codeCopy: { copy: '内容をコピー', copied: 'コピーしました', failed: 'コピーできませんでした。手動で選択してください。' },
        imagePreview: { open: 'この画像を拡大', close: '画像を閉じる' },
      },
    },
  },
},
```

章コピーは本文の id 付き h2/h3 のみで、成功・失敗に codeCopy.copied/failed を共用します。コードコピー・画像拡大は JS 必須です。カバーとリンク・ボタン内画像は対象外、選択済みソースを再利用して高解像原画像を追加取得しません。enabled の設定はありません。

## 5. 設定範囲と確認

記事ページはシステムの「視差効果を減らす」設定変更に、再読み込みなしで追従します。有効にするとカバーと背景ネットワークは静止し、Red Queen は停止して非表示になります。解除すると従来の起動タイミングで再開します。読書進捗はリセットせず、コードコピー・章リンク・画像プレビューも再登録しません。site.config の新しいスイッチはありません。

本文とパネルは直接表示して静止します。背景ネット、光帯、カバー効果は独立です。AI 全体切替、本文入場時間、パネル呼吸、関連記事数、画像・コピー enabled の公開設定はありません。任意キーを加えても反映しません。

locale、articleSlug、headings、filePath、related、localeHrefs、seoLocaleHrefs は BlogPost 属性で、site.config・frontmatter ではありません。標準ルートが提供し、普通の記事で手記入しません。

dev で見出し・カバー有無を確認し、コピー・章リンク・画像操作を自分で確認します。検索はビルド後 preview で確認。dev 停止後 npm run doctor、npm run preview を使い、直後の check・build は不要です。再配備で本番を更新します。

[インストール・更新](/ja/blog/starter-guide-1-configure-your-site/)、[記事ガイド](/ja/blog/starter-guide-2-languages-and-routing/)、[配備](/ja/blog/starter-guide-deployment/)も参照してください。
