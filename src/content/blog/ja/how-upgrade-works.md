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

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update` は `package.json` の範囲内で更新します。`^0.5.1` に `0.6.0` は含まれません。互換性のある範囲外の更新では、リリースノートに従って対象バージョンを明示し、無条件に `@latest` を使わないでください。`npm ls @anglefeint/astro-theme astro` で実際のバージョンを確認できます。

現在の starter では `doctor` にチェックとビルドが含まれます。成功後、`npm run preview` でサイトを確認してください。生成アダプターとローカルテンプレートの不一致が報告された場合に限り、`npm run sync-adapters` を実行し、`npm run doctor` を再実行します。上流のテンプレートは取得しません。旧プロジェクトではスクリプトが異なる場合があるため、ローカルの `package.json` と更新ガイドを確認してください。

コア更新をパッケージ中心で扱えるため、運用が安定します。

Astro のメジャー更新時は、まず公式移行ガイドを確認し、その後このプロジェクトで検証コマンドを実行してください。
