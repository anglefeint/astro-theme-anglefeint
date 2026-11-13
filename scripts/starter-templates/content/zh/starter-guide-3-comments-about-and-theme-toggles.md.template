---
tags: ['anglefeint', 'starter']
title: '使用指南 5：把页面和功能调整成自己喜欢的样子'
subtitle: '按想修改的页面查找：首页、About、Decoder、社交链接、页脚、音乐和分页。'
description: '通过小范围配置调整页面内容和功能，说明实际默认值、生效范围、合并方式与本地验证步骤。'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

本篇是入门教程的第 5 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

博客已经能运行后，可以从自己想改的地方开始。你不需要先填写所有配置，也不需要把下面的示例全部复制进去。

所有 TypeScript 片段都合并到 `src/site.config.ts` 现有的 `defineThemeConfig({...})` 对象里。一个对象中只保留一个 `theme`、一个 `i18n`、一个 `social`；同名字段直接修改，保留其他个人设置。对象与默认值合并，数组则整体替换，因此增添链接、歌曲或条目时要保留希望继续显示的内容。

这篇按操作目标提供常用配置，不是完整字段字典。先找到页面上想修改的区域，再选择对应一节即可。

## 1. 调整首页提示和效果

站点名称、首页大标题和介绍的区别，见[安装博客，换成自己的信息](/zh/blog/starter-guide-1-configure-your-site/)。这里调整首页的提示段和交互：

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

| 字段                              | 默认值  | 改变什么                                                                              |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`  | 显示 Initialize／done 启动文字段；设为 false 隐藏该段                                 |
| `theme.home.showFollow`           | `true`  | 显示 Wake Up／Follow 提示段；设为 false 独立隐藏                                      |
| `theme.home.showTrace`            | `true`  | 显示首页底部的 PIRATE SIGNAL／TRACE 状态区；设为 false 隐藏该区                       |
| `theme.effects.enableHomePassage` | `false` | 开启后，首页文章标题链接可触发约 8 秒的 Matrix 穿越后导航；减少动态效果时保持直接导航 |

这些字段没有提供关闭整页代码雨或切换全站配色的能力。`showTrace` 也不是右下角宽屏终端的开关。

### 修改宽屏终端文字

宽屏终端默认显示 `Knock, knock.`。可以先设置英文配置，供没有单独覆盖的语言共用：

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '记录想法，也留下一点线索。' } } },
  },
},
```

需要某种语言独立文案时，在该语言的 `messages.home.transmission` 设置。这一项的取值顺序为当前语言配置 → 英文配置 → `Knock, knock.`，不走普通界面文案的完整回退链。终端在宽屏布局中出现，手机上看不到不代表配置失败；点击钥匙孔按钮才打开走廊预览。

About 的 Oracle 入口独立使用场景预览，不受首页文章穿越开关控制。上述终端文字和底部状态用于页面氛围，不代表真实机器、网络或安全状态。

