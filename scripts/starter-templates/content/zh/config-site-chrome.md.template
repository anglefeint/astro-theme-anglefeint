---
tags: ['anglefeint', 'config']
title: '配置字典：站点名称、域名、公共导航、社交和页脚'
subtitle: '全站身份、环境覆盖、固定导航与公共链接。'
description: '以实际代码查阅 site、social、footer 和导航文案，列出类型、默认值、限制、环境覆盖以及兼容和未生效设置。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

第一次替换自己的信息，先看[安装与站点信息](/zh/blog/starter-guide-1-configure-your-site/)；域名部署操作见[发布教程](/zh/blog/starter-guide-deployment/)。其他模块从[配置字典总入口](/zh/blog/config-reference/)进入。

以下配置写在 src/site.config.ts，默认值来自主题包，不是 demo 的个人名称、账号或域名。保留现有 defineThemeConfig({...}) 的 import、export 和其他模块，合并片段即可。

<a id="identity"></a>

## site：全站身份的六个字段

site 是对象，所有字段都可在部分配置中省略。表中的状态均为条件生效：实际页面读取该信息时使用，且环境覆盖或页面自身更具体的参数可能优先。

| 完整路径           | 类型           | 主题默认值                                                                              | 作用、限制与例值                                                                                                                                                                             |
| ------------------ | -------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string         | `"My Blog"`                                                                             | 页头品牌名、页脚版权名称、RSS 标题、结构化数据中的站点名称，以及部分页面和自动分享图的站点信息；不等于首页大标题。没有统一的空字符串回退；例值 `"我的博客"`                                  |
| `site.description` | string         | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | 全站描述与机器阅读索引描述的来源之一；首页优先用 messages.siteDescription，About、列表等有各自描述，不会逐页全部替换；例值 `"记录项目、阅读和生活。"`                                        |
| `site.url`         | string         | `"https://example.com"`                                                                 | 网站公开绝对地址，用于 Astro site、canonical、RSS、sitemap 和公开导出地址。填写真实 HTTP(S) 地址，不使用某篇文章 URL；不负责购买域名、DNS、证书或发布代码；例值 `"https://blog.example.com"` |
| `site.author`      | string         | `"Your Name"`                                                                           | 默认作者与结构化数据；文章 author 可单独覆盖。页脚版权使用 site.title，不使用 author；About 正文和邮箱也不会自动随它改变；例值 `"小林"`                                                      |
| `site.tagline`     | string         | `""`                                                                                    | 页脚附加短句，渲染时 trim；空值不显示。trim 后恰为旧默认 Built with Astro. 时也隐藏，以避免与链接署名重复；例值 `"保持好奇，持续构建。"`                                                     |
| `site.ogImage`     | string，可省略 | `""`                                                                                    | 没有页面或文章优先图片时使用的全站分享图。空白使用主题自带分享图；本地 public 路径或 HTTPS URL，不是首页头像或文章封面批量替换；例值 `"/images/share.webp"`                                  |

