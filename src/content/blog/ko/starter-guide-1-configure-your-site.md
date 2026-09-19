---
tags: ['anglefeint', 'starter']
title: '사용 가이드 1: 블로그 시작하기'
subtitle: '설치부터 사이트 정보와 언어 설정, 예제 글 교체, 빌드와 배포까지 안내합니다.'
description: '설치부터 사이트 정보와 언어 설정, 예제 글 교체, 빌드와 배포까지 안내합니다.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## 최소한의 설정부터 시작하세요

이 가이드는 함께 제공되는 0.8.0 starter를 기준으로 사이트 시작, 글 작성, 선택 기능을 설명합니다. 처음부터 모든 설정을 알 필요는 없습니다. 사이트 정보와 콘텐츠를 바꾸고 나머지는 기본값으로 시작하세요. 이 가이드도 일반 블로그 글이므로 목차, 코드 복사, 검색을 직접 확인할 수 있습니다.

## 1. 설치하고 로컬에서 열기

Node.js 22.12.0 이상을 준비하고 실행합니다.

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

생성 마법사에서 `my-blog` 같은 프로젝트 디렉터리를 선택합니다. 아래 첫 줄을 실제로 생성한 디렉터리에 맞게 바꾸세요. 마법사에서 의존성을 설치했다면 `npm install`은 생략해도 됩니다.

```bash
cd my-blog
npm install
npm run dev
```

터미널에 표시된 로컬 URL을 엽니다. 포트가 사용 중이면 번호가 달라질 수 있습니다. pnpm도 위 npm 명령으로 템플릿을 생성하되 마법사의 의존성 설치를 건너뛴 뒤 `pnpm install`, `pnpm dev`를 실행하면 됩니다.

## 2. 사이트 이름, 홈 소개, 링크 바꾸기

`src/site.config.ts`를 열고 import와 export를 유지한 채 `defineThemeConfig({...})` 안의 객체를 편집합니다. 아래는 설정 선언 전체의 예입니다. 도메인, 이름, 문구, 링크를 자신의 것으로 바꾸세요.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
  },
  i18n: {
    defaultLocale: 'ko',
    locales: {
      ko: {
        site: { hero: 'Welcome to my blog.' },
        messages: { siteDescription: 'My notes and projects.' },
      },
    },
  },
  social: {
    links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
  },
});
```

`site.title`은 사이트 이름입니다. `site.url`에는 실제 배포 주소 전체를 입력하며 canonical, RSS, sitemap, 공유 이미지 URL에 영향을 줍니다. `site.author`는 글의 기본 작성자이고 `site.tagline`은 푸터 문구입니다.

홈의 큰 제목 아래 소개는 현재 언어의 `site.hero`로 설정합니다. `site.description`은 사이트 기본 설명이며 홈 메타 설명에는 해당 언어의 `messages.siteDescription`이 우선합니다. `site.description`만 바꿔서는 화면의 소개가 바뀌지 않습니다.

소셜 아이콘은 `github`, `twitter`, `mastodon`을 지원합니다. `social: { links: [] }`로 링크를 비울 수 있습니다. 목록이 비어 있어도 헤더와 푸터에는 클릭할 수 없는 Mastodon, Twitter, GitHub 자리 표시자 아이콘 세 개가 표시됩니다. 목록에 항목을 넣으면 설정한 항목만 표시됩니다. `.env`의 `PUBLIC_SITE_TITLE`, `PUBLIC_SITE_URL` 같은 재정의 값이 설정 파일보다 우선하므로 변경이 반영되지 않으면 확인하세요.

프로젝트 루트의 `.env` 또는 호스팅 플랫폼의 빌드 환경에서 `PUBLIC_SITE_URL=https://your-domain.example`를 설정하면 `site.url`을 재정의합니다. 변경 후 개발 서버를 다시 시작하거나 다시 빌드하고 canonical, RSS, 사이트맵, 공유 이미지의 절대 URL이 해당 도메인을 사용하는지 확인하세요. 이에 맞는 starter의 `astro.config.mjs`와 URL 해석 스크립트가 필요하며 npm 테마 패키지만 업데이트하면 이 파일들은 갱신되지 않습니다.