这些开关和宽屏终端文字的完整定义见[首页字典](/zh/blog/config-home/#startup-switches)。

## 2. 把 About 换成自己的介绍

打开 `/zh/about/` 可以看到当前内容。正文和联系方式按语言配置，无需修改主题页面模板：

```ts
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: '我是小林，喜欢开发与写作。',
          what: '这里记录我的项目和学习笔记。',
          ethos: ['保持好奇。', '把想法变成可以使用的东西。'],
          now: '最近在整理个人博客。',
          contactLead: '欢迎联系我。',
          signature: '> 谢谢你来这里。',
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

替换示例姓名和地址。`metaLine` 是个人面板顶部状态文字；`who`、`what`、`ethos`、`now` 分别填写自我介绍、所做的事、理念和近况；`contactLead` 是联系引导，`signature` 是签名。`ethos` 是字符串数组，提供新数组会整体替换原条目。

正文段落和签名是纯文本：字符串中的 `\n` 换行，`\n\n` 留空行；不解析 Markdown 或 HTML，不要用 `<br>` 换行。这个示例只修改简体中文；其他语言需要自己的文案，不会自动翻译。缺失字段会根据该语言的配置回退规则补齐。

About 的窗口控件可以关闭、最小化或全屏面板，并在浏览器本地记录状态。页面工具中的 AI 输出和下载进度是主题交互展示，不会因为填写了文案就连接真实 AI 服务；解码工具处理的是浏览器本地输入。

不需要 About 时，在 `theme` 中设置 `enableAboutPage: false`；默认是 `true`。关闭后不生成 About 路由，公共导航及相关 About 联系入口也随之隐藏。自己写在正文或页脚中的链接不会被自动删除，应一并检查。

更多内容字段见[About 字典](/zh/blog/config-about/#about-content)；命令提示和只读阅读器文案见[终端字典](/zh/blog/config-terminal/#messages)。

## 3. 调整 Decoder 页面和阅读卡片

Decoder Lab 位于 `/zh/decoder/`，默认开启。它的视觉致敬密码朋克与数字自由的先行者；本地处理和点对点网络意象呼应个人掌握工具与数据的理念。

工具提供文本解码、支持的代币调用解释和地址格式检查，不需要 RPC、钱包连接或 API Key。它不查询余额、执行交易或证明地址归属；输入 calldata 也不等于验证了合约真实行为。

在 `theme` 中设置 `enableDecoderPage: false` 可以独立关闭 Decoder 页面和主题提供的相关入口；关闭 About 不等于关闭 Decoder，反过来也一样。自定义链接仍需自己维护。

阅读区的致敬文字和卡片按语言配置，例如替换中文列表：

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        decoderPage: {
          readings: {
            tribute: '思想与代码，让隐私和自由更进一步。',
            links: [
              { title: '我的阅读资料', href: 'https://example.com/', author: '作者名', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` 隐藏致敬文字，`links: []` 隐藏卡片，省略则保留默认内容。每项填写 `title`、`href`，`author`、`year`、`cover` 可选。`cover` 可用内置名称（例如 `privacy-code`、`bitcoin`），或 public 图片路径／HTTPS 图片地址；省略则是无图卡片。

`links` 替换整份列表，不是追加一条；想保留旧条目时把它们一起写入。这里是你提供的资料入口，不会抓取或转载目标文章，也不会自动验证外部资源。

阅读条目的逐字段类型、内置封面与默认列表见[Decoder 字典](/zh/blog/config-decoder/#readings)。

## 4. 调整社交入口和页脚

基础社交账号填写在 `social.links`，顶部与页脚共用数组顺序。想加自定义图标，可以先放入 `public/icons/community.svg`：

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: '我的社区', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` 支持 public 内的本地 SVG、PNG、WebP，路径以 `/` 开始，不填写远程 URL、查询参数、片段或编码字符。它优先于 `icon`，保留原图颜色；两项都省略则显示文字。`label` 提供可访问名称。文件缺失或填写不支持的内置图标名会报配置错误。

可选 `rel` 用于身份等链接关系。例如自己的 Mastodon 账号可以设置 `rel: 'me'`；主题始终保留 `noopener noreferrer`，不会按平台自动加 `me`。身份验证由对应平台处理，网站必须先部署，并在对方资料中填写包含返回链接的实际页面地址，主题不保证验证结果。

手机宽度下顶部社交入口隐藏，页脚仍显示。`links: []` 保留三个不可点击的占位图标，并不是隐藏整个社交区域。

### 页脚署名、说明和额外链接

```ts
site: { tagline: '保持好奇，持续记录。' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目源码', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` 是自定义纯文字，空字符串隐藏；不会自动翻译。旧默认文字 `Built with Astro.` 会视为内置署名，避免重复显示。
- `theme.footer.showCredits` 默认 `true`，控制主题和 Astro 两项署名；关闭后仍保留版权行、自定义说明和额外链接。它也控制自动生成的文章分享图中的主题署名，不修改自定义图片。
- `theme.footer.links` 默认空数组，在版权和署名之间显示链接，与社交图标独立；标签保留你填写的文字，不自动翻译，也不受 showCredits 控制。

版权名称使用全站名称，年份在构建时生成。修改文案、署名或年份相关结果后，需要重新构建部署。

图标路径、链接字段和署名规则见[公共界面的社交字段](/zh/blog/config-site-chrome/#social-fields)与[页脚字段](/zh/blog/config-site-chrome/#footer)。

## 5. 开启音乐播放器

先将自己的音频放入 `public/music/my-song.mp3`，再合并：

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: '我的一首歌', artist: '作者', src: '/music/my-song.mp3' }],
  },
},
```

音乐默认关闭，主题不附带歌曲。每首需要 `title`、`src`，`artist` 可省略；空歌单不会显示播放器。增加歌曲时保留原数组中的条目。音频网址不含 `public`，不能使用本机磁盘路径或平台分享页面；支持 HTTPS 音频直链，地址不使用空格或反斜杠。标题为空或地址格式错误会报配置错误，但填写格式正确不保证文件实际可访问。

播放器出现在使用主题公共布局的页面，没有逐页显示开关；每个新页面初始收起。首次访问点击 PLAY 才加载音频，当前曲目结束后播放下一首，最后一首结束后回到第一首。手机展开播放器时会临时隐藏回到顶部按钮。

同一标签页会话会记住曲目、进度和音量；此前正在播放时，切页或刷新会尝试续播，手动暂停后保持暂停。它不是无缝播放，浏览器也可能阻止自动播放；存储不可用时仍可手动播放，但不保留会话续播。

当前实现会完整下载歌曲，转成 Blob 后播放，进度跳转不依赖服务器 Range 支持。大文件会增加等待和内存占用；外链服务器必须允许 CORS，同站点 public 文件无需跨域设置。先确认音频地址能访问；不需要音乐时设置 `theme.music.enabled: false`。

曲目字段、状态文案与续播边界见[音乐播放器字典](/zh/blog/config-music/#track-fields)。

## 6. 调整列表数量和分页

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

`homeLatestCount` 默认 3，控制首页最新文章数；`blogPageSize` 默认 10，控制博客及标签列表每页文章数。使用合理的正整数。它们不控制首页最多三条的碎片预览，碎片列表每页数量另由 `theme.fragments.pageSize` 设置。

`windowSize` 默认 7，控制页码展示窗口，渲染时限制在 5–21，不是每页文章数。跳页入口需要 `jump.enabled` 为 true 且总页数大于 `showJumpThreshold`；默认超过 12 页出现，`enterToGo` 决定是否允许回车跳页。

样式默认是 `random`；示例选择 `fixed` 来固定变体。`sequential` 按页面顺序选变体；`random` 的客户端初始化会重新随机选择样式，结果可能重复。关闭 JavaScript 时仍有构建出的静态分页样式。`variants` 控制参与选择的变体数量，渲染时限制在 1–12；`fixedVariant` 限制在当前变体范围内。

`style.enabled: false` 使用基础样式，不会关闭分页。Blog、标签和 Fragments 共用这些分页设置，修改时应留意三处的效果。

分页字段的完整范围、变体和界面文字见[Blog List 与标签列表字典](/zh/blog/config-blog-list/#pagination-window)。

## 7. 只关闭自己不需要的功能

以下是各开关的影响范围；不要为了配置一个功能，就把整张表全部关闭。

| 配置路径                       | 默认值 | 设为 false 后                                       |
| ------------------------------ | ------ | --------------------------------------------------- |
| `theme.enableAboutPage`        | `true` | 不生成 About 页面并隐藏主题相关入口                 |
| `theme.enableDecoderPage`      | `true` | 不生成 Decoder 页面并隐藏主题相关入口               |
| `theme.effects.enableRedQueen` | `true` | 隐藏文章页 Red Queen 监视器，不关闭整个 AI 页面效果 |
| `theme.search.enabled`         | `true` | 关闭站内文章搜索入口及索引生成                      |
| `theme.toc.enabled`            | `true` | 关闭默认文章目录，单篇 `toc: true` 仍可覆盖         |
| `theme.tags.enabled`           | `true` | 关闭标签入口及标签页面生成，不删除文章              |
| `theme.math.enabled`           | `true` | 关闭 Markdown／MDX 数学处理                         |
| `theme.socialImage.enabled`    | `true` | 停止自动生成文章分享图，手动 ogImage 仍有效         |

例如只关闭文章监视器，合并 `theme: { effects: { enableRedQueen: false } }` 即可。它不会改变搜索、音乐或 About 设置。

评论和碎片默认关闭，不需要为了使用其他功能把它们开启；需要时分别阅读[配置 Giscus 评论](/zh/blog/starter-guide-4-giscus-comments/)和[发布一条碎片](/zh/blog/starter-guide-5-fragments/)。文章目录、公式和分享图细节见[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)与[图片教程](/zh/blog/starter-guide-images/)。

## 8. 需要作品页时创建自定义页面

要单独展示项目，可以在根目录运行：

```bash
npm run new-page -- projects
```

命令创建 `src/pages/[lang]/projects.astro`，默认使用 `base` 布局，通过当前启用语言生成 `/<语言代码>/projects/`，例如 `/en/projects/` 或 `/zh/projects/`。编辑这个 Astro 文件填写正文；它不会自动翻译内容，也不会自动增加顶部导航栏目。可以在正文或页脚 links 中提供入口。

需要指定风格时再使用 `--theme`，例如 `npm run new-page -- portfolio --theme cyber` 创建另一个 Cyberpunk 页面。可选值是 `base`、`ai`、`cyber`、`hacker`、`matrix`，控制这个新页面使用的布局，不会切换全站的四种氛围。slug 使用小写英文字母、数字和连字符，可用 `projects/labs` 这样的嵌套路径。不要与包提供的标准页面路径冲突；同名文件已经存在时会报错，不要把同一路径的五种主题命令连续运行。

## 9. 保存后如何确认生效

先在 dev 中打开刚修改的页面：检查内容和链接、功能入口是否按预期出现。环境变量有旧覆盖值时按[第一篇的排查步骤](/zh/blog/starter-guide-1-configure-your-site/)处理。缺少自定义图标、音频请求失败或外链异常，应分别检查路径和网络，不要靠重复覆盖整份配置排错。

发布前停止 dev，运行：

```bash
npm run doctor
npm run preview
```

doctor 已包含本地准备、检查和构建；成功后不必立即再运行 check 或 build。搜索需要在构建后的 preview 中验证；preview 本身不发布网站。正式网站仍需重新部署整个 `dist/`，本地保存配置不会立即改变线上页面。

## 教程导航与配置查阅

[上一篇：发布一条碎片](/zh/blog/starter-guide-5-fragments/) · [下一篇：让读者留下评论](/zh/blog/starter-guide-4-giscus-comments/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[首页](/zh/blog/config-home/)、[About](/zh/blog/config-about/)、[终端](/zh/blog/config-terminal/)、[Decoder](/zh/blog/config-decoder/)、[公共导航、社交和页脚](/zh/blog/config-site-chrome/)、[音乐播放器](/zh/blog/config-music/)、[列表和分页](/zh/blog/config-blog-list/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
