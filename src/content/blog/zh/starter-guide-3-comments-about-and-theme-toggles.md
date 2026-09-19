---
tags: ['anglefeint', 'starter']
title: '使用指南 3：按需开启与定制功能'
subtitle: '按需要配置音乐、评论、About、分页、功能开关和多语言，不必一次填完所有参数。'
description: '按需要配置音乐、评论、About、分页、功能开关和多语言，不必一次填完所有参数。'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

## 先看默认状态，再决定改什么

本文适用于配套的 0.8.0 starter；所有 TypeScript 片段都合并到 `src/site.config.ts` 的 `defineThemeConfig({...})` 对象中。只配置你需要改变的项目。

| 功能                             | 默认状态           |
| -------------------------------- | ------------------ |
| 搜索、文章目录、标签、自动分享图 | 开启               |
| 正文图片预览、代码复制           | 自动生效，无需配置 |
| About、Red Queen 文章监视器      | 开启               |
| 音乐、Giscus 评论                | 关闭               |
| 首页最新文章 / 博客每页文章      | 3 / 9              |

## 1. 开启音乐播放器

先把自己的音频放到 `public/music/my-song.mp3`（目录不存在就创建），再加入：

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      { title: 'My Song', artist: 'Artist Name', src: '/music/my-song.mp3' },
    ],
  },
},
```

网址中不包含 `public`。每首必填 `title`、`src`，`artist` 可省略；增加歌曲就继续往 `tracks` 数组里写对象。也支持 HTTPS 音频直链，不支持把本地磁盘路径或音乐平台分享页面当作音频地址。地址不要包含空格或反斜杠，建议简单文件名。主题不附带歌曲。

空歌单不显示播放器；启用后错误的标题或地址格式会报配置错误。播放器默认挂载在使用主题公共布局的页面，没有逐页显示开关。桌面位于左下角；手机每页默认收起，展开时临时隐藏回到顶部。

先直接打开 `/music/my-song.mp3` 确认文件可访问，再打开页面点 PLAY。音频触发播放操作后才加载，打开页面不会自动开始播放。开始播放后，当前曲目结束会自动播放下一首，最后一首结束后回到第一首。进度、曲目和音量在同一标签页会话内保存；切页会暂停，下一页要手动点播放恢复，不能跨页面无缝播放。存储不可用时仍可播放，但无法保证记忆。`enabled: false` 关闭播放器。

## 2. 开启 Giscus 评论

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

## 3. 替换 About 内容

About 默认开启。按语言配置正文，不需要直接改页面模板：

```ts
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile booted | mode: builder',
        sections: {
          who: 'Introduce yourself here.',
          what: 'Describe what you build.',
          ethos: ['Keep learning.', 'Build useful things.'],
          now: 'What you are working on now.',
          contactLead: 'Get in touch.',
          signature: '> Your signature',
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

示例只改变 `zh` 的 About；其他语言需要分别填写，不会自动翻译。`sidebar`、`labels`、`modals`、`effects` 也支持覆盖，普通使用先改正文和联系方式即可。About 的工具窗口是主题交互展示，不会因为填写文案就连接真实 AI 服务。

访问 `/zh/about/` 核对正文和邮件/GitHub 链接。不需要 About 时设置 `theme.enableAboutPage: false`，会同时隐藏导航入口并停止生成 About 路由；修改后重新构建。

## 4. 调整文章数量与分页

可以只写前两个数量字段；需要固定分页外观时再加入 `pagination`：

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 9,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` 是首页最新文章数，`blogPageSize` 是博客分页每页数量，标签文章列表也使用该分页大小。使用合理的正整数。

`windowSize` 控制页码展示窗口，代码限制在 5–21；不等于每页文章数。跳页输入仅在 `jump.enabled` 为真且总页数大于 `showJumpThreshold` 时出现，默认超过 12 页才显示；`enterToGo` 控制回车跳页。

样式模式有 `fixed`、`sequential`、`random`。示例固定第 1 种；默认 `random` 是按语言、路径和页码等生成的稳定选择，不是每次刷新都随机。`style.enabled: false` 回到基础变体，不会关闭分页。文章足够多时在列表底部验证。

## 5. 关闭不需要的增强功能

下面展示可关闭的项目，不是建议全部关闭；只保留你想改的字段：

```ts
theme: {
  enableAboutPage: false,
  effects: { enableRedQueen: false },
  search: { enabled: false },
  toc: { enabled: false },
  tags: { enabled: false },
  socialImage: { enabled: false },
},
```

`enableRedQueen` 只控制文章页 Red Queen 监视器，不是关闭整个 AI 主题或所有动效。`toc` 是站点默认，单篇 `toc: true` 仍可覆盖；关闭 `socialImage` 不影响手工 `ogImage`。搜索和标签的关闭会同时影响入口及对应构建产物。四种页面氛围仍由现有布局决定，没有一个切换全站四种主题的配置项。

## 6. 增加语言与调整首页地址

新增法语的示例：

```ts
i18n: {
  locales: {
    fr: {
      meta: { label: 'Français', hreflang: 'fr', ogLocale: 'fr_FR', enabled: true, fallback: ['en'] },
      site: { hero: 'Bienvenue sur mon blog.' },
      messages: { nav: { home: 'Accueil' }, siteDescription: 'Mes notes et projets.' },
    },
  },
},
```

随后用 `npm run new-post -- french-note --locales fr` 创建内容。新语言需要你提供界面文案、首页介绍、About 和文章译文；`fallback` 提供缺失配置/文案的回退，不翻译文章，也不把其他语言的文章自动塞进列表。默认语言会被加入必要的回退链。

现有语言的菜单名称改 `meta.label` 即可，比如 `zh` 默认为“简体中文”；`hreflang` / `ogLocale` 是页面语言元信息，改变显示名称不改变语言代码或网址。

`i18n.routing.defaultLocalePrefix: 'always'` 是默认值：`/` 跳到默认语言首页。`'never'` 则用 `/` 作为默认语言首页，`/<默认语言>/` 跳回 `/`。这个开关只改变默认语言首页，不会把 `/zh/blog/` 变成 `/blog/`。

## 7. 合并配置并验证效果

例如同时改文章数量和音乐，应合并为一个 `theme`：

```ts
theme: {
  homeLatestCount: 5,
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

已有 `theme.comments` 等设置也保留在同一个对象里。不要用示例整体覆盖自己的配置；数组会整体替换，因此增加歌曲或社交链接时保留原来的条目。

修改后先在开发页面检查对应功能，再运行 `npm run check` 和 `npm run build`。搜索用构建后的 `npm run preview` 验证。只有需要诊断工程或升级问题时再运行 `npm run doctor`；它包含更完整的检查。上线必须重新部署构建产物。

## 8. 显示或隐藏页脚署名

页脚显示本次构建时的年份与 `site.title`，默认还提供主题和 Astro 链接：`© 2026 My Blog · Theme by Anglefeint · Built with Astro`。年份在构建时生成，不写死。

要隐藏两项技术署名，把以下设置合并到 `src/site.config.ts`：

```ts
export const THEME_CONFIG = defineThemeConfig({
  theme: {
    footer: { showCredits: false },
  },
});
```

设置 `showCredits: true` 可恢复显示。关闭后两条署名链接都移除，版权行保留。可选的 `site.tagline` 独立追加自定义纯文字，不受此开关控制；默认为空，旧默认值 `Built with Astro.` 视为内置署名，避免重复。不会追加 `All rights reserved`。

公开 demo 使用专用站名、域名和翻译后的介绍；新安装的 starter 保持通用默认配置，用户仍只需编辑 `src/site.config.ts`。升级旧 starter 时，请按升级指南迁移配套配置文件；仅更新 npm 包不会为旧适配器补上这个开关。

## 这套教程

- [使用指南 1：搭建你的博客](/zh/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：写文章与管理内容](/zh/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：按需开启与定制功能](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)
