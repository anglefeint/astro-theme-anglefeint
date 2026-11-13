---
tags: ['anglefeint', 'config']
title: '配置字典：终端提示与只读阅读器'
subtitle: 'About 虚拟终端的十六项文案、占位符和配置边界。'
description: '按实际代码解释终端文案的类型、默认值、占位符、空值回退和生效状态，标明 readerTitle 当前未使用。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

配置文件位置见[安装与站点信息](/zh/blog/starter-guide-1-configure-your-site/)，About 内容和工具见[About 字典](/zh/blog/config-about/)，其他模块从[配置总入口](/zh/blog/config-reference/)进入。

当前标准站点由 About 承载交互虚拟终端。这里修改命令提示、错误文字和只读阅读器的无障碍名称，不执行本机或服务器 shell。首页宽屏终端里的作者文字由 messages.home.transmission 控制，见[首页字典](/zh/blog/config-home/#home-transmission)，不使用这组消息。

<a id="messages"></a>

## messages.terminal 的十六个字段

完整前缀为 `i18n.locales.<语言>.messages.terminal`。每项都是可省略的 string 覆盖，默认使用内置当前语言文案及普通语言回退链。表中仅列中文 / 英文默认值，示例是对应字段的值。生效还要求 About 页面开启、终端成功初始化，并出现相应命令结果或阅读模式。

| 字段            | 中文 / 英文默认值                                                                                                                   | 状态、作用与限制                                                                                 | 示例值                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | 条件生效：终端输入框的无障碍名称；不改变命令提示符路径，也不是可见的面板标题                     | `"终端输入"`                           |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | 条件生效：About 终端初始化的提示行；启动还会执行虚拟 pwd。空字符串只清空提示，不关闭终端         | `"输入 help 查看命令。"`               |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | 条件生效：help 输出的说明行；后面仍附带固定命令帮助，空字符串不隐藏整个帮助列表                  | `"只读浏览公开文章，不运行系统命令。"` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | 条件生效：命令中引号或转义未结束时的提示；空字符串回退为键名 syntax                              | `"引号或转义未结束。"`                 |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | 条件生效：命令参数数量不符时的提示；{value} 替换为命令用法，空字符串回退键名 usage               | `"用法：{value}"`                      |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | 条件生效：不支持的命令；{value} 替换为命令名，不能用文案新增命令                                 | `"不支持命令：{value}"`                |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | 条件生效：虚拟文件或目录不存在；{value} 是请求路径，不是远端 HTTP 状态                           | `"未找到：{value}"`                    |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | 条件生效：cd 的目标不是目录；{value} 是目标路径                                                  | `"不是目录：{value}"`                  |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | 条件生效：cat / vi / vim / view 的目标不是文件；{value} 是目标路径                               | `"目标不是文件：{value}"`              |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | 条件生效：读取文件失败的通用提示；{value} 是路径，原始错误详情不会自动拼入                       | `"读取失败：{value}"`                  |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | 条件生效：文件超过读取限制；{value} 是路径。只改文字，不调大实际上限                             | `"文件过大：{value}"`                  |
| `empty`         | （空目录） / (empty directory)                                                                                                      | 条件生效：ls 结果没有条目时的提示；不是空文件正文提示                                            | `"目录为空。"`                         |
| `loading`       | 正在读取… / Loading…                                                                                                                | 条件生效：命令执行等待期间 Canvas 输入位置的提示；空字符串回退为 ...，不改变网络加载策略         | `"正在读取…"`                          |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | 当前未使用：类型与内置文案仍保留，但阅读器标题实际使用文件 title 或 path。填写它不会覆盖阅读标题 | `"文章阅读器"`                         |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | 条件生效：只读阅读器提示；空字符串回退 :q。改文字不会改变退出命令或快捷键                        | `"只读 · :q 回车退出 · Esc 关闭"`      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | 条件生效：阅读模式输入框的无障碍名称；空字符串回退到原终端输入框名称                             | `"阅读器命令输入"`                     |

<a id="placeholders"></a>

## {value} 占位符和空字符串

usage、unknown、notFound、notDirectory、isDirectory、failed、tooLarge 使用字面占位符 {value}。脚本只替换第一次出现；需要显示命令或路径时保留一次，不使用 {path}、{command} 等未支持名字。替换值作为文本显示，不会当作程序执行。

这组消息没有统一的“空字符串关闭功能”规则：上述命令错误字段以及 syntax 为空时会回退到字段键名；loading 回退 ...，readerHint 回退 :q，readerCommand 回退原输入标签。hint、help、empty 的空字符串可以清空对应文字，但不会移除终端、固定帮助命令或目录。

readerTitle 是当前未使用字段，不是控制读者界面标题的开关；即使默认字符串仍在语言包中，也没有对应消费效果。

<a id="example"></a>

## 可合并的中文示例

合并进 src/site.config.ts 现有 defineThemeConfig({...})，保留其他配置，不重复创建 i18n。只覆盖中文时，不会自动改其他语言；语言回退规则见[语言字典](/zh/blog/config-languages/#fallback)。

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

## 终端还使用哪些配置？

| 配置                                    | 对终端的作用                                                                         | 主说明                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| theme.enableAboutPage                   | boolean，默认 true；关闭后不生成标准 About，自然也不呈现该页面终端                   | [About 开关](/zh/blog/config-about/#page-enabled)         |
| `i18n.locales.<语言>.about.scriptsPath` | string，默认 /root/bash/scripts；虚拟文件路径前缀和初始目录，不是服务器磁盘路径      | [About 工具设置](/zh/blog/config-about/#tool-fields)      |
| `i18n.locales.<语言>.about.sections`    | 公开个人介绍参与虚拟 about.md 的内容；不是终端错误文案                               | [About 正文](/zh/blog/config-about/#body-fields)          |
| 当前语言文章                            | 自动进入虚拟文件目录，按需读取主题生成的文章 JSON，不需要在 site.config 手动登记每篇 | [写文章](/zh/blog/starter-guide-2-languages-and-routing/) |

About 的 sidebar.allScripts、modals.allScripts.title 只改工具入口和目录弹窗，不会重命名终端命令。effects.backgroundLines 在当前交互 session 中不是用于替换初始提示的有效配置；具体降级状态见[About 效果字段](/zh/blog/config-about/#effect-fields)。

<a id="limits"></a>

## 固定能力和限制，不是 site.config 字段

- 虚拟命令包括 help、clear、pwd、ls、cd、cat、vi、vim、view；About 还接入 open、close、minimize、maximize、restore 窗口命令。支持列表由实现决定，改 help 或 unknown 文案不能增加系统命令。
- vi / vim / view 进入只读阅读器，不是编辑器。输入 :q、:q! 或 q 并回车可退出，Esc 也可关闭阅读模式；readerHint 只改提示，不改变这些操作。
- 默认命令输入最多 512 个 JavaScript UTF-16 码元，命令历史最多 50 条。文件读取默认最多 262,144 个码元；超限显示 tooLarge。网络响应另有有界读取保护，不应把这个值理解为允许上传的文件大小。
- 文章按需从同源 JSON 读取；不是开放任意 URL 的下载器，不读取任意本地目录。纯文本虚拟文件和目录本身并不一定触发网络请求。
- 终端字号、颜色、字体、输入上限、历史条数、文件读取上限等虽是内部组件或函数参数，当前没有对应的公开 site.config 配置路径。未配置 API key，也不连接 SSH、真实 shell 或远端 AI。

保存后重新读取开发配置，正式网站重新构建部署。检查文案时触发对应命令或阅读模式，不能只看静态页面标题；尤其 readerTitle 当前不会改变界面。返回[配置总入口](/zh/blog/config-reference/)继续查阅。
