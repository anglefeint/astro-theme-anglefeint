---
tags: ['anglefeint', 'starter']
title: '사용 가이드 3: 글과 Fragments에 이미지 넣기'
subtitle: '원본을 넣고 올바른 경로를 쓴 뒤 반응형 파일을 준비하고 표지와 공유 미리보기를 설정합니다.'
description: '글 본문, 표지, Fragments, 공유 이미지의 실제 처리 차이와 이미지 준비, Git 커밋, 배포 문제 해결을 설명합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

이 글은 입문 가이드의 3 / 8편입니다. [전체 가이드 순서](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order) · [필드별 설정 사전](/ko/blog/config-reference/).

여러 크기의 이미지를 직접 만들거나 글의 링크를 생성 파일 이름으로 바꿀 필요는 없습니다. 원본을 넣고 글이나 Fragment에서 참조한 다음 로컬 개발 서버가 필요한 반응형 파일을 준비하도록 하면 됩니다.

이 글은 starter의 기본 `src/`, `public/` 디렉터리를 기준으로 설명합니다. 먼저 이미지 용도를 구분하세요.

| 용도                 | 작성 위치                                                | 현재 처리 방식                                                                             |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 글 본문 이미지       | Markdown 이미지 또는 MDX 이미지                          | 기존 Markdown／MDX 이미지 흐름을 사용하며 아래의 영구 표지 준비 범위에 속하지 않습니다.    |
| 글 표지              | 글 frontmatter의 `heroImage`                             | 로컬에서 반응형 파일을 준비하며 목록과 글 상세가 공유합니다.                               |
| Fragment 이미지      | Fragment 본문의 Markdown 이미지, 참조 이미지, HTML `img` | 지원하는 로컬 이미지는 동일한 영구 반응형 파일을 사용하며 목록과 홈 미리보기가 공유합니다. |
| 공유 미리보기 이미지 | 글의 `ogImage` 또는 사이트의 `site.ogImage`              | 독립적인 공유 이미지 처리이며 표지 썸네일과는 다릅니다.                                    |

## 1. 원본을 프로젝트에 넣기

한 글에서만 쓰는 이미지는 글 옆에 둘 수 있습니다.

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

Fragments도 같은 방식으로 해당 Markdown 옆에 이미지를 둘 수 있습니다. 여러 페이지가 공유하는 이미지는 `public/images/`에 두어도 됩니다.

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

디렉터리가 없으면 직접 만드세요. 파일 이름은 단순한 영문, 숫자, 하이픈을 권장하며 대소문자가 헷갈리지 않게 하세요. URL 경로에는 `/`를 사용하고 컴퓨터의 `C:\...`, `D:\...`나 역슬래시 경로를 쓰지 마세요. 대소문자를 구분하는 시스템에 배포하면 `Photo.jpg`와 `photo.jpg`는 서로 다른 파일일 수 있습니다.

원본은 반드시 남겨 두세요. 나중에 만드는 WebP는 표시용 파생 파일이며 원본의 대체 백업이 아닙니다.

## 2. 글 본문에 이미지 넣기

글 Markdown을 열고 필요한 위치에 넣으세요.

```md
![这张照片里有什么](./photo.jpg)
```

`./photo.jpg`는 현재 글 파일 기준입니다. 위 디렉터리 예시에서는 같은 디렉터리의 `photo.jpg`를 가리킵니다. public의 파일은 다음처럼 씁니다.

```md
![这张照片里有什么](/images/shared-photo.jpg)
```

`public/images/shared-photo.jpg`에 대응하며 URL에는 `public`을 쓰지 않습니다. 대괄호 안은 이미지 대체 텍스트입니다. 단순히 “이미지”라고 쓰기보다 실제 내용을 설명하세요.

일반 본문 이미지는 클릭하거나 초점을 맞추고 Enter／스페이스를 누르면 확대됩니다. Esc, 닫기 버튼, 배경으로 닫습니다. 표지와 링크·버튼 안의 이미지는 참여하지 않습니다. 확대할 때는 브라우저가 이미 선택한 이미지 소스를 사용하며 더 높은 해상도의 원본을 자동 다운로드하지 않고 갤러리 전환도 제공하지 않습니다.

`prepare-covers`를 실행했다고 모든 본문 이미지가 압축되었다고 생각하면 안 됩니다. 이 명령은 표지 소스 풀, 글 표지 참조, Fragment 로컬 이미지를 처리합니다. 일반 글 본문의 public 이미지는 여전히 원본을 직접 다운로드할 수 있습니다. 본문에는 적절한 용량의 이미지를 선택하고 특히 수 MB 스크린샷을 그대로 넣지 마세요.

## 3. 글 표지 설정하기

