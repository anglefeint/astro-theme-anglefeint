---
tags: ['anglefeint', 'starter']
title: '利用ガイド 2：記事を書く・コンテンツを整理する'
subtitle: '記事の作成、カバーとタグの設定、目次、画像プレビュー、コードコピー、検索、共有画像の使い方。'
description: '記事の作成、カバーとタグの設定、目次、画像プレビュー、コードコピー、検索、共有画像の使い方。'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

## 日々の執筆はコンテンツファイルで

ガイド 1 の準備が済んでいることを前提に説明します。サイト全体の機能は `src/site.config.ts`、記事のタイトル・タグ・個別設定は Markdown 先頭の frontmatter（2 本の `---` の間）に書きます。設定する場所が異なる点に注意してください。

## 1. 記事を作成して URL を理解する

プロジェクトのルートで実行します。

```bash
npm run new-post -- my-first-post
```

既定では有効な言語ごとにファイルを作成します。日本語だけなら、上の代わりに以下を使います。両方実行する必要はありません。

```bash
npm run new-post -- my-first-post --locales ja
```

ファイルは `src/content/blog/ja/my-first-post.md`、URL は `/ja/blog/my-first-post/` です。slug には英小文字、数字、ハイフンだけを使い、空白やアンダースコアは避けます。同名ファイルはスキップされ、上書きされません。

`--locales` は作成するファイルだけを指定し、言語を有効化しません。ルートにはサイト設定も必要です。翻訳記事は同じファイル名にし、本文は各言語で用意します。翻訳のない言語へ記事から切り替えた場合は、その言語の記事一覧に移動します。

## 2. frontmatter とカバーを設定する

次をファイルの先頭に置き、2 本目の `---` の後に本文を書きます。

```yaml
---
title: 'My first post'
description: 'What I learned while building my blog.'
pubDate: '2026-09-18'
tags: ['astro', 'notes']
---
```

必須は `title`、`description`、`pubDate` です。`subtitle`、`updatedDate`、`author` は任意で、著者を省略するとサイトの著者が使われます。一覧は `pubDate` の新しい順です。現在、下書きや予約公開のフィルターはありません。`draft: true` や未来の日付では非公開にならないため、未完成の記事はコンテンツディレクトリの外に置いてください。

カバーは記事の隣に画像を置いて `heroImage: ./cover.jpg` と指定するか、作成コマンドが割り当てたローカルのパスを使います。`src/assets/blog/default-covers/` に画像がある場合のみ自動割り当てされ、画像のダウンロードは行いません。`heroImage` は省略できます。読了時間や文字数などは自動計算され、通常の記事で手入力する必要はありません。

これらは推定値であり、AI サービスから取得した測定値ではありません。frontmatter の `readMinutes`、`wordCount`、`tokenCount`、`aiLatencyMs`、`aiConfidence` は自動計算より優先され、省略すると推定値が使われます。一部のデモ記事には表示例として固定値が入っています。

## 3. 見出しから目次を作る

通常のレベル 2・3 の見出しを書きます。

```md
## First topic

Write your explanation here.

### A closer look

Add details here.
```

目次は既定で有効で、`##` と `###` から生成されます。広い画面では本文の右、狭い画面では本文の前に表示され、対象見出しがなければ表示されません。このページの目次で試せます。

記事単位で無効にする場合は既存の frontmatter に追加します。

```yaml
toc: false
```

`toc: true` はサイト全体の無効設定を上書きできます。省略時は `theme.toc.enabled` に従います。MDX の通常の Markdown 見出しも使えますが、コンポーネント内部や生の HTML/JSX で生成した見出しは自動収集されません。

## 4. タグで記事を整理する

frontmatter に `tags: ["astro", "notes"]` を追加するだけです。別の設定や手動のルート追加は不要で、ビルド時に言語ごとのタグ一覧とページ分割された記事一覧が生成されます。ブログのタグ入口や本文のタグをクリックでき、`/ja/tags/` でも確認できます。

