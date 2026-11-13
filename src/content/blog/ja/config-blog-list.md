---
tags: ['anglefeint', 'config']
title: '設定リファレンス：Blog List とタグ一覧'
subtitle: '記事件数、タグ、ページ番号、ジャンプ、外観、一覧文面を調べます。'
description: 'アーカイブとタグ一覧の設定、既定値、範囲、共有動作、例を説明し、ブラウザー設定と区別します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**バージョンについて：** 厳密な `blogPageSize` 検証は 0.36.1 以降で提供します。0.36.0 には含まれないため、旧版でも適切な正整数を指定してください。

[総合案内へ](/ja/blog/config-reference/)。ブログアーカイブ、タグ目次、個別タグの記事、共通のページ分割を扱います。実装が基準で、デモの件数や色を既定としません。

簡体中国語の例は `/zh/blog/`、`/zh/blog/2/`、タグ目次 `/zh/tags/` です。個別タグは生成リンクを使います。他言語は zh を置換し、既定ホームの URL 設定もこれらの接頭辞を取り除きません。

TypeScript の断片は既存 defineThemeConfig に統合し、theme・i18n・pagination の中身を編集して他設定を残し、重複を避けます。

## 1. 1ページの記事件数

<a id="page-size"></a>

### `theme.blogPageSize`

- **型**：`number`。
- **テーマ既定値**：`10`。
- **役割**：ブログと各タグ一覧で共有。現在言語で絞り、pubDate 降順で表示します。
- **状態**：有効。
- **制約**：正の安全な整数が必要です。0、負数、小数、NaN、Infinity、安全な整数範囲外の値は設定解決時に明示的なエラーになります。切り捨てや既定値への自動復帰は行わず、0 はページ分割を無効にする値ではありません。
- **範囲**：ホーム最新件数と Fragments 件数は変えず、タグ目次自体も分割しません。

```ts
theme: { blogPageSize: 12 },
```

記事なしでも最初のページは生成し、1ページならページ分割を表示しません。件数変更後は再ビルド・再配備し、消えた大きなページ番号のリダイレクトは自動作成しません。

updatedDate・ファイル名・閲覧数では並べません。draft・未来日フィルターと順序設定もありません。[記事ガイド](/ja/blog/starter-guide-2-languages-and-routing/)を参照してください。

## 2. タグ入口とページ

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **型**：`boolean`。
- **テーマ既定値**：`true`。
- **役割**：テーマのタグ入口、目次、記事一覧、カードと本文のタグリンクを制御します。
- **状態**：有効。
- **制約**：false でも記事 tags・内容・旧配備を削除しません。タグによるブログ絞込スイッチでもありません。ブログ入口は現在言語にタグがある場合だけで、有効でもタグなしなら空の目次です。

```ts
theme: { tags: { enabled: false } },
```

タグは frontmatter の tags 配列から来て、site.config の登録簿はありません。前後空白・空項目・同記事重複を除きますが、Astro と astro は別です。

目次は記事数降順、同数は文字列順です。特殊文字・中国語・予約名・長いタグは安定エンコードし、生成リンクを使います。改名でパスは変わり、旧 URL は保持しません。

カードは最大2タグで件数設定はありません。記事の実タグ数や目次への全有効タグ収録は制限しません。

## 3. ページ番号とジャンプ

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **型**：`number`。
- **テーマ既定値**：`7`。
- **役割**：表示番号、境界、省略記号を決め、記事件数ではありません。
- **状態**：複数ページでのみ有効。
- **制約**：通常値を切り捨て5–21に制限。戦略引数で、番号・前後・省略記号の合計が厳密にその数になる保証はありません。有限整数を使います。

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **型**：`number`。
- **テーマ既定値**：`12`。
- **役割**：総ページ数が閾値を厳密に超え、jump.enabled が true の場合に入力を出します。
- **状態**：条件付きで有効。
- **制約**：通常値を切り捨て最低1。既定は12では非表示、13で表示。記事数ではなく、0 でも無条件にはなりません。

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **型**：`boolean`。
- **テーマ既定値**：`true`。
- **役割**：ジャンプフォームを許可します。
- **状態と制約**：総数が閾値を超える必要があります。false はフォームだけを消し、番号と前後リンクは残ります。ジャンプは JS 必須、通常リンクは不要です。

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **型**：`boolean`。
- **テーマ既定値**：`true`。
- **役割**：入力欄の Enter で移動します。
- **状態と制約**：フォームがある場合のみ。false は Enter 送信を止め、ボタンは使えます。数字以外を除き実ページ範囲に制限し、任意 URL への移動ではありません。

