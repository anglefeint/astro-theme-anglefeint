---
tags: ['anglefeint', 'config']
title: '設定字典：終端機提示與唯讀閱讀器'
subtitle: 'About 虛擬終端機的十六項文字、佔位符和設定邊界。'
description: '依實際程式碼解釋終端機文字的型別、預設值、佔位符、空值回退和生效狀態，標明 readerTitle 目前未使用。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

設定檔案位置見[安裝與網站資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)，About 內容和工具見[About 字典](/zh-hant/blog/config-about/)，其他模組從[設定總入口](/zh-hant/blog/config-reference/)進入。

目前標準網站由 About 承載互動虛擬終端機。這裡修改指令提示、錯誤文字和唯讀閱讀器的無障礙名稱，不執行本機或伺服器 shell。首頁寬屏終端機裡的作者文字由 messages.home.transmission 控制，見[首頁字典](/zh-hant/blog/config-home/#home-transmission)，不使用這組消息。

<a id="messages"></a>

## messages.terminal 的十六個欄位

完整前綴為 `i18n.locales.<语言>.messages.terminal`。每項都是可省略的 string 覆寫，預設使用內建目前語言文字及一般語言回退鏈。表中僅列中文 / 英文預設值，範例是對應欄位的值。生效還要求 About 頁面開啟、終端機成功初始化，並出現相應指令結果或閱讀模式。

| 欄位            | 簡體中文 / 英文預設值                                                                                                               | 狀態、作用與限制                                                                                 | 範例值                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | 條件生效：終端機輸入欄位的無障礙名稱；不改變指令提示符路徑，也不是可見的面板標題                 | `"终端输入"`                           |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | 條件生效：About 終端機初始化的提示行；啟動還會執行虛擬 pwd。空字串只清空提示，不關閉終端機       | `"输入 help 查看命令。"`               |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | 條件生效：help 輸出的說明行；後面仍附帶固定指令幫助，空字串不隱藏整個幫助列表                    | `"只读浏览公开文章，不运行系统命令。"` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | 條件生效：指令中引號或轉義未結束時的提示；空字串回退為鍵名 syntax                                | `"引号或转义未结束。"`                 |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | 條件生效：指令參數數量不符時的提示；{value} 替換為指令用法，空字串回退鍵名 usage                 | `"用法：{value}"`                      |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | 條件生效：不支援的指令；{value} 替換為指令名，不能用文字新增指令                                 | `"不支持命令：{value}"`                |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | 條件生效：虛擬檔案或目錄不存在；{value} 是請求路徑，不是遠端 HTTP 狀態                           | `"未找到：{value}"`                    |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | 條件生效：cd 的目標不是目錄；{value} 是目標路徑                                                  | `"不是目录：{value}"`                  |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | 條件生效：cat / vi / vim / view 的目標不是檔案；{value} 是目標路徑                               | `"目标不是文件：{value}"`              |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | 條件生效：讀取檔案失敗的通用提示；{value} 是路徑，原始錯誤詳情不會自動拼入                       | `"读取失败：{value}"`                  |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | 條件生效：檔案超過讀取限制；{value} 是路徑。只改文字，不調大實際上限                             | `"文件过大：{value}"`                  |
| `empty`         | （空目录） / (empty directory)                                                                                                      | 條件生效：ls 結果沒有條目時的提示；不是空檔案內文提示                                            | `"目录为空。"`                         |
| `loading`       | 正在读取… / Loading…                                                                                                                | 條件生效：指令執行等待期間 Canvas 輸入位置的提示；空字串回退為 ...，不改變網路載入策略           | `"正在读取…"`                          |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | 目前未使用：型別與內建文字仍保留，但閱讀器標題實際使用檔案 title 或 path。填寫它不會覆寫閱讀標題 | `"文章阅读器"`                         |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | 條件生效：唯讀閱讀器提示；空字串回退 :q。改文字不會改變退出指令或快捷鍵                          | `"只读 · :q 回车退出 · Esc 关闭"`      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | 條件生效：閱讀模式輸入欄位的無障礙名稱；空字串回退到原終端機輸入欄位名稱                         | `"阅读器命令输入"`                     |

<a id="placeholders"></a>

## {value} 佔位符和空字串

usage、unknown、notFound、notDirectory、isDirectory、failed、tooLarge 使用字面佔位符 {value}。腳本只替換第一次出現；需要顯示指令或路徑時保留一次，不使用 {path}、{command} 等未支援名字。替換值作為文字顯示，不會當作程序執行。

這組消息沒有統一的“空字符串关闭功能”規則：上述指令錯誤欄位以及 syntax 為空時會回退到欄位鍵名；loading 回退 ...，readerHint 回退 :q，readerCommand 回退原輸入標籤。hint、help、empty 的空字串可以清空對應文字，但不會移除終端機、固定幫助指令或目錄。

readerTitle 是目前未使用欄位，不是控制讀者介面標題的開關；即使預設字串仍在語言包中，也沒有對應消費效果。

<a id="example"></a>

## 可合併的中文範例

合併進 src/site.config.ts 現有 defineThemeConfig({...})，保留其他設定，不重複建立 i18n。只覆寫中文時，不會自動改其他語言；語言回退規則見[語言字典](/zh-hant/blog/config-languages/#fallback)。

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

## 終端機還使用哪些設定？

| 設定                                    | 對終端機的作用                                                                         | 主說明                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| theme.enableAboutPage                   | boolean，預設 true；關閉後不生成標準 About，自然也不呈現該頁面終端機                   | [About 開關](/zh-hant/blog/config-about/#page-enabled)         |
| `i18n.locales.<语言>.about.scriptsPath` | string，預設 /root/bash/scripts；虛擬檔案路徑前綴和初始目錄，不是伺服器磁磁碟路徑      | [About 工具設定](/zh-hant/blog/config-about/#tool-fields)      |
| `i18n.locales.<语言>.about.sections`    | 公開個人介紹參與虛擬 about.md 的內容；不是終端機錯誤文字                               | [About 內文](/zh-hant/blog/config-about/#body-fields)          |
| 目前語言文章                            | 自動進入虛擬檔案目錄，依需求讀取主題生成的文章 JSON，不需要在 site.config 手動登記每篇 | [寫文章](/zh-hant/blog/starter-guide-2-languages-and-routing/) |

About 的 sidebar.allScripts、modals.allScripts.title 只改工具入口和目錄彈窗，不會重新命名終端機指令。effects.backgroundLines 在目前互動 session 中不是用於替換初始提示的有效設定；具體降級狀態見[About 效果欄位](/zh-hant/blog/config-about/#effect-fields)。

<a id="limits"></a>

## 固定能力和限制，不是 site.config 欄位

- 虛擬指令包括 help、clear、pwd、ls、cd、cat、vi、vim、view；About 還整合 open、close、minimize、maximize、restore 視窗指令。支援列表由實作決定，改 help 或 unknown 文字不能增加系統指令。
- vi / vim / view 進入唯讀閱讀器，不是編輯器。輸入 :q、:q! 或 q 並Enter可退出，Esc 也可關閉閱讀模式；readerHint 只改提示，不改變這些操作。
- 預設指令輸入最多 512 個 JavaScript UTF-16 碼元，指令歷史最多 50 條。檔案讀取預設最多 262,144 個碼元；超限顯示 tooLarge。網路回應另有有界讀取保護，不應把這個值理解為允許上傳的檔案大小。
- 文章依需求從同來源 JSON 讀取；不是開放任意 URL 的下載器，不讀取任意本機目錄。純文字虛擬檔案和目錄本身並不一定觸發網路請求。
- 終端機字號、顏色、字型、輸入上限、歷史條數、檔案讀取上限等雖是內部組件或函數參數，目前沒有對應的公開 site.config 設定路徑。未設定 API key，也不連線 SSH、真實 shell 或遠端 AI。

保存後重新讀取開發設定，正式網站重新建置部署。檢查文字時觸發對應指令或閱讀模式，不能只看靜態頁面標題；尤其 readerTitle 目前不會改變介面。返回[設定總入口](/zh-hant/blog/config-reference/)繼續查閱。
