<h1 align="center">Anglefeint</h1>
<p align="center">映画的な表現と複数の雰囲気を持つ Astro テーマです。</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">デモ</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">リポジトリ</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md">テーマ掲載文案</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.2-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## テンプレートの導入

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

pnpm を使う場合は、上の npm コマンドでテンプレートを作成し（依存関係のインストールはスキップ）、生成されたプロジェクトに移動して実行します:

```bash
pnpm install
```

## 動作要件

- Node.js `22.12.0+`（LTS 推奨）
- 0.8.0 starter の記載コマンドは Linux 上の npm + Node 22、pnpm 10 + Node 24 で検証済みです。yarn/bun は未検証です。[検証記録](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.8.0.md)を参照してください。

## クイックスタート

```bash
npm install
npm run dev
```

ビルドとプレビュー:

```bash
npm run build
npm run preview
```

品質チェック:

```bash
npm run doctor
npm run check
```

`pnpm` を使う場合:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## テーマのアップグレード

`#starter` から作成したプロジェクトでは、対象リリースが既存の starter と Astro に対応し、ローカル構成の移行が不要な場合にのみ実行します:

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update` は `package.json` の範囲内で更新します。`^0.5.1` に `0.6.0` は含まれません。互換性のある範囲外の更新では、リリースノートに従って対象バージョンを明示し、無条件に `@latest` を使わないでください。`npm ls @anglefeint/astro-theme astro` で実際のバージョンを確認できます。

現在の starter では `doctor` にチェックとビルドが含まれます。成功後、`npm run preview` でサイトを確認してください。生成アダプターとローカルテンプレートの不一致が報告された場合に限り、`npm run sync-adapters` を実行し、`npm run doctor` を再実行します。上流のテンプレートは取得しません。旧プロジェクトではスクリプトが異なる場合があるため、ローカルの `package.json` と更新ガイドを確認してください。

リリースノートに starter の構成変更がある場合は、新しいディレクトリに最新テンプレートを作成し、記事・画像・個人設定を移してください。新しい設定補助ファイルを古いファイルで上書きしないでください。`npm update` はパッケージのみを更新し、すべての旧 starter の直接更新は保証しません。[アップグレードガイド](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)を参照してください。

カスタムコードが `src/consts` または `@anglefeint/astro-theme/consts` を参照している場合は、`src/config/site.ts` へ移行してください。

Astro のメジャーアップグレードは、まず公式ガイドを参照してください:

- https://docs.astro.build/en/guides/upgrade-to/
- その後、上記の更新ガイドの検証チェックリストに従ってください。

## 新しい記事を作成

設定で有効になっているロケールに同じ slug の記事を一括作成します:

```bash
npm run new-post -- my-first-post
```

Slug ルール: 小文字英字・数字・ハイフンのみを使用してください（例: `my-first-post`）。
`src/assets/blog/default-covers/` に画像がある場合、slug ハッシュで安定したデフォルトカバーを自動設定します（後で `heroImage` を手動変更可能）。
ロケールを明示指定する場合:

```bash
npm run new-post -- my-first-post --locales en,fr
# または
ANGLEFEINT_LOCALES=en,fr npm run new-post -- my-first-post
```

`ANGLEFEINT_LOCALES=...` は Bash/POSIX シェル用の構文です。PowerShell では上の `--locales` コマンドを使ってください。

URL のルール:

- ファイル: `src/content/blog/ja/my-first-post.md`
- URL: `/ja/blog/my-first-post/`
- ブログ一覧: `/ja/blog/`
- ルートを手動で追加する必要はありません。Astro が build 時に自動生成します。

`--locales` は記事ファイルだけを作成し、言語を有効化しません。ルートを生成するには `src/site.config.ts` で対象言語を追加・有効化してください。

## 新しいページを作成

`new-post` はブログ記事専用です。カスタムページは次のコマンドを使用します:

```bash
npm run new-page -- projects --theme base
```

利用可能なテーマ: `base`, `ai`, `cyber`, `hacker`, `matrix`。  
`src/pages/[lang]/projects.astro` が生成され、`getStaticPaths()` で全ロケールに展開されます。
slug ルール: 小文字・数字・ハイフンのみ（例: `projects/labs` のようなネストは可）。`_` と大文字は不可です。

例（`projects` 用に 1 つだけ選んでください。続けて実行すると、2 回目以降はファイルが存在するため失敗します）:

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## 言語

[English](README.md) · [简体中文](README.zh-CN.md) · 日本語（このファイル） · [Español](README.es.md) · [한국어](README.ko.md)

## プレビュー

| ホーム                                                         | ブログ一覧                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| 記事ページ                                                                    |
| ----------------------------------------------------------------------------- |
| ![Blog post preview](public/images/theme-previews/preview-blog-post-open.png) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## ルートごとの雰囲気

- `/<default-locale>/`（デフォルトでは `/` がここへリダイレクト）：Matrix 風ターミナルのホーム
- `/:lang/blog`：サイバーパンク調のアーカイブ
- `/:lang/blog/[slug]`：AI インターフェース風の読書レイアウト
- `/:lang/about`：任意で有効化できるハッカー風 About ページ

## テーマ命名ルール

- テーマ引数: `base`, `ai`, `cyber`, `hacker`, `matrix`
- 内部セレクタ/スクリプト接頭辞: `ai-*`, `cyber-*`, `hacker-*`
- 構成レイヤー: `ThemeFrame -> Shell -> Layout -> Page`

## 主な機能

- 現在の言語の記事を検索する Pagefind 全文検索
- 自動生成の記事目次と静的タグ一覧
- コードのコピーと本文画像のプレビュー
- Astro 7 の静的出力
- Markdown + MDX コンテンツコレクション
- スターター同梱のサンプルロケール: `en`, `ja`, `ko`, `es`, `zh`
- ロケール別 RSS
- Sitemap + robots 対応
- 設定駆動のカスタマイズ
- 短いページでもフッターを下部に固定

## テーマ設定

1. 環境変数でサイト情報を上書きする場合のみ `.env.example` を `.env` にコピーします。それ以外は `src/site.config.ts` を使います。
2. `src/site.config.ts` を編集:
   - `site.title`、`site.description`、`site.url`、`site.author`、`site.tagline`: サイト identity と既定メタデータ
   - `i18n.defaultLocale`: 既定ロケールを設定
   - `i18n.routing.defaultLocalePrefix`: 既定ロケールを `/<default-locale>/`（デフォルト）に置くか `/` に置くかを設定
   - `i18n.locales`: 単一の設定源として対応ロケールを追加・削除
   - `i18n.locales.<code>.messages`: ロケール別 UI 文言の上書き
   - `i18n.locales.<code>.meta.label`: 言語メニューの表示名（`zh` の既定値は `简体中文`）。変更しても URL は変わりません
   - `i18n.locales.<code>.site.hero`: ロケール別ホーム hero 文言の上書き
   - `social.links`: SNS リンク
   - `i18n.locales.<code>.about`: ロケール別 About コンテンツとランタイム文言
   - `theme.enableAboutPage`: About の表示切り替え
   - `theme.effects.enableRedQueen`: 記事ページのサイドモニター演出をオン/オフ
   - `theme.comments`: Giscus を有効化・設定（コア ID + 動作パラメータ）
3. `src/content/blog/<locale>/` のサンプル記事を差し替え。

### 任意: Giscus コメント

コメントはデフォルトで無効です。有効化するには:

1. `src/site.config.ts` で `theme.comments.enabled = true` を設定。
2. 必須項目を設定:
   - `theme.comments.repo`
   - `theme.comments.repoId`
   - `theme.comments.category`
   - `theme.comments.categoryId`
3. 任意項目:
   - `theme.comments.mapping`
   - `theme.comments.term`（`mapping = "specific"` のとき必須）
   - `theme.comments.number`（`mapping = "number"` のとき必須）
   - `theme.comments.strict`
   - `theme.comments.reactionsEnabled`
   - `theme.comments.emitMetadata`
   - `theme.comments.inputPosition`（`top` または `bottom`）
   - `theme.comments.theme`
   - `theme.comments.lang`
   - `theme.comments.loading`
   - `theme.comments.crossorigin`

コア ID が不足するとコメントは表示されません。コメント有効時に `mapping="specific"` の `term` が空、または `mapping="number"` の `number` が正の整数文字列でない場合、設定エラーで開発・ビルドが停止することがあります。

CLI はマージ後の設定で有効な言語を使用します。設定エラーでは生成を停止し、明示的な `--locales` または `ANGLEFEINT_LOCALES` は設定読み込みを省略します。

## 設定ポイント

- 単一エントリ: `src/site.config.ts`
- ホームの説明は解決済み `messages.siteDescription`（内蔵・フォールバック言語を含む）を優先し、空の場合のみ `site.description` を使います。
- 言語設定は既定値と深くマージされます。無効化には `i18n.locales.<code>.meta.enabled = false` を指定します。既定言語は常に有効です。
- アダプタ層（直接編集は非推奨）: `src/config/site.ts`, `src/config/theme.ts`, `src/config/about.ts`, `src/config/social.ts`
- サイト情報は `PUBLIC_*` 環境変数でも上書き可能

## ドキュメント

- [アーキテクチャ](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)
- [ビジュアルシステム](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/VISUAL_SYSTEMS.md)
- [提出チェックリスト](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/THEME_SUBMISSION_CHECKLIST.md)
- [テーマ掲載文案](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md)
- [アップグレードガイド](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)
- [変更履歴](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CHANGELOG.md)

## 記事検索

検索は既定で有効です。ヘッダーから現在の言語の記事タイトルと本文を検索できます。`npm run build` が索引を自動生成し、静的サイトと一緒に配信します。サーバーやアカウントは不要です。

`src/site.config.ts` の `theme.search.enabled: false` で検索と索引生成を無効化できます。記事の frontmatter に `search: false` を指定すると、その記事を除外します。ナビゲーション、目次、関連記事、コメント、装飾文は対象外です。

ローカル検索は `npm run build` の後、`npm run preview` で確認します。`npm run dev` は開発用の案内を表示します。記事更新後は再ビルドしてください。

## 記事の目次

記事ページでは Markdown の `##`、`###` 見出しから折りたたみ可能な目次を自動生成し、広い画面では本文の右側に追従し、狭い画面では本文の前に表示します。初期状態では展開します。該当する見出しがなければ表示しません。長い見出しは折り返し、番号は追加しません。

