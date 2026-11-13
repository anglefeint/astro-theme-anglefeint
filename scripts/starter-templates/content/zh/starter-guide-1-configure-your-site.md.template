---
tags: ['anglefeint', 'starter']
title: '使用指南 1：安装博客，换成自己的信息'
subtitle: '在本地运行博客，修改自己的信息，按默认流程创建文章，再按需调整语言和首页文案。'
description: '从安装启动到个人信息、默认创建流程和本地验证；首页文案与语言按需调整，已有项目可查看文末升级说明。'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

本篇是入门教程的第 1 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

读完这篇，你可以在自己的电脑上打开博客，把站点名称、首页介绍和联系方式换成自己的，并知道接下来在哪里写文章。音乐、评论和页面定制可以等需要时再配置。

如果你已经有一个使用 Anglefeint 的项目，直接在原项目修改配置；需要更新主题时，查看文末“已有项目如何升级”，不用重新安装一份博客。

<a id="tutorial-order"></a>

## 八篇教程怎么读？

第一次使用可以按下面顺序阅读；碎片、评论和多语言调整都是按需操作，不需要为了完成安装而开启。阅读中文教程不要求先修改项目的默认语言；需要调整语言时再按相应章节操作。以后只想改某个字段时，直接从[配置字典总入口](/zh/blog/config-reference/)查询。

| 顺序 | 教程                                                                                           | 读完可以做什么                                    |
| ---- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1    | [安装博客，换成自己的信息](/zh/blog/starter-guide-1-configure-your-site/)                      | 运行博客、修改个人信息，了解默认流程。            |
| 2    | [写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)                                | 创建文章、填写日期，使用标题、标签、代码和公式。  |
| 3    | [给文章和碎片添加图片](/zh/blog/starter-guide-images/)                                         | 放入原图、设置封面、准备图片并提交派生文件。      |
| 4    | [发布一条碎片](/zh/blog/starter-guide-5-fragments/)                                            | 创建碎片，保留稳定 ID，添加配图和代码。           |
| 5    | [把页面和功能调整成自己喜欢的样子](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/) | 调整页面内容、音乐和分页，创建自定义页面。        |
| 6    | [让读者留下评论](/zh/blog/starter-guide-4-giscus-comments/)                                    | 连接 Giscus，选择文章、碎片及译文讨论的关联方式。 |
| 7    | [让更多语言的读者使用博客](/zh/blog/starter-guide-languages/)                                  | 按需选择语言、调整首页地址并补充译文。            |
| 8    | [把博客发布到自己的域名](/zh/blog/starter-guide-deployment/)                                   | 检查构建产物、部署完整文件并绑定域名。            |

可以随时从各篇开头或结尾返回这份目录，继续下一步或查找需要的内容。

## 1. 安装并打开博客

先准备 Node.js 22.12.0 或更新版本和 npm。在终端运行下面两条命令，确认它们能输出版本号：

```bash
node --version
npm --version
```

在你打算存放项目的目录中创建博客。下面的命令会新建 `my-blog` 文件夹，不会自动安装依赖：

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

你可以把 `my-blog` 换成其他目录名，同时修改 `cd` 后的名称。打开终端显示的本地网址；不要假定端口一定相同，端口被占用时可能变化。开发服务保持运行，按 `Ctrl+C` 停止。

后续命令都在这个项目根目录执行，也就是包含 `package.json` 的目录。再次打开已有项目时，只需进入该目录运行 `npm run dev`。首次安装依赖或依赖发生变化时才需要运行 `npm install`。

这篇使用 npm。使用 pnpm 的新项目可把安装、启动命令换成 `pnpm install`、`pnpm dev`，但文末的自动升级器目前只支持 npm 项目。一个项目保持使用同一种包管理器。

## 2. 换成自己的站点信息和首页文案

安装后的项目已经有 `src/site.config.ts`，直接打开这个文件编辑，不需要新建配置文件或重新声明配置对象。starter 默认省略 `site` 并使用主题默认值；在现有的 `defineThemeConfig({ ... })` 内加入下面的字段即可。如果文件已经有 `site`，直接修改其中字段，保留其他个人配置，不要重复添加同名对象。文件原有的 import、export 和其他内容保持不动。

```ts
site: {
  title: '小林的博客',
  description: '记录开发、阅读和生活。',
  url: 'https://example.com',
  author: '小林',
  tagline: '保持好奇，持续记录。',
},
```

这段只展示现有对象内部的成员，不是一个新的完整配置文件。把姓名、文案和域名替换成自己的；它不会改变默认语言或启用语言列表。`site.url` 填最终上线的域名地址，例如 `https://your-domain.example`，不要填本地预览网址或某篇文章的网址。暂时没有域名可以先保留示例，在正式部署前换掉。当前主题按域名根目录部署使用，不能仅设置 Astro `base` 就认为子目录部署已适配。

