---
tags: ['anglefeint', 'config']
title: '설정 사전: Fragments'
subtitle: 'Fragment 목록, 홈 미리보기, 독립 댓글, 안정적인 링크입니다.'
description: '실제 구현으로 Fragments 스위치, 페이지 나누기, 댓글, UI 문구, 콘텐츠 필드를 조회하고 유효·현재 미사용 설정을 구분합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

먼저 콘텐츠를 게시하려면 [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)를 읽으세요. 여기는 설정 조회용입니다. 설치·설정 위치는 [첫 가이드](/ko/blog/starter-guide-1-configure-your-site/), 모든 모듈은 [설정 사전 시작 페이지](/ko/blog/config-reference/)에 있습니다.

기본값은 현재 demo가 아닌 테마 패키지 기준입니다. 설정은 모두 `src/site.config.ts`의 기존 `defineThemeConfig({...})`에 합치고 theme·i18n을 중복 생성하지 마세요.

## 수정할 위치부터 찾기

| 바꿀 항목                | 설정 경로·위치                                                   |
| ------------------------ | ---------------------------------------------------------------- |
| 목록·홈 입구 활성화      | `theme.fragments.enabled`                                        |
| 전체 목록 페이지당 수    | `theme.fragments.pageSize`                                       |
| 독립 댓글                | `theme.fragments.comments.enabled`, 연결은 `theme.comments` 공유 |
| 제목·설명·안내·닫기 문구 | `i18n.locales.<语言>.messages.fragments`                         |
| 번호·페이지 이동         | `theme.pagination`, 문구는 `messages.blog`                       |
| ID·시간·제목             | Markdown frontmatter이며 site.config가 아닙니다.                 |
| 홈 개수·높이·아바타      | 현재 공개 설정 필드 없음                                         |

<a id="enabled"></a>

## theme.fragments.enabled: Fragments 켜기

- **타입 / 기본값:** boolean / `false`.
- **상태 / 역할:** 적용됩니다. 켜면 `src/content/fragments/<语言>/**/*.md`를 읽고 활성 언어의 목록·위치 인덱스를 만듭니다. 해당 언어 내용이 있으면 홈 입구를 표시합니다.
- **제한:** 끄면 컬렉션을 읽지 않고 목록 라우트도 만들지 않습니다. 파일은 유지합니다. 켰지만 내용이 없으면 빈 목록이며 홈 입구는 없습니다. `.md`만 읽고 `.mdx`는 안 됩니다.
- **예시:** `theme: { fragments: { enabled: true } }`.

첫 페이지는 `/<语言>/fragments/`, 이후는 `/<语言>/fragments/2/` 등입니다. `/1/`을 만들지 마세요. 언어부터 활성화해야 합니다. [다국어 가이드](/ko/blog/starter-guide-languages/)를 참고하세요.

`theme.fragments.enabled: false`이면 dev, build, prepare-covers/doctor가 Fragments 본문의 이미지 참조를 건너뜁니다. 해당 참조만으로 처리 대상이 되는 이미지는 원본이나 파생 파일이 없어도 됩니다. 다만 글 표지 참조와 `src/assets/blog/default-covers/`, `src/assets/blog/covers/originals/` 이미지 풀은 Fragments 전용 이미지라도 준비와 검증을 계속합니다. 파일을 삭제하지 않으며 다시 켜면 Fragments 이미지 처리를 재개합니다.

**버전 안내:** 비활성 콘텐츠의 이미지 격리는 0.36.1부터 제공하며 0.36.0에는 없습니다. 이전 버전에서 지원한다고 가정하지 마세요.

<a id="page-size"></a>

## theme.fragments.pageSize: 전체 목록 페이지당 수

- **타입 / 기본값:** number / `20`.
- **상태 / 역할:** 적용되며 전체 목록과 ID→페이지 위치 인덱스를 제어합니다.
- **제한:** **1–100의 안전한 정수**여야 합니다. 소수, 0, 음수, 범위 초과는 오류이며 자동 자르지 않습니다. 꺼져 있어도 pageSize는 검증합니다. 홈 최신 세 미리보기는 이 값이나 `theme.homeLatestCount`에 영향받지 않습니다.
- **예시:** `theme: { fragments: { pageSize: 10 } }`.

