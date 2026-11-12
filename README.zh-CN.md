[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/zh/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">为人类读者与 AI 智能体打造的多氛围电影感 Astro 个人发布主题。</p>

自动生成 `llms.txt`、多语言索引、全文合集与文章 Markdown，方便 AI Agent 读取和引用内容，支持 GEO（生成式引擎优化）。

<p align="center">
  <a href="https://demo.anglefeint.com/">在线演示</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">仓库地址</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI 助手</a> · <a href="#installation">安装</a> · <a href="#setup">站点配置</a> · <a href="#writing">写文章</a> · <a href="#upgrade">升级</a> · <a href="#deployment">构建与部署</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="ai-assistant"></a>

## 使用 AI 助手

建议用 Cursor、Codex 或 Claude Code 配置站点、写文章和定制页面。先读当前项目的 AGENTS.md，以代码和实际配置为准；CLAUDE.md 与 Cursor 规则引用同一套指引。

- **博客用户（starter）**: 从 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/AGENTS.md) 开始，按需查[配置](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/zh/starter-guide-1-configure-your-site.md)／[写作](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/zh/starter-guide-2-languages-and-routing.md)教程。
- **主题维护者（main）**: 从 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) → [AI 工作流](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/AI_WORKFLOW.md) 开始；实现结构查[架构文档](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)，改代码后按[文档同步流程](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/DOC_SYNC_WORKFLOW.md)更新说明。

<a id="installation"></a>

## 安装

当前模板基于 **Astro 7**。

使用 Node.js 22.12.0 或更新版本。在准备存放博客的目录运行以下命令，然后打开开发服务输出的网址。

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

已有博客项目时，在原项目运行 `npm install` 和 `npm run dev`，无需再创建一份。执行其他命令前按 Ctrl+C 停止 dev，或另开终端。pnpm 用户使用 `pnpm install` 和 `pnpm dev`。

<a id="setup"></a>

## 站点配置

编辑 `src/site.config.ts` 中已有的配置对象。站点信息、社交链接、About 内容和主题开关都在这里配置。保留导入与导出，将设置合并到已有对象中。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    author: 'Your Name',
    description: 'My notes and projects.',
    url: 'https://your-domain.example',
  },
});
```

`site.url` 填写实际网站地址；如果配置了 `PUBLIC_SITE_URL`，它会覆盖此值。文章或配置修改后，重新构建并部署。

<a id="writing"></a>

## 新建文章

先创建一篇简体中文文章：

```bash
npm run new-post -- my-first-post --locales zh
```

编辑 `src/content/blog/zh/my-first-post.md` 的标题、描述和正文。需要为所有已启用语言创建同名骨架时，省略 `--locales`；初始配置会创建九份文件，不会自动翻译，已有文件不会被覆盖。

Slug 规则：仅使用小写字母、数字和连字符（示例：`my-first-post`）。
如果 `src/assets/blog/default-covers/` 中存在图片，每次运行命令会随机选择一张封面，本次新建的各语言文章共用这张封面。已有文件不会覆盖，后续可手动替换 `heroImage`。
可选语言覆盖：

```bash
npm run new-post -- my-first-post --locales en,zh
# 或
ANGLEFEINT_LOCALES=en,zh npm run new-post -- my-first-post
```

`ANGLEFEINT_LOCALES=...` 写法适用于 Bash/POSIX shell；PowerShell 请使用上面的 `--locales` 命令。

URL 规则：

- 文件：`src/content/blog/zh/my-first-post.md`
- 访问地址：`/zh/blog/my-first-post/`
- 博客列表：`/zh/blog/`
- 不需要手动加路由，Astro 会在构建时根据内容文件自动生成。

`--locales` 只生成文章文件，不会启用语言。还需要在 `src/site.config.ts` 中添加或启用对应语言，构建时才会生成其路由。

## 新建页面

`new-post` 只创建博客文章。自定义页面请使用：

```bash
npm run new-page -- projects --theme base
```

可选主题：`base`、`ai`、`cyber`、`hacker`、`matrix`。
命令会生成 `src/pages/[lang]/projects.astro`，并通过 `getStaticPaths()` 输出全部语言路由。
Slug 规则：只允许小写字母、数字和连字符；支持嵌套路由（例如 `projects/labs`）。不支持下划线或大写。

示例（为 `projects` 五选一；连续执行时，从第二条起会因文件已存在而失败）：

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## 碎片

从 0.33.2 起，Fragments 复用文章页的返回顶部按钮：滚动后显示，并遵循减少动态效果偏好，无需额外配置。

碎片功能需要主题 0.29.0 或更新版本。已有博客请先升级，再使用以下配置和命令。

用 Markdown 记录简短感想，可选弹窗评论。 将下面字段合并到 src/site.config.ts 现有 theme 中。碎片和碎片评论默认关闭；开启后菜单位于 Decoder Lab 下方。

```ts
fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
```

默认生成全部启用语言的骨架需要主题 0.31.0 或更新版本。请先升级；0.29–0.30 仍需用 `--locales` 显式指定。

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

与 `new-post` 一致，默认读取项目全部启用语言，生成共享同一个 ID 和时间戳的骨架，不自动翻译。语言优先级为 `--locales` → `ANGLEFEINT_LOCALES` → 项目启用语言。显式列表会去除空白、转为小写并去重，跳过配置读取，只创建指定语言目录，不自动修改配置中的语言开关。

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales zh
```

