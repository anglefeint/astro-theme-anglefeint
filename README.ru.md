[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/ru/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Кинематографичная тема Astro для личного блога.</p>

[Demo](https://demo.anglefeint.com/ru/) · [GitHub](https://github.com/anglefeint/astro-theme-anglefeint)

<p align="center">
  <a href="#installation">Установка</a> · <a href="#setup">Настройка</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.5-BC52EE?logo=astro&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="installation"></a>

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install
```

<a id="setup"></a>

## Руководство 1: Настройка блога

### Установка и локальный запуск

Нужен Node.js 22.12.0 или новее. Команда выше один раз создаёт новую папку `my-blog` и пропускает установку зависимостей. Ответьте на остальные вопросы и продолжайте ниже; если изменили имя папки, измените и `cd`.

```bash
cd my-blog
npm install
npm run dev
```

Сервер разработки продолжает работать. Перед следующими командами остановите его через `Ctrl+C` или откройте второй терминал в `my-blog`. Все дальнейшие команды выполняются в папке проекта. Повторно создавать проект не нужно.

Откройте адрес из терминала. Для pnpm используйте ту же команду создания, пропустите установку в мастере, затем выполните pnpm install и pnpm dev.

### Данные сайта и главная страница

Редактируйте объект в src/site.config.ts, сохраняя импорты и экспорты. Замените домен, имя, автора и тексты. Объедините пример с текущими настройками.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { title: 'My Blog', author: 'Your Name', url: 'https://your-domain.example' },
  i18n: {
    defaultLocale: 'ru',
    routing: { defaultLocalePrefix: 'never' },
    locales: {
      ru: {
        site: { hero: 'My Blog' },
        messages: { siteDescription: 'My Blog' },
      },
    },
  },
});
```

site.url задаёт домен canonical, RSS, sitemap и изображений для ссылок. PUBLIC_SITE_URL в .env или окружении сборки имеет приоритет. После изменений перезапустите разработку или пересоберите сайт. Видимый текст главной берётся из site.hero языка, описание — из messages.siteDescription. Одного изменения site.description недостаточно.

defaultLocalePrefix: 'never' показывает главную основного языка сразу на /. Стандартное 'always' перенаправляет на /<язык>/, иногда с кратким “Redirecting to home…”. Статьи остаются на /ru/blog/ и при 'never'.

social.links содержит href, label и icon (github, twitter или mastodon). Пустой список оставляет декоративные значки без ссылок. site.tagline добавляет текст в подвал.

### Выбор языков

Включены en, ja, ko, es, zh, pt-br, de, ru и zh-hant; исходный основной язык — английский. Для отключения добавьте, например:

```ts
i18n: {
  locales: {
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
  },
},
```

Пропуск языка не отключает его: настройки объединяются со стандартными. Основной язык всегда активен. Для одноязычного блога явно отключите остальные восемь. Это не удаляет и не переводит файлы.

### Замена примеров и первая статья

Для каждого языка starter содержит приветствие и три руководства. Сохраните нужное и удалите лишние примеры; не удаляйте используемые изображения.

```bash
npm run new-post -- my-first-post --locales ru
```

Начните с одной статьи на русском. Без `--locales ru` команда создаёт заготовки для всех включённых языков (изначально девять), без автоматического перевода. Существующие файлы сохраняются. Измените заголовок, описание и текст в src/content/blog/ru/my-first-post.md.

### Проверка и публикация

```bash
npm run doctor
npm run preview
```

doctor выполняет проверки и сборку. preview показывает результат локально, не публикуя его. Статический сайт находится в dist/, включая поиск и изображения ссылок. На хостинге задайте npm run build и каталог dist. Следуйте [инструкции Astro](https://docs.astro.build/en/guides/deploy/), затем проверьте страницы, переключение языков, поиск и /ru/rss.xml.

### Правила настройки

Оставляйте по одному объекту theme и i18n. Объединяйте параметры; массивы заменяются целиком. Не редактируйте созданные адаптеры в src/config/. Обновление npm не обновляет локальные файлы starter. Перед миграцией прочитайте [руководство по обновлению](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

- [Руководство 2: Статьи и организация контента](https://demo.anglefeint.com/ru/blog/starter-guide-2-languages-and-routing/)

## Языки

Изначально включены девять языков: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`. `new-post` создаёт девять файлов, но не переводит текст. Отключайте ненужные языки через `meta.enabled: false` в `src/site.config.ts`; пропуска записи недостаточно. Основной язык остаётся активным. Только русский: `npm run new-post -- my-post --locales ru`.

## Руководство 2: Статьи и организация контента

### Создать статью

```bash
npm run new-post -- my-first-post --locales ru
```

Только русский: npm run new-post -- my-first-post --locales ru. Slug содержит строчные латинские буквы, цифры и дефисы. src/content/blog/ru/my-first-post.md создаёт /ru/blog/my-first-post/. Существующие файлы сохраняются. --locales создаёт файлы, но не включает язык.

Переводы используют одинаковый slug. Если перевода нет, меню ведёт в список статей выбранного языка; hreflang не выдаёт список за перевод статьи.

### Заполнить frontmatter

```yaml
---
title: 'My first post'
description: 'My notes and projects'
pubDate: '2026-10-03'
tags: ['astro', 'notes']
---
```

Обязательны title, description и pubDate. subtitle, updatedDate и author необязательны; по умолчанию используется автор сайта. Сортировка идёт по pubDate. Фильтра черновиков и отложенной публикации нет: draft: true и будущие даты ничего не скрывают. Храните незавершённые тексты вне src/content/blog/.

heroImage: ./cover.jpg берёт изображение рядом со статьёй. При наличии файлов в src/assets/blog/default-covers/ команда выбирает постоянную обложку. Загрузки изображений из сети нет. Время чтения и показатели приблизительные. readMinutes, wordCount, tokenCount, aiLatencyMs и aiConfidence позволяют задать свои значения, не подключая сервис ИИ.

### Оглавление и теги

Используйте заголовки Markdown ## и ###. Оглавление появляется справа на широком экране и перед текстом на узком. Без заголовков оно скрыто. toc: false отключает его для статьи; toc: true имеет приоритет над настройкой сайта. Заголовки внутри компонентов MDX и HTML автоматически не собираются.

tags: ['astro', 'notes'] создаёт страницы в /ru/tags/. Регистр значим; пробелы по краям и повторы удаляются. Для нелатинских названий используются кодированные URL. Переименование меняет ссылку. theme.tags.enabled: false отключает ссылки и страницы тегов.

### Изображения и код

Используйте `![Описание](./photo.jpg)` либо `![Описание](https://demo.anglefeint.com/images/photo.jpg)`, добавив соответствующий файл. Обычные изображения открываются по клику или Enter/Пробелу, закрываются Escape, кнопкой или фоном. Обложки и изображения внутри ссылок и кнопок исключены. Просмотр использует выбранный браузером файл, не загружая увеличенный оригинал.

Блоки кода Markdown с тройными обратными кавычками получают кнопку копирования. Отступы и переносы сохраняются. Нужен HTTPS или localhost; при ошибке копируйте вручную.

### Поиск

Выполните npm run build и npm run preview. Поиск работает по заголовкам и тексту текущего языка. В dev показывается только уведомление. search: false исключает статью из индекса, но не скрывает её из списков или по прямой ссылке. theme.search.enabled: false отключает поиск и индекс. После изменения статей нужна сборка.

### Изображения для ссылок

Без ogImage сборка создаёт PNG 1200×630 с заголовком, автором и названием сайта. heroImage остаётся отдельной обложкой. Свой файл: ogImage: ./share.png либо /images/share.png; HTTPS также поддерживается. Отсутствующий локальный файл вызывает ошибку; внешний зависит от сервиса.

Явный ogImage имеет приоритет. theme.socialImage.enabled: false отключает только генерацию; иначе используется обложка или стандартное изображение. Проверяйте og:image в HTML и dist/\_social/. Платформы могут кешировать старые превью. Не гарантируются все эмодзи и системы письма.

### Отдельные страницы

npm run new-page -- projects --theme cyber создаёт src/pages/[lang]/projects.astro. Отредактируйте содержимое самостоятельно; перевод и пункт навигации не добавляются. Темы: base, ai, cyber, hacker и matrix. Допускаются пути вроде projects/labs. Если файл существует, команда завершается ошибкой.

- [Руководство 2: Статьи и организация контента](https://demo.anglefeint.com/ru/blog/starter-guide-2-languages-and-routing/)

## Руководство 3: Дополнительные функции

### Музыка

Разместите аудио в public/music/ и добавьте:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

Трек содержит title, src и необязательный artist. Без треков плеер скрыт. Первый запуск требует клика. Сессия сохраняет трек, позицию и громкость; продолжение зависит от браузера, бесшовность не гарантируется. После последнего трека список начинается заново.

Перед воспроизведением скачивается весь файл. Большие файлы увеличивают ожидание и расход памяти. Для внешних источников нужен CORS; локальные файлы этого не требуют. enabled: false отключает плеер.

### Комментарии Giscus

Подготовьте публичный репозиторий с Discussions, установите приложение и получите ID на [giscus.app](https://giscus.app/).

```ts
theme: {
  comments: {
    enabled: true, repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID', category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID', mapping: 'pathname', lang: '',
  },
},
```

Замените ID и категорию. Не вставляйте скрипт в каждую статью. Пустые обязательные поля скрывают блок. lang: '' следует языку статьи: pt-br использует pt, zh-hant — zh-TW, zh — zh-CN. По умолчанию фиксирован английский.

mapping: 'pathname' связывает обсуждения с путём. 'specific' требует term, 'number' — положительное целое число строкой в number. Неверные значения вызывают ошибку. strict и reactionsEnabled используют '0' или '1'. Проверяйте ID, разрешения, сеть и блокировки браузера.

### Страница автора

Редактируйте i18n.locales.ru.about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals и effects. ethos — массив. Другие языки заполняйте отдельно. Инструменты страницы — визуальные демонстрации, не реальные сервисы ИИ. Пустой email скрывает ссылку. theme.enableAboutPage: false удаляет страницу и пункт меню.

### Количество статей и переключатели

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 9,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

false отключает функцию. enableRedQueen управляет только монитором статьи. toc: true в статье имеет приоритет над глобальным значением. socialImage не отключает ручной ogImage. Атмосферы определяются макетами, общего переключателя всех страниц нет.

homeLatestCount задаёт число новых статей, blogPageSize — размер списков и страниц тегов. pagination.windowSize ограничен 5–21. Переход по номеру появляется при jump.enabled и числе страниц выше showJumpThreshold, изначально 12. jump.enterToGo управляет Enter. style.mode принимает fixed, sequential и random. random стабилен для страницы. style.enabled: false сохраняет простую пагинацию.

### Другие языки и главная страница

Добавьте код в i18n.locales с meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages и about. Затем создайте статьи через --locales. fallback дополняет отсутствующие настройки и тексты, но не переводит статьи и не смешивает языки в списках. Основной язык добавляется в цепочку при необходимости. label меняет только название в меню.

defaultLocalePrefix: 'always' перенаправляет / на локализованную главную; 'never' делает обратное для основного языка. Пути статей сохраняют язык.

### Подвал и проверка

footer.showCredits: false скрывает ссылки на тему и Astro, сохраняя год сборки и site.title. site.tagline независим. Старое значение Built with Astro. считается встроенным упоминанием, чтобы избежать дублирования.

Объединяйте настройки в одном theme или i18n. Массивы заменяются целиком. Проверьте в разработке, выполните npm run doctor и проверьте поиск через npm run preview. Пересоберите и опубликуйте изменения.

- [Руководство 2: Статьи и организация контента](https://demo.anglefeint.com/ru/blog/starter-guide-2-languages-and-routing/)

## Обновление

Начните с публичного шаблона. Совместимые обновления пакета устанавливаются через npm update @anglefeint/astro-theme, затем npm run doctor.

npm update соблюдает диапазон package.json: ^0.5.1 не включает 0.6.0. Читайте заметки и при необходимости устанавливайте конкретную версию вместо слепого @latest. npm ls @anglefeint/astro-theme astro показывает установленные версии.

Пакет не обновляет локальные настройки, маршруты, адаптеры и интеграции starter. При структурных изменениях создайте новый starter в другой папке и перенесите контент и личные настройки. Не заменяйте новые вспомогательные файлы старыми.

doctor уже включает проверки и сборку. Затем используйте npm run preview. Запускайте npm run sync-adapters только при расхождении созданных адаптеров с локальными шаблонами: новые шаблоны он не скачивает. В старых проектах команды могут отличаться.

При переходе на новую основную версию Astro сначала следуйте официальной миграции. Подробности — в [руководстве по обновлению](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

```bash
npm update @anglefeint/astro-theme
npm run doctor
npm run preview
```

## Предпросмотр

![Home](public/images/theme-previews/preview-home.png)

![Blog](public/images/theme-previews/preview-blog-list.png)

![Article](public/images/theme-previews/preview-blog-post-open.png)

![About](public/images/theme-previews/preview-about.png)

## Лицензия

MIT — [LICENSE](LICENSE).
