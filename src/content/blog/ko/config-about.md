---
tags: ['anglefeint', 'config']
title: '설정 사전: About'
subtitle: '개인 소개, 연락처, 도구 패널과 Hacker 터미널입니다.'
description: '실제 코드로 About 콘텐츠, 문구, 도구, 효과의 기본값·제한과 현재 미사용 구형 필드를 조회합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

내 소개부터 바꾸려면 [페이지·기능 가이드](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/), 설치·설정 위치는 [첫 가이드](/ko/blog/starter-guide-1-configure-your-site/)를 읽으세요. 다른 모듈은 [설정 사전 시작 페이지](/ko/blog/config-reference/)에 있습니다.

About은 Markdown 글에서 본문을 읽지 않습니다. 콘텐츠는 `src/site.config.ts`의 `i18n.locales.<语言>.about`, 페이지·절 제목은 같은 언어의 `messages.about`입니다. 패키지 기본값이며 demo 개인 소개를 기본으로 취급하지 마세요.

<a id="page-enabled"></a>

## theme.enableAboutPage: 페이지 스위치

- **타입 / 기본값:** boolean / true.
- **상태와 역할:** 활성 언어의 `/<语言>/about/`를 만듭니다. 끄면 표준 페이지를 만들지 않고 공용 내비게이션·Contact의 About 목적지도 제공하지 않습니다.
- **제한:** 개별 문단 숨김이나 설정 삭제가 아닙니다. 꺼진 주소를 홈으로 자동 이동하지 않습니다. 재빌드·재배포가 필요하며 이전 파일·공개 데이터 삭제 보장도 아닙니다.
- **예시:** `theme: { enableAboutPage: false }`.

<a id="about-content"></a>

## About 콘텐츠·도구 필드

전체 접두사는 **`i18n.locales.<语言>.about.`**입니다. sections.who의 예는 `i18n.locales.zh.about.sections.who`입니다. 병합 전 덮어쓰기 타입이며 모두 생략 가능합니다. 대체 언어·기본값으로 채웁니다. 현재 zh / en은 같은 영어 임시 기본 설정을 쓰므로 표에 한 기본값으로 표시합니다. 다른 언어에는 독립 번역이 있을 수 있으므로 영어값을 그대로 추론하지 마세요.

문자열에 공통 길이·URL 검증은 없습니다. 용도별 짧은 문구·유효 이메일·링크를 쓰세요. 배열은 string[]이며 전체 대체하고 항목별 병합하지 않습니다. 빈 문자열은 공통 끄기가 아니므로 각 행을 보세요. 예시 값은 해당 객체 수준에 넣습니다.

<a id="body-fields"></a>

### 본문

