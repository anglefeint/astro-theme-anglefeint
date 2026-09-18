---
doc_id: code_doc_audit
doc_role: reference
doc_purpose: Dated evidence and dispositions for code-first documentation audits and subsequent feature changes.
doc_scope: [docs, architecture, config, routing, visual-system, validation]
update_triggers:
  [doc-process-change, architecture-change, config-change, routing-change, script-change]
source_of_truth: false
audience: [agent, maintainer]
depends_on: [docs/DOC_SYNC_WORKFLOW.md, docs/ARCHITECTURE.md, docs/VISUAL_SYSTEMS.md, anglefeint.md]
---

# 代码与文档核对记录：2026-09-14

## 2026-09-19 多语言文章逐项核对与站点域名修复（本地未发布）

基准：main `ebbf7ecc64db5edbeadd89712a139ce44327eef0`，五种语言各 14 篇，共 70 篇。重点检查 15 篇使用指南的命令、配置片段、默认值、关闭状态、路由和升级边界；同时复核旧文章的视觉及架构描述。旧叙事文章篇幅不完全相同，不把设计理念视为功能保证。本轮不删除文章，不改变 slug 和 `pubDate`，25 篇修订文章的 `updatedDate` 更新为 2026-09-19。

| 文章 / 事项                                                | 对照的实际实现                                                                                                                                                       | 处理                                                                                                    |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 三篇使用指南的安装、配置、语言和创建命令                   | `package.json`、`scripts/starter-package.mjs`、`src/site.config.schema.ts`、defaults/runtime、`packages/theme/src/cli-new-post.mjs`、`cli-new-page.mjs`、`scaffold/` | 45 个 TS 示例通过真实类型及默认值/归一化逻辑验证；保留现有命令与翻译结构                                |
| `how-upgrade-works` 五语                                   | npm 版本范围及 starter 文件所有权、`UPGRADING.md`                                                                                                                    | 命令改为可复制代码块，补充 `npm update` 不跨声明范围；保留 starter 文件不随包更新的边界                 |
| `route-visual-system-design` 五语                          | `src/pages/index.astro`、`src/pages/[lang]/index.astro`、`src/i18n/config.ts`、`CyberAtmosphere.astro`                                                               | 修正默认首页地址，说明 `i18n.routing.defaultLocalePrefix` 只影响默认语言首页，以及 About 和标签页面条件 |
| 使用指南 2 五语                                            | `src/utils/metrics.ts`、`src/pages/[lang]/blog/[...slug].astro`                                                                                                      | 说明指标是估算或 frontmatter 覆盖值，不是 AI 服务实测数据                                               |
| 使用指南 3 五语                                            | 音乐 core/controller/storage、`MusicDeck.astro`                                                                                                                      | 区分打开页面不自动播放与曲目结束后自动切歌、循环回第一首；保留跨页暂停与同标签页恢复说明                |
| 搜索、目录、标签、图片预览、代码复制、分享图、评论和 About | 包内 search/social-image 集成、BlogPost、相关组件/脚本/工具，starter 路由和配置适配器                                                                                | 默认值、单篇覆盖、构建时生成、浏览器交互及手动图片优先级等说明与代码相符，未因此修改功能                |
| 使用指南 1 五语的环境变量说明                              | `astro.config.mjs` → `src/config/site.ts` → `BaseHead.astro` / RSS / sitemap / robots                                                                                | 发现实际代码缺陷，先报告并取得用户允许，再修复；补充五语操作与 starter 升级边界                         |

缺陷证据：修复前以进程环境变量 `PUBLIC_SITE_URL=https://audit-public-site.example` 进行真实隔离构建，首页 canonical 和 sitemap 仍指向 `https://example.com`。配置求值阶段没有正常取得 `import.meta.env`，而页面优先使用已确定的 `Astro.site`。修复在 starter 的 `astro.config.mjs` 调用 `scripts/resolve-site-url.mjs`，使用 Vite 的 `loadEnv`，支持项目 dotenv、CLI mode 和进程变量优先级；新增脚本已加入 starter manifest，Vite 声明为直接构建依赖，锁文件未升级其他依赖。包内运行时没有改动。

