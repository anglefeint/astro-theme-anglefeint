import { test, expect } from '@playwright/test';

test.use({ screenshot: 'off', trace: 'off', reducedMotion: 'reduce' });

test('localized About contents match actual headings and stay separate from tools', async ({
  request,
}) => {
  for (const locale of ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru']) {
    const response = await request.get(`/${locale}/about/`);
    expect(response.ok()).toBeTruthy();
    const { parse } = await import('node-html-parser');
    const doc = parse(await response.text());
    const directory = doc.querySelector('.about-navigation');
    expect(directory.querySelectorAll('a')).toHaveLength(5);
    expect(directory.querySelector('.hacker-sidebar')).toBeNull();
    expect(doc.querySelectorAll('.hacker-sidebar')).toHaveLength(1);
    for (const link of directory.querySelectorAll('a')) {
      const heading = doc.querySelector(link.getAttribute('href'));
      expect(heading).not.toBeNull();
      expect(heading.textContent).toContain(link.textContent.trim());
    }
    expect(doc.querySelector('.frontier-contact').getAttribute('href')).toBe(
      `/${locale}/about/#contact`
    );
  }
});

test('Frontier Contact navigation closes the menu and retains keyboard dismissal', async ({
  page,
}) => {
  await page.goto('/en/about/');
  const menu = page.locator('.frontier-dropdown');
  const trigger = menu.locator('summary');
  await trigger.click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.locator('.frontier-contact').click();
  await expect(page).toHaveURL(/\/en\/about\/#contact$/);
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('#contact')).toContainText('Contact');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('.about-shell h1').click();
  await expect(menu).not.toHaveAttribute('open', '');
});

test('native About anchors remain usable without page JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${test.info().project.use.baseURL}/zh/about/`);
    await page.locator('.about-contact-link').click();
    await expect(page).toHaveURL(/\/zh\/about\/#contact$/);
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('.about-contact-copy')).toBeVisible();
  } finally {
    await context.close();
  }
});
