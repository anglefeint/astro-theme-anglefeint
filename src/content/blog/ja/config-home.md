---
tags: ['anglefeint', 'config']
title: '設定リファレンス：ホーム'
subtitle: '見出し、紹介文、最新記事、案内文、ワイド画面ターミナル、クリック時の演出を調べます。'
description: 'ホーム設定の型、テーマ既定値、適用範囲、制約、統合用の例、共有項目、未提供スイッチを説明します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[設定リファレンス総合案内へ](/ja/blog/config-reference/)。実際にホームで使う項目を説明します。テーマを変更せず、デモの個人設定を既定値とも見なしません。

`<语言>` は有効な実コードに置き換えます。例は zh で簡体中国語だけを変更し、英語の変更や言語の有効化はしません。断片はすべて `src/site.config.ts` の既存 defineThemeConfig に統合し、既存 theme・i18n・site の他設定を残します。

## 1. ホームの大見出し、紹介文、メタ説明

<a id="home-title"></a>

### `i18n.locales.<语言>.site.homeTitle`

- **型**：任意の `string`。
- **テーマ既定値**：未指定。内蔵言語も homeTitle を個別指定せず、最終的にサイト名（既定 My Blog）を使います。
- **役割**：ホームの表示大見出し。
- **状態と制約**：条件付きで有効。現在言語と参照言語の、前後空白除去後に非空のタイトルを順に探し、なければサイト名を使います。`''` や空白では隠せません。ブラウザータイトル、ナビゲーション、フッター、RSS、SEO のサイト名は変わりません。

<a id="home-hero"></a>

### `i18n.locales.<语言>.site.hero`

- **型**：任意の `string`。
- **テーマ既定値**：各言語の内蔵紹介文。簡体中国語既定は「在这里写一段站点简介，并告诉读者你将发布什么类型的内容。」、英語既定は「Write a short introduction for your site and what readers can expect from your posts.」。他言語も固有の内蔵値を使います。
- **役割**：大見出し下に表示する紹介文。
- **状態と制約**：条件付きで有効。現在言語と参照言語の定義済み値を探し、`''` は意図した空値として補完を止めます。プレーンテキストで Markdown・HTML は解析せず、メタ説明も変えません。

<a id="home-description"></a>

### `i18n.locales.<语言>.messages.siteDescription`

- **型**：任意の `string` 上書き。
- **テーマ既定値**：現在言語の内蔵文面。簡体中国語既定は「电影感网页界面与 AI 时代工程实践文章。」、英語既定は「Cinematic web interfaces and AI-era engineering essays.」。
- **役割**：ホームから head に渡す説明で、表示紹介文ではありません。
- **状態と制約**：条件付きで有効。UI と補完を解決した値を使い、空文字の場合だけ全体 description に戻ります。空文字は全ページ説明の停止スイッチではなく、空白も自動 trim して説明なしにはしません。

3項目は独立して同時に指定できます。

