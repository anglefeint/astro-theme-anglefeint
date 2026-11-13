---
tags: ['anglefeint', 'config']
title: '設定字典：Decoder'
subtitle: '獨立解碼頁面、About 內嵌工具與延伸閱讀卡片。'
description: '以實際程式碼查閱 Decoder 開關、文字與任務文字、閱讀列表和封面設定，說明預設值、限制及目前生效範圍。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

想先找到設定檔案，讀[安裝與網站資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)；頁面啟停見[頁面與功能自訂教學](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)。本文用於查欄位，其他模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

這裡的「閱讀卡片」是 Decoder 頁面底部的延伸閱讀連結，不是 Blog List 的文章卡片，也不會根據部落格文章自動生成。預設值來自目前主題套件，不能把 demo 的覆寫值當成主題預設值。

<a id="page-enabled"></a>

## theme.enableDecoderPage：獨立頁面開關

- **型別 / 預設值：** boolean / true。
- **作用與狀態：** 生效。為啟用語言生成 `/<locale>/decoder/` 獨立頁面；公共導覽及 About 彈窗中的完整工具跳轉入口隨之啟停。
- **限制：** 關閉獨立頁面不關閉 About 的內嵌文字解碼器；About 自身由 theme.enableAboutPage 控制。它也不刪除已公開內容或保證清除舊部署檔案。改設定後需要重新建置部署。
- **範例：** `theme: { enableDecoderPage: false }`。

| 功能                  | 獨立 Decoder 頁面       | About 內嵌解碼器                                    |
| --------------------- | ----------------------- | --------------------------------------------------- |
| 文字格式解碼          | 有                      | 有                                                  |
| Token call / 地址檢查 | 有                      | 無                                                  |
| 多步驟歷史、JSON 導出 | 有                      | 無                                                  |
| 閱讀卡片、致敬文字    | 有                      | 無                                                  |
| 工具內通用文字        | messages.decoder        | messages.decoder                                    |
| 標題與入口文字        | messages.decoderPage 等 | About 的 sidebar.decryptor / modals.decryptor.title |