## 3. 사용할 언어만 남기기

기본적으로 `en`, `ja`, `ko`, `es`, `zh`가 모두 활성화되어 있습니다. 첫 예제는 기본 언어를 `ko`로 설정할 뿐 다른 언어를 끄지 않습니다. 한국어만 사용하려면 홈 소개 설정을 유지하면서 기존 `i18n`에 다음을 합칩니다.

```ts
i18n: {
  defaultLocale: 'ko',
  locales: {
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: true } },
    es: { meta: { enabled: false } },
    zh: { meta: { enabled: false } },
  },
},
```

설정은 기본값과 깊게 병합됩니다. 언어를 생략해도 삭제되지 않으므로 `meta.enabled: false`를 명시해야 합니다. 기본 언어는 항상 활성화됩니다. 언어 설정은 메뉴와 경로를 제어하지만 글을 번역하거나 파일을 지우지 않습니다. `/ko/`에서 언어 메뉴를 확인하세요.

## 4. 예제를 교체하고 첫 글 쓰기

글은 `src/content/blog/<언어 코드>/`에 있습니다. 기본 언어별 `welcome-to-anglefeint.md`와 세 개의 `starter-guide-*.md`는 이 가이드를 포함한 예제 글입니다. 백업한 뒤 불필요한 예제 Markdown을 삭제하거나 참고용으로 남겨도 됩니다. 설정 디렉터리나 남아 있는 글이 참조하는 이미지는 삭제하지 마세요.

```bash
npm run new-post -- my-first-post
```

활성화된 언어마다 같은 이름의 글 파일을 만들지만 본문은 번역하지 않습니다. `src/content/blog/ko/my-first-post.md`에서 제목, 설명, 본문을 작성하고 `/ko/blog/my-first-post/`를 엽니다. 글 필드, 이미지, 태그는 가이드 2에서 설명합니다.

## 5. 검사, 빌드, 배포

개발할 때는 `npm run dev`를 사용합니다. 배포 전 프로젝트 디렉터리에서 실행하세요.

```bash
npm run check
npm run build
npm run preview
```

`check`는 설정과 어댑터, Astro 파일, 빌드된 About 설정을 검사합니다. `build`는 검색 인덱스와 기본 자동 공유 이미지를 포함한 정적 결과물을 `dist/`에 생성합니다. `preview`는 빌드 결과를 로컬에서 확인할 뿐 인터넷에 배포하지 않습니다. Ctrl+C로 종료합니다.

정적 호스팅의 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`로 설정하고 먼저 `site.url`을 실제 도메인으로 바꾸세요. 저장소 연결, 도메인, 배포 방법은 [Astro 배포 가이드](https://docs.astro.build/en/guides/deploy/)의 플랫폼별 설명을 참고하세요. 배포 후 홈, 글, 언어 전환, 검색, `/<언어 코드>/rss.xml`을 확인합니다. 글이나 설정을 바꿨다면 다시 빌드하고 배포해야 합니다.

## 6. 설정할 때 기억할 세 가지

`src/site.config.ts`의 설정 객체를 편집하세요. `src/config/*` 같은 생성된 어댑터 파일에 예제를 붙여 넣지 마세요.

같은 객체 안에 `theme`와 `i18n`은 각각 하나만 둡니다. 기능별 예제는 기존 객체에 합치고 같은 키를 반복해서 추가하지 마세요. 생략한 설정은 기본값을 사용하며 곡 목록이나 소셜 링크 같은 배열은 전체가 교체됩니다.

기존 프로젝트에서 npm 패키지를 업데이트해도 로컬 starter 파일은 자동 갱신되지 않습니다. 설정이나 기능이 없다면 [업그레이드 가이드](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)를 확인하세요. 오류를 없애기 위해 설정 보조 파일을 임의로 삭제하지 마세요.

## 이 가이드 시리즈

- [사용 가이드 1: 블로그 시작하기](/ko/blog/starter-guide-1-configure-your-site/)
- [사용 가이드 2: 글 작성과 콘텐츠 관리](/ko/blog/starter-guide-2-languages-and-routing/)
- [사용 가이드 3: 필요한 기능 켜기와 사용자 설정](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)
