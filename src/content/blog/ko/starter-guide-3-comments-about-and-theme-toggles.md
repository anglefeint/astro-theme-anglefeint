---
tags: ['anglefeint', 'starter']
title: '사용 가이드 5: 페이지와 기능을 취향에 맞게 조정하기'
subtitle: '바꾸고 싶은 영역별로 찾아보세요. 홈, About, Decoder, 소셜 링크, 푸터, 음악, 페이지 나누기를 다룹니다.'
description: '작은 설정 변경으로 페이지 내용과 기능을 조정하며 실제 기본값, 적용 범위, 병합 방법, 로컬 확인 절차를 설명합니다.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

이 글은 입문 가이드의 5 / 8편입니다. [전체 가이드 순서](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order) · [필드별 설정 사전](/ko/blog/config-reference/).

블로그가 실행된다면 바꾸고 싶은 부분부터 시작하세요. 모든 설정을 먼저 채우거나 아래 예시를 전부 복사할 필요는 없습니다.

모든 TypeScript 조각은 `src/site.config.ts`의 기존 `defineThemeConfig({...})` 객체에 합칩니다. 한 객체에는 `theme`, `i18n`, `social`을 하나씩만 두고 같은 이름의 필드는 직접 수정하며 다른 개인 설정을 유지하세요. 객체는 기본값과 병합하지만 배열은 전체를 대체합니다. 링크, 곡, 항목을 추가할 때 계속 표시할 내용도 남겨 두세요.

이 글은 작업별 자주 쓰는 설정을 설명하며 전체 필드 사전은 아닙니다. 페이지에서 바꾸고 싶은 영역에 해당하는 절을 선택하세요.

## 1. 홈 안내와 효과 조정하기

사이트 이름, 홈 대제목, 소개의 차이는 [블로그 설치와 내 정보 설정](/ko/blog/starter-guide-1-configure-your-site/)에서 설명합니다. 여기서는 홈 안내와 상호작용을 조정합니다.

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| 필드                              | 기본값  | 바뀌는 내용                                                                                                |
| --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`  | Initialize／done 시작 문구를 표시하며 false면 해당 부분을 숨깁니다.                                        |
| `theme.home.showFollow`           | `true`  | Wake Up／Follow 안내를 표시하며 false면 독립적으로 숨깁니다.                                               |
| `theme.home.showTrace`            | `true`  | 홈 아래 PIRATE SIGNAL／TRACE 상태 영역을 표시하며 false면 숨깁니다.                                        |
| `theme.effects.enableHomePassage` | `false` | 켜면 홈 글 제목 링크가 약 8초의 Matrix 이동 효과 뒤 탐색할 수 있습니다. 동작 줄이기에서는 바로 탐색합니다. |

전체 코드 비를 끄거나 사이트 전체 색상을 바꾸는 필드는 아닙니다. `showTrace`는 오른쪽 아래 와이드스크린 터미널의 스위치도 아닙니다.

### 와이드스크린 터미널 문구 바꾸기

기본 문구는 `Knock, knock.`입니다. 별도 덮어쓰기가 없는 언어도 공유하도록 먼저 영어 설정을 넣을 수 있습니다.

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: 'Leave a small trace here.' } } },
  },
},
```

독립적인 문구가 필요한 언어의 `messages.home.transmission`에 설정하세요. 이 값의 순서는 현재 언어 설정 → 영어 설정 → `Knock, knock.`이며 일반 UI 문구의 전체 대체값 연결을 따르지 않습니다. 터미널은 넓은 화면 레이아웃에 나타납니다. 모바일에 안 보인다고 설정 실패는 아닙니다. 열쇠구멍 버튼을 눌러야 복도 미리보기가 열립니다.

About의 Oracle 입구는 독립적인 장면 미리보기를 사용하며 홈 글 이동 효과 스위치에 영향을 받지 않습니다. 터미널 문구와 하단 상태는 분위기 연출이며 실제 기기, 네트워크, 보안 상태를 의미하지 않습니다.

