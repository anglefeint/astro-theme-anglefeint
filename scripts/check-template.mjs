import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile, spawn } from 'node:child_process';
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  readdir,
  access,
  rm,
  realpath,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { parse } from 'node-html-parser';
import { chromium, expect } from '@playwright/test';
import { checkReadmeLinks } from './check-readme-links.mjs';
import { checkStarterGuidance } from './check-starter-guidance.mjs';
import { articleAlternateFixtures, checkArticleAlternates } from './check-article-alternates.mjs';
import { auditDependencies } from './audit-dependencies.mjs';

const exec = promisify(execFile);
const root = process.cwd();
const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run via npm run check:template');
const pm = process.argv.includes('--pnpm') ? 'pnpm' : 'npm';
const upgradeFrom = process.argv
  .find((arg) => arg.startsWith('--upgrade-from='))
  ?.slice('--upgrade-from='.length);
if (upgradeFrom) {
  assert.equal(pm, 'npm', 'Automatic published upgrade acceptance supports npm only');
  assert.match(upgradeFrom, /^\d+\.\d+\.\d+$/);
}
const parent = await realpath(tmpdir());
const temporary = await mkdtemp(path.join(parent, 'anglefeint-template-'));
const project = path.join(temporary, 'site');
// Playwright clears its own output directory on startup; keep command evidence separate.
const evidence = path.join(root, 'acceptance-results', `template-${pm}-${Date.now()}`);
await mkdir(evidence, { recursive: true });
const results = [];
const scripts = new Set();
const env = {
  ...process.env,
  // create-astro may silently reuse a cached archive when its download fails.
  // A fresh cache makes remote acceptance fail instead of testing an old starter.
  XDG_CACHE_HOME: path.join(temporary, 'cache'),
  ANGLEFEINT_LOCALES: '',
  NODE_OPTIONS: '',
  NODE_PATH: '',
  PUBLIC_SITE_URL: '',
};
// Host-specific site identity must not contaminate a clean consumer install.
for (const key of Object.keys(env)) if (key.startsWith('PUBLIC_SITE_')) delete env[key];
const pmArgs = (args) =>
  pm === 'npm' ? args : ['exec', '--yes', '--package=pnpm@10', '--', 'pnpm', ...args];
const file = (name) => path.join(project, name);
const read = (name) => readFile(file(name), 'utf8');
const config = (value) =>
  `import { defineThemeConfig } from '@anglefeint/astro-theme/config';\nexport { normalizeI18nConfig } from '@anglefeint/astro-theme/config';\nexport { DEFAULT_ABOUT_CONFIG } from '@anglefeint/astro-theme/config';\nexport const THEME_CONFIG = defineThemeConfig(${JSON.stringify(value)});\n`;
let passed = false;

async function userFileHashes() {
  const names = [];
  for (const folder of ['src', 'public']) {
    for (const entry of await readdir(file(folder), { recursive: true, withFileTypes: true }))
      if (entry.isFile()) names.push(path.join(entry.parentPath, entry.name));
  }
  names.push(...['.env', 'astro.config.mjs', 'tsconfig.json', 'README.md'].map(file));
  return Promise.all(
    names.sort().map(async (name) => [
      path.relative(project, name),
      createHash('sha256')
        .update(await readFile(name))
        .digest('hex'),
    ])
  );
}

async function command(args, { cwd = project, overrides = {}, reject = false, npm = false } = {}) {
  const label = `${npm ? 'npm' : pm} ${args.join(' ')}`;
  console.log(label);
  let output;
  try {
    output = await exec(process.execPath, [npmCli, ...(npm ? args : pmArgs(args))], {
      cwd,
      env: { ...env, ...overrides },
      timeout: 600_000,
      maxBuffer: 40 * 1024 * 1024,
    });
  } catch (error) {
    output = error;
  }
  const exitCode = output instanceof Error ? output.code : 0;
  const ok = reject ? Number.isInteger(exitCode) && exitCode > 0 : exitCode === 0;
  const log = `${output.stdout ?? ''}\n${output.stderr ?? ''}`;
  const logFile = `${results.length}.log`;
  await writeFile(path.join(evidence, logFile), log);
  results.push({
    command: label,
    exitCode,
    status: ok ? (reject ? 'expected-rejection' : 'passed') : 'failed',
    logFile,
  });
  assert(ok, `${label}\n${log}\nEvidence: ${evidence}`);
  if (args[0] === 'run' && !reject) scripts.add(args[1]);
  return log;
}
const run = (name, args = [], options = {}) =>
  command(['run', name, ...(args.length && pm === 'npm' ? ['--'] : []), ...args], options);
