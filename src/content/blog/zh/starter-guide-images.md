---
tags: ['anglefeint', 'starter']
title: '使用指南 3：给文章和碎片添加图片'
subtitle: '放入原图，写对路径，准备响应式文件，再设置封面和分享预览。'
description: '说明文章正文、封面、Fragments 和分享图的实际处理区别，以及图片准备、Git 提交和部署排错。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**版本说明：** 正常 build／CI doctor 自动补齐图片需要主题 0.36.2 或更新版本；0.36.1 需先运行 dev 或 prepare-covers。显式 `prepare-covers --check` 保持只读。

本篇是入门教程的第 3 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

你不需要手工制作多套尺寸，也不用把文章链接改成生成文件名。先放好原图，在文章或碎片中引用；正常 dev、build 或 doctor 会准备需要的响应式文件。

本文按 starter 默认的 `src/`、`public/` 目录说明。先分清图片用在哪里：

| 用途         | 写在哪里                                          | 当前处理方式                                                  |
| ------------ | ------------------------------------------------- | ------------------------------------------------------------- |
| 文章正文配图 | Markdown 图片，或 MDX 中的图片                    | 使用原有 Markdown／MDX 图片流程，不属于下面的持久封面准备范围 |
| 文章封面     | 文章 frontmatter 的 `heroImage`                   | 本地准备响应式文件，列表和文章详情共用                        |
| 碎片配图     | 碎片正文的 Markdown 图片、引用式图片或 HTML `img` | 支持的本地图片使用同一套持久响应式文件，列表和首页预览共用    |
| 分享预览图   | 文章 `ogImage` 或站点 `site.ogImage`              | 独立的分享图逻辑，不等同于封面缩略图                          |

## 1. 先把原图放进项目

只在一篇文章中使用的图片，可以放在文章旁边：

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

碎片也可以采用相同方式，将图片放在对应 Markdown 旁边。多个页面共用的图片可以放到 `public/images/`：

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

这些目录不存在时可以自己创建。文件名建议使用简单英文、数字和连字符，避免大小写混淆。网址路径使用 `/`，不要写电脑上的 `C:\...`、`D:\...` 或反斜杠路径。部署到区分大小写的系统时，`Photo.jpg` 和 `photo.jpg` 不一定是同一个文件。

原图必须保留。后面生成的 WebP 是显示用的派生文件，不是原图的替代备份。

## 2. 在文章正文中插图

打开文章 Markdown，在需要的位置插入：

```md
![这张照片里有什么](./photo.jpg)
```

`./photo.jpg` 相对于当前文章文件。上面的目录示例中，它指向同目录的 `photo.jpg`。使用 public 里的文件则写：

```md
![这张照片里有什么](/images/shared-photo.jpg)
```

它对应 `public/images/shared-photo.jpg`，网址中不写 `public`。方括号内是图片的替代文本，建议描述实际内容，不要只写“图片”。

文章正文的普通图片支持点击放大，或聚焦后按 Enter／空格打开；Esc、关闭按钮或蒙版收起。封面和链接、按钮内部的图片不参与这个预览。放大使用浏览器已选择的图片源，不会自动下载更高清的原图，也不是相册切换。

不要因为运行过 `prepare-covers` 就认为所有正文图片都已压缩。该命令处理的是封面来源池、文章封面引用和碎片本地图片；普通文章正文中的 public 图片仍可能直接下载原文件。正文配图应选择适合展示的体积，尤其避免直接放入数 MB 的截图。

## 3. 设置文章封面

把 `cover.jpg` 放在文章旁边，然后在现有 frontmatter 中加入或修改：

```yaml
heroImage: ./cover.jpg
```

`heroImage` 可省略；使用时必须引用项目内的本地图片文件，不能直接填写 HTTPS 图片地址。不要把 `/images/cover.jpg` 当成这个字段的 public 网址写法，它与正文图片的路径规则不同。

如果希望集中管理新封面，可放到 `src/assets/blog/covers/originals/`。例如文章在 `src/content/blog/zh/my-first-post.md`，原图在 `src/assets/blog/covers/originals/my-cover.jpg`，则填写：

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

封面不会自动插入文章正文。它用于博客／标签列表和文章详情的封面区域；页面可能按布局裁切可见部分，但生成图片本身保持原比例，不会自动替你选择人物或主体焦点。

`new-post` 自动挑选封面时，只从 `src/assets/blog/default-covers/` 中选取，不会因为你把图片放入 `covers/originals/` 就自动选择它。新 originals 需要自己在文章中引用。

