---
tags: ['anglefeint', 'config']
title: '설정 사전: 글 상세 페이지'
subtitle: '전역 스위치, 글 필드, UI 문구를 구분하고 목차, 수식, 모니터, OUTPUT, 읽기 상호작용을 조회합니다.'
description: '글 상세 설정의 타입, 기본값, 역할, 제한과 frontmatter의 호환·현재 미사용 필드를 빠짐없이 설명합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**버전 안내:** 동작 줄이기의 실시간 반영과 작성자·공유 이미지 키의 일관성 수정은 0.36.1부터 제공하며 0.36.0에는 없습니다.

[설정 사전 시작 페이지로 돌아가기](/ko/blog/config-reference/). 먼저 위치를 구분하세요. 전역 기능·문구는 `src/site.config.ts`, 개별 제목·날짜·이미지·통계는 Markdown／MDX 위 frontmatter입니다. 서로 바꾸어 쓰지 마세요.

패키지 표준 글 라우트 기준입니다. 활성 언어에 글을 만들고 실제 콘텐츠에 따라 목차·통계·번역 링크·최대 세 다른 글을 제공합니다. BlogPost를 직접 호출하는 사용자 페이지는 필요한 인수를 전달해야 하며 모든 라우트 동작을 자동으로 갖지는 않습니다.

## 1. 사이트 전체 기능 스위치

<a id="feature-switches"></a>

site.config theme의 `boolean`이며 모두 기본 `true`입니다. 각 예시는 필요할 때 theme에 합치는 용도이지 전부 끄라는 권장이 아닙니다.

