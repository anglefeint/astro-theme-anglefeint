---
tags: ['anglefeint', 'starter']
title: '사용 가이드 2: 글 작성과 콘텐츠 관리'
subtitle: '글 작성, 표지와 태그, 목차, 이미지 미리보기, 코드 복사, 검색, 공유 이미지를 설명합니다.'
description: '글 작성, 표지와 태그, 목차, 이미지 미리보기, 코드 복사, 검색, 공유 이미지를 설명합니다.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

## 일상적인 글쓰기는 콘텐츠 파일에서

가이드 1의 설치와 설정을 마쳤다고 가정합니다. 사이트 전체 설정은 `src/site.config.ts`에, 글 제목과 태그 및 개별 옵션은 Markdown 상단의 frontmatter, 즉 두 `---` 사이에 작성합니다. 서로 다른 위치입니다.

## 1. 글 만들기와 URL 이해하기

프로젝트 루트에서 실행합니다.

```bash
npm run new-post -- my-first-post
```

기본적으로 활성 언어별 파일을 만듭니다. 한국어만 만들려면 위 명령 대신 다음을 사용하세요. 둘 다 실행할 필요는 없습니다.

```bash
npm run new-post -- my-first-post --locales ko
```

파일은 `src/content/blog/ko/my-first-post.md`, 주소는 `/ko/blog/my-first-post/`입니다. slug는 영문 소문자, 숫자, 하이픈만 사용하며 공백과 밑줄은 허용되지 않습니다. 같은 파일이 있으면 덮어쓰지 않고 건너뜁니다.

`--locales`는 만들 파일만 선택하며 언어를 활성화하지 않습니다. 경로 생성에는 사이트 설정도 필요합니다. 번역 글은 같은 파일명을 유지하고 본문은 언어별로 작성하세요. 번역이 없는 언어로 글에서 전환하면 해당 언어의 블로그 목록으로 이동합니다.

## 2. frontmatter와 표지 작성하기

파일 맨 앞에 아래 내용을 넣고 두 번째 `---` 다음에 본문을 씁니다.

```yaml
---
title: 'My first post'
description: 'What I learned while building my blog.'
pubDate: '2026-09-18'
tags: ['astro', 'notes']
---
```

`title`, `description`, `pubDate`는 필수입니다. `subtitle`, `updatedDate`, `author`는 선택이며 작성자를 생략하면 사이트 작성자를 사용합니다. 목록은 `pubDate` 최신순입니다. 현재 초안이나 예약 발행 필터는 없습니다. `draft: true`나 미래 날짜로 숨길 수 없으므로 미완성 글은 콘텐츠 디렉터리 밖에 보관하세요.

표지는 글 옆에 이미지를 놓고 `heroImage: ./cover.jpg`로 지정하거나 생성 명령이 배정한 로컬 경로를 유지합니다. 자동 배정은 `src/assets/blog/default-covers/`에 이미지가 있을 때만 작동하며 이미지를 다운로드하지 않습니다. `heroImage`는 생략할 수 있습니다. 읽기 시간과 글자 수 등의 지표는 자동 계산하므로 일반 글에서는 직접 입력할 필요가 없습니다.

이 값은 추정치이며 AI 서비스에서 측정한 데이터가 아닙니다. frontmatter의 `readMinutes`, `wordCount`, `tokenCount`, `aiLatencyMs`, `aiConfidence` 값이 자동 계산보다 우선하며, 생략하면 추정치를 사용합니다. 일부 데모 글에는 표시 예시를 위한 고정값이 있습니다.

## 3. 제목으로 목차 생성하기

일반적인 2단계, 3단계 제목을 작성합니다.

```md
## First topic

Write your explanation here.

### A closer look

Add details here.
```

목차는 기본으로 켜져 있고 `##`, `###`에서 생성됩니다. 넓은 화면에서는 본문 오른쪽, 좁은 화면에서는 본문 앞에 표시하며 대상 제목이 없으면 숨깁니다. 이 페이지의 목차로 확인할 수 있습니다.

한 글에서 끄려면 기존 frontmatter에 추가하세요.

```yaml
toc: false
```

`toc: true`는 사이트 전체 비활성 설정을 재정의합니다. 생략하면 `theme.toc.enabled`를 따릅니다. MDX의 일반 Markdown 제목도 가능하지만 컴포넌트 내부나 원시 HTML/JSX로 만든 제목은 자동 수집하지 않습니다.

## 4. 태그로 글 정리하기

frontmatter에 `tags: ["astro", "notes"]`를 넣으면 됩니다. 별도의 태그 설정이나 수동 경로가 필요 없습니다. 빌드 시 언어별 태그 목록과 페이지로 나뉜 글 목록을 생성합니다. 블로그의 태그 입구나 본문의 태그를 클릭하거나 `/ko/tags/`에서 확인하세요.

