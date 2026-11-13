---
tags: ['anglefeint', 'config']
title: '配置字典：语言启停、地址、界面翻译和回退'
subtitle: '语言登记、默认语言、页面地址与不同内容的回退规则。'
description: '以实际代码说明 i18n 字段的类型、默认值、启停规则、首页前缀、界面翻译、回退链及内容和 SEO 边界。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

想按步骤启用语言或发布译文，先看[多语言教程](/zh/blog/starter-guide-languages/)；配置文件位置见[安装与站点信息](/zh/blog/starter-guide-1-configure-your-site/)。其他模块从[配置字典总入口](/zh/blog/config-reference/)进入。

本篇负责 i18n 的登记、地址和解析规则，不重复每个功能模块的全部文案。首页、文章、Fragments、About、Decoder、音乐、评论等文案的逐字段默认值和示例，在对应字典中查阅。下面默认值来自主题包，不是 demo 的个人覆盖值。

<a id="registry"></a>

## i18n.defaultLocale 与 i18n.locales

| 完整路径              | 类型 / 主题默认值                                             | 状态、作用与限制                                                                                                                                              | 示例                                                       |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale    | string / 'en'                                                 | 生效：决定根首页采用或跳转到的语言、必要回退和默认语言链接。空字符串在归一化时回退 en；不会自动从浏览器语言判断。默认语言始终启用，不能靠 enabled: false 关闭 | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales          | Record<string, LocaleConfig> / 下表九种内置语言               | 生效：键是实际语言代码，决定目录和网址；对象递归合并，省略某内置语言不会删除它。新增语言没有自动翻译包，需要补自己的文案与内容                                | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<语言>` | LocaleConfig，可部分覆盖 / 内置语言已有配置，新代码无原有配置 | 生效：包含 meta、site、messages、about、aiReadableContent。省略字段使用合并及回退规则；不能用空对象清除已有语言                                               | locales: { zh: { meta: { enabled: false } } }              |

语言键不等于菜单名称或 hreflang。实现不会自动把 EN 转成 en，或将 zh-CN 目录变成 zh；建议目录、配置和生成命令统一使用小写代码，例如 zh、en、pt-br、zh-hant。内容脚手架接受两至三位字母、可带一个连字符分段的代码；运行时语言归一化不是完整的语言代码或路径合法性校验器，不要填写路径或任意标点。

默认语言如果没有登记，归一化会补入一个以代码为 label 的配置；这不能代替准备对应内容和翻译。修改 defaultLocale 不会把已有文件移动到新语言目录。

### 内置语言的实际默认值

下面是未覆盖配置时的有效元数据：九种语言都启用，默认语言 en 的回退为空，其他语言回退 en。顺序沿用配置对象登记顺序，不按 meta.label 排序；也没有单独的语言菜单排序字段。

| 代码      | meta.label         | meta.hreflang | meta.ogLocale | 有效 enabled | 有效 fallback |
| --------- | ------------------ | ------------- | ------------- | ------------ | ------------- |
| `en`      | English            | `en`          | `en_US`       | true         | `[]`          |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true         | `["en"]`      |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true         | `["en"]`      |
| `es`      | Español            | `es`          | `es_ES`       | true         | `["en"]`      |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true         | `["en"]`      |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true         | `["en"]`      |
| `de`      | Deutsch            | `de`          | `de_DE`       | true         | `["en"]`      |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true         | `["en"]`      |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true         | `["en"]`      |

<a id="meta"></a>

## `i18n.locales.<语言>.meta`：五个元数据字段

以下相对字段均位于 meta 内；对内置语言的具体默认值见上表。新增语言省略字段时的归一化规则列在下表。配置输入支持部分覆盖，类型说明不表示所有字段每次都必须重写。

| 相对路径      | 类型 / 新语言省略时                                   | 状态、作用与限制                                                                                                                         | 示例值       |
| ------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label    | string / 语言代码                                     | 生效：语言菜单显示名称；空字符串也回退代码，纯空白不做 trim。不会重命名目录或网址                                                        | 'Français'   |
| meta.hreflang | string，可省略 / 语言代码                             | 生效：标准页面 html lang、hreflang 与部分结构化数据的语言值；不改变路径键。空字符串回退代码，不做格式校验                                | 'fr'         |
| meta.ogLocale | string，可省略 / 未设置                               | 条件生效：Open Graph 语言及可用的 alternate 元信息；未设置或空字符串不输出对应标签，不自动推导地区代码。内置语言覆盖为空字符串可清除原值 | 'fr_FR'      |
| meta.enabled  | boolean，可省略 / true                                | 生效：非默认语言只有 false 才关闭，默认语言无论此值如何都启用。影响标准语言页面和菜单，不删除文件或自定义页面，不是访问权限控制          | false        |
| meta.fallback | string[]，可省略 / 非默认语言补默认语言，默认语言为空 | 生效：配置解析的直接回退链。数组整体替换；过滤自身、重复项、空字符串及未登记语言。非默认语言最终总会补上默认语言                         | ['zh', 'en'] |

hreflang 和 ogLocale 是不同字段，不要用它们替代语言键。填写自定义语言时主题不会自动保证这些元信息符合某个地区的惯例；使用与你实际内容匹配的语言值。

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix：默认首页地址

- **类型 / 默认值：** 'always' | 'never' / 'always'。
- **状态与作用：** 生效，但当前只切换默认语言首页的规范入口；不是所有默认语言页面去掉前缀。空字符串不属于公开类型，运行时的兜底会视为 always，不建议依赖非法值。
- **限制：** 不会自动生成 /blog/、/about/ 等无语言前缀页面。切换后需要重新构建部署，也不会自动迁移旧网站链接或托管平台重定向规则。
- **示例：** i18n: { routing: { defaultLocalePrefix: 'never' } }。

假设 defaultLocale 是 en：

| 地址              | always                   | never                    |
| ----------------- | ------------------------ | ------------------------ |
| /                 | 静态 HTML 跳转到 /en/    | 展示英文首页             |
| /en/              | 展示英文首页             | 静态 HTML 跳转到 /       |
| /en/blog/         | 英文列表                 | 英文列表                 |
| /en/blog/my-post/ | 英文文章                 | 英文文章                 |
| /en/about/        | 英文 About（功能开启时） | 英文 About（功能开启时） |
| /zh/              | 中文首页（语言开启时）   | 中文首页（语言开启时）   |

根首页与语言首页之间使用 meta refresh 的静态跳转页，带 canonical 和 noindex；不是运行时根据访客位置选择语言，也不是主题配置的一条服务器 301。内部语言路径工具通常仍生成 `/<代码>/.../`；是否转到根首页由具体入口处理。

<a id="overrides"></a>

## site、messages、about：覆盖放在哪里？

完整前缀为 `i18n.locales.<语言>`。对象字段递归合并；数组整体替换；undefined 不覆盖原值。空字符串、false 和空数组保留，由各字段定义含义。

| 相对路径       | 类型 / 默认值                                                            | 作用、限制与示例                                                                                                                | 逐字段说明                                         |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / 内置各语言的首页配置             | 只承载语言相关首页内容，不取代顶层 site 身份配置；如 site: { homeTitle: '我的博客' }                                            | [首页字典](/zh/blog/config-home/#site-fallbacks)   |
| site.homeTitle | string，可省略 / 未设置                                                  | 按当前语言和直接回退语言依次找 trim 后非空标题，最终用全站 SITE_TITLE；例值 '我的博客'。空字符串不能阻止继续回退                | [首页大标题](/zh/blog/config-home/#home-title)     |
| site.hero      | string，可省略 / 内置各语言介绍；新语言未设置                            | 按回退链找第一个已定义值；空字符串主动清空，不继续查回退语言；未找到时首页还有 messages.home.hero 备用。例值 '记录项目与生活。' | [首页介绍](/zh/blog/config-home/#home-hero)        |
| messages       | DeepPartial<Messages> / 语言配置覆盖项通常未设置，运行时叠加内置语言文案 | 用于按钮、状态、元描述等；如 messages: { nav: { home: '主页' } }。只改文字，不新增对应功能或翻译内容                            | [字典总入口](/zh/blog/config-reference/)           |
| about          | DeepPartial<AboutConfig> / 内置各语言 About 配置                         | 从基础 About 开始按链递归合并；如 about: { sections: { who: '我是一名开发者。' } }。不从 Markdown 文件自动读取正文              | [About 字典](/zh/blog/config-about/#about-content) |

内置各语言 hero 的精确默认值如下；默认配置不提供 homeTitle：

| 语言      | site.hero 默认值                                                                           |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## 回退链的精确顺序

例如当前语言 fr 的有效 meta.fallback 为 ['zh', 'en']，配置解析链是 fr → zh → en，直接按这个列表查找或反向合并。不会继续展开 zh 自己的 fallback；若想使用 ja，必须直接把 ja 放入 fr 的数组。

1. 没写 fallback 或写 [] 时，非默认语言仍补默认语言。默认语言允许没有回退，也可以指定其他已登记语言。
2. 自身、重复项和未登记语言被过滤；检查的是是否登记，不是是否启用，因此已关闭的语言仍可参与配置回退。
3. 非默认语言如果没包含默认语言，末尾追加。若已显式包含，则保留它在数组中的原位置，不会再挪到最后。
4. 普通 messages 从内置英文起步，按有效链的倒序，为每个语言先合并内置包，再合并该语言个人覆盖。因此当前语言的内置翻译也可能覆盖回退语言的个人文案。

例如 en 的 nav.home 改成 'Start'，不会让内置 zh 的“首页”自动变成 'Start'。要改中文，直接覆盖 zh.messages.nav.home。新增没有内置包的语言，则可从回退语言补界面文字，但不会自动得到完整的该语言译文。

不同内容不共用同一种回退算法：

| 内容                       | 当前行为                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| 普通 messages              | 上述内置英文 → 回退语言内置包及覆盖 → 当前语言内置包及覆盖                                             |
| site.homeTitle             | 按直接链找非空且 trim 后的值，再回全站标题                                                             |
| site.hero                  | 按直接链找已定义值，空字符串停止继续查找                                                               |
| about                      | 基础 DEFAULT_ABOUT_CONFIG 起步，按直接链倒序合并各语言配置                                             |
| messages.home.transmission | 特例：当前语言个人值 → 英文个人值 → 内置英文作者文字，不走普通完整回退链；当前内置文字为 Knock, knock. |
| aiReadableContent          | 该语言字段覆盖顶层公共补充，不走 meta.fallback，见下节                                                 |
| 文章和碎片正文             | 不走文案回退；只读取对应语言自己的内容                                                                 |

回退不会把英文文章补进中文列表、生成翻译文件、搜索其他语言补齐首页条数，也不会自动把两个不同 slug 视为译文。

<a id="common-messages"></a>

## 语言选择器和共用文案

这些是 `i18n.locales.<语言>.messages` 下的字段，均为 string，可省略，按普通文案链解析。本地化 siteTitle 当前不改变标准站点身份，其类型、默认值与未使用状态统一见[站点字典](/zh/blog/config-site-chrome/#legacy-site-title)。

| 相对字段        | 中文 / 英文默认值                                                                                | 状态、作用与限制                                                                    | 示例值                 |
| --------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------- |
| langLabel       | 语言 / Language                                                                                  | 生效：公共语言选择器的提示和无障碍文案，不是每种语言的选项名。选项名使用 meta.label | '选择语言'             |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | 条件生效：首页元描述，不是可见介绍或所有页面通用描述；其余页有自己的描述来源        | '我的项目与学习笔记。' |

功能模块内部文案请进入已有字典；没有消费位置的字段不会因为出现在类型里就生效。评论 iframe 的语言还受 theme.comments.lang 影响，默认固定英文；详见[评论字典](/zh/blog/config-comments/#appearance)。

<a id="ai-context"></a>

## aiReadableContent：语言级公开补充的特殊回退

语言级补充位于 `i18n.locales.<语言>.aiReadableContent`，只按 notes / links 各自覆盖顶层值，不走 meta.fallback。省略字段继承全局值；空 notes 或空 links 数组主动清空；对象 {} 本身不清空全局内容。

字段类型、默认值、校验和完整示例统一见[AI 阅读补充字典](/zh/blog/config-analytics-ai/#locale-supplement)。它不是页面翻译或 About 正文；所有补充均公开。链接相对站点发布根解析，单个 / 开头会跳过部署 base，具体对照见[链接解析说明](/zh/blog/config-analytics-ai/#supplement)。

<a id="examples"></a>

## 可合并的配置示例

合并到 src/site.config.ts 现有 defineThemeConfig({...})，保留其他个人配置；不要重复创建 i18n。以下示例的语言对象仍与九种内置语言递归合并，不会因为只写两种就自动关闭其他语言。

### 只保留中文页面

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
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

默认语言 zh 无法被关闭；关闭英文页面后，其登记配置仍可以参与回退。若想使用根路径首页，把此示例中的 always 改成 never，文章仍在 /zh/blog/.../。

### 添加法语，并补自己的界面文字

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

这个例子只补了几项法语，不是完整法语语言包。还需要在 src/content/blog/fr/ 发布文章；碎片则放 src/content/fragments/fr/。脚手架默认按已启用语言生成占位文件，不会自动翻译正文。

<a id="content-and-seo"></a>

## 地址、内容切换和 SEO 的边界

- 公共语言菜单只列启用语言，默认保留当前页面的子路径；具体路由可以提供自己的菜单目标。它不是任意页面都保证存在的翻译搜索器。
- 标准文章页按完整、不含语言目录的 slug 查找译文：存在则跳到对应文章，不存在则菜单跳到该语言的 Blog List。SEO 只声明确实存在的同 slug 文章，不把列表当作文章译文；默认语言也缺译文时，不伪造它的 x-default 文章地址。
- Fragments 的语言切换进入目标语言的列表首页，不按当前碎片 ID 找译文；同 ID 的讨论共享是另一套机制。禁用语言不删除原文件或 GitHub 讨论。
- 改 meta.label 只改菜单文字；改语言键才会改变网址和内容目录约定。主题不自动迁移旧链接，也不按 Accept-Language、浏览器设置或国家选择语言。
- 公共消息对象是文本配置，不是任意 HTML 或 Markdown 的统一渲染入口；具体字段是否支持换行、数组或格式，应看对应模块。数组整体替换不会追加菜单项或功能。
- 没有公开的独立 languageOrder、autoDetect、缺失译文自动翻译、全站无前缀路由或按语言更换公共歌单字段。自定义页面的 localeHrefs / seoLocaleHrefs 属于组件参数，不是 site.config 字段。

保存配置后重新读取开发配置；正式网站需要重新构建部署。语言关停不应被当作清理托管平台旧文件或保护私密内容的手段。返回[配置字典总入口](/zh/blog/config-reference/)继续查其他模块。
