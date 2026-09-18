---
title: 'ルート別ビジュアル設計'
subtitle: 'ページごとに雰囲気を分ける'
description: 'Anglefeint が読書導線に合わせてビジュアルを分ける設計方針を説明します。'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 171
aiConfidence: 0.95
wordCount: 700
tokenCount: 1080
---

多くのブログテーマは全ページで同じ見た目を使います。Anglefeint はルートごとに雰囲気を切り替えます。

- `/<locale>/` : Matrix 風の導入
- `/<locale>/blog/` : cyber 風の一覧体験
- `/<locale>/blog/<slug>/` : AI 風の読書画面
- `/<locale>/about/` : hacker 風プロフィール

既定の `i18n.routing.defaultLocalePrefix: 'always'` では、`/` は既定言語のホーム（初期値は `/en/`）へ移動します。`'never'` では既定言語のホームだけが `/` になり、ブログと About は言語プレフィックスを維持します。About には `theme.enableAboutPage: true` が必要です。タグが有効な場合、`/<locale>/tags/` とタグの結果ページも Cyber の雰囲気を共有します。

原則は背景は読む体験を支えるです。

ホームは第一印象、一覧は探索、記事は本文集中、About は補足情報というように、各ルートの目的を分けています。

この設計により、強いテーマ性を保ちながら、情報の優先順位を崩さない構成になります。
