---
tags: ['anglefeint', 'starter']
title: 'ユーザーガイド5：ページと機能を自分好みに変える'
subtitle: '変更したい場所から探す：ホーム、About、Decoder、ソーシャルリンク、フッター、音楽、ページ分割。'
description: '小さな設定変更でページと機能を調整し、実際の既定値、適用範囲、統合方法、ローカル確認手順を説明します。'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

入門ガイドの第5 / 8回です。[全ガイドの順序](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order) · [設定リファレンス](/ja/blog/config-reference/)。

ブログが起動できたら、変更したい場所から始められます。先に全設定を埋めたり、以下の例をすべてコピーしたりする必要はありません。

すべての TypeScript 断片は `src/site.config.ts` の既存 `defineThemeConfig({...})` に統合します。`theme`、`i18n`、`social` は各1個だけにし、同名の項目は直接編集して他設定を残します。オブジェクトは既定値にマージしますが、配列は全置換なので、リンク・曲・項目を追加するときは残したい内容も含めます。

これは操作目的別のよく使う設定であり、完全な項目辞書ではありません。変更したい領域の節を選んでください。

## 1. ホームの案内と効果を調整する

サイト名・ホームの大見出し・紹介文の違いは[インストールと個人情報の設定](/ja/blog/starter-guide-1-configure-your-site/)を参照してください。ここでは案内とインタラクションを調整します。

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| 項目                              | 既定値  | 変更する内容                                                                                                |
| --------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`  | Initialize／done の起動文面。false でその段落を隠します。                                                   |
| `theme.home.showFollow`           | `true`  | Wake Up／Follow の案内。false で独立して隠します。                                                          |
| `theme.home.showTrace`            | `true`  | 下部 PIRATE SIGNAL／TRACE 状態領域。false で隠します。                                                      |
| `theme.effects.enableHomePassage` | `false` | 有効時はホームの記事タイトルから約8秒の Matrix 演出後に移動します。動きを減らす場合は直接移動を維持します。 |

これらはページ全体のコード雨や全体配色を切り替える項目ではありません。`showTrace` も右下のワイド画面用ターミナルのスイッチではありません。

### ワイド画面のターミナル文面を変える

既定では `Knock, knock.` を表示します。個別指定のない言語で共用するには、まず英語の設定を変更できます。

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: 'Leave a small trace here.' } } },
  },
},
```

各言語専用なら、その言語の `messages.home.transmission` に設定します。優先順は現在の言語 → 英語 → `Knock, knock.` で、通常 UI の完全なフォールバックチェーンは使いません。ターミナルはワイド画面のレイアウトに現れるため、スマートフォンで見えなくても設定失敗ではありません。鍵穴ボタンを押すと廊下プレビューが開きます。

About の Oracle 入口は独立したシーンプレビューで、ホームの記事移動スイッチには従いません。ターミナルと下部の状態は雰囲気の演出で、実際の機器・ネットワーク・安全状態を示しません。