`src/site.config.ts` の `theme.toc.enabled` でサイトの既定値（初期値 `true`）を変更できます。記事の frontmatter に `toc: false` を指定すると非表示、`toc: true` を指定するとサイトの既定値が無効でも表示します。省略するとサイト設定を継承します。

MDX 内の Markdown 見出しに対応しますが、コンポーネントが生成する見出しや HTML/JSX の見出しは自動収集しません。独自の記事ルートでは `render(post)` の `headings` を `BlogPost` に渡してください。省略時は目次を表示しません。

## タグ一覧

記事の frontmatter に `tags: ["Astro", "フロントエンド"]` を追加すると、ビルド時に言語ごとのタグ一覧とページ分割された記事一覧が生成されます。タグのない記事はそのまま使えます。`src/site.config.ts` の `theme: { tags: { enabled: false } }` で無効化できます。大文字・小文字は区別し、前後の空白と重複は除去します。特殊な名前は安定した URL に符号化され、名前を変更すると URL も変わります。追加コマンドは不要です。

`/<locale>/tags/` に直接アクセスするか、ブログのタグリンクから開けます。記事のタグは `/<locale>/tags/<tagSlug>/` を開きます。その言語にタグがない場合、一覧は空になりブログのタグ入口は表示されません。

## コードのコピー

