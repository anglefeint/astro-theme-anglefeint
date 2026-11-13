---
tags: ['anglefeint', 'config']
title: '설정 사전: 터미널 안내와 읽기 전용 리더'
subtitle: 'About 가상 터미널의 문구 16개, 자리표시자, 설정 범위입니다.'
description: '실제 코드를 기준으로 터미널 문구의 타입, 기본값, 자리표시자, 빈 값 대체와 적용 상태를 설명하고 현재 readerTitle 미사용을 표시합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

설정 파일 위치는 [설치와 사이트 정보](/ko/blog/starter-guide-1-configure-your-site/), About 콘텐츠·도구는 [About 사전](/ko/blog/config-about/)을 참고하세요. 다른 모듈은 [설정 시작 페이지](/ko/blog/config-reference/)에서 찾습니다.

현재 표준 사이트의 대화형 가상 터미널은 About에 있습니다. 여기서는 명령 안내, 오류 문구, 읽기 전용 리더의 접근 가능한 이름을 바꾸며 로컬·서버 shell은 실행하지 않습니다. 홈 와이드스크린 터미널의 작성자 문구는 messages.home.transmission이 제어하며 이 메시지를 사용하지 않습니다. [홈 사전](/ko/blog/config-home/#home-transmission)을 참고하세요.

<a id="messages"></a>

## messages.terminal의 열여섯 필드

전체 접두사는 `i18n.locales.<语言>.messages.terminal`입니다. 모두 생략 가능한 string 덮어쓰기이며 기본적으로 현재 언어의 내장 문구와 일반 언어 대체 연결을 사용합니다. 표에는 중국어 간체 / 영어 기본값만 나열하고 예시 값도 중국어 간체 원문을 유지했습니다. 적용에는 About 활성화, 터미널 초기화 성공, 해당 명령 결과나 읽기 모드가 필요합니다.

| 필드            | 중국어 간체 / 영어 기본값                                                                                                           | 상태, 역할과 제한                                                                                                                 | 중국어 간체 예시 값                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | 조건부 적용: 터미널 입력창의 접근 가능한 이름입니다. 명령 프롬프트 경로나 보이는 패널 제목은 바꾸지 않습니다.                     | `"终端输入"`                           |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | 조건부 적용: About 터미널 초기 안내입니다. 시작 시 가상 pwd도 실행합니다. 빈 문자열은 안내만 비우며 터미널을 끄지 않습니다.       | `"输入 help 查看命令。"`               |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | 조건부 적용: help 출력 설명입니다. 고정 명령 도움말이 뒤에 붙으며 빈 문자열로 전체 도움말을 숨기지는 않습니다.                    | `"只读浏览公开文章，不运行系统命令。"` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | 조건부 적용: 명령의 따옴표·이스케이프가 끝나지 않았을 때 안내입니다. 빈 문자열은 키 syntax로 대체합니다.                          | `"引号或转义未结束。"`                 |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | 조건부 적용: 인수 개수가 잘못되었을 때 안내입니다. {value}는 명령 사용법으로 바뀌며 빈 문자열은 키 usage로 대체합니다.            | `"用法：{value}"`                      |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | 조건부 적용: 미지원 명령 안내입니다. {value}는 명령 이름이며 문구로 명령을 추가할 수 없습니다.                                    | `"不支持命令：{value}"`                |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | 조건부 적용: 가상 파일·디렉터리가 없을 때입니다. {value}는 요청 경로이며 원격 HTTP 상태는 아닙니다.                               | `"未找到：{value}"`                    |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | 조건부 적용: cd 대상이 디렉터리가 아닐 때입니다. {value}는 대상 경로입니다.                                                       | `"不是目录：{value}"`                  |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | 조건부 적용: cat / vi / vim / view 대상이 파일이 아닐 때입니다. {value}는 대상 경로입니다.                                        | `"目标不是文件：{value}"`              |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | 조건부 적용: 파일 읽기 실패의 일반 안내입니다. {value}는 경로이며 원래 오류 세부 정보를 자동 추가하지 않습니다.                   | `"读取失败：{value}"`                  |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | 조건부 적용: 읽기 제한 초과 안내입니다. {value}는 경로이며 문구만 바꾸고 실제 한도는 늘리지 않습니다.                             | `"文件过大：{value}"`                  |
| `empty`         | （空目录） / (empty directory)                                                                                                      | 조건부 적용: ls 결과에 항목이 없을 때이며 빈 파일 본문 안내는 아닙니다.                                                           | `"目录为空。"`                         |
| `loading`       | 正在读取… / Loading…                                                                                                                | 조건부 적용: 명령 대기 중 Canvas 입력 위치 안내입니다. 빈 문자열은 ...로 대체하며 네트워크 로드 전략은 바꾸지 않습니다.           | `"正在读取…"`                          |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | 현재 미사용: 타입과 내장 문구는 남아 있지만 실제 리더 제목은 파일 title이나 path를 사용합니다. 입력해도 제목을 덮어쓰지 않습니다. | `"文章阅读器"`                         |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | 조건부 적용: 읽기 전용 안내입니다. 빈 문자열은 :q로 대체하며 종료 명령·단축키는 바꾸지 않습니다.                                  | `"只读 · :q 回车退出 · Esc 关闭"`      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | 조건부 적용: 읽기 모드 입력창의 접근 가능한 이름입니다. 빈 문자열은 원래 터미널 입력 이름으로 대체합니다.                         | `"阅读器命令输入"`                     |

<a id="placeholders"></a>

## {value} 자리표시자와 빈 문자열

usage, unknown, notFound, notDirectory, isDirectory, failed, tooLarge는 리터럴 {value}를 사용합니다. 스크립트는 첫 등장만 바꾸므로 명령·경로가 필요하면 한 번 유지하세요. 미지원 {path}, {command}는 쓰지 마세요. 대체값은 텍스트로 표시하며 실행하지 않습니다.

이 메시지에는 공통 “빈 문자열로 기능 끄기” 규칙이 없습니다. 위 명령 오류와 syntax가 비면 키 이름으로 대체합니다. loading은 ..., readerHint는 :q, readerCommand는 원래 입력 라벨로 대체합니다. hint, help, empty는 빈 문자열로 문구만 비울 수 있지만 터미널, 고정 도움말 명령, 디렉터리는 제거하지 않습니다.

readerTitle은 현재 미사용이며 UI 제목 스위치가 아닙니다. 기본 문자열이 언어 팩에 있어도 실제 소비 효과는 없습니다.

<a id="example"></a>

## 병합 가능한 중국어 간체 예시

src/site.config.ts의 기존 defineThemeConfig({...})에 합치고 다른 설정을 유지하며 i18n을 중복 생성하지 마세요. 중국어 간체만 덮어쓰며 다른 언어를 자동 변경하지 않습니다. [언어 사전](/ko/blog/config-languages/#fallback)의 대체 규칙을 참고하세요.

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        terminal: {
          commandInput: '终端输入',
          hint: '输入 help 查看命令。',
          help: '只读浏览公开文章，不运行系统命令。',
          usage: '用法：{value}',
          notFound: '未找到：{value}',
          failed: '读取失败：{value}',
          tooLarge: '文件过大：{value}',
          readerHint: '只读 · :q 回车退出 · Esc 关闭',
          readerCommand: '阅读器命令输入',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## 터미널이 사용하는 다른 설정

| 설정                                    | 터미널 역할                                                                                                          | 주 설명                                                    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| theme.enableAboutPage                   | boolean, 기본 true입니다. 끄면 표준 About과 그 페이지의 터미널도 표시하지 않습니다.                                  | [About 스위치](/ko/blog/config-about/#page-enabled)        |
| `i18n.locales.<语言>.about.scriptsPath` | string, 기본 /root/bash/scripts입니다. 가상 경로 접두사와 초기 디렉터리이며 서버 디스크 경로는 아닙니다.             | [About 도구 설정](/ko/blog/config-about/#tool-fields)      |
| `i18n.locales.<语言>.about.sections`    | 공개 개인 소개가 가상 about.md의 콘텐츠에 참여합니다. 터미널 오류 문구는 아닙니다.                                   | [About 본문](/ko/blog/config-about/#body-fields)           |
| 현재 언어의 글                          | 가상 파일 디렉터리에 자동 포함하며 필요할 때 생성된 글 JSON을 읽습니다. site.config에 글마다 등록할 필요는 없습니다. | [글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/) |

About의 sidebar.allScripts, modals.allScripts.title은 도구 입구와 디렉터리 팝업만 바꾸며 터미널 명령 이름은 바꾸지 않습니다. effects.backgroundLines는 현재 상호작용 session에서 초기 안내를 바꾸는 유효 설정이 아닙니다. 실제 대체 상태는 [About 효과 필드](/ko/blog/config-about/#effect-fields)를 참고하세요.

<a id="limits"></a>

## 고정 기능과 제한: site.config 필드가 아닙니다

- 가상 명령에는 help, clear, pwd, ls, cd, cat, vi, vim, view가 있습니다. About은 open, close, minimize, maximize, restore 창 명령도 연결합니다. 지원 목록은 구현이 정하며 help·unknown 문구로 시스템 명령을 추가할 수 없습니다.
- vi / vim / view는 편집기가 아닌 읽기 전용 리더입니다. :q, :q!, q를 입력하고 Enter로 종료하며 Esc도 읽기 모드를 닫습니다. readerHint는 안내만 바꿉니다.
- 기본 명령 입력은 JavaScript UTF-16 코드 단위 최대 512개, 기록은 50개입니다. 파일 읽기는 기본 최대 262,144개 코드 단위이며 초과하면 tooLarge를 표시합니다. 네트워크 응답에는 별도의 제한 읽기 보호가 있으므로 업로드 파일 크기 허용값으로 해석하지 마세요.
- 글은 같은 출처 JSON에서 필요할 때 읽습니다. 임의 URL 다운로더나 임의 로컬 디렉터리 리더가 아닙니다. 일반 텍스트 가상 파일·디렉터리는 반드시 네트워크 요청을 만들지는 않습니다.
- 글자 크기, 색상, 글꼴, 입력 한도, 기록 수, 읽기 한도는 내부 컴포넌트·함수 매개변수일 수 있지만 공개 site.config 경로는 없습니다. API key를 설정하지 않으며 SSH, 실제 shell, 원격 AI에 연결하지 않습니다.

저장 후 개발 설정을 다시 읽고 정식 사이트는 재빌드·재배포하세요. 문구를 확인하려면 해당 명령·읽기 모드를 실제로 열어야 하며 정적 제목만 보면 안 됩니다. 특히 readerTitle은 현재 UI를 바꾸지 않습니다. [설정 시작 페이지](/ko/blog/config-reference/)로 돌아가 계속 조회하세요.
