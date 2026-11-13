[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/ru/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Кинематографичная тема Astro для личных публикаций, читателей и AI-агентов.</p>

Автоматически создаёт `llms.txt`, языковые индексы, полные сборники и Markdown статей для чтения и цитирования AI-агентами, поддерживая GEO (оптимизацию для генеративных систем).

<p align="center">
  <a href="https://demo.anglefeint.com/ru/">Демонстрация</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Репозиторий</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI-помощник</a> · <a href="#installation">Установка</a> · <a href="#setup">Настройка сайта</a> · <a href="#writing">Статьи</a> · <a href="#upgrade">Обновление</a> · <a href="#deployment">Сборка и публикация</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Что умеет Anglefeint?

Пишите статьи в Markdown/MDX и короткие мысли в Fragments. Встроены языки, поиск, теги, оглавление, копирование кода, просмотр изображений, формулы и автоматические превью статей. Комментарии, музыка и GA4 включаются по необходимости.

| Страница    | Атмосфера                                                 |
| ----------- | --------------------------------------------------------- |
| Главная     | Matrix: зелёный дождь кода, терминал и пиксельный аватар  |
| Блог и теги | Cyberpunk: неон, дождь и городские лучи                   |
| About       | Hacker: представление, виртуальный терминал и инструменты |
| Статья      | AI: сетевая графика, мониторы и панель чтения OUTPUT      |

Сборка также создаёт Markdown публичных статей, About и Fragments, `llms.txt` и полные многоязычные сборники для AI-инструментов без дополнительного production-сервера. Попадание в модели/цитирование не гарантируются.

<a id="ai-assistant"></a>

## Работа с AI-помощником

Cursor, Codex или Claude Code могут настраивать сайт и управлять контентом по `AGENTS.md` текущего проекта. Существующие `CLAUDE.md` и Cursor-правила ведут к соответствующим указаниям. Сначала объясните задачу, попросите проверить настоящую конфигурацию и нужный раздел здесь; для подробностей полей используйте справочник demo.

Для разработки темы начните с [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) и [правил участия](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md). Пользователю блога изучать процесс выпуска разработчика не нужно.

<a id="installation"></a>

## 1. Установка и запуск

Нужен **Node.js 22.12.0 или новее**; шаблон основан на **Astro 7**. В каталоге для блога выполните:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Откройте адрес терминала. В существующем проекте запускайте `npm install` и `npm run dev` в прежнем каталоге, не создавая блог заново. Ctrl+C останавливает сервер. Остальные команды выполняйте в корне проекта после остановки dev или в другом терминале.

В новом проекте допустимы `pnpm install`/`pnpm dev`; сохраняйте один менеджер пакетов. Далее npm, автоматическое обновление пока только для npm.

Подробно: [установить блог и указать свои данные](https://demo.anglefeint.com/ru/blog/starter-guide-1-configure-your-site/).

<a id="setup"></a>

## 2. Первая настройка: свои данные

В установленном проекте уже есть `src/site.config.ts`. **Откройте и измените его, не создавая файл или новый объект конфигурации.**

Добавьте `site` ниже внутрь существующего `defineThemeConfig({ ... })` и замените имя, автора, описание и домен. Starter стандартно опускает `site` и использует значения темы. Если `site` уже есть, меняйте его поля, сохраняя остальные настройки, без дублирования объекта. Исходные import/export и остальное оставьте.

```ts
site: {
  title: '我的博客',
  author: '你的名字',
  description: '记录项目、阅读和生活。',
  url: 'https://your-domain.example',
},
```

Фрагмент меняет общие данные, не языки. Без локализованного `homeTitle` большой заголовок главной использует общий `title`. Вступление, About и социальные ссылки тоже заменяются: см. руководство/справочники ниже.

`site.url` — окончательный публичный адрес, не dev. `PUBLIC_SITE_URL` среды размещения приоритетнее: проверьте его, если остался старый домен.

Изначально включены девять языков, стандартный английский, `/` ведёт на `/en/`. Русский README не требует менять блог на русский. Для другого стандарта или части языков используйте [языковое руководство](https://demo.anglefeint.com/ru/blog/starter-guide-languages/). Отсутствие языка не отключает его, стандартный всегда включён, статьи автоматически не переводятся. Примеры можно удалить после резервной копии/Git, сохранив картинки оставшегося контента.

Шаги: [установка/первые настройки](https://demo.anglefeint.com/ru/blog/starter-guide-1-configure-your-site/), [языки и адрес главной](https://demo.anglefeint.com/ru/blog/starter-guide-languages/). Поля: [сайт/общий интерфейс](https://demo.anglefeint.com/ru/blog/config-site-chrome/), [главная](https://demo.anglefeint.com/ru/blog/config-home/).

<a id="writing"></a>

## 3. Первая статья

В корне проекта:

```bash
npm run new-post -- my-first-post
```

Без `--locales` или `ANGLEFEINT_LOCALES` читаются все включённые языки и создаются одноимённые заготовки. Изначально девять файлов, после изменения переключателей — текущий включённый список. Текст не переводится, существующее не перезаписывается.

Файл `src/content/blog/<语言>/my-first-post.md`, адрес `/<语言>/blog/my-first-post/`, список `/<语言>/blog/`. Например, английский `src/content/blog/en/my-first-post.md`, китайский `src/content/blog/zh/my-first-post.md`. Откройте нужный, измените заголовок, описание и текст без ручных маршрутов. Минимальный пример:

```md
---
title: '我的第一篇文章'
description: '记录这次开始写博客的想法。'
pubDate: '2026-11-13'
---

这里开始写正文。
```

Здесь обязательные поля; существующие обложка и необязательные поля могут остаться. Имя статьи — строчные буквы, цифры, дефисы, например `my-first-post`.

Для выбранных языков используйте `--locales`. Это альтернативы, не выполняйте всё подряд:

```bash
# 只生成英文
npm run new-post -- my-first-post --locales en

# 只生成中文
npm run new-post -- my-first-post --locales zh

# 生成指定的多种语言
npm run new-post -- my-first-post --locales en,zh
```

`--locales` только выбирает файлы, язык должен быть включён для создания страниц. Новые файлы одного запуска делят случайную стандартную обложку, если в пуле есть картинки; старые не меняются.

Можно выбрать `ANGLEFEINT_LOCALES`: приоритет `--locales` → среда → включённые языки. В Bash: `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`. В PowerShell достаточно `--locales` выше.

**Черновики и будущие даты автоматически не скрываются.** Языковые заготовки тоже публичны после сборки. Завершите нужное, непубличное вынесите из коллекции. `draft: true` и `search: false` не делают статью приватной.

Шаги: [первая статья](https://demo.anglefeint.com/ru/blog/starter-guide-2-languages-and-routing/), [изображения](https://demo.anglefeint.com/ru/blog/starter-guide-images/). Поля: [статья/frontmatter](https://demo.anglefeint.com/ru/blog/config-article/).

## 4. Публикация заметки

Fragments подходит для короткого текста, картинки или кода. **Тема и новый starter по умолчанию отключают заметки, demo включает их отдельно.** Для своего блога задайте `fragments.enabled: true` в существующем `theme` `src/site.config.ts`. Это структура слияния, не второй theme:

```ts
theme: {
  fragments: { enabled: true },
},
```

Если true уже есть, повтор не нужен; false замените на true. Включаются список/превью главной, комментарии остаются отключёнными.

Создайте заметку, стандартно заготовки всех включённых языков:

```bash
npm run new-fragment
```

Для отдельных языков выберите параметры:

```bash
# 只生成中文
npm run new-fragment -- --locales zh

# 生成指定的多种语言
npm run new-fragment -- --locales en,zh
```

Каждый запуск создаёт новую запись. Это варианты, выберите нужный, не выполняйте подряд. CLI не меняет включение языков.

Файлы в `src/content/fragments/<语言>/`, имя вроде `2026-11-13-aB3dE6gH.md`, настоящий путь выводит терминал. Редактируйте текст, сохранив восьмизначный буквенно-цифровой ID. Переводы одного запуска делят ID/время. Для продолжения той же записи команду не запускайте заново.

Список `/<语言>/fragments/`, например `/en/fragments/`/`/zh/fragments/`. При заметках языка главная показывает аватар-превью. Стабильная ссылка `/<语言>/fragments/#ID`, не номер страницы. Смена ID меняет ссылки/комментарии. Комментарии стандартно выключены.

Шаги: [заметка](https://demo.anglefeint.com/ru/blog/starter-guide-5-fragments/). Поля: [Fragments](https://demo.anglefeint.com/ru/blog/config-fragments/).

## 5. Собственная страница

Для статьи `new-post`, для проектов/портфолио `new-page`:

```bash
npm run new-page -- projects
```

Создаёт `src/pages/[lang]/projects.astro` с темой `base`. Измените контент и откройте `/<语言>/projects/`, например `/en/projects/`. Один файл создаёт страницы всех включённых языков без автоперевода/добавления навигации.

Для другого вида добавьте `--theme`: `base`, `matrix`, `cyber`, `hacker`, `ai`. Например, `npm run new-page -- portfolio --theme cyber` создаёт другую Cyberpunk-страницу.

Вложенные пути:

```bash
npm run new-page -- projects/labs --theme hacker
```

Каждый сегмент — строчные буквы, цифры, дефисы, без верхнего регистра, подчёркиваний, начального/конечного слеша. Существующие файлы не перезаписываются, стандартные зарезервированные пути нельзя создать заново этой командой.

Подробно: [настройка страниц](https://demo.anglefeint.com/ru/blog/starter-guide-3-comments-about-and-theme-toggles/).

## 6. Подготовка изображений и сохранение результатов

Текст статьи использует обычный Markdown: `photo.jpg` рядом со статьёй и `![图片描述](./photo.jpg)`. Обложка — `heroImage: ./cover.jpg` в frontmatter с готовым файлом; URL public без префикса public.

Обложки и поддерживаемые локальные картинки заметок требуют постоянных адаптивных файлов. Подготовьте явно локально или только проверьте:

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

Локальные dev/doctor создают отсутствующие/устаревшие файлы, build/CI doctor только проверяют, без генерации при размещении. Сохраните в Git оригиналы и весь `src/assets/blog/covers/`, включая `manifest.json`/`generated/`. При missing/stale/modified подготовьте/сохраните локально и пересоберите.

Это не сжатие всех обычных картинок статей. Область поддержки, пути и превью — в [изображениях](https://demo.anglefeint.com/ru/blog/starter-guide-images/).

<a id="reference"></a>

## Настройте функции по необходимости

Частые команды и первые действия доступны здесь. Для изменения функций откройте нужное руководство/поля. Справочник объясняет типы, стандарты, ограничения, примеры и неиспользуемое состояние.

| Задача                                                | Руководство                                                                                                                                                                          | Справочник                                                                                                                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Главная, данные, навигация, социальные ссылки, подвал | [Страницы/функции](https://demo.anglefeint.com/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                            | [Главная](https://demo.anglefeint.com/ru/blog/config-home/), [сайт/интерфейс](https://demo.anglefeint.com/ru/blog/config-site-chrome/)                                                       |
| Размер списков, теги, пагинация                       | [Страницы/функции](https://demo.anglefeint.com/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                            | [Blog List и теги](https://demo.anglefeint.com/ru/blog/config-blog-list/)                                                                                                                    |
| Оглавление, математика, OUTPUT, поиск                 | [Статья](https://demo.anglefeint.com/ru/blog/starter-guide-2-languages-and-routing/)                                                                                                 | [Статья](https://demo.anglefeint.com/ru/blog/config-article/), [поиск](https://demo.anglefeint.com/ru/blog/config-search/)                                                                   |
| About, терминал, Decoder                              | [Страницы/функции](https://demo.anglefeint.com/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                            | [About](https://demo.anglefeint.com/ru/blog/config-about/), [терминал](https://demo.anglefeint.com/ru/blog/config-terminal/), [Decoder](https://demo.anglefeint.com/ru/blog/config-decoder/) |
| Музыка/комментарии                                    | [Музыка](https://demo.anglefeint.com/ru/blog/starter-guide-3-comments-about-and-theme-toggles/), [комментарии](https://demo.anglefeint.com/ru/blog/starter-guide-4-giscus-comments/) | [Музыка](https://demo.anglefeint.com/ru/blog/config-music/), [Giscus/общие обсуждения](https://demo.anglefeint.com/ru/blog/config-comments/)                                                 |
| Языки, статистика, публичные дополнения               | [Языки](https://demo.anglefeint.com/ru/blog/starter-guide-languages/), [публикация](https://demo.anglefeint.com/ru/blog/starter-guide-deployment/)                                   | [Языки/откат](https://demo.anglefeint.com/ru/blog/config-languages/), [GA4/AI](https://demo.anglefeint.com/ru/blog/config-analytics-ai/)                                                     |

Если не знаете путь, используйте [общий справочник](https://demo.anglefeint.com/ru/blog/config-reference/). Переопределение текста языка не переводит контент. Контент/конфигурация требуют новой сборки и размещения.

<a id="upgrade"></a>

## 7. Обновление существующего блога

Новой установке этот раздел не нужен: переходите к [первой проверке и публикации](#deployment).

Сохраните свои изменения, например в Git, остановите dev/preview. В корне прежнего проекта сначала совместимость, затем обновление:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` не меняет файлы, не устанавливает/собирает. Обновление поддерживает интеграционный npm-starter с `package-lock.json` и `anglefeint.projectSchema: 1`. Нельзя обходить ограничение pnpm/yarn/bun удалением lock-файла.

Обновление меняет зависимость темы и запускает doctor, сохраняя статьи, настройки, музыку, изображения и свои страницы. Два файла зависимостей копируются в `.anglefeint/backups/`, не весь сайт. Ошибка установки/проверки восстанавливает их и пытается переустановить старое. После сбоя не размещайте остатки `dist/`.

Конкретная версия: `npx @anglefeint/astro-theme@latest upgrade --to <版本号>`, замените placeholder явной совместимой версией. Автопонижения нет. Успех уже включает проверку/сборку, сразу открывайте `npm run preview` без нового build. Обновление не публикует сайт и не мигрирует несовместимый Astro автоматически.

Скопированный каркас до 0.27 требует нового starter с сохранением старого и переносом личного контента/ресурсов; обновление на месте не поддерживается. Старые стандартные маршруты/adapter не копируйте.

Детали/восстановление: [обновление проекта](https://demo.anglefeint.com/ru/blog/starter-guide-1-configure-your-site/), [UPGRADING](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md), [выпуски](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## 8. Проверка, preview и первая публикация

Остановите dev в корне, проверьте/соберите и откройте результат:

```bash
npm run doctor
npm run preview
```

`npm run doctor` включает проверку/сборку, `npm run check` синоним: выберите один. После успеха сразу повторять check/build не нужно. Только Astro/TypeScript без сборки — `npm run check:no-build`. preview локально показывает готовое, останавливается Ctrl+C и не загружает сайт. Настоящий поиск проверяется в собранном preview, dev лишь показывает подсказку.

Если нужна только сборка без полной проверки, выберите вместо предыдущей группы:

```bash
npm run build
npm run preview
```

Для pnpm — `pnpm run doctor`/`pnpm preview` либо `pnpm build`/`pnpm preview`. Не сокращайте проверку до `pnpm doctor`: это собственная диагностика pnpm. Выберите одну группу без повторной сборки.

Для первой публикации на статическом хостинге:

1. Задайте окончательный `site.url`/`PUBLIC_SITE_URL`, сохраните исходники, оригиналы/варианты изображений.
2. Команда платформы `npm run build`, выход `dist`. При ручной загрузке — **всё содержимое успешно собранного dist**.
3. Сохраните `_astro/`, `pagefind/`, `_social/`, публичные тексты и прочие результаты, не один HTML.
4. Корень домена и directory-index маршруты. Произвольный подпуть требует адаптации; одного Astro base недостаточно.
5. Подключите домен/HTTPS на платформе и проверьте главную, статьи, языки, картинки и поиск.

Сайт статический, без production Node.js или дополнительного adapter. noindex-заголовок terminal JSON объединяется в `dist/_headers`. Поддерживающие платформы применяют его, остальным нужны эквивалентные настройки. Astro preview заголовки хостинга не имитирует. После контента/конфига пересоберите и полностью разместите.

Подробно: [публикация на своём домене](https://demo.anglefeint.com/ru/blog/starter-guide-deployment/).

## Лицензия

Тема распространяется по [MIT License](LICENSE).

## Превью

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Превью ссылки

![Стандартное превью Anglefeint](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### Скриншоты страниц

| Главная                                                        | Список блога                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · Режим списка                                                        |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| Статья                                                                   |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| Пагинация блога                                                                   | Рекомендации статей                                                                |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ![Пагинация блога](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![Рекомендации статей](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · Материалы шифропанков                                                  |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