About 的舊 header、keysLabel、currentPassphraseLabel、masterKeyLabel、transientKeyLabel 仍被型別接受，但目前 Decoder 不讀取，見[About 工具欄位](/zh-hant/blog/config-about/#modal-fields)。改這些舊欄位不會改變本頁。

<a id="text-messages"></a>

## messages.decoder：通用文字工具文字

完整前綴是 `i18n.locales.<locale>.messages.decoder.`。每項均為可省略的 **string**；預設取內建目前語言文字及語言回退鏈。下面列中文 / 英文預設值，每行的範例是欄位值。所有欄位都是條件生效：有對應工具、操作或狀態時使用；不設定也有預設值。空字串會覆寫文字，不是關閉控制項的方式；錯誤查找的部分分支還會回退到其他提示。

| 欄位          | 簡體中文 / 英文預設值                                                                    | 作用與限制                                                  | 範例值                         |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------ |
| `input`       | 输入 / Input                                                                             | 輸入區域標籤和歷史步驟中的原始輸入標籤                      | `"原始內容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | 輸入欄位佔位提示；不預填內容                                | `"粘貼需要解碼的文本"`         |
| `format`      | 格式 / Format                                                                            | 文字格式選擇器標籤；不增加或刪除支援格式                    | `"編碼格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | 自動識別選項文字；不改變識別算法                            | `"自動判斷"`                   |
| `decode`      | 解码 / Decode                                                                            | 提交解碼按鈕文字                                            | `"開始解碼"`                   |
| `clear`       | 清空 / Clear                                                                             | 清空按鈕；清理目前輸入、輸出和步驟                          | `"清空內容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | 複製結果按鈕文字；按鈕在有可複製結果時啟用                  | `"復制結果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | 使用結果繼續輸入按鈕；過長結果不能回填                      | `"繼續解碼"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | 支援格式說明的前綴                                          | `"支援格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | HTML 實體格式名稱，不改變解碼規則                           | `"HTML 實體"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Unicode 轉義格式名稱，不改變解碼規則                        | `"Unicode 轉義"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | JWT 提示；獨立頁說明和 JWT 成功狀態使用，不能靠文字啟用驗簽 | `"僅解碼，不驗證簽名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | 剪貼板複製成功狀態                                          | `"已復制結果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | 剪貼板複製失敗狀態，不是解碼失敗                            | `"無法復制，請手動選擇文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | 結果區標題、無障礙名稱及歷史步驟中的輸出標籤                | `"解碼結果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | 工具底部的本機處理說明；不是停用整站網路請求的開關          | `"輸入由瀏覽器本地處理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | 初始及重置後的就緒狀態                                      | `"等待輸入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | 處理及顯示過程中的狀態                                      | `"處理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | 成功狀態，可附加格式名及 JWT 提示                           | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | 空輸入錯誤                                                  | `"請先輸入內容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | 超過輸入上限的錯誤；地址任務有更小上限，改文字不改限制      | `"輸入超過限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | 無效資料及未匹配其他錯誤文字時的最終備援                    | `"無法解析，請檢查輸入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | 二進制資料或不能安全顯示為 UTF-8 文字時的提示               | `"結果不是可讀文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | 自動識別沒有找到可用格式時的提示                            | `"無法識別，請手動選擇格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | 自動識別得到多個候選時的提示                                | `"存在多種可能，請選擇格式。"` |
| `example`     | 示例 / Example                                                                           | 範例按鈕文字；範例內容由實作提供，不能用此欄位替換          | `"試用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage：獨立頁面與任務文字

完整前綴是 `i18n.locales.<locale>.messages.decoderPage.`。下表三十一項均為可省略的 **string**，預設規則與上表相同；型別與範例值均按字串填寫。除 fullTool 還用於 About 的完整工具連結外，這組欄位主要用於獨立頁。內嵌工具沒有相應任務，不會因填寫文字出現完整模式。

| 欄位            | 簡體中文 / 英文預設值                                                                                                                                                                                                                                                                                                                                                                                                         | 狀態、作用與限制                                                                                                           | 範例值                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | 條件生效：頁面中繼描述及標題下介紹，也用於 WebApplication 結構化資料                                                       | `"本地解碼文本、解析調用并檢查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | 條件生效：頁面 h1、結構化資料名稱、工具說明區域無障礙名稱，以及 About 彈窗跳轉連結文字；不替換文檔標題中固定的 Decoder Lab | `"我的解碼工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | 條件生效：三類任務選項卡組的無障礙名稱                                                                                     | `"選擇任務"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | 條件生效：文字任務選項卡和說明標題                                                                                         | `"文本解碼"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | 條件生效：代幣呼叫選項卡、說明標題、歷史格式名；還拼入瀏覽器文檔標題                                                       | `"代幣調用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | 條件生效：地址任務選項卡、說明標題和歷史格式名                                                                             | `"地址格式檢查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | 條件生效：地址模式輸入欄位說明及無障礙描述的一部分                                                                         | `"粘貼需要檢查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | 條件生效：體系下拉框標籤；EVM 等實際選項固定，不由文字擴展                                                                 | `"地址體系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | 條件生效：代幣小數位數輸入標籤；非法精度產生 decimals 錯誤時也用此文字作為提示                                             | `"代幣小數位數"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | 條件生效：代幣精度選用輸入說明；修改文字不會設定預設精度                                                                   | `"如需可讀金額，請填寫代幣精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | 條件生效：Bitcoin 網路下拉框標籤；不改變網路選項                                                                           | `"Bitcoin 網路"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | 條件生效：處理步驟區域標題及無障礙名稱                                                                                     | `"處理歷史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | 條件生效：歷史記錄中「從這一步繼續」按鈕，回填該步輸出並切回文字任務                                                       | `"繼續處理此結果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | 條件生效：步驟導出按鈕；導出為 JSON 檔案，不是擷圖                                                                         | `"導出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | 條件生效：步驟區限制說明；僅是文字，不改變實際限制                                                                         | `"最多 10 步，輸入不超過 16,384 字元。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | 條件生效：呼叫模式提示及說明段落，解釋解析能力邊界                                                                         | `"解析不代表鏈上驗證。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | 條件生效：地址模式及說明段落的邊界提示                                                                                     | `"格式正確不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | 條件生效：不支援的任務體系或呼叫方法的錯誤                                                                                 | `"僅支援 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | 條件生效：驗證和錯誤                                                                                                       | `"地址校驗和無效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | 條件生效：ABI 參數長度錯誤                                                                                                 | `"調用參數長度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | 條件生效：Bitcoin 地址與所選網路不匹配                                                                                     | `"地址與當前 Bitcoin 網路不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | 條件生效：步驟達到上限的錯誤，不能用文字調大上限                                                                           | `"步驟已滿，請清空后重試。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | 條件生效：歷史輸入與輸出達到內存預算的錯誤                                                                                 | `"歷史內容過多，請清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | 條件生效：地址歷史子步驟：解析編碼                                                                                         | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | 條件生效：地址歷史子步驟：檢查格式和驗證和                                                                                 | `"檢查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | 條件生效：地址或呼叫歷史子步驟：顯示地址表示                                                                               | `"展示地址結果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | 條件生效：呼叫歷史子步驟：解析選擇器和參數                                                                                 | `"解析調用參數"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | 條件生效：未填精度時的呼叫歷史子步驟                                                                                       | `"保留原始整數"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | 條件生效：提供精度後的呼叫歷史子步驟                                                                                       | `"按精度顯示金額"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | 條件生效：獨立頁呼叫說明段落；需要 calldata，不是交易哈希                                                                  | `"粘貼 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | 條件生效：獨立頁動態載入加密解析模組失敗時的錯誤；不是所有頁面通用的網路錯誤                                               | `"解析模塊載入失敗，請刷新重試。"`             |

文檔標題目前拼成 Decoder Lab | Base64 · JWT · 加上 callTask 文字；沒有單獨的 decoderPage.title 欄位。fullTool 不會替換其中固定的 Decoder Lab。頁內沒有把所有品牌名、網路名、格式名都做成設定；修改文字也不會增加新任務。

<a id="readings"></a>

## messages.decoderPage.readings：閱讀區

完整前綴仍是 `i18n.locales.<locale>.messages.decoderPage`。`readings` 本身是可省略的物件；其預設值在語言文字中未設定，由閱讀組件根據目前語言提供內建文字及 16 張卡片。組件不認識的語言使用英文預設閱讀內容；這是閱讀組件自己的預設，不是每種語言都有相同標題。

| 欄位             | 型別 / 預設值                                                   | 狀態、作用與限制                                                                                                          | 範例值                                                                |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| readings.tribute | string，可省略 / 內建目前語言致敬文字，簡體中文及英文全文見下文 | 條件生效：獨立頁面底部致敬段落；空字串隱藏段落，不隱藏卡片。按以純文字呈現，部分“密码朋克”詞自動加粗，不解析設定中的 HTML | '感謝這些思想與工具的作者。'                                          |
| readings.links   | DecoderReading[]，可省略 / 内置 16 项列表，见下文               | 條件生效：整組替換預設卡片，順序按陣列，不與預設列表拼接；無設定條數上限。空陣列隱藏卡片，不隱藏致敬段落                  | [{ title: '我的文章', href: '/zh-hant/blog/welcome-to-anglefeint/' }] |

readings.links 的每個元素有以下五個欄位。表中“无”指自訂條目沒有自動補值，不表示內建卡片沒有這些資訊。

| 欄位（完整相對路徑）    | 型別 / 預設值           | 狀態、作用與限制                                                                                                                                  | 範例值                                 |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| readings.links[].title  | string，必填 / 無       | 條件生效：卡片標題；為空或純空白會過濾整張卡片。文字不解析 Markdown 或 HTML                                                                       | '我的文章'                             |
| readings.links[].href   | string，必填 / 無       | 條件生效：整卡跳轉地址；只接受以 HTTP(S):// 或單個 / 開頭的值，雙斜線協議相對地址、mailto、錨點和一般相對路徑被過濾。只是前綴檢查，不驗證目標存在 | '/zh-hant/blog/welcome-to-anglefeint/' |
| readings.links[].author | string，可省略 / 未設定 | 條件生效：與年份以中點連線顯示；空值不顯示，不自動取 site.author                                                                                  | '作者名'                               |
| readings.links[].year   | string，可省略 / 未設定 | 條件生效：顯示年份或說明文字；不解析為日期、不參與排序。填寫字串，不填數字                                                                        | '2026'                                 |
| readings.links[].cover  | string，可省略 / 未設定 | 條件生效：內建封面識別碼，或 HTTP(S):// 地址、單個 / 開頭的圖片路徑；空值、未知識別碼、不支援的路徑不顯示封面，不過濾卡片                         | 'privacy-code'                         |

卡片連結在新標籤頁打開，帶 noopener noreferrer；站內根路徑會按 Astro 的 BASE_URL 加前綴，設定時不要再次手動添加同一部署前綴。href 和自訂 cover 沒有自動 trim，填寫時不要加首尾空格。

內建封面識別碼有以下十六個：

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

自訂圖片例如 public/images/decoder/my-cover.webp 對應設定 /images/decoder/my-cover.webp，不寫 public 前綴，也不寫 src/assets 下的原始碼路徑。閱讀封面以 16:9 區域裁切顯示。內建封面使用回應式尺寸；自訂路徑或遠程封面直接以 img 輸出，不會自動進入部落格封面的多尺寸生成管線。請自行準備適當大小；載入失敗不會自動換成內建圖。空封面也能保留純文字卡片。

只隱藏閱讀區而保留工具：

```ts
i18n: {
  locales: {
    'zh-hant': {
      messages: {
        decoderPage: { readings: { tribute: '', links: [] } },
      },
    },
  },
},
```

<a id="reading-defaults"></a>

### 預設致敬文字和卡片

簡體中文預設致敬文字（保留實際原文）：谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

英文預設致敬文字：In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

下面依實際順序列出全部預設卡片；空白作者或年份表示未設定。預設外鏈包含主題附帶的來源參數；這是內建資料，不會自動加到你自訂的 href 上。

| 封面識別碼                        | 簡體中文標題 / 英文標題                                                                         | 作者                  | 年份 | href                                                                                                                                                                                                           |
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

## 合併設定範例

寫入 `src/site.config.ts` 現有的 `defineThemeConfig({...})`；保留 import、export 和其他個人設定，不要重複建立 theme 或 i18n。以下只覆寫繁體中文，其他語言仍按自己的設定與回退鏈解析，詳見[多語言教學](/zh-hant/blog/starter-guide-languages/)。

```ts
theme: { enableDecoderPage: true },
i18n: {
  locales: {
    'zh-hant': {
      messages: {
        decoder: {
          input: '原始內容',
          decode: '開始解碼',
        },
        decoderPage: {
          fullTool: '我的解碼工具',
          description: '本地解碼文本、解析調用并檢查地址。',
          readings: {
            tribute: '延伸閱讀',
            links: [
              {
                title: '歡迎來到我的部落格',
                href: '/zh-hant/blog/welcome-to-anglefeint/',
                author: '作者名',
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

## 這些能力和限制不由 site.config 設定

- **文字：** 固定支援 Base64 / Base64URL、URL、Hex、HTML 實體、Unicode 轉義、JWT。自動識別只接受一個成功候選；多個候選要求手動選格式。每次提交處理一層，不是自動循環解碼。JWT 只解析內容，不驗證簽名；輸出作為文字顯示，不執行解碼得到的 HTML 或腳本。
- **輸入與歷史：** 輸入上限 16,384 個 JavaScript UTF-16 碼元；地址任務另有 128 碼元上限。完整頁歷史最多 10 步，累計輸入與輸出最多 262,144 碼元。繼續步驟或使用結果才形成處理鏈，一般新提交會清理舊鏈；導出目前步驟為 decoder-results.json。內存預算不是「262 KB 圖片大小」。改 limits、tooLong 或 stepLimit 文字不改變任何限制。
- **呼叫與地址：** 呼叫支援 transfer、approve、transferFrom；體系為 EVM / HyperEVM / TRON，Bitcoin 不支援代幣呼叫。精度由讀者輸入，預設留空，保留原始整數；允許 0–255 的規範整數字串，不能用設定預設預設精度。地址檢查支援 EVM / HyperEVM、TRON、Bitcoin 的已實作格式和驗證規則；它不證明歸屬、余額或可信度。
- **網路與隱私：** 解碼邏輯不請求 RPC 或上傳輸入；模組、樣式、圖片和網站自身的統計等仍可能請求網路。「本機處理」不代表整個頁面離線可用。複製相依瀏覽器剪貼板能力；導出檔案包含目前步驟的原始輸入與輸出。
- **介面預設：** 初始為文字任務、自動識別；體系預設 EVM，Bitcoin 網路預設 Mainnet。沒有公開的 defaultTask、defaultFormat、maxSteps、RPC URL、支援鏈清單、範例輸入列表或背景開關。減少動態效果由系統偏好處理。

目前字典涉及的 Decoder 欄位都有消費位置，沒有額外的 Decoder 相容設定需要填寫。About 中不再消費的舊欄位已在前文單獨指出；文字欄位只是顯示內容，不能當作算法參數。返回[設定字典總入口](/zh-hant/blog/config-reference/)查其他模組。
