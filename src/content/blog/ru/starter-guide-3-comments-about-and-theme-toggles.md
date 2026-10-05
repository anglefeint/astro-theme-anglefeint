---
tags:
  - anglefeint
  - starter
title: 'Руководство 3: Дополнительные функции'
subtitle: 'Музыка, комментарии, профиль, пагинация и оформление.'
description: 'Музыка, комментарии, профиль, пагинация и оформление.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/matrix-02.webp
---

## Музыка

Разместите аудио в public/music/ и добавьте:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

Трек содержит title, src и необязательный artist. Без треков плеер скрыт. Первый запуск требует клика. Сессия сохраняет трек, позицию и громкость; продолжение зависит от браузера, бесшовность не гарантируется. После последнего трека список начинается заново.

Перед воспроизведением скачивается весь файл. Большие файлы увеличивают ожидание и расход памяти. Для внешних источников нужен CORS; локальные файлы этого не требуют. enabled: false отключает плеер.

## Комментарии Giscus

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

## Страница автора

Редактируйте i18n.locales.ru.about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals и effects. ethos — массив. Другие языки заполняйте отдельно. Инструменты страницы — визуальные демонстрации, не реальные сервисы ИИ. Пустой email скрывает ссылку. theme.enableAboutPage: false удаляет страницу и пункт меню.

## Количество статей и переключатели

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

## Другие языки и главная страница

Добавьте код в i18n.locales с meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages и about. Затем создайте статьи через --locales. fallback дополняет отсутствующие настройки и тексты, но не переводит статьи и не смешивает языки в списках. Основной язык добавляется в цепочку при необходимости. label меняет только название в меню.

defaultLocalePrefix: 'always' перенаправляет / на локализованную главную; 'never' делает обратное для основного языка. Пути статей сохраняют язык.

## Подвал и проверка

footer.showCredits: false скрывает ссылки на тему и Astro, сохраняя год сборки и site.title. site.tagline независим. Старое значение Built with Astro. считается встроенным упоминанием, чтобы избежать дублирования.

Автоматические карточки используют встроенный фон с дождём кода, терминалами и неоновой сетью, сохраняя ваше название сайта, заголовок и автора. Небольшая подпись `Theme by Anglefeint` справа внизу зависит от `theme.footer.showCredits` (по умолчанию `true`); `false` скрывает подписи и в подвале, и на изображении. После изменения пересоберите и опубликуйте сайт. Собственные файлы `ogImage` не изменяются. Фон работает офлайн и не добавляет JavaScript в браузер.

Объединяйте настройки в одном theme или i18n. Массивы заменяются целиком. Проверьте в разработке, выполните npm run doctor и проверьте поиск через npm run preview. Пересоберите и опубликуйте изменения.

- [Руководство 1: Настройка блога](/ru/blog/starter-guide-1-configure-your-site/)
- [Руководство 2: Статьи и организация контента](/ru/blog/starter-guide-2-languages-and-routing/)
- [Руководство 3: Дополнительные функции](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)