글 옆에 `cover.jpg`를 넣은 뒤 기존 frontmatter에서 추가하거나 수정하세요.

```yaml
heroImage: ./cover.jpg
```

`heroImage`는 생략할 수 있습니다. 사용할 때는 프로젝트 안의 로컬 이미지 파일을 참조해야 하며 HTTPS 이미지 주소를 바로 넣을 수는 없습니다. 이 필드에 `/images/cover.jpg`를 public URL처럼 쓰지 마세요. 본문 이미지와 경로 규칙이 다릅니다.

새 표지를 한곳에서 관리하려면 `src/assets/blog/covers/originals/`에 두세요. 예를 들어 글이 `src/content/blog/zh/my-first-post.md`이고 원본이 `src/assets/blog/covers/originals/my-cover.jpg`라면 다음과 같이 씁니다.

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

표지는 본문에 자동 삽입되지 않습니다. 블로그·태그 목록과 글 상세의 표지 영역에서 사용합니다. 레이아웃에 따라 보이는 부분을 자를 수 있지만 생성 이미지 자체는 원래 비율을 유지하며 인물이나 피사체의 초점을 자동 선택하지 않습니다.

`new-post`가 표지를 자동 선택할 때는 `src/assets/blog/default-covers/`에서만 고릅니다. `covers/originals/`에 이미지를 넣었다고 자동 선택하지 않으므로 새 originals는 글에서 직접 참조해야 합니다.

## 4. Fragments에 이미지 추가하기

`theme.fragments.enabled: false`이면 dev, build, prepare-covers/doctor가 Fragments 본문의 이미지 참조를 건너뜁니다. 해당 참조만으로 처리 대상이 되는 이미지는 원본이나 파생 파일이 없어도 됩니다. 다만 글 표지 참조와 `src/assets/blog/default-covers/`, `src/assets/blog/covers/originals/` 이미지 풀은 Fragments 전용 이미지라도 준비와 검증을 계속합니다. 파일을 삭제하지 않으며 다시 켜면 Fragments 이미지 처리를 재개합니다.

**버전 안내:** 비활성 콘텐츠의 이미지 격리는 0.36.1부터 제공하며 0.36.0에는 없습니다. 이전 버전에서 지원한다고 가정하지 마세요.

원본을 `public/images/fragments/my-photo.png`에 넣고 기존 Fragment Markdown 본문에 씁니다.

```md
![这条碎片的配图说明](/images/fragments/my-photo.png)
```

Fragment 파일 옆에 `photo.png`를 두고 `![설명](./photo.png)`로 써도 됩니다. public에 이미지만 넣는다고 범용 이미지 라이브러리 스캔을 시작하지는 않습니다. 실제 Fragment에서 참조해야 합니다.

참조형 이미지도 지원합니다.

```md
![配图说明][photo]

[photo]: /images/fragments/my-photo.png
```

크기를 직접 지정해야 한다면 HTML을 사용할 수 있습니다.

```html
<img src="/images/fragments/my-photo.png" alt="配图说明" width="640" height="360" />
```

이 너비와 높이는 예시이므로 실제로는 내 이미지 비율에 맞추세요. 지원하는 로컬 이미지는 빠진 너비와 높이를 채워 줍니다. 이미 있는 크기는 유지하고 한쪽만 있으면 소스 비율로 다른 쪽을 계산합니다. 잘못 입력한 기존 크기를 자동으로 수정하지는 않습니다.

Fragment 목록은 페이지마다 첫 이미지를 기본 우선 로드하며 나머지 이미지와 홈 썸네일은 지연 로드합니다. 홈은 높이가 제한된 미리보기만 표시하고 넘치는 부분을 자릅니다. 전체 이미지 뷰어가 아니며 카드를 누르면 원래 Fragment로 이동합니다. 생성, 안정적인 ID, 댓글 설정은 [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)를 참고하세요.

## 5. 로컬에서 반응형 파일 준비하기

처음 이미지를 참조하거나 원본을 바꿨다면 프로젝트 루트에서 로컬 개발 서버를 실행하세요.

```bash
npm run dev
```

dev는 없거나 오래된 파일을 준비하며 관련 소스나 참조가 바뀌면 업데이트합니다. 로컬 `npm run doctor`도 먼저 준비한 다음 검사하고 빌드합니다. 페이지나 전체 검사를 시작하지 않고 이미지만 준비하려면 dev를 멈추고 실행하세요.

```bash
npx @anglefeint/astro-theme prepare-covers
```

생성하지 않고 기존 파일만 검사하려면 다음을 사용합니다.

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

