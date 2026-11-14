# Theme Preview Images

## Promotional gallery

Five AI-composed promotional images based on real demo screenshots form the promotional gallery. The first four were created with the built-in image-generation tool on 2026-11-05; the Fragments companion was added on 2026-11-14 using the current local screenshot and existing promotional artwork as composition references. They are marketing compositions, rather than unmodified browser captures. Each is a 1600×900 (16:9) JPEG; together they total 1,341,914 bytes. All nine READMEs retain the original brand hero and directly display all five promotional images followed by the full browser screenshot gallery, without folding the screenshots.

| File                  | Content                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `promo-overview.jpg`  | Matrix Home, Cyberpunk archive, Hacker About and AI article overview                            |
| `promo-cyberpunk.jpg` | Cards and List archive layouts                                                                  |
| `promo-hacker.jpg`    | About, Decoder Lab and cypherpunk resources                                                     |
| `promo-ai.jpg`        | AI reading, Markdown exports and GEO                                                            |
| `promo-fragments.jpg` | Fragments feed, brief notes, volcanic world and orbital deck in a Brood War-inspired atmosphere |

`promo-fragments.jpg` presents the real Fragments feed in a cinematic product composition with the volcanic world, orbital deck and temple-framed notes. The current v2 replaces the green Matrix content image inside the featured card with a dark orbital vista so the promotional artwork contains no code rain. This is an illustration edit for the marketing composition, not a runtime content change. Its original PNG and complete generation prompt are archived in `design/fragments-promo-v2/`; the first version is retained in `design/fragments-promo-v1/`. The project-bound export uses JPEG quality 90. The built-in image-generation tool produced the composition, and Sharp only resized/encoded the final export. This artwork does not modify the runtime page or replace the unmodified `preview-fragments.jpg` capture.

The original `anglefeint-brand.webp` remains the README hero. Temporary generation records and upload ZIPs are not distributed with starter.

## Browser screenshots

The gallery contains ten screenshots: nine from the public English demo and one from the current local English Fragments page, with no account/profile UI or browser chrome. On 2026-11-05, Home, Cards, pagination, article and About screenshots were refreshed, and List and Decoder resources were added using the built-in browser. Related posts and the Decoder workbench retain their 2026-11-04 captures. The cinematic brand artwork remains unchanged. All nine localized READMEs share these JPG assets.

| File                               | Actual view                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `preview-home.jpg`                 | Matrix homepage, settled intro and minimized player                                                                        |
| `preview-blog-list.jpg`            | Full-width leading cover, three-column Cards, clipped corners and view control                                             |
| `preview-blog-list-mode.jpg`       | List view with range/total, continuous numbering, linked tags and numeric dates                                            |
| `preview-blog-list-pagination.jpg` | Final archive cards, pagination and footer                                                                                 |
| `preview-blog-post.jpg`            | Guide 1 author byline, dates, cover, OUTPUT, tags, prose and contents rail                                                 |
| `preview-blog-post-related.jpg`    | Community welcome article's Related section aligned with the reading panel                                                 |
| `preview-about.jpg`                | About sections, diagonal contents frame, tools and highlighted Contact                                                     |
| `preview-decoder.jpg`              | Successful local Base64 decoding with non-personal demonstration text                                                      |
| `preview-decoder-resources.jpg`    | Cypherpunk tribute and all sixteen resource cards with clipped corners                                                     |
| `preview-fragments.jpg`            | StarCraft: Brood War-inspired Fragments, volcanic planet, orbital deck, transparent temple frames and compact music player |

The Fragments screenshot was added on 2026-11-14 from `http://127.0.0.1:4323/en/fragments/`, with explicit user approval limited to this preview capture. It is a native 1920×1080 JPEG (quality 90), without modifying page content or styles; no Giscus dialog was opened and no browser regression suite was run. It shows local work that is not yet published to the public demo. The asset is listed in `scripts/starter-manifest.mjs` and shared by all nine README translations.

Other screenshot sources: https://demo.anglefeint.com/en/ and its linked English pages. Captured with a 1920×1080 desktop viewport to show the independent contents rails and homepage terminal; the browser exports scrollable pages at 1905×1072 and the homepage at 1920×1080. The Decoder resources image is a 1905×640 crop of a full-page capture, beginning at the tribute and retaining all sixteen cards. Do not upscale images or alter the page for capture. Other images use the browser's native JPEG output; the resource crop is JPEG quality 90. Old PNG versions are retired through the starter manifest. `preview-about-modal.png` is an older optional asset, not part of the current README gallery.

Capture real UI states; do not edit page content/styles just for screenshots. Wait for fonts, headings and decoding to settle. Keep decorative motion enabled, use only public demo content, and inspect each resulting image before delivery.
