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

这份文档是 `astro-theme-anglefeint` 仓库的中文项目地图，面向维护者和 AI coding agent。它不替代 `README.md`、`AGENTS.md` 或 `docs/*`，而是把当前代码真相整理成一份可快速理解项目的总览。

重要原则：

- **代码是真相，文档跟随代码。**
- `main` 是运行时、架构、文档和 release 准备的 source of truth。
- `starter` 是生成/分发分支，不直接手改运行时逻辑。
- 主题包源码在 `packages/theme/src/**`。
- starter/demo 站点源码在根目录 `src/**`。
- 用户配置入口集中在 `src/site.config.ts`。
- `src/config/*` 和 `src/i18n/*` 是由模板同步生成/维护的 adapter，不建议直接手改。

## 1. 当前状态速记

当前仓库状态：

- 当前开发分支：`main`
- 当前已发布 npm 包版本：`@anglefeint/astro-theme@0.2.8`
- 当前 main 上存在未发布的 package 源码改动：
  - SEO/head metadata hardening
  - existence-aware locale alternate links for blog pages
  - Open Graph/Twitter image alt metadata
  - package-owned music deck 删除
  - Windows-local pre-push / pack CLI 检查修复
- 当前没有发布 npm。用户通过 `npm update @anglefeint/astro-theme` 仍只能拿到 npm registry 上的最新发布版本，直到下次 bump version 并执行 release。

这不是错误，而是正常的“main 已经准备了未来版本改动，但还没发布 npm”的状态。真正发布时，需要先 bump `packages/theme/package.json` 版本，例如从 `0.2.8` 到 `0.2.9`，再按 release workflow 执行。

## 2. 项目定位

Anglefeint 是一个基于 Astro 的多语言静态发布主题。它不是传统极简技术博客模板，而是一个偏个人品牌、AI/cyber publishing、作品展示与社交传播入口的主题系统。

它的核心价值不是“代码教程工具功能”，而是：

- 让站点有强烈视觉记忆点。
- 让文章、项目、AI/技术思考更适合分享传播。
- 让多语言、SEO、RSS、sitemap、canonical、hreflang 这些基础设施默认专业。
- 让主题以 npm package 形式可升级。
- 让 starter 保留清晰、低成本的用户配置入口。

## 3. 技术栈

- Framework：Astro 6
- 内容系统：Astro Content Collections，支持 Markdown 和 MDX
- 静态输出：`astro build`
- MDX：`@astrojs/mdx`
- RSS：`@astrojs/rss`
- Sitemap：`@astrojs/sitemap`
- 图片：Astro assets pipeline
- 前端运行时：轻量 vanilla scripts
- 测试：Node.js test runner、Playwright smoke test
- 文档元数据解析：`gray-matter`
- 代码质量：ESLint、Prettier、Astro check

## 4. 仓库角色

这个仓库同时承担两个角色：

1. **主题包**
   - package name：`@anglefeint/astro-theme`
   - 位置：`packages/theme`
   - 内容：layouts、components、styles、scripts、assets、utils、content schema、CLI scaffold。
   - 发布到 npm 后，starter 用户通过 `npm update @anglefeint/astro-theme` 获取 package 侧更新。

2. **starter/demo 站点**
   - 位置：根目录 `src`
   - 内容：站点配置、页面路由、内容集合、demo posts、adapter 文件。
   - `starter` 分支由维护脚本从 `main` 同步生成。

## 5. 页面体验

Anglefeint 的视觉体验按路由分层：

### Home

- 路径：`/:lang/`
- 默认情况下 `/` 会重定向到 `/<default-locale>/`。
- 风格：Matrix-inspired terminal landing。
- 主要文件：
  - `src/pages/[lang]/index.astro`
  - `packages/theme/src/layouts/HomePage.astro`
  - `packages/theme/src/layouts/shells/MatrixShell.astro`
  - `packages/theme/src/styles/home-page.css`
  - `packages/theme/src/scripts/home-matrix.js`

### Blog List

- 路径：`/:lang/blog/`，分页为 `/:lang/blog/N/`
- 风格：cyberpunk archive。
- 支持分页、跳页、多种分页视觉变体。
- 主要文件：
  - `src/pages/[lang]/blog/[...page].astro`
  - `packages/theme/src/layouts/shells/CyberShell.astro`
  - `packages/theme/src/components/pagination/CyberPagination.astro`
  - `packages/theme/src/styles/theme-cyber.css`
  - `packages/theme/src/styles/blog-list.css`
  - `src/scripts/cyber-rain-dust.js`