async function locales(slug, expected) {
  const found = [];
  for (const locale of await readdir(file('src/content/blog'))) {
    try {
      await access(file(`src/content/blog/${locale}/${slug}.md`));
      found.push(locale);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  assert.deepEqual(found.sort(), [...expected].sort(), slug);
}
async function stop(child) {
  if (child.exitCode !== null) return;
  if (process.platform === 'win32') {
    // Only the process tree started by this test, never a port's arbitrary owner.
    await exec('taskkill', ['/pid', String(child.pid), '/t', '/f']);
  } else {
    process.kill(-child.pid, 'SIGTERM');
  }
}
async function server(mode, routes, inspect) {
  const port = pm === 'npm' ? 4381 : 4382;
  const args = pmArgs([
    'run',
    mode,
    ...(pm === 'npm' ? ['--'] : []),
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
  ]);
  const child = spawn(process.execPath, [npmCli, ...args], {
    cwd: project,
    env: { ...env, ASTRO_DEV_BACKGROUND: '1', ASTRO_PREVIEW_BACKGROUND: '1' },
    detached: process.platform !== 'win32',
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (chunk) => (log += chunk));
  child.stderr.on('data', (chunk) => (log += chunk));
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 120; i++) {
      assert.equal(child.exitCode, null, log);
      // Require this process to announce its own port: do not test an unrelated server.
      if (log.includes(base)) {
        try {
          if ((await fetch(`${base}/en/`, { signal: AbortSignal.timeout(1500) })).ok) {
            ready = true;
            break;
          }
        } catch {
          /* startup */
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    assert(ready, log);
    for (const route of routes) assert.equal((await fetch(base + route)).status, 200, mode + route);
    if (inspect) await inspect(base);
    scripts.add(mode);
    results.push({ command: `${pm} run ${mode}`, status: 'passed', routes });
  } finally {
    await stop(child);
    await writeFile(path.join(evidence, `${mode}-${results.length}.log`), log);
  }
}

async function browserCheck(base, customized = false) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.tracing.start({ screenshots: true, snapshots: true });
  let success = false;
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + '/en/');
    await expect(page.locator('footer .footer-credits')).toHaveCount(customized ? 0 : 1);
    if (customized) {
      await expect(page.locator('main h1')).toHaveText('Acceptance home heading');
      await expect(page.locator('.home-signal-message')).toHaveText('Acceptance shared signal');
      await expect(page).toHaveTitle('Acceptance site');
      await expect(page.locator('body')).toContainText('Acceptance hero');
      await expect(page.locator('#lang-select option')).toHaveCount(2);
      await expect(page.locator('#lang-select option[value="/zh/"]')).toHaveText('测试中文');
      await expect(page.locator('[data-search-open]')).toHaveCount(0);
      await expect(page.locator('a.home-post-title')).toHaveCount(1);
      const requests = [];
      page.on('request', (request) => {
        if (request.url().endsWith('/music/tone.wav')) requests.push(request.url());
      });
      await page.goto(base + '/en/blog/default-locales/');
      await expect(page.locator('.ai-article-toc')).toHaveCount(0);
      const deck = page.locator('[data-music-deck]');
      await expect(deck).toBeVisible();
      await expect(deck.locator('[data-action="play"]')).toBeEnabled();
      assert.equal(requests.length, 0, 'music must not preload');
      await deck.locator('[data-action="play"]').click();
      await expect(deck).toHaveAttribute('data-status', 'playing');
      assert(requests.length > 0);
      await deck.locator('[data-action="play"]').click();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      await expect(deck.locator('[data-action="expand"]')).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      await deck.locator('[data-action="expand"]').click();
      await expect(deck.locator('[data-action="expand"]')).toHaveAttribute('aria-expanded', 'true');
    } else {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(base + '/zh/blog/');
        await expect(page.locator('[data-music-deck]')).toHaveCount(0);
        await page.locator('[data-search-open]').click();
        await page.getByRole('searchbox').fill('mastodon');
        await expect(page.locator('.search-results a').first()).toBeVisible();
        const links = await page
          .locator('.search-results a')
          .evaluateAll((items) => items.map((item) => item.pathname));
        assert(links.every((link) => link.startsWith('/zh/blog/')));
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await page.goto(base + '/zh/blog/starter-guide-1-configure-your-site/');
        await expect(page.locator('.ai-article-toc')).toBeVisible();
        await expect(page.locator('.code-copy').first()).toBeVisible();
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(base + '/en/about/');
      const aboutPanel = page.locator('#about-reading-window');
      await page.locator('[data-about-action="close"]').click();
      await expect(aboutPanel).toBeHidden();
      await expect(page.locator('[data-about-restore]')).toBeHidden();
      await page.locator('[data-about-open]').click();
      await expect(aboutPanel).toBeVisible();
      await page.locator('[data-about-action="minimize"]').click();
      await page.locator('[data-about-restore]').click();
      await expect(aboutPanel).toBeVisible();
      await page.locator('[data-about-action="maximize"]').click();
      await expect
        .poll(() => page.evaluate(() => globalThis.document.fullscreenElement?.id))
        .toBe('about-reading-window');
      await page.keyboard.press('Escape');
      await expect
        .poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement))
        .toBeFalsy();
    }
    assert.deepEqual(errors, []);
    await page.screenshot({
      path: path.join(evidence, customized ? 'customized.png' : 'default.png'),
    });
    await page.goto(base + '/en/decoder/');
    await expect(page.locator('[data-decoder-page]')).toBeVisible();
    const decoderInput = page.locator('[name="decoder-input"]');
    const decoderOutput = page.locator('.hacker-decoder-output');
    const decode = async () => {
      await page.locator('.hacker-decoder-submit').click();
      await expect(decoderOutput).toHaveAttribute('data-decoder-state', 'done');
      await expect(page.locator('.hacker-decoder-status')).toHaveAttribute('data-state', 'done');
    };
    await decoderInput.fill('SGVsbG8=');
    await decode();
    await expect(decoderOutput).toHaveText('Hello');
    await page.locator('[data-decoder-task="call"]').click();
    await page.locator('[name="decoder-decimals"]').fill('6');
    await page.locator('[data-decoder-example]').click();
    await decode();
    assert.equal(JSON.parse(await decoderOutput.textContent()).amount, '1');
    await page.locator('[data-decoder-task="address"]').click();
    for (const chain of ['evm', 'tron', 'btc']) {
      await page.locator('[name="decoder-chain"]').selectOption(chain);
      await page.locator('[data-decoder-example]').click();
      await decode();
      assert(JSON.parse(await decoderOutput.textContent()).address);
    }
    await expect(page.locator('footer a[href="/en/decoder/"]')).toHaveCount(1);
    if (customized)
      await expect(page.locator('[data-music-deck]')).toHaveAttribute('data-collapsed', 'true');
    assert.deepEqual(errors, []);
    await page.screenshot({
      path: path.join(evidence, customized ? 'decoder-customized.png' : 'decoder-default.png'),
    });
    results.push({ check: 'installed Decoder text/call/address examples', status: 'passed' });
    success = true;
    results.push({
      check: customized ? 'customized browser' : 'default browser',
      status: 'passed',
    });
  } finally {
    await context.tracing.stop(success ? {} : { path: path.join(evidence, 'failure-trace.zip') });
    await browser.close();
  }
}

