import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

const smokeConfig = JSON.parse(
  await readFile(path.join(process.cwd(), 'tests/e2e/.generated-smoke-config.json'), 'utf8')
);
const { siteUrl, defaultLocale, defaultLocaleOgLocale, defaultLocalePrefixMode, defaultHomePath } =
  smokeConfig;
const enabledLocales = smokeConfig.enabledLocales;

test('homepage routing keeps default locale canonical and localized default locale redirecting', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveURL(new RegExp(`${defaultHomePath.replace(/\//g, '\\/')}$`));
  await expect(page.locator('html')).toHaveAttribute('lang', defaultLocale);

  await page.goto(`/${defaultLocale}/`);
  if (defaultLocalePrefixMode === 'never') {
    await expect(page).toHaveURL(new RegExp(`${defaultHomePath.replace(/\//g, '\\/')}$`));
  } else {
    await expect(page).toHaveURL(new RegExp(`\\/${defaultLocale}\\/$`));
  }
});

test('head alternates and language switcher reflect enabled locales', async ({ page }) => {
  await page.goto('/');

  const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonicalHref).toBe(new URL(defaultHomePath, siteUrl).toString());

  const alternateLinks = page.locator(
    'link[rel="alternate"][hreflang]:not([hreflang="x-default"])'
  );
  await expect(alternateLinks).toHaveCount(enabledLocales.length);

  for (const { hreflang } of enabledLocales) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
  }

  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    new URL(defaultHomePath, siteUrl).toString()
  );
  if (defaultLocaleOgLocale) {
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      defaultLocaleOgLocale
    );
  }

  const switcher = page.locator('#lang-select');
  await expect(switcher.locator('option')).toHaveCount(enabledLocales.length);
  await expect(switcher).toHaveValue(defaultHomePath);

  const targetLocale = enabledLocales.find((locale) => locale.code !== defaultLocale);
  expect(targetLocale).toBeTruthy();
  await switcher.selectOption(`/${targetLocale.code}/`);
  await expect(page).toHaveURL(new RegExp(`\\/${targetLocale.code.replace('-', '\\-')}\\/$`));
  await expect(page.locator('html')).toHaveAttribute('lang', targetLocale.code);
});