本轮新跑的验证：

- `npm run check` 通过：文档、workspace 链接、字体、适配器、打包 CLI、56 项单元测试、scaffold、164 个 Astro 文件检查（零错误/警告）及完整构建、五语言 About 配置验证。
- `npm run lint` 通过；45 个教程 TS 配置示例、YAML、封面路径、45 个系列链接及五语章节/示例顺序验证通过。15 个构建后教程的 HTML、目录锚点、分享图与五语言搜索索引检查通过。
- 分别用进程环境变量和临时 `.env.<mode>` 文件做真实隔离构建；每次遍历 106 个 HTML 页面的 canonical 和存在的 `og:image`，并检查五语 RSS、两个 sitemap 文件和 robots sitemap 地址，全部使用各自的测试域名。测试文件及隔离构建产物已清理。
- 依赖锁文件更新审计：零已知漏洞。本轮没有重新执行所有用户 CLI 的云端验收或播放器浏览器交互测试，不以历史结果冒充新测试。

文档流程：`suggest:docs` 产生广泛的架构、SEO、工作流候选；实际更新文章、ARCHITECTURE、UPGRADING 和本记录。README 的环境变量说明由代码修复实现，无需重写；视觉规范、发布算法、代理入口和历史发布记录无需改动。当前修复仅在本地，未 commit/push、未同步公开 starter；主题包仍为 0.7.0，无需为本次 starter/文章修复发布 npm。后续交付须按既有流程提交 main，再生成并验证 starter。

## 2026-09-19 教程交付与演示站部署复核

核对 main `75402b4` 与其前序 `0f12176`、starter `b7b0d75` 与其前序 `8b503c7`：main 的 70 篇文章（每语言 14 篇）未删除，本次仅重写五语言的三篇教程。starter 在更新前后都只有 20 篇（每语言四篇），对应 [starter 内容清单](../scripts/starter-manifest.mjs) 中的欢迎文章及三篇指南。该清单不代表演示站完整文章库。

此前教程交付验证通过：45 段 TypeScript 示例按实际配置类型、默认合并及归一化函数检查；15 篇构建页面及系列链接验证；main 推送检查、隔离 starter 构建/审计、公开模板安装和 CLI/doctor/dev/preview 验收通过，审计为 0 个已知漏洞。这些是前一轮交付证据，不算本轮重新执行，也不能证明生产演示站内容完整。

随后复查线上 `/en/blog/` 仅列四篇，`/en/blog/2/`、`/en/blog/hello-world/` 和 `/en/blog/neon-archive-blog-list/` 返回 404。GitHub 上 Cloudflare 检查显示 main `75402b4` 于 2026-09-18 15:32:30 UTC 构建成功，starter `b7b0d75` 于 16:26:29 UTC 构建成功。线上内容与 starter 一致，且后者构建更晚，指向演示站被 starter 内容替换；仅凭检查记录不能确定后台具体部署命令或活动版本。最初把“教程可访问”当成整体上线成功，遗漏了最后一次推送后的完整文章库复查。