대소문자를 구분하므로 `Astro`와 `astro`는 다릅니다. 앞뒤 공백은 제거하고 같은 글의 중복 태그는 한 번만 셉니다. 한글과 특수 문자는 안정적인 URL로 인코딩되므로 주소를 추측하지 말고 생성된 링크를 사용하세요. 태그 이름을 바꾸면 링크도 바뀝니다. 태그 없는 글도 정상 표시됩니다. `theme.tags.enabled: false`는 태그 입구와 페이지 생성을 끕니다.

## 5. 이미지 미리보기와 코드 복사는 설정 없이 사용

본문 이미지는 글 옆 파일이나 `public/images/` 안의 파일을 참조할 수 있습니다. 아래는 두 가지 방법입니다. 사용할 이미지 파일을 먼저 넣으세요.

```md
![A description of the image](./photo.jpg)

![A description of the image](/images/photo.jpg)
```

일반 본문 이미지를 클릭하거나 포커스 후 Enter/스페이스를 누르면 확대됩니다. Esc, 닫기 버튼, 배경 클릭으로 닫습니다. 표지나 링크·버튼 안의 이미지는 제외됩니다. 브라우저가 이미 선택한 이미지 소스를 사용하므로 고해상도 원본을 자동으로 가져오거나 갤러리를 넘기는 기능은 아닙니다.

코드는 일반 Markdown 코드 펜스로 작성합니다.

````md
```js
console.log('Hello, world!');
```
````

오른쪽 위에 복사 버튼이 자동으로 나타나며 들여쓰기와 줄바꿈을 유지합니다. HTTPS 또는 localhost에서 확인하세요. 클립보드 접근 실패 시 수동 복사 안내가 표시됩니다. 두 기능 모두 별도의 스위치가 필요 없습니다.

## 6. 검색은 빌드 후 확인하기

검색은 기본으로 켜져 있고 현재 언어의 글 제목과 본문을 검색합니다. `npm run build`로 인덱스를 생성한 뒤 `npm run preview`를 실행하세요. 헤더 검색에서 본문의 한 문장을 찾아 글로 이동하는지 확인합니다. `npm run dev`는 개발 안내만 표시하며 실시간 전문 검색을 제공하지 않습니다.

한 글을 인덱스에서 제외하려면 frontmatter에 추가합니다.

```yaml
search: false
```

비공개나 초안 설정은 아닙니다. 직접 주소나 목록으로 계속 접근할 수 있습니다. `theme.search.enabled: false`는 전역 검색 입구와 인덱스 생성을 함께 끕니다. 글을 바꾸면 다시 빌드하세요.

## 7. 자동 공유 이미지와 직접 지정

기본 빌드는 `ogImage`가 없는 글에 제목, 글 작성자(생략하면 사이트 작성자), 사이트 이름을 사용한 1200×630 PNG를 생성합니다. 이미지 API나 글마다 별도 제작이 필요 없으며 본문 표지인 `heroImage`를 바꾸지 않습니다.

직접 지정하려면 글 옆에 `share.png`를 놓고 frontmatter에 추가합니다.

```yaml
ogImage: ./share.png
```

`public/images/share.png`라면 `ogImage: /images/share.png`를 사용합니다. HTTPS 이미지 직링크도 지원합니다. 로컬 파일이 없으면 오류가 발생하며 외부 이미지는 해당 서비스에 의존합니다.

직접 지정한 `ogImage`가 우선합니다. `theme.socialImage.enabled: false`는 자동 생성만 끄므로 수동 이미지는 유효하며 나머지는 표지나 기본 이미지로 대체됩니다. 빌드된 글 HTML의 `og:image`를 확인하세요. 자동 생성 파일은 `dist/_social/`에 있습니다. 재배포해도 공유 플랫폼에 이전 미리보기가 캐시될 수 있습니다. 내장 글꼴은 모든 이모지와 문자 체계를 보장하지 않습니다.

## 8. 독립 페이지는 new-page로 만들기

프로젝트 소개 페이지를 만드는 예입니다.

```bash
npm run new-page -- projects --theme cyber
```

`src/pages/[lang]/projects.astro`를 만들고 활성 언어에 대해 `/<언어 코드>/projects/`를 생성합니다. 이 Astro 파일에 내용을 작성하세요. 본문 번역이나 헤더 메뉴 추가는 자동으로 하지 않습니다.

`--theme`은 `base`, `ai`, `cyber`, `hacker`, `matrix` 중 하나를 선택합니다. slug는 `projects/labs` 같은 중첩 경로도 지원하며 각 부분은 영문 소문자, 숫자, 하이픈만 사용합니다. 같은 페이지가 있으면 오류가 나므로 동일 경로에 다섯 테마 명령을 연속 실행하지 마세요. 일반 글은 `new-post`로 만듭니다.

## 이 가이드 시리즈

- [사용 가이드 1: 블로그 시작하기](/ko/blog/starter-guide-1-configure-your-site/)
- [사용 가이드 2: 글 작성과 콘텐츠 관리](/ko/blog/starter-guide-2-languages-and-routing/)
- [사용 가이드 3: 필요한 기능 켜기와 사용자 설정](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)
