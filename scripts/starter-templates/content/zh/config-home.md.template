---
tags: ['anglefeint', 'config']
title: '配置字典：首页'
subtitle: '查询首页标题、介绍、最新文章、提示文字、宽屏终端和点击穿越的实际配置。'
description: '首页配置字段的类型、主题默认值、生效范围、限制和可合并示例，并说明共享设置和当前没有提供的开关。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[返回配置字典总入口](/zh/blog/config-reference/)。本篇说明实际首页使用的字段，不改变主题代码，也不把演示站个人配置当成默认值。

下面 `<语言>` 换成项目实际启用的代码。示例使用 zh；它只修改中文设置，不会自动改变英文或启用一种语言。所有片段都合并到 `src/site.config.ts` 现有的 defineThemeConfig 对象中，已有 theme、i18n 或 site 时保留其中其他字段。

## 1. 首页大标题、介绍和元描述

<a id="home-title"></a>

### `i18n.locales.<语言>.site.homeTitle`

- **类型**：可选 `string`。
- **主题默认值**：未设置。各内置语言默认没有单独的 homeTitle，最终使用全站名称（默认 My Blog）。
- **作用**：首页可见大标题。
- **状态与限制**：条件生效；依次寻找当前语言及其回退语言去除首尾空白后的非空标题，全部没有才使用全站名称。`''` 或空白不能用来隐藏大标题。它不改变浏览器标题、导航、页脚、RSS 或 SEO 的全站名称。

<a id="home-hero"></a>

### `i18n.locales.<语言>.site.hero`

- **类型**：可选 `string`。
- **主题默认值**：内置语言各有介绍；中文为“在这里写一段站点简介，并告诉读者你将发布什么类型的内容。”，英文为“Write a short introduction for your site and what readers can expect from your posts.”。其他语言使用各自内置值。
- **作用**：首页大标题下的可见介绍。
- **状态与限制**：条件生效；查找当前语言及回退语言的已定义值。`''` 是主动清空，不再继续回退。这里是文本，不解析 Markdown 或 HTML，也不改变页面元描述。

<a id="home-description"></a>

### `i18n.locales.<语言>.messages.siteDescription`

- **类型**：可选覆盖，值为 `string`。
- **主题默认值**：内置当前语言文案；中文为“电影感网页界面与 AI 时代工程实践文章。”，英文为“Cinematic web interfaces and AI-era engineering essays.”。
- **作用**：首页传给页面头部的描述，不是可见介绍。
- **状态与限制**：条件生效；先解析界面文案及回退，再使用该值，只有解析结果为空字符串才回退到全站 description。空字符串不是关闭全部页面描述的开关；空白字符串也不会自动 trim 为无描述。

三个字段可以一起配置，彼此职责独立：

