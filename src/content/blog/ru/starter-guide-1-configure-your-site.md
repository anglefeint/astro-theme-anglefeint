---
tags:
  - anglefeint
  - starter
title: 'Руководство 1: Настройка блога'
subtitle: 'Установка, данные сайта, языки и публикация.'
description: 'Установка, данные сайта, языки и публикация.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
---

## Установка и локальный запуск

Нужен Node.js 22.12.0 или новее. В мастере выберите папку, например my-blog, и укажите её в cd. Пропустите npm install, если зависимости уже установлены.

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
cd my-blog
npm install
npm run dev
```

Откройте адрес из терминала. Для pnpm используйте ту же команду создания, пропустите установку в мастере, затем выполните pnpm install и pnpm dev.

## Данные сайта и главная страница

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

defaultLocalePrefix: 'never' показывает главную основного языка сразу на /. Стандартное 'always' перенаправляет на `/<язык>/`, иногда с кратким “Redirecting to home…”. Статьи остаются на /ru/blog/ и при 'never'.

social.links содержит href, label и icon (github, twitter или mastodon). Пустой список оставляет декоративные значки без ссылок. site.tagline добавляет текст в подвал.

## Выбор языков

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

## Замена примеров и первая статья

Для каждого языка starter содержит приветствие и три руководства. Сохраните нужное и удалите лишние примеры; не удаляйте используемые изображения.

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

Команда создаёт шаблон для каждого активного языка, изначально девять. Она не переводит текст и не перезаписывает файлы. Измените заголовок, описание и текст в src/content/blog/ru/my-first-post.md.

## Проверка и публикация

```bash
npm run doctor
npm run preview
```

doctor выполняет проверки и сборку. preview показывает результат локально, не публикуя его. Статический сайт находится в dist/, включая поиск и изображения ссылок. На хостинге задайте npm run build и каталог dist. Следуйте [инструкции Astro](https://docs.astro.build/en/guides/deploy/), затем проверьте страницы, переключение языков, поиск и /ru/rss.xml.

## Правила настройки

Оставляйте по одному объекту theme и i18n. Объединяйте параметры; массивы заменяются целиком. Не редактируйте созданные адаптеры в src/config/. Обновление npm не обновляет локальные файлы starter. Перед миграцией прочитайте [руководство по обновлению](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

- [Руководство 1: Настройка блога](/ru/blog/starter-guide-1-configure-your-site/)
- [Руководство 2: Статьи и организация контента](/ru/blog/starter-guide-2-languages-and-routing/)
- [Руководство 3: Дополнительные функции](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)