用户于 2026-09-19 告知已在 Cloudflare 修改设置；此处记录为用户报告，不声称代理已读取并确认后台设置。本轮补充 [维护者部署规则](MAINTAINER_WORKFLOW.md#production-demo-deployment)，并在 AI 工作流、分支政策和包发布流程中接入：生产站只部署 main，starter 分发与演示站验收分开，最后一次推送后必须复查旧文章、各语言与分页。修复部署来源不需要恢复未删除的文件或发布 npm。

文档工作流以发布/AI 工作流路径为输入，直接候选包含维护流程、分支政策、审计记录和代理入口，传播候选包含 README/升级说明及历史发布记录。本轮只修改五份负责维护流程的文档；README 和五语教程的用户功能说明、运行时架构/视觉说明、元数据与文档同步算法无需改变，历史版本记录保持历史事实。代理入口已指向 AI 工作流，无需重复整套部署规则。这五份文档不在 starter 分发清单内，因此本轮只提交 main，不需要同步 starter 或创建 npm/GitHub 新版本。

本记录写于恢复部署之前，不预先声称线上已恢复。文档提交推送 main 后，需按完整文章库进行线上验收并报告实际结果。

## 2026-09-18 Optional music release review

Reviewed the music feature changes against `c700d40`, following config/schema/defaults → adapter/normalizer → conditional mount → controller/core/storage → CSS and installed output. The site now inherits `music.enabled: false` and an empty playlist; the local demonstration MP3 has been removed. Five-language README examples describe the actual public-path/HTTPS inputs, lazy audio loading and navigation/resume limitation. Architecture records source/test links; Visual Systems records lower-left placement, desktop session preference, mobile compact entry and return-to-top avoidance. UPGRADING and the package README explicitly require the matching starter configuration files.

`suggest:docs` returned broad direct candidates and no propagated-only candidates. Updated responsible configuration, architecture, visual, upgrade and release documents. Agent entrypoints, metadata/doc-sync/release algorithms, existing CLI commands, routing/SEO and theme-listing claims need no change for this optional feature; historical release evidence remains historical. Added an explicit `utils/music` package export and installed-starter enabled/disabled checks to cover the npm resolution boundary. Validation and delivery results are recorded in [0.7.0](releases/0.7.0.md), without treating earlier runs as new release evidence.

## 2026-09-16 Current package and command acceptance

本轮基准为 main `623c4eb161e691add874fd0874db51b1cf691ff5`，主题包为 0.5.1。以当前实现为准审阅，不按历史文档修改运行时。

- 已运行 `suggest:docs`，显式输入 defaults、包 i18n、两个 CLI、搜索及分享图集成路径。直接候选包括五语 README、包 README、UPGRADING、ARCHITECTURE；传播候选包括工作流、发布记录和元数据说明。候选仅用于定位责任文档。
- 核对 defaults → theme adapter → `astro.config.mjs` → `BlogPost.astro`、TOC/tag utilities、图片预览脚本与 `CyberAtmosphere.astro`。搜索、目录、标签、分享图的默认开关，图片预览源，标签特效以及语言名称说明与当前实现一致；保留架构和视觉说明。
- 五语 README 的包管理器验收说明停留在 0.3.0；更新为本轮 0.5.1 Linux 验证范围。包 README 的裸 CLI 示例改用 `npx`，避免让用户误以为本地安装会自动加入普通终端 PATH。
- 五语 `how-upgrade-works.md` 示例遗漏 starter 文件不会随 npm 更新的边界；补充与 CLI/包发布边界一致的迁移说明。UPGRADING 已正确说明该边界，保留。
- 修正 0.5.1 发布记录中被写成代码块标签语句的配置片段，给出有效的 `defineThemeConfig({...})` 对象示例。原发布时仅 npm、无浏览器目视验收的历史记录保留，并链接后续证据。
- AGENTS、AI_WORKFLOW、DOC_SYNC_WORKFLOW 和元数据规则无需因验收新增而改变；其他历史版本不改写为当前状态。独立云端脚本尚未合入 main，不能把它描述为 main 的自动发布门禁。

### 后续验收证据（复用已完成运行，本轮未重跑）

- [文档命令验收](https://github.com/anglefeint/astro-theme-anglefeint/actions/runs/35074441939)：Linux npm + Node 22.23.2、pnpm 10.34.5 + Node 24.20.0 均成功，主题解析为 0.5.1，依赖审计零已知漏洞。
- [固定版本的脚本](https://github.com/anglefeint/astro-theme-anglefeint/blob/c5fc3f87ff3ecb641bc382ea8629bd364386d9bd/tools/documented-commands.mjs) 覆盖 starter 14 个脚本入口；文章默认语言、显式参数、环境变量和优先级；五种页面模板与五语路由；帮助、npx/本地 bin；重复创建保护和非法输入；adapter 偏移检测及修复；开发和预览的 HTTP 检查。
- `check:workspace-link` 在消费者工程中按设计跳过；不计为 workspace 链接验证。pnpm 跳过 esbuild 安装脚本的提示未阻断本轮 Linux 检查和构建。
- 包更新仅验证当前 starter 结构下 0.5.0 → 0.5.1、配置与文章保持不变，不证明任意历史 starter 可原地升级。创建模板使用非交互参数，未测试交互式安装向导。裸 bin 通过本地可执行路径测试，不代表全局 PATH 可直接调用。
- [Chromium 回归](https://github.com/anglefeint/astro-theme-anglefeint/actions/runs/35074441897) 在 Node 22/24 均通过：语言切换、目录链接数、复制与剪贴板、图片打开/Escape、分享图、preview 搜索和标签。390px 仅为首页语言选择器窄屏检查，不是真机手机测试；未覆盖 Firefox/Safari。
- 没有修改主题运行时，也没有重新发布 npm。本文记录源码审阅与验收证据，不宣称所有参数组合、设备和历史升级路径已覆盖。

## 2026-09-16 分享图与语言选择器核对

输入为 `cd7007e179d762ba6858d6cf17059c2b0530432a` 之后的工作区变更：分享图生成器、字体资产、构建集成、文章 schema、head 传递链、配置与 adapter、相关测试，以及上一轮语言选择器单层边框调整。文档工具的嵌套 node_modules 排除也在核对范围。

按 `suggest:docs` 的候选核对实际源码。已更新五种语言 README、包 README、UPGRADING、CHANGELOG、项目地图、ARCHITECTURE、VISUAL_SYSTEMS、PACKAGING_WORKFLOW、THEME_SUBMISSION_CHECKLIST 和 DOC_SYNC_WORKFLOW。架构的分享图章节记录代码到测试的对应关系。明确使用完整本地 Noto 字体（约 16.4 MB）、无需构建联网取字体、手动图优先、关闭回退、长标题限制和 package/starter 共同迁移要求。

AGENTS、工具入口、通用发布/元数据规则没有因本功能改变，保留；历史 release 文件保持历史事实；ASTRO_THEME_LISTING 暂不增加尚未发布的功能卖点。README 的 Astro 6.1.3 徽章与当前 Astro 7.3.2 依赖不一致，一并修正。

复用本次开发中已完成的验证：50 项测试、24 项浏览器测试、154 个 Astro 文件检查、主工程构建、独立已安装主题的五组构建配置与审计通过；之后专项测试再次通过，打包预览确认包含字体与许可证，主工程审计为零已知漏洞。本轮另执行文档校验和推送 hook 要求的完整工程检查，实际结果以命令输出为准。

本次用户要求文档同步并推送源码，因此仅交付 main，按维护流程允许的已记录原因暂缓完整发布：CHANGELOG 标为 Unreleased，版本仍为 0.4.0，不执行 npm 发布、starter 同步、tag 或 GitHub Release。正式分发仍须版本升级及完整安全发布流程；不能将本次源码推送称为发布完成。

这是一次审阅快照，不是持续自动运行的审计结果。当前功能入口由 [架构对应表](ARCHITECTURE.md#code-to-documentation-map) 维护，中文总览见 [项目地图](../anglefeint.md)。后续代码变化不能据此直接声称文档仍然一致。

## 输入与方法

- 审阅开始时源码为 `54738b51ea37784a1500c8b63f31d6768ee218f7`，main 工作区干净。
- 回顾范围为 `cb54464..54738b5`，覆盖目录、Pagefind、标签、复制、图片预览、阅读状态布局和 0.3.0 发布；同时核对变更涉及的既有配置、路由、SEO、CLI 与 starter 边界。
- 通过 `git diff --name-only cb54464..HEAD` 获得路径，显式传给 `scripts/suggest-doc-updates.mjs --json`。也读取了 `git log`：临时图片文章先添加后删除，在最终净差异中可能不可见。
- helper 直接命中原有 43 份维护文档，传播命中 0，元数据读取错误 0。广泛命中只是审阅候选，不代表 43 份都需要改写。
- 对照代码中的配置默认值、collection schema、adapter、页面路由、构建集成、组件 DOM、客户端脚本、CSS 和测试断言。没有为了符合旧文档而修改运行时。

## 发现与修正

| 文档偏移或遗漏                                              | 代码/证据                                                                                                                                                 | 本次处理                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --- | --------------------------------------------------------------- |
| 项目地图仍称版本为 0.2.11，并把 TOC、copy 当作未来建议      | [包版本与导出](../packages/theme/package.json)、[文章初始化](../packages/theme/src/scripts/blogpost-effects.js)、[0.3.0 交付记录](releases/0.3.0.md)      | 重写当前功能地图，用链接承载发布快照，不把历史建议写成当前状态         |
| 文档 helper 被容易误解为内容同步或正确性验证                | [建议脚本](../scripts/suggest-doc-updates.mjs)、[元数据校验器](../scripts/validate-doc-metadata.mjs)                                                      | 明确仅推荐候选/校验元数据，增加已提交代码的显式输入与人工语义核对步骤  |
| 搜索只写成文章页说明，复制/图片说明混在标签末尾             | [共享 Header](../packages/theme/src/components/shared/CommonHeader.astro)、[BlogPost](../packages/theme/src/layouts/BlogPost.astro)                       | 按全站搜索、文章目录、标签、复制、图片、阅读反馈整理章节               |
| 配置/路由/包边界缺乏可追踪入口                              | [默认值](../src/site.config.defaults.ts)、[adapter 模板](../scripts/adapter-templates/src/config/theme.ts)、[manifest](../scripts/starter-manifest.mjs)   | 新增代码→文档→既有测试表；说明 npm 更新不会创建 starter 路由和搜索注册 |
| 标签目录访问、排序/编码、空状态和语言切换边界不完整         | [标签工具](../packages/theme/src/utils/tags.ts)、[目录](../src/pages/[lang]/tags/index.astro)、[分页路由](../src/pages/[lang]/tags/[tag]/[...page].astro) | 记录直接访问 URL、大小写、编码、排序、空语言、禁用路由及跳转第一页规则 |
| 总览把所有页面的语言导航与 hreflang 视为相同                | 标签路由传递 `includeAlternateLinks=false`；[BaseHead](../packages/theme/src/components/BaseHead.astro)                                                   | 明确标签页保留 canonical/语言导航但不输出 hreflang                     |
| “点击放大”可能被理解为自动获取高清原图或完整图库            | [图片预览脚本](../packages/theme/src/scripts/blogpost/image-preview.js)                                                                                   | 记录 `currentSrc                                                       |     | src`、排除 hero/链接/按钮图片、初始化范围、无图库/手势/独立开关 |
| 滚动提示容易被当作内容加载状态                              | [阅读进度脚本](../packages/theme/src/scripts/blogpost/read-progress.js)、[样式](../packages/theme/src/styles/blog-post.css)                               | 说明依据文档滚动距离和阶段阈值计算，与加载无关；位置不依赖 TOC 开关    |
| README 暗示本次 pnpm 验收已执行                             | [0.3.0 验证记录](releases/0.3.0.md#known-limitations)                                                                                                     | 五种语言一致注明本次仅验收 npm，未复验 pnpm/yarn/bun                   |
| 升级说明中的“正常 starter 发布流程”可能误导用户运行维护工具 | [同步工具](../tools/maintainer/sync-starter.mjs)操作上游 main/starter 分支                                                                                | 用户迁移与维护者分发流程明确分开                                       |

## 文档处置

更新原有 18 份文档，并新增本记录：

- `AGENTS.md`、`docs/AI_WORKFLOW.md`、`docs/DOC_SYNC_WORKFLOW.md`、`docs/DOC_METADATA_SPEC.md`：代码优先、工具边界、已提交变化的核对流程。
- `anglefeint.md`、`docs/ARCHITECTURE.md`、`docs/VISUAL_SYSTEMS.md`：当前工程地图、实现边界、源码与测试对应点。
- 五种语言的 `README*.md`、`packages/theme/README.md`：功能入口、复制/图片独立章节、使用边界与验证范围。
- `UPGRADING.md`、`docs/PACKAGING_WORKFLOW.md`：package/starter 分工与迁移边界。
- `ASTRO_THEME_LISTING.md`、`docs/THEME_SUBMISSION_CHECKLIST.md`：已实现功能摘要及相应人工验收点。
- `CONTRIBUTING.md`：贡献步骤接入现有文档工作流。

第一轮以下 25 份候选保留原文；第二轮又修正了其中的 MAINTAINER_WORKFLOW 和 PACKAGE_RELEASE，见后面的复核记录：

- `CLAUDE.md`、`.cursor/rules/00-repo.mdc`：已指向中立入口与规范，不复制新的独立规则。
- `docs/BRANCH_POLICY.md`、`docs/MAINTAINER_WORKFLOW.md`、`docs/PACKAGE_RELEASE.md`：本轮没有修改分支同步或发布脚本；当前运行顺序与刚完成的发布证据一致。
- `CHANGELOG.md`：已有本轮用户功能，不把纯文档整理包装成新功能或新版本。
- `docs/releases/` 的 19 份记录（含索引）：保留历史发布事实。0.3.0 的 npm/starter 源码、远程验收、测试修正与依赖告警已经记录；本轮没有新增发布证据。

sidecar 元数据继续复用，职责和关联路径没有变化。普通博客内容不属于维护文档元数据检查范围；本轮仅核对其 tags 和测试关键词等输入，没有重写教程或重新引入已删除的图片文章。

## 验证与交付边界

本轮验证仅针对文档：`npm run check:docs` 扫描 44 份维护文档通过；19 份本轮修改/新增文档的 142 个本地链接及对应章节锚点已验证存在。Prettier 对本轮全部文档的检查和 `git diff --check` 均通过。最终 helper 复查直接命中 44 份、传播命中 0、元数据错误 0。运行时代码和配置未变化，因此不重复执行构建和浏览器验收。

上一轮的 46 项单元/集成测试、24 项浏览器测试和远程模板验收是 [0.3.0 的历史证据](releases/0.3.0.md)，不算本轮重新执行。依赖安全告警仍未修复，也没有因文档更新而变成通过。

上述文档审计阶段只更新 main 工作区中的文档，不修改功能代码、包版本或已发布标签。README 属于 starter 管理文件，包 README 也已存在于已发布 tarball 中：本地修正文档不会自动更新远程 starter 或 npm 页面。分发变更按已有维护流程另行交付，本记录不声称已同步远端。

## 第二轮细查

再次核对上一轮新增文字以及既有运行时、维护文档，补充修正：

| 偏移                                                                                   | 实现依据                                                                      | 修正                                                                                          |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| CSS 被描述为 CSS Modules，以及不存在的 `base/layout/components/states/responsive` 分层 | `packages/theme/src/styles/theme-ai.css`、`about-page.css` 只有普通 `@import` | 列出两个入口各自真实导入顺序，明确无 `@layer` 和 `.module.css` 隔离                           |
| 标签归档被概括为拥有博客全部特效                                                       | CyberShell 没有雨滴/尘埃节点；只有博客列表路由引用 `cyber-rain-dust.js`       | 区分共享 CSS 氛围和页面专属脚本                                                               |
| Red Queen 保证每段动画完整播放一遍；延迟被说成从 load 后开始                           | `red-queen-tv.js` 的 decoder/fallback 两条路径和 `queueAutoPlay()`            | fallback 按 hold 时间展示；delay/load/idle 是独立门槛                                         |
| 首页重定向没有说明静态实现                                                             | 两个首页路由输出 meta refresh                                                 | 明确不是主题服务端 301/302                                                                    |
| 新语言 CLI 参数易被理解为同时开通路由                                                  | `resolveLocales()` 与 `ENABLED_LOCALES` 路由生成分别处理                      | 五语 README、包说明和总览补充“只生成文件，配置另行启用”                                       |
| README 把 `.env` 当作必须步骤                                                          | site adapter 优先环境变量，然后回退 `THEME_CONFIG.site`                       | 五语改为可选覆盖方式                                                                          |
| fallback 配置被误解为无需 alias 的自动降级                                             | 包组件仍导入 `@anglefeint/site-config/*` 等别名                               | 明确手工集成必须设置别名                                                                      |
| Class B 流程遗漏提交；任意 package 目录变化被视为必须发布                              | sync 读取 Git main、检查干净工作区；npm 脚本不分类变更                        | 补齐提交步骤，文档更新和运行时变更区别处理                                                    |
| npm 脚本保障范围描述不足                                                               | `release-npm.mjs`、`verify-published-package.mjs`                             | 明确不检查 Git 分支/干净状态/推送/CI；说明 skip 参数、发布来源及下载验证不比对源码 SHA 的边界 |

累计修改原有 20 份文档，新增本记录；保留 23 份历史或无需改变的候选。此次仍未改动运行时代码和发布脚本，发布事实记录保持原样。上一节的 142 个链接是第一轮检查结果，不代表第二轮自动复用为新的检查结果。

第二轮重新检查结果：`check:docs` 扫描 44 份维护文档通过；累计 21 份修改/新增文档的 142 个本地文件链接及章节锚点重新验证通过；Prettier 和 `git diff --check` 通过。这里的“通过”限于这些检查和上表所列语义核对，不保证未覆盖的所有行为都已验证，也不改变尚未提交、推送和分发的状态。

## 审计后的标签视觉调整

用户随后授权保留光柱、雨滴和闪烁并调整标签背景。当前工作区新增 [CyberAtmosphere](../src/components/CyberAtmosphere.astro)，让博客列表与两个标签路由共用雨滴/尘埃初始化，标签使用冰蓝/淡紫配色和较慢扫光，并遵循减少动态效果设置。上表“只有博客列表挂载雨滴”的结论属于 `54738b5` 审计基线，已被这次代码调整替代；当前行为已同步到视觉系统、架构和工程总览。组件加入 starter 清单，尚未提交或分发。

## 2026-09-14 本地依赖安全升级

针对 [Astro AVIF 公告](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2)，用户授权升级依赖。工作区使用 Astro 7.3.2、Sharp 0.35.4、MDX 8.0.1、RSS 4.0.19、sitemap 3.7.4，更新检查工具、Wrangler 和锁文件中的相关间接依赖。主题 peer 改为 `^7.3.2`；Astro 配置显式保留 `compressHTML: true`。Playwright 为其预览子进程设置 `ASTRO_PREVIEW_BACKGROUND=1`，避免 Astro 在代理环境下自动分离进程，保证测试工具能够管理服务器生命周期。

独立 `npm audit --json` 确认主工作区为 0 个已知漏洞；`check:installed -- --audit` 确认按新依赖生成的独立 starter 为 0 个已知漏洞。完整工程检查、46 项单元/集成测试、lint、24 项浏览器测试和独立 starter 的五组构建配置通过。另用程序生成的正常 AVIF 在 Sharp 0.35.4/libheif 1.23.2 下完成解码、缩放和 PNG 输出检查。这是版本和正常功能验证，不是恶意样本利用复现，也不是绝对安全保证。

上述检查完成时本地修复尚未提交、推送或发布。其后用户授权完整发布，实际分发和远程验收记录见 [0.4.0](releases/0.4.0.md)。0.3.0 的历史发布记录保持原样；旧用户工程仍需主动迁移，不能将新 starter 的审计结果套用到旧安装。