0.32.0 起的分享功能：日期链接定位列表中的本条碎片，旁边提供复制链接。对外分享使用 `/zh/fragments/#ID`，其中 ID 是 Markdown frontmatter 的 id。当前页没有该条时，按需读取本语言的轻量静态索引，自动跳到对应分页。新增内容、修改日期或 pageSize 后重新构建即可，保留原 ID。跨页定位和复制需要启用 JavaScript。

0.32.0 起的分页改进：碎片与 Blog 共用页码、霓虹样式和按阈值显示的跳页入口。`theme.pagination` 统一控制两处分页；`theme.fragments.pageSize` 仍独立设置每页碎片数量。

[用户指南 5：发布碎片](https://demo.anglefeint.com/zh/blog/starter-guide-5-fragments/)

<a id="upgrade"></a>

## 升级主题

集成版 starter 将标准页面、配置默认值、翻译和构建功能放在主题包中。文章、`src/site.config.ts`、音乐、图片和自建页面保留在用户项目中。

使用 npm 的集成版项目在根目录运行下列命令。它检查项目、Node 和 Astro 兼容性，备份依赖文件，安装明确的主题版本并运行 doctor；失败时恢复依赖文件并尝试重新安装原依赖。完成后按原有流程部署，命令不会自动发布网站。

```bash
npx @anglefeint/astro-theme@latest upgrade
```

0.27 之前的项目需要一次重新安装迁移：在新目录创建模板，复制文章和资源，将个人设置合并进新的 site config。不要复制旧标准路由、adapter 或 defaults/schema/runtime 辅助文件。保留文章 slug、语言路径、音乐和图片 URL、域名及部署设置。

自动升级暂仅支持 npm；检测到 pnpm/yarn/bun 锁文件会停止。`--check` 只读检查兼容性，`--to 0.27.1` 指定版本。Astro 或 starter schema 变化时请阅读[升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)和 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)。

<a id="deployment"></a>

## 构建与部署

```bash
npm run build
```

构建后的静态网站位于 `dist/`。将该目录的**全部内容**发布到任意静态托管即可，无需线上 Node.js 服务或托管平台适配器。

本地查看构建结果可运行 `npm run preview`，它不会发布网站。也可使用 `npm run doctor`，一次完成检查和构建。

请部署到域名根目录，并支持各目录的 index.html。子路径部署需要额外适配，仅设置 Astro `base` 不足以保证正常使用。

文章 sitemap 使用 `updatedDate`，未填写时使用 `pubDate`，请保持日期真实。主题集成在构建后的 `dist/_headers` 合并终端 JSON 的 `X-Robots-Tag: noindex`，保留原托管规则，不修改源文件。Cloudflare Pages 等兼容静态托管会应用这些规则，其他平台需配置等效响应头。请检查实际部署响应，Astro preview 不应用托管规则。

<a id="reference"></a>

## 功能与配置参考

博客与标签文章页支持卡片／列表切换，并在当前浏览器记住选择。

### 首页效果与解码工具

可选 Matrix 穿越：`theme.effects.enableHomePassage` 默认 `false`。开启后，首页文章链接播放 8 秒绿色穿越后导航。About 的 `Oracle` 按钮独立可用：每次点击选择四种场景配色之一，不连续重复；到达后可拖动观察四周、右键倒退回走廊，按 Escape 或点击 × 关闭。减少动态效果时，首页直接导航，Oracle 显示静态预览。