try {
  await command(
    [
      'create',
      'astro@latest',
      '--',
      'site',
      '--template',
      'anglefeint/astro-theme-anglefeint#starter',
      '--yes',
      '--no-install',
      '--no-ai',
      '--no-git',
    ],
    { cwd: temporary, npm: true }
  );
  if (upgradeFrom) {
    const initial = JSON.parse(await read('package.json'));
    initial.dependencies['@anglefeint/astro-theme'] = upgradeFrom;
    await writeFile(file('package.json'), JSON.stringify(initial, null, 2));
  }
  await command(['install']);
  const managerVersion = (await command(['--version'])).trim();
  const pkg = JSON.parse(await read('package.json'));
  assert.deepEqual(
    Object.keys(pkg.dependencies).sort(),
    ['@anglefeint/astro-theme', 'astro'],
    'Public starter must keep build integrations package-owned'
  );
  await checkStarterGuidance(project);
  results.push({
    check: 'consumer AI entries, commands and local document references',
    status: 'passed',
  });
  const version = JSON.parse(
    await read('node_modules/@anglefeint/astro-theme/package.json')
  ).version;
  results.push({
    themeVersion: version,
    node: process.version,
    packageManager: pm,
    managerVersion,
  });
  await checkReadmeLinks(project, [
    'README.md',
    'README.zh-CN.md',
    'README.ja.md',
    'README.ko.md',
    'README.es.md',
    'README.pt-BR.md',
    'README.de.md',
    'README.ru.md',
    'README.zh-Hant.md',
  ]);
  const audit = auditDependencies(project, env);
  results.push({
    audit: 'policy passed',
    reportedVulnerabilities: audit.metadata.vulnerabilities.total,
  });
  for (const name of ['new-post', 'new-page']) assert.match(await run(name, ['--help']), /Usage:/i);
  await run('new-post', ['default-locales']);
  await locales('default-locales', ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant']);
  for (const [slug, args, overrides, expected] of [
    ['explicit-locales', ['--locales', 'en,fr'], {}, ['en', 'fr']],
    ['environment-locales', [], { ANGLEFEINT_LOCALES: 'en,fr' }, ['en', 'fr']],
    ['priority-locales', ['--locales', 'zh'], { ANGLEFEINT_LOCALES: 'en,fr' }, ['zh']],
  ]) {
    await run('new-post', [slug, ...args], { overrides });
    await locales(slug, expected);
  }
  const article = 'src/content/blog/en/default-locales.md';
  const originalArticle =
    (await read(article)) + '\n## Acceptance heading\n\nUser content sentinel\n';
  await writeFile(file(article), originalArticle);
  await run('new-post', ['default-locales']);
  assert.equal(await read(article), originalArticle);
  const routes = ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant'].flatMap(
    (locale) => [`/${locale}/`, `/${locale}/blog/default-locales/`]
  );
  for (const [slug, locales] of articleAlternateFixtures)
    await run('new-post', [slug, '--locales', locales.join(',')]);
  for (const theme of ['base', 'ai', 'cyber', 'hacker', 'matrix']) {
    await run('new-page', [`projects-${theme}`, '--theme', theme]);
    for (const locale of ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant'])
      routes.push(`/${locale}/projects-${theme}/`);
  }
  await run('new-page', ['projects/labs']);
  routes.push('/en/projects/labs/');
  const pageBefore = await read('src/pages/[lang]/projects-base.astro');
  await run('new-page', ['projects-base'], { reject: true });
  assert.equal(await read('src/pages/[lang]/projects-base.astro'), pageBefore);
  for (const name of ['new-post', 'new-page']) await run(name, ['INVALID_name'], { reject: true });
  await run('new-page', ['bad-theme', '--theme', 'unknown'], { reject: true });
  await command(['exec', '--no', '--', 'anglefeint-new-post', 'direct-post', '--locales', 'en'], {
    npm: true,
  });
  await command(['exec', '--no', '--', 'anglefeint-new-page', 'direct-page', '--theme', 'matrix'], {
    npm: true,
  });
  assert.equal(pkg.anglefeint?.projectSchema, 1);
  const oldConfig = await read('src/site.config.ts');
  await command(['update', '@anglefeint/astro-theme']);
  await command(['install']);
  assert.equal(await read('src/site.config.ts'), oldConfig);
  assert.equal(await read(article), originalArticle);
  for (const name of ['check:no-build', 'check', 'doctor', 'build']) await run(name);
  if (pm === 'npm') await run('upgrade', ['--check']);
  else {
    await run('upgrade', ['--check'], { reject: true });
    scripts.add('upgrade');
  }
  await checkArticleAlternates(project, 'en');
  results.push({ check: 'partial translation SEO and language menus', status: 'passed' });
  await run('astro', ['--version']);
  for (const locale of ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant']) {
    const about = parse(await read(`dist/${locale}/about/index.html`));
    const directory = about.querySelector('.about-navigation');
    assert.equal(directory.querySelectorAll('a').length, 5);
    assert.equal(directory.querySelector('.hacker-sidebar'), null);
    assert.equal(about.querySelectorAll('.hacker-sidebar').length, 1);
    assert.equal(about.querySelectorAll('[data-about-action]').length, 3);
    assert(about.querySelector('.hacker-sidebar [data-about-open]'));
    assert(about.querySelector('[data-about-restore]'));
    for (const link of directory.querySelectorAll('a'))
      assert(about.querySelector(link.getAttribute('href')));
    assert.equal(
      about.querySelector('.frontier-contact').getAttribute('href'),
      `/${locale}/about/#contact`
    );
    const index = await read(`dist/${locale}/llms.txt`);
    assert.equal(index.charCodeAt(0), 0xfeff);
    assert(index.includes(`/${locale}/blog/default-locales/index.md`));
    assert(
      (await read(`dist/${locale}/blog/default-locales/index.md`)).includes(`language: "${locale}"`)
    );
  }
  assert((await read('dist/en/blog/default-locales/index.md')).includes('User content sentinel'));
  results.push({
    check: 'published package generates nine-language Markdown/indexes from remote starter',
    status: 'passed',
  });
  await server('dev', routes);
  await server('preview', routes, (base) => browserCheck(base));
  assert.deepEqual(
    Object.keys(pkg.scripts).filter((name) => !scripts.has(name)),
    [],
    'every consumer script must be exercised'
  );

  await writeFile(
    file('src/site.config.ts'),
    config({
      aiReadableContent: {
        notes: 'Acceptance global policy. [About](en/about/)',
        links: [{ label: 'Public resource', href: 'https://example.org/' }],
      },
      site: {
        title: 'Acceptance site',
        url: 'https://config.example',
        author: 'Acceptance author',
      },
      i18n: {
        locales: {
          en: {
            site: { hero: 'Acceptance hero', homeTitle: 'Acceptance home heading' },
            messages: { home: { transmission: 'Acceptance shared signal' } },
          },
          zh: {
            aiReadableContent: { notes: '验收引用说明。', links: [] },
            meta: { label: '测试中文' },
            site: { homeTitle: '验收中文首页' },
            messages: { home: { transmission: '验收中文信号' } },
          },
          ja: { meta: { enabled: false } },
          ko: { meta: { enabled: false } },
          es: { meta: { enabled: false } },
          'pt-br': { meta: { enabled: false } },
          de: { meta: { enabled: false } },
          ru: { meta: { enabled: false } },
          'zh-hant': { meta: { enabled: false } },
        },
      },
      theme: {
        footer: { showCredits: false },
        homeLatestCount: 1,
        blogPageSize: 2,
        enableAboutPage: false,
        search: { enabled: false },
        tags: { enabled: false },
        toc: { enabled: false },
        socialImage: { enabled: false },
        effects: { enableRedQueen: false },
        music: { enabled: true, tracks: [{ title: 'Acceptance tone', src: '/music/tone.wav' }] },
      },
    })
  );
  await run('new-post', ['configured-locales']);
  await locales('configured-locales', ['en', 'zh']);
  // Generated silence exercises real audio loading without shipping copyrighted media.
  const wave = Buffer.alloc(44 + 8000 * 2 * 10);
  wave.write('RIFF');
  wave.writeUInt32LE(wave.length - 8, 4);
  wave.write('WAVEfmt ', 8);
  wave.writeUInt32LE(16, 16);
  wave.writeUInt16LE(1, 20);
  wave.writeUInt16LE(1, 22);
  wave.writeUInt32LE(8000, 24);
  wave.writeUInt32LE(16000, 28);
  wave.writeUInt16LE(2, 32);
  wave.writeUInt16LE(16, 34);
  wave.write('data', 36);
  wave.writeUInt32LE(wave.length - 44, 40);
  await mkdir(file('public/music'), { recursive: true });
  await writeFile(file('public/music/tone.wav'), wave);
  await writeFile(file('.env'), 'PUBLIC_SITE_URL=https://acceptance.example\n');
  if (pm === 'npm') {
    const before = await userFileHashes();
    const upgradeOutput = await command(
      ['exec', '--yes', '--', '@anglefeint/astro-theme@latest', 'upgrade'],
      {
        npm: true,
      }
    );
    assert.deepEqual(
      await userFileHashes(),
      before,
      'Published npx upgrade must preserve personalized source/config/media/docs'
    );
    const target = upgradeOutput.match(/Anglefeint \S+ -> (\S+); project schema/)?.[1];
    assert(target, 'The published CLI must report its resolved upgrade target');
    assert.equal(
      JSON.parse(await read('node_modules/@anglefeint/astro-theme/package.json')).version,
      target
    );
    assert.equal(
      JSON.parse(await read('package.json')).dependencies['@anglefeint/astro-theme'],
      target
    );
    results.push({
      check: 'real published npx upgrade on customized remote starter',
      status: 'passed',
      fromVersion: version,
      toVersion: target,
      preservedFiles: before.length,
    });
  }
  await run('build');
  const home = await read('dist/en/index.html');
  const machineIndex = await read('dist/llms.txt');
  assert(machineIndex.includes('# Acceptance site'));
  assert(machineIndex.includes('Acceptance global policy'));
  assert(machineIndex.includes('https://acceptance.example/en/about/'));
  assert(machineIndex.includes('https://example.org/'));
  assert(machineIndex.includes('https://acceptance.example/zh/llms.txt'));
  assert(!machineIndex.includes('/ja/llms.txt'));
  await assert.rejects(access(file('dist/ja/llms.txt')), { code: 'ENOENT' });
  const machineArticle = await read('dist/zh/blog/configured-locales/index.md');
  assert(machineArticle.includes('author: "Acceptance author"'));
  assert(machineArticle.includes('验收引用说明。'));
  assert(machineArticle.includes('not part of the article'));
  assert(!machineArticle.includes('Acceptance global policy'));
  assert(!machineArticle.includes('Additional links'));
  assert(
    (await read('dist/en/blog/configured-locales/index.md')).includes('Acceptance global policy')
  );
  assert.equal((await read('dist/en/llms-full.txt')).match(/Acceptance global policy/g).length, 1);
  assert((await read('dist/zh/llms.txt')).includes('验收引用说明。'));
  assert((await read('dist/zh/llms-full.txt')).includes('验收引用说明。'));
  results.push({
    check: 'AI context ships through global/localized indexes, bundles and single articles',
    status: 'passed',
  });
  assert(machineArticle.includes('https://acceptance.example/zh/blog/configured-locales/'));
  results.push({
    check: 'machine exports reuse configured identity/origin/languages even with search disabled',
    status: 'passed',
  });
  assert.equal(parse(home).querySelector('.frontier-contact'), null);
  assert(parse(home).querySelector('.frontier-dropdown a[href$="/decoder/"]'));
  assert.equal(home.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1], 'Acceptance home heading');
  assert.ok(home.includes('Acceptance shared signal'));
  const chineseHome = await read('dist/zh/index.html');
  assert.equal(chineseHome.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1], '验收中文首页');
  assert.ok(chineseHome.includes('验收中文信号'));
  assert.ok(home.includes('<title>Acceptance site</title>'));
  assert.match(home, /https:\/\/acceptance.example\/en\//);
  for (const missing of [
    'dist/en/about/index.html',
    'dist/ja/index.html',
    'dist/en/tags/index.html',
    'dist/pagefind/anglefeint.json',
  ])
    await assert.rejects(access(file(missing)), { code: 'ENOENT' });
  assert.match(await read('dist/en/blog/2/index.html'), /Acceptance site/);
  assert((await read('dist/sitemap-index.xml')).includes('https://acceptance.example/'));
  assert((await read('dist/en/rss.xml')).includes('https://acceptance.example/'));
  await server('preview', ['/en/', '/zh/'], (base) => browserCheck(base, true));
  passed = true;
} catch (error) {
  results.push({ status: 'failed', error: error.stack });
  throw error;
} finally {
  await writeFile(
    path.join(evidence, 'report.json'),
    JSON.stringify(
      { passed, pm, node: process.version, project, scripts: [...scripts], results },
      null,
      2
    )
  );
  console.log(`Evidence: ${evidence}`);
  if (passed) {
    assert.equal(path.dirname(temporary), parent);
    assert(path.basename(temporary).startsWith('anglefeint-template-'));
    await rm(temporary, { recursive: true, force: true });
  } else console.error(`Failed project retained: ${project}`);
}
