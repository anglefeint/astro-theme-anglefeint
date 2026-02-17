# Anglefeint

映画的な表現と複数の雰囲気を持つ Astro テーマです。

## 言語

- [English](README.md)
- [简体中文](README.zh-CN.md)
- 日本語（このファイル）
- [Español](README.es.md)
- [한국어](README.ko.md)

## デモ

- https://demo.anglefeint.com/

## 技術スタック

- Astro 5
- TypeScript
- Markdown + MDX コンテンツコレクション
- 静的サイト生成（SSG）
- Cloudflare Workers / Pages へデプロイ可能

## 動作要件

- Node.js 18+（LTS 推奨）
- パッケージマネージャー: npm / pnpm / yarn / bun

## ルート構成

- ホーム（`/`）: Matrix 風ターミナル
- ブログ一覧（`/:lang/blog`）: サイバーパンク風アーカイブ
- 記事ページ（`/:lang/blog/[slug]`）: AI インターフェース風レイアウト
- About（`/:lang/about`）: 任意で有効化できるハッカー風プロフィール

## 主な機能

- Astro 5 の静的出力
- Markdown + MDX 対応
- 組み込みロケール: `en`, `ja`, `ko`, `es`, `zh`
- ロケール別 RSS
- Sitemap + robots 対応
- 設定駆動（サイト情報、テーマ挙動、About、SNS リンク）
- 短いページでもフッターを下部に固定

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

## テーマ設定

1. `.env.example` を `.env` にコピーし、サイト情報を設定。
2. `src/config/social.ts` で SNS リンクを更新。
3. `src/config/about.ts` で About の文言を編集。
4. `src/config/theme.ts` の `ENABLE_ABOUT_PAGE` で About の有効/無効を切替。
5. `src/content/blog/<locale>/` のサンプル記事を差し替え。

## ライセンス

MIT License。`LICENSE` を参照。
