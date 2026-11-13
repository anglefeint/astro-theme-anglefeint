---
title: 'ブログを AI が読めるようにした理由'
subtitle: 'GEO と、人間とエージェントが共存する未来のために'
description: 'GEO、人間とエージェントの共存、自動生成される Markdown から説明する AI 閲覧対応。'
pubDate: '2026-11-04'
heroImage: '../../../assets/blog/default-covers/ai-03.webp'
tags: ['AI', 'GEO', 'Anglefeint']
updatedDate: '2026-11-14'
---

人が直接読むだけでなく、Agent も探し、理解し、引用できるブログにしたいと考えています。機械可読の入口に本文と元の URL を残し、引用からページへ戻れるようにします。

Anglefeint はビルド時に公開ページから `llms.txt`、言語別索引、全文集、記事 Markdown を生成します。有効で出力条件を満たす About と Fragments も対応する出力に含めます。本文を二重管理する必要はありません。

発見や GEO の基盤ですが、検索エンジンの登録、順位、引用を保証しません。公開情報の出力なので、秘密を公開記事や設定の補足へ書かないでください。

続けて読む: [設定リファレンス：GA4 アクセス解析と AI 向け補足説明](/ja/blog/config-analytics-ai/)
