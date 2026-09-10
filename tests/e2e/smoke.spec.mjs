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

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test(`reading and About interactions at ${viewport.width}px with reduced motion`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors = [];
    const mediaRequests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.url().includes('theme-redqueen')) mediaRequests.push(request.url());
    });
    await page.goto('/');
    await page.locator('a.home-post-title').first().click();
    await expect(page.locator('body')).toHaveClass(/ai-page/);
    await expect(page.locator('.rq-tv')).toHaveAttribute('hidden', '');
    await expect(page.locator('.rq-tv img')).toHaveCount(0);
    const paragraph = page.locator('.ai-prose-body p').first();
    // The existing floating panel never becomes geometrically stable; native scrolling still works.
    await paragraph.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' })
    );
    await expect(paragraph).toHaveClass(/ai-para-visible/);
    await expect(paragraph).toHaveCSS('opacity', '1');
    await expect(page.locator('.ai-prose-body')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: testInfo.outputPath('article.png') });
    expect(mediaRequests).toEqual([]);

    await page.goto(`/${defaultLocale}/about/`);
    if (viewport.width > 900) {
      await page.locator('[data-modal="help"]').click();
      await expect(page.locator('#hacker-modal')).toHaveAttribute('aria-hidden', 'false');
      await page.screenshot({ path: testInfo.outputPath('about-modal.png') });
      await page.keyboard.press('Escape');
      await expect(page.locator('#hacker-modal')).toHaveAttribute('aria-hidden', 'true');
    } else {
      await expect(page.locator('.hacker-sidebar')).toBeHidden();
      const contact = page.locator('main a[href^="mailto:"]');
      await contact.scrollIntoViewIfNeeded();
      await expect(contact).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath('about-mobile.png') });
    }
    expect(errors).toEqual([]);
  });
}

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