## 4. 在碎片中添加图片

`theme.fragments.enabled: false` 时，dev、build 和 prepare-covers／doctor 跳过碎片正文中的图片引用；仅由这些引用纳入处理的图片不再要求原图或派生文件存在。文章封面引用，以及 `src/assets/blog/default-covers/`、`src/assets/blog/covers/originals/` 两个来源池仍正常准备和校验，即使某张图只用于碎片。关闭不会删除文件，重新开启后恢复碎片图片准备与检查。

**版本说明：** 上述关闭后的图片隔离从 0.36.1 起提供，0.36.0 不包含；不要视为旧版本已有的行为。

将原图放到 `public/images/fragments/my-photo.png`，在已有碎片 Markdown 正文中写：

```md
![这条碎片的配图说明](/images/fragments/my-photo.png)
```

也可以将 `photo.png` 放在碎片文件旁边，用 `![配图说明](./photo.png)`。只往 public 目录放一张图不会触发通用图片库扫描，需要在实际碎片中引用它。

引用式图片同样支持：

```md
![配图说明][photo]

[photo]: /images/fragments/my-photo.png
```

需要手动尺寸时可以使用 HTML：

```html
<img src="/images/fragments/my-photo.png" alt="配图说明" width="640" height="360" />
```

这里的宽高是示例，实际使用时按自己图片的比例填写。支持的本地图片会补齐缺失的宽高；已有尺寸保留，只写一边时按源比例计算另一边。写错已有宽高不会被自动纠正。

碎片列表每页首图默认优先加载，其他图片和首页缩略图懒加载。首页只显示限高预览，超出部分裁切；它不是完整图片查看器，点卡片进入原碎片。创建碎片、稳定 ID 和评论设置见[发布碎片](/zh/blog/starter-guide-5-fragments/)。

## 5. 自动准备响应式文件

首次引用图片或替换原图后，在项目根目录运行本地开发服务：

```bash
npm run dev
```

dev 会准备缺失或过期的文件，相关源文件和引用变化也会触发更新。正常 `npm run build` 和 `npm run doctor`（包括 CI 环境）同样先准备；doctor 随后执行检查和构建。如果只想准备图片，不启动页面或完整检查，可以在停止 dev 后运行：

```bash
npx @anglefeint/astro-theme prepare-covers
```

只检查现有文件、不补生成时使用：

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

不必每次重复编码所有图片。准备流程根据原图、处理规则和输出文件的哈希判断是否可复用；原图改变会更新其派生文件，单份缺失或被修改时只修复需要的部分。不要手工改清单、改生成文件名或把生成网址写回文章。

当前准备规则是：

- 静态栅格图片生成 WebP，质量参数为 80；这是有损编码目标，不保证无损像素。
- 候选宽度为 400、640、800、960、1200px；根据原图宽度保留适用尺寸，必要时补入不超过 1200px 的源宽，不放大小图。
- 按 EXIF 方向转正，保持原始比例，不生成不同构图的裁剪版本。
- SVG 和多帧动画保留原格式，不转成静态 WebP。单帧 GIF 可以按静态图片处理，不能单凭扩展名判断是否保留。
- 默认封面池、originals 池和实际引用定义处理范围；不会把 public 中所有图片都转换一遍。

浏览器根据页面的 `srcset`、`sizes`、屏幕及像素密度选择候选，不需要用户维护多尺寸目录。最大候选为 1200px，因此不保证大屏高像素密度下始终使用原图级细节。

## 6. 提交哪些文件，部署时做什么？

准备后，相关文件位于：

```text
src/assets/blog/covers/
  originals/      # 如果使用这个原图目录
  manifest.json  # 来源、尺寸、规则与输出哈希
  generated/     # 持久响应式文件
```

把以下内容一起提交到 Git：

1. 文章或碎片 Markdown，以及新增或替换的原图。
2. 整个 `src/assets/blog/covers/`，包括清单和生成文件。

原图如果放在 public 或文章旁边，也要提交对应位置的文件，不要只提交 originals。即使清单目录叫 blog/covers，碎片派生文件也保存在这里。

发布前停止 dev，运行本地 `npm run doctor`；成功后可以运行 `npm run preview` 查看构建结果。doctor 已包含构建，无需紧接着再运行 build。托管平台仍使用 `npm run build`、输出目录 `dist`，部署其中全部文件。

