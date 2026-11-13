---
tags: ['anglefeint', 'config']
title: '設定リファレンス：ターミナル案内と読み取り専用リーダー'
subtitle: 'About 仮想ターミナルの16項目、プレースホルダー、設定の範囲。'
description: '型、既定値、プレースホルダー、空値の補完、有効状態を実装に基づいて説明し、未使用の readerTitle も示します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

設定ファイルは[インストールとサイト情報](/ja/blog/starter-guide-1-configure-your-site/)、内容とツールは[About](/ja/blog/config-about/)、他の項目は[総合案内](/ja/blog/config-reference/)を参照してください。

標準サイトの対話型仮想ターミナルは About にあります。ここで変えるのは案内、エラー、読み取り専用リーダーのアクセシブル名で、PC やサーバーの shell は実行しません。ホームのワイドターミナルの作者文面は messages.home.transmission を使うため、[ホーム](/ja/blog/config-home/#home-transmission)を参照してください。

<a id="messages"></a>

## messages.terminal の16項目

完全な接頭辞は `i18n.locales.<语言>.messages.terminal` です。すべて任意の string 上書きで、内蔵の現在言語と通常のフォールバックを使います。表は簡体中国語／英語の既定値をそのまま示し、例は該当項目の値です。About 有効、ターミナル初期化成功、該当コマンド結果や読書モードの発生が適用条件です。

| 項目            | 簡体中国語 / 英語既定値                                                                                                             | 状態・役割・制約                                                                                  | 値の例                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | 条件付き：入力のアクセシブル名。プロンプトのパスや表示パネル名は変えません。                      | `"终端输入"`                           |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | 条件付き：初期化案内。起動時は仮想 pwd も実行します。空文字は案内だけを消します。                 | `"输入 help 查看命令。"`               |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | 条件付き：help の説明。固定コマンド案内は残り、空文字で全リストは消えません。                     | `"只读浏览公开文章，不运行系统命令。"` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | 条件付き：閉じていない引用符・エスケープ。空なら syntax に戻ります。                              | `"引号或转义未结束。"`                 |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | 条件付き：引数数の不一致。{value} は使い方で、空なら usage。                                      | `"用法：{value}"`                      |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | 条件付き：未対応コマンド。{value} は名前で、文面ではコマンドを追加できません。                    | `"不支持命令：{value}"`                |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | 条件付き：仮想パスが不存在。{value} は要求パスで、外部 HTTP 状態ではありません。                  | `"未找到：{value}"`                    |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | 条件付き：cd 先がディレクトリでない。{value} は対象パス。                                         | `"不是目录：{value}"`                  |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | 条件付き：cat / vi / vim / view 先がファイルでない。{value} は対象パス。                          | `"目标不是文件：{value}"`              |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | 条件付き：読取失敗。{value} はパスで、元エラー詳細は自動追加しません。                            | `"读取失败：{value}"`                  |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | 条件付き：読取上限超過。{value} はパスで、文字の変更で上限は増えません。                          | `"文件过大：{value}"`                  |
| `empty`         | （空目录） / (empty directory)                                                                                                      | 条件付き：ls が空。空ファイル本文の案内ではありません。                                           | `"目录为空。"`                         |
| `loading`       | 正在读取… / Loading…                                                                                                                | 条件付き：コマンド待機時の Canvas 入力部。空なら ... で、ロード方式は変えません。                 | `"正在读取…"`                          |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | 現在未使用：型・内蔵文面は残るが、タイトルはファイルの title または path を使い、上書きしません。 | `"文章阅读器"`                         |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | 条件付き：読み取り専用案内。空なら :q。終了コマンドやキーは変えません。                           | `"只读 · :q 回车退出 · Esc 关闭"`      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | 条件付き：読書モード入力のアクセシブル名。空なら元ターミナル入力名。                              | `"阅读器命令输入"`                     |

<a id="placeholders"></a>

## {value} と空文字

usage、unknown、notFound、notDirectory、isDirectory、failed、tooLarge はリテラル {value} を使います。最初の1か所だけ置換するので、コマンドやパスを示すなら1回残し、未対応の {path}・{command} は使いません。置換値はテキストであり実行しません。

空文字で機能を停止する統一規則はありません。上記エラーと syntax はキー名、loading は ...、readerHint は :q、readerCommand は元入力ラベルに戻ります。hint・help・empty は文面を消せますが、ターミナル・固定ヘルプ・ディレクトリは消えません。

readerTitle は未使用で、読書 UI タイトルのスイッチではありません。言語パックに文字列が残っていても表示への効果はありません。

<a id="example"></a>

## 統合用の簡体中国語設定例

src/site.config.ts の既存 defineThemeConfig({...}) に統合し、他設定を残して i18n を重複させません。簡体中国語の上書きは他言語を自動変更しません。[言語の補完規則](/ja/blog/config-languages/#fallback)も参照してください。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        terminal: {
          commandInput: '终端输入',
          hint: '输入 help 查看命令。',
          help: '只读浏览公开文章，不运行系统命令。',
          usage: '用法：{value}',
          notFound: '未找到：{value}',
          failed: '读取失败：{value}',
          tooLarge: '文件过大：{value}',
          readerHint: '只读 · :q 回车退出 · Esc 关闭',
          readerCommand: '阅读器命令输入',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## ターミナルが使う他の設定

| 設定                                    | ターミナルへの影響                                                                                      | 主説明                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| theme.enableAboutPage                   | boolean、既定 true。false は標準 About とそのターミナルを生成しません。                                 | [About スイッチ](/ja/blog/config-about/#page-enabled)         |
| `i18n.locales.<语言>.about.scriptsPath` | string、既定 /root/bash/scripts。仮想パス接頭辞と初期ディレクトリで、サーバーのディスクではありません。 | [About ツール](/ja/blog/config-about/#tool-fields)            |
| `i18n.locales.<语言>.about.sections`    | 公開自己紹介が仮想 about.md に入り、エラー文面とは異なります。                                          | [About 本文](/ja/blog/config-about/#body-fields)              |
| 現在言語の記事                          | 自動で仮想ディレクトリに入り、生成記事 JSON を必要時に読みます。記事ごとの手動登録は不要。              | [記事を書く](/ja/blog/starter-guide-2-languages-and-routing/) |

About の sidebar.allScripts と modals.allScripts.title は入口・一覧ダイアログだけを変え、ターミナルコマンドは改名しません。effects.backgroundLines は現在の対話セッションの初期案内を置き換える有効設定ではありません。[About 効果](/ja/blog/config-about/#effect-fields)の状態を参照してください。

<a id="limits"></a>

## 固定機能と制限：site.config 項目ではないもの

- 仮想コマンドは help、clear、pwd、ls、cd、cat、vi、vim、view です。About は open、close、minimize、maximize、restore も接続します。実装で決まるため、help・unknown の変更ではシステムコマンドを追加できません。
- vi / vim / view は読み取り専用で、エディターではありません。:q・:q!・q と Enter、または Esc で終了します。readerHint は案内だけで操作を変えません。
- 入力は既定512 JavaScript UTF-16コード単位、履歴は50件、ファイルは262,144コード単位までで、超過時は tooLarge です。ネットワークにも上限付き読み取り保護があり、アップロード許容量ではありません。
- 記事は同一オリジン JSON を必要時に読み、任意 URL のダウンローダーでも任意のローカルディレクトリの閲覧でもありません。仮想テキスト・ディレクトリは必ずしも通信しません。
- 字号、色、フォント、入力・履歴・読取上限は内部引数にあっても公開 site.config パスはありません。API key は設定せず、SSH・実 shell・遠隔 AI に接続しません。

保存後に開発設定を再読込し、本番は再ビルド・再配備します。対応コマンドや読書モードを発生させて確認し、静的見出しだけで判断しないでください。readerTitle は現在表示を変えません。[総合案内](/ja/blog/config-reference/)に戻れます。
