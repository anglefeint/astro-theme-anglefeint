---
tags: ['anglefeint', 'starter']
title: '使用指南 7：让更多语言的读者使用博客'
subtitle: '选择语言、调整首页地址、填写本地化文案，再为文章和碎片补上译文。'
description: '按实际配置解释语言启停、默认语言、首页路由、回退行为、新语言接入及文章和碎片的多语言关联。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

本篇是入门教程的第 7 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

你可以先只写一种语言，以后再添加译文。主题提供多语言界面和路由，但不负责自动翻译文章；启用一个语言、修改界面文字、发布一篇译文，是三个不同操作。

下面所有配置都合并到 `src/site.config.ts` 已有的 `defineThemeConfig({...})` 对象中。保留原来的 `i18n` 和其他个人设置，不要重复追加同名对象。

## 1. 先决定需要哪些语言

默认启用九种语言，默认语言是 `en`：

| 代码      | 语言               |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

如果想只保留中文和英文，同时将默认语言改为中文，可以选择下面的配置；不需要这些调整时保留项目默认值即可：

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

省略一个语言不会将它关闭，因为配置会与默认值合并。必须明确写 `meta.enabled: false`；默认语言始终启用，不能一边指定 `defaultLocale: 'zh'`，一边期望通过关闭 zh 隐藏它。

关闭语言会移除其主题语言入口并停止生成相应标准页面，不删除该目录中的文章文件。重新启用后，保留的内容可以再次生成。改语言代码则会改变目录和网址，不等于只改一个显示名称；已有站点需要自己处理旧链接。

## 2. 选择默认语言首页的网址

在现有 `i18n` 中加入或修改 `routing`：

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

以默认语言 zh 为例：

| 设置                 | `/`               | `/zh/`         | `/en/`             |
| -------------------- | ----------------- | -------------- | ------------------ |
| `'always'`，主题默认 | 静态跳转到 `/zh/` | 中文首页       | 英文首页（需启用） |
| `'never'`            | 直接显示中文首页  | 静态跳转到 `/` | 英文首页（需启用） |

默认语言由配置确定，不会根据访客浏览器语言自动改成另一种。跳转是构建出来的 HTML 跳转页，不需要额外的应用服务器；访问时可能短暂看到跳转提示。

**这个设置只影响默认语言首页。** 中文博客、文章、About、Decoder 和 Fragments 仍保留 `/zh/` 前缀，例如 `/zh/blog/my-first-post/`，不会自动变成 `/blog/my-first-post/`。更改默认语言也不会移动或翻译已有内容文件。

## 3. 给不同语言填写首页和界面文字

