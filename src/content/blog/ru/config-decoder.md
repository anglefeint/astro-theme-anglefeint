---
tags: ['anglefeint', 'config']
title: 'Справочник настроек: Decoder'
subtitle: 'Текстовые задачи, вызовы, адреса и карточки дополнительного чтения.'
description: 'Полные настройки Decoder, настоящие тексты и карточки по умолчанию, типы, примеры, ограничения и различия со встроенным инструментом About.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Файл конфигурации — в [установке и данных сайта](/ru/blog/starter-guide-1-configure-your-site/), включение страниц — в [настройке страниц/функций](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/). Здесь поля, остальные модули — в [общем справочнике](/ru/blog/config-reference/).

«Карточки чтения» — ссылки дополнительного чтения внизу Decoder, не карточки Blog List и не автоматически выбранные статьи. Стандарты из текущего пакета, не переопределения demo.

<a id="page-enabled"></a>

## theme.enableDecoderPage: отдельная страница

- **Тип / стандарт:** boolean / true.
- **Действие и состояние:** действует. Создаёт `/<语言>/decoder/` для включённых языков, включает/убирает вход навигации и ссылку полной версии в About.
- **Ограничения:** не отключает встроенный текстовый декодер About; сам About — theme.enableAboutPage. Не удаляет публичные данные/старые файлы хостинга. Нужны сборка/размещение.
- **Пример:** `theme: { enableDecoderPage: false }`.

| Возможность                       | Отдельная страница Decoder    | Встроенный декодер About                         |
| --------------------------------- | ----------------------------- | ------------------------------------------------ |
| Декодирование текста              | Есть                          | Есть                                             |
| Token call / проверка адреса      | Есть                          | Нет                                              |
| Многошаговая история/экспорт JSON | Есть                          | Нет                                              |
| Карточки чтения/посвящение        | Есть                          | Нет                                              |
| Общие тексты инструмента          | messages.decoder              | messages.decoder                                 |
| Заголовки/входы                   | messages.decoderPage и другие | sidebar.decryptor / modals.decryptor.title About |