这些字段分别控制：

| 字段               | 实际作用                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `site.title`       | 全站名称，用于页面标题、导航、页脚等；没有单独设置首页标题时，也作为首页大标题的最终回退值 |
| `site.author`      | 未单独填写作者的文章所使用的默认作者                                                       |
| `site.url`         | canonical、RSS、sitemap 和分享图等输出使用的网站地址                                       |
| `site.description` | 站点级默认描述；首页优先使用解析后的 `messages.siteDescription`，为空才使用这个值          |
| `site.tagline`     | 页脚自定义文字；设为 `''` 不显示这段文字，主题和 Astro 署名由另一个开关控制                |

### 按需修改某种语言的首页文案

首页可见介绍和首页元描述需要在对应语言下填写。下面以项目默认的英文首页为例，在现有配置对象内添加或合并 `i18n`；已有同名对象时只修改对应字段：

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero` 控制英文首页大标题下面的可见介绍，`messages.siteDescription` 控制该页 SEO 描述。前者设为 `''` 可以清空可见介绍，不会清空后者。将 en 换成其他已启用的语言代码，就能修改那种语言的文案；这不会改变默认语言，也不会自动翻译其他语言。

首页大标题默认使用全站名称；如果希望它不同，在同一个 `en.site` 中添加 `homeTitle`，保留已有的 `hero`：

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

这里的 `site` 位于 `i18n.locales.en` 内，不是顶层 `site`。`homeTitle` 只修改首页可见大标题，不会替换浏览器标题、导航、页脚或 RSS 中的全站名称。未设置或只有空白时，会沿该语言的回退链查找，最后使用全站名称。完整字段见[首页字典](/zh/blog/config-home/#home-title)。

### 放上自己的社交链接

在现有配置对象内添加或修改 `social.links`，把 `yourname` 换成真实账号：

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

每条链接填写 `href`（目标地址）和 `label`（可访问名称），`icon` 是可选的内置图标名。内置图标支持 `github`、`twitter`、`mastodon`、`youtube`、`bluesky`、`linkedin`、`discord`、`telegram`、`instagram`、`facebook`、`whatsapp`、`line`。

`social.links` 同时用于顶部和页脚，按数组顺序显示；手机宽度下顶部社交入口隐藏，页脚仍保留。数组会整体替换默认列表，添加新账号时也要保留希望继续显示的条目。暂时不放账号可以使用 `social: { links: [] }`；空列表会保留三个不可点击的占位图标，并非隐藏整个区域。

### 修改了却没有变化？

先检查项目根目录的 `.env`、其他适用的 `.env.*` 文件，以及托管平台构建环境中有没有旧的覆盖值：

- `PUBLIC_SITE_TITLE` 覆盖站点名称。
- `PUBLIC_SITE_AUTHOR` 覆盖默认作者。
- `PUBLIC_SITE_URL` 覆盖网站地址。
- `PUBLIC_SITE_DESCRIPTION` 覆盖站点级默认描述，但不会取代非空的首页语言描述。
- `PUBLIC_SITE_TAGLINE` 覆盖页脚自定义文字。

不需要这些覆盖时移除对应变量，统一使用配置文件即可，不必为了使用主题新建 `.env`。修改环境变量后重启开发服务；发布的网站需要重新构建和部署，本地保存文件不会直接修改线上页面。

## 3. 先保留默认语言，按需要调整

初始配置启用 `en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant` 九种语言，默认语言是 `en`。访问 `/` 会跳转到 `/en/`；阅读中文教程不需要先把博客改为中文，也不需要为了创建第一篇文章关闭其他语言。

如果你想更换默认语言、只保留部分语言，或让默认语言首页直接使用根地址 `/`，按[第七篇：让更多语言的读者使用博客](/zh/blog/starter-guide-languages/)操作即可，这是可选配置。省略某种语言不会关闭它，需要明确设置 `meta.enabled: false`；默认语言始终启用。关闭语言不删除文章文件。

语言设置的类型、默认值和地址关系见[语言字典](/zh/blog/config-languages/#registry)。系统不会自动翻译文章或首页文案；继续下面的默认创建流程时，留意生成了哪些语言文件。

## 4. 用自己的文章替换示例

文章位于 `src/content/blog/<语言代码>/`。 starter 中的 `welcome-to-anglefeint.md`、`starter-guide-*.md` 和 `config-*.md` 都是普通博客文章，分别用于欢迎示例、八篇教程和配置字典。备份或提交到 Git 后，可以按语言保留或删除不需要的内容；只删欢迎文章和教程，不会同时删掉字典。不要删除仍被其他内容引用的图片。

按默认流程创建文章：

```bash
npm run new-post -- my-first-post
```

没有指定 `--locales` 或 `ANGLEFEINT_LOCALES` 时，命令会为项目全部已启用语言生成同名骨架；初始配置会生成九份。它不会自动翻译，同名文件已存在时会跳过，不覆盖已有内容。

打开 `src/content/blog/<语言代码>/my-first-post.md`，填写标题、简介和正文；对应网址是 `/<语言代码>/blog/my-first-post/`。例如英文文件在 en 目录、网址为 `/en/blog/my-first-post/`，中文对应 zh 目录和 `/zh/blog/my-first-post/`。发布前把未完成、不准备公开的骨架移出内容目录，不能把它们当作自动隐藏的草稿。

如果只想创建某种语言，可以改用 `npm run new-post -- my-first-post --locales zh`；指定多种语言可用 `--locales en,zh`。这些是可选用法，不必重复执行全部示例；`--locales` 本身不会启用语言。

文章字段、封面、代码和数学公式的详细写法见[写文章与管理内容](/zh/blog/starter-guide-2-languages-and-routing/)。

## 5. 在本地确认修改结果

回到开发页面确认：站点名称和首页介绍已经替换、语言菜单符合预期、自己的文章可以打开、社交链接指向真实账号。目录中的其他语言文章只有在对应语言启用时才会生成其路由。

检查构建结果前，先按 `Ctrl+C` 停止开发服务，再运行：

```bash
npm run doctor
npm run preview
```

本地 `doctor` 会准备缺失或过期的响应式图片文件、执行 Astro 检查并构建网站；About 开启时还会检查对应运行时配置。成功后不必紧接着重复运行 `check` 或 `build`。任何一步失败时先处理终端错误，再运行 `doctor`；不要把失败后残留的 `dist/` 用于部署。

`preview` 打开的是 `dist/` 中已经构建的静态网站，访问终端给出的网址即可；它不会把博客发布到互联网。文章搜索需要在构建后的预览中验证，`dev` 没有实时全文搜索。按 `Ctrl+C` 停止预览。

以后发布时，托管平台的构建命令是 `npm run build`，输出目录为 `dist`，需要部署其中全部文件。新增或更换本地图片后，先在本地运行 dev 或 doctor，提交原图和生成的整个 `src/assets/blog/covers/` 目录；部署构建及 CI doctor 只校验这些响应式文件，缺失或过期会失败，不在平台上补生成。修改内容或配置后，需要重新构建并部署。

## 已有项目如何升级

新安装的博客不需要再执行本节。已有项目先保存自己的改动，例如提交到 Git，然后停止开发服务和预览，在原项目根目录执行：

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check` 会查询目标版本并检查项目、Node.js 和 Astro 兼容性，不修改项目文件，也不执行安装或构建。确认通过后再执行实际升级：

