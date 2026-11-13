---
tags: ['anglefeint', 'starter']
title: 'ユーザーガイド3：記事と Fragments に画像を追加する'
subtitle: '原画像を置き、正しいパスを記入し、レスポンシブ画像を準備してカバーと共有画像を設定します。'
description: '本文、カバー、Fragments、共有画像の処理の違いと、画像の準備、Git コミット、配備時の問題の調べ方を説明します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

入門ガイドの第3 / 8回です。[全ガイドの順序](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order) · [設定リファレンス](/ja/blog/config-reference/)。

複数サイズを手作業で作成したり、記事のリンクを生成ファイル名に書き換えたりする必要はありません。元画像を置き、記事や Fragment から参照すると、ローカル開発サーバーが必要なレスポンシブ画像を準備します。

この記事は starter 既定の `src/` と `public/` を前提に説明します。最初に画像の用途を区別してください。

| 用途            | 記入先                                         | 現在の処理                                                                       |
| --------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| 記事本文        | Markdown 画像または MDX の画像                 | 既存の Markdown／MDX 画像処理を使い、以下の永続カバー生成の対象外です。          |
| 記事カバー      | frontmatter の `heroImage`                     | ローカルでレスポンシブ画像を生成し、一覧と記事詳細で共有します。                 |
| Fragment の画像 | 本文の Markdown 画像、参照形式画像、HTML `img` | 対応するローカル画像は同じ永続レスポンシブ処理を使い、一覧とホームで共有します。 |
| 共有プレビュー  | 記事の `ogImage`、サイトの `site.ogImage`      | 独立した共有画像の処理で、カバーのサムネイルとは異なります。                     |

## 1. 原画像をプロジェクトに置く

1記事だけで使う画像は、記事の隣に置けます。

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

Fragments も同様に Markdown の隣へ画像を置けます。複数ページで使う画像は `public/images/` に置けます。

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

ディレクトリがなければ作成してください。ファイル名は簡単な英字、数字、ハイフンを推奨し、大文字小文字の混同を避けます。URL には `/` を使い、PC 上の `C:\...`、`D:\...` やバックスラッシュ区切りのパスは使いません。大文字小文字を区別する配備環境では `Photo.jpg` と `photo.jpg` は別ファイルになります。

元画像は必ず保存してください。生成する WebP は表示用の派生ファイルであり、元画像のバックアップではありません。

## 2. 記事本文に画像を入れる

記事の Markdown を開き、表示したい位置に記入します。

```md
![这张照片里有什么](./photo.jpg)
```

`./photo.jpg` は現在の記事からの相対パスで、上の例では同じディレクトリの画像を指します。public のファイルを使う場合は次のようにします。

```md
![这张照片里有什么](/images/shared-photo.jpg)
```

これは `public/images/shared-photo.jpg` に対応し、URL に `public` を含めません。角括弧内は代替テキストで、「画像」だけでなく実際の内容を説明しましょう。

通常の本文画像はクリック、またはフォーカス後 Enter／スペースで拡大し、Esc・閉じるボタン・背景で閉じます。カバーとリンク・ボタン内の画像は対象外です。ブラウザーが選択した画像ソースを使い、高解像度の原画像を自動取得せず、アルバム切り替えもありません。

`prepare-covers` を実行しても、すべての本文画像が圧縮されるわけではありません。対象はカバー素材プール、記事カバー参照、Fragment のローカル画像です。通常の本文中の public 画像は元ファイルを直接取得する場合があるため、表示に適した容量を選び、特に数 MB のスクリーンショットをそのまま置くことは避けましょう。

## 3. 記事カバーを設定する

記事の隣に `cover.jpg` を置き、既存 frontmatter に追加または変更します。

```yaml
heroImage: ./cover.jpg
```

`heroImage` は省略できます。使う場合はプロジェクト内のローカル画像を参照し、HTTPS の画像 URL は直接指定できません。`/images/cover.jpg` のような public URL としても指定しないでください。本文画像とはパスの規則が異なります。

新しいカバーをまとめるなら `src/assets/blog/covers/originals/` に置けます。記事が `src/content/blog/zh/my-first-post.md`、元画像が `src/assets/blog/covers/originals/my-cover.jpg` なら次のようにします。

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

カバーは本文へ自動挿入しません。ブログ・タグ一覧と記事詳細のカバー領域に使います。レイアウトにより表示範囲を切り取ることはありますが、生成画像自体は元の比率を保ち、人物や被写体の焦点を自動選択しません。

`new-post` の自動カバー選択は `src/assets/blog/default-covers/` のみが対象です。`covers/originals/` に置くだけで選ばれるわけではなく、新しい originals は記事から自分で参照します。

## 4. Fragment に画像を追加する