コードブロックの右上にコピーボタンが自動表示されます。通常の Markdown を使うだけで、設定は不要です。HTTPS または localhost が必要で、失敗時は手動コピーの案内を表示します。

## 本文画像のプレビュー

本文のリンクなし画像はクリックまたは Enter/Space で拡大できます。Esc、閉じるボタン、背景で閉じ、読書位置を維持します。リンク付き画像の動作は変わりません。

ブラウザーが選択済みの画像ソースを表示し、高解像度の原本を別途取得しません。記事のカバー画像とリンク・ボタン内の画像は対象外です。

## 記事の共有画像

この機能は 0.5.0 と対応する starter で利用できます。0.4.0 には含まれていません。

`npm run build` は `ogImage` 未指定の記事に、タイトル・著者・サイト名を含む 1200×630 PNG を自動生成します。`heroImage` は変更しません。記事の隣の画像は `ogImage: ./share.png`、public 内は `ogImage: /images/share.png` で指定できます。HTTPS URL も使えますが、可用性とキャッシュは提供元に依存します。ローカル画像がない場合はエラーになります。

`src/site.config.ts` の `theme: { socialImage: { enabled: false } }` で自動生成を停止できます。手動画像は常に優先され、それ以外は既存のカバーまたは既定画像に戻ります。変更後は再ビルド・デプロイしてください。生成先は `dist/_social/`、正確な URL は記事 HTML の `og:image` にあります。共有先のキャッシュは即時更新されない場合があります。

同梱フォントで標準の5言語に対応し、画像 API やブラウザー JS は不要です。長いタイトルは画像内のみ省略します。すべての絵文字や文字体系は保証しません。ビルド時間とインストール容量は増えますが、記事ページへのフォント追加配信はありません。

## ライセンス

MIT License。`LICENSE` を参照。

## 任意の音楽プレーヤー

既定では無効です。音声ファイルを `public/music/` に置き、次の設定を `src/site.config.ts` に追加します：

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

各曲に `title` と `src` を指定し、`artist` は任意です。HTTPS の音声 URL も利用できます。空のリストでは表示されません。再生を押して初めて音声を読み込みます。同じタブのセッション内で曲・再生位置・音量を保存しますが、ページ移動後は再生を押す必要があり、途切れない再生には対応しません。
