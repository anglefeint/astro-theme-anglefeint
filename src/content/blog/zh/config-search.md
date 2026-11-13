---
tags: ['anglefeint', 'config']
title: '配置字典：搜索与内容发现'
subtitle: '搜索入口、文章收录、语言索引与其他内容入口。'
description: '以实际代码说明站内搜索配置、文案和单篇收录规则，区分搜索、最新文章、相关文章、标签、RSS 与机器阅读出口。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

先写文章可读[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)，本地预览和部署见[发布教程](/zh/blog/starter-guide-deployment/)。配置位置与安装见[第一篇教程](/zh/blog/starter-guide-1-configure-your-site/)，其他模块从[配置字典总入口](/zh/blog/config-reference/)进入。

本篇区分两件事：搜索框从构建生成的索引检索文章；首页最新文章、标签、文章底部推荐和 RSS 等是其他内容入口，不由搜索开关统一控制。默认值来自主题包，不是 demo 的覆盖值。

<a id="enabled"></a>

## theme.search.enabled：全站搜索开关

- **类型 / 默认值：** boolean / true。
- **状态与作用：** 生效。公共页头显示搜索入口，参与搜索的文章输出索引标记，构建完成后生成静态 Pagefind 资源。
- **限制：** false 同时关闭标准页头入口和本次构建的索引生成；单篇 search: true 不能越过全局关闭状态。关闭不等于删除文章、禁用搜索引擎收录或清除托管平台以前部署的索引文件。
- **示例：** theme: { search: { enabled: false } }。

这是唯一的 theme.search 公开叶子字段。没有公开的搜索服务地址、API key、索引目录、结果排序、关键词权重或跨语言检索开关。主题当前使用构建期 Pagefind，部署后不需要单独运行搜索后端。

<a id="article-search"></a>

## 单篇 search：不是 site.config 字段

| 位置                                                        | 类型 / 默认值                                      | 状态、作用与限制                                                                                                | 示例          |
| ----------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| `src/content/blog/<语言>/某篇文章.md` 的 frontmatter.search | boolean，可省略 / schema 未设置，文章布局默认 true | 条件生效：全局搜索开启时决定是否输出该篇索引根标记；false 不影响列表、相关文章、RSS、机器阅读出口或公开文章地址 | search: false |

只排除这篇文章的站内搜索收录，可以在已有 frontmatter 中添加：

```yaml
search: false
```

