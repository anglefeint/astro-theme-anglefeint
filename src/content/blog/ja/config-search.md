---
tags: ['anglefeint', 'config']
title: '設定リファレンス：検索とコンテンツの発見'
subtitle: '検索入口、記事の収録、言語別索引、その他の入口。'
description: 'サイト内検索の設定・文面・記事収録を説明し、最新記事、関連記事、タグ、RSS、機械可読出力との違いを示します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

執筆は[最初の記事](/ja/blog/starter-guide-2-languages-and-routing/)、プレビューと公開は[配備](/ja/blog/starter-guide-deployment/)、設定位置は[第1回](/ja/blog/starter-guide-1-configure-your-site/)を参照してください。他項目は[総合案内](/ja/blog/config-reference/)にあります。

検索はビルド済み索引から記事を探します。ホーム最新記事、タグ、末尾推薦、RSS は別の入口で、検索スイッチで一括制御しません。既定値はテーマパッケージ由来で、デモ上書きではありません。

<a id="enabled"></a>

## theme.search.enabled：全体のスイッチ

- **型 / 既定値：** boolean / true。
- **状態と役割：** 有効。共通ヘッダーに入口を表示し、対象記事に索引マーカーを出し、ビルド終了後に静的 Pagefind を生成します。
- **制約：** false は標準入口と今回の索引生成を止めます。記事の search: true では上書きできません。記事削除、検索エンジン除外、過去の配備索引削除ではありません。
- **例：** theme: { search: { enabled: false } }。

公開 theme.search の末端項目はこれだけです。サービス URL、API key、索引ディレクトリ、並び順、重み、言語横断の設定はなく、ビルド時 Pagefind のため配備後の検索サーバーは不要です。

<a id="article-search"></a>

## 記事別 search：site.config の項目ではない

| 位置                                                           | 型 / 既定値                                         | 状態・役割・制約                                                                                     | 例            |
| -------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| `src/content/blog/<locale>/some-post.md` の frontmatter.search | 任意 boolean / schema 未指定、記事レイアウトは true | 全体有効時の索引根マーカーを制御。false でも一覧・関連記事・RSS・機械可読出力・公開 URL は残ります。 | search: false |

その記事だけを検索から外すには既存 frontmatter に追加します。

```yaml
search: false
```