まとめて指定できます。

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

Fragments にも共通で、その1ページ件数は独自 pageSize です。1タグだけを変えるつもりでも共通設定である点に注意します。

## 4. ページ分割の外観

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **型**：`boolean`。
- **テーマ既定値**：`true`。
- **役割**：容器と番号ボタンの変体選択を有効にします。
- **状態と制約**：false は基本変体1で、ページ分割・記事数・Cyberpunk 全体を止めません。カードや Cards/List のランダム色も制御しません。

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **型**：`'random' | 'sequential' | 'fixed'`。
- **テーマ既定値**：`'random'`。
- **役割**：外観変体の選び方。
- **状態と制約**：style.enabled が true の場合だけ使います。

| モード     | 現在の動作                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| random     | 安定した初期変体をビルドし、クライアント初期化で容器・ボタンを再選択。重複し得ますが持続的な色循環ではありません。 |
| sequential | 容器はページ番号、ボタンは順序で選択。同色とは限らず時間循環ではありません。                                       |
| fixed      | 容器とボタンに fixedVariant を共用。                                                                               |

JS 無効なら静的 HTML の初期外観を保ち、ランダム再選択はしません。

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **型**：`number`。
- **テーマ既定値**：`9`。
- **役割**：1から N の候補数。複数選択配列でも全テーマ数でもありません。
- **状態と制約**：通常値を切り捨て1–12。ただし共通ネオン色は1–9のみで、10–12は追加の完全配色ではなく継承・基本色に戻る場合があります。1–9を推奨、通常は既定9を使います。新色機能の追加ではありません。

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **型**：`number`。
- **テーマ既定値**：`1`。
- **役割**：fixed モードの変体番号。
- **状態と制約**：切り捨て、1から現在 variants までに制限。random・sequential の固定には使いません。完全なネオン色は1–9を推奨し有限整数にします。

2番目に固定する例です。

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

基本外観だけなら `theme: { pagination: { style: { enabled: false } } }`。必要な例を選び、連続コピーで上書きする必要はありません。

## 5. 一覧の見出し・説明・ページ文面

<a id="archive-messages"></a>

接頭辞は `i18n.locales.<语言>.messages.blog`、任意 string 上書き、対応する見出し・説明・控件がある場合に有効です。内蔵言語と補完で解決し、表は簡体中国語／英語の実値、他言語は固有値です。

| 項目                 | 簡体中国語既定 / 英語既定                                                                                        | 役割と制約                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `title`              | 博客 / Blog                                                                                                      | 最初のブログのページタイトルと隠し領域見出し。記事名や切替ボタンは変えない。                 |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | ブログ後続・タグ後続のタイトル接頭辞。番号はコードが追加し独自プレースホルダーは処理しない。 |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | 最初のブログ・タグ目次のメタ説明で、カード抜粋ではない。                                     |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | ブログ後続のメタ説明接頭辞。番号と句点を追加し、タグ一覧の同位置には使わない。               |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          title: '文章归档',
          pageTitle: '文章归档 - 第',
          archiveDescription: '项目、阅读与学习笔记。',
          pageDescription: '文章归档分页',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

同じ接頭辞と string を使います。

| 項目             | 簡体中国語既定 / 英語既定 | 役割と制約                                       |
| ---------------- | ------------------------- | ------------------------------------------------ |
| `previous`       | 上一页 / Previous         | 前ページの表示・名前。最初には出さない。         |
| `next`           | 下一页 / Next             | 次ページの表示・名前。最後には出さない。         |
| `paginationAria` | 分页导航 / Pagination     | nav のアクセシブル名で、追加表示見出しではない。 |
| `jumpTo`         | 跳转到页 / Jump to page   | 条件を満たすフォームの入力横文面。               |
| `jumpInputLabel` | 页码 / Page number        | 隠し入力ラベル。入力形式は変えない。             |
| `jumpGo`         | 跳转 / Go                 | 送信ボタン文面。移動先は変えない。               |

