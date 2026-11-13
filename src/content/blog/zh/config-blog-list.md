---
tags: ['anglefeint', 'config']
title: '配置字典：Blog List 与标签列表'
subtitle: '查询每页文章数、标签开关、分页窗口、跳页、样式和列表界面文案。'
description: '说明博客归档与标签列表实际使用的配置字段、主题默认值、范围限制、共享行为和示例，并区分浏览器偏好与站点配置。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**版本说明：** 下文 `blogPageSize` 的严格配置校验从 0.36.1 起提供，0.36.0 不包含。使用旧版时仍应自行填写合理的正整数。

[返回配置字典总入口](/zh/blog/config-reference/)。本篇覆盖博客归档、标签目录、某个标签下的文章列表，以及它们共用的分页。以当前主题代码为准，不把演示站的文章数量或颜色当作默认值。

中文博客入口为 `/zh/blog/`，第二页为 `/zh/blog/2/`；标签目录为 `/zh/tags/`，单个标签的文章列表使用页面生成的链接。其他语言替换 zh，默认语言首页的地址模式不会去掉这些路径的语言前缀。

所有 TypeScript 示例合并到 `src/site.config.ts` 现有 defineThemeConfig 对象中。已有 theme、i18n、pagination 时修改其中字段，保留其他配置，不要重复添加同名对象。

## 1. 每页显示多少篇文章

<a id="page-size"></a>

### `theme.blogPageSize`

- **类型**：`number`。
- **主题默认值**：`10`。
- **作用**：博客归档与每个标签文章列表的每页文章数，两处共用。文章先按当前语言筛选，再按 pubDate 从新到旧排列。
- **状态**：生效。
- **限制**：必须为正的安全整数。0、负数、小数、NaN、Infinity 和超出安全整数范围的值会在解析配置时明确报错，不会自动截断或恢复默认值；0 不是关闭分页的开关。
- **范围**：不改变首页最新文章数量，也不改变 Fragments 每页条数。标签目录本身不按这个字段分页。

```ts
theme: { blogPageSize: 12 },
```

博客没有文章时仍生成第一页；只有一页时不显示分页组件。调整每页数量后需要重新构建部署，原来存在的较大页码可能消失，主题不会为它们自动建立重定向。

排序依据不是 updatedDate、文件名或点击量。当前没有 draft／未来日期过滤，也没有列表排序字段；文章内容规则见[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)。

## 2. 标签入口与标签页面

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **类型**：`boolean`。
- **主题默认值**：`true`。
- **作用**：控制主题提供的标签入口、标签目录和标签文章列表。文章卡片及正文中的主题标签链接也受它控制。
- **状态**：生效。
- **限制**：设为 false 不会删除 frontmatter 的 tags、文章或已有部署文件；它也不是按标签过滤博客列表的开关。博客列表中的标签快捷入口还要求当前语言确实存在标签；开启但没有标签时，标签目录显示空提示。

```ts
theme: { tags: { enabled: false } },
```

标签来自文章 frontmatter 的 `tags` 数组，不存在需要维护的 site.config 标签注册表。同篇标签会去除首尾空白、丢弃空项并去重；大小写仍区分，Astro 与 astro 不合并。

标签目录按包含文章数量降序排列，数量相同按标签字符串顺序排列。特殊字符、中文、保留名称和过长标签有稳定编码，使用页面生成的链接；改标签名称可能改变路径，不会自动保留旧地址。

卡片当前最多显示两个标签，没有提供控制显示数量的配置。它不限制文章实际拥有多少标签，也不限制标签目录收录全部有效标签。

## 3. 页码窗口与跳页

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **类型**：`number`。
- **主题默认值**：`7`。
- **作用**：影响分页显示哪些页码、边界页和省略号，不是每页文章数。
- **状态**：条件生效，只有多于一页才有分页组件。
- **限制**：正常数值会向下取整并限制在 5–21。它是页码窗口策略参数，不保证最终“所有数字、上一页／下一页和省略号加起来”恰好等于该值；请使用有限整数。

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **类型**：`number`。
- **主题默认值**：`12`。
- **作用**：总页数严格大于阈值时，才允许出现跳页输入；还需要 jump.enabled 为 true。
- **状态**：条件生效。
- **限制**：正常数值向下取整后至少为 1。默认 12 页不出现，13 页才出现；它不是文章条数阈值，设为 0 也不会被当作无条件显示。

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **类型**：`boolean`。
- **主题默认值**：`true`。
- **作用**：允许显示跳页表单。
- **状态与限制**：条件生效；必须同时满足总页数大于阈值。false 只移除表单，页码和上一页／下一页链接仍在。跳页交互需要 JavaScript，普通分页链接不依赖它。

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **类型**：`boolean`。
- **主题默认值**：`true`。
- **作用**：允许在跳页输入中按 Enter 导航。
- **状态与限制**：条件生效；仅在跳页表单存在时有作用。false 会阻止输入框 Enter 提交，仍可点击跳转按钮。客户端会去除输入中的非数字字符，并将目标限制到实际页码范围，不提供任意 URL 跳转。