```ts
i18n: {
  locales: {
    zh: {
      site: {
        homeTitle: '我的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: { siteDescription: '个人项目与学习笔记。' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### 关联通用字段：`site.title`、`site.description`

本节只说明首页关系：site.title 是没有有效 homeTitle 时的最终标题回退，site.description 是首页语言元描述为空时的备用值。两者都不是首页独占字段。类型、主题默认值、环境覆盖与完整示例统一见[站点身份字典](/zh/blog/config-site-chrome/#identity)。

## 2. 最新文章数量

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **类型**：`number`。
- **主题默认值**：`3`。
- **作用**：从当前语言按 pubDate 降序排列的文章中，取前 N 篇显示在首页。内容少于 N 时只显示已有文章，旁边计数显示实际条数／该语言总条数。
- **状态与限制**：生效；当前直接使用数组 slice，没有专门的正整数校验。建议合理正整数，不要使用负数、小数、NaN 或 Infinity。`0` 会得到空列表，并显示“没有文章”的提示，即使该语言已有文章；它不是隐藏整个最新文章区的开关。
- **独立范围**：不改变 Blog List 每页数量，也不改变首页碎片最多三条的预览数量。

```ts
theme: { homeLatestCount: 5 },
```

文章标题、日期和摘要来自文章内容，不是这个字段的子配置。首页没有“只展示已翻译文章之外的其他语言内容”的自动补齐逻辑。

## 3. 启动提示和底部状态

<a id="startup-switches"></a>

下列三个字段类型均为 `boolean`，主题默认值均为 `true`，状态均为生效。设为 false 只隐藏对应部分，省略则保留默认。

| 完整路径                    | 作用                                         | 限制                                                   |
| --------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `theme.home.showInitialize` | Initialize／done 启动文字段                  | 只控制该段显示，不控制首页正文或背景加载               |
| `theme.home.showFollow`     | Wake Up／Follow The White Rabbit 提示段      | 与上一段独立，不是开启页面导航的条件                   |
| `theme.home.showTrace`      | 首页底部 PIRATE SIGNAL／TRACE PROGRAM 状态区 | 不控制宽屏终端；文字用于氛围，不表示真实追踪或网络状态 |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

同时关闭前两项会移除对应启动文字组件。当前没有 site.config 字段修改这些固定启动句、底部固定状态文字或它们的时间参数；不要猜测 startupText、traceText 等配置名。

## 4. 首页界面文案

<a id="home-messages"></a>

以下均位于 `i18n.locales.<语言>.messages.home`，是可选的 `string` 覆盖，普通字段按界面文案回退规则解析。这里列中文与英文内置默认值，其他内置语言有自己的文案。

| 完整路径末段 | 中文默认 / 英文默认                                             | 作用与限制                                                               |
| ------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `latest`     | 最新 / Latest                                                   | 最新文章区标题；只改文字，不改变排序或条数                               |
| `viewAll`    | 全部 / All                                                      | 首页文章归档入口文字，也用于碎片归档链接的可访问说明；不会改变链接目的地 |
| `noPosts`    | 该语言暂时没有文章。 / No posts available in this language yet. | latestPosts 为空时的提示；不是草稿或发布控制                             |
| `openDoor`   | 开门 / Open door                                                | 宽屏终端钥匙孔按钮的可访问名称及预览标签；通常不是一直可见的正文标题     |

这些字段是条件生效：对应区域存在时才有可见或可访问效果。空字符串可以清空文字，但不会删除容器或关闭功能，也可能使按钮失去有意义的名称；需要控制显示时使用相应功能开关。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        home: {
          latest: '最近更新',
          viewAll: '全部文章',
          noPosts: '这里还没有文章。',
          openDoor: '打开走廊预览',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<语言>.messages.home.transmission`

- **类型**：可选的 `string` 覆盖。
- **主题默认值**：`'Knock, knock.'`，包括中文在内，没有个人覆盖时共用这一句。
- **作用**：宽屏终端中可选择、滚动的文字。
- **状态与限制**：条件生效；终端在视口宽度至少 1440px 时显示。取值顺序单独固定为当前语言个人配置 → 英文个人配置 → 默认句，不使用其他普通文案的完整回退链。`''` 会清空文字，不隐藏终端或关闭走廊。

