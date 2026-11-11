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

在默认语言下创建一条碎片：

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

使用 --locales en,zh 可创建共用一个 ID 的多语言骨架，不会自动翻译；只能选择已启用的语言。新 starter 也支持 npm run new-fragment；老用户直接用 npx 命令，无需补 package.json 脚本。

编辑 `src/content/fragments/<locale>/` 中生成的 Markdown，标题可省略：

后续补译时，将原 Markdown 复制到目标语言目录，保留 id，再翻译正文。

```md
---
id: 550e8400-e29b-41d4-a716-446655440000
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
