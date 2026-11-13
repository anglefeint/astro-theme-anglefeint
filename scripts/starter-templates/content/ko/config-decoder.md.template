---
tags: ['anglefeint', 'config']
title: '설정 사전: Decoder'
subtitle: '독립 디코더 페이지, About 내장 도구와 더 읽기 카드입니다.'
description: '실제 코드로 Decoder 스위치, 텍스트·작업 문구, 읽기 목록·표지의 기본값, 제한, 현재 적용 범위를 조회합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

설정 위치는 [설치와 사이트 정보](/ko/blog/starter-guide-1-configure-your-site/), 페이지 활성화는 [페이지·기능 가이드](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)를 읽으세요. 필드 조회용이며 다른 모듈은 [설정 사전 시작 페이지](/ko/blog/config-reference/)에 있습니다.

“읽기 카드”는 Decoder 하단 더 읽기 링크입니다. Blog List 글 카드가 아니며 글에서 자동 생성하지 않습니다. 현재 패키지 기본값이며 demo 덮어쓰기를 기본으로 취급하지 마세요.

<a id="page-enabled"></a>

## theme.enableDecoderPage: 독립 페이지 스위치

- **타입 / 기본값:** boolean / true.
- **역할·상태:** 활성 언어의 `/<locale>/decoder/`를 만들며 공용 내비게이션·About의 전체 도구 링크도 함께 제어합니다.
- **제한:** 끄더라도 About 내장 텍스트 도구는 남습니다. About은 theme.enableAboutPage입니다. 공개 내용·이전 배포 파일 삭제 보장은 없고 재빌드·재배포가 필요합니다.
- **예시:** `theme: { enableDecoderPage: false }`.

| 기능                         | 독립 Decoder            | About 내장                                       |
| ---------------------------- | ----------------------- | ------------------------------------------------ |
| 텍스트 형식 디코딩           | 있음                    | 있음                                             |
| Token call·주소 검사         | 있음                    | 없음                                             |
| 여러 단계 기록·JSON 내보내기 | 있음                    | 없음                                             |
| 읽기 카드·헌사               | 있음                    | 없음                                             |
| 도구 공통 문구               | messages.decoder        | messages.decoder                                 |
| 제목·입구                    | messages.decoderPage 등 | About sidebar.decryptor / modals.decryptor.title |