언어별 pubDate 최신순이며 시간이 같으면 ID localeCompare로 정렬합니다. 파일 이름 정렬·미래 날짜 제외는 없습니다. 개수를 바꾸면 페이지가 달라지므로 아래 안정적 링크로 공유하세요.

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled: Fragment 댓글

- **타입 / 기본값:** boolean / `false`.
- **상태 / 역할:** 조건부 적용입니다. 기능이 켜지면 전체 목록 카드에 버튼을 표시하고 공통 팝업에서 해당 토론을 로드합니다. 홈 미리보기에는 버튼이 없습니다.
- **제한:** 글 스위치 `theme.comments.enabled`와 독립적입니다. 공통 Giscus 연결도 필수이며 빠지면 페이지 생성 오류이고 빈 목록으로 우회할 수 없습니다. 서비스·저장소 권한도 올바르게 설정해야 합니다.
- **예시:** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`.

Fragments만 켜고 댓글은 끄는 예시입니다.

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

Fragment 댓글만 쓴다면 글 스위치는 false여도 되지만 repo, repoId, category, categoryId는 필요합니다. 타입·기본값·검증은 [Giscus 연결](/ko/blog/config-comments/#connection), 전체 예시는 [Fragment 댓글만 켜기](/ko/blog/config-comments/#fragment-overrides)에 있습니다. 로컬 검사는 원격 권한·ID를 증명하지 않습니다.

`fragment/<稳定ID>`로 토론을 연결하며 같은 ID 번역은 공유합니다. 글 mapping, term, number, shareAcrossLocales는 쓰지 않습니다. specific, strict `'1'`, emitMetadata `'1'`을 고정하고 페이지 언어를 따르며 `theme.comments.lang`은 사용하지 않습니다. 글 댓글도 켜면 그 설정의 검증은 계속 실행합니다.

댓글 테마, 반응, 입력 위치는 Giscus를 공유합니다. 첫 클릭 때 스크립트를 넣으며 고정 eager는 클릭 뒤 즉시 로드이지 첫 화면 미리 로드가 아닙니다. 닫아도 iframe을 유지하고 다른 콘텐츠는 토론을 전환합니다. 약 15초 유효 응답이 없으면 실패·재시도를 표시하며 공개 타임아웃 설정은 없습니다.

<a id="fragment-messages"></a>

## Fragment UI 문구: messages.fragments

전체 접두사는 `i18n.locales.<语言>.messages.fragments`입니다. 모두 **string**이며 기능이 아닌 문구를 바꿉니다. 내장 현재 언어·대체값을 사용하고 표는 중국어 간체 / 영어 기본값만 나열합니다. 생략은 기본 문구, 빈 문자열은 의도적 덮어쓰기이며 컨트롤 삭제를 보장하지 않습니다. 예시는 중국어 간체 원문이며 fragments 객체 안에 씁니다.

| 필드             | 중국어 간체 / 영어 기본값                                                                                                 | 상태·역할·제한                                                                                 | 중국어 간체 예시                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | 조건부 적용: 목록 제목, 페이지 제목 일부, 홈 입구의 접근 가능한 이름이며 개별 제목은 아닙니다. | `title: '随手记'`                       |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | 조건부 적용: 목록의 가시 소개·페이지 설명입니다. 홈 팝업에는 소개를 표시하지 않습니다.         | `description: '记录工作与生活的小事。'` |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | 조건부 적용: 전체 목록이 비었을 때 안내이며 홈 입구를 강제 표시하지 않습니다.                  | `empty: '稍后再来看看。'`               |
| `comments`       | 评论 / Comments                                                                                                           | 조건부 적용: Fragment 댓글 버튼 문구입니다.                                                    | `comments: '参与讨论'`                  |
| `close`          | 关闭 / Close                                                                                                              | 조건부 적용: 댓글 팝업 닫기 문구·홈 창 닫기의 접근 가능한 이름입니다.                          | `close: '关闭窗口'`                     |
| `previous`       | 上一页 / Previous                                                                                                         | **현재 미사용**: 타입은 받지만 실제 페이지는 messages.blog.previous를 사용합니다.              | `previous: '上一页'`                    |
| `next`           | 下一页 / Next                                                                                                             | **현재 미사용**: 타입은 받지만 실제 페이지는 messages.blog.next를 사용합니다.                  | `next: '下一页'`                        |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | 조건부 적용: 댓글 로드 상태입니다.                                                             | `loading: '正在连接讨论…'`              |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 조건부 적용: 댓글 로드 실패이며 위치 인덱스 오류는 아닙니다.                                   | `error: '讨论暂时不可用，请重试。'`     |
| `retry`          | 重试 / Retry                                                                                                              | 조건부 적용: 댓글 실패 뒤 재시도 버튼입니다.                                                   | `retry: '重新连接'`                     |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | 조건부 적용: 공유 링크 버튼 title·접근 가능한 이름이며 스크립트가 활성화합니다.                | `copyLink: '复制本条链接'`              |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | 조건부 적용: 복사 성공 안내입니다.                                                             | `linkCopied: '已复制'`                  |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | 조건부 적용: 클립보드 실패 후 수동 복사 안내입니다.                                            | `copyLinkFailed: '请手动复制此链接。'`  |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | 조건부 적용: 안정적 ID 위치 찾기 실패이며 일반 404 문구는 아닙니다.                            | `notFound: '这条记录已不存在。'`        |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | 조건부 적용: 위치 인덱스 요청·검증 실패입니다.                                                 | `indexError: '定位失败，请刷新重试。'`  |

중국어 간체 제목·설명만 바꾸는 예시입니다.

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        fragments: {
          title: '随手记',
          description: '记录工作与生活的小事。',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Fragments가 사용하는 공통 설정

| 경로                                                                                                         | 기본값·역할                                          | 제한·예시·전체 설명                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                         | Blog List의 여덟 페이지 필드·기본값을 공유합니다.    | 둘 이상 페이지일 때 표시합니다. 예: `theme: { pagination: { windowSize: 5 } }`. [페이지 설정](/ko/blog/config-blog-list/#pagination-window) 이후 각 절을 참고하세요.        |
| `i18n.locales.<语言>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string, 현재 언어 내장값이며 가시·접근성 문구입니다. | 예: `previous: '上一页'`. [페이지 문구](/ko/blog/config-blog-list/#pagination-messages)를 참고하고 같은 fragments 필드는 바꾸지 마세요.                                     |
| `i18n.locales.<语言>.messages.blog.backToTop`                                                                | string, 현재 언어 내장 문구                          | 전체 목록 맨 위로 버튼입니다. 예: `backToTop: '回到顶部'`. [글 UI](/ko/blog/config-article/#article-messages)를 참고하세요.                                                 |
| `i18n.locales.<语言>.messages.home.viewAll`                                                                  | string, 현재 언어 내장 문구                          | 홈 하단 보관함 링크 이름은 Fragment 제목도 함께 씁니다. 예: `viewAll: '查看全部'`. [홈 문구](/ko/blog/config-home/#home-messages)를 참고하세요.                             |
| `theme.math.enabled`                                                                                         | boolean / `true`                                     | 현재 페이지 내용에 따라 수식 스타일 필요 여부를 정합니다. 예: `theme: { math: { enabled: false } }`. [수식 스위치](/ko/blog/config-article/#feature-switches)를 참고하세요. |

`theme.comments` 전체는 [Giscus 사전](/ko/blog/config-comments/)에 있습니다. 글 매핑을 Fragment 설정으로 취급하지 마세요. `theme.toc.enabled`, 글 OUTPUT, Red Queen은 목록을 제어하지 않으며 Cards/List 전환도 없습니다.

<a id="content-fields"></a>

## 개별 Fragment의 세 frontmatter 필드

`src/content/fragments/<语言>/` Markdown 필드이며 **site.config에 쓰지 않습니다**. 공개 schema는 세 항목뿐이며 추가 호환 필드는 없습니다.

| 필드      | 타입 / 기본값                        | 역할·상태·제한                                                                                                 | 예시                                  |
| --------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string / 없음, 필수                  | 적용. ASCII 영문·숫자 정확히 8자리이며 같은 언어에 중복 불가입니다. 링크·댓글이 의존하므로 게시 후 유지하세요. | `id: 'aB3dE6gH'`                      |
| `pubDate` | Date로 변환 가능한 날짜 / 없음, 필수 | 적용. 해석 가능해야 하며 정렬·UTC 표시에 사용합니다. 시간대 있는 ISO 문자열을 권장합니다.                      | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | string, 생략 가능 / 미설정           | 조건부 적용. 목록·홈 카드 제목이며 없어도 게시됩니다. 파일 이름에서 자동 가져오지 않습니다.                    | `title: '今天的小发现'`               |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: '今天的小发现'
---

这里写正文。图片和代码直接放在 Markdown 正文中。
```

`npm run new-fragment -- --locales zh,en`은 새 ID와 현재 시간을 공유하는 파일 묶음을 만듭니다. 실행마다 새 ID이므로 기존 번역은 원 ID를 쓰세요. 언어 간 같은 ID는 가능하고 같은 언어 중복은 오류입니다. 파일 이름은 바꿔도 ID는 파일명·번호에 맞춰 바꾸지 마세요. 구형 ID 자동 이전은 없으며 ID 변경은 토론·공유 주소를 바꿉니다.

`description`, `heroImage`, `tags`, `draft`, 개별 `comments` 등은 Fragment 소비 논리가 없습니다. 글 frontmatter를 적용하지 마세요. 특히 `draft: true`도 초안이 아니므로 미공개 내용을 활성 컬렉션에 두지 마세요.

<a id="preview-and-links"></a>

## 홈 미리보기·이미지·링크의 고정 동작

구현이 정하며 추가 공개 필드는 없습니다.

- **홈 개수:** 현재 언어 최신 세 개, 부족하면 실제 수입니다. 하단은 “현재 표시 수 / 현재 언어 전체 수” 보관함 링크입니다. 다른 언어로 보충하지 않습니다.
- **홈 요약:** 렌더링 결과에서 텍스트, 첫 유효 HTTP(S) 이미지, 첫 코드 블록을 추출합니다. 텍스트는 Unicode 코드 포인트 최대 180개, 코드는 최대 8줄·800개이며 초과 시 말줄임을 붙입니다. 카드 높이 초과는 숨기고 전체는 목록에 남습니다. 제목은 별도 표시합니다. 완전한 Markdown 렌더링이 아니며 previewCount·previewHeight 설정은 없습니다.
- **이미지:** 지원 로컬 이미지는 기존 manifest의 크기·srcset을 쓰지만 원격·미지원은 최적화를 보장하지 않습니다. 목록 페이지 첫 이미지는 eager / high, 나머지는 lazy이며 비동기 디코딩합니다. 원본·크기·검사는 [이미지 가이드](/ko/blog/starter-guide-images/)를 참고하세요. heroImage를 추가할 필요는 없습니다.
- **안정적 링크:** `/<语言>/fragments/#<ID>`입니다. 스크립트가 인덱스로 현재 페이지를 찾아 필요하면 이동합니다. 콘텐츠·pageSize 변경 후에도 ID 기준이며 삭제·ID 변경은 원 대상을 유지하지 못합니다. JavaScript 없이 일반 페이지 링크는 되지만 페이지 간 자동 위치·복사는 의존할 수 없습니다.
- **언어 전환:** 대상 언어 첫 목록으로 가며 같은 ID 번역을 바로 찾는다고 보장하지 않습니다.
- **공개 콘텐츠:** Markdown 합계 출력은 `/<语言>/fragments/index.md`입니다. 사이트 검색·글 RSS 활성 스위치가 아니며 공개 콘텐츠에 민감 정보를 넣지 마세요.

아바타, hover 애니메이션, 창 테두리, 코드 높이는 현재 site.config 항목이 아닙니다. 존재하지 않는 설정은 제공하지 않습니다. [설정 시작 페이지](/ko/blog/config-reference/)에서 다른 모듈을 보세요.
