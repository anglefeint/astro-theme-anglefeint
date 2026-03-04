---
title: 'Anglefeint のアーキテクチャ設計: なぜ四層構成なのか'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'Anglefeint の設計を四層で分離した理由と、保守性への効果を解説します。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 168
aiConfidence: 0.96
wordCount: 760
tokenCount: 1180
---

このテーマでは、見た目より先に構造を決めました。理由は明確で、構造が曖昧だと改修コストが急増するからです。

Anglefeint は次の四層で構成されています。

- ThemeFrame: 共通フレームと全体の土台
- Shell: ルートごとの雰囲気を担う層
- Layout: ページ構造の組み立て
- Page: コンテンツとルーティングデータ

この分離により、ビジュアル変更とコンテンツ変更を独立して進められます。

実装は @anglefeint/astro-theme に集約し、starter はコンテンツと設定を中心に保ちます。これにより、更新はパッケージ経由で扱いやすくなります。

利用者向け設定は site.config.ts を中心に整理しています。入口を一つにすることで、導入と運用の負担を下げています。
