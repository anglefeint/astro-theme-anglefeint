import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeI18nConfig } from '../src/site.config.ts';

test('normalizeI18nConfig derives locale metadata from a single registry', () => {
  const normalized = normalizeI18nConfig({
    defaultLocale: 'en',
    locales: {
      en: {
        meta: {
          label: 'English',
        },
      },
      fr: {
        meta: {
          label: 'Français',
          hreflang: 'fr',
          ogLocale: 'fr_FR',
          fallback: ['en'],
        },
        site: {
          hero: 'Bonjour',
        },
      },
    },
    routing: {
      defaultLocalePrefix: 'never',
    },
    validation: {
      requireCompleteMessages: false,
      requireCompleteAbout: false,
      requireCompleteHero: false,
      requireOgLocale: false,
    },
  });

  assert.equal(normalized.defaultLocale, 'en');
  assert.equal(normalized.locales.en.meta.enabled, true);
  assert.equal(normalized.locales.en.meta.hreflang, 'en');
  assert.deepEqual(normalized.locales.en.meta.fallback, []);
  assert.equal(normalized.locales.fr.meta.label, 'Français');
  assert.equal(normalized.locales.fr.meta.ogLocale, 'fr_FR');
  assert.deepEqual(normalized.locales.fr.meta.fallback, ['en']);
  assert.equal(normalized.locales.fr.site.hero, 'Bonjour');
});

test('normalizeI18nConfig injects the default locale when omitted from locale registry', () => {
  const normalized = normalizeI18nConfig({
    defaultLocale: 'en',
    locales: {
      fr: {
        meta: {
          label: 'Français',
        },
      },
    },
    routing: {
      defaultLocalePrefix: 'never',
    },
    validation: {
      requireCompleteMessages: false,
      requireCompleteAbout: false,
      requireCompleteHero: false,
      requireOgLocale: false,
    },
  });

  assert.equal(normalized.locales.en.meta.label, 'en');
  assert.deepEqual(normalized.locales.fr.meta.fallback, ['en']);
});