宽屏（1440px 及以上）右下角终端默认显示 `Knock, knock.`。文字可选择复制和滚动，点击独立钥匙孔按钮才解锁并展示共享走廊。在 `src/site.config.ts` 配置 `i18n.locales.en.messages.home.transmission` 即可供全部语言使用；需要不同文字时，再配置 `i18n.locales.<code>.messages.home.transmission`。取值顺序为当前语言配置 → 英文配置 → `Knock, knock.`，与普通界面翻译的回退规则不同。修改后重新构建并部署。

首页开关位于 `src/site.config.ts`：`theme.home.showInitialize` 控制 Initialize/done 启动段，`showFollow` 控制 Wake Up/Follow 提示段，`showTrace` 控制右下角状态。均默认 `true`，分别设为 `false` 可独立隐藏。 0.18.1:底部两项状态默认隐藏，各自响应鼠标悬停或文字选中；全选时两项都显现，发光光标只跟随右侧追踪文字。

About 提供本地化目录和醒目的 Contact 栏目：宽屏目录位于正文框右侧，小屏回到正文内。顶部 Frontier 菜单可直达 `/<locale>/about/#contact`；关闭 About 会移除此入口，Decoder Lab 仍由独立开关控制。

About 窗口按钮可关闭、最小化或全屏阅读面板，保留浏览器本地状态，并支持对应终端命令。集成版标准页面随主题包更新；0.27 以前的项目按上方步骤完成一次迁移。

About 页内置 **Hacker Decryptor**：在浏览器本地解码 Base64/Base64URL、URL 编码、十六进制、HTML 实体、Unicode 转义及 JWT 头部和载荷，支持自动识别和与页面配色一致的数字结果动画。从侧边栏打开 Decryptor 即可使用，无需配置接口。

完整的 **Decoder Lab** 位于 `/<locale>/decoder/`，支持本地文本处理链路、EVM／HyperEVM／TRON 的 ERC-20／TRC-20 调用解释，以及 EVM／TRON／Bitcoin 地址检查。从 About 解码弹窗进入；在 `src/site.config.ts` 设置 `theme.enableDecoderPage: false` 可独立关闭页面和入口。无需 RPC、连接钱包或 API Key。

自 0.20.0 起：顶部独立的 **Frontier** 箭头也可进入 Decoder Lab。配图卡片链接到原文与资料／项目官网，不转载文章正文。在 `src/site.config.ts` 的 `i18n.locales.<code>.messages.decoderPage.readings` 中配置 `tribute` 文案和完整的 `links` 列表；空文案隐藏致敬，`links: []` 隐藏卡片。配置多少项就显示多少项，宽屏每行最多八个。参见[配置示例](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration)。

Decoder Lab 的视觉风格致敬 **Cypherpunk（密码朋克）**，纪念他们为人类自由、隐私与开放代码作出的贡献。点对点网络意象与本地处理方式，呼应了让工具与数据掌握在个人手中的理念。

## 环境要求

- Node.js `22.12.0+`（建议 LTS）
- 0.8.0 starter 的文档命令已在 Linux 下通过 npm + Node 22、pnpm 10 + Node 24 验收；未测试 yarn/bun。详见[验收记录](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.8.0.md)。

## 发布前检查与预览

完成站点配置和文章编辑后，停止开发服务，再运行：

```bash
npm run doctor
npm run preview
```

`doctor` 已包含检查和构建，无需再重复运行 `npm run check`。打开 `preview` 输出的网址，按 `Ctrl+C` 停止预览。预览仅在本机运行，不会把网站发布到网上。

如果只需要构建和预览、不执行完整检查，可改用：

```bash
npm run build
npm run preview
```

pnpm 用户使用 `pnpm doctor`，再运行 `pnpm preview`；只构建时则使用 `pnpm build`，再运行 `pnpm preview`。

静态输出位于 `dist/`。在托管平台设置构建命令 `npm run build`、输出目录 `dist/`，按照 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/) 发布；上线后检查实际域名、文章、语言菜单和搜索。

## 支持 AI 阅读的内容

