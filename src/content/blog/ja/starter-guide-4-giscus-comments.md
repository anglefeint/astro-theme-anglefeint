---
tags: ['anglefeint', 'starter']
title: 'ユーザーガイド6：読者がコメントできるようにする'
subtitle: 'Giscus を接続し、記事と Fragments のコメントを有効にして、多言語版で議論を共有するか選びます。'
description: 'Giscus の準備、テーマ設定、記事と議論の対応、多言語共有、Fragments の違い、設定・読み込みの問題を説明します。'
pubDate: '2026-11-10'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

入門ガイドの第6 / 8回です。[全ガイドの順序](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order) · [設定リファレンス](/ja/blog/config-reference/)。

Anglefeint のコメントは Giscus を使い、既定では無効です。記事と Fragments は独立して有効にでき、コメントとリアクションは設定した GitHub Discussions に保存します。静的ブログ用の追加データベースは不要です。

まずリポジトリを設定し、翻訳間で議論を共有するか選びます。記事テンプレートの編集や各記事への script の貼付は不要です。

## 1. GitHub リポジトリとカテゴリを用意する

[Giscus の日本語設定ページ](https://giscus.app/ja)を開き、次を確認します。

1. 自分の公開 GitHub リポジトリを使います。ブログと同じでもコメント専用でも構いません。
2. リポジトリの Discussions を有効にします。
3. Giscus アプリをインストールし、そのリポジトリへの権限を付与します。
4. 議論カテゴリを選び、生成されたリポジトリ・カテゴリ情報を控えます。

設定ページは script を生成しますが、テーマに必要なのは次の値だけです。

| Giscus の属性      | テーマへの指定先                                        |
| ------------------ | ------------------------------------------------------- |
| `data-repo`        | `theme.comments.repo`。例：`yourname/your-repository`。 |
| `data-repo-id`     | `theme.comments.repoId`。リポジトリ名ではなく ID。      |
| `data-category`    | `theme.comments.category`。実際のカテゴリ名。           |
| `data-category-id` | `theme.comments.categoryId`。カテゴリ名ではなく ID。    |

例の ID、リポジトリ URL、ユーザー名を実 ID として使わないでください。カテゴリは必ずしも Announcements ではなく、自分で選んだ名前と ID を使います。Giscus の npm パッケージ、GitHub token、パスワードの追加は不要です。

外部サービスのため Giscus と GitHub への接続が必要です。投稿には GitHub 認証が必要で、対応する Discussion から参加することもできます。テーマ自体は匿名コメントを提供しません。外部サービスの動作は[Giscus の公式説明](https://giscus.app/ja)に従います。

## 2. まず記事コメントを有効にする

`src/site.config.ts` の既存 `defineThemeConfig({...})` に統合します。

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

アカウント、リポジトリ、カテゴリ、2つの ID を実値に変えてください。既存の `theme` や `comments` を編集し、ほかの設定を残して同名オブジェクトを重複させません。

この例は記事コメントを有効にし、URL のパスで議論を対応させます。`/zh/blog/my-first-post/` と `/en/blog/my-first-post/` は異なるパスなので、既定では別の議論です。言語間共有は既定 `false` です。以前有効にした場合は後述の対応設定も戻す必要があり、この例だけでは不十分です。

記事コメントが有効で4つのリポジトリ・カテゴリ項目がそろった場合だけコンポーネントを出力します。不足すると領域が出ないことがあります。仮の値はローカルの非空確認を通すだけで、外部設定の成功を証明しません。記事別の frontmatter スイッチはなく、`comments: false` で特定記事だけを止めることはできません。

例の `lang: ''` は記事言語に UI を合わせます。テーマ既定は固定 `lang: 'en'` なので、追従させるには明示的に空にします。`zh` は `zh-CN`、`zh-hant` は `zh-TW`、`pt-br` は `pt` に対応します。UI だけが変わり、訪問者のコメントは翻訳しません。

## 3. 実際に接続できたか確認する

保存してローカルの記事の下部を開き、正しいリポジトリの議論、ログイン、投稿、リアクションを確認します。初めに空でも失敗とは限りません。最初のコメント・反応時に議論を作る場合があり、開くだけで即記録ができるとは限りません。

公開前に dev を停止して実行します。

```bash
npm run doctor
npm run preview
```

doctor は検証とビルドを含み、成功直後の build は不要です。preview はローカル表示であり、公開には再配備が必要です。ビルド成功が示すのはローカル設定と生成だけで、ブラウザーでの実権限・サービス接続の確認を置き換えません。

記事の既定は `loading: 'lazy'` です。Giscus iframe への指定であり、スクロールまでクライアント script の出力を遅らせる意味ではありません。記事は非同期 script を出力します。一方、Fragment はコメントボタンを押して初めてクライアントを読みます。

全パラメーターの型、既定値、例は[Giscus リファレンス](/ja/blog/config-comments/#connection)にあり、既存コメントがある場合は特に対応と共有条件を確認してください。

## 4. 記事と議論の対応方法を選ぶ

通常は `pathname` のままで十分です。既存コメントがある場合は対応基準を理解してから変更してください。

| `mapping`    | 議論の対応基準と制約                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| `'pathname'` | ドメインを除いた URL パス。記事パスの変更で別の議論になり得ます。                         |
| `'url'`      | URL 全体。ドメイン変更でも対応が変わり得ます。                                            |
| `'title'`    | ブラウザーの title。記事・サイト名の変更が影響し得ます。                                  |
| `'og:title'` | ページの Open Graph タイトル。                                                            |
| `'specific'` | 固定 `term`。非共有モードは非空が必須です。                                               |
| `'number'`   | `number` に既存 Discussion 番号。Issue 番号ではなく、このモードは議論を自動作成しません。 |

Giscus がこれらで議論を探し、テーマはローカルのコメント DB を作りません。厳密照合 `strict: '1'` は似たタイトルの曖昧照合を減らし、既定は `'0'` です。

非共有時の `term` と `number` は全体設定です。specific の固定 term ならその設定の全記事が同じ議論を探し、number も固定番号に向かいます。記事ごとに別議論を自動割当てするスイッチではありません。

記事コメント有効時、specific の term は空白除去後も非空、number は `'42'` のような正整数文字列が必要です。数値の `42`、`'0'`、小数は使えません。不正設定は検証を失敗させ、dev・build を妨げる場合があります。

## 5. 同じ記事の翻訳でコメントを共有する

簡体中国語と英語の翻訳で共有し、別記事は独立させる場合、実際のリポジトリ・カテゴリ情報を残し、対応部分を次のように統合します。

```ts
theme: {
  comments: {
    // 保留 enabled: true 和自己的 repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

共有モードは specific、空の term と number、文字列 `'1'` の strict が必須です。空 term は意図的で、各記事が言語ディレクトリを除く完全な slug を設定し、全記事に同じ固定語を使いません。

例の `src/content/blog/zh/my-first-post.md` と `src/content/blog/en/my-first-post.md` は共に `my-first-post` を使います。入れ子の `guides/setup` と `other/setup` は完全パスが異なるので別議論です。翻訳は同じ slug を使い、タイトルや本文の類似度では判定しません。

共有と記事コメントが有効な場合、不正 mapping、非空 term／number、`'1'` 以外の strict はエラーです。標準ルートは slug を渡しますが、BlogPost を独自に使うページも有効な articleSlug が必要です。UI は lang に従い、コメント本文の自動翻訳はしません。

同じ記事の2言語版と別の記事を開いて確認します。前2つは同じ議論、3つ目は独立するべきです。UI 言語やコメント枠の外観だけで成功と判断しないでください。

### 既存コメントはどうなる？

テーマは旧議論を統合・移動・削除しません。共有を有効にすると選ぶ議論が変わる場合があり、コメントは GitHub にあっても新しい対応では出ないことがあります。

変更前に repo、category、mapping、term、number、strict の元値を保存してください。戻すには `shareAcrossLocales: false` と各元値の復元が必要です。共有だけを無効にして空 term の specific を残すとエラーです。整理が必要なら GitHub でデータと対応を確認してください。自動移行はありません。

## 6. Fragment のコメントは独立して有効にできる

Fragments だけにコメントが必要なら、同じリポジトリ・カテゴリ情報を設定して次を指定します。

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

`theme.comments.enabled: false` は記事だけを無効にし、Fragments は `theme.fragments.comments.enabled` を使います。記事も必要なら true を保ち、Fragments のために記事の対応を変える必要はありません。

Fragments は specific・厳密照合・`fragment/<id>` に固定し、記事の mapping、term、number、shareAcrossLocales、固定 lang は使いません。UI は現在のページ言語、同 ID の翻訳は議論を共有します。反応、色、入力位置は共通設定を使います。4つの接続項目がなければ有効化時にエラーです。

最初のコメントボタンでロードし、閉じてもインスタンスを維持して再表示・別 Fragment に再利用します。失敗や約15秒未準備なら再試行を出します。ロード中の表示は接続成功の証明ではありません。投稿、ID、共有は[Fragment ガイド](/ja/blog/starter-guide-5-fragments/)を参照してください。

## 任意の調整：表示とロード

次はすべて `theme.comments` の項目で、通常は既定のままで十分です。

| 項目               | テーマ既定値  | 用途                                                                                                 |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------- |
| `reactionsEnabled` | `'1'`         | Discussion 主投稿のリアクション表示。`'0'` で停止。                                                  |
| `inputPosition`    | `'bottom'`    | 入力位置。`'top'`／`'bottom'`。                                                                      |
| `theme`            | `'dark'`      | Giscus の色識別子。対応値は設定ページに従い、ブログのテーマ変更ではありません。                      |
| `strict`           | `'0'`         | 記事の厳密照合。共有記事と Fragment は `'1'` に固定。                                                |
| `emitMetadata`     | `'0'`         | Giscus から親へ議論メタデータを送信。記事メタ情報ではありません。Fragments は準備確認に強制有効。    |
| `lang`             | `'en'`        | 記事の固定 UI 言語。`''` で追従。Fragments は常にページに追従。                                      |
| `loading`          | `'lazy'`      | 記事 iframe は `'lazy'`／`'eager'`。Fragment 展開後の iframe は eager。                              |
| `crossorigin`      | `'anonymous'` | script の属性。`'anonymous'`／`'use-credentials'`。通常変更不要で、GitHub ログインを置き換えません。 |

`enabled` と `shareAcrossLocales` は真偽値 true／false、`strict`・`reactionsEnabled`・`emitMetadata` は文字列 `'0'`／`'1'` です。見た目が似ていても型を混ぜないでください。

## 表示や対応がおかしいとき

| 症状                         | 確認順                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------ |
| 記事に領域がない             | 記事スイッチ true、4接続項目。Fragments スイッチは記事を制御しない。           |
| Fragments 有効化で設定エラー | 接続4項目が全部あるか。スイッチだけでは不十分。                                |
| 外部エラー・ロード継続       | 実 ID、公開リポジトリ、Discussions、アプリ権限、カテゴリ、ネットワーク・遮断。 |
| 別記事が同じ議論             | 全体の固定 term／number、共有設定の不足、Giscus の実照合結果。                 |
| 翻訳で共有しない             | shareAcrossLocales、同 slug、共有条件。                                        |
| 対応変更でコメントが消えた   | GitHub に旧議論があるか。タイトル・ID の反復変更や削除で復元しない。           |
| UI が英語のまま              | 記事 lang の既定は en。追従なら `''`。訪問者の本文は翻訳しない。               |
| ローカルだけ変わった         | 再ビルドと再配備、オンラインが旧設定でないか。                                 |

記事停止は `theme.comments.enabled: false`、Fragments は `theme.fragments.comments.enabled: false` です。該当入口・埋込を止めるだけで、GitHub のデータは消しません。更新ツールも議論を移行しないため、既存対応を保存して更新後に確認します。更新手順は[インストールガイド](/ja/blog/starter-guide-1-configure-your-site/)を参照してください。

## ガイドと設定リファレンス

[前の記事：ページと機能を自分好みに変える](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/) · [次の記事：より多くの言語の読者に届ける](/ja/blog/starter-guide-languages/) · [8本のガイドの総合案内](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order)。

関連項目：[Giscus と共有議論](/ja/blog/config-comments/)、[Fragment のコメントスイッチ](/ja/blog/config-fragments/)。完全なパス、既定値、制約は[設定リファレンス総合案内](/ja/blog/config-reference/)を参照してください。