例如设置所有没有单独覆盖的语言共用的文字：

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '这里留下一点线索。' } } },
  },
},
```

在 zh 的相同位置填写则只覆盖中文。修改文字不会查询真实网络信号，也不改变钥匙孔开启走廊的行为。

<a id="message-hero"></a>

### `i18n.locales.<语言>.messages.home.hero`

- **类型**：可选的 `string` 覆盖。
- **主题默认值**：内置当前语言介绍，中文和英文分别与上面的 site.hero 默认句相同。
- **作用**：只有 getSiteHero 没有从当前语言和回退语言取得已定义值时，才作为首页介绍的备用文案。
- **状态与限制**：条件生效，不是废弃字段。但所有内置语言默认已有 site.hero，所以通常只改这个字段看不到变化；把 site.hero 改成 `''` 也不会触发它。一般应直接修改 site.hero。

```ts
i18n: {
  locales: {
    zh: { messages: { home: { hero: '仅在没有可用 site.hero 时使用的介绍。' } } },
  },
},
```

这个例子说明路径与类型，不会绕过更高优先级的 site.hero。无需为了改首页介绍删除默认配置或修改依赖源码。

## 5. 点击文章时的 Matrix 穿越

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **类型**：`boolean`。
- **主题默认值**：`false`。
- **作用**：在首页，普通点击最新文章标题以及导航中带该效果的博客入口时，先播放 Matrix 穿越，再导航。正常时间轴约 8 秒，有完成／异常回退导航处理。
- **状态与限制**：条件生效；需要 JavaScript。减少动态效果、修饰键点击、非左键、下载链接、外站链接或新窗口目标等情况保留原生行为。它不延迟首页正文出现，也不控制 About Oracle 或宽屏终端预览。

```ts
theme: { effects: { enableHomePassage: true } },
```

关闭时这些链接直接导航。这个布尔开关没有提供时长、场景颜色或目标网址的配置；不要添加 homePassageDuration 等未公开字段。

## 6. 首页也会用到的共享设置

<a id="shared-settings"></a>

这些字段不属于首页独占功能；这里保留首页使用关系，完整定义在主字典中查阅。

| 完整路径                                       | 首页使用关系                                                         | 主说明                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| `theme.fragments.enabled`                      | 当前语言有碎片时显示头像入口，同时影响完整碎片列表；预览固定最多三条 | [Fragments 开关](/zh/blog/config-fragments/#enabled)     |
| `i18n.locales.<语言>.messages.blog.allPosts`   | 最新文章数量的提示和归档入口的无障碍名称                             | [列表共享文案](/zh/blog/config-blog-list/#tag-messages)  |
| `i18n.locales.<语言>.messages.fragments.title` | 头像入口的无障碍名称，不是在头像旁显示标题                           | [碎片文案](/zh/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<语言>.messages.fragments.close` | 首页预览关闭按钮的无障碍名称，不改变按钮图形                         | [碎片文案](/zh/blog/config-fragments/#fragment-messages) |

开启后没有头像，先检查当前语言是否确有碎片，不要为了显示头像复制已有碎片 ID。图片、代码和限高规则见[Fragments 字典](/zh/blog/config-fragments/#preview-and-links)，发布步骤见[发布一条碎片](/zh/blog/starter-guide-5-fragments/)。

## 7. 当前没有提供的首页配置

<a id="unsupported-settings"></a>

`messages.siteTitle` 当前不改变标准首页或公共站点名称；不要用它替代 homeTitle 或顶层 site.title。字段的类型、默认值和示例统一见[当前未使用的站点标题字段](/zh/blog/config-site-chrome/#legacy-site-title)。

代码雨密度和颜色、首页镜面按钮、头像素材、碎片预览条数、固定启动句，以及穿越时长目前没有相应 site.config 字段。它们属于现有布局、样式或脚本实现；不能因为 TypeScript 示例中随意增加一个名字就让它生效。Reduced Motion 会影响效果呈现，但不是本篇新增的配置开关。

首页 `/` 与语言首页的关系由 i18n.defaultLocale 和 i18n.routing.defaultLocalePrefix 控制，不在本篇重复完整定义，见[语言与地址字典](/zh/blog/config-languages/#routing)。公共导航、页脚、音乐和统计同样不是首页独立配置。

## 修改后怎么确认？

先在 dev 打开目标语言首页，检查修改的是标题、介绍、元描述还是可访问说明。终端文字要在至少 1440px 的视口验证；元描述查看页面 head，按钮名称通过可访问名称或 title 确认，不能只看页面有没有大字。

环境覆盖值改动后重启 dev；正式网站需要重新构建和部署。发布前可停止 dev 后运行 npm run doctor，再运行 npm run preview；doctor 已含构建，不需要立即重复执行 check 和 build。操作步骤见[安装教程](/zh/blog/starter-guide-1-configure-your-site/)与[部署教程](/zh/blog/starter-guide-deployment/)。
