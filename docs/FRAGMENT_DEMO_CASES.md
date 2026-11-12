---
doc_id: fragment_demo_edge_cases
doc_role: reference
doc_purpose: Inventory of bilingual demo Fragments for manual review of rich previews and pagination.
doc_scope: [visual-system, validation]
update_triggers: [visual-change, validation-change]
source_of_truth: false
depends_on: [docs/fragment-demo-cases.json, docs/VALIDATION_POLICY.md]
---

# Fragment demo edge cases

中文和英文各新增 24 条，ID 与发布时间跨语言一致，原有碎片保留。每条采用随机八位字母数字 ID；这是有明确覆盖目标的验看样例，不是运行时随机内容。

首页最近三条依次为无说明图片、纯代码、图文代码混排。默认每页 20 条时，这两个语言各有 37 条碎片，共两页；第 21–24 个新样例位于第二页。其他语言保持现有内容。

图片均来自本地：已有 Matrix 封面、已批准的像素人物，以及用于尺寸检查的竖图/横图 SVG。Markdown 本地资源和 public 图片各有样例。代码中看似 script/HTML 的内容均在代码块中，作为文字展示；不添加实际执行脚本或故意失效的图片地址。

| 编号 | 案例                     | English                             | 稳定 ID    | 中文源文件                                                                           |
| ---- | ------------------------ | ----------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| 01   | 无说明图片               | Image only, no alt text             | `Wkig4mJ0` | [edge-01-image-only.md](../src/content/fragments/zh/edge-01-image-only.md)           |
| 02   | 纯代码与缩进             | Code only, with indentation         | `xpZn3yIu` | [edge-02-code-only.md](../src/content/fragments/zh/edge-02-code-only.md)             |
| 03   | 文字、图片和代码         | Text, image and code                | `pJ4FPf5l` | [edge-03-mixed.md](../src/content/fragments/zh/edge-03-mixed.md)                     |
| 04   | 带说明文字的图片         | Image with descriptive alt text     | `hBB5WHXT` | [edge-04-image-alt.md](../src/content/fragments/zh/edge-04-image-alt.md)             |
| 05   | 文章目录外的本地图片     | Local Markdown asset                | `2xotX9gB` | [edge-05-local-image.md](../src/content/fragments/zh/edge-05-local-image.md)         |
| 06   | 引用式图片               | Reference-style image               | `1mm1Y5Rd` | [edge-06-reference-image.md](../src/content/fragments/zh/edge-06-reference-image.md) |
| 07   | HTML 图片                | Raw HTML image                      | `YJes9cJp` | [edge-07-html-image.md](../src/content/fragments/zh/edge-07-html-image.md)           |
| 08   | 很高的竖图               | Very tall portrait image            | `MtwRQj7A` | [edge-08-portrait-image.md](../src/content/fragments/zh/edge-08-portrait-image.md)   |
| 09   | 很宽的横图               | Very wide panorama                  | `rs2uYZYd` | [edge-09-panorama-image.md](../src/content/fragments/zh/edge-09-panorama-image.md)   |
| 10   | 同一条里的三张图片       | Three images in one note            | `YOC2u7Pf` | [edge-10-multiple-images.md](../src/content/fragments/zh/edge-10-multiple-images.md) |
| 11   | 行内代码与普通文字       | Inline code and prose               | `SulBpH9Q` | [edge-11-inline-code.md](../src/content/fragments/zh/edge-11-inline-code.md)         |
| 12   | HTML 代码块              | Raw HTML code block                 | `6PwXkBws` | [edge-12-html-code.md](../src/content/fragments/zh/edge-12-html-code.md)             |
| 13   | Shell 与反斜杠           | Shell and backslashes               | `7o2DpV8P` | [edge-13-shell-code.md](../src/content/fragments/zh/edge-13-shell-code.md)           |
| 14   | 没有空格的一整行代码     | One very long code line             | `4f1Ze0Bw` | [edge-14-long-code-line.md](../src/content/fragments/zh/edge-14-long-code-line.md)   |
| 15   | 二十八行代码             | Twenty-eight code lines             | `0jT4ww3w` | [edge-15-many-code-lines.md](../src/content/fragments/zh/edge-15-many-code-lines.md) |
| 16   | 看起来像 HTML 的代码文本 | HTML-looking code as text           | `DcEbdUAs` | [edge-16-escaped-code.md](../src/content/fragments/zh/edge-16-escaped-code.md)       |
| 17   | 中英混排、表情和组合字符 | CJK, emoji and combining characters | `fUOtZMdb` | [edge-17-unicode.md](../src/content/fragments/zh/edge-17-unicode.md)                 |
| 18   | 长链接与长标记           | Long URLs and unbroken tokens       | `AJw3KdLq` | [edge-18-long-url.md](../src/content/fragments/zh/edge-18-long-url.md)               |
| 19   | 引用、强调和链接         | Quote, emphasis and links           | `h0nm1mFe` | [edge-19-quote-links.md](../src/content/fragments/zh/edge-19-quote-links.md)         |
| 20   | 嵌套列表                 | Nested lists                        | `Y4bP1pA2` | [edge-20-nested-list.md](../src/content/fragments/zh/edge-20-nested-list.md)         |
| 21   | 小表格                   | A small table                       | `fTcsGkig` | [edge-21-table.md](../src/content/fragments/zh/edge-21-table.md)                     |
| 22   | 超长标题                 | Very long title                     | `5LgVi9W6` | [edge-22-long-title.md](../src/content/fragments/zh/edge-22-long-title.md)           |
| 23   | 无标题，单个表情         | No title, one emoji                 | `B0qJrJgS` | [edge-23-minimal.md](../src/content/fragments/zh/edge-23-minimal.md)                 |
| 24   | 同一时间的另一条记录     | Another note at the same timestamp  | `raJ0dHdx` | [edge-24-same-time.md](../src/content/fragments/zh/edge-24-same-time.md)             |

## 验看重点

- 首页窗口：前三条图片/代码/混合预览、无 alt 图片、整体滚动、点击进入原碎片、底部预览数/总数。
- Feed 第一页：引用式图片、相对本地图片、HTML 图片、横竖图、多图、HTML/围栏代码、长代码、长链接、嵌套列表。
- Feed 第二页：表格、很长的标题、无标题短内容、相同时间但不同 ID 的记录。
- 分享定位：使用 /zh/fragments/#ID 或 /en/fragments/#ID，第二页的 ID 应经现有索引定位到正确页。
- 小屏：长标题、长标记、代码和大尺寸图片不应把页面或浮层撑宽。

浏览器、交互与视觉回归由用户执行；添加这些样例不表示它们已通过浏览器验收。按当前 validation policy，agent 只选择相关的非浏览器技术检查。

这些是 main demo 内容，不在 starter manifest 的分发白名单内，不自动复制到消费者项目。完整机器可读清单位于 [fragment-demo-cases.json](fragment-demo-cases.json)。

首页预览实现、分发归属与测试路径见 [架构映射](ARCHITECTURE.md#homepage-preview-ownership-0350)，动效和裁切规则见 [视觉系统](VISUAL_SYSTEMS.md)。首页新预览对应 0.35.0；实际交付状态见 [发布记录](releases/0.35.0.md)，这些样例不是浏览器验收凭证。
