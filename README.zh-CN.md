<h1 align="center">Anglefeint</h1>
<p align="center">一个具有电影感、多氛围切换的 Astro 个人发布主题。</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">在线演示</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">仓库地址</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md">主题提交文案</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.2-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## 模板安装

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

使用 pnpm 时，先用上面的 npm 命令创建模板（跳过依赖安装提示），再进入生成的项目目录执行：

```bash
pnpm install
```

## 环境要求

- Node.js `22.12.0+`（建议 LTS）
- 0.8.0 starter 的文档命令已在 Linux 下通过 npm + Node 22、pnpm 10 + Node 24 验收；未测试 yarn/bun。详见[验收记录](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.8.0.md)。

## 快速开始

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

质量检查命令：

```bash
npm run doctor
npm run check
```

使用 `pnpm`：

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 升级主题

对于 `#starter` 创建的项目，仅在目标版本明确兼容现有 starter 和 Astro、且无需本地结构迁移时执行：

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update` 只在 `package.json` 声明的范围内更新：`^0.5.1` 不包含 `0.6.0`。兼容但跨范围的更新，应按发布说明安装明确的目标版本，不要直接安装 `@latest`。用 `npm ls @anglefeint/astro-theme astro` 确认实际版本。

当前 starter 的 `doctor` 已包含检查和构建，成功后用 `npm run preview` 人工检查站点。只有明确报告生成适配文件与本地模板不同步时，才运行 `npm run sync-adapters`，然后重跑 `npm run doctor`；它不会下载上游模板。旧工程的脚本可能不同，请查看本地 `package.json` 并遵循升级指南。

如果发布说明涉及 starter 骨架变化，建议在新目录创建最新模板，再迁移文章、资源和个人设置，不要用旧文件整体覆盖新配置辅助文件。`npm update` 只更新主题包，不保证所有历史 starter 都能原地升级。详见[升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

如果你的自定义代码还在引用 `src/consts` 或 `@anglefeint/astro-theme/consts`，请迁移到 `src/config/site.ts`。

如需进行 Astro 大版本升级，请先参考官方升级文档：

- https://docs.astro.build/en/guides/upgrade-to/
- 然后按上方升级指南的验证清单检查。

## 新建文章

一次为配置中已启用的语言创建同名 slug：

```bash
npm run new-post -- my-first-post
```

Slug 规则：仅使用小写字母、数字和连字符（示例：`my-first-post`）。
如果 `src/assets/blog/default-covers/` 中存在默认封面，脚本会按 slug 哈希自动分配一张（后续可手动替换 `heroImage`）。
可选语言覆盖：

```bash
npm run new-post -- my-first-post --locales en,fr
# 或
ANGLEFEINT_LOCALES=en,fr npm run new-post -- my-first-post
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

## 语言

[English](README.md) · 简体中文（当前） · [日本語](README.ja.md) · [Español](README.es.md) · [한국어](README.ko.md)

## 预览

| 首页                                                           | 博客列表                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| 文章页                                                                        |
| ----------------------------------------------------------------------------- |
| ![Blog post preview](public/images/theme-previews/preview-blog-post-open.png) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.png) |

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
- Starter 内置示例语言：`en`、`ja`、`ko`、`es`、`zh`
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

说明：

- `site.description` 是站点级默认描述。首页优先使用解析后的 `messages.siteDescription`（含内置与回退语言文案），只有解析结果为空才回退到站点描述；仅修改 `site.description` 不会替换内置首页描述。
- 语言配置与默认值深合并。禁用语言请设置 `i18n.locales.<code>.meta.enabled = false`，省略覆盖项不代表删除语言；默认语言始终启用。
- 语言元信息当前支持 `label`、`hreflang`、`ogLocale`、`enabled`、`fallback`。

### 可选：Giscus 评论

评论默认关闭。启用方式：

1. 在 `src/site.config.ts` 中设置 `theme.comments.enabled = true`。
2. 填写：
   - `theme.comments.repo`
   - `theme.comments.repoId`
   - `theme.comments.category`
   - `theme.comments.categoryId`
3. 可选设置：
   - `theme.comments.mapping`
   - `theme.comments.term`（当 `mapping = "specific"` 时必填）
   - `theme.comments.number`（当 `mapping = "number"` 时必填）
   - `theme.comments.strict`
   - `theme.comments.reactionsEnabled`
   - `theme.comments.emitMetadata`
   - `theme.comments.inputPosition`（`top` 或 `bottom`）
   - `theme.comments.theme`
   - `theme.comments.lang`
   - `theme.comments.loading`
   - `theme.comments.crossorigin`

核心 ID 缺失时不渲染评论。启用评论后，`mapping="specific"` 缺少 `term`，或 `mapping="number"` 的 `number` 不是有效正整数字符串，会抛出配置错误并可能中止开发启动或构建。

CLI 使用合并配置中启用的语言；配置错误会中止生成。显式 `--locales` 或 `ANGLEFEINT_LOCALES` 可覆盖语言选择，无需加载配置。

## 配置入口

- 单一入口：`src/site.config.ts`
- 适配层（不建议直接编辑）：`src/config/site.ts`、`src/config/theme.ts`、`src/config/about.ts`、`src/config/social.ts`
- 站点信息仍支持 `PUBLIC_*` 环境变量覆盖

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

自定义图片：文章 frontmatter 写 `ogImage: ./share.png`（图片放文章旁边），或 `ogImage: /images/share.png`（对应 `public/images/share.png`）。也支持 HTTPS 图片地址，其可用性与缓存由图片提供方负责。本地图片不存在时会报错。

在 `src/site.config.ts` 设置 `theme: { socialImage: { enabled: false } }` 可关闭自动生成。手动 `ogImage` 始终优先，其他文章回退到正文封面或原有默认图。修改后重新构建、部署；自动图片位于 `dist/_social/`，文章 HTML 的 `og:image` 给出准确地址。图片地址随内容变化，但外部平台仍可能缓存链接预览。

内置字体覆盖默认的中、英、日、韩、西班牙语；超长标题仅在图片中缩略，不修改文章标题。不保证所有 emoji 和其他文字系统。生成会增加构建时间与安装体积，字体不会因此被文章页面下载。

## 许可证

MIT License，见 `LICENSE`。

## 可选音乐播放器

默认关闭。将音频放在 `public/music/`，把以下配置合并到 `src/site.config.ts`：

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

每首歌填写 `title`、`src`，`artist` 可选，也支持 HTTPS 音频直链。空歌单不显示播放器。点击播放后才加载音频；同一标签页会话内记住曲目、进度和音量，切页后需要再次点击播放，不支持跨页面无缝播放。
