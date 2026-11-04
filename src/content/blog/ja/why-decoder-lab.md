---
title: 'Decoder Lab を作った理由'
subtitle: 'サイファーパンクへの敬意を、使える道具に'
description: '人類の自由とプライバシーへの貢献をたたえ、ローカルツールと変更可能な資料リンクを提供。'
pubDate: '2026-11-04'
heroImage: '../../../assets/blog/default-covers/hacker-02.webp'
tags: ['Cypherpunk', 'Decoder Lab', 'Anglefeint']
---

Decoder Lab を作った第一の理由は、人類に貢献したサイファーパンク（Cypherpunk）とデジタルの自由の先駆者への敬意です。その思想とコードは暗号通信、個人のプライバシーと自由、デジタル通貨を前進させ、情報を守り、自由に交流し、自律的に協力する道具を広めました。

その敬意を実用にもつなげるため、文字列のデコード、対応するトークン呼び出しの解析、アドレス形式の検査をブログに組み込み、ウォレット接続、API キー、RPC なしでブラウザー内で処理することで、テーマの端末やネットワークの表現とも結び付けています。

[Decoder Lab](/ja/decoder/) 下部の資料 URL はすべて変更でき、`src/site.config.ts` の `i18n.locales.<code>.messages.decoderPage.readings.links` で各項目の title と href を設定すると一覧全体を自分の推薦に置き換えられ、空配列なら非表示にできます。