`theme.fragments.enabled: false` の間、dev、build、prepare-covers／doctor は Fragment 本文の画像参照を読みません。その参照だけで処理対象になる画像は原画像や派生ファイルを要求しません。ただし記事カバーの参照と `src/assets/blog/default-covers/`、`src/assets/blog/covers/originals/` の画像プールは、Fragment 専用画像でも準備・検証します。ファイルは削除せず、再有効化すると Fragment 画像処理を再開します。

**バージョンについて：** 無効時の画像分離は 0.36.1 以降で提供し、0.36.0 には含まれません。旧版で使えるとは考えないでください。

元画像を `public/images/fragments/my-photo.png` に置き、既存 Fragment の Markdown 本文に記入します。

```md
![这条碎片的配图说明](/images/fragments/my-photo.png)
```

`photo.png` を Fragment の隣に置き、`![配图说明](./photo.png)` で参照することもできます。public に置くだけでは汎用画像庫のスキャンは発生せず、実際の Fragment から参照する必要があります。

参照形式の画像にも対応します。

```md
![配图说明][photo]

[photo]: /images/fragments/my-photo.png
```

サイズを自分で指定する場合は HTML を使えます。

```html
<img src="/images/fragments/my-photo.png" alt="配图说明" width="640" height="360" />
```

幅と高さは例なので、実画像の比率に合わせてください。対応するローカル画像では不足する幅・高さを補います。既存サイズは維持し、片方だけなら原画像の比率でもう片方を求めます。間違った指定済みサイズは自動修正しません。

Fragments 一覧の各ページの最初の画像は既定で優先ロードし、ほかの画像とホームのサムネイルは遅延ロードします。ホームは高さ制限付きのプレビューで超過部分を切り取り、画像ビューアーではありません。カードから元の Fragment に移動します。作成、安定した ID、コメント設定は[Fragment の投稿](/ja/blog/starter-guide-5-fragments/)を参照してください。

## 5. ローカルでレスポンシブ画像を準備する

画像を初めて参照したり差し替えたりしたら、プロジェクトルートで開発サーバーを起動します。

```bash
npm run dev
```

dev は不足・期限切れのファイルを生成し、関連ソースや参照の変更でも更新します。ローカルの `npm run doctor` も生成してから検証・ビルドします。ページ起動や全体チェックなしで画像だけを準備するなら、dev を止めて次を実行できます。

```bash
npx @anglefeint/astro-theme prepare-covers
```

補完せず既存ファイルだけを検査するには次を使います。

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

毎回すべてを再エンコードする必要はありません。元画像、処理規則、出力のハッシュで再利用を判断し、元画像が変われば派生ファイルを更新し、1つの不足や変更なら必要箇所だけを修復します。マニフェストや生成ファイル名を手で変えたり、生成 URL を記事へ書き戻したりしないでください。

現在の準備規則は次のとおりです。

- 静止ラスター画像は品質80の WebP を生成します。非可逆エンコードの設定であり、ピクセル単位の無損失を保証しません。
- 候補幅は400、640、800、960、1200pxです。元の幅に合う候補を残し、必要なら1200px以下の元幅を加え、小さい画像は拡大しません。
- EXIF の向きを補正し、元の比率を維持します。別の構図で切り抜いた画像は作りません。
- SVG と複数フレームのアニメーションは元形式を維持し、静止 WebP にはしません。単一フレームの GIF は静止画像として処理できるため、拡張子だけでは判断しません。
- 既定カバープール、originals プール、実際の参照で対象を決め、public の画像をすべて変換するわけではありません。

ブラウザーは `srcset`、`sizes`、画面、ピクセル密度から候補を選びます。ユーザーが複数サイズのディレクトリを管理する必要はありません。最大候補は1200pxなので、大画面・高密度で常に元画像相当の細部を保証するものではありません。

## 6. コミットするファイルと配備での扱い

準備したファイルは次の場所にあります。

```text
src/assets/blog/covers/
  originals/      # 如果使用这个原图目录
  manifest.json  # 来源、尺寸、规则与输出哈希
  generated/     # 持久响应式文件
```

次の内容をまとめて Git にコミットします。

1. 記事または Fragment の Markdown と、新規・差し替え元画像。
2. マニフェストと生成ファイルを含む `src/assets/blog/covers/` 全体。

元画像が public や記事の隣にある場合は、そのファイルもコミットし、originals だけで済ませないでください。ディレクトリ名が blog/covers でも、Fragments の派生画像は同じ場所に保存されます。

公開前に dev を停止し、ローカルで `npm run doctor` を実行します。成功後は `npm run preview` でビルド結果を確認できます。doctor はビルドを含み、直後の build は不要です。ホスティング側は `npm run build`、出力 `dist` で、その全ファイルを配備します。

**配備ビルドは準備済みレスポンシブ画像の検証・コピーだけを行い、プラットフォームで補完生成しません。** CI の doctor も検証のみです。不足・期限切れ・変更があれば失敗するため、ローカルで準備してコミットし直してから再配備します。この永続画像処理は Astro の画像キャッシュが配備先に残ることに依存しません。

