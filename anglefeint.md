---
doc_id: anglefeint_project_summary
doc_role: reference
doc_purpose: Current Chinese project map for the Anglefeint Astro theme repository.
doc_scope:
  - architecture
  - visual-system
  - feature-summary
  - config
  - routing
  - seo
  - commands
  - package
  - validation
update_triggers:
  - architecture-change
  - visual-change
  - config-change
  - routing-change
  - seo-change
  - command-change
  - package-change
  - validation-change
audience:
  - agent
  - maintainer
depends_on:
  - AGENTS.md
  - README.md
  - docs/AI_WORKFLOW.md
  - docs/ARCHITECTURE.md
  - docs/VISUAL_SYSTEMS.md
  - docs/DOC_METADATA_SPEC.md
  - docs/PACKAGING_WORKFLOW.md
  - docs/PACKAGE_RELEASE.md
machine_summary: Current Chinese overview of the Anglefeint Astro theme repository, including architecture, feature inventory, route styles, config contracts, SEO, package status, release workflow, and validation commands.
---

# Anglefeint 项目全景说明

这份中文项目地图解释当前工程的功能和代码入口，面向维护者和 coding agent。**代码定义已实现行为，文档负责记录它。** 遇到差异先读实现、配置、调用方和测试，再修正文档；不为了让旧文档成立而修改代码。

本次核对基线为 `54738b5`，覆盖 `cb54464..54738b5` 的阅读、搜索、标签和发布改动。具体交付版本与验证结果见 [0.3.0 发布记录](docs/releases/0.3.0.md)；当前源码版本读取 [package.json](packages/theme/package.json)，不要把这里的快照当作实时 npm 状态。

## 1. 工程边界

- `main` 保存主题实现、站点骨架、维护工具和文档。
- `packages/theme/src/` 是 npm 主题包：组件、布局、样式、脚本、内容 schema、工具函数和 CLI。
- 根目录 `src/` 是 starter/demo：站点配置、路由、内容和适配器。
- `starter` 是由 [starter manifest](scripts/starter-manifest.mjs) 和 [同步工具](tools/maintainer/sync-starter.mjs) 生成的分发分支；不是独立手改的实现源。
- 用户修改 `src/site.config.ts`。schema/defaults/runtime 位于同级文件；`src/config/*`、`src/i18n/*` 的适配器实现来自 `scripts/adapter-templates/`。
- 当前工作区升级到 Astro 7.3.2，包 peer 范围为 `^7.3.2`，Sharp 为 `^0.35.4`。0.4.0 的迁移与实际分发验证见 [发布记录](docs/releases/0.4.0.md)。旧用户工程不会自动更新。

## 2. 页面与静态生成

| 页面         | 路由与代码入口                                                                                                | 当前行为                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 首页         | [首页路由](src/pages/[lang]/index.astro)、[HomePage](packages/theme/src/layouts/HomePage.astro)               | Matrix 终端视觉，展示最新文章                                                      |
| 博客列表     | [列表路由](src/pages/[lang]/blog/[...page].astro)、[BlogCards](packages/theme/src/components/BlogCards.astro) | Cyber 卡片列表，分页及可选跳页；有标签时显示“全部文章 / 标签”导航                  |
| 文章详情     | [文章路由](src/pages/[lang]/blog/[...slug].astro)、[BlogPost](packages/theme/src/layouts/BlogPost.astro)      | AI 阅读布局，目录、标签、代码复制、正文图片预览、阅读状态、相关文章和可选评论/侧屏 |
| 标签目录     | [目录路由](src/pages/[lang]/tags/index.astro)                                                                 | 每个启用语言的 `/:lang/tags/`，标签文章数量，680px 紧凑内容列                      |
| 标签文章列表 | [标签分页路由](src/pages/[lang]/tags/[tag]/[...page].astro)                                                   | `/:lang/tags/<slug>/` 及后续页，复用博客卡片和分页                                 |
| 关于         | [About 路由](src/pages/[lang]/about.astro)                                                                    | Hacker 风格；配置控制路由和导航，侧栏模态内容按语言读取                            |

构建采用 Astro 默认静态输出，内容来自 Markdown/MDX collections。不需要全文搜索后端或 SSR 服务。搜索、目录、标签都使用已有文章内容生成；不是手工给示例文章单独搭建的页面功能。

