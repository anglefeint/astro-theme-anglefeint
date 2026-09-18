---
title: 'アップグレードモデル: starter 初期化 + npm 更新'
subtitle: '初期化と更新の経路を一本化する'
description: 'Anglefeint の推奨初期化・更新フローをまとめます。'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 165
aiConfidence: 0.97
wordCount: 690
tokenCount: 1040
---

テーマ運用でよくある課題は、初期化は簡単でも更新が難しいことです。Anglefeint では経路を統一します。

初期化:

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

互換性のあるパッケージのみの更新:

`npm update` はテーマパッケージを更新しますが、ローカルの設定、ルート、アダプター、Astro 統合は書き換えません。リリースノートで構成変更が必要とされる場合は、別のディレクトリに最新 starter を作成し、記事と個人設定を移してください。新しい設定補助ファイルを古いもので上書きしないでください。[更新ガイド](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)を参照してください。

`npm update` は `package.json` のバージョン範囲内で更新します。例えば `^0.6.0` に `0.7.0` は含まれません。範囲を変更する前にリリースノートと更新ガイドを確認してください。範囲を変更してもローカルの starter ファイルは更新されません。

```bash
npm update @anglefeint/astro-theme
npm install
npm run check
npm run build
```

コア更新をパッケージ中心で扱えるため、運用が安定します。

Astro のメジャー更新時は、まず公式移行ガイドを確認し、その後このプロジェクトで検証コマンドを実行してください。