```bash
npx @anglefeint/astro-theme@latest upgrade
```

自动升级适用于使用 npm、带有 `package-lock.json` 的集成版 starter。项目的 `package.json` 应带有 `anglefeint.projectSchema: 1`，标准页面由主题包提供。检测到 pnpm、yarn 或 bun 锁文件时会停止；不要为了绕过检查删除自己的锁文件。非 npm 项目需使用原包管理器，在确认目标版本兼容后更新依赖并运行项目的 doctor，自动升级器不提供这一路径的回滚。

升级器更新主题依赖并运行 doctor，不重写你的文章、配置、音乐、图片或自建页面。它会把 `package.json`、`package-lock.json` 备份到 `.anglefeint/backups/`，不是整站备份。安装或 doctor 失败时会恢复这两个依赖文件并尝试重装原依赖；如果恢复安装也失败，按终端错误修复依赖，再成功运行 `npm run doctor`。旧的构建产物不会一起恢复，失败后不要部署 `dist/`。

Node.js、Astro 或 starter schema 不兼容时会停止，不会自动迁移 Astro。`--to` 可指定一个兼容的明确主题版本，但不支持自动降级；版本变更说明可查 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)。升级成功后可直接运行 `npm run preview` 检查已构建的结果，再按原流程部署，无需为了升级立即再构建一遍。

0.27 之前的复制式旧骨架不支持原地自动升级。应在另一个目录按本文安装新 starter，保留旧项目，将文章和资源迁入新项目，再将个人配置值合并到新的 `src/site.config.ts`。不要复制旧标准路由、adapter 或 defaults/schema/runtime 辅助文件；核对文章 slug、语言路径、音乐和图片 URL，以及域名和托管设置，再完成本地检查和部署。

## 教程导航与配置查阅

[下一篇：写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[站点、社交和页脚](/zh/blog/config-site-chrome/)、[首页标题与介绍](/zh/blog/config-home/)、[语言设置](/zh/blog/config-languages/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
