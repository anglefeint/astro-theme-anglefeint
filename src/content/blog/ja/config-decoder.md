---
tags: ['anglefeint', 'config']
title: '設定リファレンス：Decoder'
subtitle: '独立デコードページ、About 内蔵ツール、参考資料カード。'
description: 'Decoder のスイッチ、文面、タスク、資料とカバーの設定を実装に基づいて調べ、既定値・制約・適用範囲を示します。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

設定位置は[インストール](/ja/blog/starter-guide-1-configure-your-site/)、ページの有効化は[ページと機能](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)へ。項目参照用の記事で、他は[総合案内](/ja/blog/config-reference/)にあります。

資料カードは Decoder 下部の参考リンクで、Blog List の記事カードや自動生成記事ではありません。以下はパッケージ既定でデモ上書きではありません。

<a id="page-enabled"></a>

## theme.enableDecoderPage：独立ページ

- **型 / 既定値：** boolean / true。
- **役割と状態：** 有効。各有効言語に `/<locale>/decoder/` を生成し、公共ナビと About の完全ツール入口も連動します。
- **制約：** false でも About 内蔵テキストツールは残り、About は enableAboutPage で独立制御します。既公開データや旧配備の削除保証はなく、再ビルド・配備が必要です。
- **例：** `theme: { enableDecoderPage: false }`。

| 機能                        | 独立 Decoder              | About 内蔵                                       |
| --------------------------- | ------------------------- | ------------------------------------------------ |
| テキスト形式のデコード      | あり                      | あり                                             |
| Token call / アドレス検査   | あり                      | なし                                             |
| 複数ステップ履歴・JSON 出力 | あり                      | なし                                             |
| 資料カード・敬意の文        | あり                      | なし                                             |
| ツール共通文面              | messages.decoder          | messages.decoder                                 |
| タイトルと入口              | messages.decoderPage など | About sidebar.decryptor / modals.decryptor.title |