```ts
i18n: {
  locales: {
    zh: {
      site: {
        homeTitle: '我的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: { siteDescription: '个人项目与学习笔记。' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### 関連する共通項目：`site.title`、`site.description`

ホームとの関係だけを示します。site.title は有効な homeTitle がない場合の最終見出し、site.description は言語別メタ説明が空の場合の予備です。どちらもホーム専用ではありません。型、既定値、環境変数、全例は[サイト情報リファレンス](/ja/blog/config-site-chrome/#identity)を参照してください。

## 2. 最新記事の件数

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **型**：`number`。
- **テーマ既定値**：`3`。
- **役割**：現在言語の記事を pubDate 降順で並べ、最初の N 件をホームに表示します。N 件未満なら存在する分だけで、横に実件数／その言語の総数を出します。
- **状態と制約**：有効。現在は配列 slice を直接使い、正整数専用の検証はありません。適切な正整数を推奨し、負数・小数・NaN・Infinity を使わないでください。`0` は記事があっても空一覧と「記事なし」案内を出し、領域全体を隠すスイッチではありません。
- **独立範囲**：Blog List の1ページ件数や、最大3件の Fragment プレビューは変えません。

```ts
theme: { homeLatestCount: 5 },
```

タイトル、日付、抜粋は記事内容から取得し、この項目の子設定ではありません。ホームに他言語の記事で不足を自動補完する処理はありません。

## 3. 起動案内と下部の状態

<a id="startup-switches"></a>

次の3項目はすべて `boolean`、既定 `true`、有効です。false は対応部分のみを隠し、省略すれば既定を維持します。

| 完全パス                    | 役割                                  | 制約                                                                   |
| --------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| `theme.home.showInitialize` | Initialize／done の起動文             | その段落だけを制御し、本文や背景ロードは制御しません。                 |
| `theme.home.showFollow`     | Wake Up／Follow The White Rabbit 案内 | 前段とは独立し、ページ移動の有効条件ではありません。                   |
| `theme.home.showTrace`      | 下部 PIRATE SIGNAL／TRACE PROGRAM     | ワイドターミナルは制御せず、実追跡やネットワーク状態ではない演出です。 |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

前2項目を両方止めると対応する起動文コンポーネントを取り除きます。固定起動文、下部状態、時間パラメーターを変える site.config 項目はなく、startupText・traceText などを推測して追加しないでください。

## 4. ホームの UI 文面

<a id="home-messages"></a>

すべて `i18n.locales.<语言>.messages.home` の任意 `string` 上書きで、通常項目は UI の補完規則を使います。以下は簡体中国語・英語の実際の既定値で、他言語には固有の文面があります。

| パス末尾   | 簡体中国語既定 / 英語既定                                       | 役割と制約                                                                              |
| ---------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `latest`   | 最新 / Latest                                                   | 最新記事の見出し。順番・件数は変えません。                                              |
| `viewAll`  | 全部 / All                                                      | 記事アーカイブ入口。Fragment 一覧リンクのアクセシブル説明にも使い、移動先は変えません。 |
| `noPosts`  | 该语言暂时没有文章。 / No posts available in this language yet. | latestPosts が空のときの案内。下書き・公開制御ではありません。                          |
| `openDoor` | 开门 / Open door                                                | 鍵穴ボタンのアクセシブル名とプレビューラベル。常に見える本文見出しではありません。      |

領域がある場合にだけ表示・アクセシビリティへ反映します。空文字でも容器や機能は消えず、ボタンの意味ある名前を失う場合があります。表示制御には機能スイッチを使ってください。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        home: {
          latest: '最近更新',
          viewAll: '全部文章',
          noPosts: '这里还没有文章。',
          openDoor: '打开走廊预览',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<语言>.messages.home.transmission`

- **型**：任意の `string` 上書き。
- **テーマ既定値**：`'Knock, knock.'`。簡体中国語を含め、個人上書きがなければ共通です。
- **役割**：ワイドターミナル内の選択・スクロール可能な文面。
- **状態と制約**：条件付きで有効。幅1440px以上で表示します。現在言語の個人設定 → 英語の個人設定 → 既定文の独立した順序で、通常文面の完全な補完は使いません。`''` は文字だけを消し、ターミナルや廊下を閉じません。

