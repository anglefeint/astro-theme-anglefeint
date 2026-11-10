---
tags: ['anglefeint', 'starter']
title: 'Руководство 4: Настройка комментариев Giscus'
description: 'Руководство 4: Настройка комментариев Giscus'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Добавьте следующие поля `theme.comments` в существующий объект `defineThemeConfig({...})` в `src/site.config.ts`. Сохраните остальные настройки и не создавайте повторные ключи `theme` или `comments`.

`shareAcrossLocales: false` — `mapping: 'pathname'`

## Настройка комментариев

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

## Общие комментарии для переводов статьи

Комментарии и общий режим по умолчанию выключены. Для привязки по пути используйте настройку выше. Чтобы переводы использовали одно обсуждение, сохраните данные репозитория и категории, заменив параметры привязки на:

```ts
theme: {
  comments: {
    // Сохраните свои enabled, repo, repoId, category и categoryId.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Общий режим требует mapping specific, пустые term и number и strict как строку 1. Статья передаёт в data-term полный slug без языкового префикса. Девять переводов используют cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup и other/setup остаются разными обсуждениями. Отсутствие slug вызывает ошибку. У переводов должен быть одинаковый slug. Пустой lang следует языку страницы; явно заданный язык остаётся фиксированным. Текст не переводится: общими становятся обсуждение и реакции.

Без общего режима пользовательские mapping, term, number и strict работают как раньше: specific требует непустой term; number — положительное целое число строкой. При включённых комментариях и общем режиме несовместимый mapping, непустые term/number или strict не равный 1 вызывают явную ошибку. Проверьте два перевода и другую статью. Для отправки нужна авторизация GitHub. Дополните существующий объект comments, не перезаписывая остальные настройки.

Существующие обсуждения не объединяются, не перемещаются и не удаляются автоматически. Общий режим может выбрать другое обсуждение, где старые комментарии не появятся. Сохраните mapping, term, number и strict до переключения. Для возврата задайте shareAcrossLocales: false и восстановите исходные значения. Если нужно перенести комментарии, оцените ситуацию и выполните это вручную в GitHub; тема не выполняет миграцию.

Сначала обновите существующий интеграционный starter до версии темы с этой опцией. После изменения настроек заново соберите и опубликуйте сайт; проверьте комментарии в предпросмотре сборки.

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← Руководство 3](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)