Старые About header, keysLabel, currentPassphraseLabel, masterKeyLabel и transientKeyLabel типом принимаются, но Decoder не читает: [старые поля About](/ru/blog/config-about/#modal-fields). Страницу не меняют.

<a id="text-messages"></a>

## messages.decoder: общие тексты текстового инструмента

Префикс `i18n.locales.<语言>.messages.decoder.`. Все необязательные **string** со встроенным языком/откатом. Ниже настоящие стандарты упрощённого китайского/английского, примеры — значения. Все условны при инструменте/действии/состоянии, без настройки есть стандарт. Пустота переопределяет текст, не выключает контрол; некоторые ветки поиска ошибок возвращаются к другой подсказке.

| Поле          | Стандарт упрощённого китайского / английского                                            | Действие и ограничения                                            | Пример                         |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------ |
| `input`       | 输入 / Input                                                                             | Метка ввода и исходного ввода истории                             | `"原始内容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | Placeholder, не заполнение поля                                   | `"粘贴需要解码的文本"`         |
| `format`      | 格式 / Format                                                                            | Метка выбора формата, не изменение поддержки                      | `"编码格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | Текст автоопределения, не алгоритм                                | `"自动判断"`                   |
| `decode`      | 解码 / Decode                                                                            | Надпись запуска                                                   | `"开始解码"`                   |
| `clear`       | 清空 / Clear                                                                             | Очистка текущего ввода, вывода и шагов                            | `"清空内容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | Кнопка копирования, активна при результате                        | `"复制结果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | Результат как следующий ввод; слишком длинный не подставляется    | `"继续解码"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | Префикс перечня форматов                                          | `"支持格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | Название HTML entities, не правила                                | `"HTML 实体"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Название Unicode escapes, не правила                              | `"Unicode 转义"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | JWT-предупреждение страницы/успеха, не включение проверки подписи | `"仅解码，不验证签名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | Успех буфера обмена                                               | `"已复制结果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | Ошибка копирования, не декодирования                              | `"无法复制，请手动选择文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | Заголовок/доступность результата и выход истории                  | `"解码结果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | Пояснение локальной обработки, не отключение сети всего сайта     | `"输入由浏览器本地处理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | Начальное/сброшенное состояние                                    | `"等待输入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | Состояние обработки/показа                                        | `"处理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | Успех с возможным форматом/JWT-предупреждением                    | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | Пустой ввод                                                       | `"请先输入内容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | Превышение ввода; у адресов меньший лимит, текст его не меняет    | `"输入超过限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | Неверные данные и запасная ошибка без другого сообщения           | `"无法解析，请检查输入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | Бинарный/небезопасный UTF-8-текст                                 | `"结果不是可读文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | Автоопределение не нашло формат                                   | `"无法识别，请手动选择格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | Несколько кандидатов требуют ручного выбора                       | `"存在多种可能，请选择格式。"` |
| `example`     | 示例 / Example                                                                           | Кнопка примера, содержимое задано реализацией                     | `"试用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage: отдельная страница и задачи

Префикс `i18n.locales.<语言>.messages.decoderPage.`. 31 необязательное **string**, с теми же стандартами и строковыми примерами. Кроме fullTool в ссылке About, поля главным образом отдельной страницы. У встроенного инструмента нет этих задач: одни тексты полный режим не добавят.

| Поле            | Стандарт упрощённого китайского / английского                                                                                                                                                                                                                                                                                                                                                                                 | Состояние, действие и ограничения                                                                                       | Пример                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | Условно: метаописание/вступление и WebApplication structured data                                                       | `"本地解码文本、解析调用并检查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | Условно: h1, имя structured data, доступное имя пояснений и ссылка About; фиксированный Decoder Lab документа не меняет | `"我的解码工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | Условно: доступное имя трёх вкладок                                                                                     | `"选择任务"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | Условно: вкладка/пояснение текста                                                                                       | `"文本解码"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | Условно: вкладка, пояснение, формат истории и часть title браузера                                                      | `"代币调用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | Условно: вкладка, пояснение и формат истории адресов                                                                    | `"地址格式检查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | Условно: подсказка ввода адреса и часть доступного описания                                                             | `"粘贴需要检查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | Условно: метка экосистемы, реальные варианты EVM и прочие фиксированы                                                   | `"地址体系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | Условно: метка decimals, также ошибка неверной точности                                                                 | `"代币小数位数"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | Условно: пояснение опциональной точности, не её стандарт                                                                | `"如需可读金额，请填写代币精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | Условно: метка сети Bitcoin, не список сетей                                                                            | `"Bitcoin 网络"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | Условно: заголовок/доступное имя шагов                                                                                  | `"处理历史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | Условно: продолжение истории с выводом шага и возвратом к текстовой задаче                                              | `"继续处理此结果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | Условно: экспорт JSON, не скриншот                                                                                      | `"导出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | Условно: текст ограничений без изменения лимитов                                                                        | `"最多 10 步，输入不超过 16,384 字符。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | Условно: предупреждение вызова и объяснение границ                                                                      | `"解析不代表链上验证。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | Условно: предупреждение режима адреса/пояснения                                                                         | `"格式正确不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | Условно: ошибка неподдерживаемой системы/метода                                                                         | `"仅支持 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | Условно: ошибка checksum                                                                                                | `"地址校验和无效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | Условно: неверная длина ABI                                                                                             | `"调用参数长度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | Условно: несоответствие адреса сети Bitcoin                                                                             | `"地址与当前 Bitcoin 网络不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | Условно: предел шагов, текст не увеличивает                                                                             | `"步骤已满，请清空后重试。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | Условно: предел памяти истории ввода/вывода                                                                             | `"历史内容过多，请清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | Условно: подшаг разбора кодирования адреса                                                                              | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | Условно: подшаг формата/checksum                                                                                        | `"检查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | Условно: подшаг представления адреса/вызова                                                                             | `"展示地址结果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | Условно: разбор селектора/аргументов вызова                                                                             | `"解析调用参数"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | Условно: подшаг исходного целого без decimals                                                                           | `"保留原始整数"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | Условно: подшаг суммы с decimals                                                                                        | `"按精度显示金额"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | Условно: пояснение вызова, нужен calldata, не transaction hash                                                          | `"粘贴 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | Условно: сбой динамического модуля криптопарсинга отдельной страницы, не общая сетевая ошибка                           | `"解析模块加载失败，请刷新重试。"`             |

Текущий title документа: Decoder Lab | Base64 · JWT · плюс callTask. Отдельного decoderPage.title нет, fullTool фиксированное Decoder Lab не заменяет. Не все бренды/сети/форматы настраиваются, новые задачи сменой надписей не появляются.

<a id="readings"></a>

## messages.decoderPage.readings: чтение

Префикс `i18n.locales.<语言>.messages.decoderPage`. Сам readings — необязательный объект, в языковых сообщениях стандартно отсутствует. Компонент предоставляет тексты/16 карточек по текущему языку. Неизвестному языку — английские материалы. Это стандарт компонента, не одинаковые заголовки всех языков.

| Поле             | Тип / стандарт                                                              | Состояние, действие и ограничения                                                                                                                            | Пример                                                           |
| ---------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| readings.tribute | string, необязателен / посвящение текущего языка, китайское/английское ниже | Условно: посвящение внизу страницы; пустота скрывает абзац, не карточки. Обычный текст с автоматическим выделением части слов о шифропанках, не HTML конфига | '感谢这些思想与工具的作者。'                                     |
| readings.links   | DecoderReading[], необязателен / 16 встроенных ниже                         | Условно: полная замена карточек по порядку без объединения и публичного максимума. [] скрывает карточки, не посвящение                                       | [{ title: '我的文章', href: '/zh/blog/welcome-to-anglefeint/' }] |

У каждого readings.links пять полей ниже. «Нет» — у custom-элемента нет автозначения, не отсутствие данных встроенных карточек.

| Полный относительный путь | Тип / стандарт                     | Состояние, действие и ограничения                                                                                                                            | Пример                            |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| readings.links[].title    | string, обязателен / нет           | Условно: заголовок, пустота/пробелы отфильтровывают карточку; без Markdown/HTML                                                                              | '我的文章'                        |
| readings.links[].href     | string, обязателен / нет           | Условно: вся карточка ведёт по HTTP(S):// или одному /. //, mailto, якорь и относительный путь отфильтровываются. Только проверка префикса, не существования | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author   | string, необязателен / отсутствует | Условно: автор с годом через среднюю точку; пустота скрыта, site.author не подставляется                                                                     | '作者名'                          |
| readings.links[].year     | string, необязателен / отсутствует | Условно: год/текст без разбора даты/сортировки. Строка, не число                                                                                             | '2026'                            |
| readings.links[].cover    | string, необязателен / отсутствует | Условно: встроенный ID, HTTP(S):// или путь от /. Пустота/неизвестное/неподдержанное скрывают картинку, не карточку                                          | 'privacy-code'                    |

Ссылки в новой вкладке с noopener noreferrer. Внутренний корень получает Astro BASE_URL: не дублируйте префикс. href/custom-cover не trim: не добавляйте крайние пробелы.

Шестнадцать встроенных ID:

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

Например, public/images/decoder/my-cover.webp задаётся /images/decoder/my-cover.webp, без public и исходного src/assets. Обложки показываются в области 16:9 с обрезкой. Встроенные адаптивны, custom/remote напрямую img без генерации размеров обложек блога. Подготовьте подходящий размер сами, ошибка загрузки не заменяет встроенной. Без картинки остаётся текстовая карточка.

Скрыть чтение без отключения инструмента:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        decoderPage: { readings: { tribute: '', links: [] } },
      },
    },
  },
},
```

<a id="reading-defaults"></a>

### Стандартное посвящение и карточки

Настоящее посвящение упрощённого китайского: 谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

Настоящее английское посвящение: In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

Все встроенные карточки в реальном порядке; пустой автор/год означает отсутствие. Внешние адреса содержат параметры источника темы как часть встроенных данных, не добавляемые автоматически к вашему href.

| ID обложки                        | Стандартный заголовок упрощённого китайского / английского                                      | Автор                 | Год  | href                                                                                                                                                                                                           |
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

## Пример объединения

Добавьте в существующий `defineThemeConfig({...})` `src/site.config.ts`, сохранив import/export/личные настройки без второго theme/i18n. Меняет только китайский, другие используют свои настройки/откаты: [языки](/ru/blog/starter-guide-languages/).

```ts
theme: { enableDecoderPage: true },
i18n: {
  locales: {
    zh: {
      messages: {
        decoder: {
          input: '原始内容',
          decode: '开始解码',
        },
        decoderPage: {
          fullTool: '我的解码工具',
          description: '本地解码文本、解析调用并检查地址。',
          readings: {
            tribute: '延伸阅读',
            links: [
              {
                title: '欢迎来到我的博客',
                href: '/zh/blog/welcome-to-anglefeint/',
                author: '作者名',
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

## Эти возможности и ограничения не настраиваются site.config

- **Текст:** фиксированы Base64/Base64URL, URL, Hex, HTML entities, Unicode escapes, JWT. Автоопределение принимает единственного успешного кандидата, при нескольких нужен ручной выбор. Один запуск — один слой, не цикл декодирования. JWT только разбирается без подписи. Вывод текстовый, HTML/скрипт результата не выполняется.
- **Ввод/история:** до 16 384 кодовых единиц JavaScript UTF-16, адреса до 128. Полная страница — до 10 шагов и 262 144 суммарных единиц ввода/вывода. Продолжение шага/повтор результата создают цепь, обычная новая отправка очищает старую. Экспорт — decoder-results.json текущих шагов. Бюджет памяти не «262 KB изображения». limits/tooLong/stepLimit не меняют лимиты.
- **Вызовы/адреса:** transfer, approve, transferFrom; EVM/HyperEVM/TRON, не Bitcoin token call. Точность вводит читатель, стандартно пусто и исходное целое. Допустимы канонические строки целого 0–255, config-стандарта точности нет. Проверка реализованных форматов/checksum EVM/HyperEVM, TRON, Bitcoin не доказывает владельца, баланс или доверие.
- **Сеть/приватность:** декодирование не вызывает RPC и не отправляет ввод, но модули/стили/картинки/статистика сайта могут использовать сеть. Локальность не означает офлайн всей страницы. Копирование зависит от буфера браузера, экспорт содержит исходный ввод/вывод шагов.
- **Начальный интерфейс:** текстовая задача/автоопределение, EVM и Bitcoin Mainnet. Нет defaultTask, defaultFormat, maxSteps, RPC URL, списка цепей, списка примеров или выключателя фона. Reduced Motion — системное предпочтение.

Все описанные поля Decoder потребляются, дополнительных совместимых не нужно. Старые непотребляемые About отмечены отдельно. Тексты — не параметры алгоритмов. [Назад к общему справочнику](/ru/blog/config-reference/).
