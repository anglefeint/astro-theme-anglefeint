---
tags: ['anglefeint', 'starter']
title: '使用指南 4：配置 Giscus 评论'
description: '使用指南 4：配置 Giscus 评论'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

在 `src/site.config.ts` 现有的 `defineThemeConfig({...})` 中合并下面的 `theme.comments` 配置。保留其他设置；已有 `theme` 或 `comments` 对象时直接补充其中的字段，不要重复创建同名键。

`shareAcrossLocales: false` — `mapping: 'pathname'`

## 评论配置教程

在 [Giscus 配置页](https://giscus.app/) 按说明准备公开 GitHub 仓库、启用 Discussions、安装 Giscus 应用，并选择讨论分类。从生成的配置中取得真实的 repository/category ID，然后填入：

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

两个 `REPLACE_WITH_...` 必须替换；`category` 也必须与你实际选择的分类一致。这里只填写主题配置，不要再把 Giscus 的整段 script 粘到每篇文章里。

评论显示在文章页。四个核心 repo/category 字段缺失时不渲染；填了占位值不等于配置成功。示例的 `lang: ''` 让评论语言跟随文章语言（`zh` 映射为 `zh-CN`）；默认配置是固定 `en`。

保留 `mapping: 'pathname'` 即可按文章路径关联讨论。若改为 `specific`，需填写非空 `term`；若改为 `number`，需填写正整数字符串 `number`。这两种缺少有效参数会抛出错误。

打开文章底部验证；若没有出现，检查 ID、仓库权限、网络和浏览器拦截。其他可选项如 `inputPosition`、`theme`、`reactionsEnabled` 保留默认即可；`strict` 和 `reactionsEnabled` 使用字符串 `'0'` / `'1'`。

## 让同篇文章的多语言版本共享评论

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

已有集成版 starter 先升级到包含此选项的主题版本。修改配置后重新构建并部署，使用生产预览检查评论。

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← 使用指南 3](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)
