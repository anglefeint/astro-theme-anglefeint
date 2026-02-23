<h1 align="center">Anglefeint</h1>
<p align="center">映画的な表現と複数の雰囲気を持つ Astro テーマです。</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">デモ</a>
  ·
  <a href="https://github.com/voidtem/astro-theme-anglefeint">リポジトリ</a>
  ·
  <a href="ASTRO_THEME_LISTING.md">テーマ掲載文案</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## テンプレートの導入

```bash
npm create astro@latest -- --template voidtem/astro-theme-anglefeint
```

`pnpm` を使う場合:

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint
```

## 言語

[English](README.md) · [简体中文](README.zh-CN.md) · 日本語（このファイル） · [Español](README.es.md) · [한국어](README.ko.md)

## プレビュー

| ホーム | ブログ一覧 |
| --- | --- |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| 記事ページ（展開） | 記事ページ（折りたたみ） |
| --- | --- |
| ![Blog post open preview](public/images/theme-previews/preview-blog-post-open.png) | ![Blog post collapsed preview](public/images/theme-previews/preview-blog-post-collapsed.png) |

| About |
| --- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## ルートごとの雰囲気

- `/`：Matrix 風ターミナルのホーム
- `/:lang/blog`：サイバーパンク調のアーカイブ
- `/:lang/blog/[slug]`：AI インターフェース風の読書レイアウト
- `/:lang/about`：任意で有効化できるハッカー風 About ページ

## 主な機能

- Astro 5 の静的出力
- Markdown + MDX コンテンツコレクション
- 組み込みロケール: `en`, `ja`, `ko`, `es`, `zh`
- ロケール別 RSS
- Sitemap + robots 対応
- 設定駆動のカスタマイズ
- 短いページでもフッターを下部に固定

## 動作要件

- Node.js `18+`（LTS 推奨）
- パッケージマネージャー: `npm` / `pnpm` / `yarn` / `bun`

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

`pnpm` を使う場合:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 新しい記事を作成

全ロケール（`en`, `ja`, `ko`, `es`, `zh`）に同じ slug の記事を一括作成します:

```bash
npm run new-post -- my-first-post
```

Slug ルール: 小文字英字・数字・ハイフンのみを使用してください（例: `my-first-post`）。

## 新しいページを作成

`new-post` はブログ記事専用です。カスタムページは次のコマンドを使用します:

```bash
npm run new-page -- projects --theme base
```

利用可能なテーマ: `base`, `br`, `mesh`, `term`, `matrix`。  
`src/pages/[lang]/projects.astro` が生成され、`getStaticPaths()` で全ロケールに展開されます。

## テーマ設定

1. `.env.example` を `.env` にコピーし、サイト情報を設定。
2. `src/config/social.ts` で SNS リンクを更新。
3. `src/config/about.ts` で About コンテンツを編集。
4. `src/config/theme.ts` の `ENABLE_ABOUT_PAGE` で About の表示を切り替え。
5. `src/content/blog/<locale>/` のサンプル記事を差し替え。

## 設定ポイント

- サイト情報: `src/config/site.ts`（または `PUBLIC_*` 環境変数）
- テーマ挙動: `src/config/theme.ts`
- About コンテンツ: `src/config/about.ts`
- ソーシャルリンク: `src/config/social.ts`

## ドキュメント

- アーキテクチャ: `docs/ARCHITECTURE.md`
- ビジュアルシステム: `docs/VISUAL_SYSTEMS.md`
- 提出チェックリスト: `docs/THEME_SUBMISSION_CHECKLIST.md`
- テーマ掲載文案: `ASTRO_THEME_LISTING.md`
- アップグレードガイド: `UPGRADING.md`
- 変更履歴: `CHANGELOG.md`

## ライセンス

MIT License。`LICENSE` を参照。