这些字段可以一起设置：

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

上述分页行为也用于 Fragments；碎片每页数量仍由它自己的 pageSize 决定。不要为了修改一个标签列表，误以为分页设置只作用于该标签。

## 4. 分页外观策略

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **类型**：`boolean`。
- **主题默认值**：`true`。
- **作用**：启用分页容器和页码按钮的变体策略。
- **状态与限制**：条件生效；false 使用基础变体 1，不删除分页，不改变文章数量，也不是关闭整页 Cyberpunk 效果。它不控制文章卡片或 Cards／List 切换控件的随机色。

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **类型**：`'random' | 'sequential' | 'fixed'`。
- **主题默认值**：`'random'`。
- **作用**：决定分页外观变体如何选择。
- **状态与限制**：条件生效；style.enabled 为 true 才使用该策略。三种模式如下：

| 模式       | 当前行为                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| random     | 构建时给出稳定的初始变体；客户端初始化后为容器及按钮重新取随机变体，可能重复，不是持续轮换动画 |
| sequential | 容器按页码依次选择，按钮按各自序号选择；不同按钮不一定同色，不按时间轮换                       |
| fixed      | 容器与按钮使用 fixedVariant 指定的同一变体                                                     |

禁用 JavaScript 时，保留静态 HTML 中的初始样式，不会执行客户端随机选择。

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **类型**：`number`。
- **主题默认值**：`9`。
- **作用**：参与变体选择的数量，使用编号 1 到 N；不是多选数组，也不是全站主题数量。
- **状态与限制**：条件生效；组件正常数值向下取整后限制在 1–12。但当前共享霓虹颜色只定义了 1–9，10–12 不应当理解为额外三套完整配色，可能回落到继承／基础色。建议使用 1–9，并保留默认 9 作为通常选择。这个范围说明不是新增颜色能力。

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **类型**：`number`。
- **主题默认值**：`1`。
- **作用**：fixed 模式下指定变体编号。
- **状态与限制**：条件生效；正常数值向下取整，并限制在 1 到当前 variants 范围。random 和 sequential 不使用它来固定样式；当前完整霓虹颜色建议选择 1–9。请使用有限整数。

例如固定为第二种分页外观：

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

只想保留基础分页样式，可以合并 `theme: { pagination: { style: { enabled: false } } }`。两种示例选需要的使用，不必连续复制来回覆盖。

## 5. 列表标题、描述和分页文字

<a id="archive-messages"></a>

以下完整前缀为 `i18n.locales.<语言>.messages.blog`，类型均为可选的 `string` 覆盖，状态均为条件生效：只有使用到对应标题、描述或控件时才出现。默认值经内置语言文案及回退解析；下表只列中文与英文，其他语言有自己的内置值。

| 字段                 | 中文默认 / 英文默认                                                                                              | 作用与限制                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `title`              | 博客 / Blog                                                                                                      | 博客第一页页面标题及隐藏的区块标题，不是文章标题，也不替换固定的卡片切换按钮文案 |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | 博客后续分页标题前缀，也用于标签后续页的标题；代码追加页码，不处理自定义占位符   |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | 博客第一页和标签目录的页面元描述，不是每张文章卡片摘要                           |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | 博客后续分页的元描述前缀，代码追加页码和句号；不用于标签文章列表的同一描述位置   |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          title: '文章归档',
          pageTitle: '文章归档 - 第',
          archiveDescription: '项目、阅读与学习笔记。',
          pageDescription: '文章归档分页',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

分页相关字段使用相同前缀和 string 类型：

| 字段             | 中文默认 / 英文默认     | 作用与限制                                             |
| ---------------- | ----------------------- | ------------------------------------------------------ |
| `previous`       | 上一页 / Previous       | 上一页链接的可见文字及可访问名称；第一页不显示该链接   |
| `next`           | 下一页 / Next           | 下一页链接的可见文字及可访问名称；最后一页不显示该链接 |
| `paginationAria` | 分页导航 / Pagination   | 分页 nav 的可访问名称，不是额外可见大标题              |
| `jumpTo`         | 跳转到页 / Jump to page | 跳页输入旁的可见文字；表单满足条件才显示               |
| `jumpInputLabel` | 页码 / Page number      | 输入框隐藏标签，提供可访问名称；不会改变输入格式       |
| `jumpGo`         | 跳转 / Go               | 跳页提交按钮文字，不改变目标路径                       |