### Blog Post

- 路径：`/:lang/blog/[slug]/`
- 风格：AI-interface reading layout。
- 支持文章 hero 图、AI 视觉背景、阅读进度、related posts、Giscus comments、Red Queen side monitor。
- 主要文件：
  - `src/pages/[lang]/blog/[...slug].astro`
  - `packages/theme/src/layouts/BlogPost.astro`
  - `packages/theme/src/layouts/shells/AiShell.astro`
  - `packages/theme/src/styles/theme-ai.css`
  - `packages/theme/src/styles/blog-post.css`
  - `packages/theme/src/styles/ai/*`
  - `packages/theme/src/scripts/blogpost-effects.js`
  - `packages/theme/src/scripts/blogpost/*`

### About

- 路径：`/:lang/about/`
- 风格：hacker terminal profile。
- 受 `theme.enableAboutPage` 控制。
- 内容来自 `src/site.config.ts -> i18n.locales.<code>.about`。
- 主要文件：
  - `src/pages/[lang]/about.astro`
  - `packages/theme/src/layouts/shells/HackerShell.astro`
  - `packages/theme/src/styles/about-page.css`
  - `packages/theme/src/styles/about/*`
  - `packages/theme/src/scripts/about-effects.js`
  - `packages/theme/src/scripts/about/*`

## 6. 当前没有 music deck

历史上曾经尝试过 package-owned music deck，但当前 main 已删除该功能。

当前 tracked 代码中不应存在：

- `packages/theme/src/components/shared/MusicDeck.astro`
- `packages/theme/src/scripts/music-deck.js`
- `packages/theme/src/styles/music-deck.css`
- `packages/theme/src/music/**`
- `packages/theme/package.json -> files -> src/music`

如果搜索到 music deck，大概率是旧笔记、历史 commit 或未跟踪文件，不是当前产品能力。

## 7. 路由与 i18n

核心配置来自 `src/site.config.ts -> i18n`。

关键字段：

- `i18n.defaultLocale`
- `i18n.routing.defaultLocalePrefix`
- `i18n.locales`
- `i18n.locales.<code>.meta.label`
- `i18n.locales.<code>.meta.hreflang`
- `i18n.locales.<code>.meta.ogLocale`
- `i18n.locales.<code>.meta.enabled`
- `i18n.locales.<code>.meta.fallback`
- `i18n.locales.<code>.messages`
- `i18n.locales.<code>.site.hero`
- `i18n.locales.<code>.about`

默认语言首页模式：

- `always`：`/` 重定向到 `/<default-locale>/`。
- `never`：`/` 是默认语言 canonical，`/<default-locale>/` 重定向回 `/`。

语言切换：

- 普通页面尽量保持当前 path。
- blog detail 如果目标语言没有同 slug 文章，回落到目标语言 blog index。
- blog pagination 如果目标语言没有对应页码，回落到目标语言 blog index。
- `localeHrefs` 会同时传给 header language switcher 和 `<head>` hreflang alternate，避免 UI 与 SEO alternate 不一致。

## 8. SEO 与分享传播

核心文件：

- `packages/theme/src/components/BaseHead.astro`
- `packages/theme/src/utils/head.ts`
- `packages/theme/src/components/shared/ThemeFrame.astro`
- `src/pages/[lang]/blog/[...slug].astro`
- `src/pages/[lang]/blog/[...page].astro`
- `astro.config.mjs`
- `src/pages/robots.txt.ts`
- `src/pages/[lang]/rss.xml.ts`

当前 head 输出包括：

- `<title>`
- description
- canonical
- hreflang alternates
- `x-default`
- RSS discovery
- sitemap link
- robots
- Open Graph
- Twitter Card
- `og:image:alt`
- `twitter:image:alt`
- Open Graph locale / locale alternates
- article published/modified time
- JSON-LD WebSite / Person / BlogPosting

当前 SEO 优化重点：

- blog detail / blog pagination 的 `<head>` alternate links 使用 existence-aware `localeHrefs`。
- OG/Twitter image alt 默认使用页面 title。
- SEO 链路从 route 传入 layout，再传到 `ThemeFrame` 和 `BaseHead`。

当前还没有动态 OG image 生成系统。未来如果做，应优先保持 package/config 解耦，不要把站点 identity 或视觉设计硬编码到单篇文章逻辑里。