스위치와 터미널 문구의 전체 정의는 [홈 사전](/ko/blog/config-home/#startup-switches)을 참고하세요.

## 2. About을 내 소개로 바꾸기

`/ko/about/`를 열면 한국어 콘텐츠를 볼 수 있습니다. 본문과 연락처는 언어별로 설정하며 테마 페이지 템플릿을 수정할 필요는 없습니다.

```ts
i18n: {
  locales: {
    ko: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: '개발과 글쓰기를 좋아하는 민수입니다.',
          what: '내 프로젝트와 학습 노트를 여기에 기록합니다.',
          ethos: ['호기심을 잃지 마세요.', '아이디어를 쓸 수 있는 것으로 만듭니다.'],
          now: '최근 개인 블로그를 정리하고 있습니다.',
          contactLead: '편하게 연락해 주세요.',
          signature: '> 방문해 주셔서 감사합니다.',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

예시 이름과 주소를 바꾸세요. `metaLine`은 개인 패널 위 상태 문구입니다. `who`, `what`, `ethos`, `now`에는 자기소개, 하는 일, 가치관, 근황을 씁니다. `contactLead`는 연락 안내이고 `signature`는 서명입니다. `ethos`는 문자열 배열이며 새 배열은 이전 항목 전체를 대체합니다.

문단과 서명은 일반 텍스트입니다. 문자열 안의 `\n`은 줄바꿈, `\n\n`은 빈 줄입니다. Markdown과 HTML을 해석하지 않으므로 `<br>`로 줄바꿈하지 마세요. 이 예시는 한국어만 수정합니다. 다른 언어는 직접 작성해야 하며 자동 번역하지 않습니다. 빠진 필드는 해당 언어의 설정 대체 규칙으로 채웁니다.

About 창 컨트롤은 닫기, 최소화, 전체 화면을 지원하며 브라우저 로컬에 상태를 기록합니다. 페이지 도구의 AI 출력과 다운로드 진행은 테마 상호작용이며 문구를 넣었다고 실제 AI 서비스에 연결하지 않습니다. 디코딩 도구는 브라우저 로컬 입력을 처리합니다.

About이 필요 없다면 `theme`에 `enableAboutPage: false`를 설정하세요. 기본은 `true`입니다. 끄면 About 라우트를 만들지 않으며 공용 내비게이션과 관련 About 연락 입구도 숨깁니다. 본문이나 푸터에 직접 쓴 링크는 자동 삭제하지 않으므로 함께 확인하세요.

콘텐츠 필드는 [About 사전](/ko/blog/config-about/#about-content), 명령 안내와 읽기 전용 리더 문구는 [터미널 사전](/ko/blog/config-terminal/#messages)을 참고하세요.

## 3. Decoder 페이지와 읽기 카드 조정하기

Decoder Lab은 `/ko/decoder/`에 있으며 기본 활성입니다. 시각적 표현은 사이퍼펑크와 디지털 자유의 선구자에 대한 헌사입니다. 로컬 처리와 P2P 네트워크 이미지는 개인이 도구와 데이터를 직접 통제한다는 생각을 반영합니다.

텍스트 디코딩, 지원하는 토큰 호출 해석, 주소 형식 검사를 제공하며 RPC, 지갑 연결, API Key는 필요하지 않습니다. 잔액을 조회하거나 거래를 실행하거나 주소 소유권을 증명하지 않습니다. calldata 입력도 계약의 실제 동작 검증이 아닙니다.

`theme`의 `enableDecoderPage: false`는 Decoder 페이지와 테마 관련 입구를 독립적으로 끕니다. About을 끈다고 Decoder가 꺼지지 않으며 반대도 같습니다. 사용자 링크는 직접 관리해야 합니다.

읽기 영역의 헌사 문구와 카드는 언어별로 설정합니다. 다음은 한국어 목록을 대체하는 예시입니다.

```ts
i18n: {
  locales: {
    ko: {
      messages: {
        decoderPage: {
          readings: {
            tribute: '사상과 코드로 프라이버시와 자유를 넓혀 갑니다.',
            links: [
              { title: '내 읽기 자료', href: 'https://example.com/', author: '작성자 이름', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''`는 헌사 문구를, `links: []`는 카드를 숨깁니다. 생략하면 기본 내용을 유지합니다. 각 항목에는 `title`, `href`를 쓰며 `author`, `year`, `cover`는 선택 사항입니다. `cover`는 `privacy-code`, `bitcoin` 같은 내장 이름, public 이미지 경로, HTTPS 이미지 주소를 지원하며 생략하면 이미지 없는 카드입니다.

`links`는 한 항목을 추가하는 것이 아니라 전체 목록을 대체합니다. 이전 항목을 유지하려면 함께 쓰세요. 제공한 자료의 입구일 뿐 대상 글을 수집·재게시하거나 외부 자원을 자동 검증하지 않습니다.

항목별 타입, 내장 표지, 기본 목록은 [Decoder 사전](/ko/blog/config-decoder/#readings)을 참고하세요.

## 4. 소셜 입구와 푸터 조정하기

소셜 계정은 `social.links`에 쓰며 상단과 푸터가 같은 배열 순서를 사용합니다. 사용자 아이콘을 추가하려면 먼저 `public/icons/community.svg`에 넣으세요.

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: '내 커뮤니티', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc`는 public 안의 로컬 SVG, PNG, WebP를 지원합니다. `/`로 시작하는 경로이며 원격 URL, 쿼리, 조각, 인코딩 문자를 넣지 마세요. `icon`보다 우선하고 원래 색상을 유지합니다. 둘 다 생략하면 텍스트를 표시합니다. `label`은 접근 가능한 이름입니다. 파일이 없거나 지원하지 않는 내장 아이콘 이름이면 설정 오류가 납니다.

선택적인 `rel`은 신원 등 링크 관계에 사용합니다. 예를 들어 내 Mastodon 계정에 `rel: 'me'`를 지정할 수 있습니다. 테마는 항상 `noopener noreferrer`를 유지하며 플랫폼별로 `me`를 자동 추가하지 않습니다. 신원 확인은 해당 플랫폼이 처리합니다. 먼저 사이트를 배포하고 상대 프로필에 반환 링크가 있는 실제 페이지 주소를 넣어야 하며 테마가 검증 결과를 보장하지는 않습니다.

모바일 너비에서는 상단 소셜 입구를 숨기지만 푸터는 표시합니다. `links: []`는 클릭 불가능한 자리표시 아이콘 세 개를 유지하며 소셜 영역 전체를 숨기지 않습니다.

### 푸터 크레딧, 설명, 추가 링크

```ts
site: { tagline: '호기심을 품고 꾸준히 기록합니다.' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '프로젝트 소스', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline`은 일반 텍스트이며 빈 문자열이면 숨깁니다. 자동 번역하지 않습니다. 예전 기본 문구 `Built with Astro.`는 내장 크레딧으로 취급해 중복 표시를 피합니다.
- `theme.footer.showCredits`는 기본 `true`이며 테마와 Astro 두 크레딧을 제어합니다. 꺼도 저작권 행, 사용자 설명, 추가 링크는 유지합니다. 자동 글 공유 이미지의 테마 크레딧도 제어하지만 사용자 이미지는 수정하지 않습니다.
- `theme.footer.links`는 기본 빈 배열이며 저작권과 크레딧 사이에 소셜 아이콘과 독립적인 링크를 표시합니다. 입력한 라벨을 유지하고 자동 번역하지 않으며 showCredits의 영향도 받지 않습니다.

저작권 이름은 사이트 전체 이름을 쓰고 연도는 빌드할 때 만듭니다. 문구, 크레딧, 연도 관련 결과를 바꾸면 다시 빌드하고 배포해야 합니다.

아이콘 경로, 링크 필드, 크레딧 규칙은 [공용 UI 소셜 필드](/ko/blog/config-site-chrome/#social-fields)와 [푸터 필드](/ko/blog/config-site-chrome/#footer)를 참고하세요.

## 5. 음악 플레이어 켜기

내 오디오를 `public/music/my-song.mp3`에 넣고 합치세요.

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: '나의 노래', artist: '작성자', src: '/music/my-song.mp3' }],
  },
},
```

음악은 기본 꺼짐이며 테마에 곡을 포함하지 않습니다. 각 곡에 `title`, `src`가 필요하며 `artist`는 생략 가능합니다. 빈 재생목록은 플레이어를 표시하지 않습니다. 곡을 추가할 때 기존 배열 항목을 유지하세요. 오디오 URL에는 `public`을 넣지 않으며 로컬 디스크 경로나 플랫폼 공유 페이지는 안 됩니다. HTTPS 오디오 직접 링크를 지원하며 공백·역슬래시는 쓰지 마세요. 빈 제목이나 잘못된 주소 형식은 설정 오류가 나지만 형식이 올바르다고 실제 접근을 보장하지는 않습니다.

플레이어는 공용 테마 레이아웃 페이지에 나타나며 페이지별 표시 스위치는 없습니다. 새 페이지에서는 처음에 접힙니다. 첫 방문에서 PLAY를 눌러야 오디오를 로드합니다. 현재 곡이 끝나면 다음 곡, 마지막 곡 뒤에는 첫 곡으로 돌아갑니다. 모바일에서 플레이어를 펼치면 맨 위로 버튼을 잠시 숨깁니다.

같은 탭 세션에서 곡, 진행 위치, 음량을 기억합니다. 이전에 재생 중이었다면 페이지 이동·새로고침 후 재생 재개를 시도하며 직접 일시정지했다면 멈춘 상태를 유지합니다. 끊김 없는 재생은 아니며 브라우저가 자동 재생을 막을 수도 있습니다. 저장소를 사용할 수 없어도 수동 재생은 가능하지만 세션 재개를 유지하지 않습니다.

현재 구현은 곡 전체를 내려받아 Blob으로 만든 뒤 재생하므로 탐색은 서버 Range 지원에 의존하지 않습니다. 큰 파일은 대기와 메모리 사용을 늘립니다. 외부 서버는 CORS를 허용해야 하고 같은 사이트 public 파일은 교차 출처 설정이 필요 없습니다. 오디오 주소 접근부터 확인하세요. 음악이 필요 없다면 `theme.music.enabled: false`를 설정합니다.

곡 필드, 상태 문구, 재개 한계는 [음악 플레이어 사전](/ko/blog/config-music/#track-fields)을 참고하세요.

## 6. 목록 개수와 페이지 나누기 조정하기

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount`는 기본 3이며 홈 최신 글 수를, `blogPageSize`는 기본 10이며 블로그·태그 목록의 페이지당 글 수를 제어합니다. 적절한 양의 정수를 쓰세요. 홈 최대 세 개의 Fragment 미리보기는 제어하지 않으며 Fragment 목록의 개수는 `theme.fragments.pageSize`로 정합니다.

`windowSize`는 기본 7이며 페이지 번호 표시 창을 제어합니다. 렌더링 시 5–21로 제한하고 페이지당 글 수와는 다릅니다. 이동 입구는 `jump.enabled`가 true이고 전체 페이지가 `showJumpThreshold`보다 많아야 나타납니다. 기본은 12페이지 초과이며 `enterToGo`는 Enter 이동 허용 여부입니다.

기본 스타일은 `random`이며 예시는 `fixed`로 변형을 고정합니다. `sequential`은 페이지 순서로 선택합니다. `random`의 클라이언트 초기화는 다시 무작위 선택하므로 결과가 반복될 수 있습니다. JavaScript를 꺼도 빌드한 정적 페이지 스타일은 유지합니다. `variants`는 선택할 변형 개수이며 렌더링 시 1–12로 제한합니다. `fixedVariant`는 현재 변형 범위로 제한합니다.

`style.enabled: false`는 기본 스타일을 쓰며 페이지 나누기를 끄지 않습니다. Blog, 태그, Fragments가 공유하므로 세 곳의 효과를 확인하세요.

전체 범위, 변형, UI 문구는 [Blog List와 태그 목록 사전](/ko/blog/config-blog-list/#pagination-window)을 참고하세요.

## 7. 필요 없는 기능만 끄기

스위치별 영향 범위입니다. 한 기능을 설정하려고 표 전체를 끌 필요는 없습니다.

| 설정 경로                      | 기본값 | false일 때                                                        |
| ------------------------------ | ------ | ----------------------------------------------------------------- |
| `theme.enableAboutPage`        | `true` | About 페이지를 만들지 않고 관련 테마 입구를 숨깁니다.             |
| `theme.enableDecoderPage`      | `true` | Decoder 페이지를 만들지 않고 관련 테마 입구를 숨깁니다.           |
| `theme.effects.enableRedQueen` | `true` | 글 Red Queen 모니터를 숨기며 AI 페이지 효과 전체를 끄지 않습니다. |
| `theme.search.enabled`         | `true` | 사이트 글 검색 입구와 인덱스 생성을 끕니다.                       |
| `theme.toc.enabled`            | `true` | 기본 글 목차를 끄며 개별 `toc: true`는 덮어쓸 수 있습니다.        |
| `theme.tags.enabled`           | `true` | 태그 입구와 페이지 생성을 끄며 글은 삭제하지 않습니다.            |
| `theme.math.enabled`           | `true` | Markdown／MDX 수식 처리를 끕니다.                                 |
| `theme.socialImage.enabled`    | `true` | 자동 글 공유 이미지 생성을 멈추며 수동 ogImage는 유효합니다.      |

글 모니터만 끄려면 `theme: { effects: { enableRedQueen: false } }`만 합치세요. 검색, 음악, About 설정은 바뀌지 않습니다.

댓글과 Fragments는 기본 꺼짐이며 다른 기능을 쓰기 위해 켤 필요가 없습니다. 필요할 때 [Giscus 댓글 설정](/ko/blog/starter-guide-4-giscus-comments/), [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)를 읽으세요. 목차, 수식, 공유 이미지는 [첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/)와 [이미지 가이드](/ko/blog/starter-guide-images/)를 참고하세요.

## 8. 작품 페이지가 필요하면 사용자 페이지 만들기

프로젝트를 따로 보여 주려면 루트에서 실행하세요.

```bash
npm run new-page -- projects
```

`src/pages/[lang]/projects.astro`를 만들며 기본 `base` 레이아웃을 사용하고 활성 언어에 `/<locale>/projects/`를 생성합니다. 예시는 `/en/projects/`, `/zh/projects/`입니다. Astro 파일을 편집해 본문을 넣으세요. 자동 번역하거나 상단 내비게이션을 추가하지 않습니다. 본문이나 푸터 links에 입구를 제공할 수 있습니다.

스타일이 필요할 때 `--theme`를 사용하세요. 예를 들어 `npm run new-page -- portfolio --theme cyber`는 다른 Cyberpunk 페이지를 만듭니다. 값은 `base`, `ai`, `cyber`, `hacker`, `matrix`이며 새 페이지 레이아웃만 정하고 사이트 전체의 네 분위기를 전환하지 않습니다. slug는 소문자 영문, 숫자, 하이픈이며 `projects/labs` 같은 중첩 경로도 가능합니다. 패키지의 표준 경로와 충돌하지 마세요. 같은 파일이 있으면 오류가 나므로 같은 경로에 다섯 테마 명령을 연속 실행하지 마세요.

## 9. 저장 후 적용 확인하기

먼저 dev에서 바꾼 페이지를 열고 콘텐츠, 링크, 기능 입구가 예상대로인지 확인하세요. 환경변수에 예전 덮어쓰기가 있다면 [첫 가이드의 확인 절차](/ko/blog/starter-guide-1-configure-your-site/)를 따르세요. 사용자 아이콘 없음, 오디오 요청 실패, 외부 링크 문제는 각각 경로와 네트워크를 확인하고 전체 설정을 반복 덮어쓰며 해결하려 하지 마세요.

배포 전에 dev를 멈추고 실행하세요.

```bash
npm run doctor
npm run preview
```

doctor는 로컬 준비, 검사, 빌드를 포함합니다. 성공 직후 check나 build를 반복할 필요는 없습니다. 검색은 빌드 뒤 preview에서 확인해야 하며 preview 자체는 게시하지 않습니다. 실제 사이트는 `dist/` 전체를 다시 배포해야 하며 로컬 설정 저장만으로 온라인 페이지가 바뀌지 않습니다.

## 가이드 탐색과 설정 조회

[이전 글: Fragment 게시하기](/ko/blog/starter-guide-5-fragments/) · [다음 글: 독자에게 댓글 받기](/ko/blog/starter-guide-4-giscus-comments/) · [여덟 편의 가이드 시작 페이지](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order).

관련 필드: [홈](/ko/blog/config-home/), [About](/ko/blog/config-about/), [터미널](/ko/blog/config-terminal/), [Decoder](/ko/blog/config-decoder/), [공용 내비게이션·소셜·푸터](/ko/blog/config-site-chrome/), [음악 플레이어](/ko/blog/config-music/), [목록과 페이지 나누기](/ko/blog/config-blog-list/). 전체 경로, 기본값, 제한은 [설정 사전 시작 페이지](/ko/blog/config-reference/)를 참고하세요.
