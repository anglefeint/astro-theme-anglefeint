[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/ja/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">人間の読者と AI エージェントのための、映画のような複数の世界観を持つ Astro 個人出版テーマ。</p>

`llms.txt`、多言語索引、全文集合、記事 Markdown を自動生成し、AI エージェントによる読取・引用と GEO（生成エンジン最適化）を支援します。

<p align="center">
  <a href="https://demo.anglefeint.com/">ライブデモ</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">リポジトリ</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI アシスタント</a> · <a href="#installation">インストール</a> · <a href="#setup">サイト設定</a> · <a href="#writing">記事を書く</a> · <a href="#upgrade">更新</a> · <a href="#deployment">ビルドと公開</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Anglefeint でできること

Markdown／MDX で記事、Fragments で短い考えを投稿できます。多言語、検索、タグ、目次、コードコピー、画像プレビュー、数式、自動共有画像を内蔵し、コメント・音楽・GA4 は任意で有効にできます。

| ページ           | 世界観                                             |
| ---------------- | -------------------------------------------------- |
| ホーム           | Matrix：緑のコード雨、ターミナル、ピクセルアバター |
| ブログ・タグ一覧 | Cyberpunk：ネオン、雨幕、街の光線                  |
| About            | Hacker：自己紹介、仮想ターミナル、対話型ツール     |
| 記事詳細         | AI：ネットワーク背景、モニター、OUTPUT 読書パネル  |

公開記事、About、Fragments の Markdown、`llms.txt`、多言語全文集合もビルド時に生成します。AI ツールが読める静的出力で本番サーバーは不要ですが、モデルの収集や引用を保証しません。

<a id="ai-assistant"></a>

## AI アシスタントと協力する

Cursor、Codex、Claude Code にプロジェクトの `AGENTS.md` に従ってサイト設定や内容管理を依頼できます。`CLAUDE.md` と Cursor ルールも同じ案内を参照します。変更したいことを伝え、実設定とこの記事の該当節を確認してもらい、詳細な項目はデモの設定リファレンスで調べます。

テーマ開発はリポジトリの [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) と[貢献ガイド](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md)から始めてください。ブログ利用者が保守者の公開手順を先に学ぶ必要はありません。

<a id="installation"></a>

## 1. インストールして起動する

**Node.js 22.12.0 以降**が必要で、**Astro 7** ベースです。ブログを置くディレクトリで実行します。

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

表示された URL を開きます。既存ブログは元ディレクトリで `npm install`、`npm run dev` を実行し、再作成しません。停止は Ctrl+C です。以降はプロジェクトルートで dev を止めるか別ターミナルを開いて実行します。

新規プロジェクトでは `pnpm install`、`pnpm dev` も使えます。1プロジェクトは同じパッケージマネージャーを維持してください。以下は npm を使い、自動更新も現在 npm のみ対応します。

詳細：[ブログをインストールして自分の情報に変える](https://demo.anglefeint.com/ja/blog/starter-guide-1-configure-your-site/)。

<a id="setup"></a>

## 2. 初期設定：自分の情報に変える

インストール済みプロジェクトには `src/site.config.ts` があります。**このファイルを直接編集し、設定ファイルや設定オブジェクトを新設する必要はありません**。

既存 `defineThemeConfig({ ... })` 内に次の `site` を追加し、名前、著者、説明、ドメインを自分のものに変えます。starter は site を省略して既定値を使います。すでに site があればその中を編集して他設定を残し、同名オブジェクトを重複させません。既存 import、export、他設定は維持します。

```ts
site: {
  title: '我的博客',
  author: '你的名字',
  description: '记录项目、阅读和生活。',
  url: 'https://your-domain.example',
},
```

これはサイト情報だけを変え、言語設定は変えません。言語別 `homeTitle` 未指定ならホーム見出しは全体 `title` です。紹介文、About、ソーシャルリンクも変更でき、詳細はこの節のガイドと辞書を参照してください。

`site.url` は本番の公開 URL で dev URL ではありません。配備環境の `PUBLIC_SITE_URL` が優先するため、旧ドメインのままなら確認してください。

初期状態は9言語有効、既定は英語で `/` は `/en/` へ移動します。日本語 README を読むためにブログを日本語へ変える必要はありません。既定言語や使う言語を変える場合は[多言語ガイド](https://demo.anglefeint.com/ja/blog/starter-guide-languages/)へ。省略で言語は無効にならず、既定言語は常に有効、自動翻訳もしません。例の記事はバックアップ・Git コミット後に削除できますが、使用中の画像は残してください。

手順：[導入と初期設定](https://demo.anglefeint.com/ja/blog/starter-guide-1-configure-your-site/)、[言語とホーム URL](https://demo.anglefeint.com/ja/blog/starter-guide-languages/)。項目：[サイトと公共 UI](https://demo.anglefeint.com/ja/blog/config-site-chrome/)、[ホーム](https://demo.anglefeint.com/ja/blog/config-home/)。

<a id="writing"></a>

## 3. 最初の記事を書く

プロジェクトルートで作成します。

```bash
npm run new-post -- my-first-post
```

`--locales` と `ANGLEFEINT_LOCALES` がなければ有効な全言語に同名のひな形を作ります。初期状態は9ファイル、調整後は現在の有効言語です。本文は自動翻訳せず、既存ファイルも上書きしません。

`src/content/blog/<locale>/my-first-post.md` に生成し、URL は `/<locale>/blog/my-first-post/`、一覧は `/<locale>/blog/` です。英語は `src/content/blog/en/my-first-post.md`、簡体中国語は `src/content/blog/zh/my-first-post.md`。必要なファイルを開いてタイトル・説明・本文を変え、ルートは手動作成しません。最小の内容例です。

```md
---
title: '我的第一篇文章'
description: '记录这次开始写博客的想法。'
pubDate: '2026-11-13'
---

这里开始写正文。
```

上は必須項目だけで、生成済みカバーなどの任意項目は残せます。通常の slug は `my-first-post` のように英小文字・数字・ハイフンを使います。

指定言語だけに作りたい場合は `--locales` を使います。次は選択肢で、全部実行する必要はありません。

```bash
# 只生成英文
npm run new-post -- my-first-post --locales en

# 只生成中文
npm run new-post -- my-first-post --locales zh

# 生成指定的多种语言
npm run new-post -- my-first-post --locales en,zh
```

`--locales` は作成先だけで言語を有効化しません。ページ生成には言語の有効化が必要です。同じ呼出しの新規ファイルは素材があれば同じランダムカバーを共有し、既存ファイルは残します。

`ANGLEFEINT_LOCALES` も使用でき、優先順は `--locales` → 環境変数 → 有効言語です。Bash は `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`、PowerShell は上の `--locales` を使えます。

**下書き・未来日付の自動非表示は現在ありません。** 他言語のひな形も公開されるため、公開前に必要な内容を完成し、未公開のファイルは集合の外へ移します。`draft: true`、`search: false` は非公開化ではありません。

手順：[最初の記事](https://demo.anglefeint.com/ja/blog/starter-guide-2-languages-and-routing/)、[画像](https://demo.anglefeint.com/ja/blog/starter-guide-images/)。項目：[記事詳細と frontmatter](https://demo.anglefeint.com/ja/blog/config-article/)。

## 4. Fragment を投稿する

Fragments は短文、画像、コードに適しています。**テーマと新規 starter は既定で無効、デモは独自に有効にしています。** 使う場合は既存 `theme` に `fragments.enabled: true` を統合します。同名 theme を重複作成しないでください。

```ts
theme: {
  fragments: { enabled: true },
},
```

すでに enabled true なら不要、false なら true に変えます。一覧とホーム入口のスイッチで、コメントは引き続き既定無効です。

次で1件を作成します。既定は有効な全言語に同じ内容のひな形を生成します。

```bash
npm run new-fragment
```

指定言語だけなら次のパラメーターを選べます。

```bash
# 只生成中文
npm run new-fragment -- --locales zh

# 生成指定的多种语言
npm run new-fragment -- --locales en,zh
```

1回ごとに新規作成します。例は別の使い方なので1つを選び、全部実行しません。CLI から言語スイッチも自動変更しません。

保存先は `src/content/fragments/<locale>/`、名前の例は `2026-11-13-aB3dE6gH.md` で実際のパスをターミナルに出します。本文を編集し、生成した英数字8文字 ID は維持してください。同時生成は ID・公開日を共有します。同じ内容の追記に作成コマンドを再実行しません。

一覧は `/<locale>/fragments/`、例は `/en/fragments/`、`/zh/fragments/` です。その言語に内容があればホームにアバター入口が出ます。安定リンクは `/<locale>/fragments/#ID` でページ番号を識別子にしません。ID 変更はリンク・コメントに影響し、コメントは既定無効です。

手順：[Fragment 投稿](https://demo.anglefeint.com/ja/blog/starter-guide-5-fragments/)。項目：[Fragments](https://demo.anglefeint.com/ja/blog/config-fragments/)。

## 5. 独自ページを作成する

記事は new-post、プロジェクト・作品などの独立ページは new-page です。

```bash
npm run new-page -- projects
```

`src/pages/[lang]/projects.astro` を既定 base で生成します。編集後は `/<locale>/projects/`、例 `/en/projects/` を開きます。1ファイルで有効な全言語のページを生成し、自動翻訳・ナビ追加は行いません。

外観を選ぶ場合は `--theme` を追加できます。base、matrix、cyber、hacker、ai に対応し、例の `npm run new-page -- portfolio --theme cyber` は別の Cyberpunk ページを作ります。

入れ子のパスも使えます。例：

```bash
npm run new-page -- projects/labs --theme hacker
```

各セグメントは英小文字・数字・ハイフンで、大文字・アンダースコア・先頭末尾 / は不可です。既存ファイルを上書きせず、標準予約ページもこのコマンドでは再作成できません。

詳細：[ページカスタマイズ](https://demo.anglefeint.com/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)。

## 6. 画像を準備して生成物を保持する

本文は通常の Markdown 画像です。記事の隣に photo.jpg を置き `![画像の説明](./photo.jpg)` と書けます。カバーは frontmatter の `heroImage: ./cover.jpg` に設定し、先に実ファイルを用意します。public の URL に public 接頭辞は付けません。

カバーと対応する Fragment のローカル画像は永続レスポンシブファイルが必要です。ローカルで準備、または現出力だけを確認できます。

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

ローカル dev・doctor は不足・期限切れを補いますが、build・CI doctor は検証のみで配備側は生成しません。原画像と `src/assets/blog/covers/` 全体（manifest.json、generated/）を Git にコミットします。missing／stale／modified はローカル準備・コミット後に再ビルドしてください。

通常記事の全本文画像が圧縮された意味ではありません。対象範囲、パス、共有画像は[画像ガイド](https://demo.anglefeint.com/ja/blog/starter-guide-images/)へ。

<a id="reference"></a>

## 必要に応じて機能を設定する

よく使うコマンドと初回操作はこのページだけで進められます。細かい変更にはガイド・辞書を使ってください。辞書は型、既定値、制約、例、未使用状態を項目別に説明します。

| 目的                                           | 操作ガイド                                                                                                                                                                              | 設定リファレンス                                                                                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ホーム、サイト情報、ナビ、ソーシャル、フッター | [ページと機能](https://demo.anglefeint.com/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   | [ホーム](https://demo.anglefeint.com/ja/blog/config-home/)、[サイトと公共 UI](https://demo.anglefeint.com/ja/blog/config-site-chrome/)                                                         |
| 件数、タグ、ページ分割                         | [ページと機能](https://demo.anglefeint.com/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   | [Blog List とタグ](https://demo.anglefeint.com/ja/blog/config-blog-list/)                                                                                                                      |
| 記事目次、数式、OUTPUT、検索収録               | [記事ガイド](https://demo.anglefeint.com/ja/blog/starter-guide-2-languages-and-routing/)                                                                                                | [記事詳細](https://demo.anglefeint.com/ja/blog/config-article/)、[検索と発見](https://demo.anglefeint.com/ja/blog/config-search/)                                                              |
| About、ターミナル、Decoder                     | [ページと機能](https://demo.anglefeint.com/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   | [About](https://demo.anglefeint.com/ja/blog/config-about/)、[ターミナル](https://demo.anglefeint.com/ja/blog/config-terminal/)、[Decoder](https://demo.anglefeint.com/ja/blog/config-decoder/) |
| 音楽とコメント                                 | [音楽設定](https://demo.anglefeint.com/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)、[読者コメント](https://demo.anglefeint.com/ja/blog/starter-guide-4-giscus-comments/) | [音楽](https://demo.anglefeint.com/ja/blog/config-music/)、[Giscus と多言語共有](https://demo.anglefeint.com/ja/blog/config-comments/)                                                         |
| 言語、解析、公開テキスト補足                   | [多言語](https://demo.anglefeint.com/ja/blog/starter-guide-languages/)、[公開](https://demo.anglefeint.com/ja/blog/starter-guide-deployment/)                                           | [言語と補完](https://demo.anglefeint.com/ja/blog/config-languages/)、[GA4・AI 補足](https://demo.anglefeint.com/ja/blog/config-analytics-ai/)                                                  |

場所が不明なら[設定リファレンス総合案内](https://demo.anglefeint.com/ja/blog/config-reference/)へ。1言語の文面変更で内容は自動翻訳せず、設定・記事変更には再ビルド・再配備が必要です。

<a id="upgrade"></a>

## 7. 既存ブログを更新する

新規インストールならこの節は不要で、[検証・プレビュー・初回公開](#deployment)に進めます。

Git コミットなどで変更を保存し、dev・preview を止め、元のプロジェクトルートで互換性を確認して更新します。

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` は変更・インストール・ビルドをしません。実更新は npm、package-lock.json、anglefeint.projectSchema: 1 の統合 starter 用です。pnpm／yarn／bun でロックを消して回避しないでください。

テーマ依存を更新して doctor を実行し、記事、個人設定、音楽、画像、独自ページを残します。2つの依存ファイルを `.anglefeint/backups/` へ保存しますが全体バックアップではありません。失敗時は復元と旧依存再導入を試みます。失敗後の dist は公開しません。

特定版は `npx @anglefeint/astro-theme@latest upgrade --to <version>` を使い、互換性のある明確な版に置換します。自動ダウングレードはありません。成功時は検証・ビルド済みなので直接 `npm run preview` へ進め、直後の build は不要です。自動公開・不整合 Astro の自動移行は行いません。

0.27 前のコピー式旧構成は直接更新できません。別 starter を作り旧プロジェクトを残して内容・素材を移します。旧標準ルート・adapter はコピーしません。

詳細と復旧：[既存プロジェクトの更新](https://demo.anglefeint.com/ja/blog/starter-guide-1-configure-your-site/)、[更新ガイド](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)、[リリース](https://github.com/anglefeint/astro-theme-anglefeint/releases)。

<a id="deployment"></a>

## 8. 検証、プレビュー、初回公開

プロジェクトルートで dev を停止し、検証とビルドの後にプレビューします。

```bash
npm run doctor
npm run preview
```

`npm run doctor` は検証とビルドを含み、`npm run check` は同義なので一方を選び、直後に check・build を繰り返しません。Astro／TypeScript だけなら `npm run check:no-build`。preview はローカル表示で Ctrl+C で停止し、サイトはアップロードしません。実検索はビルド後の preview で使い、dev は案内のみです。

ビルドだけなら次の組に置き換えます。どちらか1つを選びます。

```bash
npm run build
npm run preview
```

pnpm は `pnpm run doctor`／`pnpm preview`、または `pnpm build`／`pnpm preview` です。`pnpm doctor` は pnpm 自身の診断を呼ぶため省略しないでください。1組を選び重複ビルドしません。

静的ホストへの初回公開：

1. site.url または PUBLIC_SITE_URL を正式 URL にし、ソース、原画像、生成物をコミットします。
2. ビルドは `npm run build`、出力は `dist`。手動なら成功ビルドの **dist 全内容** をアップロードします。
3. _astro/、pagefind/、_social/、公開テキストなどを含め、HTML だけを配備しません。
4. ドメインルート・ディレクトリ index を使います。任意サブパスは追加対応が必要で Astro base だけで対応済みとは扱いません。
5. ホストでドメイン・HTTPS を設定し、ホーム、記事、言語、画像、検索を確認します。

静的出力なので本番 Node.js・追加 adapter は不要です。ターミナル JSON の noindex は dist/_headers に統合し、対応ホストが適用します。他は同等設定が必要で Astro preview は再現しません。内容・設定変更後は再ビルドと全配備を行います。

詳細：[独自ドメインでブログを公開する](https://demo.anglefeint.com/ja/blog/starter-guide-deployment/)。

## ライセンス

このテーマは [MIT License](LICENSE) で公開しています。

## プレビュー

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### 共有プレビュー

![Anglefeint 既定共有画像](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### ページスクリーンショット

| ホーム                                                         | ブログ一覧                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · リスト表示                                                          |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| 記事ページ                                                               |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| ブログのページ分割                                                                   | 関連記事                                                                |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| ![ブログのページ分割](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![関連記事](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · サイファーパンク資料                                                   |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