不要把它写成 theme.search: false，或在 site.config 顶层新增 search: false。也不要把 frontmatter.search 当作私密文章开关。当前没有 draft 或未来发布日期过滤；未公开内容应放在内容集合之外。完整文章字段见[文章字典](/zh/blog/config-article/#frontmatter)。

### 哪些内容进入索引？

标准文章布局在全局与单篇开关同时允许时输出 data-anglefeint-search 根标记。当前明确标记的正文区域包含文章标题、可见副标题和正文；与副标题相同的 context 只按副标题位置处理一次，不是单独给所有 context 建字段索引。

导航、播放器、页脚、评论和相关文章不作为文章正文一起收录。frontmatter.description 不是此搜索 UI 直接使用的结果摘要，标签也不是可配置的搜索过滤器；搜索结果使用 Pagefind 返回的标题元数据与正文摘要。只出现在图片像素、视频或音频中的文字不会被主题做 OCR 或转写。

默认 About、Fragments、Decoder、首页和列表没有文章索引根标记，不因搜索开关开启而自动成为搜索结果。自定义页面需要自己遵守索引标记约定；这不是添加一个不存在的 site.config 字段就能启用的功能。

<a id="messages"></a>

## messages.search：十一项搜索文案

完整前缀是 `i18n.locales.<语言>.messages.search.`。以下均为可省略的 string，默认取内置当前语言文案与语言回退链。表中只列中文 / 英文默认值；每行示例是字段值。所有字段条件生效：搜索入口存在且对应界面或状态出现时使用。

| 字段          | 中文 / 英文默认值                                                                                                                    | 作用、限制与占位符                                                                   | 示例值                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------- |
| `label`       | 搜索 / Search                                                                                                                        | 搜索入口按钮的无障碍名称、提示及弹窗标题；不是要搜索的关键字                         | `"搜索文章"`                        |
| `close`       | 关闭搜索 / Close search                                                                                                              | 关闭按钮的无障碍名称和提示；可见 esc 提示及图标由实现固定                            | `"关闭搜索"`                        |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | 搜索框占位文字及其无障碍标签；不预填关键字                                           | `"输入文章关键词"`                  |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | 生产环境中没有输入关键字时的提示                                                     | `"搜索当前语言的文章。"`            |
| `loading`     | 正在搜索… / Searching…                                                                                                               | 正在检索或准备检索的提示，不改变延迟与资源加载策略                                   | `"正在查找…"`                       |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | 没有结果的提示；当前语言没有索引时也可能显示它                                       | `"没有找到相关文章。"`              |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | 索引清单、搜索模块或结果详情加载失败的提示；不用于生成构建错误                       | `"搜索暂时不可用，请重试。"`        |
| `retry`       | 重试 / Retry                                                                                                                         | 失败状态的重试按钮文字；点击会重试加载搜索引擎，不会在浏览器重建索引                 | `"重新加载"`                        |
| `more`        | 加载更多 / Load more                                                                                                                 | 还有未显示结果时的继续加载按钮；不改变每批数量                                       | `"更多结果"`                        |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | 有结果时的数量提示；保留字面占位符 {count}，脚本替换第一个该占位符，不是已展示卡片数 | `"共找到 {count} 篇文章"`           |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | dev 模式提示，开发时不执行真实检索；不能靠改文字生成索引                             | `"请构建后在 preview 中测试搜索。"` |

文案按文本输出，不执行配置里的 HTML。空字符串会覆盖文字，不会隐藏相应按钮；错误使用空字符串还可能让控件失去清楚的无障碍名称。results 的 {count} 不会自动附加到你自定义的句子中，想显示数字就保留一次占位符。

### 可合并的配置示例

合并到 src/site.config.ts 现有 defineThemeConfig({...})，保留 import、export 与其他个人配置，不重复创建 theme 或 i18n：

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    zh: {
      messages: {
        search: {
          label: '搜索文章',
          placeholder: '输入文章关键词',
          results: '共找到 {count} 篇文章',
          empty: '没有找到相关文章。',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## 语言、资源加载与结果展示

- 构建输出 pagefind/，包含语言清单 anglefeint.json 和 Pagefind 模块。浏览器打开搜索时才加载清单及搜索引擎；搜索 UI 脚本本身会随含入口的页面加载，不是整套搜索代码都等点击才下载。
- 资源路径自动包含 Astro 的 BASE_URL。只部署 HTML、漏传 pagefind/，或把路径错误重写成 HTML，可能导致加载失败；没有单独的 site.config 索引路径配置。
- 客户端先用文档 html lang 对照索引语言清单，比较时不区分大小写；当前语言没有索引则返回空结果，不切换到英文搜索。这里使用页面有效语言值，不是根据文案的回退语言查询文章。
- 输入约 200 毫秒后检索；中文输入法组合输入结束后再安排检索，提交表单可立即触发。空关键字不执行全文搜索。延迟不是配置字段，也不是请求远端 AI。
- 每批取最多 8 条结果详情，再由“更多”继续加载；没有 pageSize 配置。数量提示使用找到的结果总数，不是当前批次条数。结果只保留同源链接，摘要只保留文本和关键词 mark 高亮，不渲染文章里的任意 HTML。
- 结果顺序由 Pagefind 返回；没有主题级排序或推荐算法参数。普通翻译回退不会把另一语言的文章补入结果。

语言元数据、启停和回退见[语言字典](/zh/blog/config-languages/#meta)。search 文案只改变界面，不会生成对应语言文章或改变索引语言。

<a id="preview"></a>

## 为什么 dev 中没有真实搜索？

索引在 Astro 构建结束后生成，npm run dev 不执行这一步。开发环境会显示 messages.search.dev 提示；即使输入关键词也不会真正检索。这是当前行为，不是搜索失效或少填配置。

准备好内容后，在本地运行：

```bash
npm run build
npm run preview
```

preview 使用构建产物；编辑文章、语言元数据、单篇收录开关或站点路径后，想检验新索引需要重新构建。正式站点要一起部署网页与 pagefind 资源。开着 dev 修改文案不等于线上索引已经更新。

没有可索引文章时仍会生成可识别的空语言清单，UI 可以显示空结果。构建期索引失败会报错，不会默默发布一个伪造的成功索引。重试按钮只重试读取已有资源，不能在访客浏览器中修复构建或生成缺失文章。

<a id="discovery"></a>

## 其他内容发现入口使用哪些配置？

下面沿用各模块已有字段与默认值；主说明仍在原字典，不新增另一套搜索配置。

| 配置路径或位置                                  | 类型 / 默认值                           | 实际作用与限制、示例                                                                                    | 详细说明                                              |
| ----------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| theme.homeLatestCount                           | number / 3                              | 首页最新文章数量；如 theme: { homeLatestCount: 5 }。不改变搜索结果批次或文章底部相关文章数量            | [首页数量](/zh/blog/config-home/#latest-count)        |
| theme.blogPageSize                              | number / 10                             | Blog List 与标签文章列表每页数量；如 theme: { blogPageSize: 8 }。不是搜索结果数量                       | [列表分页](/zh/blog/config-blog-list/#page-size)      |
| theme.tags.enabled                              | boolean / true                          | 标签入口与标准标签页；如 theme: { tags: { enabled: false } }。关闭不删除文章 tags，也不关闭站内全文搜索 | [标签开关](/zh/blog/config-blog-list/#tags-enabled)   |
| 文章 frontmatter.tags                           | string[]，可省略 / 未设置               | 用于标签归档与页面标签显示；例值 ['Astro', '随笔']。不参与当前“相关文章”的相关度计算，也不是搜索白名单  | [文章字段](/zh/blog/config-article/#frontmatter)      |
| `i18n.locales.<语言>.messages.blog.related`     | string / 内置当前语言，中文与英文见下表 | 文章底部相关文章标题，只改文案；例值 '继续阅读'                                                         | [文章文案](/zh/blog/config-article/#article-messages) |
| `i18n.locales.<语言>.messages.blog.relatedAria` | string / 内置当前语言，中文与英文见下表 | 相关文章区域无障碍名称；例值 '其他文章'                                                                 | [文章文案](/zh/blog/config-article/#article-messages) |

相关文章实际选取当前语言中排除自身后的最新三篇，不依据共同标签、canonicalTopic 或内容相似度。没有独立 relatedCount、相关文章开关或手动推荐名单的 site.config 字段；没有其他文章时不显示该区域。search: false 的文章仍可能被推荐。

| 文案                      | 中文 / 英文默认值        |
| ------------------------- | ------------------------ |
| messages.blog.related     | 相关文章 / Related       |
| messages.blog.relatedAria | 相关文章 / Related posts |

<a id="public-outputs"></a>

## RSS、SEO 和机器阅读出口不是站内搜索

| 入口                 | 当前行为及配置关系                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<语言>/rss.xml`    | 每个启用语言的文章摘要订阅；标题使用全站名称，描述使用该语言 messages.blog.archiveDescription。条目来自该语言文章的 title、description、pubDate 与公开路径；不因单篇 search: false 排除，也不是全文 RSS。没有 theme.search 内的 RSS 开关 |
| 页面元信息与搜索引擎 | 与站内搜索索引是不同输出；search: false 不自动添加 noindex 或关闭 sitemap，不能用它控制互联网搜索引擎抓取                                                                                                                                |
| 公开机器阅读文本     | 文章、About、Fragments 等有自己的导出管线，不依赖 Pagefind 收录；语言级公开补充见[语言字典](/zh/blog/config-languages/#ai-context)。search: false 不作为这些产物的私密过滤器                                                             |

站点名称、域名和订阅描述应填写真实值；部署与公开地址见[发布教程](/zh/blog/starter-guide-deployment/)，RSS 使用的 archiveDescription 见[列表文案](/zh/blog/config-blog-list/#archive-messages)。不要把“站内没有结果”理解成“网站没有公开这个内容”。

当前全局搜索开关、单篇 search 和十一项搜索文案都有消费位置，没有需要填写的旧搜索兼容字段。canonicalTopic 等当前不消费的文章字段，也不会因为放在搜索附近就自动成为索引分类；相关状态见[文章字典](/zh/blog/config-article/#legacy-frontmatter)。没有公开的跨语言合并搜索、图片 OCR、搜索词分析、搜索结果权重或新增索引类型设置。

返回[配置字典总入口](/zh/blog/config-reference/)查其他模块。