## 9. 用户配置入口

主入口：

- `src/site.config.ts`

配套文件：

- `src/site.config.schema.ts`
- `src/site.config.defaults.ts`
- `src/site.config.runtime.ts`

adapter 文件：

- `src/config/site.ts`
- `src/config/theme.ts`
- `src/config/about.ts`
- `src/config/social.ts`
- `src/i18n/config.ts`
- `src/i18n/runtime.ts`
- `src/i18n/messages.ts`
- `src/i18n/posts.ts`

adapter 模板：

- `scripts/adapter-templates/src/config/*`
- `scripts/adapter-templates/src/i18n/*`
- `scripts/adapter-templates/src/types/theme-scripts.d.ts`

规则：

- 改 adapter 行为时先改模板，再运行 `npm run sync-adapters`。
- 不要只手改生成后的 adapter 文件。
- starter/runtime/config/script/template 文件变化时，检查 `scripts/starter-manifest.mjs` 是否需要同步更新。

## 10. 内容模型

内容目录：

- `src/content/blog/<locale>/`

内容 schema：

- `packages/theme/src/content-schema.ts`
- `src/content.config.ts`

核心 frontmatter：

- `title`
- `description`
- `pubDate`

可选字段：

- `updatedDate`
- `heroImage`
- `subtitle`
- `context`
- `readMinutes`
- `wordCount`
- `tokenCount`
- `aiModel`
- `aiMode`
- `aiState`
- `aiLatencyMs`
- `aiConfidence`
- `author`
- `tags`
- `sourceLinks`
- `canonicalTopic`

`sourceLinks` 支持标准 `http(s)` URL，也支持裸域名，schema 解析时会规范化为 `https://...`。

## 11. CLI scaffold

用户命令：

```bash
npm run new-post -- my-first-post
npm run new-post -- my-first-post --locales en,zh
npm run new-page -- projects --theme ai
```

package CLI：

- `packages/theme/src/cli-new-post.mjs`
- `packages/theme/src/cli-new-page.mjs`

scaffold helpers：

- `packages/theme/src/scaffold/new-post.mjs`
- `packages/theme/src/scaffold/new-page.mjs`
- `packages/theme/src/scaffold/shared.mjs`

package tarball 检查：

- `scripts/check-theme-pack-cli.mjs`

该脚本会 `npm pack` theme package，并检查 CLI/scaffold 文件是否被包含。Windows 下会使用临时 npm cache 和 `cmd.exe /d /s /c npm ...`，避免 POSIX-only 或 Windows cache 权限问题。

## 12. Package 与发布状态

当前 package：

- name：`@anglefeint/astro-theme`
- current package version：`0.2.8`
- peer dependency：`astro ^5.0.0 || ^6.0.0`

当前 main 上有 package 源码变更，但还没有发布 npm。

这意味着：

- GitHub main / demo 部署会看到最新代码。
- npm 用户暂时不会拿到 main 上的新 package 源码。
- 未来发布 npm 时，需要先 bump package version。
- 不要在未 bump version 时执行真实 publish。

发布时遵循：

1. 确认 `main` 干净。
2. bump `packages/theme/package.json` 版本。
3. 更新 `CHANGELOG.md`。
4. 创建 `docs/releases/<version>.md`。
5. `npm run maintainer:sync-starter:check`
6. `npm run release:npm`
7. `npm run release:starter`
8. push `main`
9. push `starter`

## 13. 文档体系

入口文档：

- `AGENTS.md`

用户文档：

- `README.md`
- `README.zh-CN.md`
- `README.ja.md`
- `README.es.md`
- `README.ko.md`
- `packages/theme/README.md`
- `UPGRADING.md`
- `CHANGELOG.md`

维护文档：

- `docs/AI_WORKFLOW.md`
- `docs/DOC_METADATA_SPEC.md`
- `docs/DOC_SYNC_WORKFLOW.md`
- `docs/ARCHITECTURE.md`
- `docs/VISUAL_SYSTEMS.md`
- `docs/MAINTAINER_WORKFLOW.md`
- `docs/PACKAGING_WORKFLOW.md`
- `docs/PACKAGE_RELEASE.md`
- `docs/THEME_SUBMISSION_CHECKLIST.md`
- `docs/releases/*`

文档规则：

- public README 可使用 sidecar metadata。
- internal docs 优先使用 visible frontmatter。
- 运行 `npm run check:docs` 验证文档元数据。
- 行为变化后运行 `npm run suggest:docs` 推断需要同步的文档，但最终以代码真相和 metadata scope 判断是否修改。