**正常构建会复用有效文件，并自动补齐缺失、过期或损坏的派生图片。** 本地与部署环境采用相同规则，不依赖部署平台保留 Astro 图片缓存。原图必须存在且路径合法；丢失的原图、无法解码的图片和越界路径仍会使构建失败。显式 `prepare-covers --check` 与配置同步保持只读校验；构建不会替你提交 Git。

当前使用的派生文件会复制到构建产物的 `_blog-covers/`。不要只上传 HTML 或遗漏这个目录。旧版本、不再使用的 generated 文件不会自动删除；清理前先确认引用，避免删除仍需要的原图。

图片字段的区别可查[文章 heroImage／ogImage](/zh/blog/config-article/#frontmatter)与[碎片预览规则](/zh/blog/config-fragments/#preview-and-links)。

## 7. 分享链接时显示哪张图？

分享图是链接卡片使用的预览，不等于页面里的封面。

默认情况下，文章会在构建时生成 1200×630 PNG，包含文章标题、作者和站点名称，无需图片服务或浏览器生成。修改这些信息后重新构建和部署。`theme.footer.showCredits` 也控制自动分享图中的主题署名，不改变你上传的自定义图片。

### 为一篇文章指定分享图

把 `share.png` 放在文章旁边，在 frontmatter 填写：

```yaml
ogImage: ./share.png
```

或把文件放到 `public/images/share.png`，使用 `ogImage: /images/share.png`。这个字段也支持 HTTPS 图片直链。相对本地图会由文章图片 schema 处理，public 路径会检查文件是否存在；外链可用性取决于对方服务器。

### 为没有专属图片的页面设置默认图

在 `src/site.config.ts` 现有的顶层 `site` 中合并：

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

先将文件放到 `public/images/site-share.jpg`。`site.ogImage` 也支持 HTTPS 图片地址；省略或留空使用主题内置的 1200×630 默认图。这里不能使用文章相对路径。

当前优先级为：

1. 文章明确填写的 `ogImage`。
2. 开启自动生成时的文章分享图。
3. 关闭 `theme.socialImage.enabled` 后的文章 `heroImage`。
4. 页面没有专属图片时的 `site.ogImage`，最后是主题内置默认图。

因此只改 `site.ogImage` 不会替换文章自动分享图。Fragments 页面和它的各条 `#ID` 链接共用站点默认分享图，不会为每条碎片单独生成卡片。

自动分享图在 `dist/_social/` 中。分享平台抓取的是已部署页面的元信息，可能缓存旧图；本地看到新图不代表平台预览会立即刷新。

## 8. 图片不对时，按这里排查

| 现象                                      | 先检查什么                                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 图片不显示                                | 文件是否存在、大小写是否一致、相对路径是否从当前 Markdown 出发；public 网址不要带 `public`          |
| 封面准备失败                              | `heroImage` 是否是项目内本地文件，是否误写为外链或 public 网址；完整错误见终端                      |
| 提示 missing／stale／modified derivatives | 只读 --check 遇到此提示时先运行 prepare-covers 或正常 build；若仍失败，检查原图、路径与输出目录权限 |
| 放进 public 却没有生成尺寸                | 是否在碎片正文实际引用；普通文章正文 public 图片不属于这套派生扫描                                  |
| GIF 或 SVG 仍然很大                       | 多帧／矢量保留原文件，准备命令不会替你转视频或压缩动画                                              |
| 远程碎片图片很慢或跳动                    | 外链不参与本地转换，主题不能自动推断远程尺寸；自行优化源图并填写正确宽高                            |
| 本地有图，发布后没有                      | 原图和 generated 是否提交，部署是否包含整个 dist，资源路径是否被改写                                |
| 分享图仍旧                                | 是否重新构建并部署，文章专属图是否优先于站点默认图，以及分享平台是否缓存                            |

如果自定义了 Astro 的 srcDir、publicDir 或带 base 的源路径，用该项目配置下的 dev 准备；独立 prepare-covers 命令使用默认目录。图片处理支持部分 base 路径，并不代表整个主题已支持任意子目录部署。

需要安装或升级主题时，参见[安装博客，换成自己的信息](/zh/blog/starter-guide-1-configure-your-site/)；文章字段和正文写法见[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)。

## 教程导航与配置查阅

[上一篇：写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/) · [下一篇：发布一条碎片](/zh/blog/starter-guide-5-fragments/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[文章封面与分享图](/zh/blog/config-article/)、[碎片图片预览](/zh/blog/config-fragments/)、[站点默认分享图](/zh/blog/config-site-chrome/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