About의 구형 header, keysLabel, currentPassphraseLabel, masterKeyLabel, transientKeyLabel은 타입만 받으며 읽지 않습니다. [About 도구](/ko/blog/config-about/#modal-fields)를 참고하세요. 이 필드로 페이지를 바꿀 수 없습니다.

<a id="text-messages"></a>

## messages.decoder: 공통 텍스트 도구 문구

접두사는 `i18n.locales.<locale>.messages.decoder.`이며 선택적 **string**입니다. 현재 언어 내장·대체값을 사용합니다. 표는 중국어 간체 / 영어 기본값, 한국어 예시입니다. 도구·동작·상태가 있을 때 조건부 적용합니다. 생략해도 기본값이 있습니다. 빈 문자열은 문구만 덮어쓰며 컨트롤 끄기가 아닙니다. 일부 오류 분기는 다른 안내로 대체합니다.

| 필드          | 중국어 간체 / 영어 기본값                                                                | 역할·제한                                                                  | 한국어 예시 값                                    |
| ------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| `input`       | 输入 / Input                                                                             | 입력 영역·기록 단계의 원래 입력 라벨입니다.                                | `"원본 내용"`                                     |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | 입력창 안내이며 내용을 미리 채우지 않습니다.                               | `"디코딩할 텍스트를 붙여 넣으세요"`               |
| `format`      | 格式 / Format                                                                            | 형식 선택 라벨이며 지원 형식을 추가·삭제하지 않습니다.                     | `"인코딩 형식"`                                   |
| `auto`        | 自动识别 / Auto detect                                                                   | 자동 인식 옵션이며 알고리즘은 유지합니다.                                  | `"자동 감지"`                                     |
| `decode`      | 解码 / Decode                                                                            | 디코딩 제출 버튼입니다.                                                    | `"디코딩 시작"`                                   |
| `clear`       | 清空 / Clear                                                                             | 현재 입력·출력·단계를 지우는 버튼입니다.                                   | `"내용 지우기"`                                   |
| `copy`        | 复制结果 / Copy result                                                                   | 복사 가능한 결과가 있을 때 활성화하는 복사 버튼입니다.                     | `"결과 복사"`                                     |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | 결과를 입력으로 이어 쓰는 버튼이며 너무 긴 결과는 채울 수 없습니다.        | `"계속 디코딩"`                                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | 지원 형식 설명 접두사입니다.                                               | `"지원 형식"`                                     |
| `html`        | HTML 实体 / HTML entities                                                                | HTML 엔티티 이름이며 규칙은 유지합니다.                                    | `"HTML 엔터티"`                                   |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Unicode 이스케이프 이름이며 규칙은 유지합니다.                             | `"Unicode 이스케이프"`                            |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | 독립 설명·JWT 성공 안내이며 문구로 서명 검증을 켤 수 없습니다.             | `"디코딩만 수행하며 서명은 검증하지 않습니다."`   |
| `copied`      | 结果已复制。 / Result copied.                                                            | 클립보드 성공 상태입니다.                                                  | `"결과를 복사했습니다"`                           |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | 복사 실패이며 디코딩 실패는 아닙니다.                                      | `"복사할 수 없습니다. 텍스트를 직접 선택하세요."` |
| `output`      | 解码结果 / Decoded text                                                                  | 결과 제목·접근성 이름·기록 단계 출력 라벨입니다.                           | `"디코딩 결과"`                                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | 도구 하단의 로컬 처리 설명이며 전체 사이트 네트워크 끄기가 아닙니다.       | `"입력은 브라우저에서 로컬로 처리합니다."`        |
| `ready`       | 准备就绪。 / Ready.                                                                      | 초기·초기화 뒤 준비 상태입니다.                                            | `"입력 대기"`                                     |
| `running`     | 正在解码… / Decoding…                                                                    | 처리·표시 진행 상태입니다.                                                 | `"처리 중"`                                       |
| `done`        | 解码完成 / Decoded                                                                       | 성공 상태이며 형식·JWT 안내를 붙일 수 있습니다.                            | `"완료"`                                          |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | 빈 입력 오류입니다.                                                        | `"먼저 내용을 입력하세요."`                       |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | 입력 한도 초과입니다. 주소 작업은 더 작으며 문구가 제한을 바꾸지 않습니다. | `"입력 제한을 초과했습니다."`                     |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | 무효 데이터·다른 오류 문구가 없는 경우의 대체입니다.                       | `"분석할 수 없습니다. 입력을 확인하세요."`        |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | 바이너리이거나 안전한 UTF-8 표시가 불가능할 때입니다.                      | `"결과가 읽을 수 있는 텍스트가 아닙니다."`        |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | 자동 인식에서 형식을 못 찾았을 때입니다.                                   | `"감지하지 못했습니다. 형식을 직접 선택하세요."`  |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | 자동 인식의 후보가 여러 개일 때입니다.                                     | `"여러 형식이 가능합니다. 형식을 선택하세요."`    |
| `example`     | 示例 / Example                                                                           | 예시 버튼이며 실제 예시 입력을 바꾸지는 않습니다.                          | `"예제 사용"`                                     |

<a id="page-messages"></a>

## messages.decoderPage: 독립 페이지·작업 문구

접두사는 `i18n.locales.<locale>.messages.decoderPage.`입니다. 31개 모두 선택적 **string**, 위와 같은 기본 규칙이며 예시도 문자열입니다. fullTool은 About 링크에도 사용하지만 나머지는 주로 독립 페이지용입니다. 내장 도구에 문구를 넣어도 전체 작업 모드가 생기지는 않습니다.

| 필드            | 중국어 간체 / 영어 기본값                                                                                                                                                                                                                                                                                                                                                                                                     | 역할·제한                                                                                                             | 한국어 예시 값                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | 조건부: 메타 설명·제목 아래 소개·WebApplication 구조화 데이터입니다.                                                  | `"텍스트 디코딩, 호출 분석과 주소 검사를 로컬에서 수행합니다."`   |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | 조건부: h1·구조화 데이터 이름·설명 접근성 이름·About 전체 도구 링크입니다. 문서 제목의 고정 Decoder Lab은 유지합니다. | `"내 디코딩 도구"`                                                |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | 조건부: 세 작업 탭 그룹의 접근성 이름입니다.                                                                          | `"작업 선택"`                                                     |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | 조건부: 텍스트 탭·설명 제목입니다.                                                                                    | `"텍스트 디코딩"`                                                 |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | 조건부: 토큰 호출 탭·설명·기록 형식이며 브라우저 제목에도 넣습니다.                                                   | `"토큰 호출 분석"`                                                |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | 조건부: 주소 탭·설명·기록 형식입니다.                                                                                 | `"주소 형식 검사"`                                                |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | 조건부: 주소 입력 설명·접근성 설명 일부입니다.                                                                        | `"검사할 주소를 붙여 넣으세요."`                                  |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | 조건부: 체계 선택 라벨이며 EVM 등 옵션은 고정입니다.                                                                  | `"주소 체계"`                                                     |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | 조건부: 소수 자릿수 라벨이며 decimals 오류 안내에도 씁니다.                                                           | `"토큰 소수 자릿수"`                                              |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | 조건부: 선택적 정밀도 안내이며 기본 정밀도를 정하지 않습니다.                                                         | `"금액을 읽기 쉽게 표시하려면 토큰 정밀도를 입력하세요."`         |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | 조건부: Bitcoin 네트워크 라벨이며 옵션은 안 바꿉니다.                                                                 | `"Bitcoin 네트워크"`                                              |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | 조건부: 단계 영역 제목·접근성 이름입니다.                                                                             | `"처리 기록"`                                                     |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | 조건부: 기록 출력으로 이어 쓰고 텍스트 작업으로 돌아가는 버튼입니다.                                                  | `"이 결과를 계속 처리"`                                           |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | 조건부: JSON 단계 내보내기이며 스크린샷이 아닙니다.                                                                   | `"JSON 내보내기"`                                                 |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | 조건부: 단계 제한 설명이며 실제 한도는 유지합니다.                                                                    | `"최대 10단계, 입력은 16,384자 이내입니다."`                      |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | 조건부: 호출 모드·설명에서 해석 한계를 알립니다.                                                                      | `"분석은 온체인 검증을 의미하지 않습니다."`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | 조건부: 주소 모드·설명에서 한계를 알립니다.                                                                           | `"형식이 올바르다고 신뢰할 수 있는 주소는 아닙니다."`             |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | 조건부: 미지원 체계·메서드 오류입니다.                                                                                | `"transfer, approve, transferFrom만 지원합니다."`                 |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | 조건부: 체크섬 오류입니다.                                                                                            | `"주소 체크섬이 유효하지 않습니다."`                              |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | 조건부: ABI 인수 길이 오류입니다.                                                                                     | `"호출 매개변수 길이가 맞지 않습니다."`                           |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | 조건부: Bitcoin 주소·선택 네트워크 불일치입니다.                                                                      | `"주소가 현재 Bitcoin 네트워크와 맞지 않습니다."`                 |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | 조건부: 단계 상한 오류이며 문구로 늘릴 수 없습니다.                                                                   | `"단계 한도에 도달했습니다. 지우고 다시 시도하세요."`             |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | 조건부: 기록 입출력 메모리 예산 오류입니다.                                                                           | `"처리 기록이 너무 많습니다. 지워 주세요."`                       |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | 조건부: 주소 기록의 인코딩 해석 하위 단계입니다.                                                                      | `"주소 분석"`                                                     |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | 조건부: 주소 형식·체크섬 검사 하위 단계입니다.                                                                        | `"형식 검사"`                                                     |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | 조건부: 주소·호출 기록의 주소 표현 단계입니다.                                                                        | `"주소 결과 표시"`                                                |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | 조건부: 호출 기록의 선택자·인수 해석 단계입니다.                                                                      | `"호출 매개변수 분석"`                                            |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | 조건부: 정밀도 미입력 호출 기록 단계입니다.                                                                           | `"원래 정수 유지"`                                                |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | 조건부: 정밀도 입력 후 호출 기록 단계입니다.                                                                          | `"정밀도에 따라 금액 표시"`                                       |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | 조건부: 독립 호출 안내이며 거래 해시가 아니라 calldata가 필요합니다.                                                  | `"calldata를 붙여 넣은 뒤 분석하세요."`                           |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | 조건부: 독립 페이지의 암호 해석 모듈 동적 로드 실패이며 전체 페이지 공통 네트워크 오류는 아닙니다.                    | `"분석 모듈을 불러오지 못했습니다. 새로고침 후 다시 시도하세요."` |

문서 제목은 Decoder Lab | Base64 · JWT · 뒤에 callTask 문구를 붙입니다. 별도 decoderPage.title은 없으며 fullTool로 고정 Decoder Lab을 바꾸지 못합니다. 모든 브랜드·네트워크·형식 이름을 설정화하지 않았고 문구로 작업을 추가하지 않습니다.

<a id="readings"></a>

## messages.decoderPage.readings: 읽기 영역

접두사는 계속 `i18n.locales.<locale>.messages.decoderPage`입니다. readings는 선택 객체이며 언어 메시지에는 기본 미설정입니다. 컴포넌트가 현재 언어별 문구·카드 16개를 제공합니다. 모르는 언어는 영어 읽기 내용을 쓰며 컴포넌트 고유 기본이지 모든 언어의 제목이 같다는 뜻은 아닙니다.

| 필드             | 타입 / 기본값                                                    | 상태·역할·제한                                                                                                                             | 예시 값                                                       |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| readings.tribute | string, 생략 가능 / 언어별 내장 헌사, 아래 중국어 간체·영어 전문 | 조건부: 하단 헌사입니다. 빈 문자열은 문단만 숨기고 카드 유지, 일반 텍스트로 일부 사이퍼펑크 단어만 자동 강조하며 HTML은 해석하지 않습니다. | '이 사상과 도구를 만든 분들께 감사합니다.'                    |
| readings.links   | DecoderReading[], 생략 가능 / 내장 16개, 아래 참조               | 조건부: 배열순 전체 대체이며 추가 병합·개수 제한은 없습니다. 빈 배열은 카드만 숨기고 헌사 유지입니다.                                      | [{ title: '내 글', href: '/ko/blog/welcome-to-anglefeint/' }] |

항목별 다섯 필드입니다. “없음”은 사용자 항목 자동 보완이 없다는 뜻이지 내장 카드 정보가 없다는 뜻은 아닙니다.

| 전체 상대 경로          | 타입 / 기본값              | 상태·역할·제한                                                                                                                                                | 예시 값                           |
| ----------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| readings.links[].title  | string, 필수 / 없음        | 조건부: 카드 제목입니다. 비거나 공백이면 카드를 제외하고 Markdown·HTML은 해석하지 않습니다.                                                                   | '내 글'                           |
| readings.links[].href   | string, 필수 / 없음        | 조건부: 전체 카드 주소이며 HTTP(S)://·단일 / 시작만 받습니다. //, mailto, 앵커, 일반 상대 경로는 제외합니다. 접두사만 검사하며 목표 존재는 확인하지 않습니다. | '/ko/blog/welcome-to-anglefeint/' |
| readings.links[].author | string, 생략 가능 / 미설정 | 조건부: 연도와 중점으로 잇습니다. 비면 숨기고 site.author를 보완하지 않습니다.                                                                                | '작성자 이름'                     |
| readings.links[].year   | string, 생략 가능 / 미설정 | 조건부: 연도·설명 문구이며 날짜 해석·정렬에 쓰지 않습니다. 숫자가 아닌 문자열입니다.                                                                          | '2026'                            |
| readings.links[].cover  | string, 생략 가능 / 미설정 | 조건부: 내장 식별자·HTTP(S)://·단일 / 이미지입니다. 빈값·미지원 식별자·경로는 표지만 숨기고 카드는 유지합니다.                                                | 'privacy-code'                    |

새 탭·noopener noreferrer로 열고 내부 루트 경로에는 Astro BASE_URL을 추가하므로 배포 접두사를 중복 쓰지 마세요. href·사용자 cover는 trim하지 않으므로 공백을 넣지 마세요.

내장 식별자는 열여섯 개입니다.

```text
privacy-code
cryptographic-autonomy
cyberspace-freedom
virtual-communities
satoshi-freedom
smart-contracts
security-without-identification
b-money
cypherpunk-archive
satoshi-institute
bitcoin
tor-project
signal
telegram
monero
gnupg
```

public/images/decoder/my-cover.webp는 /images/decoder/my-cover.webp로 쓰며 public 접두사·src/assets 소스 경로는 안 됩니다. 16:9 영역에 잘라 표시합니다. 내장 표지는 반응형이며 사용자·원격 표지는 img로 직접 출력하고 블로그 다중 크기 생성에 들어가지 않습니다. 적절한 크기를 준비하세요. 실패 시 내장 이미지로 바꾸지 않으며 표지 없이 텍스트 카드도 가능합니다.

읽기 영역만 숨기고 도구를 남기는 예시입니다.

```ts
i18n: {
  locales: {
    ko: {
      messages: {
        decoderPage: { readings: { tribute: '', links: [] } },
      },
    },
  },
},
```

<a id="reading-defaults"></a>

### 기본 헌사와 카드

중국어 간체 기본 헌사: 谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

영어 기본 헌사: In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

전체 기본 카드를 실제 순서로 나열합니다. 빈 작성자·연도는 미설정입니다. 외부 기본 링크의 출처 매개변수는 내장 데이터이며 사용자 href에 자동 추가하지 않습니다. 아래 제목은 중국어 간체·영어 코드 기본값을 원문 유지합니다.

| 표지 식별자                       | 중국어 간체 제목 / 영어 제목                                                                    | 작성자                | 연도 | href                                                                                                                                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `privacy-code`                    | 密码朋克宣言 / A Cypherpunk’s Manifesto                                                         | Eric Hughes           | 1993 | `https://www.activism.net/cypherpunk/manifesto.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                        |
| `cryptographic-autonomy`          | 加密无政府主义宣言 / The Crypto Anarchist Manifesto                                             | Timothy C. May        | 1988 | `https://www.activism.net/cypherpunk/crypto-anarchy.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                   |
| `cyberspace-freedom`              | 网络空间独立宣言 / A Declaration of the Independence of Cyberspace                              | John Perry Barlow     | 1996 | `https://www.eff.org/cyberspace-independence?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                               |
| `virtual-communities`             | 加密无政府主义与虚拟社区 / Crypto Anarchy and Virtual Communities                               | Timothy C. May        | 1994 | `https://nakamotoinstitute.org/library/virtual-communities/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                |
| `satoshi-freedom`                 | 比特币点对点电子现金论文——关于 P2P 与自由的回复 / Bitcoin P2P e-cash paper — on P2P and freedom | Satoshi Nakamoto      | 2008 | `https://satoshi.nakamotoinstitute.org/emails/cryptography/4/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                              |
| `smart-contracts`                 | 智能合约：数字市场的基石 / Smart Contracts: Building Blocks for Digital Markets                 | Nick Szabo            | 1996 | `https://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/smart_contracts_2.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab` |
| `security-without-identification` | 不依赖身份识别的安全 / Security without Identification                                          | David Chaum           | 1985 | `https://chaum.com/security-without-identification/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                        |
| `b-money`                         | b-money / b-money                                                                               | Wei Dai               | 1998 | `https://nakamotoinstitute.org/library/b-money/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                            |
| `cypherpunk-archive`              | cryptoanarchy.wiki / cryptoanarchy.wiki                                                         | cryptoanarchy.wiki    |      | `https://cryptoanarchy.wiki/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                               |
| `satoshi-institute`               | 中本聪研究所 / Satoshi Nakamoto Institute                                                       | nakamotoinstitute.org |      | `https://nakamotoinstitute.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                            |
| `bitcoin`                         | Bitcoin / Bitcoin                                                                               | bitcoin.org           |      | `https://bitcoin.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                      |
| `tor-project`                     | Tor Project / Tor Project                                                                       | torproject.org        |      | `https://www.torproject.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                               |
| `signal`                          | Signal / Signal                                                                                 | signal.org            |      | `https://signal.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                       |
| `telegram`                        | Telegram / Telegram                                                                             | telegram.org          |      | `https://telegram.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                     |
| `monero`                          | Monero / Monero                                                                                 | getmonero.org         |      | `https://www.getmonero.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                |
| `gnupg`                           | GnuPG / GnuPG                                                                                   | gnupg.org             |      | `https://gnupg.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                        |

<a id="example"></a>

## 설정 병합 예시

`src/site.config.ts`의 기존 `defineThemeConfig({...})`에 넣고 import·export·개인 설정을 유지하며 theme·i18n을 중복 생성하지 마세요. 한국어만 덮어쓰고 다른 언어는 자체 설정·대체값을 따릅니다. [다국어 가이드](/ko/blog/starter-guide-languages/)를 참고하세요.

```ts
theme: { enableDecoderPage: true },
i18n: {
  locales: {
    ko: {
      messages: {
        decoder: {
          input: '원본 내용',
          decode: '디코딩 시작',
        },
        decoderPage: {
          fullTool: '내 디코딩 도구',
          description: '텍스트 디코딩, 호출 분석과 주소 검사를 로컬에서 수행합니다.',
          readings: {
            tribute: '더 읽기',
            links: [
              {
                title: '내 블로그에 오신 것을 환영합니다',
                href: '/ko/blog/welcome-to-anglefeint/',
                author: '작성자 이름',
                year: '2026',
                cover: 'privacy-code',
              },
            ],
          },
        },
      },
    },
  },
},
```

<a id="fixed-behavior"></a>

## site.config로 바꾸지 않는 기능·제한

- **텍스트:** Base64 / Base64URL, URL, Hex, HTML 엔티티, Unicode 이스케이프, JWT 고정 지원입니다. 자동 인식은 성공 후보 하나만 허용하고 여럿이면 직접 선택합니다. 제출마다 한 겹을 처리하며 자동 반복 디코딩이 아닙니다. JWT 서명 검증은 없고 출력은 텍스트이며 HTML·스크립트를 실행하지 않습니다.
- **입력·기록:** 입력 한도는 JavaScript UTF-16 코드 단위 16,384개, 주소는 128개입니다. 전체 페이지 기록은 최대 10단계·누적 입출력 262,144개입니다. 이어 쓰기·결과 사용으로 연결하고 일반 새 제출은 이전 연결을 지웁니다. 현재 단계를 decoder-results.json으로 내보냅니다. 예산은 “262 KB 이미지”가 아니며 limits·tooLong·stepLimit 문구가 한도를 바꾸지 않습니다.
- **호출·주소:** transfer, approve, transferFrom과 EVM / HyperEVM / TRON 체계이며 Bitcoin 토큰 호출은 안 됩니다. 정밀도는 독자 입력, 기본 빈값·원시 정수 유지입니다. 정규 0–255 정수 문자열을 받으며 설정으로 기본 정밀도를 정할 수 없습니다. 주소는 구현된 EVM / HyperEVM, TRON, Bitcoin 형식·검증 규칙을 쓰며 소유권·잔액·신뢰를 증명하지 않습니다.
- **네트워크·개인정보:** 디코딩은 RPC·입력 업로드를 하지 않습니다. 모듈·스타일·이미지·통계는 네트워크를 쓸 수 있으므로 로컬 처리는 전체 오프라인을 뜻하지 않습니다. 복사는 브라우저 클립보드가 필요하며 내보내기에는 현재 원래 입력·출력이 들어갑니다.
- **UI 기본:** 텍스트·자동 인식으로 시작하며 체계 EVM, Bitcoin Mainnet입니다. defaultTask, defaultFormat, maxSteps, RPC URL, 체인 목록, 예시 입력 목록, 배경 스위치는 없습니다. 동작 줄이기는 시스템 선호입니다.

이 사전의 Decoder 필드는 모두 소비 위치가 있으며 추가 호환 설정은 필요 없습니다. About 구형 미사용은 앞에서 별도 표시했습니다. 문구는 표시 내용이며 알고리즘 인수가 아닙니다. [설정 사전 시작 페이지](/ko/blog/config-reference/)에서 다른 모듈을 보세요.