默认语言首页由 `i18n.routing.defaultLocalePrefix` 控制：`always` 时 `/` 重定向到 `/<default-locale>/`；`never` 时反向。这个设置不移除博客、标签等路由的语言前缀。

这里的首页跳转是静态 HTML meta refresh，并带 canonical 和 noindex，不是主题实现的服务端 301/302。博客列表与两个标签路由通过 [CyberAtmosphere](src/components/CyberAtmosphere.astro) 共用雨滴/尘埃初始化；标签页保留光柱和闪烁，使用更柔和的冰蓝/淡紫配色与较慢扫光。系统减少动态效果时，标签页保留静态背景，隐藏雨滴/尘埃/故障闪烁并停止背景动画。

## 3. 阅读与内容发现

### 全文搜索

[Astro 配置](astro.config.mjs) 注册包导出的 [Pagefind 集成](packages/theme/src/search.mjs)。`npm run build` 自动写出 `dist/pagefind/`，包含索引和语言 manifest，随静态网站部署。包持有 Pagefind 依赖；用户不需要另外执行索引命令。

[BlogPost](packages/theme/src/layouts/BlogPost.astro) 使用 `data-anglefeint-search` 标记可索引文章，`data-pagefind-body` 限定标题、副标题和正文。目录、标签导航、相关文章、评论和装饰状态不进入正文索引。`theme.search.enabled` 默认开启；`search: false` 排除一篇文章，不能通过 `search: true` 绕过全站关闭。

[Search 组件](packages/theme/src/components/Search.astro) 提供右上角图标和原生 dialog；[客户端脚本](packages/theme/src/scripts/search.js) 在打开时懒加载搜索资源，根据页面语言搜索，每批显示 8 条。支持输入法组合输入、200ms 防抖、失败重试、旧查询结果抑制及同源结果链接。点击蒙版、关闭按钮或 Escape 收起；从弹窗内部拖到蒙版不误关闭。

`npm run dev` 显示开发提示，不提供实时全文搜索。验证搜索要 build 后 preview；编辑文章后重建索引。空语言索引返回空结果，不回退搜索其他语言。

### 文章目录

文章路由把 Astro `render(post)` 返回的 `headings` 传给 [ArticleToc](packages/theme/src/components/ArticleToc.astro)。[目录工具](packages/theme/src/utils/article-toc.ts) 只收集 h2/h3，保留编译器文本和 slug；没有上级 h2 的 h3 显示在根层级。

目录只在文章详情中生效，不产生独立页面。1360px 及以上位于正文右侧边框外，sticky 并受文章高度限制；小屏位于正文之前。原生 details 默认展开，可键盘折叠；不自动编号，也没有随滚动高亮当前标题的逻辑。没有 headings 就不渲染；MDX 组件内部或原始 HTML 标题不会自动进入 Astro Markdown headings。

`theme.toc.enabled` 默认开启，文章 `toc: true/false` 覆盖全站默认。自定义文章路由必须传递 headings。

### 标签

[标签工具](packages/theme/src/utils/tags.ts) 去除首尾空格、空标签和同一文章的重复标签，保留大小写差异；每种标签按文章数降序排列，同数量按标签文本比较。标签文章顺序和页大小复用现有博客逻辑。

小写安全标签保留可读 URL；其他标签编码为稳定路径，Windows 保留名称和超长标签也有处理。重命名会换 URL，没有自动重定向或多语言标签翻译系统。

`theme.tags.enabled` 默认开启，关闭后不生成标签路由和导航。没有标签的语言仍有空目录，但博客不显示标签入口。没有标签的文章正常阅读。用户可以从博客标签导航、正文标签或直接 URL 访问，并不要求必须先点击某篇文章的标签。

### 代码块复制

[复制脚本](packages/theme/src/scripts/blogpost/code-copy.js) 在正文初始化时处理 `pre > code`，添加右上角按钮和状态提示。按钮在水平滚动容器外，复制的只有 `code.textContent`，保留代码缩进和换行。行内代码不加按钮。

使用浏览器 Clipboard API；HTTPS/localhost 且权限允许时复制成功，失败显示手动复制提示。状态 2 秒后恢复，可重试。不需要额外 Markdown 标记、第三方复制包或配置开关。