配套 starter 在 `npm run build` 时自动生成 `/llms.txt`、各语言索引与全文合集，以及文章 Markdown 版本，无需额外配置。照常部署整个 `dist/`；这些文件在构建后及 preview 中可用。已有项目见 [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

可在 `src/site.config.ts` 配置 `aiReadableContent.notes`（Markdown 说明）和 `aiReadableContent.links`（`{ label, href }[]`），自动加入索引、全文合集及单篇 Markdown。语言覆盖放在 `i18n.locales.<code>.aiReadableContent`；未配置字段回退全局，`notes: ''` / `links: []` 显式隐藏。参见[配置与升级说明](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#optional-machine-readable-context)。

## 首次配置：站点信息与首页地址

首页大标题可按语言设置：在 `src/site.config.ts` 中填写 `i18n.locales.<code>.site.homeTitle`，例如 `zh: { site: { homeTitle: '我的数字花园' } }`。内置语言和自行新增的语言都适用。未填写或只有空白时，沿该语言的 `meta.fallback` 链查找，最后使用全局 `site.title`（或 `PUBLIC_SITE_TITLE`）。它只改变首页可见大标题；浏览器标题、导航、页脚、RSS 和 SEO 站点名称继续使用全局站名。修改后重新构建并部署。

发布前，编辑 `src/site.config.ts` 中已有的 `defineThemeConfig({...})` 对象。把以下字段合并到现有配置中，保留文件的导入、导出及已有语言和功能设置；将示例标题、作者和 `https://your-domain.example` 换成自己的信息。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: '我的博客',
    author: '你的名字',
    url: 'https://your-domain.example',
  },
  i18n: {
    defaultLocale: 'zh',
    routing: {
      defaultLocalePrefix: 'never',
    },
  },
});
```

**选择打开域名时如何进入首页：**

- `'always'`（主题默认）：`/` 跳转到 `/<默认语言>/`，初始配置下是 `/en/`。访客可能短暂看到 **“Redirecting to home…”**，然后进入首页。
- `'never'`（上面的示例）：`/` 直接显示默认语言首页，访问根域名时不再经过这个跳转页；`/<默认语言>/` 则跳回 `/`。示例将中文设为默认语言。

`defaultLocale` 可选择已启用的 `zh`、`en`、`ja`、`ko`、`es` 等语言。这个设置只改变默认语言的**首页**地址，博客和文章仍保留语言前缀，例如 `/zh/blog/`。

`site.url` 应填写真实生产域名，确保 canonical、订阅源和 sitemap 使用正确地址。如果环境文件或托管平台构建设置中配置了 `PUBLIC_SITE_URL`，它会覆盖 `site.url`，也需要一起核对。修改后须重新构建并部署（运行 `npm run build`，或由已连接的托管平台执行构建）；只修改本地文件不会更新线上站点。

## 选择需要的语言

默认启用九种语言：`en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant`，默认语言仍为英语。在 `src/site.config.ts` 中为不需要的语言设置 `i18n.locales.<code>.meta.enabled: false`；省略配置不会禁用，默认语言始终启用。`new-post` 初始会创建九份文章骨架，不会自动翻译。只创建简体中文：`npm run new-post -- my-post --locales zh`。

## 语言

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

## 预览

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### 分享预览

![Anglefeint 默认分享图](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

这张内置的 1200×630 图片用于没有专属分享图的页面，包括 Fragments。可通过 `site.ogImage` 替换站点默认图。

文章会在 `npm run build` 时，根据文章标题、作者和站点名自动生成独立的 1200×630 PNG。这是构建时生成；打开分享链接时使用静态图片，不调用图片 API，也不增加浏览器 JavaScript。修改这些信息后，重新构建并部署即可更新。

文章 frontmatter 的 `ogImage` 优先于自动生成图。将 `theme.socialImage.enabled` 设为 `false` 后，文章的 `heroImage` 优先于站点默认图；内置图片是最后的回退。

### 页面截图

| 首页                                                           | 博客列表                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · 列表模式                                                            |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| 文章页                                                                   |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| 博客分页                                                                   | 文章相关推荐                                                                |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ![博客分页](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![文章相关推荐](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · 密码朋克资源                                                           |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |

## 路由视觉氛围

- `/<default-locale>/`（默认 `/` 会重定向到这里）：Matrix 终端风首页
- `/:lang/blog`：赛博朋克归档列表
- `/:lang/blog/[slug]`：AI 界面风文章页
- `/:lang/about`：可选黑客风 About 页面

## 主题命名约定

- 主题参数：`base`、`ai`、`cyber`、`hacker`、`matrix`
- 内部选择器与脚本前缀：`ai-*`、`cyber-*`、`hacker-*`
- 核心组合结构：`ThemeFrame -> Shell -> Layout -> Page`

## 功能特性

- 当前语言的 Pagefind 文章全文搜索
- 自动文章目录与静态标签归档
- 代码块一键复制与正文图片预览
- Astro 7 静态输出
- Markdown + MDX 内容集合
- Starter 内置示例语言：`en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant`
- 按语言生成 RSS
- 内置 Sitemap 与 robots
- 配置驱动的主题定制
- 短页面下 Footer 贴底

## 主题配置

1. 如需通过环境变量覆盖站点信息，可复制 `.env.example` 为 `.env`；否则直接使用 `src/site.config.ts`。
2. 编辑 `src/site.config.ts`：
   - `site.title`、`site.description`、`site.url`、`site.author`、`site.tagline`：站点身份信息与默认元数据
   - `i18n.defaultLocale`：设置默认语言
   - `i18n.routing.defaultLocalePrefix`：决定默认语言使用 `/<default-locale>/`（默认）还是 `/`
   - `i18n.locales`：作为单一来源增减站点支持语言
   - `i18n.locales.<code>.messages`：覆盖该语言的界面文案
   - `i18n.locales.<code>.meta.label`：语言菜单显示名称（`zh` 默认为“简体中文”），修改名称不会改变网址
   - `i18n.locales.<code>.site.hero`：覆盖该语言首页 hero 文案
   - `social.links`：社交链接
   - `i18n.locales.<code>.about`：按语言配置 About 页面内容与运行文案
   - `theme.enableAboutPage`：About 页面开关
   - `theme.effects.enableRedQueen`：开启/关闭文章页侧边监视器特效
   - `theme.comments`：开启并配置 Giscus（核心 ID + 行为参数）
3. 在 `src/content/blog/<locale>/` 替换示例文章。

About 正文段落和签名保留配置字符串中的换行：`\n` 换行，`\n\n` 留一空行，长句仍自动折行。这仍是纯文本，不解析 Markdown 或 HTML，不要插入 `<br>`。

页脚将版权、主题/Astro 署名和可选的 `site.tagline` 分组展示，下方保留社交图标。内置署名跟随页面语言，自定义说明在各语言中保持原文；空说明不占位置，手机端长文案自动换行。现有配置和 `PUBLIC_SITE_TAGLINE` 覆盖继续有效，无需迁移。可选的 `theme.footer.links` 数组填写 `label` 和 `href`，在版权与署名之间显示以中间点分隔的链接，标签保持配置原文；默认数组为空，独立于 `social.links` 和 `showCredits`。

说明：

- `site.description` 是站点级默认描述。首页优先使用解析后的 `messages.siteDescription`（含内置与回退语言文案），只有解析结果为空才回退到站点描述；仅修改 `site.description` 不会替换内置首页描述。
- 语言配置与默认值深合并。禁用语言请设置 `i18n.locales.<code>.meta.enabled = false`，省略覆盖项不代表删除语言；默认语言始终启用。
- 语言元信息当前支持 `label`、`hreflang`、`ogLocale`、`enabled`、`fallback`。

### 可选：Google Analytics 4

在 `src/site.config.ts` 已有的 `defineThemeConfig({...})` 对象中添加或修改以下顶层配置（与 `site` 同级，不放在 `theme` 内）：

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

在 Google Analytics → 管理 → 数据流 → 网站数据流中复制 **衡量 ID**（`G-...`），不是资源名称或数字资源 ID。留空即关闭。所有语言和主题页面共用一个 ID，可按页面路径区分语言。重新构建部署后，访问线上网站，在 GA4 实时报告中确认数据。

开发模式及 localhost/回环地址预览不发送数据；配置后，远程预览和局域网地址预览会统计。默认模板不加载 Google 脚本。不要与 GTM、Zaraz 或手动代码重复接入同一统计。本选项不包含 Cookie 同意弹窗或同意管理；有此需求的网站应先完成对应设置，再启用统计。脚本拦截器可能阻止数据采集。旧项目需要匹配的配置辅助文件和适配器，详见[升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

### 可选：Giscus 评论

`shareAcrossLocales: false` (default) — `mapping: 'pathname'`

评论默认关闭。启用方式：

1. 在 `src/site.config.ts` 中设置 `theme.comments.enabled = true`。
2. 填写：
   - `theme.comments.repo`
   - `theme.comments.repoId`
   - `theme.comments.category`
   - `theme.comments.categoryId`
3. 可选设置：
   - `theme.comments.shareAcrossLocales` (`false`)
   - `theme.comments.mapping`
   - `theme.comments.term`（当 `mapping = "specific"` 时必填） — `shareAcrossLocales: false`
   - `theme.comments.number`（当 `mapping = "number"` 时必填）
   - `theme.comments.strict`
   - `theme.comments.reactionsEnabled`
   - `theme.comments.emitMetadata`
   - `theme.comments.inputPosition`（`top` 或 `bottom`）
   - `theme.comments.theme`
   - `theme.comments.lang`
   - `theme.comments.loading`
   - `theme.comments.crossorigin`

`shareAcrossLocales: false`: 核心 ID 缺失时不渲染评论。启用评论后，`mapping="specific"` 缺少 `term`，或 `mapping="number"` 的 `number` 不是有效正整数字符串，会抛出配置错误并可能中止开发启动或构建。

CLI 使用合并配置中启用的语言；配置错误会中止生成。显式 `--locales` 或 `ANGLEFEINT_LOCALES` 可覆盖语言选择，无需加载配置。

评论和跨语言共享默认都关闭。普通的按路径评论使用上面的配置。若要让同篇文章的译文共用讨论，保留自己的仓库和分类字段，把映射选项改为：

```ts
theme: {
  comments: {
    // 保留自己的 enabled、repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

共享模式要求 mapping 为 specific、term 和 number 为空、strict 为字符串 1，按示例填写。文章页会把不含语言前缀的完整 slug 作为 data-term。例如九语版本都使用 cypherpunk-ideals-ai-and-the-future-of-crypto；guides/setup 与 other/setup 仍是两个讨论。缺少有效 slug 会报错，译文必须使用相同 slug。lang 留空时界面跟随页面语言，显式填写则固定语言。评论正文不翻译，只共享讨论和表情。

关闭共享时，自定义 mapping、term、number、strict 行为不变：specific 要求非空 term，number 要求正整数字符串。开启共享且启用评论时，错误的 mapping、非空 term/number 或不为 1 的 strict 会明确报配置错误。打开两个译文和另一篇文章核对讨论关联。访客发表评论需要 GitHub 授权。把示例合并到已有 comments 对象，不要覆盖其他配置。

已有讨论不会自动合并、搬迁或删除。开启共享后可能关联另一个讨论，旧评论不会自动出现在共享区。切换前保存原来的 mapping、term、number、strict；要恢复旧关联，设置 shareAcrossLocales: false 并恢复这些字段的原值。确需搬迁旧评论时，由博主在 GitHub 上评估和手动处理，主题不自动迁移。

[评论配置教程](https://demo.anglefeint.com/zh/blog/starter-guide-4-giscus-comments/)

## 配置入口

- 单一入口：`src/site.config.ts`
- 站点信息仍支持 `PUBLIC_*` 环境变量覆盖

## 社交链接

在 `src/site.config.ts` 配置 `social.links`，顶栏和页脚共用数组顺序。只添加自己需要的链接：

```ts
// src/site.config.ts — defineThemeConfig({ ... })
social: {
  links: [
    { href: "https://www.youtube.com/@your-channel", label: "YouTube", icon: "youtube" },
    { href: "https://bsky.app/profile/your-handle.bsky.social", label: "Bluesky", icon: "bluesky" },
  ],
},
```

内置 `icon` 名称： `mastodon`, `twitter`, `github`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`.

可选的 `rel` 接受空格分隔的关系值，例如 `me` 或 `me nofollow`，适用于内置图标、自定义图片和纯文字链接。不填或留空保持 `noopener noreferrer`；值会转为小写并去重，安全属性始终保留，冲突的 `opener` 会被忽略。不会按平台自动添加 `me`，仅为自己的身份链接设置它。[Mastodon 验证](https://docs.joinmastodon.org/user/profile/#link-verification)：先部署网站，再在 Mastodon 个人资料字段中填写并保存网站 HTTPS 地址。使用包含返回账号链接的实际页面（如 `/en/`）；根路径的 HTML 跳转页可能没有该链接。验证由 Mastodon 服务器完成，主题不保证验证结果。

```ts
{ href: "https://mastodon.social/@yourname", label: "Mastodon", icon: "mastodon", rel: "me" },
```

自定义图片：将 `community.svg` 放入 `public/icons/`，再为链接设置 `iconSrc: "/icons/community.svg"`。支持本地 SVG、PNG、WebP，路径以 `/` 开头，不使用远程地址、查询参数、片段或编码字符；主题自动加上 Astro 的 `base`。文件不存在或图标名称不受支持时，开发/构建会报配置错误。

优先级为 `iconSrc` → `icon` → 文字。内置图标继承菜单颜色，自定义图片保留原色；`label` 是无障碍名称。页脚链接过多会换行，顶栏保持单行，空间不足时可横向滚动；宽度不超过 720px 时仍隐藏顶栏社交入口，页脚保留。空 `links` 保留原有三个不可点击的占位图标。修改配置后重新构建、部署。

## 文档

- [架构说明](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)
- [视觉系统](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/VISUAL_SYSTEMS.md)
- [提交检查单](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/THEME_SUBMISSION_CHECKLIST.md)
- [主题提交文案](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md)
- [升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)
- [变更日志](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CHANGELOG.md)

## 文章搜索

默认开启搜索。点击顶部搜索按钮，可搜索当前语言文章的标题和正文。`npm run build` 自动生成索引，随静态网站部署，不需要搜索服务器或账号。

在 `src/site.config.ts` 设置 `theme.search.enabled: false` 可关闭入口和索引生成。单篇文章 frontmatter 设置 `search: false` 可排除该文章。导航、文章目录、相关文章、评论和装饰性状态文字不收录。

本地完整搜索请先运行 `npm run build`，再运行 `npm run preview`。`npm run dev` 显示开发提示，不提供实时搜索；文章修改后重新构建即可更新索引。

## 文章目录

文章页默认从 Markdown 的 `##`、`###` 标题自动生成可折叠目录，宽屏时在正文右侧吸附，窄屏时放在正文开头，初始展开。没有对应标题就不显示，长标题自动换行，不额外添加编号。

在 `src/site.config.ts` 中设置 `theme.toc.enabled` 可修改全站默认值（默认 `true`）。单篇文章 frontmatter 中的 `toc: false` 关闭目录，`toc: true` 开启目录，即使全站默认关闭；省略则继承站点设置。

支持 MDX 中的 Markdown 标题，但不会自动收集组件内部生成的标题或原始 HTML/JSX 标题。自定义文章路由需将 Astro `render(post)` 返回的 `headings` 传给 `BlogPost`，未传时不显示目录。

## 标签浏览

在文章 frontmatter 中填写 `tags: ["Astro", "前端"]`，构建时会自动生成各语言的标签目录和分页文章列表。博客页提供标签入口，正文显示可点击标签；未填写标签的旧文章不受影响。可在 `src/site.config.ts` 中设置 `theme: { tags: { enabled: false } }` 关闭入口及标签页面生成。

标签区分大小写，自动去除首尾空格及同篇重复项。小写安全名称直接用于网址，其他名称采用稳定编码，避免中文和特殊符号冲突。重命名标签会改变其网址，无须维护标签清单或运行额外命令。

可以直接访问 `/<locale>/tags/`，也可以从博客的标签入口进入；点击文章标签会打开 `/<locale>/tags/<tagSlug>/`。该语言没有标签时目录显示空状态，博客不显示标签入口。

## 代码块复制

正文代码块右上角自动显示复制按钮，保留缩进和换行；继续使用普通 Markdown 代码块即可，无须额外配置。剪贴板访问需要 HTTPS 或 localhost；复制失败时会提示手动选择代码。

## 正文图片预览

正文中未设置链接的图片支持点击或按 Enter/空格打开大图预览；按 Esc、点击关闭按钮或蒙版可收起，并保留阅读位置。已有链接的图片保持原来的跳转行为。

预览使用浏览器已选中的图片源，不会自动获取更高清的原图。文章封面以及链接或按钮内部的图片不参与预览。

## 文章分享图

此功能从 0.5.0 起提供，需要配套 starter；0.4.0 不包含它。

照常执行 `npm run build`，即可为没有设置 `ogImage` 的文章生成 1200×630 PNG，内容取自文章标题、作者和站点名称。生成使用随主题提供的字体，不调用图片 API、不增加浏览器 JS，也不会改变正文 `heroImage`。

自动分享图使用随主题提供的代码雨、终端与霓虹网络背景，站点名、标题和作者仍取自你的内容。右下角的小字 `Theme by Anglefeint` 沿用 `theme.footer.showCredits`（默认 `true`）；设为 `false` 会同时隐藏页脚署名和图片署名，修改后重新构建部署。不会修改自定义的 `ogImage`。背景离线使用，不增加浏览器 JavaScript。

自定义图片：文章 frontmatter 写 `ogImage: ./share.png`（图片放文章旁边），或 `ogImage: /images/share.png`（对应 `public/images/share.png`）。也支持 HTTPS 图片地址，其可用性与缓存由图片提供方负责。本地图片不存在时会报错。

在 `src/site.config.ts` 设置 `theme: { socialImage: { enabled: false } }` 可关闭自动生成。手动 `ogImage` 始终优先，其他文章回退到正文封面或原有默认图。修改后重新构建、部署；自动图片位于 `dist/_social/`，文章 HTML 的 `og:image` 给出准确地址。图片地址随内容变化，但外部平台仍可能缓存链接预览。

内置字体覆盖默认的九种语言；超长标题仅在图片中缩略，不修改文章标题。不保证所有 emoji 和其他文字系统。生成会增加构建时间与安装体积，字体不会因此被文章页面下载。

## 可选音乐播放器

公开 demo 已启用八首来自 Free Music Archive 的示例音乐，starter 仍默认关闭音乐。作者、来源和各曲目授权（CC0 1.0 或 CC BY 4.0）见[音乐署名与授权说明](https://demo.anglefeint.com/music/credits.html)。音乐不适用主题代码的 MIT 许可证，也不随 npm 包或 starter 分发；添加或复用音乐时，请遵守对应许可证及署名要求。

默认关闭。将音频放在 `public/music/`，把以下配置合并到 `src/site.config.ts`：

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

0.18.1:启用播放器后，每次进入新页面默认显示小播放器，点击 OPEN 展开；曲目进度、音量和续播不受初始大小影响。

每首歌填写 `title`、`src`，`artist` 可选，也支持 HTTPS 音频直链。空歌单不显示播放器。首次访问时，点击 PLAY 后才加载音频。同一标签页会话内记住曲目、进度和音量；此前正在播放时，切页、刷新或前进后退会尝试从保存位置续播，主动暂停后仍保持暂停。切页可能短暂停顿，不是无缝播放。浏览器阻止自动播放时，点击 PLAY 继续。原曲目被删除时不会自动播放替代曲目。存储不可用时仍可手动播放，但无法会话续播。

播放前会完整下载当前歌曲，转成浏览器 Blob 后再播放，因此进度跳转不依赖服务器的 HTTP Range 支持。大文件或慢网络会增加等待时间和内存占用。暂停后继续会复用已加载的歌曲，切歌会释放旧歌曲；切页后重新加载，浏览器 HTTP 缓存可能减少下载。外部音频服务器必须允许跨域下载（CORS）；放在 `public/music/` 中的同站点文件不需要跨域配置。

## 许可证

MIT License，见 `LICENSE`。

## 数学公式

Markdown 和 MDX 文章默认全局支持 LaTeX 风格数学公式。行内写 `$C_{saved}$`，独立公式放在单独两行 `$$` 之间，无需每篇开关或自行安装插件。

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

在 `src/site.config.ts` 中设置 `theme: { math: { enabled: false } }` 可关闭。普通美元有歧义时写成 `\$`；行内代码和代码块保持原样。关闭数学后恢复普通 MDX 规则，包括花括号中的 JavaScript 表达式。

公式在构建时渲染，样式和字体随站点提供，保留可访问的 MathML，不加载浏览器数学引擎。长独立公式可横向滚动。错误公式会中止构建并提示来源与原因。标题和摘要保持纯文本；搜索索引排除公式。支持 KaTeX 数学语法，不是完整 LaTeX 文档。

0.27+ 集成版 starter 由主题包自动接入 Markdown 处理器和数学支持。只有 0.27 之前的旧骨架需要按升级指南完成一次迁移；新项目无需复制处理器或适配器实现。

## 文章统计

页面字词数是源正文的粗略统计：中日韩字符逐字计数，其他文本主要按空白切分。tokens 默认按 `round(max(words, 1) × 1.3)` 估算，不是模型分词器结果或真实 AI 用量。达到 1,000 后显示一位小数和 k。frontmatter 的 `wordCount`、`tokenCount`、`readMinutes` 分别覆盖各自值；只改 wordCount 不会重算 tokens。公式和 MDX 源码也可能影响估算。

## 默认分享图与 Fragment 短 ID（0.33.0+）

在 src/site.config.ts 现有 site 设置中合并 site.ogImage，可填写 public 根路径（如 /images/share.jpg，对应 public/images/share.jpg）或 HTTPS 图片地址。留空使用内置的 1200×630 Anglefeint 分享图。Fragments 及其所有 #ID 分享链接共用该默认图。文章专属图、自动生成的文章图保持优先；关闭自动生成时，文章封面也优先于站点默认图。更换图片后重新构建并部署，分享平台仍可能缓存预览。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment 使用区分大小写的字母和数字生成 8 位 Nano ID，读取各语言已有 Markdown ID 查重，冲突时重试。同一次命令的所有语言共享 ID 和发布时间。Fragment 仅接受恰好 8 位字母数字 ID，不兼容旧 UUID 或长 ID；旧内容请删除后重新发布，不提供迁移或旧链接兼容。新内容发布后请保留 ID，修改会改变评论关联。