theme.search: false や site.config 最上位 search: false にしないでください。非公開化ではなく、draft・未来日フィルターもありません。未公開内容は集合外に置きます。[記事項目](/ja/blog/config-article/#frontmatter)も参照してください。

### 索引に入る内容

全体と記事の両方が許可した場合に data-anglefeint-search 根マーカーを出力します。対象本文は記事タイトル、表示副題、本文です。副題と同じ context は副題位置で1回処理し、全 context の専用索引を作るわけではありません。

ナビゲーション、プレーヤー、フッター、コメント、関連記事は含みません。description はこの UI の結果抜粋に直接使わず、タグは検索フィルターではありません。Pagefind のタイトルと本文抜粋を使い、画像ピクセル・動画・音声の OCR や文字起こしはしません。

About、Fragments、Decoder、ホーム、一覧には既定の根マーカーがなく、自動収録しません。独自ページは索引の規約を自分で守る必要があり、存在しない設定項目で有効化はできません。

<a id="messages"></a>

## messages.search：11項目の文面

接頭辞は `i18n.locales.<locale>.messages.search.` です。すべて任意 string で、内蔵現在言語と補完を使います。表は簡体中国語／英語の実既定値、例は項目値です。入口と対応 UI・状態がある場合だけ使います。

| 項目          | 簡体中国語 / 英語既定値                                                                                                              | 役割・制約・プレースホルダー                                                   | 例                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------- |
| `label`       | 搜索 / Search                                                                                                                        | 入口ボタンのアクセシブル名・ヒント・ダイアログ見出しで、検索語ではありません。 | `"記事を検索"`                                    |
| `close`       | 关闭搜索 / Close search                                                                                                              | 閉じるボタンの名前とヒント。表示 esc と図形は固定です。                        | `"検索を閉じる"`                                  |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | 入力欄の仮文面とアクセシブル名。検索語を事前入力しません。                     | `"記事のキーワードを入力"`                        |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | 本番の空入力時の案内。                                                         | `"現在の言語の記事を検索します。"`                |
| `loading`     | 正在搜索… / Searching…                                                                                                               | 検索中・準備中の案内。遅延やロード方法は変えません。                           | `"検索中…"`                                       |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | 結果なし。現在言語の索引なしでも表示する場合があります。                       | `"該当する記事はありません。"`                    |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | 索引一覧・モジュール・詳細の読込失敗で、ビルドエラーではありません。           | `"検索を利用できません。再試行してください。"`    |
| `retry`       | 重试 / Retry                                                                                                                         | 失敗時の再試行。既存エンジンを再読込し、索引を再構築しません。                 | `"再読み込み"`                                    |
| `more`        | 加载更多 / Load more                                                                                                                 | 残り結果を追加するボタンで、バッチ数は変えません。                             | `"さらに表示"`                                    |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | 総件数。{count} の最初の1回を置換し、表示カード数ではありません。              | `"{count} 件の記事が見つかりました"`              |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | dev の案内。実検索はせず、文面変更で索引は作れません。                         | `"ビルド後の preview で検索を確認してください。"` |

プレーンテキストで、HTML は実行しません。空文字は文面だけを消してボタンは残り、アクセシブル名を失う場合があります。results の {count} は自動追加されないため、件数を出すなら1回残します。

### 統合用設定例

src/site.config.ts の既存 defineThemeConfig({...}) に統合し、import・export・個人設定を残して theme・i18n を重複させません。

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    ja: {
      messages: {
        search: {
          label: '記事を検索',
          placeholder: '記事のキーワードを入力',
          results: '{count} 件の記事が見つかりました',
          empty: '該当する記事はありません。',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## 言語、ロード、結果

- 出力 pagefind/ は anglefeint.json の言語一覧とモジュールを含みます。開いたときに一覧・エンジンを読みますが、入口ページの UI script は通常ロードなので全コードがクリック待ちではありません。
- パスには BASE_URL を含みます。HTML のみの配備、pagefind/ 漏れ、HTML への誤書換えは失敗原因です。索引パスの独自設定はありません。
- html lang と一覧を大小文字無視で比較します。現在言語に索引がなければ空で、英語に切り替えません。文面の補完言語ではなく、実ページ言語を使います。
- 入力約200ms後に検索し、IME 変換終了後に予約、送信で即検索できます。空入力は検索しません。遅延設定はなく、遠隔 AI 要求でもありません。
- 1回最大8件の詳細を取得し、「もっと見る」で追加します。pageSize はありません。表示数は総結果数で、同一オリジン URL だけを残し、抜粋は文字と mark 強調のみで任意 HTML を描画しません。
- 順序は Pagefind に従い、テーマの順位・推薦引数はありません。通常の言語補完は他言語記事を加えません。

言語メタ、スイッチ、補完は[言語リファレンス](/ja/blog/config-languages/#meta)へ。文面を変えても記事や索引言語は生成・変更しません。

<a id="preview"></a>

## dev で実検索しない理由

索引は Astro ビルド終了後に作り、dev は実行しません。messages.search.dev の案内を出し、入力しても実検索しないのが現在の仕様です。故障や設定不足ではありません。

内容を用意したらローカルで実行します。

```bash
npm run build
npm run preview
```

preview は出力を使います。記事、言語メタ、収録スイッチ、パスを変えたら再ビルドし、ページと pagefind を一緒に配備します。dev の文面編集だけでオンライン索引は更新しません。

対象記事なしでも識別可能な空言語一覧を生成します。索引失敗はエラーで、偽の成功を公開しません。再試行ボタンは既存出力を読み直すだけで、ブラウザー内でビルド修復・記事生成はしません。

<a id="discovery"></a>

## その他の発見入口

各モジュールの既存設定と既定値を使い、主説明は担当辞書に残します。別の検索設定を追加しません。

| パス・位置                                        | 型 / 既定値                     | 役割・制約・例                                                                                   | 詳細                                                  |
| ------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| theme.homeLatestCount                             | number / 3                      | ホーム最新記事数。例 theme: { homeLatestCount: 5 }。検索バッチ・関連記事数は変えません。         | [ホーム](/ja/blog/config-home/#latest-count)          |
| theme.blogPageSize                                | number / 10                     | ブログ・タグ一覧件数。例 theme: { blogPageSize: 8 }。検索数ではありません。                      | [一覧](/ja/blog/config-blog-list/#page-size)          |
| theme.tags.enabled                                | boolean / true                  | タグ入口と標準ページ。例 theme: { tags: { enabled: false } }。記事 tags や全文検索は残ります。   | [タグ](/ja/blog/config-blog-list/#tags-enabled)       |
| 記事 frontmatter.tags                             | 任意 string[] / 未指定          | タグ表示・アーカイブ。例 ['Astro', '随笔']。現在の関連記事の関連度や検索許可一覧ではありません。 | [記事](/ja/blog/config-article/#frontmatter)          |
| `i18n.locales.<locale>.messages.blog.related`     | string / 内蔵現在言語、下表参照 | 末尾の関連記事見出し。例 '继续阅读'。文面だけ。                                                  | [記事文面](/ja/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.relatedAria` | string / 内蔵現在言語、下表参照 | 領域のアクセシブル名。例 '其他文章'。                                                            | [記事文面](/ja/blog/config-article/#article-messages) |

関連記事は現在言語の自身を除いた最新3件で、共通タグ・canonicalTopic・内容類似度では選びません。relatedCount、独立スイッチ、手動推薦設定はなく、候補なしなら非表示です。search: false でも推薦できます。

| 文面                      | 簡体中国語 / 英語既定値  |
| ------------------------- | ------------------------ |
| messages.blog.related     | 相关文章 / Related       |
| messages.blog.relatedAria | 相关文章 / Related posts |

<a id="public-outputs"></a>

## RSS、SEO、機械可読出力と検索は別

| 入口                     | 現在の動作と設定                                                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<locale>/rss.xml`      | 有効言語の記事概要購読。タイトルはサイト名、説明は messages.blog.archiveDescription。title・description・pubDate・公開パスを使い、search: false は除外せず、全文 RSS ではありません。theme.search に RSS スイッチはありません。 |
| ページメタ・検索エンジン | 別出力で、search: false は noindex 追加・sitemap 停止・ネット検索の制御になりません。                                                                                                                                           |
| 公開機械可読テキスト     | 記事・About・Fragments の独自出力で Pagefind に依存しません。[言語補足](/ja/blog/config-languages/#ai-context)を参照。search: false は非公開フィルターではありません。                                                          |

サイト名・ドメイン・購読説明は実値を記入します。[配備](/ja/blog/starter-guide-deployment/)と[archiveDescription](/ja/blog/config-blog-list/#archive-messages)を参照してください。「検索結果なし」は「非公開」を意味しません。

全体・記事スイッチと11文面には使用箇所があり、旧互換項目の記入は不要です。未使用の canonicalTopic などを検索近くに置いても分類になりません。[記事の互換項目](/ja/blog/config-article/#legacy-frontmatter)へ。言語横断、OCR、検索語解析、重み、新索引型の公開設定はありません。

[総合案内](/ja/blog/config-reference/)で他の項目を探せます。