### 正文图片预览

[图片脚本](packages/theme/src/scripts/blogpost/image-preview.js) 给初始化时已有的正文图片绑定鼠标与 Enter/空格操作。链接或按钮内部的图片、hero 图片不处理。没有符合条件的图片就不创建弹窗。

预览使用同一张图片的 `currentSrc || src`，不自动找高清原图、不增加图片清晰度，不包含画廊切换或手势缩放。原生 dialog 展示图片和 alt 描述，支持关闭按钮、Escape 和蒙版关闭，恢复页面滚动与图片焦点。无独立开关。

临时 `article-image-preview` 演示文章及三张测试图片已删除。现有 [浏览器测试](tests/e2e/image-preview.spec.mjs) 注入图片 fixture，不依赖对外发布测试文章。

### 文章分享图（0.5.0）

默认在构建时生成 1200×630 PNG；[生成器](packages/theme/src/social/render.mjs) 使用 Satori、Sharp 和内置完整 Noto Sans CJK SC 字体，不联网获取或裁剪字体。约 16.4 MB 的字库只用于生成图片，不作为网页字体分发。超长标题仅在图片中缩略。

文章 `ogImage` 优先于自动图，支持文章相对图片、public 路径及 HTTPS URL；`theme.socialImage.enabled: false` 只关闭自动生成，手动图仍生效，其他文章回退到 hero 或默认图。正文封面独立。[构建集成](packages/theme/src/social-image.mjs) 和 theme adapter 必须与包一起迁移；发布的 0.4.0 尚不包含此功能。配置和测试对应见 [架构说明](docs/ARCHITECTURE.md#article-share-images)。

### 阅读状态和回到顶部

[进度脚本](packages/theme/src/scripts/blogpost/read-progress.js) 根据整个文档可滚动距离计算进度，10%、30%、60%、90% 各显示一次短暂阶段提示。这是阅读装饰反馈，不是文章下载/加载状态。

宽屏阶段提示位于正文右边框外 12px、视口底部上方 1rem；与目录是否开启无关。回到顶部滚动超过 400px 出现；有宽屏目录时向左、向上留出距离。细节和样式入口见 [视觉说明](docs/VISUAL_SYSTEMS.md#reading-feedback)。

## 4. 用户输入和实现对应

| 用户输入                       | 代码处理                                                        | 范围                             |
| ------------------------------ | --------------------------------------------------------------- | -------------------------------- |
| `theme.search.enabled`         | defaults → theme adapter → Search 组件与 Astro 集成             | 全站 UI 和构建索引               |
| `search: false`                | collection schema → BlogPost 索引标记                           | 单篇文章                         |
| `theme.toc.enabled` / `toc`    | defaults/schema → adapter → BlogPost → ArticleToc               | 全站默认 / 单篇覆盖              |
| `theme.tags.enabled` / `tags`  | defaults/schema → adapter → 标签工具、路由、TagLinks            | 全站路由开关 / 单篇归类          |
| 普通代码块、普通正文图片       | BlogPost prose data 属性 → initBlogpostEffects → 对应初始化脚本 | 正文；无需新开关                 |
| `i18n.locales.<code>.messages` | 合并后的 `getMessages`                                          | 搜索、目录、标签、复制和预览文案 |

[内容 schema](packages/theme/src/content-schema.ts) 必填 `title`、`description`、`pubDate`；`tags`、`toc`、`search` 均可省略。其他可选字段包括 hero、AI 元数据、更新时间、字数、作者和 sourceLinks。不要把没有实现的 draft、图片开关或播放器开关写成现有配置。

完整的“代码 → 文档 → 测试”入口见 [架构对应表](docs/ARCHITECTURE.md#code-to-documentation-map)。

## 5. 多语言与 SEO

- 配置经 `site.config.runtime.ts` 归一化；省略默认语言配置不等于禁用，显式 `meta.enabled: false` 用于禁用非默认语言。
- 博客详情与分页的语言切换使用存在性判断，不存在时回到目标语言博客首页。
- 标签语言切换匹配同名标签的第一页，否则进入目标语言标签目录，不保留分页序号。
- [BaseHead](packages/theme/src/components/BaseHead.astro) 负责 canonical、分享元数据、RSS discovery 和结构化数据。
- 普通页面可用 `localeHrefs` 同时提供导航与 hreflang；标签页明确 `includeAlternateLinks=false`，保留 canonical，但不声称标签页面互为翻译。
- RSS 是 `/:lang/rss.xml`；sitemap 由 Astro 集成生成，`robots.txt` 来自站点路由。
- 当前没有动态 OG 图片生成器。

## 6. CLI 与分发

`npm run new-post -- slug` 调用 package bin，根据可信 TypeScript 配置的启用语言创建文章；`--locales` 优先于环境变量 `ANGLEFEINT_LOCALES`，两者都优先于配置。显式指定语言会跳过配置加载。重复创建跳过既有文章。

显式语言参数只生成文件，不修改语言配置；例如创建 `fr` 文章后，仍需在站点配置中启用 `fr`，对应路由才会生成。

`npm run new-page -- projects --theme base` 创建本地多语言页面。主题变体包括 base、ai、cyber、hacker、matrix；重复页面报错。CLI 实现和 config loader 位于 `packages/theme/src/cli-*.mjs`、`packages/theme/src/scaffold/`。

0.3.0 的搜索注册、目录 headings 接线和标签路由属于项目骨架；只更新 npm 包不会添加这些文件。用户迁移按 [UPGRADING](UPGRADING.md) 创建新模板并迁移个人内容/设置；维护者按 [发布工作流](docs/AI_WORKFLOW.md#end-to-end-release-sequence) 从 main 同步 starter，不对用户的定制工程执行该工具。

发布顺序是：代码/验证/版本准备提交 → 推送 main → npm 发布和下载核验 → starter 同步、验证和推送 → 远程模板验收 → 发布记录收尾 → 标签指向 npm 源码提交并创建 GitHub Release。逐步命令以 [发布 runbook](docs/PACKAGE_RELEASE.md) 为准。

## 7. 文档工作流与验证边界

工程已有 [文档同步工作流](docs/DOC_SYNC_WORKFLOW.md)，对应脚本是 [suggest-doc-updates.mjs](scripts/suggest-doc-updates.mjs) 和 [validate-doc-metadata.mjs](scripts/validate-doc-metadata.mjs)。

- `npm run suggest:docs` 按变化路径、metadata scope/trigger 和依赖关系推荐审阅文档，不生成说明。
- 默认只读取工作区变化；代码已提交时要把选定 commit range 的路径显式传入。
- `npm run check:docs` 检查元数据和已编码的仓库规则，不证明说明符合实现。
- 逐项核对配置默认、入口/输出、边界、样式脚本、测试，然后更新相应文档；没有变化的文档注明跳过原因。
- 历史 release notes 保留当时事实，当前参考文档不能把历史计划当作待做功能。

常用验证命令包括 `npm run test`、`npm run lint`、`npm run check`、`npm run e2e` 和 `npm run check:installed -- --build`。测试覆盖入口见架构对应表；发布验收的具体运行环境、数量和未修复事项留在发布记录中。本轮文档审阅不等同于重新发布或重新通过安全审计。

## 8. 已实现与未实现的边界

文章目录、全文搜索、标签浏览、代码块复制和正文图片预览已经实现，不能再列为待开发建议。

当前提供默认关闭的 MusicDeck：在 `src/site.config.ts` 的 `theme.music` 中启用并配置曲目。播放器组件、样式、播放核心和会话存储独立；未启用或空歌单不挂载，首次访问点击播放后才加载音频，不内置歌曲。桌面位于左下角，手机默认收起，展开时避让回到顶部。0.8.1 起，正在播放时切页会尝试从保存位置续播，主动暂停后仍保持暂停；浏览器拦截时提示点击继续，不支持跨页无缝播放。配置与安装边界见 [架构说明](docs/ARCHITECTURE.md#optional-music-player) 和 [升级指南](UPGRADING.md)。

没有新增首次建站引导弹窗、专用引导 CLI、Expressive Code、代码文件名标记、目录 scroll-spy、图片画廊或动态 OG 功能。后续需求应从真实用户需要出发，不能由旧讨论或本文件中的提及自动变成产品承诺。

本轮核对记录见 [代码与文档审阅记录](docs/CODE_DOC_AUDIT.md)。
