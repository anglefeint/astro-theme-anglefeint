---
tags: ['anglefeint', 'starter']
title: '사용자 가이드 5: 조각 게시하기'
description: '짧은 생각을 Markdown으로 기록하고 선택적으로 팝업 댓글을 사용합니다.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
updatedDate: '2026-11-13'
---

## AI가 읽을 수 있는 콘텐츠

빌드 시 공개 글과 활성화된 Fragments, About을 `/llms.txt`, 언어별 색인과 전체 본문 모음에 포함합니다. 글의 Markdown URL은 유지됩니다. 각 언어에 `/ko/fragments/index.md`, `/ko/about/index.md`를 생성합니다(언어 코드는 바꿔 사용하세요). Fragments는 모든 공개 페이지를 합치며 각 ID, 게시 시간, 본문과 안정적인 `/<locale>/fragments/#ID` 링크를 보존합니다. HTML에서 Markdown 링크를 찾을 수 있습니다. `npm run build` 후와 preview에서 사용할 수 있으며 `dist/` 전체를 배포합니다.

About은 공개 소개, 연락처 링크와 열 수 있는 AI 텍스트 팝업을 내보내며 터미널 설정, 도구와 장식 UI는 제외합니다. 댓글은 내보내지 않습니다. 비활성 페이지·언어, 삭제된 내용, noindex와 외부 canonical은 제외하고 재빌드 시 오래된 생성 파일과 발견 링크를 정리합니다. 사용자 파일은 보호하며 충돌 시 빌드를 중단합니다. 사이트·언어 보충 정보는 모든 문서에 적용됩니다. JSON-LD에 언어를 포함하고 About은 AboutPage를 사용합니다. 새 설정·서버·UI 의존성이 필요 없으며 AI 색인이나 인용을 보장하지 않습니다.

0.33.2부터 Fragments는 글 페이지와 같은 맨 위로 버튼을 사용합니다. 스크롤 후 표시되며 동작 줄이기 설정을 따릅니다. 추가 설정은 필요하지 않습니다.

기존 블로그는 테마를 0.29.0 이상으로 먼저 업그레이드하세요:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

`src/site.config.ts`의 기존 theme에 합칩니다. 조각과 댓글은 기본적으로 꺼져 있습니다. 메뉴는 Decoder Lab 아래에 표시됩니다.

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

활성화한 뒤 `/<locale>/fragments/`로 이동하세요. `pageSize`는 1–100의 정수입니다. 파일은 `.md`를 사용하며 초안이나 미래 날짜를 필터링하지 않습니다. 아직 공개하지 않을 조각은 `src/content/fragments/` 밖에 보관하세요.

활성화된 모든 언어에 같은 조각의 골격 만들기:

모든 활성 언어를 기본으로 생성하려면 테마 0.31.0 이상이 필요합니다. 먼저 업그레이드하세요. 0.29–0.30에서는 `--locales`로 명시해야 합니다.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

`new-post`와 동일하게 기본적으로 프로젝트의 모든 활성 언어에 같은 ID와 타임스탬프를 공유하는 골격을 만듭니다. 자동 번역은 하지 않습니다. 우선순위는 `--locales` → `ANGLEFEINT_LOCALES` → 활성 언어입니다. 명시한 목록은 공백 제거, 소문자 변환, 중복 제거를 거치며 설정을 읽지 않고 지정 언어 디렉터리만 만듭니다. 언어 활성화 설정은 바꾸지 않습니다.

새 starter는 `npm run new-fragment`도 제공합니다. 기존 프로젝트는 스크립트 추가 없이 npx를 사용할 수 있습니다.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales ko
```

`src/content/fragments/<locale>/`의 Markdown을 편집합니다. 제목은 선택 사항입니다:

나중에 번역을 추가하려면 원본 Markdown을 대상 언어 폴더로 복사하고 id를 유지한 채 본문을 번역하세요.

```md
---
id: 'q8Lm3XzP'
pubDate: 2026-11-11T08:30:00+08:00
---

조각.
```

수정하거나 파일 이름을 바꿔도 id를 유지합니다. 같은 조각의 번역만 ID를 공유합니다. 같은 언어에서 ID가 중복되면 빌드가 실패합니다. pubDate에 시간과 시간대를 포함합니다. UTC로 표시하고 최신순으로 정렬합니다.

팝업 댓글은 `theme.fragments.comments.enabled`를 true로 설정하고 `theme.comments`의 repo, repoId, category, categoryId를 Giscus 값으로 채웁니다. 저장소 설정은 가이드 4를 참고하세요. 글 댓글은 꺼 둘 수 있습니다. [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

조각은 specific, 엄격한 일치, `fragment/<id>`를 사용합니다. 글의 mapping, term, number, shareAcrossLocales, lang을 사용하지 않으며 UI는 페이지 언어를 따릅니다. 같은 ID의 번역은 댓글과 반응을 공유합니다. 글 토론 연결은 유지됩니다. 첫 클릭에서 댓글 클라이언트를 로드합니다. 닫으면 팝업을 숨기며, 다시 열거나 다른 조각으로 전환할 때 같은 댓글 인스턴스를 재사용합니다.

Fragments는 글 검색과 RSS에 포함되지 않지만 빌드 시 별도의 AI용 Markdown을 생성합니다. 이미지는 `public/images/`에 두고 `/images/...`로 참조합니다.

테마를 0.29.0 이상으로 업그레이드하고 설정으로 켭니다. 개인 콘텐츠, 설정, 음악, 이미지는 보존됩니다. 개인 가이드는 덮어쓰지 않으므로 최신 demo를 참고하세요. GitHub 토론을 합치거나 삭제하지 않습니다.

댓글은 원격으로 불러옵니다. Giscus가 준비될 때까지 로딩을 표시하고 실패하거나 15초가 지나면 다시 시도를 제공합니다. 네트워크나 설정을 확인하세요. 글과 같은 Giscus 연동을 재사용하므로 Giscus npm 패키지를 따로 설치할 필요가 없으며 기존 글의 연결도 바꾸지 않습니다.

```bash
npm run build
```

0.32.0 이상 페이지 탐색 개선: 조각은 Blog와 페이지 번호, 네온 스타일, 설정한 기준에 따라 표시되는 페이지 이동 입력란을 공유합니다. `theme.pagination`은 두 목록에 공통으로 적용되며, 조각의 페이지당 개수는 계속 `theme.fragments.pageSize`로 별도 설정합니다.

## 안정적인 공유 링크 (0.32.0 이상)

0.32.0 이상 공유 기능: 날짜 링크로 목록의 해당 조각을 찾고 옆에서 링크를 복사할 수 있습니다. 공유 주소는 `/ko/fragments/#ID`이며 ID는 Markdown frontmatter의 id입니다. 현재 페이지에 없을 때만 언어별 소형 정적 인덱스를 읽어 해당 페이지로 이동합니다. 내용 추가, 날짜 또는 pageSize 변경 후 다시 빌드하고 ID는 유지하세요. 페이지 간 위치 찾기와 복사에는 JavaScript가 필요합니다.