| 필드                   | 타입     | zh / en 기본값                                                                                       | 상태·역할·제한                                                                     | 중국어 간체 예시 값                 |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | 적용: 제목 위 상태 행이며 빈 문자열로 행을 숨깁니다.                               | `"profile ready"`                   |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | 적용: Who 본문이며 절 제목은 바꾸지 않습니다.                                      | `"我是一名前端开发者。"`            |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | 적용: What 본문입니다.                                                             | `"我在构建个人博客与开源工具。"`    |
| `sections.ethos`       | string[] | [배열 기본값](#array-defaults)의 sections.ethos 참조                                                 | 적용: 배열 항목마다 원칙 하나입니다. 빈 배열은 항목만 비우고 절 제목은 유지합니다. | `["先保证清晰。","持续小步交付。"]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | 적용: Now 본문입니다.                                                              | `"最近在学习 Astro。"`              |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | 적용: 연락 부분의 시작이며 뒤 안내·링크와 이어집니다.                              | `"欢迎交流。"`                      |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | 적용: 하단 인용이며 가상 about.md에도 들어갑니다.                                  | `"保持好奇。"`                      |

<a id="contact-fields"></a>

### 연락처

| 필드                  | 타입   | zh / en 기본값                  | 상태·역할·제한                                                                                             | 중국어 간체 예시 값             |
| --------------------- | ------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`             | 조건부: trim 후 비면 이메일·contactEmailLead를 숨깁니다. 링크는 원 문자열이므로 공백을 넣지 마세요.        | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"` | 적용: 연락 링크이며 social.links와 독립입니다. 빈값도 전체 링크를 숨기지 않으므로 전체 HTTPS를 권장합니다. | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                      | 적용: 위 링크의 가시 문구이며 GitHub로 한정되지 않습니다.                                                  | `"我的 GitHub"`                 |

<a id="tool-fields"></a>

### 도구 입구

| 필드                 | 타입   | zh / en 기본값         | 상태·역할·제한                                                                             | 중국어 간체 예시 값 |
| -------------------- | ------ | ---------------------- | ------------------------------------------------------------------------------------------ | ------------------- |
| `sidebar.dlData`     | string | `"DL Data"`            | 적용: 사이드바 DL Data 버튼·접근성 이름입니다. 이름이 기능을 바꾸지 않습니다.              | `"数据面板"`        |
| `sidebar.ai`         | string | `"AI"`                 | 적용: 사이드바 AI 버튼·접근성 이름입니다.                                                  | `"我的工具栈"`      |
| `sidebar.decryptor`  | string | `"Decryptor"`          | 적용: 디코더 입구이며 내부 버튼 문구는 아닙니다.                                           | `"解码工具"`        |
| `sidebar.help`       | string | `"Help"`               | 적용: 사이드바 키보드 패널 입구입니다.                                                     | `"键盘"`            |
| `sidebar.allScripts` | string | `"All Scripts"`        | 적용: 현재 언어 글 디렉터리 입구입니다.                                                    | `"全部文章"`        |
| `scriptsPath`        | string | `"/root/bash/scripts"` | 적용: 디렉터리 표시·가상 파일 접두사·초기 터미널 디렉터리이며 실제 디스크 경로는 아닙니다. | `"/home/me/notes"`  |

<a id="label-fields"></a>

### 공통 문구

| 필드                        | 타입   | zh / en 기본값    | 상태·역할·제한                                                                                  | 중국어 간체 예시 값 |
| --------------------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------- | ------------------- |
| `labels.modalOutput`        | string | `"Output"`        | 열린 도구 제목에는 현재 미사용입니다. 초기 HTML 자리표시자이며 열 때 modals title로 덮어씁니다. | `"输出"`            |
| `labels.modalClose`         | string | `"Close"`         | 적용: 도구 팝업·본문 창 닫기 접근성 문구이며 기능 자체를 끄지 않습니다.                         | `"关闭"`            |
| `labels.responseOutput`     | string | `"Output"`        | 적용: 본문 위 OUTPUT 라벨입니다.                                                                | `"OUTPUT"`          |
| `labels.contactEmailLead`   | string | `"Reach me via"`  | 조건부: 이메일이 있을 때 앞에 표시합니다.                                                       | `"邮箱："`          |
| `labels.contactConnectLead` | string | `"or connect on"` | 적용: 연락 링크 앞에 항상 나오며 이메일이 없어도 남으므로 문장 연결을 확인하세요.               | `"也可以访问"`      |
| `labels.backToTop`          | string | `"Back to top"`   | 조건부: 맨 위로 안내·접근성 이름이며 표시 임계값은 안 바꿉니다.                                 | `"回到顶部"`        |
| `labels.quickAccess`        | string | `"Quick access"`  | 적용: 도구 사이드바의 접근성 이름입니다.                                                        | `"快捷工具"`        |
| `labels.contactEmailLabel`  | string | `"email"`         | 조건부: 이메일 링크 문구이며 실제 주소는 아닙니다. 이메일이 있어야 표시합니다.                  | `"发邮件"`          |

<a id="modal-fields"></a>

### 도구 팝업

| 필드                                      | 타입     | zh / en 기본값                                        | 상태·역할·제한                                                                                         | 중국어 간체 예시 값                         |
| ----------------------------------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                    | 조건부: 데이터 애니메이션 팝업 제목입니다.                                                             | `"数据传输"`                                |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                     | 조건부: 팝업 부제이며 애니메이션일 뿐 파일을 다운로드하지 않습니다.                                    | `"演示数据"`                                |
| `modals.ai.title`                         | string   | `"AI"`                                                | 조건부: AI 텍스트 패널 제목입니다.                                                                     | `"工具与工作流"`                            |
| `modals.ai.lines`                         | string[] | [배열 기본값](#array-defaults)의 modals.ai.lines 참조 | 조건부: 줄바꿈으로 합친 정적 일반 텍스트이며 AI를 호출하지 않습니다. 빈 배열도 빈 pre로 패널을 엽니다. | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                  | 조건부: 현재 디코더 팝업 제목이며 계속 사용합니다.                                                     | `"本地解码工具"`                            |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                                | 현재 미사용: 구형 계산기 문구이며 DecoderForm은 읽지 않습니다.                                         | `"计算中"`                                  |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                       | 현재 미사용: 현 디코더를 바꾸지 않습니다.                                                              | `"已尝试密钥"`                              |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                               | 현재 미사용: 현 디코더를 바꾸지 않습니다.                                                              | `"当前口令"`                                |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                        | 현재 미사용: 현 디코더를 바꾸지 않습니다.                                                              | `"主密钥"`                                  |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                     | 현재 미사용: 현 디코더를 바꾸지 않습니다.                                                              | `"临时密钥"`                                |
| `modals.help.title`                       | string   | `"Help"`                                              | 조건부: 키보드 패널 제목입니다.                                                                        | `"键盘面板"`                                |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                              | 조건부: 키보드 통계 제목이며 빈 문자열은 내장 영어로 대체합니다.                                       | `"输入统计"`                                |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                        | 조건부: 입력 수 접두사이며 빈 문자열은 내장 영어로 대체합니다.                                         | `"已输入："`                                |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                        | 조건부: 입력 수 접미사이며 빈 문자열은 내장 영어로 대체합니다.                                         | `"个字符"`                                  |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                                | 조건부: 글 목록 팝업 제목이며 scriptsPath와 독립으로 자동 연동하지 않습니다.                           | `"文章目录"`                                |

<a id="effect-fields"></a>

### 효과

| 필드                       | 타입     | zh / en 기본값                                                | 상태·역할·제한                                                                                               | 중국어 간체 예시 값     |
| -------------------------- | -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `effects.backgroundLines`  | string[] | [배열 기본값](#array-defaults)의 effects.backgroundLines 참조 | 현재 표준 About은 표시하지 않습니다. 상호작용 session이 없을 때 대체 분기만 사용하며 배경 스위치가 아닙니다. | `["~ $ hello","ready"]` |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                            | 조건부: 스크롤 30% 안내이며 빈값은 context parsed입니다.                                                     | `"读到这里了"`          |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                          | 조건부: 스크롤 60% 안내이며 빈값은 inference stable입니다.                                                   | `"继续探索"`            |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                          | 조건부: 스크롤 90% 안내이며 빈값은 output finalized입니다.                                                   | `"感谢阅读"`            |

본문은 일반 텍스트이며 Markdown·HTML을 해석하지 않습니다. 줄바꿈은 스타일로 유지합니다. **굵게**, 링크 문법, HTML 태그를 써도 서식이 되지 않습니다. 본문을 비워도 절 제목·목차는 남으며 순서와 who / what / ethos / now / contact 앵커는 고정입니다.

`scriptsPath`는 /home/me/notes처럼 / 시작의 짧은 절대 가상 디렉터리를 권장합니다. 줄바꿈·널·파일 충돌 경로는 피하세요. .·..·중복 슬래시를 정규화하며 1024자 초과·불법 제어 문자는 가상 파일 초기화를 실패시킬 수 있습니다. shell을 실행하거나 서버 임의 디렉터리를 읽지 않습니다. 현재 언어 글·`about.md`만 사용하며 All Scripts는 사용자 스크립트 실행 목록이 아닙니다.

DL Data는 진행 애니메이션이지 실제 다운로드가 아닙니다. AI의 model·latency 기본값도 정적이며 실시간 상태가 아닙니다. 실제 개인 정보로 바꾸거나 데모임을 명시하세요.

Help 통계 세 문구는 스크립트가 패널 HTML에 합치므로 신뢰하는 짧은 일반 텍스트만 쓰고 외부 입력을 넣지 마세요. 빈 문자열은 영어 대체이며 라벨 비우기가 아닙니다. 다른 본문·AI 행과 렌더링이 다르므로 모든 설정이 HTML을 지원한다고 생각하지 마세요.

스크롤 안내는 전체 문서 진행률입니다. 스크롤 시작 뒤 각 임계값은 초기화당 최대 한 번입니다. 읽은 단어·AI 진행이 아니며 임계값·시간 공개 설정은 없습니다. 빈 문자열로 끌 수 없습니다.

<a id="array-defaults"></a>

### 세 배열의 기본값

zh / en의 실제 전체 배열이며 순서·빈 줄에도 의미가 있습니다. 배열 교체는 모든 요소를 바꿉니다.

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## 페이지 제목·공유 컨트롤 문구

`i18n.locales.<语言>.messages` 아래이며 about 안이 아닙니다. 선택적 string, 현재 언어·대체값을 사용하고 표는 중국어 간체 / 영어 기본값입니다. 예시 값은 해당 필드에 씁니다. 기능·절 ID는 바꾸지 않습니다.

### messages.about

| 필드                | 중국어 간체 / 영어 기본값                                                                               | 역할·제한                                                                                 | 중국어 간체 예시 값        |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | 조건부: 페이지 title, 본문 h1, 창 제목, 가상 about.md 제목입니다.                         | `"关于我"`                 |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | 조건부: 메타 설명이며 본문 아래 소개를 자동 추가하지 않습니다.                            | `"我的经历、工作与兴趣。"` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | 조건부: Who 제목·목차이며 본문·앵커는 유지합니다.                                         | `"我是谁"`                 |
| `about.what`        | 我在构建什么 / What I Build                                                                             | 조건부: What 제목·목차입니다.                                                             | `"我在做什么"`             |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | 조건부: Ethos 제목·목차입니다.                                                            | `"我的原则"`               |
| `about.now`         | 现在 / Now                                                                                              | 조건부: Now 제목·목차입니다.                                                              | `"最近在忙"`               |
| `about.contact`     | 联系 / Contact                                                                                          | 조건부: Contact 제목·목차이며 앵커는 contact입니다.                                       | `"联系我"`                 |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | 조건부: 스캔 버튼 문구·안내·접근성 이름이며 시각 효과만 실행하고 AI·본문 생성은 없습니다. | `"重新扫描"`               |

### messages.windowControls

| 필드                        | 중국어 간체 / 영어 기본값   | 역할·제한                                                    | 중국어 간체 예시 값 |
| --------------------------- | --------------------------- | ------------------------------------------------------------ | ------------------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content | 조건부: 본문 최소화·팝업 접기 문구입니다.                    | `"最小化"`          |
| `windowControls.expand`     | 放大窗口 / Expand window    | 조건부: 팝업 확대 문구이며 본문 전체화면은 fullscreen입니다. | `"放大"`            |
| `windowControls.restore`    | 还原窗口 / Restore window   | 조건부: 창 복원·복구 입구 문구입니다.                        | `"还原"`            |
| `windowControls.fullscreen` | 全屏阅读 / Full screen      | 조건부: 브라우저 전체화면 문구이며 권한은 바꾸지 않습니다.   | `"全屏"`            |

### messages.scriptFolders

| 필드                      | 중국어 간체 / 영어 기본값                                                                                    | 역할·제한                                                                | 중국어 간체 예시 값      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------ |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | 조건부: All Scripts의 제목 복사 버튼 안내·이름이며 전문 복사가 아닙니다. | `"复制标题"`             |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | 조건부: 복사 성공 상태입니다.                                            | `"标题已复制"`           |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | 조건부: 실패 상태이며 빈 문자열은 스크립트의 영어로 대체될 수 있습니다.  | `"复制失败，请手动复制"` |

<a id="example"></a>

## 병합 가능한 설정 예시

`src/site.config.ts`의 기존 `defineThemeConfig({...})`에 합치고 import·export·개인 설정을 유지하며 theme·i18n을 중복 생성하지 마세요.

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: '我是一名前端开发者。',
          what: '我在构建个人博客与开源工具。',
          ethos: ['先保证清晰。', '持续小步交付。'],
          now: '最近在学习 Astro。',
          contactLead: '欢迎交流。',
          signature: '保持好奇。',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: '文章目录' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: '关于我', description: '我的经历、工作与兴趣。' },
      },
    },
  },
},
```

대체 연결의 낮은 우선순위부터 재귀 병합하고 현재 언어가 덮어쓰며 기본 About이 보완합니다. 배열은 전체 대체, undefined는 덮어쓰지 않습니다. zh만 쓰면 중국어 간체만 바뀝니다. [다국어 가이드](/ko/blog/starter-guide-languages/)를 참고하세요.

<a id="boundaries"></a>

## 관련 설정과 제공하지 않는 기능

- **내비게이션·목차:** `i18n.locales.<语言>.messages.nav.about`은 공용 About·다시 열기 입구입니다. string, 중국어 간체 기본 “关于” / 영어 “About”, 예시 “关于我”입니다. `messages.blog.toc`는 About 목차 제목·이름입니다. string, 중국어 간체 기본 “文章目录” / 영어 “On this page”, 예시 “本页目录”이며 글에도 영향이 있습니다. [글 문구](/ko/blog/config-article/#article-messages) 참조.
- **전체 디코더:** `theme.enableDecoderPage`는 boolean, 기본 true입니다. `theme: { enableDecoderPage: false }`는 독립 페이지·팝업 전체 도구 입구를 끄지만 내장 디코더는 남깁니다. 내부 도구는 `messages.decoder`, `messages.decoderPage`를 쓰며 위 구형 다섯 필드를 쓰지 않습니다. [Decoder 사전](/ko/blog/config-decoder/) 참조.
- **터미널:** `messages.terminal`은 공통 상호작용 문구이며 `about.effects.backgroundLines`가 아닙니다. 제한된 웹 가상 파일 시스템으로 로컬 실행 권한을 주지 않습니다. 열여섯 필드·자리표시자·미사용 상태는 [터미널 사전](/ko/blog/config-terminal/) 참조.
- **창·애니메이션:** 전용 크기, 기본 닫힘, 본문 fade-in, 도구 숨김, 목차 순서, Oracle 개명·끄기 필드는 없습니다. 실행 상태·로컬 저장소가 창을 관리합니다. JavaScript 없이 본문은 읽을 수 있지만 도구는 보장하지 않습니다. 본문은 기본 즉시 보이며 스크롤 관찰기를 기다리지 않습니다. 시스템 동작 줄이기는 런타임이 처리하며 새 스위치가 아닙니다.
- **연락처:** contact는 `social.links`와 독립이므로 푸터 소셜을 바꿔도 About은 자동 변경되지 않습니다.

구형 decryptor 다섯 본문 필드는 타입만 받으며 현재 소비하지 않습니다. `backgroundLines`는 대체 분기, `modalOutput`은 초기 자리표시자입니다. 현재 도구 설정에 이 필드를 쓰거나 옛 문구에 맞추려고 구현을 바꿀 필요는 없습니다.
