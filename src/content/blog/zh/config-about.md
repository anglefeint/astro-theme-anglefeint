---
tags: ['anglefeint', 'config']
title: '配置字典：About'
subtitle: '个人介绍、联系方式、工具面板与 Hacker 终端。'
description: '以实际代码查阅 About 的内容、文案、工具与效果配置，标明默认值、限制和当前未使用的旧字段。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

想先替换自己的介绍，读[页面与功能定制教程](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)；配置文件位置与安装见[第一篇教程](/zh/blog/starter-guide-1-configure-your-site/)。其他模块从[配置字典总入口](/zh/blog/config-reference/)进入。

About 不从某篇 Markdown 文章读取正文。内容写在 `src/site.config.ts` 的 `i18n.locales.<语言>.about` 中；页面和章节标题则在同一语言的 `messages.about` 中。以下列出主题包默认值，不能把 demo 的个人介绍当成默认值。

<a id="page-enabled"></a>

## theme.enableAboutPage：页面开关

- **类型 / 默认值：** boolean / true。
- **状态与作用：** 生效。开启时为启用语言生成 `/<语言>/about/`；关闭时不生成标准 About 页面，相应公共导航和 Contact 入口也不再提供 About 目标。
- **限制：** 不是隐藏某一段正文的开关，不删除内容配置。直接访问已关闭页面不会自动跳转到首页。修改后需重新构建部署；关闭也不能作为删除旧部署文件或已公开数据的保证。
- **示例：** `theme: { enableAboutPage: false }`。

<a id="about-content"></a>

## About 内容与工具字段

以下表格的完整前缀均为 **`i18n.locales.<语言>.about.`**。例如 `sections.who` 的完整路径是 `i18n.locales.zh.about.sections.who`。类型是合并前允许覆盖的字段类型，均可省略；省略后通过语言回退和主题默认配置补齐。当前 zh / en 的 about 默认内容均来自同一套英文占位配置，所以下表对两者使用同一个默认值。其他语言可能有独立翻译，不应照搬这些英文默认值推断。

字符串字段没有通用长度或 URL 格式校验；应按用途填写短文案、有效邮箱或链接。数组必须填写 string[]，覆盖时整组替换，不逐项合并。空字符串不是通用的“关闭”方式，具体行为见每行。表中示例是该字段的值，需要放入对应对象层级。

<a id="body-fields"></a>

### 正文