실제 탐색 주소에는 페이지 번호가 있을 수 있으므로 공유할 때는 날짜 링크나 복사 버튼을 사용하세요. 기존 페이지는 오래된 앵커를 보정하지만 사라진 페이지 번호는 사이트의 일반 404로 처리됩니다. 이 기능은 404 페이지를 가로채지 않습니다.

조각이 없거나 네트워크가 실패하면 안내하며 반복 이동하지 않습니다. 클립보드가 차단되면 수동 복사용 링크를 보여줍니다. 이 기능은 테마 0.32.0 이상이 필요합니다. 자동 위치 찾기를 사용하기 전에 업그레이드하세요.

## 기본 공유 이미지와 Fragment 짧은 ID (0.33.0+)

src/site.config.ts의 기존 site 설정에 site.ogImage를 추가하세요. public 루트 경로(/images/share.jpg는 public/images/share.jpg) 또는 HTTPS URL을 지원합니다. 비워 두면 내장 1200×630 Anglefeint 이미지를 사용합니다. Fragments와 모든 #ID 공유 링크는 같은 기본 이미지를 사용합니다. 글 전용 이미지와 자동 생성 이미지가 우선하며, 자동 생성을 꺼도 글 표지 이미지가 사이트 기본 이미지보다 우선합니다. 변경 후 다시 빌드하고 배포하세요. 공유 서비스의 미리보기 캐시는 남을 수 있습니다.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment는 대소문자를 구분하는 영숫자 8자리 Nano ID를 만들고 모든 언어의 기존 Markdown ID와 중복되면 다시 시도합니다. 한 번에 생성한 모든 언어는 ID와 게시 시간을 공유합니다. Fragment ID는 정확히 영숫자 8자리만 허용합니다. 기존 UUID와 긴 ID는 지원하지 않으므로 이전 항목을 삭제하고 다시 게시하세요. 마이그레이션이나 이전 링크 호환 기능은 없습니다. 게시 후 ID를 유지하세요. 변경하면 댓글 연결도 바뀝니다.

## 홈 Fragment 미리보기 (0.35.0+)

현재 소스에서는 `theme.fragments.enabled`가 켜져 있고 현재 언어에 글이 있으면 홈 헤더 아래에 픽셀 아바타 버튼이 나타납니다. 열면 최신 3개를 미리 볼 수 있습니다. 카드 전체는 원문으로, 하단 숫자와 화살표는 전체 목록으로 이동합니다. 숫자는 현재 언어의 미리보기 수 / 전체 수입니다. 이미지와 코드는 높이를 제한하고 넘치는 부분을 자릅니다. 기능이 꺼져 있거나 글이 없으면 버튼을 표시하지 않습니다. 추가 설정은 필요 없으며, 테마 0.35.0 이상이 필요합니다.

## 로컬 이미지와 배포 (0.36.0+)

테마 0.36.0 이상가 필요하며 공개된 0.35.0에는 포함되지 않습니다. `/images/fragments/photo.png`는 `public/images/fragments/photo.png`를 참조합니다. Markdown 옆의 이미지는 `./photo.png`로 참조할 수 있습니다. Markdown, 참조형 이미지와 HTML `img`를 지원하며 원본을 이동하거나 덮어쓰지 않습니다.

업데이트 후 로컬 dev 또는 doctor가 반응형 파일을 자동으로 준비합니다. 직접 실행할 수도 있습니다.

```bash
npx @anglefeint/astro-theme prepare-covers
```

원본과 전체 `src/assets/blog/covers/`(manifest.json 및 generated/)를 커밋하세요. 빌드와 CI doctor는 검증만 하고 파일이 없거나 오래되면 중단하며 배포 서버에서 다시 생성하지 않습니다. 목록과 홈 미리보기는 파일을 공유하고 누락된 너비·높이를 채웁니다. 목록 첫 이미지는 우선 로드하고 이후 이미지와 홈 썸네일은 지연 로드합니다. 애니메이션과 SVG 형식은 유지하고 원격 이미지는 로컬 변환하지 않습니다.