매번 모든 이미지를 다시 인코딩할 필요는 없습니다. 원본, 처리 규칙, 출력 파일의 해시로 재사용 여부를 판단합니다. 원본이 바뀌면 해당 파생 파일을 갱신하며 파일 하나가 없거나 수정되었다면 필요한 부분만 복구합니다. manifest를 직접 고치거나 생성 파일 이름을 바꾸거나 생성 URL을 글에 다시 쓰지 마세요.

현재 준비 규칙은 다음과 같습니다.

- 정적 래스터 이미지는 품질 80의 WebP로 만듭니다. 손실 인코딩 목표이며 무손실 픽셀을 보장하지 않습니다.
- 후보 너비는 400, 640, 800, 960, 1200px입니다. 원본 너비에 맞는 크기를 남기고 필요하면 1200px 이하의 원본 너비를 추가합니다. 작은 이미지는 확대하지 않습니다.
- EXIF 방향을 반영하고 원래 비율을 유지합니다. 다른 구도의 크롭 버전은 만들지 않습니다.
- SVG와 여러 프레임의 애니메이션은 원래 형식을 유지하며 정적 WebP로 바꾸지 않습니다. 단일 프레임 GIF는 정적 이미지로 처리할 수 있으므로 확장자만으로 보존 여부를 판단하지 마세요.
- 기본 표지 풀, originals 풀, 실제 참조가 처리 범위를 결정합니다. public의 모든 이미지를 변환하지는 않습니다.

브라우저는 페이지의 `srcset`, `sizes`, 화면과 픽셀 밀도를 바탕으로 후보를 선택합니다. 사용자가 크기별 디렉터리를 관리할 필요는 없습니다. 최대 후보는 1200px이므로 큰 고밀도 화면에서 항상 원본 수준의 세부 묘사를 보장하지는 않습니다.

## 6. 커밋할 파일과 배포 작업

준비 뒤 관련 파일은 다음 위치에 있습니다.

```text
src/assets/blog/covers/
  originals/      # 如果使用这个原图目录
  manifest.json  # 来源、尺寸、规则与输出哈希
  generated/     # 持久响应式文件
```

다음을 함께 Git에 커밋하세요.

1. 글이나 Fragment Markdown과 추가하거나 바꾼 원본 이미지.
2. manifest와 생성 파일을 포함한 `src/assets/blog/covers/` 전체.

원본을 public이나 글 옆에 두었다면 그 위치의 파일도 커밋하세요. originals만 커밋하면 안 됩니다. manifest 디렉터리 이름이 blog/covers여도 Fragment 파생 파일을 여기에 저장합니다.

배포 전에 dev를 멈추고 로컬 `npm run doctor`를 실행하세요. 성공하면 `npm run preview`로 빌드 결과를 볼 수 있습니다. doctor는 빌드를 포함하므로 바로 build를 다시 실행할 필요는 없습니다. 호스팅 플랫폼은 계속 `npm run build`, 출력 디렉터리 `dist`를 사용하며 모든 파일을 배포합니다.

**배포 빌드는 준비된 반응형 파일을 검사하고 복사할 뿐 플랫폼에서 추가 생성하지 않습니다.** CI의 doctor도 검사만 합니다. 없거나 오래되었거나 수정되었다면 실패하므로 로컬에서 준비하고 커밋한 다음 다시 배포하세요. 이 영구 이미지 흐름은 배포 플랫폼의 Astro 이미지 캐시 보존에 의존하지 않습니다.

현재 사용하는 파생 파일은 빌드 결과의 `_blog-covers/`로 복사합니다. HTML만 올리거나 이 디렉터리를 빠뜨리지 마세요. 오래되어 더 쓰지 않는 generated 파일을 자동 삭제하지는 않습니다. 정리 전에 참조를 확인하고 아직 필요한 원본을 지우지 마세요.

