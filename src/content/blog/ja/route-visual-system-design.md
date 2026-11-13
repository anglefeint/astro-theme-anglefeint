---
title: 'ルート別ビジュアル設計'
subtitle: 'ページごとに雰囲気を分ける'
description: 'Anglefeint が読書導線に合わせてビジュアルを分ける設計方針を説明します。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

ページごとに読者の目的が異なるため、雰囲気を分けています。

- ホーム：第一印象を作る Matrix。
- Blog List とタグ：発見を支える Cyberpunk。
- 記事：長文を読む AI。
- About：著者とツールの Hacker。
- Fragments：Cyberpunk の閲覧空間。
- Decoder Lab：ローカル処理のツール画面とネットワーク背景。

既定ではホームにも言語プレフィックスが付き、`/` は既定言語のホーム、初期状態では `/en/` へ移動します。`defaultLocalePrefix: 'never'` が変えるのはそのホームだけで、ブログなどには言語プレフィックスが残ります。

About、Decoder、タグ、Fragments は個別のスイッチを持ち、Fragments は既定で無効です。詳細は辞典で確認できます。

続けて読む: [Anglefeint のアーキテクチャ設計: なぜ四層構成なのか](/ja/blog/architecture-of-anglefeint/) · [設定リファレンス：言語の有効化、URL、UI 翻訳、フォールバック](/ja/blog/config-languages/)
