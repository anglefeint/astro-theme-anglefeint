---
tags: ['anglefeint', 'starter']
title: '사용 가이드 2: 글 작성과 콘텐츠 관리'
subtitle: '글 작성, 표지와 태그, 목차, 이미지 미리보기, 코드 복사, 검색, 공유 이미지를 설명합니다.'
description: '글 작성, 표지와 태그, 목차, 이미지 미리보기, 코드 복사, 검색, 공유 이미지를 설명합니다.'
pubDate: '2026-03-07'
updatedDate: '2026-11-11'
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

글을 실질적으로 수정하면 `updatedDate`에 실제 수정 날짜를 넣으세요. sitemap은 `updatedDate`, 없으면 `pubDate`를 사용하며 빌드할 때마다 새 날짜를 만들지 않습니다. 날짜가 검색 엔진 색인을 보장하지는 않습니다.

표지는 글 옆에 이미지를 놓고 `heroImage: ./cover.jpg`로 지정하거나 생성 명령이 배정한 로컬 경로를 유지합니다. 자동 배정은 `src/assets/blog/default-covers/`에 이미지가 있을 때만 작동하며 이미지를 다운로드하지 않습니다. `heroImage`는 생략할 수 있습니다. 단어 수와 tokens는 자동 계산하므로 일반 글에서는 직접 입력할 필요가 없습니다.

단어 수와 tokens는 추정치이며 AI 서비스에서 측정한 데이터가 아닙니다. frontmatter의 `wordCount`와 `tokenCount`로 각각 덮어쓸 수 있습니다. 글 페이지에는 읽기 시간, 지연 시간, 신뢰도를 표시하지 않습니다. 기존 글의 관련 필드는 그대로 두어도 됩니다.

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

자동 공유 이미지는 코드 레인, 터미널, 네온 네트워크 배경을 포함하며 사이트 이름, 제목, 작성자는 사용자 콘텐츠에서 가져옵니다. 오른쪽 아래의 작은 `Theme by Anglefeint` 문구는 `theme.footer.showCredits`(기본 `true`)를 따릅니다. `false`로 설정하면 푸터와 이미지의 크레딧을 함께 숨깁니다. 변경 후 다시 빌드하고 배포하세요. 사용자 지정 `ogImage`는 수정하지 않습니다. 배경은 오프라인으로 사용되며 브라우저 JavaScript를 추가하지 않습니다.

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

---

## 테마 업그레이드

표준 페이지, 기본 설정, 번역과 빌드 기능은 테마 패키지가 관리합니다. 글, `src/site.config.ts`, 음악, 이미지와 사용자 페이지는 프로젝트에 남습니다.

npm을 사용하는 새 integration starter의 루트에서 아래 명령을 실행하세요. 호환성을 검사하고 의존성 파일을 백업한 뒤 정확한 버전을 설치하고 doctor를 실행합니다. 실패하면 의존성 파일을 복원하고 이전 의존성 재설치를 시도합니다. 배포는 기존 절차로 진행하며 자동 게시하지 않습니다.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

0.27 이전 프로젝트는 한 번 새 starter로 이전해야 합니다. 별도 폴더에 만들고 글과 리소스를 복사하며 개인 설정을 새 site config에 병합하세요. 이전 표준 라우트, adapter, defaults/schema/runtime 파일은 복사하지 마세요. slug, 언어 경로, 음악·이미지 URL과 호스팅 설정을 유지하세요.

자동 업데이트는 현재 npm만 지원하며 pnpm/yarn/bun 잠금 파일이 있으면 중단합니다. `--check`는 읽기 전용이며 `--to 0.27.1`으로 버전을 지정합니다. [업그레이드 안내](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)와 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)를 확인하세요.

업그레이드 실패 시 `dist/`를 배포하지 마세요. 의존성 복원은 이전 빌드 결과물을 복원하지 않습니다. 오류를 해결하고 `npm run doctor`가 성공한 뒤 배포하세요. pnpm 사용자는 릴리스 호환성을 확인하고 잠금 파일을 유지한 채 `pnpm add @anglefeint/astro-theme@latest`와 `pnpm run doctor`로 수동 업데이트하세요.

[사용자 가이드 5: 조각 게시하기](../starter-guide-5-fragments/) — 짧은 생각을 Markdown으로 기록하고 선택적으로 팝업 댓글을 사용합니다.
