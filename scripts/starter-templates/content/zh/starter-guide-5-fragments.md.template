---
tags: ['anglefeint', 'starter']
title: '用户指南 5：发布碎片'
description: '用 Markdown 记录简短感想，可选弹窗评论。'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

已有博客请先升级至主题 0.29.0 或更新版本：

```bash
npx @anglefeint/astro-theme@latest upgrade
```

将下面字段合并到 `src/site.config.ts` 现有 theme 中。碎片和碎片评论默认关闭；开启后菜单位于 Decoder Lab 下方。

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

开启后访问 `/<locale>/fragments/`。`pageSize` 可设为 1–100 的整数。文件使用 `.md`；没有草稿或未来日期过滤，未准备公开的碎片请放在 `src/content/fragments/` 之外。

为全部已启用语言生成同一条碎片的骨架：

默认生成全部启用语言的骨架需要主题 0.31.0 或更新版本。请先升级；0.29–0.30 仍需用 `--locales` 显式指定。

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

与 `new-post` 一致，默认读取项目全部启用语言，生成共享同一个 ID 和时间戳的骨架，不自动翻译。语言优先级为 `--locales` → `ANGLEFEINT_LOCALES` → 项目启用语言。显式列表会去除空白、转为小写并去重，跳过配置读取，只创建指定语言目录，不自动修改配置中的语言开关。

新 starter 也提供 `npm run new-fragment`；已有项目可直接用 npx，无需添加脚本。

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales zh
```

编辑 `src/content/fragments/<locale>/` 中生成的 Markdown，标题可省略：

后续补译时，将原 Markdown 复制到目标语言目录，保留 id，再翻译正文。

```md
---
id: 'q8Lm3XzP'
pubDate: 2026-11-11T08:30:00+08:00
---

碎片.
```

编辑内容、修改日期或重命名文件时不要改 id。同一碎片的翻译使用同一个 id；同一语言重复 id 会导致构建报错，不同碎片必须使用不同 ID。pubDate 应包含时间和时区；页面以 UTC 显示，按时间倒序排列。

需要弹窗评论时，将 `theme.fragments.comments.enabled` 设为 true，并在 `theme.comments` 填入 Giscus 设置页给出的 repo、repoId、category、categoryId。仓库设置见用户指南 4。文章评论可以继续关闭。 [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

碎片评论固定使用 specific、严格匹配和 `fragment/<id>`，不使用文章的 mapping、term、number、shareAcrossLocales 或 lang。评论界面跟随页面语言；相同 ID 的翻译共用评论和表情，不改变文章已有讨论关联。首次点击评论才加载评论客户端。关闭只隐藏弹窗，再次打开或切换碎片时复用同一个评论实例。

这是静态发布：修改 Markdown 后重新构建部署，没有在线发帖后台。碎片独立于文章搜索、RSS 和文章 Markdown 导出；图片可放在 `public/images/`，在正文用 `/images/...` 引用。

先升级至主题 0.29.0 或更新版本，再主动配置开启。个人内容、配置、音乐和图片会保留；升级不覆盖个人教程，最新说明可查看 demo。不会合并或删除 GitHub 上的讨论。

评论从远程加载；Giscus 就绪前会保留加载提示，失败或超过 15 秒会显示重试。失败时请检查网络或 Giscus 配置。弹窗复用文章的 Giscus 接入，无需另外安装 Giscus npm 包，也不改变文章已有映射。

```bash
npm run build
```

0.32.0 起的分页改进：碎片与 Blog 共用页码、霓虹样式和按阈值显示的跳页入口。`theme.pagination` 统一控制两处分页；`theme.fragments.pageSize` 仍独立设置每页碎片数量。

## 稳定分享链接（0.32.0 起）

0.32.0 起的分享功能：日期链接定位列表中的本条碎片，旁边提供复制链接。对外分享使用 `/zh/fragments/#ID`，其中 ID 是 Markdown frontmatter 的 id。当前页没有该条时，按需读取本语言的轻量静态索引，自动跳到对应分页。新增内容、修改日期或 pageSize 后重新构建即可，保留原 ID。跨页定位和复制需要启用 JavaScript。

实际浏览地址可能带页码；对外请使用日期链接或复制按钮，不要手工复制带页码的地址栏。仍存在的旧分页可以纠正过时锚点，已消失的旧页码仍进入网站原有 404，本功能不接管 404 页面。

碎片不存在或网络失败时会提示，不会反复跳页。剪贴板受限时会显示可选中并手动复制的链接。这项功能需要主题 0.32.0 或更新版本，使用自动定位前请先升级。

## 默认分享图与 Fragment 短 ID（0.33.0+）

在 src/site.config.ts 现有 site 设置中合并 site.ogImage，可填写 public 根路径（如 /images/share.jpg，对应 public/images/share.jpg）或 HTTPS 图片地址。留空使用内置的 1200×630 Anglefeint 分享图。Fragments 及其所有 #ID 分享链接共用该默认图。文章专属图、自动生成的文章图保持优先；关闭自动生成时，文章封面也优先于站点默认图。更换图片后重新构建并部署，分享平台仍可能缓存预览。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment 使用区分大小写的字母和数字生成 8 位 Nano ID，读取各语言已有 Markdown ID 查重，冲突时重试。同一次命令的所有语言共享 ID 和发布时间。Fragment 仅接受恰好 8 位字母数字 ID，不兼容旧 UUID 或长 ID；旧内容请删除后重新发布，不提供迁移或旧链接兼容。新内容发布后请保留 ID，修改会改变评论关联。