現在使用する派生ファイルは出力の `_blog-covers/` へコピーします。HTML だけをアップロードしたりこのディレクトリを漏らしたりしないでください。旧版や未使用の generated は自動削除されません。整理前に参照を確認し、必要な元画像を消さないようにします。

画像項目の違いは[記事の heroImage／ogImage](/ja/blog/config-article/#frontmatter)と[Fragment のプレビュー規則](/ja/blog/config-fragments/#preview-and-links)を参照してください。

## 7. 共有リンクではどの画像が表示される？

共有画像はリンクカードのプレビューで、ページ内カバーとは異なります。

既定では記事タイトル、著者、サイト名を含む1200×630 PNGをビルド時に生成し、画像サービスやブラウザーでの生成は不要です。情報を変えたら再ビルド・再配備します。`theme.footer.showCredits` は自動共有画像のテーマ表記も制御しますが、自分でアップロードした画像は変えません。

### 記事専用の共有画像を指定する

記事の隣に `share.png` を置き、frontmatter に指定します。

```yaml
ogImage: ./share.png
```

`public/images/share.png` に置いて `ogImage: /images/share.png` を使うこともできます。HTTPS の画像直リンクにも対応します。相対ローカル画像は記事の画像 schema で処理し、public パスはファイルの存在を確認します。外部画像の可用性は相手サーバーによります。

### 専用画像のないページに既定画像を設定する

`src/site.config.ts` の既存の最上位 `site` に統合します。

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

先に `public/images/site-share.jpg` を置きます。`site.ogImage` は HTTPS の画像 URL も使え、省略・空ならテーマ内蔵の1200×630既定画像を使います。記事からの相対パスは使えません。

現在の優先順位は次のとおりです。

1. 記事に明示指定した `ogImage`。
2. 自動生成が有効な記事の共有画像。
3. `theme.socialImage.enabled` を無効にした場合の記事 `heroImage`。
4. 専用画像がないページの `site.ogImage`、最後にテーマ内蔵既定画像。

したがって `site.ogImage` だけを変えても記事の自動共有画像は置き換わりません。Fragments ページと各 `#ID` リンクはサイト既定共有画像を共用し、各 Fragment 専用のカードは生成しません。

自動共有画像は `dist/_social/` にあります。共有サービスは配備済みページのメタ情報を取得し、旧画像をキャッシュする場合があります。ローカルで新画像が見えても、サービスのプレビューが即時更新されるとは限りません。

## 8. 画像がおかしいときの確認

| 症状                                       | 最初に確認すること                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 画像が表示されない                         | ファイルの存在、大文字小文字、現在の Markdown 基準の相対パス。public URL に `public` を入れないこと。   |
| カバーの準備に失敗する                     | `heroImage` がプロジェクト内のローカル画像か、外部・public URL を誤指定していないか。詳細はターミナル。 |
| missing／stale／modified derivatives       | dev を止め、ローカル prepare-covers を実行し、元画像・マニフェスト・generated をコミットして再ビルド。  |
| public に置いてもサイズが生成されない      | Fragment 本文から実際に参照されているか。通常の記事本文の public 画像は派生スキャン対象外。             |
| GIF・SVG が大きいまま                      | 複数フレーム・ベクターは原形式を維持し、動画化やアニメーション圧縮は行わない。                          |
| 外部 Fragment 画像が遅い・レイアウトが動く | 外部はローカル変換対象外でサイズを自動推定できないため、元画像を最適化して正しい幅・高さを指定。        |
| ローカルでは見えるが公開後は見えない       | 元画像と generated のコミット、dist 全体の配備、リソースパスの書き換え有無。                            |
| 共有画像が古い                             | 再ビルド・再配備、記事専用画像の優先、共有サービスのキャッシュ。                                        |

Astro の srcDir、publicDir、base 付きのソースパスを変更した場合、その設定下の dev で準備してください。独立 prepare-covers は既定ディレクトリを使います。画像処理の一部 base 対応は、テーマ全体が任意のサブディレクトリ配備に対応するという意味ではありません。

インストール・更新は[ブログをインストールして自分の情報に変える](/ja/blog/starter-guide-1-configure-your-site/)、記事項目や本文の記法は[最初の記事を書く](/ja/blog/starter-guide-2-languages-and-routing/)を参照してください。

## ガイドと設定リファレンス

[前の記事：最初の記事を書く](/ja/blog/starter-guide-2-languages-and-routing/) · [次の記事：Fragment を投稿する](/ja/blog/starter-guide-5-fragments/) · [8本のガイドの総合案内](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order)。

関連項目：[記事カバーと共有画像](/ja/blog/config-article/)、[Fragment の画像プレビュー](/ja/blog/config-fragments/)、[サイト既定共有画像](/ja/blog/config-site-chrome/)。完全なパス、既定値、制約は[設定リファレンス総合案内](/ja/blog/config-reference/)を参照してください。