## 14. Changelog 与 release notes

当前规则：

- `CHANGELOG.md -> [Unreleased]` 记录下一次 release 会带出去的用户/维护者可见变化。
- `docs/releases/<version>.md` 是每个 npm publish 的详细 release note。
- Git commit history 记录每次 push，不需要把每次 push 全部复制进 changelog。

当前 `[Unreleased]` 应包括尚未发布 npm 的重要变化，例如：

- SEO/social metadata hardening
- Windows-local pre-push validation fix

docs-only cleanup 可以不进 changelog，除非它影响用户升级或公开使用方式。

## 15. 验证命令

常用：

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format:check
npm run check:docs
npm run check:no-build
npm run check
```

测试：

```bash
npm run test
npm run e2e:install
npm run e2e
```

adapter / package：

```bash
npm run sync-adapters
npm run check:adapters
npm run check:workspace-link
npm run check:pack-cli
npm run check:scaffold
npm run theme:pack
```

release / starter：

```bash
npm run maintainer:sync-starter:check
npm run release:npm -- --dry-run
npm run release:npm
npm run release:starter
npm run release:starter:push
```

## 16. 高风险区域

高风险文件：

- `packages/theme/src/components/BaseHead.astro`
- `packages/theme/src/utils/head.ts`
- `packages/theme/src/components/shared/ThemeFrame.astro`
- `src/i18n/runtime.ts`
- `src/i18n/config.ts`
- `scripts/adapter-templates/src/i18n/*`
- `src/pages/[lang]/blog/[...slug].astro`
- `src/pages/[lang]/blog/[...page].astro`
- `src/pages/index.astro`
- `src/pages/[lang]/index.astro`
- `astro.config.mjs`
- `scripts/starter-manifest.mjs`
- `tools/maintainer/sync-starter.mjs`

高风险行为：

- canonical / hreflang / x-default 改动
- default locale routing 改动
- i18n fallback 改动
- package exports / files 改动
- starter manifest 改动
- generated adapter 改动
- npm publish / starter sync

## 17. 近期重要改动

### 删除 package-owned music deck

当前 main 已删除该功能和 package 打包入口，避免把非核心功能作为主题默认全站 runtime 带给用户。

### SEO/social metadata hardening

当前 BaseHead 支持：

- `localeHrefs`
- `imageAlt`
- OG/Twitter image alt
- existence-aware alternate links

### Windows pre-push checks

当前 Windows 本地检查已增强：

- package tarball check 使用临时 npm cache。
- Windows 下 npm 通过 `cmd.exe` 执行。
- i18n integration test 中目录 symlink 在 Windows 下使用 junction。

### Changelog 与 public config docs 对齐

近期补齐了：

- GitHub Release 历史与 `CHANGELOG.md` 的对齐。
- 日/西/韩 README 中当前真实配置面的缺口。
- packaging workflow 中 RSS/sitemap/robots 的真实路径描述。

## 18. 给 AI agent 的工作方式

每次进入项目：

1. 先读 `AGENTS.md`。
2. 再读 `docs/AI_WORKFLOW.md`。
3. 根据任务读 `README.md`、`docs/ARCHITECTURE.md`、`docs/VISUAL_SYSTEMS.md`、`src/site.config.ts`。
4. 先查代码真相，再判断文档是否漂移。
5. 不因为文档写了什么就让代码跟着文档走。
6. package/runtime/config 变更后，确认是否需要 npm release。
7. 用户明确说“先别发布”时，不执行 `npm run release:npm`。

## 19. 当前维护判断

当前项目的 P0 方向更偏：

- 分享传播体验
- SEO 基础设施
- 搜索/归档/发现能力
- 主题辨识度
- 用户升级成本可控

代码 copy、TOC、heading anchor、filename badge、Expressive Code 等更像技术博客工具功能，可以以后作为 P3 或按真实内容需求补，不应抢在传播和发现能力之前。

## 20. 最短总结

Anglefeint 是一个 Astro 6 多语言静态主题，核心是强视觉发布体验、可升级 npm package、单一配置入口、多语言 SEO、starter 分发和 AI-friendly 文档治理。当前 main 已移除 music deck，并包含未发布的 SEO/head 与 Windows tooling 改进；npm 包仍是 `0.2.8`，未来发布时需要 bump version、写 release note、同步 starter。