旧 header、keysLabel、currentPassphraseLabel、masterKeyLabel、transientKeyLabel は受理しても現在読みません。[About ツール](/ja/blog/config-about/#modal-fields)を参照し、旧項目を変えてもこのページは変わりません。

<a id="text-messages"></a>

## messages.decoder：テキストツール共通文面

接頭辞は `i18n.locales.<locale>.messages.decoder.`、任意 **string**、内蔵現在言語と補完を使います。表は簡体中国語／英語の実既定値、例は項目値です。対応ツール・操作・状態が条件で、省略しても既定があります。空文字は控件を止めず、一部エラーは別案内へ補完します。

| 項目          | 簡体中国語 / 英語既定値                                                                  | 役割と制約                                                    | 例                                                             |
| ------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| `input`       | 输入 / Input                                                                             | 入力領域と履歴の原入力ラベル。                                | `"元の内容"`                                                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | 入力の仮案内で事前入力しない。                                | `"デコードするテキストを貼り付け"`                             |
| `format`      | 格式 / Format                                                                            | 形式選択のラベル。対応形式は変えない。                        | `"エンコード形式"`                                             |
| `auto`        | 自动识别 / Auto detect                                                                   | 自動判定の文字で算法は変えない。                              | `"自動判定"`                                                   |
| `decode`      | 解码 / Decode                                                                            | デコード送信の文字。                                          | `"デコード開始"`                                               |
| `clear`       | 清空 / Clear                                                                             | 現在入力・出力・手順を消すボタン。                            | `"内容を消去"`                                                 |
| `copy`        | 复制结果 / Copy result                                                                   | コピー可能な結果がある場合のボタン。                          | `"結果をコピー"`                                               |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | 結果で続けるボタン。過大な結果は戻せない。                    | `"続けてデコード"`                                             |
| `supported`   | 支持的解码格式 / Supported formats                                                       | 対応形式案内の接頭辞。                                        | `"対応形式"`                                                   |
| `html`        | HTML 实体 / HTML entities                                                                | HTML エンティティ形式名。規則は変えない。                     | `"HTML エンティティ"`                                          |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Unicode エスケープ形式名。規則は変えない。                    | `"Unicode エスケープ"`                                         |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | 独立案内と JWT 成功時の警告。文字で署名検証は有効化できない。 | `"デコードのみを行い、署名は検証しません。"`                   |
| `copied`      | 结果已复制。 / Result copied.                                                            | クリップボード成功状態。                                      | `"結果をコピーしました"`                                       |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | コピー失敗で、デコード失敗ではない。                          | `"コピーできませんでした。テキストを手動で選択してください。"` |
| `output`      | 解码结果 / Decoded text                                                                  | 結果の見出し・名前と履歴出力ラベル。                          | `"デコード結果"`                                               |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | 下部のローカル処理説明。全サイト通信停止ではない。            | `"入力はブラウザー内でローカル処理します。"`                   |
| `ready`       | 准备就绪。 / Ready.                                                                      | 初期とリセット後の準備状態。                                  | `"入力待ち"`                                                   |
| `running`     | 正在解码… / Decoding…                                                                    | 処理・表示中の状態。                                          | `"処理中"`                                                     |
| `done`        | 解码完成 / Decoded                                                                       | 成功状態。形式名・JWT 警告を追加可能。                        | `"完了"`                                                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | 空入力のエラー。                                              | `"先に内容を入力してください。"`                               |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | 入力超過。アドレス上限はさらに小さく、文字で変えない。        | `"入力が上限を超えています。"`                                 |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | 不正データと他エラーなし時の予備。                            | `"解析できません。入力を確認してください。"`                   |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | バイナリ・安全な UTF-8 表示不可の案内。                       | `"結果は読めるテキストではありません。"`                       |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | 自動判定が候補なしの案内。                                    | `"判別できません。形式を選んでください。"`                     |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | 複数候補の案内。                                              | `"複数の候補があります。形式を選んでください。"`               |
| `example`     | 示例 / Example                                                                           | 例ボタン。実例は実装固定で置換しない。                        | `"サンプルを試す"`                                             |

<a id="page-messages"></a>

## messages.decoderPage：独立ページとタスクの文面

接頭辞は `i18n.locales.<locale>.messages.decoderPage.`。31項目とも任意 **string**、既定規則は前表同様です。fullTool は About にも使い、他は主に独立ページです。文面を記入しても内蔵ツールにないタスクが増えるわけではありません。

| 項目            | 簡体中国語 / 英語既定値                                                                                                                                                                                                                                                                                                                                                                                                       | 状態・役割・制約                                                                              | 例                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | 条件付き：メタ説明、見出し下、WebApplication 構造化データ。                                   | `"テキストのデコード、呼び出しの解析、アドレスの確認をローカルで行います。"` |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | 条件付き：h1、構造化名、説明の名前、About リンク。文書タイトルの固定 Decoder Lab は変えない。 | `"私のデコードツール"`                                                       |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | 条件付き：3タスクのタブ群のアクセシブル名。                                                   | `"タスクを選択"`                                                             |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | 条件付き：テキストタブ・説明見出し。                                                          | `"テキストのデコード"`                                                       |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | 条件付き：呼出タブ・説明・履歴形式名、ブラウザータイトルにも使用。                            | `"トークン呼び出しの解析"`                                                   |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | 条件付き：アドレスタブ・説明・履歴形式名。                                                    | `"アドレス形式の確認"`                                                       |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | 条件付き：アドレス入力の案内とアクセシブル説明。                                              | `"確認するアドレスを貼り付けてください。"`                                   |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | 条件付き：体系選択ラベル。実 EVM 選択肢などは増やせない。                                     | `"アドレス体系"`                                                             |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | 条件付き：精度入力のラベル。不正精度の decimals エラーにも使用。                              | `"トークンの小数桁数"`                                                       |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | 条件付き：任意精度の案内。既定精度は設定しない。                                              | `"読みやすい金額表示にはトークンの精度を入力してください。"`                 |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | 条件付き：Bitcoin ネットワークのラベルで選択肢は変えない。                                    | `"Bitcoin ネットワーク"`                                                     |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | 条件付き：履歴の見出しとアクセシブル名。                                                      | `"処理履歴"`                                                                 |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | 条件付き：その段階の出力を戻してテキストタスクへ切り替えるボタン。                            | `"この結果を続けて処理"`                                                     |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | 条件付き：JSON 出力ボタン。スクリーンショットではない。                                       | `"JSON をエクスポート"`                                                      |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | 条件付き：ステップ制限の案内で実上限は変えない。                                              | `"最大 10 ステップ、入力は 16,384 文字以内です。"`                           |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | 条件付き：呼出モードの能力範囲案内。                                                          | `"解析はオンチェーン検証ではありません。"`                                   |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | 条件付き：アドレスモードの範囲案内。                                                          | `"正しい形式でもアドレスの信頼性は保証しません。"`                           |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | 条件付き：未対応体系・方法のエラー。                                                          | `"transfer、approve、transferFrom のみに対応します。"`                       |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | 条件付き：チェックサムエラー。                                                                | `"アドレスのチェックサムが無効です。"`                                       |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | 条件付き：ABI 引数長のエラー。                                                                | `"呼び出し引数の長さが一致しません。"`                                       |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | 条件付き：Bitcoin と選択ネットの不一致。                                                      | `"現在の Bitcoin ネットワークに合わないアドレスです。"`                      |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | 条件付き：ステップ上限のエラー。文字で増やせない。                                            | `"ステップ上限です。消去して再実行してください。"`                           |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | 条件付き：履歴入出力のメモリー予算超過。                                                      | `"履歴が多すぎます。消去してください。"`                                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | 条件付き：アドレス履歴：符号化解析。                                                          | `"アドレスを解析"`                                                           |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | 条件付き：アドレス履歴：形式・チェックサム。                                                  | `"形式を確認"`                                                               |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | 条件付き：アドレス・呼出履歴：表現表示。                                                      | `"アドレスの結果を表示"`                                                     |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | 条件付き：呼出履歴：セレクターと引数。                                                        | `"呼び出し引数を解析"`                                                       |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | 条件付き：精度未指定時の呼出履歴。                                                            | `"元の整数を保持"`                                                           |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | 条件付き：精度指定時の金額履歴。                                                              | `"精度に合わせて金額を表示"`                                                 |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | 条件付き：独立ページの呼出案内。calldata が必要で取引ハッシュではない。                       | `"calldata を貼り付けて解析してください。"`                                  |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | 条件付き：独立ページの暗号解析モジュール読込失敗。全ページの汎用通信エラーではない。          | `"解析モジュールを読み込めませんでした。再読み込みしてください。"`           |

文書タイトルは現在 Decoder Lab | Base64 · JWT · と callTask の組合せで、decoderPage.title はありません。fullTool は固定 Decoder Lab を置換しません。全ブランド・ネットワーク・形式名が設定できるわけではなく、新タスクも増えません。

<a id="readings"></a>

## messages.decoderPage.readings：参考資料

接頭辞は `i18n.locales.<locale>.messages.decoderPage`。readings は任意オブジェクトで言語文面では未指定、コンポーネントが現在言語の文と16カードを用意します。未対応言語は英語に戻るコンポーネント独自規則で、全言語同タイトルではありません。

| 項目             | 型 / 既定値                                                | 状態・役割・制約                                                                                                       | 例                                                               |
| ---------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| readings.tribute | 任意 string / 現在言語の内蔵文、簡体中国語・英語全文は下記 | 条件付き。下部の敬意の段落。空は段落だけを隠す。純テキスト、一部のサイファーパンク語を自動太字にし HTML は解析しない。 | 'これらの思想とツールの著者に感謝します。'                       |
| readings.links   | 任意 DecoderReading[] / 下記内蔵16項目                     | 条件付き。配列順・全置換で追加マージせず件数上限なし。[] はカードだけを隠す。                                          | [{ title: '私の記事', href: '/ja/blog/welcome-to-anglefeint/' }] |

各リンクは5項目です。「なし」は独自項目の自動補完なしであり、内蔵データに情報がない意味ではありません。

| 完全相対パス            | 型 / 既定値          | 状態・役割・制約                                                                                                             | 例                                |
| ----------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| readings.links[].title  | 必須 string / なし   | 条件付き。空・空白ならカードを除外。Markdown・HTML は解析しない。                                                            | '私の記事'                        |
| readings.links[].href   | 必須 string / なし   | 条件付き。全カードの行先。HTTP(S):// または単一 / のみ。//、mailto、アンカー、通常相対は除外。接頭辞検査だけで実在確認なし。 | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author | 任意 string / 未指定 | 年と中点で接続。空なら非表示、site.author から補わない。                                                                     | '著者名'                          |
| readings.links[].year   | 任意 string / 未指定 | 年・説明文。日付解析や並び順には使わず、数値ではなく文字列。                                                                 | '2026'                            |
| readings.links[].cover  | 任意 string / 未指定 | 内蔵名・HTTP(S)://・単一 / 画像。空・未知・不正は画像のみ非表示でカードは残す。                                              | 'privacy-code'                    |

新タブ、noopener noreferrer で開きます。内部ルートには BASE_URL を付けるため同接頭辞を重ねないでください。href・独自 cover は自動 trim しないので前後空白を入れません。

内蔵カバー名は16個です。

```text
privacy-code
cryptographic-autonomy
cyberspace-freedom
virtual-communities
satoshi-freedom
smart-contracts
security-without-identification
b-money
cypherpunk-archive
satoshi-institute
bitcoin
tor-project
signal
telegram
monero
gnupg
```

public/images/decoder/my-cover.webp は /images/decoder/my-cover.webp で参照し public・src/assets を入れません。16:9 枠で切り取り、内蔵はレスポンシブ、独自・外部は直接 img でブログの多サイズ処理に入りません。適切なサイズを自分で用意し、失敗時の内蔵代替はありません。画像なしでも文字カードは残せます。

ツールを残して参考欄だけを隠す例です。

```ts
i18n: {
  locales: {
    ja: {
      messages: {
        decoderPage: { readings: { tribute: '', links: [] } },
      },
    },
  },
},
```

<a id="reading-defaults"></a>

### 既定の敬意の文とカード

簡体中国語の実既定文：谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

英語の実既定文：In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

既定カードの全順序です。空の著者・年は未指定。外部 URL には内蔵の参照パラメーターがありますが、独自 href へ自動追加しません。

| カバー名                          | 簡体中国語既定タイトル / 英語既定タイトル                                                       | 著者                  | 年   | href                                                                                                                                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `privacy-code`                    | 密码朋克宣言 / A Cypherpunk’s Manifesto                                                         | Eric Hughes           | 1993 | `https://www.activism.net/cypherpunk/manifesto.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                        |
| `cryptographic-autonomy`          | 加密无政府主义宣言 / The Crypto Anarchist Manifesto                                             | Timothy C. May        | 1988 | `https://www.activism.net/cypherpunk/crypto-anarchy.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                   |
| `cyberspace-freedom`              | 网络空间独立宣言 / A Declaration of the Independence of Cyberspace                              | John Perry Barlow     | 1996 | `https://www.eff.org/cyberspace-independence?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                               |
| `virtual-communities`             | 加密无政府主义与虚拟社区 / Crypto Anarchy and Virtual Communities                               | Timothy C. May        | 1994 | `https://nakamotoinstitute.org/library/virtual-communities/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                |
| `satoshi-freedom`                 | 比特币点对点电子现金论文——关于 P2P 与自由的回复 / Bitcoin P2P e-cash paper — on P2P and freedom | Satoshi Nakamoto      | 2008 | `https://satoshi.nakamotoinstitute.org/emails/cryptography/4/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                              |
| `smart-contracts`                 | 智能合约：数字市场的基石 / Smart Contracts: Building Blocks for Digital Markets                 | Nick Szabo            | 1996 | `https://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/smart_contracts_2.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab` |
| `security-without-identification` | 不依赖身份识别的安全 / Security without Identification                                          | David Chaum           | 1985 | `https://chaum.com/security-without-identification/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                        |
| `b-money`                         | b-money / b-money                                                                               | Wei Dai               | 1998 | `https://nakamotoinstitute.org/library/b-money/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                            |
| `cypherpunk-archive`              | cryptoanarchy.wiki / cryptoanarchy.wiki                                                         | cryptoanarchy.wiki    |      | `https://cryptoanarchy.wiki/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                               |
| `satoshi-institute`               | 中本聪研究所 / Satoshi Nakamoto Institute                                                       | nakamotoinstitute.org |      | `https://nakamotoinstitute.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                            |
| `bitcoin`                         | Bitcoin / Bitcoin                                                                               | bitcoin.org           |      | `https://bitcoin.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                      |
| `tor-project`                     | Tor Project / Tor Project                                                                       | torproject.org        |      | `https://www.torproject.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                               |
| `signal`                          | Signal / Signal                                                                                 | signal.org            |      | `https://signal.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                       |
| `telegram`                        | Telegram / Telegram                                                                             | telegram.org          |      | `https://telegram.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                     |
| `monero`                          | Monero / Monero                                                                                 | getmonero.org         |      | `https://www.getmonero.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                |
| `gnupg`                           | GnuPG / GnuPG                                                                                   | gnupg.org             |      | `https://gnupg.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                        |

<a id="example"></a>

## 統合例

既存 defineThemeConfig({...}) に統合し import・export・個人設定を残し、theme・i18n を重複させません。例は簡体中国語だけで、他言語は固有設定と[補完](/ja/blog/starter-guide-languages/)に従います。

```ts
theme: { enableDecoderPage: true },
i18n: {
  locales: {
    ja: {
      messages: {
        decoder: {
          input: '元の内容',
          decode: 'デコード開始',
        },
        decoderPage: {
          fullTool: '私のデコードツール',
          description: 'テキストのデコード、呼び出しの解析、アドレスの確認をローカルで行います。',
          readings: {
            tribute: 'さらに読む',
            links: [
              {
                title: '私のブログへようこそ',
                href: '/ja/blog/welcome-to-anglefeint/',
                author: '著者名',
                year: '2026',
                cover: 'privacy-code',
              },
            ],
          },
        },
      },
    },
  },
},
```

<a id="fixed-behavior"></a>

## site.config で設定しない固定機能・制約

- **テキスト：** Base64 / Base64URL、URL、Hex、HTML エンティティ、Unicode エスケープ、JWT に固定対応。自動判定は成功候補が1つだけの場合で、複数は手動指定します。1回1層で自動反復しません。JWT は内容解析だけで署名検証せず、結果もテキスト表示で HTML・script は実行しません。
- **入力と履歴：** 16,384 JavaScript UTF-16コード単位、アドレスは128。全ページ履歴は10ステップ、総入力・出力262,144コード単位まで。継続・結果再利用だけがチェーンを作り、通常新送信は旧チェーンを消します。decoder-results.json へ現ステップを出力。予算は262 KBの画像サイズではありません。limits・tooLong・stepLimit で上限は変わりません。
- **呼出とアドレス：** transfer・approve・transferFrom、体系は EVM / HyperEVM / TRON で Bitcoin 呼出なし。精度は読者入力・既定空で原整数を残し、0–255の正規整数文字列を許可します。既定精度の設定はありません。実装済み EVM/HyperEVM・TRON・Bitcoin の形式・検査に対応し、所有・残高・信頼を証明しません。
- **通信とプライバシー：** デコードは RPC 要求・入力送信なし。ただしモジュール・CSS・画像・統計などは通信し、完全オフラインを意味しません。コピーはブラウザー依存、出力 JSON は原入力と出力を含みます。
- **初期 UI：** テキスト・自動判定、体系 EVM、Bitcoin Mainnet。defaultTask・defaultFormat・maxSteps・RPC URL・チェーン一覧・例一覧・背景スイッチはありません。動き軽減はシステム設定に従います。

ここでの Decoder 項目はすべて使われ、追加の旧互換設定は不要です。About の旧未使用は前述のとおり。文面は算法引数ではありません。[総合案内](/ja/blog/config-reference/)へ。