필드 차이는 [글의 heroImage／ogImage](/ko/blog/config-article/#frontmatter)와 [Fragment 미리보기 규칙](/ko/blog/config-fragments/#preview-and-links)을 참고하세요.

## 7. 링크를 공유하면 어떤 이미지가 나오나요?

공유 이미지는 링크 카드용 미리보기이며 페이지의 표지와는 다릅니다.

기본적으로 빌드 시 제목, 작성자, 사이트 이름을 넣은 1200×630 PNG를 만듭니다. 이미지 서비스나 브라우저 생성이 필요하지 않습니다. 이 정보를 바꾼 뒤 다시 빌드하고 배포하세요. `theme.footer.showCredits`는 자동 공유 이미지의 테마 크레딧도 제어하지만 직접 올린 이미지는 바꾸지 않습니다.

### 글 하나에 공유 이미지 지정하기

글 옆에 `share.png`를 넣고 frontmatter에 씁니다.

```yaml
ogImage: ./share.png
```

또는 `public/images/share.png`에 파일을 두고 `ogImage: /images/share.png`를 사용하세요. HTTPS 이미지 직접 링크도 지원합니다. 상대 로컬 이미지는 글 이미지 schema가 처리하며 public 경로는 파일 존재 여부를 검사합니다. 외부 링크 사용 가능 여부는 상대 서버에 달려 있습니다.

### 전용 이미지가 없는 페이지의 기본 이미지 설정하기

`src/site.config.ts`의 기존 최상위 `site`에 합치세요.

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

먼저 `public/images/site-share.jpg`에 파일을 넣으세요. `site.ogImage`도 HTTPS 이미지 주소를 지원합니다. 생략하거나 비우면 테마 내장 1200×630 기본 이미지를 사용합니다. 여기에는 글 상대 경로를 쓸 수 없습니다.

현재 우선순위는 다음과 같습니다.

1. 글에서 명시한 `ogImage`.
2. 자동 생성이 켜져 있을 때의 글 공유 이미지.
3. `theme.socialImage.enabled`를 껐을 때의 글 `heroImage`.
4. 페이지에 전용 이미지가 없을 때의 `site.ogImage`, 마지막으로 테마 내장 기본 이미지.

따라서 `site.ogImage`만 바꿔도 글 자동 공유 이미지는 바뀌지 않습니다. Fragments 페이지와 각 `#ID` 링크는 사이트 기본 공유 이미지를 함께 사용하며 개별 Fragment 카드는 만들지 않습니다.

자동 공유 이미지는 `dist/_social/`에 있습니다. 공유 플랫폼은 배포된 페이지의 메타 정보를 가져오며 이전 이미지를 캐시할 수 있습니다. 로컬에서 새 이미지가 보여도 플랫폼 미리보기가 즉시 갱신된다는 뜻은 아닙니다.

## 8. 이미지 문제 해결하기

| 현상                                              | 먼저 확인할 사항                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 이미지가 나오지 않음                              | 파일 존재, 대소문자 일치, 현재 Markdown 기준의 상대 경로를 확인하세요. public URL에는 `public`을 넣지 않습니다.                |
| 표지 준비 실패                                    | `heroImage`가 프로젝트 안의 로컬 파일인지, 외부 링크나 public URL로 잘못 썼는지 확인하고 전체 터미널 오류를 읽으세요.          |
| missing／stale／modified derivatives 안내         | dev를 멈추고 로컬 prepare-covers를 실행한 뒤 원본, manifest, generated를 커밋하고 다시 빌드하세요.                             |
| public에 넣었지만 크기가 생성되지 않음            | Fragment 본문에서 실제 참조했는지 확인하세요. 일반 글 본문의 public 이미지는 이 파생 스캔 대상이 아닙니다.                     |
| GIF나 SVG가 여전히 큼                             | 여러 프레임·벡터는 원본을 유지하며 준비 명령이 영상을 만들거나 애니메이션을 압축하지 않습니다.                                 |
| 원격 Fragment 이미지가 느리거나 레이아웃이 움직임 | 외부 링크는 로컬 변환 대상이 아니며 테마는 원격 크기를 자동 추론할 수 없습니다. 소스를 최적화하고 올바른 너비와 높이를 쓰세요. |
| 로컬에는 있지만 배포 후 없음                      | 원본과 generated의 커밋 여부, 전체 dist의 배포 여부, 자원 경로의 재작성 여부를 확인하세요.                                     |
| 공유 이미지가 오래된 상태                         | 재빌드·재배포 여부, 글 전용 이미지가 사이트 기본 이미지보다 우선하는지, 플랫폼 캐시 여부를 확인하세요.                         |

Astro의 srcDir, publicDir이나 base가 있는 소스 경로를 바꿨다면 해당 프로젝트 설정의 dev로 준비하세요. 독립 prepare-covers 명령은 기본 디렉터리를 사용합니다. 이미지 처리에서 일부 base 경로를 지원한다고 테마 전체가 임의 하위 디렉터리 배포를 지원하는 것은 아닙니다.

설치나 업그레이드는 [블로그 설치와 내 정보 설정](/ko/blog/starter-guide-1-configure-your-site/), 글 필드와 본문 문법은 [첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/)를 참고하세요.

## 가이드 탐색과 설정 조회

[이전 글: 첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/) · [다음 글: Fragment 게시하기](/ko/blog/starter-guide-5-fragments/) · [여덟 편의 가이드 시작 페이지](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order).

관련 필드: [글 표지와 공유 이미지](/ko/blog/config-article/), [Fragment 이미지 미리보기](/ko/blog/config-fragments/), [사이트 기본 공유 이미지](/ko/blog/config-site-chrome/). 전체 경로, 기본값, 제한은 [설정 사전 시작 페이지](/ko/blog/config-reference/)를 참고하세요.