完全な定義は[ホームの設定リファレンス](/ja/blog/config-home/#startup-switches)を参照してください。

## 2. About を自分の紹介にする

日本語の例なら `/ja/about/` で内容を確認できます。本文と連絡先は言語別設定で変更でき、テーマのページテンプレートの編集は不要です。

```ts
i18n: {
  locales: {
    ja: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: '私は林です。開発と執筆が好きです。',
          what: 'プロジェクトと学習ノートをここに記録します。',
          ethos: ['好奇心を忘れずに。', 'アイデアを使えるものにします。'],
          now: '最近は個人ブログを整えています。',
          contactLead: 'お気軽にご連絡ください。',
          signature: '> お越しいただきありがとうございます。',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

例の名前と URL を変更します。`metaLine` は個人パネル上の状態文、`who`・`what`・`ethos`・`now` は自己紹介・活動・理念・近況、`contactLead` は連絡案内、`signature` は署名です。`ethos` は文字列配列で、新配列は全項目を置き換えます。

段落と署名はプレーンテキストです。文字列内の `\n` は改行、`\n\n` は空行になります。Markdown や HTML は解析せず、`<br>` は使わないでください。この例は日本語だけを変えます。他言語は自分で用意し、自動翻訳は行いません。欠けた項目はその言語のフォールバック規則で補います。

About のウィンドウ操作では閉じる・最小化・全画面にでき、状態をブラウザーに保存します。AI 出力やダウンロード進捗はテーマの演出で、文面を書いても実際の AI に接続しません。デコードツールはブラウザー内の入力を処理します。

不要なら `theme` の `enableAboutPage: false` で止めます。既定は `true` です。ルート、公共ナビゲーション、関連の連絡入口を隠しますが、本文やフッターに自分で書いたリンクは削除しないので確認してください。

本文の全項目は[About リファレンス](/ja/blog/config-about/#about-content)、コマンド案内と読み取り専用リーダーは[ターミナルリファレンス](/ja/blog/config-terminal/#messages)を参照してください。

## 3. Decoder と資料カードを調整する

Decoder Lab は日本語の例なら `/ja/decoder/` で、既定で有効です。サイファーパンクとデジタル自由の先駆者への敬意を表し、ローカル処理と P2P のイメージで、個人が道具とデータを掌握する理念を示します。

テキストのデコード、対応するトークン呼び出しの説明、アドレス形式の検査を行い、RPC、ウォレット接続、API Key は不要です。残高照会、取引実行、所有者の証明は行わず、calldata の入力は実コントラクト動作の検証ではありません。

`theme.enableDecoderPage: false` は Decoder とテーマ提供の入口を独立して無効にします。About の無効化と Decoder は互いに独立です。独自リンクは自分で管理してください。

敬意を示す文面と資料カードは言語別です。日本語の一覧を置き換える例です。

```ts
i18n: {
  locales: {
    ja: {
      messages: {
        decoderPage: {
          readings: {
            tribute: '思想とコードで、プライバシーと自由を一歩先へ。',
            links: [
              { title: '私の参考資料', href: 'https://example.com/', author: '著者名', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` で文面、`links: []` でカードを隠し、省略すれば既定内容を使います。各項目は `title`・`href` が必須で、`author`・`year`・`cover` は任意です。カバーは `privacy-code`・`bitcoin` などの内蔵名、public パス、HTTPS 画像 URL に対応し、省略すると画像なしカードになります。

`links` は全リストを置き換え、追加ではありません。旧項目を残すなら一緒に記入します。資料への入口を提供するだけで、相手記事の取得・転載や外部リソースの自動検証は行いません。

型、内蔵カバー、既定一覧は[Decoder リファレンス](/ja/blog/config-decoder/#readings)を参照してください。

## 4. ソーシャルリンクとフッターを調整する

アカウントは `social.links` に指定し、ヘッダーとフッターが同じ配列順を使います。独自アイコンなら先に `public/icons/community.svg` を置けます。

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: '私のコミュニティ', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` は public 内の SVG・PNG・WebP で、`/` 始まりのパスを使います。外部 URL、クエリ、フラグメント、エンコード文字は使えません。`icon` より優先し元の色を維持し、両方なければ文字を表示します。`label` はアクセシブルな名前です。ファイル不足や未対応の内蔵アイコン名は設定エラーになります。

任意の `rel` はリンク関係を指定します。たとえば自分の Mastodon に `rel: 'me'` を指定できます。`noopener noreferrer` は常に維持し、プラットフォームに応じた me の自動追加はしません。本人確認は相手サービスが行うため、サイト公開後に返しリンクのある実ページをプロフィールに設定します。テーマは結果を保証しません。

スマートフォン幅ではヘッダーのソーシャル入口を隠し、フッターには残します。`links: []` はクリック不可の3つの仮アイコンを残し、全領域を隠す設定ではありません。

### フッターのクレジット、説明、追加リンク

```ts
site: { tagline: '好奇心を持ち、記録を続ける。' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: 'プロジェクトのソースコード', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` は独自のプレーンテキストで空なら非表示、自動翻訳はしません。旧既定の `Built with Astro.` は内蔵クレジットとして扱い、重複表示を避けます。
- `theme.footer.showCredits` は既定 `true` でテーマ・Astro のクレジットを制御します。false でも著作権行、独自説明、追加リンクは残します。自動共有画像のテーマ表記も制御しますが、独自画像は変えません。
- `theme.footer.links` は既定で空配列。著作権とクレジットの間に表示し、ソーシャルアイコンとは独立します。ラベルは入力どおりで自動翻訳せず、showCredits にも従いません。

著作権の名称は全サイト名、年はビルド時に生成します。文面、クレジット、年の結果を変えたら再ビルド・再配備してください。

パス、リンク項目、クレジット規則は[ソーシャル項目](/ja/blog/config-site-chrome/#social-fields)と[フッター項目](/ja/blog/config-site-chrome/#footer)を参照してください。

## 5. 音楽プレーヤーを有効にする

自分の音声を `public/music/my-song.mp3` に置いて統合します。

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: '私の一曲', artist: '著者', src: '/music/my-song.mp3' }],
  },
},
```

音楽は既定で無効で、曲は付属しません。曲ごとに `title`・`src` が必須、`artist` は任意です。空リストはプレーヤーを表示しません。追加時は旧項目も残します。URL は public を含めず、PC パスやサービスの共有ページは不可です。HTTPS の音声直リンクは使えますが、空白・バックスラッシュは禁止です。空タイトルや形式不正はエラーですが、形式が正しくても実在・アクセスは保証しません。

共通テーマレイアウトのページに現れ、ページ別スイッチはありません。新ページでは初めは閉じています。初回は PLAY を押して音声を読み、曲の終了で次へ、最後の曲の終了で先頭へ戻ります。モバイルで展開中はトップへ戻るボタンを一時的に隠します。

同じタブのセッションで曲・再生位置・音量を記憶します。再生中なら移動・再読込後に再開を試み、手動停止後は停止を維持します。シームレス再生ではなく、自動再生をブラウザーが拒む場合もあります。保存不能でも手動再生はできますが、セッション継続は保存しません。

現在は曲全体をダウンロードして Blob に変換し、再生位置の変更にサーバーの Range 対応は不要です。大ファイルは待ち時間とメモリーを増やします。外部サーバーは CORS が必要で、同一サイト public は不要です。音声 URL を先に確認し、不要なら `theme.music.enabled: false` にします。

曲、状態文面、再開の制約は[音楽プレーヤーリファレンス](/ja/blog/config-music/#track-fields)を参照してください。

## 6. 一覧件数とページ分割を調整する

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` は既定3でホームの記事数、`blogPageSize` は既定10でブログ・タグ一覧の1ページの記事数です。適切な正整数を使います。ホームの最大3件の Fragment には影響せず、その一覧件数は `theme.fragments.pageSize` で指定します。

`windowSize` は既定7、描画時5–21のページ番号表示幅で、記事数ではありません。ページジャンプは `jump.enabled` が true で総ページ数が `showJumpThreshold` を超えたときに表示し、既定は12ページ超です。`enterToGo` は Enter での移動を制御します。

外観は既定 `random` で、例の `fixed` は変体を固定します。`sequential` は順序選択、`random` はクライアント初期化で再選択し、重複することもあります。JavaScript 無効でもビルド済み静的外観は残ります。`variants` は候補数で描画時1–12、`fixedVariant` はその範囲に制限します。

`style.enabled: false` は基本外観になり、ページ分割は止めません。ブログ・タグ・Fragments で共有するため、3か所の効果に注意してください。

完全な範囲、変体、UI 文面は[Blog List とタグ一覧リファレンス](/ja/blog/config-blog-list/#pagination-window)を参照してください。

## 7. 不要な機能だけを無効にする

以下はスイッチの適用範囲です。1機能の設定のために全項目を無効にしないでください。

| 設定パス                       | 既定値 | false にした場合                                                           |
| ------------------------------ | ------ | -------------------------------------------------------------------------- |
| `theme.enableAboutPage`        | `true` | About ルートとテーマ関連入口を非表示。                                     |
| `theme.enableDecoderPage`      | `true` | Decoder ルートとテーマ関連入口を非表示。                                   |
| `theme.effects.enableRedQueen` | `true` | 記事の Red Queen モニターのみを非表示にし、AI ページ全体の効果は止めない。 |
| `theme.search.enabled`         | `true` | 記事検索入口と索引生成を止める。                                           |
| `theme.toc.enabled`            | `true` | 既定の目次を止めるが、記事ごとの `toc: true` で上書き可能。                |
| `theme.tags.enabled`           | `true` | タグ入口・ページ生成を止め、記事は削除しない。                             |
| `theme.math.enabled`           | `true` | Markdown／MDX の数学処理を止める。                                         |
| `theme.socialImage.enabled`    | `true` | 自動共有画像を止めるが、手動 ogImage は有効。                              |

たとえば記事のモニターだけなら `theme: { effects: { enableRedQueen: false } }` を統合します。検索、音楽、About は変わりません。

コメントと Fragments は既定で無効で、他機能のために有効にする必要はありません。[Giscus 設定](/ja/blog/starter-guide-4-giscus-comments/)と[Fragment の投稿](/ja/blog/starter-guide-5-fragments/)を必要時に参照してください。目次・数式・共有画像は[記事ガイド](/ja/blog/starter-guide-2-languages-and-routing/)と[画像ガイド](/ja/blog/starter-guide-images/)に説明します。

## 8. 作品ページなどの独自ページを作る

プロジェクトを個別紹介するならルートで実行します。

```bash
npm run new-page -- projects
```

`src/pages/[lang]/projects.astro` を既定の `base` レイアウトで生成し、現在の有効言語に `/<locale>/projects/`（例：`/en/projects/`、`/zh/projects/`）を生成します。その Astro ファイルで本文を編集します。自動翻訳や上部ナビゲーションの追加はしないため、本文やフッター links に入口を置けます。

外観を指定する場合は `--theme` を使います。例の `npm run new-page -- portfolio --theme cyber` は別の Cyberpunk ページを作ります。候補は `base`・`ai`・`cyber`・`hacker`・`matrix` で、そのページのレイアウトだけを選び、全サイトの4つの雰囲気は変更しません。slug は英小文字・数字・ハイフン、`projects/labs` のような入れ子も可能です。標準ページと競合させないでください。同名ファイルはエラーなので、同じパスで5種類のテーマコマンドを続けて実行しないでください。

## 9. 保存後の確認

dev で変更したページを開き、内容、リンク、入口を確認します。環境変数の旧上書きは[第1回の確認手順](/ja/blog/starter-guide-1-configure-your-site/)に従います。独自アイコン不足、音声取得失敗、外部リンク異常はそれぞれのパス・ネットワークを確認し、設定全体の上書きで解決しようとしないでください。

公開前に dev を止めて実行します。

```bash
npm run doctor
npm run preview
```

doctor はローカル準備・検証・ビルドを含み、成功直後の check・build は不要です。検索はビルド後の preview で確認し、preview 自体は公開しません。正式公開は `dist/` 全体を再配備し、ローカル保存だけでは変わりません。

## ガイドと設定リファレンス

[前の記事：Fragment を投稿する](/ja/blog/starter-guide-5-fragments/) · [次の記事：読者がコメントできるようにする](/ja/blog/starter-guide-4-giscus-comments/) · [8本のガイドの総合案内](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order)。

関連項目：[ホーム](/ja/blog/config-home/)、[About](/ja/blog/config-about/)、[ターミナル](/ja/blog/config-terminal/)、[Decoder](/ja/blog/config-decoder/)、[公共ナビゲーション・ソーシャル・フッター](/ja/blog/config-site-chrome/)、[音楽](/ja/blog/config-music/)、[一覧とページ分割](/ja/blog/config-blog-list/)。完全なパス、既定値、制約は[設定リファレンス総合案内](/ja/blog/config-reference/)を参照してください。