这些字段也服务于标签列表和 Fragments 的共享分页。博客路由对空 jumpTo／jumpInputLabel／jumpGo 另有英文备用文字，但标签路由直接传递解析后的值；不要用空字符串来跨页面隐藏控件。需要隐藏跳页用 jump.enabled，保留有意义的可访问名称。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          previous: '前一页',
          next: '后一页',
          paginationAria: '文章分页',
          jumpTo: '前往第几页',
          jumpInputLabel: '目标页码',
          jumpGo: '前往',
        },
      },
    },
  },
},
```

## 6. 标签目录和共享入口文字

<a id="tag-messages"></a>

仍使用 `i18n.locales.<语言>.messages.blog`，类型为可选 string 覆盖，按普通界面文案回退。作用均依赖相应区域存在：

| 字段          | 中文默认 / 英文默认     | 作用与限制                                                                            |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `tags`        | 标签 / Tags             | 标签快捷入口、目录和标签列表标题，以及相关可访问名称；不修改文章的实际标签文字或 slug |
| `allPosts`    | 全部文章 / All posts    | 返回全部文章的入口文字，也被首页用作说明；不改变文章总数                              |
| `noTags`      | 暂无标签 / No tags yet. | 标签目录中没有有效标签时的提示；不是博客无文章提示                                    |
| `taggedPosts` | 文章 / Posts            | 标签所含文章数量的说明及标签页描述；不是手工设置计数                                  |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          tags: '按标签浏览',
          allPosts: '返回全部文章',
          noTags: '暂时没有可浏览的标签。',
          taggedPosts: '篇文章',
        },
      },
    },
  },
},
```

清空文字不会关闭对应功能，可能留下空白链接或不完整描述。关闭标签用 theme.tags.enabled，而不是将 tags 文案设为 false 或空字符串。

## 7. Cards／List、封面和其他边界

<a id="view-and-limits"></a>

以下是当前实现行为，不是新增配置字段：

- 博客和标签文章列表共用 Cards／List 切换。没有记忆时默认 cards；启用 JavaScript 后可切换，浏览器 localStorage 使用同一偏好键，所以跨博客、标签及语言页面共用选择。存储不可用时仍可切换，但不保证记住。
- 当前没有 site.config 的默认视图、禁用切换按钮、视图文字、列表列名或卡片颜色字段。切换按钮和归档栏使用组件内置语言表，自定义语言没有专用表项时使用英文；不能用 messages.blog.title 修改它们。
- 当前渲染卡片的标题、日期、封面及最多两个标签；没有配置项开启卡片摘要、改变封面优先候选数量或指定按 updatedDate 排序。description 不会因改列表元描述就成为卡片摘要。
- 列表前两张实际有封面的候选使用 eager／high，其余 lazy。List 视图隐藏封面不保证这些候选不会下载；图片准备与体积控制见[图片教程](/zh/blog/starter-guide-images/)。
- 主博客分页切换语言时，目标语言有相应页码就保留页码，否则回该语言博客第一页。标签列表切换语言会寻找相同标签文字，存在则进该标签第一页，不存在则进目标语言标签目录；不会自动翻译标签或匹配近义词。
- homepage 最新文章数量和穿越效果见[首页字典](/zh/blog/config-home/)。公共导航、搜索开关、页脚和评论不在本篇重新定义。

本篇未发现需要作为兼容保留收录的列表专用字段；不要把不存在的 blogView、showExcerpt 或 cardTheme 当作已接受字段。未提供配置的外观能力不通过添加任意键生效。

## 修改后怎么确认？

先在 dev 检查博客第一页、后续分页、标签目录和某个标签列表。跳页必须有足够总页数，样式 fixed 要与 random 区分；元描述查看页面 head，隐藏标签和可访问名称不能只凭页面大字判断。

修改每页文章数或标签名称后，重新构建并完整部署，注意旧分页／旧标签文件残留。发布前停止 dev，运行 npm run doctor 后再用 npm run preview 查看构建结果；doctor 已含构建，无需立即重复 check 和 build。步骤见[安装教程](/zh/blog/starter-guide-1-configure-your-site/)和[部署教程](/zh/blog/starter-guide-deployment/)。
