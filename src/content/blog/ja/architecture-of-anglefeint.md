---
title: 'Anglefeint のアーキテクチャ設計: なぜ四層構成なのか'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'Anglefeint の設計を四層で分離した理由と、保守性への効果を解説します。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

Anglefeint は四つの役割を組み合わせます。

- ThemeFrame：文書、SEO、ナビゲーション、フッター、音楽の共通部分。
- Shell：ページ固有のスタイルと背景。
- Layout：本文、カバー、補助領域の配置。
- Page：コンテンツと設定を読み、ページを構成。

全ページが同じ四層を順番に入れ子にするという意味ではありません。共通構造で一貫性を保ち、各ページがデータと操作を受け持ちます。

標準ルート、既定値、実装は `@anglefeint/astro-theme` が提供します。starter には記事、素材、`src/site.config.ts`、独自ページ、デプロイ設定を残します。テーマ更新のために標準ページをコピーする必要はありません。設定は一つの入口に、記事と Fragments は各コンテンツディレクトリに置きます。

続けて読む: [ルート別ビジュアル設計](/ja/blog/route-visual-system-design/) · [設定リファレンス：サイト名、ドメイン、共通ナビゲーション、ソーシャル、フッター](/ja/blog/config-site-chrome/)