site.title 与 `i18n.locales.<语言>.site.homeTitle` 的角色不同：前者是全站名称，后者只改对应语言首页的可见大标题。后者按语言链找非空值，最后才回到全站名称；见[首页标题](/zh/blog/config-home/#home-title)。messages.siteTitle 当前不用于标准全站身份或首页大标题，不要填写它期待品牌名称变化。

site.description 也不等于首页可见介绍；可见介绍使用 `i18n.locales.<语言>.site.hero`，首页元描述还有 messages.siteDescription。具体优先级见[首页字典](/zh/blog/config-home/#site-fallbacks)。改全站身份不会自动修改 About 里已经填写的个人介绍。

### 分享图的优先级与路径

site.ogImage 在公共 head 缺少页面图片时才使用。文章自己的 ogImage、自动生成分享图或文章封面可以先于它生效，详见[文章字典](/zh/blog/config-article/#frontmatter)。开启全局自动分享图时，不能指望 site.ogImage 覆盖每篇文章。

本地示例 /images/share.webp 对应 public/images/share.webp；需要提前放好文件。缺文件、路径越出 publicDir 或无效路径会在解析该备用图时报错。本地图片会加上发布 base 和内容版本参数；HTTPS 图片保持远程地址，主题不下载验证。空值或纯空白继续用主题图，不是删除分享元信息。

site.ogImage 是字符串字段，不直接填写 Astro image import 对象；文章 frontmatter.ogImage 支持的类型不同。这个字段没有 PUBLIC_SITE_OG_IMAGE 环境覆盖，也不改变文章 heroImage。

<a id="environment"></a>

## 环境覆盖与域名生效顺序

以下不是新的 site.config 字段，而是主题当前读取的环境变量。值均为 string；没有设置时使用相应 site 字段。读取使用空值合并，不会把空字符串自动当成“未设置”。

| 环境变量                | 优先覆盖         | 示例                                     |
| ----------------------- | ---------------- | ---------------------------------------- |
| PUBLIC_SITE_TITLE       | site.title       | PUBLIC_SITE_TITLE=我的博客               |
| PUBLIC_SITE_DESCRIPTION | site.description | PUBLIC_SITE_DESCRIPTION=项目与学习笔记   |
| PUBLIC_SITE_AUTHOR      | site.author      | PUBLIC_SITE_AUTHOR=小林                  |
| PUBLIC_SITE_TAGLINE     | site.tagline     | PUBLIC_SITE_TAGLINE=保持好奇             |
| PUBLIC_SITE_URL         | site.url         | PUBLIC_SITE_URL=https://blog.example.com |

构建集成会按 dev/build 与 --mode 对应的 Vite dotenv 模式读取 PUBLIC_SITE_URL，使 Astro site 与页面公开地址保持一致。已有进程环境覆盖同名 dotenv 值；不要只改 site.url 却忘记部署平台仍设置了 PUBLIC_SITE_URL。空字符串可能清空文本或使地址无效，不是恢复配置默认值的方法。

页面侧 SITE_URL 还保留 import.meta.env.SITE 的中间兜底：PUBLIC_SITE_URL → SITE → site.url。标准集成的 Astro site 以 PUBLIC_SITE_URL 或配置 URL 设置，页面 head 又优先 Astro.site；SITE 是适配层兼容兜底，不建议作为另一套独立域名配置。

域名和发布子路径不是同一个字段。Astro 的 base、托管输出与 DNS/HTTPS 设置仍需要按部署教程配置；把子目录随意塞进 site.url 不会自动移动所有路由。改值后重启开发服务，线上重新构建部署；不会替你设置服务器重定向。

<a id="navigation"></a>

## 公共导航：固定入口加功能开关

没有公开 nav 数组、菜单排序或自定义菜单项字段。标准页头的入口按实现组合：

| 位置                    | 当前来源和限制                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| 品牌名                  | site.title / 环境覆盖，点击进入当前语言首页                                                          |
| 首页、Blog              | 始终保留这两个标准入口；名称用 messages.nav.home / blog，不靠文案改变目标地址                        |
| About                   | theme.enableAboutPage，boolean，默认 true；如 theme: { enableAboutPage: false } 会关闭页面及对应入口 |
| Frontier 下的 Decoder   | theme.enableDecoderPage，boolean，默认 true；该页头入口文字固定 Decoder Lab                          |
| Frontier 下的 Fragments | theme.fragments.enabled，boolean，默认 false；标签用 messages.fragments.title                        |
| Frontier 下的 Contact   | About 开启时出现，标签用 messages.about.contact，跳到当前语言 /about/#contact；与 Decoder 开关独立   |
| 搜索                    | theme.search.enabled，boolean，默认 true；见[搜索字典](/zh/blog/config-search/#enabled)              |
| 语言与状态              | 启用语言、meta.label 和下表静态状态文案；语言选项不是任意链接列表                                    |

Frontier 的标题和名称由组件固定，所有子项都没有时才不渲染。更改 messages.decoderPage.fullTool 会影响完整工具页面及页脚工具链接，当前不会替换页头固定的 Decoder Lab。

语言和地址规则见[语言字典](/zh/blog/config-languages/#content-and-seo)，About、Fragments、Decoder 各自的字段仍在对应字典。不要靠设置空标签来关导航，会保留地址或留下不清楚的按钮名称。

<a id="chrome-messages"></a>

### 页头与页脚的七项文案

完整前缀为 `i18n.locales.<语言>.messages`，字段均为可省略 string。默认取内置当前语言文案和回退链；下表只列中文 / 英文。状态均为条件生效：对应导航或署名区域存在时使用。文字按文本渲染，不解析 Markdown 或任意 HTML。

| 相对字段           | 中文 / 英文默认值               | 作用与限制                                         | 示例值       |
| ------------------ | ------------------------------- | -------------------------------------------------- | ------------ |
| `nav.home`         | 首页 / Home                     | 首页导航文字，不改路由                             | `"首页"`     |
| `nav.blog`         | 博客 / Blog                     | Blog 入口文字，不改路由                            | `"文章"`     |
| `nav.about`        | 关于 / About                    | About 导航文字，也被正文窗口重新打开入口使用       | `"关于我"`   |
| `nav.status`       | system: online / system: online | 页头状态文字，静态展示，不检测网络、API 或服务健康 | `"系统在线"` |
| `nav.statusAria`   | 系统状态 / System status        | 状态区域无障碍名称，不是服务检测开关               | `"站点状态"` |
| `footer.theme`     | 主题： / Theme by               | 主题署名前缀；Anglefeint 链接文字及目标固定        | `"主题来自"` |
| `footer.builtWith` | 构建工具： / Built with         | Astro 署名前缀；Astro 链接文字及目标固定           | `"使用"`     |

messages.langLabel 用于语言控件，选项名用 meta.label，见[语言文案](/zh/blog/config-languages/#common-messages)。Contact、Fragments 等引用各模块文案，不在 messages.nav 中另造字段。

<a id="social"></a>

## social.links：页头和页脚共用的社交链接

- **类型 / 默认值：** SocialLink[] / []，每项五个字段见下表。
- **状态与作用：** 生效，按数组顺序在页头与页脚使用同一份链接。数组整体替换，没有公开条数上限或按语言分别配置的入口。
- **限制：** [] 不表示完全隐藏区域；标准组件会显示 Mastodon、Twitter、GitHub 三个不可点击的占位图标。dev 还显示配置提示。已有条目里 href 为空不会变成这种占位，而是仍输出链接。
- **示例值：** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }]。

About 的邮箱、GitHub 联系链接与这里独立；改社交数组不会自动改 About 联系段落。当前没有 theme.social.enabled 或 hidePlaceholders 之类 site.config 开关；组件的 showPlaceholdersWhenEmpty 是布局参数。

<a id="social-fields"></a>

### 每个 SocialLink 的五项字段

完整前缀为 social.links[]。必填字段没有自动补值；即使配置输入的部分类型允许部分对象，也应填写完整有效条目。

| 字段    | 类型 / 默认值                                           | 状态、作用与限制                                                                                                                               | 示例值                        |
| ------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | string，必填 / 无                                       | 生效：实际链接地址；当前解析器不统一校验协议、可达性或非空，也不自动加 BASE_URL。使用完整 HTTPS 地址或正确的站内路径，不把它当成经过验证的账号 | 'https://github.com/yourname' |
| label   | string，必填 / 无                                       | 生效：链接无障碍名称；没有图标时也是可见文字。不自动取平台名或目标页标题，填写清楚的非空名称                                                   | 'GitHub'                      |
| rel     | string，可省略 / 未设置，最终至少含 noopener noreferrer | 生效：空白分隔的关系标记，转小写、去重、移除 opener，并保留新窗口保护；不会因为写空字符串取消保护。非字符串报错                                | 'me nofollow'                 |
| icon    | 内置 SocialIcon，可省略 / 未设置                        | 条件生效：下方十二个名字之一；没有 iconSrc 时使用，未知的非空名字报错，不按网址自动识别平台。省略且没有自定义图则用 label 文字                 | 'github'                      |
| iconSrc | string，可省略 / 未设置                                 | 条件生效：自定义 publicDir 内本地 SVG/PNG/WebP 路径；有效非空路径优先于 icon。纯空白视为没设置，非字符串或不符合规则会报错                     | '/icons/community.svg'        |

所有真实条目都以新标签页打开；自定义 rel 会与保护标记合并。文本标签不解析 HTML。内置图标名称精确且区分大小写：

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### 自定义图标的文件限制

例如 public/icons/community.svg 对应 iconSrc: '/icons/community.svg'。配置的是实际 publicDir 中的文件，不是包内资源或 src/assets 路径。路径必须以单个 / 开头，不能是 URL、协议相对地址、带查询/片段的地址、百分号编码路径或含 . / .. 段的路径；反斜杠、冒号和控制字符也不接受。

构建时检查文件存在、是文件且解析后的真实路径仍在 publicDir 内；通过符号链接越出目录也不接受。普通空格和中文文件名可由组件编码，不要提前写百分号编码。输出图标路径自动加 Astro base，图标优先级不影响 href 的原样处理。其他图片格式如 JPG、GIF 不在这里支持的扩展名内。

如果已有有效 iconSrc，内置 icon 不参与选择；图标尺寸与间距是组件布局参数，不是 SocialLink 字段。

<a id="footer"></a>

## theme.footer：页脚链接与署名

| 完整路径                   | 类型 / 默认值                          | 状态、作用与限制                                                                                                                      | 示例值                                                    |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | 生效：是否显示主题与 Astro 的链接署名；不删除版权、社交、短句或其他链接。也参与当前自动文章分享图的署名参数，不改变已提供的自定义图片 | false                                                     |
| theme.footer.links         | { label: string; href: string }[] / [] | 生效：按数组顺序显示自定义页脚链接，数组整体替换；不改变公共页头。布局还可能追加 Decoder 链接，因此 [] 不保证页脚没有链接             | [{ label: '项目', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | string，必填 / 无                      | 条件生效：链接可见名称，按文本输出，不自动从目标页获取                                                                                | '项目'                                                    |
| theme.footer.links[].href  | string，必填 / 无                      | 条件生效：原样链接地址；当前没有与社交自定义图片同样的路径校验或自动 base 前缀，站内地址需自己填写正确。默认在当前标签页导航          | 'https://example.com/project/'                            |

主题会把自定义链接放在布局追加链接之前，不去重；Decoder 开启时公共框架自动追加指向完整工具页的链接，标签用 messages.decoderPage.fullTool。若不需要独立 Decoder 应改对应功能开关，不是靠清空 footer.links 移除它。

页脚版权固定显示构建时的年份与有效 SITE_TITLE，没有独立 copyright/year 配置。site.tagline 在署名之外独立显示；trim 后等于旧默认 Built with Astro. 时会省略这句兼容文字。showCredits: false 不影响其他短句，也不自动删除网站上已有的图片署名。

<a id="examples"></a>

## 可合并的站点与公共链接示例

先保留当前配置中的个人信息，仅合并需要修改的字段：

```ts
site: {
  title: '小林的博客',
  description: '记录项目、阅读和生活。',
  url: 'https://blog.example.com',
  author: '小林',
  tagline: '保持好奇，持续构建。',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: '项目主页', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目', href: 'https://example.com/project/' }],
  },
},
```

示例账号、域名和链接必须替换为自己的；主题不联网验证它们。需要自定义社交图标或全站分享图时，先准备对应 public 文件，再填写 iconSrc 或 site.ogImage。

只改中文导航与署名前缀可以合并：

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        nav: { home: '首页', blog: '文章', about: '关于我' },
        footer: { theme: '主题来自', builtWith: '使用' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## 当前未使用：messages.siteTitle

完整路径是 `i18n.locales.<语言>.messages.siteTitle`。类型为可省略的 string 覆盖；中文 / 英文内置默认值均为 'Angle Feint'。当前标准首页大标题和公共站点身份均不读取它，状态为“当前未使用”；例如填 siteTitle: '我的博客' 不会改变这些名称。

首页大标题使用 `i18n.locales.<语言>.site.homeTitle`，公共品牌名称使用顶层 site.title；两者具体作用分别见[首页标题](/zh/blog/config-home/#home-title)和[站点身份](#identity)。无需为了改名填写这个保留字段。

<a id="boundaries"></a>

## 兼容与未生效字段边界

- 当前六个 site 字段、社交与页脚字段及上述七项文案都有消费位置，但图片优先级、环境覆盖和入口开关会决定具体页面效果。
- site.tagline 的 Built with Astro. 是明确兼容旧默认的特殊值；它会被抑制，不应当成任意短句都被禁用。
- messages.siteTitle 的未使用状态见上节，类型接受不等于页面读取。
- homeHref、localeHrefs、extraLinks、showPlaceholdersWhenEmpty、iconSize 等是组件参数，不是 site.config 字段。类型中没有公开的 nav 数组、社交占位开关、版权模板或独立状态检测配置。

保存配置、准备文件后重新构建部署；环境变量变化需要重新读取对应模式。域名、链接可达性、远端账号和线上页面效果需在自己的部署中确认，不能仅凭本地类型检查判断成功。返回[配置字典总入口](/zh/blog/config-reference/)查其他模块。