個別上書きのない言語で共有する例です。

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '这里留下一点线索。' } } },
  },
},
```

zh の同じ位置なら簡体中国語だけを上書きします。実ネットワーク信号を調べたり、鍵穴から廊下を開く動作を変えたりしません。

<a id="message-hero"></a>

### `i18n.locales.<语言>.messages.home.hero`

- **型**：任意の `string` 上書き。
- **テーマ既定値**：各言語の内蔵紹介文。簡体中国語・英語は上記 site.hero の既定文と同じです。
- **役割**：getSiteHero が現在言語・参照言語から定義済み値を得られなかった場合の予備紹介文。
- **状態と制約**：条件付きで有効で、廃止項目ではありません。ただし内蔵言語は site.hero を既定で持つため、この項目だけを変えても通常は変化しません。site.hero を `''` にしても発動しません。通常は site.hero を直接変えます。

```ts
i18n: {
  locales: {
    zh: { messages: { home: { hero: '仅在没有可用 site.hero 时使用的介绍。' } } },
  },
},
```

型とパスの例であり、優先される site.hero を迂回しません。紹介文変更のために既定設定や依存パッケージのソースを削除する必要はありません。

## 5. 記事クリック時の Matrix 演出

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **型**：`boolean`。
- **テーマ既定値**：`false`。
- **役割**：ホームの最新記事タイトルや対応するブログナビゲーションを通常クリックした際、Matrix 演出の後に移動します。通常は約8秒で、完了時と異常時の移動フォールバックを備えます。
- **状態と制約**：条件付きで有効、JavaScript が必要です。動きを減らす設定、修飾キー、左以外のクリック、ダウンロード、外部リンク、新窓などは標準動作を保ちます。ホーム本文を遅らせず、About Oracle やワイドプレビューも制御しません。

```ts
theme: { effects: { enableHomePassage: true } },
```

無効なら直接移動します。所要時間、色、移動先は指定できず、未公開の homePassageDuration などは追加しないでください。

## 6. ホームでも使う共通設定

<a id="shared-settings"></a>

ホーム専用ではないため、ここは関係だけを示し、完全定義は担当リファレンスにまとめます。

| 完全パス                                       | ホームでの利用                                                              | 主説明                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `theme.fragments.enabled`                      | 現在言語に内容があればアバター入口。全一覧にも適用し、プレビューは最大3件。 | [Fragments スイッチ](/ja/blog/config-fragments/#enabled)         |
| `i18n.locales.<语言>.messages.blog.allPosts`   | 最新記事数の案内とアーカイブ入口のアクセシブル名。                          | [一覧共通文面](/ja/blog/config-blog-list/#tag-messages)          |
| `i18n.locales.<语言>.messages.fragments.title` | アバターのアクセシブル名で、横の表示タイトルではありません。                | [Fragments の文面](/ja/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<语言>.messages.fragments.close` | 閉じるボタンのアクセシブル名で、図形は変えません。                          | [Fragments の文面](/ja/blog/config-fragments/#fragment-messages) |

有効でもアバターがなければ現在言語に内容があるか確認し、既存 ID をコピーして表示させないでください。画像・コード・高さ制限は[Fragments リファレンス](/ja/blog/config-fragments/#preview-and-links)、投稿は[Fragment ガイド](/ja/blog/starter-guide-5-fragments/)にあります。

## 7. 現在提供していないホーム設定

<a id="unsupported-settings"></a>

`messages.siteTitle` は現在の標準ホーム・共通サイト名を変えません。homeTitle や最上位 site.title の代わりに使わないでください。型、既定値、例は[未使用サイト名項目](/ja/blog/config-site-chrome/#legacy-site-title)にまとめます。

コード雨の密度・色、鏡面ボタン、アバター素材、Fragment プレビュー件数、固定起動文、演出時間に対応する site.config 項目は現在ありません。既存レイアウト・CSS・スクリプトの実装であり、TypeScript に任意名を足しても機能しません。Reduced Motion は表示に影響しますが、この記事で追加するスイッチではありません。

`/` と言語ホームの関係は i18n.defaultLocale と i18n.routing.defaultLocalePrefix で決まり、[言語と URL リファレンス](/ja/blog/config-languages/#routing)に完全定義があります。公共ナビゲーション、フッター、音楽、統計もホーム専用ではありません。

## 変更後の確認

dev で対象言語のホームを開き、変更対象が見出し・紹介・メタ説明・アクセシブル説明のどれか確認します。ターミナルは1440px以上、メタ説明は head、ボタン名はアクセシブル名や title で確認し、大きな文字の有無だけで判断しません。

環境変数を変えたら dev を再起動し、本番は再ビルド・再配備します。dev 停止後に npm run doctor、npm run preview を実行でき、doctor はビルドを含むので check・build の直後の重複は不要です。[インストール](/ja/blog/starter-guide-1-configure-your-site/)と[配備](/ja/blog/starter-guide-deployment/)を参照してください。