タグ・Fragments にも共通です。ブログルートは空 jumpTo・jumpInputLabel・jumpGo に英語予備値がありますが、タグは解決値を直接渡します。空文字で横断的に隠さず、jump.enabled を使い意味ある名前を残してください。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          previous: '前一页',
          next: '后一页',
          paginationAria: '文章分页',
          jumpTo: '前往第几页',
          jumpInputLabel: '目标页码',
          jumpGo: '前往',
        },
      },
    },
  },
},
```

## 6. タグ目次と共通入口の文面

<a id="tag-messages"></a>

同じ `i18n.locales.<语言>.messages.blog` の任意 string で通常補完を使い、該当領域がある場合に有効です。

| 項目          | 簡体中国語既定 / 英語既定 | 役割と制約                                                       |
| ------------- | ------------------------- | ---------------------------------------------------------------- |
| `tags`        | 标签 / Tags               | 入口・目次・タグ一覧の見出しと名前。記事 tags・slug は変えない。 |
| `allPosts`    | 全部文章 / All posts      | 全記事への戻り文面。ホームの説明にも使い総数は変えない。         |
| `noTags`      | 暂无标签 / No tags yet.   | タグ目次が空の案内。記事なし案内ではない。                       |
| `taggedPosts` | 文章 / Posts              | 含む記事数とタグページ説明。数の手設定ではない。                 |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          tags: '按标签浏览',
          allPosts: '返回全部文章',
          noTags: '暂时没有可浏览的标签。',
          taggedPosts: '篇文章',
        },
      },
    },
  },
},
```

空文字は停止ではなく、空リンクや不完全説明を残す場合があります。タグ停止には theme.tags.enabled を使い、tags 文面を false・空にしません。

## 7. Cards／List、カバー、その他の範囲

<a id="view-and-limits"></a>

以下は実装上の動作で、新しい設定項目ではありません。

- ブログとタグは共通の Cards/List 切替で、保存なしは cards。JS で切替でき、同じ localStorage キーで言語間も共用します。保存不能でも操作可能ですが記憶は保証しません。
- 既定表示、切替無効化、表示文面、列名、カード色の site.config はありません。コンポーネント内の言語表を使い、新言語に項目がなければ英語です。messages.blog.title では変わりません。
- カードはタイトル・日時・カバー・最大2タグ。抜粋、カバー優先候補数、updatedDate 並び順の設定はありません。メタ説明を変えても description がカード抜粋にはなりません。
- 実カバーのある先頭2候補は eager/high、他は lazy。List で隠しても取得しない保証はありません。[画像ガイド](/ja/blog/starter-guide-images/)へ。
- ブログ言語切替は同番号があれば維持、なければ最初へ。タグは同じ文字列があればその最初へ、なければタグ目次へ。自動翻訳や同義語照合はしません。
- ホーム最新件数・演出は[ホーム辞書](/ja/blog/config-home/)へ。ナビゲーション、検索、フッター、コメントは再定義しません。

一覧専用の旧互換項目はありません。存在しない blogView・showExcerpt・cardTheme を有効と見なさないでください。任意キー追加では外観機能は増えません。

## 変更後の確認

dev で最初と後続ページ、タグ目次と個別タグを確認します。ジャンプには十分なページ数、fixed は random との区別が必要です。メタ説明は head、隠しラベル・名前は大きな見出しだけで判断しません。

件数・タグ名変更後は再ビルド・全配備し、旧ページ・タグの残存に注意します。dev を止め npm run doctor、npm run preview を使い、doctor はビルド済みなので直後の check・build は不要です。[インストール](/ja/blog/starter-guide-1-configure-your-site/)と[配備](/ja/blog/starter-guide-deployment/)を参照してください。