| 전체 경로                      | 역할·적용 조건                                                                    | 제한·예시                                                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | 컴파일러의 2·3단계 Markdown 제목으로 기본 목차를 표시하며 제목이 없으면 숨깁니다. | 개별 toc가 우선이며 컴포넌트·원시 HTML 제목은 제외입니다. 예: `toc: { enabled: false }`                                |
| `theme.math.enabled`           | Markdown／MDX 수식을 처리하고 실제 수학 표식이 있을 때 스타일을 넣습니다.         | 개별 math 없음, 잘못된 수식은 컴파일 실패이며 끄면 해석을 바꿉니다. 예: `math: { enabled: false }`                     |
| `theme.effects.enableRedQueen` | 글 옆 Red Queen 모니터                                                            | false도 배경 네트워크·표지 Canvas·전체 AI 분위기는 유지합니다. 예: `effects: { enableRedQueen: false }`                |
| `theme.search.enabled`         | 검색 입구·인덱스 생성입니다. [검색 사전](/ko/blog/config-search/#enabled) 참조    | 개별 false는 제외하지만 true가 전역 꺼짐을 우회하지 못합니다. 예: `search: { enabled: false }`                         |
| `theme.tags.enabled`           | 글 태그 링크·디렉터리·목록                                                        | false도 tags는 유지합니다. 예: `tags: { enabled: false }`. [목록 사전](/ko/blog/config-blog-list/#tags-enabled) 참조   |
| `theme.socialImage.enabled`    | ogImage 없는 글에 1200×630 공유 이미지 생성                                       | false도 수동 이미지는 유지하고 표지·전역으로 대체합니다. 표지 숨기기가 아닙니다. 예: `socialImage: { enabled: false }` |

모두 콘텐츠·영역·우선순위에 따른 조건부 적용입니다. 기본 목차만 끄는 예시입니다.

```ts
theme: { toc: { enabled: false } },
```

3단계는 2단계 아래 중첩하며 독립 3단계도 항목이 됩니다. 4단계 이하는 제외입니다. 본문은 바로 나타나며 목차 로드를 기다리지 않습니다.

## 2. 작성자·크레딧·공유 이미지·댓글의 연결 설정

<a id="shared-controls"></a>

공통 모듈의 글 영향만 설명합니다.

| 전체 경로                  | 글 영향                                                                            | 주 설명                                                         |
| -------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `site.author`              | 개별 author가 없거나 공백이면 대체하며 공유 이미지에도 사용합니다.                 | [사이트 정체성](/ko/blog/config-site-chrome/#identity)          |
| `theme.enableAboutPage`    | 켜져 있고 글 작성자가 사이트 작성자와 같으면 해당 About 링크, 아니면 텍스트입니다. | [About 스위치](/ko/blog/config-about/#page-enabled)             |
| `theme.footer.showCredits` | 자동 공유 이미지 크레딧이며 사용자 이미지는 유지합니다.                            | [푸터](/ko/blog/config-site-chrome/#footer)                     |
| `site.ogImage`             | 상위 이미지 없는 페이지의 대체 이미지                                              | [정체성·이미지 우선순위](/ko/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | 연결·매핑도 유효해야 합니다. 개별 frontmatter 스위치는 없습니다.                   | [Giscus 댓글](/ko/blog/config-comments/#controls)               |

## 3. 개별 글 필드: site.config에 넣지 마세요

<a id="frontmatter"></a>

frontmatter 전체 22개이며 site.config에 추가되는 것이 아닙니다. 작성자 입력 기준으로 타입을 설명하며 날짜는 Date, 로컬 이미지는 메타데이터로 해석합니다.

### 콘텐츠·메타 정보

| 필드          | 타입·기본 동작                             | 역할·제한·예시                                                                                        |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `title`       | 필수 string, 기본 없음                     | 글 제목·메타 정보이며 사이트 이름은 아닙니다. 예: `title: '我的笔记'`                                 |
| `description` | 필수 string, 기본 없음                     | 메타 설명이며 context 없을 때 맥락입니다. 전체 본문이 아닙니다. 예: `description: '一次调试的记录。'` |
| `pubDate`     | 필수 해석 가능 날짜, 기본 없음             | 게시일·목록·메타입니다. UTC 표시이며 미래도 숨기지 않습니다. 예: `pubDate: '2026-11-13'`              |
| `updatedDate` | 선택 날짜, 미설정                          | 수정일·sitemap 우선이며 pubDate 정렬을 대체하지 않습니다. 예: `updatedDate: '2026-11-14'`             |
| `author`      | 선택 string, 없거나 공백이면 사이트 작성자 | 작성자 페이지는 만들지 않습니다. 예: `author: '另一位作者'`                                           |
| `subtitle`    | 선택 string, 미설정                        | 부제이며 맥락과 같으면 중복 표시하지 않습니다. 예: `subtitle: '从现象到定位'`                         |
| `context`     | 선택 string, 생략하면 description          | 제목 아래 맥락입니다. 빈 값은 행만 숨깁니다. 예: `context: '解决一个具体问题。'`                      |
| `tags`        | 선택 string 배열, 없으면 항목 없음         | 전역 스위치도 따릅니다. 예: `tags: ['astro', '笔记']`                                                 |
| `heroImage`   | 선택 로컬 이미지 경로, 없으면 표지 없음    | 원격·public URL 규칙은 아닙니다. 파일을 먼저 넣으세요. 예: `heroImage: ./cover.jpg`                   |
| `ogImage`     | 선택 로컬·public·HTTPS, 생략은 공유 대체   | 본문 표지를 바꾸지 않습니다. 파일을 먼저 넣으세요. 예: `ogImage: /images/share.png`                   |
| `toc`         | 선택 boolean, 전역 상속                    | true도 제목이 없으면 안 나옵니다. 예: `toc: false`                                                    |
| `search`      | 선택 boolean, 기본 true                    | false는 검색만 제외하며 글·RSS·sitemap·AI는 공개입니다. 예: `search: false`                           |

처음에는 필수만 쓰고 필요하면 보충하세요.

```yaml
---
title: '我的笔记'
description: '一次调试的记录。'
pubDate: '2026-11-13'
subtitle: '从现象到定位'
context: '解决一个具体问题。'
tags: ['astro', '笔记']
toc: true
search: true
---
```

초안, 예약 게시, 개별 comments·Red Queen·수식 스위치는 없습니다. 미완성은 콘텐츠 밖에 두고 미지원 필드를 비공개 제어로 쓰지 마세요.

<a id="output-fields"></a>

### OUTPUT 통계·상태

| 필드         | 타입·기본 동작                                                | 역할·제한·예시                                                               |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `wordCount`  | 선택 비음수 정수, 기본 소스 텍스트 계산                       | 독립 덮어쓰기이며 tokenCount는 유지합니다. 예: `wordCount: 800`              |
| `tokenCount` | 선택 비음수 정수, 기본 round(max(자동 단어·문자 수, 1) × 1.3) | 모델 토크나이저·실사용이 아닌 추정입니다. 예: `tokenCount: 1040`             |
| `aiModel`    | 선택 string, 없으면 라벨 없음                                 | 제목·OUTPUT이며 실제 모델 검증은 없습니다. 예: `aiModel: '作者填写的模型名'` |
| `aiMode`     | 선택 string, 없으면 라벨 없음                                 | 모드 문구만 표시하며 작업은 실행하지 않습니다. 예: `aiMode: 'notes'`         |
| `aiState`    | 선택 string, 없으면 라벨 없음                                 | 상태 문구만 표시하며 서비스 검사는 없습니다. 예: `aiState: 'edited'`         |

일부 Markdown·코드·링크를 제거하고 CJK 한자·가나·한글은 문자별, 나머지는 주로 공백으로 셉니다. 수식·MDX가 추정에 영향을 줄 수 있습니다. wordCount만 입력해도 tokenCount는 재계산하지 않습니다. 1,000 이상은 소수 한 자리 k로 표시하며 원값은 유지합니다.

```yaml
wordCount: 800
tokenCount: 1040
aiModel: '作者填写的模型名'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### 호환·현재 미사용 필드

| 필드             | 타입·기본값              | 상태·제한·예시                                                                                                                                          |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | 선택 양의 정수, 미설정   | 호환 유지이며 읽기 시간은 안 보입니다. `readMinutes: 3`도 복원하지 않습니다.                                                                            |
| `aiLatencyMs`    | 선택 비음수 정수, 미설정 | 호환 유지이며 지연은 안 보입니다. `aiLatencyMs: 150`은 실제 측정도 아닙니다.                                                                            |
| `aiConfidence`   | 선택 0–1 number, 미설정  | 호환 유지이며 신뢰도는 안 보입니다. `aiConfidence: 0.9`는 정확성 평가가 아닙니다.                                                                       |
| `canonicalTopic` | 선택 string, 미설정      | 현재 미사용입니다. `canonicalTopic: 'astro'`는 주제·canonical을 만들지 않습니다.                                                                        |
| `sourceLinks`    | 선택 주소 배열, 미설정   | 검증·정규화만 합니다. HTTP(S), 프로토콜 없는 도메인에는 https입니다. `sourceLinks: ['https://example.com/']`는 자동 표시·본문 내보내기를 하지 않습니다. |

독자가 출처를 봐야 한다면 본문에 Markdown 링크를 쓰세요. 호환 데이터가 있다고 UI가 남아 있는 것은 아니며 업그레이드를 위해 원문을 지울 필요도 없습니다.

## 4. 글 UI 문구

<a id="article-messages"></a>

접두사는 `i18n.locales.<语言>.messages.blog`이며 선택적 string, 일반 문구 대체 규칙입니다. 표는 중국어 간체／영어 기본값과 blog 객체의 중국어 간체 단일 멤버 예시입니다. frontmatter가 아닙니다.

유효 문구는 해당 영역이 있어야 하는 조건부 적용입니다. 빈 문자열은 라벨만 비울 수 있고 기능을 숨기지 않습니다. 접근성 이름은 비우지 마세요. 미사용 필드는 효과가 없습니다.

| 필드                 | 중국어 간체 기본값 / 영어 기본값     | 역할·제한                                                   | 상태        | 중국어 간체 멤버 예시             |
| -------------------- | ------------------------------------ | ----------------------------------------------------------- | ----------- | --------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed            | Red Queen이 켜졌을 때 모니터 배지이며 실제 감시가 아닙니다. | 조건부 적용 | `rqBadge: "监视器信号"`           |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed | 모니터 재생 버튼 이름이며 자원·재생 전략은 안 바꿉니다.     | 조건부 적용 | `rqReplayAria: "重放监视器信号"`  |
| `backToTop`          | 返回顶部 / Back to top               | 스크롤 상태에 따른 맨 위로 버튼 이름입니다.                 | 조건부 적용 | `backToTop: "返回顶部"`           |
| `toastP10`           | 语境解析 10% / context parsed 10%    | 읽기 초기 안내이며 AI 요청 진행이 아닙니다.                 | 조건부 적용 | `toastP10: "语境解析 10%"`        |
| `toastP30`           | 语境解析 30% / context parsed 30%    | 읽기 진행 안내이며 의미 분석 결과가 아닙니다.               | 조건부 적용 | `toastP30: "语境解析 30%"`        |
| `toastP60`           | 推理稳定 60% / inference stable 60%  | 읽기 진행 안내이며 모델 추론 상태가 아닙니다.               | 조건부 적용 | `toastP60: "推理稳定 60%"`        |
| `toastDone`          | 输出完成 / output finalized          | 읽기 완료 안내이며 생성·검증 완료의 증거가 아닙니다.        | 조건부 적용 | `toastDone: "输出完成"`           |
| `metaPublished`      | 发布 / published                     | 게시일 앞 라벨이며 날짜는 안 바꿉니다.                      | 조건부 적용 | `metaPublished: "发布"`           |
| `metaAuthor`         | 作者 / by                            | 작성자 라벨이며 값은 안 바꿉니다.                           | 조건부 적용 | `metaAuthor: "作者"`              |
| `metaUpdated`        | 更新 / updated                       | updatedDate가 있을 때 수정일 라벨입니다.                    | 조건부 적용 | `metaUpdated: "更新"`             |
| `systemStatusAria`   | 模型状态 / Model status              | 상태 필드가 하나 이상일 때 제목 상태 영역 이름입니다.       | 조건부 적용 | `systemStatusAria: "模型状态"`    |
| `systemModelLabel`   | 模型 / model                         | aiModel이 있을 때 모델 라벨이며 OUTPUT에도 씁니다.          | 조건부 적용 | `systemModelLabel: "模型"`        |
| `systemModeLabel`    | 模式 / mode                          | aiMode가 있을 때 모드 라벨입니다.                           | 조건부 적용 | `systemModeLabel: "模式"`         |
| `systemStateLabel`   | 状态 / state                         | aiState가 있을 때 상태 라벨입니다.                          | 조건부 적용 | `systemStateLabel: "状态"`        |
| `promptContextLabel` | 语境 / Context                       | 비어 있지 않은 맥락 앞 라벨입니다.                          | 조건부 적용 | `promptContextLabel: "语境"`      |
| `heroMonitor`        | 神经监视器 / neural monitor          | heroImage가 있을 때 표지 모니터 문구입니다.                 | 조건부 적용 | `heroMonitor: "神经监视器"`       |
| `heroSignalSync`     | 信号同步中 / signal sync active      | 고정 장식 동기화 문구이며 실제 상태 조회가 아닙니다.        | 조건부 적용 | `heroSignalSync: "信号同步中"`    |
| `heroModelOnline`    | 模型在线 / model online              | 고정 장식 모델 문구이며 서비스 조회가 아닙니다.             | 조건부 적용 | `heroModelOnline: "模型在线"`     |
| `toc`                | 文章目录 / On this page              | 목차가 켜지고 제목이 있을 때 이름입니다.                    | 조건부 적용 | `toc: "文章目录"`                 |
| `responseOutput`     | 输出 / Output                        | 본문 OUTPUT 이름이며 본문을 제어하지 않습니다.              | 조건부 적용 | `responseOutput: "输出"`          |
| `statsWords`         | 词 / words                           | 단어·문자 수 라벨이며 값은 안 바꿉니다.                     | 조건부 적용 | `statsWords: "词"`                |
| `statsTokens`        | 令牌 / tokens                        | tokens 라벨이며 추정은 안 바꿉니다.                         | 조건부 적용 | `statsTokens: "令牌"`             |
| `copySectionLink`    | 复制本节链接 / Copy section link     | 본문 h2／h3 링크 복사 이름이며 앵커 알고리즘은 안 바꿉니다. | 조건부 적용 | `copySectionLink: "复制本节链接"` |
| `regenerate`         | 重播扫描 / Replay scan               | 스캔 재생 버튼 문구이며 시각 효과만 실행합니다.             | 조건부 적용 | `regenerate: "重播扫描"`          |
| `relatedAria`        | 相关文章 / Related posts             | 다른 글이 있을 때 관련 글 접근성 이름입니다.                | 조건부 적용 | `relatedAria: "相关文章"`         |
| `related`            | 相关文章 / Related                   | 관련 글 제목이며 알고리즘을 제어하지 않습니다.              | 조건부 적용 | `related: "相关文章"`             |
| `backToBlogAria`     | 返回博客 / Back to blog              | 블로그로 돌아가기의 접근성 이름입니다.                      | 조건부 적용 | `backToBlogAria: "返回博客"`      |
| `backToBlog`         | 返回博客 / Back to blog              | 블로그 링크의 가시 문구이며 목적지는 유지합니다.            | 조건부 적용 | `backToBlog: "返回博客"`          |
| `comments`           | 评论 / Comments                      | 유효한 글 댓글 설정이 있을 때 영역 이름입니다.              | 조건부 적용 | `comments: "评论"`                |
| `metaReadMinutes`    | 分钟阅读 / min read                  | 현재 미사용이며 읽기 시간을 복구하지 않습니다.              | 현재 미사용 | `metaReadMinutes: "分钟阅读"`     |
| `latencyLabel`       | 延迟估计 / latency est               | 현재 미사용이며 지연을 복구하지 않습니다.                   | 현재 미사용 | `latencyLabel: "延迟估计"`        |
| `confidenceLabel`    | 置信度 / confidence                  | 현재 미사용이며 신뢰도를 복구하지 않습니다.                 | 현재 미사용 | `confidenceLabel: "置信度"`       |

상태·표지·스크롤 안내는 분위기이며 실제 모델 온라인·동기화·정확도 검사가 아닙니다. regenerate는 스캔 효과만 재생하며 글을 쓰거나 AI를 요청하지 않습니다.

OUTPUT·절 링크 문구 예시입니다.

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          responseOutput: '正文',
          statsWords: '字词',
          statsTokens: '估算 tokens',
          copySectionLink: '复制这一节的网址',
          regenerate: '重播扫描效果',
        },
      },
    },
  },
},
```

돌아가기 목적지는 계속 현재 언어 목록입니다. 관련 글은 현재 글을 뺀 같은 언어 최신 최대 세 개이며 AI 유사도 추천이 아닙니다. 개수·유사도 설정도 없습니다. related／relatedAria는 문구·접근성 이름만 바꿉니다.

<a id="interaction-messages"></a>

### 코드 복사·이미지 미리보기 문구

접두사는 `i18n.locales.<语言>.messages`이며 선택적 string, 조건부 적용입니다. 복사 권한·이미지 출처를 바꾸거나 기능 스위치를 추가하지 않습니다.

| 경로 마지막 부분     | 중국어 간체 기본값 / 영어 기본값                                    | 역할·제한                                                     | 중국어 간체 멤버 예시                                |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | 코드 복사 버튼 문구이며 복사 내용은 유지합니다.               | `codeCopy: { copy: "复制代码" }`                     |
| `codeCopy.copied`    | 已复制 / Copied                                                     | 코드·절 링크 복사 성공 안내입니다.                            | `codeCopy: { copied: "已复制" }`                     |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | 코드·절 링크 실패 안내이며 클립보드 권한을 부여하지 않습니다. | `codeCopy: { failed: "复制失败，请手动选择代码。" }` |
| `imagePreview.open`  | 查看大图 / View image                                               | 이미지 입구·팝업 접근성 이름입니다.                           | `imagePreview: { open: "查看大图" }`                 |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | 이미지 닫기 이름이며 소스는 유지합니다.                       | `imagePreview: { close: "关闭图片预览" }`            |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        codeCopy: { copy: '复制内容', copied: '复制好了', failed: '无法复制，请手动选择。' },
        imagePreview: { open: '放大这张图片', close: '收起图片' },
      },
    },
  },
},
```

절 복사는 id 있는 본문 h2／h3에만 붙이며 codeCopy.copied／failed를 재사용합니다. 코드 복사·이미지 미리보기는 JavaScript가 필요합니다. 표지·링크·버튼 이미지는 제외하고 브라우저 선택 소스를 쓰며 원본을 추가 요청하지 않습니다. site.config enabled 필드는 없습니다.

## 5. 현재 범위와 확인

글 페이지는 새로고침 없이 시스템의 동작 줄이기 설정 변경에 반응합니다. 켜면 표지와 배경 네트워크가 정지 상태가 되고 Red Queen은 멈추고 숨겨집니다. 끄면 기존 시작 타이밍으로 효과를 복원합니다. 읽기 진행률을 초기화하거나 코드 복사, 절 링크, 이미지 미리보기를 다시 연결하지 않습니다. 새로운 site.config 스위치는 없습니다.

본문·패널은 바로 나타나 정지합니다. 배경 네트워크, 제목 광선, 표지 효과는 독립입니다. 전역 AI 전환, 본문 진입 시간, 패널 호흡, 관련 글 수, 이미지·코드 enabled 설정은 없습니다. 임의 키 추가로 적용되지 않습니다.

locale, articleSlug, headings, filePath, related, localeHrefs, seoLocaleHrefs는 BlogPost 인수이며 site.config·frontmatter가 아닙니다. 표준 라우트가 제공하므로 일반 글에 직접 쓸 필요는 없습니다.

dev에서 제목·표지 유무를 확인하고 복사·절 링크·이미지 동작을 확인하세요. 검색은 빌드 뒤 preview입니다. 배포 전 dev를 멈추고 npm run doctor, npm run preview를 쓰며 성공 직후 check·build를 반복하지 않아도 됩니다. 온라인은 재배포 뒤 갱신합니다.

[설치·업그레이드](/ko/blog/starter-guide-1-configure-your-site/), [첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/), [배포](/ko/blog/starter-guide-deployment/)를 참고하세요.