| 字段                   | 类型     | zh / en 默认值                                                                                       | 状态、作用与限制                                             | 示例值                              |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | 生效；标题上方状态行，空字符串隐藏这一行                     | `"profile ready"`                   |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | 生效；Who 段落正文，不修改章节标题                           | `"我是一名前端开发者。"`            |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | 生效；What 段落正文                                          | `"我在构建个人博客与开源工具。"`    |
| `sections.ethos`       | string[] | 见[数组默认值](#array-defaults)中的 sections.ethos                                                   | 生效；每个数组元素是一项原则；空数组清空条目，不隐藏章节标题 | `["先保证清晰。","持续小步交付。"]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | 生效；Now 段落正文                                           | `"最近在学习 Astro。"`              |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | 生效；联系段落开头，与后面的引导文字及链接拼接               | `"欢迎交流。"`                      |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | 生效；底部引用块，同时进入虚拟 about.md                      | `"保持好奇。"`                      |

<a id="contact-fields"></a>

### 联系

| 字段                  | 类型   | zh / en 默认值                  | 状态、作用与限制                                                                                   | 示例值                          |
| --------------------- | ------ | ------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`             | 条件生效；trim 后为空则不渲染邮件链接及 contactEmailLead；链接实际使用原字符串，填写时勿加首尾空格 | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"` | 生效；联系链接地址，不受 social.links 控制；空值不会自动隐藏整个链接，建议使用完整 HTTPS 地址      | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                      | 生效；上述链接的可见文字，名称不限定为 GitHub                                                      | `"我的 GitHub"`                 |

<a id="tool-fields"></a>

### 工具入口

| 字段                 | 类型   | zh / en 默认值         | 状态、作用与限制                                                             | 示例值             |
| -------------------- | ------ | ---------------------- | ---------------------------------------------------------------------------- | ------------------ |
| `sidebar.dlData`     | string | `"DL Data"`            | 生效；侧栏 DL Data 按钮及无障碍名称；改名不改变功能                          | `"数据面板"`       |
| `sidebar.ai`         | string | `"AI"`                 | 生效；侧栏 AI 按钮及无障碍名称                                               | `"我的工具栈"`     |
| `sidebar.decryptor`  | string | `"Decryptor"`          | 生效；侧栏解码器入口；不是工具内部按钮文案                                   | `"解码工具"`       |
| `sidebar.help`       | string | `"Help"`               | 生效；侧栏键盘面板入口                                                       | `"键盘"`           |
| `sidebar.allScripts` | string | `"All Scripts"`        | 生效；侧栏当前语言文章目录入口                                               | `"全部文章"`       |
| `scriptsPath`        | string | `"/root/bash/scripts"` | 生效；文章目录显示路径、虚拟文件前缀及终端初始目录；不是服务器或本机磁盘路径 | `"/home/me/notes"` |

<a id="label-fields"></a>

### 通用文案

| 字段                        | 类型   | zh / en 默认值    | 状态、作用与限制                                                                          | 示例值         |
| --------------------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------- | -------------- |
| `labels.modalOutput`        | string | `"Output"`        | 当前未用于打开后的工具标题；仅提供弹窗 HTML 的初始占位，打开时被 modals 中对应 title 覆盖 | `"输出"`       |
| `labels.modalClose`         | string | `"Close"`         | 生效；工具弹窗和正文窗口关闭控件的无障碍文案；不会关闭功能本身                            | `"关闭"`       |
| `labels.responseOutput`     | string | `"Output"`        | 生效；正文面板上方 OUTPUT 标签                                                            | `"OUTPUT"`     |
| `labels.contactEmailLead`   | string | `"Reach me via"`  | 条件生效；邮箱非空时显示在邮件链接前                                                      | `"邮箱："`     |
| `labels.contactConnectLead` | string | `"or connect on"` | 生效；始终显示在联系链接前；邮箱为空也不隐藏，注意句子衔接                                | `"也可以访问"` |
| `labels.backToTop`          | string | `"Back to top"`   | 条件生效；返回顶部按钮的提示和无障碍名称，不改变出现阈值                                  | `"回到顶部"`   |
| `labels.quickAccess`        | string | `"Quick access"`  | 生效；工具侧栏导航的无障碍名称                                                            | `"快捷工具"`   |
| `labels.contactEmailLabel`  | string | `"email"`         | 条件生效；邮件链接的可见文字，不是邮箱地址；邮箱非空才显示                                | `"发邮件"`     |

<a id="modal-fields"></a>

### 工具弹窗

| 字段                                      | 类型     | zh / en 默认值                                      | 状态、作用与限制                                                            | 示例值                                      |
| ----------------------------------------- | -------- | --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                  | 条件生效；数据动画弹窗标题                                                  | `"数据传输"`                                |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                   | 条件生效；数据动画弹窗内副标题；只展示动画，不下载文件                      | `"演示数据"`                                |
| `modals.ai.title`                         | string   | `"AI"`                                              | 条件生效；AI 文本面板标题                                                   | `"工具与工作流"`                            |
| `modals.ai.lines`                         | string[] | 见[数组默认值](#array-defaults)中的 modals.ai.lines | 条件生效；按换行拼接的静态纯文字，不调用 AI；空数组产生空 pre，仍可打开面板 | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                | 条件生效；当前解码器弹窗标题，仍在使用                                      | `"本地解码工具"`                            |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                              | 当前未使用；旧计算器正文文案，当前 DecoderForm 不读取                       | `"计算中"`                                  |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                     | 当前未使用；不会改变当前解码器                                              | `"已尝试密钥"`                              |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                             | 当前未使用；不会改变当前解码器                                              | `"当前口令"`                                |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                      | 当前未使用；不会改变当前解码器                                              | `"主密钥"`                                  |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                   | 当前未使用；不会改变当前解码器                                              | `"临时密钥"`                                |
| `modals.help.title`                       | string   | `"Help"`                                            | 条件生效；键盘面板标题                                                      | `"键盘面板"`                                |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                            | 条件生效；键盘统计区标题；空字符串回退英文内置值                            | `"输入统计"`                                |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                      | 条件生效；输入计数前缀；空字符串回退英文内置值                              | `"已输入："`                                |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                      | 条件生效；输入计数后缀；空字符串回退英文内置值                              | `"个字符"`                                  |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                              | 条件生效；文章目录弹窗标题，独立于 scriptsPath，不自动联动                  | `"文章目录"`                                |

<a id="effect-fields"></a>

### 效果

| 字段                       | 类型     | zh / en 默认值                                              | 状态、作用与限制                                                                     | 示例值                  |
| -------------------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------- |
| `effects.backgroundLines`  | string[] | 见[数组默认值](#array-defaults)中的 effects.backgroundLines | 当前标准 About 页面不展示；仅在缺少交互终端 session 的降级代码分支使用，不是背景开关 | `["~ $ hello","ready"]` |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                          | 条件生效；滚动进度达到 30% 时的提示；空字符串回退 context parsed                     | `"读到这里了"`          |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                        | 条件生效；滚动进度达到 60% 时的提示；空字符串回退 inference stable                   | `"继续探索"`            |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                        | 条件生效；滚动进度达到 90% 时的提示；空字符串回退 output finalized                   | `"感谢阅读"`            |

正文字符串通过普通文本渲染，不解析 Markdown 或 HTML。段落的换行由样式保留；写 **粗体**、链接语法或 HTML 标签不会得到对应富文本。清空正文不自动删除章节标题和目录项；章节顺序与 who / what / ethos / now / contact 这五个锚点是固定的。

`scriptsPath` 建议使用以 / 开头的简短绝对虚拟目录，例如 /home/me/notes，避免换行、空字符及与文件冲突的路径。终端路径会规范化 .、.. 和重复斜杠；超过 1024 字符或含非法控制字符的路径可能使虚拟文件系统初始化失败。它既不执行系统 shell，也不读取服务器任意目录。文件来自主题生成的当前语言文章和 `about.md`；All Scripts 不是一个可以自定义脚本执行列表的配置。

DL Data 只是进度动画，不代表真实下载。AI 面板中的 model、latency 等默认文字也是静态展示，不是实时模型状态；请替换为真实的个人信息，或明确说明为演示。

Help 的三段统计文字由脚本拼入面板 HTML，建议只填可信的短纯文本，不把外部输入拼入配置；这三个字段的空字符串会回退到英文，而不是清空标签。其他 About 正文和 AI 行文本的渲染方式不同，不能一概认为所有配置都支持 HTML。

滚动提示按整个文档的滚动进度计算；用户开始滚动后，每个阈值在一次初始化中最多触发一次。它不是已读字数统计，也不是 AI 处理进度；没有公开的阈值或时长配置。填空字符串不会关闭提示。

<a id="array-defaults"></a>

### 三个数组的默认值

以下是 zh / en 实际使用的完整默认数组，顺序和空行均有含义；示例中替换数组会替换全部元素。

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## 页面标题及共用控件文案

这些字段写在 `i18n.locales.<语言>.messages` 下，不在 about 内容对象内。均为 string，可省略，默认使用内置当前语言文案及回退链；下表只列中文 / 英文默认值。例值按对应字段填写；改文案不会切换功能，也不会更改章节 ID。

### messages.about

| 字段                | 中文 / 英文默认值                                                                                       | 作用与限制                                                                                   | 示例值                     |
| ------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | 条件生效：页面标题、正文 h1、正文窗口标题和虚拟 about.md 标题                                | `"关于我"`                 |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | 条件生效：页面元描述；不在正文标题下自动新增一段介绍                                         | `"我的经历、工作与兴趣。"` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | 条件生效：Who 章节标题和目录项；不改正文或锚点                                               | `"我是谁"`                 |
| `about.what`        | 我在构建什么 / What I Build                                                                             | 条件生效：What 章节标题和目录项                                                              | `"我在做什么"`             |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | 条件生效：Ethos 章节标题和目录项                                                             | `"我的原则"`               |
| `about.now`         | 现在 / Now                                                                                              | 条件生效：Now 章节标题和目录项                                                               | `"最近在忙"`               |
| `about.contact`     | 联系 / Contact                                                                                          | 条件生效：Contact 章节标题和目录项；锚点仍是 contact                                         | `"联系我"`                 |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | 条件生效：底部重新扫描按钮的文字、提示和无障碍名称；只触发视觉扫描，不请求 AI 或重新生成正文 | `"重新扫描"`               |

### messages.windowControls

| 字段                        | 中文 / 英文默认值           | 作用与限制                                               | 示例值     |
| --------------------------- | --------------------------- | -------------------------------------------------------- | ---------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content | 条件生效：正文窗口最小化、工具弹窗折叠的文案             | `"最小化"` |
| `windowControls.expand`     | 放大窗口 / Expand window    | 条件生效：工具弹窗放大文案；正文窗口全屏使用 fullscreen  | `"放大"`   |
| `windowControls.restore`    | 还原窗口 / Restore window   | 条件生效：窗口还原及恢复入口文案                         | `"还原"`   |
| `windowControls.fullscreen` | 全屏阅读 / Full screen      | 条件生效：正文窗口请求浏览器全屏的文案；不修改浏览器权限 | `"全屏"`   |

### messages.scriptFolders

| 字段                      | 中文 / 英文默认值                                                                                            | 作用与限制                                                                 | 示例值                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------ |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | 条件生效：All Scripts 复制文章标题按钮的提示及无障碍名称；不是复制文章全文 | `"复制标题"`             |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | 条件生效：复制成功状态                                                     | `"标题已复制"`           |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | 条件生效：复制失败状态；空字符串在脚本中可能回退英文提示                   | `"复制失败，请手动复制"` |

<a id="example"></a>

## 一个可合并的配置示例

合并到 `src/site.config.ts` 现有的 `defineThemeConfig({...})` 中，保留 import、export 和其他个人配置。不要在同一对象重复创建 theme 或 i18n。

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: '我是一名前端开发者。',
          what: '我在构建个人博客与开源工具。',
          ethos: ['先保证清晰。', '持续小步交付。'],
          now: '最近在学习 Astro。',
          contactLead: '欢迎交流。',
          signature: '保持好奇。',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: '文章目录' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: '关于我', description: '我的经历、工作与兴趣。' },
      },
    },
  },
},
```

配置以语言回退链从低优先级到高优先级递归合并，当前语言覆盖回退语言，最终有基础 About 配置补齐。数组整体替换，undefined 不覆盖已有值。只写 zh 不等于更改所有语言；启用语言与回退链见[多语言教程](/zh/blog/starter-guide-languages/)。

<a id="boundaries"></a>

## 关联配置与未提供的设置

- **导航与目录：** `i18n.locales.<语言>.messages.nav.about` 控制公共 About 入口及关闭窗口后的重新打开入口，string，默认中文“关于” / 英文“About”；例值“关于我”。`messages.blog.toc` 控制 About 目录的标题与无障碍名称，string，默认中文“文章目录” / 英文“On this page”；例值“本页目录”，也影响文章目录，见[文章文案字典](/zh/blog/config-article/#article-messages)。
- **完整解码页面：** `theme.enableDecoderPage` 是 boolean，默认 true；如 `theme: { enableDecoderPage: false }` 会关闭独立 Decoder 页面及弹窗的完整工具跳转入口，不会关闭 About 内嵌解码器。内部工具字段使用 `messages.decoder` 和 `messages.decoderPage`，具体字段见[Decoder 字典](/zh/blog/config-decoder/)，不使用上面五个旧 decryptor 正文字段。
- **终端：** `messages.terminal` 是共用终端交互文案，不属于 `about.effects.backgroundLines`。终端是有界的网页虚拟文件系统；配置不能授权执行本机程序。十六项字段、占位符和未使用状态见[终端字典](/zh/blog/config-terminal/)。
- **窗口和动画：** 没有公开的 About 专属面板尺寸、默认关闭状态、正文淡入、工具隐藏、目录排序、Oracle 改名或独立关停配置。窗口状态由运行时及本地存储管理；无 JavaScript 时正文仍可阅读，工具不保证可用。正文默认直接可见，不依赖滚动观察器才显示。系统减少动态效果偏好由运行时处理，不是本文新增开关。
- **联系方式：** About 的 contact 对象与 `social.links` 独立。改页脚社交链接不会自动改 About 联系段落。

上表五个旧 decryptor 正文字段仍被类型接受，但当前不消费；`backgroundLines` 仅有降级分支，`modalOutput` 是初始占位，均已明确标记。不要通过修改这些字段来配置当前工具，更不需要为了匹配旧文案去改变页面实现。