在对应语言下设置自己的文案，例如：

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` 是语言菜单名称。把“简体中文”改为“中文”，不会把代码 zh 或网址也改名。
- `site.homeTitle` 只改变当前语言首页的可见大标题；全站名称仍由顶层 `site.title` 或环境覆盖值决定。
- `site.hero` 是首页大标题下面的可见介绍。
- `messages.siteDescription` 是首页元描述，不是可见介绍；只改顶层 `site.description` 不一定替换内置首页描述。
- `messages.nav` 修改对应界面入口的文字，不改变路由或文章内容。

同样，`i18n.locales.<代码>.about` 修改该语言的 About 内容，`messages` 下各模块修改对应界面文案。About 和 Decoder 等页面仍受全站功能开关控制，不会因为写了译文就自动开启。具体内容示例见[页面与功能定制](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)。

语言元数据和默认首页地址可查[语言字典](/zh/blog/config-languages/#registry)；首页三种文案的区别见[首页字典](/zh/blog/config-home/#home-title)。

## 4. 理解没有填写的字段从哪里来

`meta.fallback` 用来选择配置回退语言。例如希望简体中文缺少配置时参考英文，可合并：

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

这里的 en 必须在项目的语言配置中存在。默认语言会被补进非默认语言的必要回退链；自己、重复项和不存在的语言会被过滤。数组会整体替换，所以填写多个回退语言时，要一次写出希望使用的顺序。

回退的具体规则并非所有字段都一样：

| 内容                              | 当前行为                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| 普通 `messages`                   | 从内置英文开始，按回退链合并内置语言包和个人覆盖，当前语言优先；内置译文也参与合并  |
| 首页 `homeTitle`                  | 依次查找当前语言及回退语言的非空、去除首尾空白后的标题，最后使用全站名称            |
| 首页 `hero`                       | 查找当前语言及回退语言的已定义值；`''` 是主动清空，不会继续找下一语言               |
| About 配置                        | 从默认 About 开始，按回退链合并对应语言的个人 About 配置                            |
| 首页 `messages.home.transmission` | 单独使用当前语言个人配置 → 英文个人配置 → `Knock, knock.`，不走普通文案的完整回退链 |

所以，把英文导航文字改掉，不代表已有中文内置导航也会变成英文配置里的文字。要明确改变一种语言的界面，应在该语言下覆盖。关闭某语言的页面也不等于删除其配置；仍在回退链中的配置可以参与补齐。

回退只补配置和界面文案：不会把英文文章自动放进中文博客，也不会自动创建另一语言的文件。不要把它当作内容翻译服务。

## 5. 添加一个新的语言

例如添加法语，在现有 locales 中加入 fr，保留前面已启用和关闭的语言设置：

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr 是目录和路由使用的代码。建议使用规范的小写代码；创建命令接受两到三位字母和可选的一段连字符后缀，例如 `fr`、`pt-br`、`zh-hant`，不能写路径或空格。示例沿用现有默认语言，不会把法语自动设为默认。

`hreflang` 是页面语言替代链接的语言标识；省略时使用语言代码。`ogLocale` 是 Open Graph 使用的语言地区标识，格式与路径代码不同，示例为 fr_FR。这些元信息不会翻译正文，也不保证搜索引擎收录。

新语言没有内置完整翻译包。上面的片段只翻译几个入口，其他文案会回退；需要完整法语界面，还需补充自己使用的搜索、分页、评论提示、工具和 About 等模块文案。先从实际页面上会出现的内容开始，不必为了显示一篇文章先修改主题实现。

## 6. 为文章补一份译文

同时创建中文和英文文章骨架：

```bash
npm run new-post -- my-first-post --locales zh,en
```

在 `src/content/blog/zh/my-first-post.md` 写中文，在 `src/content/blog/en/my-first-post.md` 写英文。新语言示例可使用 `npm run new-post -- french-note --locales fr`，生成后自己填写内容。

已有中文文章要补译时，也可以复制到目标语言目录并保留文件主名，再翻译标题、简介和正文。相对图片路径从新文件位置计算，复制到不同目录层级后需要检查路径。同名文件已存在时创建命令跳过，不覆盖旧稿。

文章译文依靠语言目录之外的完整 slug 关联。例如 zh/my-first-post 与 en/my-first-post 是译文；把英文文件名改为 my-story 就成为不同文章，标题相同也不会自动配对。嵌套目录同样要一致。

文章页语言菜单中，有同 slug 的目标语言文章时进入译文；缺失时进入该语言博客列表。搜索引擎用的文章语言替代链接只声明真正存在且已启用的译文，不把列表页假称为另一种语言的文章。

`--locales` 只创建指定语言文件，不会启用语言。省略时先检查 `ANGLEFEINT_LOCALES` 环境变量，未设置则使用项目启用语言；显式参数优先于环境变量。创建骨架和翻译正文是分开的步骤。

## 7. 碎片和其他页面的语言切换

碎片译文使用相同 frontmatter `id`，不靠相同文件名关联。后续补译时复制原文件到目标语言目录，保留 id 和 pubDate，再翻译标题与正文。再次执行 new-fragment 会创建新身份，不能用来补同一条的译文。

同一次 `npm run new-fragment -- --locales zh,en` 会为两种语言生成共享 ID 和时间戳的骨架。碎片列表的语言切换始终进入目标语言第一页，不保证直接定位同一条译文。完整规则见[发布一条碎片](/zh/blog/starter-guide-5-fragments/)。

文章评论的多语言共享需要另外启用 `theme.comments.shareAcrossLocales`，默认关闭；碎片评论则按相同 ID 共享。界面语言和讨论关联是两件事，评论正文也不会自动翻译，见[让读者留下评论](/zh/blog/starter-guide-4-giscus-comments/)。

`new-page` 生成的自定义 Astro 页面会为启用语言生成路由，但只提供一份页面源文件；你需要根据语言提供相应内容，不会自动为每种语言复制或翻译一套页面。

## 8. 修改后检查哪些结果

先在 dev 中逐个打开自己启用语言的首页，检查菜单名称、首页标题、介绍和 About 内容。再检查一篇有译文的文章、一篇没有译文的文章，确认语言切换符合预期。语言列表和文件目录代码要完全一致。

发布前停止 dev，运行：

```bash
npm run doctor
npm run preview
```

doctor 包含检查和构建，成功后不必立即再运行 check 或 build。用构建后的 preview 验证各语言文章搜索；索引搜索当前语言，不会把全部语言混在一起。每种已启用语言的 RSS 位于 `/<代码>/rss.xml`，只包含相应语言的文章。

确认站点域名正确后，重新部署整个 `dist/`。语言启停、默认地址和内容变化都需要重新构建；仅修改本地配置不会改变线上页面。重新部署要注意清理旧产物，关闭语言不是为旧网址自动建立重定向。

| 现象                          | 先检查什么                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------ |
| 菜单仍显示不需要的语言        | 是否只是从配置删掉了覆盖项，而没有明确设置 enabled: false                      |
| 默认语言无法关闭              | 是否仍将它设为 defaultLocale；先选择新的默认语言                               |
| 创建了文件却没有页面          | 语言是否启用，目录代码是否一致，是否已经重新构建                               |
| 页面还有英文                  | 新语言是否只覆盖了部分文案，或缺少对应 About 内容                              |
| 改了标题却没有变              | 改的是全站 site.title、首页 homeTitle、hero，还是页面 messages；检查环境覆盖值 |
| 切语言后进入列表              | 目标语言是否缺少同 slug 译文，这属于当前回退行为                               |
| 设置 never 后文章仍有语言前缀 | 此开关只改变默认语言首页，这是预期行为                                         |

站点信息和升级步骤见[安装教程](/zh/blog/starter-guide-1-configure-your-site/)，日常写作见[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)。

## 教程导航与配置查阅

[上一篇：让读者留下评论](/zh/blog/starter-guide-4-giscus-comments/) · [下一篇：把博客发布到自己的域名](/zh/blog/starter-guide-deployment/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[语言、地址与回退](/zh/blog/config-languages/)、[跨语言评论共享](/zh/blog/config-comments/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