大文字と小文字は区別され、`Astro` と `astro` は別です。前後の空白は除去し、同じ記事の重複タグは 1 回だけ数えます。日本語や特殊文字の URL は安定した形式にエンコードされるため、推測せず生成されたリンクを使ってください。タグ名を変えるとリンクも変わります。タグなしの記事も通常どおり表示されます。`theme.tags.enabled: false` は入口とタグページ生成を無効にします。

## 5. 画像プレビューとコードコピーは設定不要

本文画像は記事の隣のファイル、または `public/images/` のファイルを参照できます。以下は 2 通りの書き方です。使う方の画像を先に用意してください。

```md
![A description of the image](./photo.jpg)

![A description of the image](/images/photo.jpg)
```

通常の本文画像はクリック、またはフォーカス時の Enter/スペースで拡大できます。Esc、閉じるボタン、背景のクリックで閉じます。カバーやリンク・ボタン内の画像は対象外です。ブラウザーが選択した画像ソースを使うため、高解像度の原本を自動取得する機能でも、ギャラリーを順に切り替える機能でもありません。

コードは通常のフェンス付きブロックを使います。

````md
```js
console.log('Hello, world!');
```
````

右上にコピーボタンが自動表示され、インデントと改行を保持してコピーします。HTTPS または localhost で確認してください。クリップボードへのアクセスに失敗すると手動コピーを促す表示になります。どちらも追加設定は不要です。

## 6. 検索はビルド後に確認する

検索は既定で有効で、現在の言語の記事タイトルと本文が対象です。`npm run build` でインデックスが生成されます。`npm run preview` を起動し、ヘッダーの検索から本文の一文を検索して記事へ移動できるか確認します。`npm run dev` では開発中の案内を表示し、リアルタイムの全文検索は提供しません。

特定の記事をインデックスから除外するには frontmatter に追加します。

```yaml
search: false
```

非公開や下書きの設定ではなく、記事の URL や一覧からは引き続きアクセスできます。全体を無効にする `theme.search.enabled: false` は入口とインデックス生成の両方を止めます。記事を変えたら再ビルドしてください。

## 7. 自動共有画像と手動指定

既定では `ogImage` のない記事に、タイトル、著者（省略時はサイトの著者）、サイト名を使った 1200×630 PNG をビルド時に生成します。画像 API や記事ごとの画像制作は不要で、本文カバーの `heroImage` は変わりません。

独自の画像なら記事の隣に `share.png` を置き、frontmatter に追加します。

```yaml
ogImage: ./share.png
```

`public/images/share.png` を使うなら `ogImage: /images/share.png` です。HTTPS の画像直リンクも指定できます。ローカルファイルがない場合はエラーとなり、外部画像は配信元の状態に依存します。

明示した `ogImage` が優先されます。`theme.socialImage.enabled: false` は自動生成のみを無効化し、手動画像は有効なまま、ほかの記事はカバーまたは既定画像へフォールバックします。ビルドした記事 HTML の `og:image` を確認してください。自動画像は `dist/_social/` にあります。再公開後も共有先が古いプレビューをキャッシュする場合があります。内蔵フォントはすべての絵文字や文字体系への対応を保証しません。

## 8. 独立ページには new-page を使う

たとえばプロジェクト紹介ページを作ります。

```bash
npm run new-page -- projects --theme cyber
```

`src/pages/[lang]/projects.astro` が作成され、有効な言語の `/<言語コード>/projects/` を生成します。この Astro ファイルを編集して内容を入れます。本文の自動翻訳やヘッダーナビゲーションへの自動追加はしません。

`--theme` は `base`、`ai`、`cyber`、`hacker`、`matrix` から 1 つ選びます。slug は `projects/labs` のような階層も使えますが、各部分は英小文字、数字、ハイフンのみです。同名ページはエラーになるため、同じパスに 5 種類のコマンドを連続実行しないでください。記事の作成には引き続き `new-post` を使います。

## このガイドの構成

- [利用ガイド 1：ブログを立ち上げる](/ja/blog/starter-guide-1-configure-your-site/)
- [利用ガイド 2：記事を書く・コンテンツを整理する](/ja/blog/starter-guide-2-languages-and-routing/)
- [利用ガイド 3：必要な機能を有効化・カスタマイズする](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)
