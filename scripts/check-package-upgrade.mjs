import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { STARTER_MANAGED_FILES, starterSourcePath } from './starter-manifest.mjs';
import { chromium } from '@playwright/test';
import {
  loadProjectModule,
  loadProjectLocales,
} from '../packages/theme/src/scaffold/project-config.mjs';

const exec = promisify(execFile);
const root = process.cwd();
const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run via npm run check:upgrade');
const temp = await mkdtemp(path.join(tmpdir(), 'anglefeint-upgrade-'));
assert.equal(path.dirname(temp), tmpdir());
assert(path.basename(temp).startsWith('anglefeint-upgrade-'));
const project = path.join(temp, 'personal blog');
const evidence = path.join(root, 'acceptance-results', `upgrade-${Date.now()}`);
await mkdir(evidence, { recursive: true });
let server;
let previewServer;
let passed = false;
let preservation = [];
const scenarios = [];
const results = [];
async function npm(args, cwd = project, extraEnv = {}) {
  const env = { ...process.env, NODE_PATH: '', NODE_OPTIONS: '', ...extraEnv };
  for (const key of Object.keys(env)) if (key.startsWith('PUBLIC_SITE_')) delete env[key];
  try {
    const result = await exec(process.execPath, [npmCli, ...args], {
      cwd,
      env,
      maxBuffer: 40 * 1024 * 1024,
      timeout: 600000,
    });
    await writeFile(path.join(evidence, `${results.length}.log`), result.stdout + result.stderr);
    results.push({ args, passed: true });
    return result.stdout;
  } catch (error) {
    await writeFile(
      path.join(evidence, `${results.length}.log`),
      (error.stdout ?? '') + (error.stderr ?? '')
    );
    results.push({ args, passed: false });
    throw error;
  }
}
async function hashes() {
  const names = [];
  for (const folder of ['src', 'public']) {
    for (const entry of await readdir(path.join(project, folder), {
      recursive: true,
      withFileTypes: true,
    })) {
      if (entry.isFile()) names.push(path.join(entry.parentPath, entry.name));
    }
  }
  names.push(
    ...['astro.config.mjs', 'tsconfig.json', '.env', 'wrangler.jsonc'].map((file) =>
      path.join(project, file)
    )
  );
  return Promise.all(
    names.sort().map(async (file) => [
      path.relative(project, file),
      createHash('sha256')
        .update(await readFile(file))
        .digest('hex'),
    ])
  );
}
try {
  await mkdir(project);
  for (const file of STARTER_MANAGED_FILES) {
    await mkdir(path.dirname(path.join(project, file)), { recursive: true });
    await cp(path.join(root, starterSourcePath(file)), path.join(project, file));
  }
  // Public platform files and fonts are user-owned assets retained by the starter.
  await cp(path.join(root, 'public/fonts'), path.join(project, 'public/fonts'), {
    recursive: true,
  });
  const baselineIndex = process.argv.indexOf('--baseline');
  const baselineVersion = baselineIndex >= 0 ? process.argv[baselineIndex + 1] : undefined;
  if (baselineIndex >= 0 && !/^\d+\.\d+\.\d+$/.test(baselineVersion ?? ''))
    throw new Error('--baseline requires an exact published x.y.z version.');
  const baseline = JSON.parse(
    await npm(
      [
        'pack',
        ...(baselineVersion
          ? [`@anglefeint/astro-theme@${baselineVersion}`]
          : ['--workspace', '@anglefeint/astro-theme']),
        '--json',
        '--pack-destination',
        temp,
      ],
      root
    )
  );
  // Keep old schema-1 entrypoints frozen so future template changes cannot hide regressions.
  await cp(path.join(root, 'tests/fixtures/integration-starter-v1'), project, {
    recursive: true,
  });
  const pkg = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'));
  pkg.dependencies['@anglefeint/astro-theme'] =
    `file:${path.join(temp, baseline[0].filename).replaceAll('\\', '/')}`;
  await writeFile(path.join(project, 'package.json'), JSON.stringify(pkg));
  await npm(['install', '--ignore-scripts', '--prefer-offline']);
  await writeFile(
    path.join(project, 'src/site.config.ts'),
    `import { defineThemeConfig } from '@anglefeint/astro-theme/config';
export const THEME_CONFIG = defineThemeConfig({
 site: {title: 'Personal identity', author: 'Personal author', url: 'https://personal.example'},
 theme: { blogPageSize: 2, music: {enabled: true, tracks: [{title:'My recording',src:'/music/owned.mp3'}]} },
 i18n: {locales: {zh: {meta: {enabled:false}}}}
});`
  );
  await mkdir(path.join(project, 'public/music'), { recursive: true });
  await writeFile(path.join(project, 'public/music/owned.mp3'), Buffer.from([0, 1, 2, 255]));
  await writeFile(path.join(project, 'public/owned.png'), Buffer.from([137, 80, 78, 71]));
  await writeFile(path.join(project, 'public/_headers'), '/custom\n  X-Personal: retained\n');
  await writeFile(path.join(project, '.env'), 'PERSONAL_SETTING=fixture-only\n');
  await writeFile(
    path.join(project, 'wrangler.jsonc'),
    '{"name":"personal-blog","assets":{"directory":"./dist"}}\n'
  );
  await mkdir(path.join(project, 'src/pages'), { recursive: true });
  await writeFile(path.join(project, 'src/pages/projects.astro'), '<h1>My custom project</h1>');
  await writeFile(
    path.join(project, 'src/content/blog/en/personal.md'),
    '---\ntitle: My story\ndescription: Personal text\npubDate: 2026-01-02\n---\nMy original article.\n'
  );
  await mkdir(path.join(project, 'src/content/fragments/en'), { recursive: true });
  await writeFile(
    path.join(project, 'src/content/fragments/en/personal.md'),
    '---\nid: User0001\npubDate: 2026-11-11T08:00:00Z\n---\nMy private draft fragment.\n'
  );
  const before = await hashes();
  await npm(['run', 'doctor']);
  await assert.rejects(readFile(path.join(project, 'dist/en/code-lab/index.html')), {
    code: 'ENOENT',
  });
  // An isolated future package adds a menu/button/page; no production feature is added.
  const future = path.join(temp, 'future-theme');
  await mkdir(future);
  await cp(path.join(root, 'packages/theme/src'), path.join(future, 'src'), { recursive: true });
  await cp(path.join(root, 'packages/theme/tsconfig.json'), path.join(future, 'tsconfig.json'));
  const futureManifest = JSON.parse(
    await readFile(path.join(root, 'packages/theme/package.json'), 'utf8')
  );
  const [major, minor] = futureManifest.version.split('.').map(Number);
  futureManifest.version = `${major}.${minor + 2}.0`;
  await writeFile(path.join(future, 'package.json'), JSON.stringify(futureManifest));
  const integration = path.join(future, 'src/integration.mjs');
  await writeFile(
    integration,
    (await readFile(integration, 'utf8')).replace(
      'export const STANDARD_ROUTES = [',
      "export const STANDARD_ROUTES = [\n  ['/[lang]/code-lab', '[lang]/code-lab.astro'],"
    )
  );
  for (const [template, destination] of [
    ['page.astro', 'routes/[lang]/code-lab.astro'],
    ['component.astro', 'components/CodeLab.astro'],
    ['code-lab.ts', 'utils/code-lab.ts'],
  ])
    await cp(
      path.join(root, `tests/fixtures/future-code-lab/${template}.template`),
      path.join(future, 'src', destination)
    );
  for (const [relative, from, to] of [
    [
      'project/schema.ts',
      'enableDecoderPage: boolean;',
      'enableDecoderPage: boolean;\n    enableCodeLab: boolean;',
    ],
    [
      'project/defaults.ts',
      'enableDecoderPage: true,',
      'enableDecoderPage: true,\n    enableCodeLab: true,',
    ],
    ['project/defaults.ts', 'blogPageSize: 10,', 'blogPageSize: 11,'],
  ]) {
    const filename = path.join(future, 'src', relative);
    const original = await readFile(filename, 'utf8');
    assert(original.includes(from), `Future fixture patch missing: ${from}`);
    await writeFile(filename, original.replace(from, to));
  }
  const header = path.join(future, 'src/components/shared/CommonHeader.astro');
  await writeFile(
    header,
    (await readFile(header, 'utf8'))
      .replace(
        'const frontierItems = [',
        "const frontierItems = [\n  ...(THEME_CONFIG.theme.enableCodeLab ? [{ label: 'Code Lab', href: alternatePathForLocale(locale, '/code-lab/') }] : []),"
      )
      .replace(
        "import FrontierMenu from './FrontierMenu.astro';",
        "import FrontierMenu from './FrontierMenu.astro';\nimport { THEME_CONFIG } from '@anglefeint/user-config';"
      )
  );
  const nextPack = JSON.parse(await npm(['pack', '--json', '--pack-destination', temp], future));
  const archive = await readFile(path.join(temp, nextPack[0].filename));
  const integrity = 'sha512-' + createHash('sha512').update(archive).digest('base64');
  server = createServer(async (req, res) => {
    try {
      if (req.url === '/theme.tgz') {
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        res.end(archive);
        return;
      }
      if (decodeURIComponent(req.url.split('?')[0]).startsWith('/@anglefeint/astro-theme')) {
        const address = server.address();
        const version = {
          ...futureManifest,
          dist: { tarball: `http://127.0.0.1:${address.port}/theme.tgz`, integrity },
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            name: futureManifest.name,
            'dist-tags': { latest: version.version },
            versions: { [version.version]: version },
          })
        );
        return;
      }
      // Dependency requests retain npm's normal upstream; only our unpublished fixture is local.
      const upstream = await fetch(`https://registry.npmjs.org${req.url}`, {
        method: req.method,
        ...(req.method === 'POST'
          ? {
              body: await new Promise((resolve) => {
                const chunks = [];
                req.on('data', (c) => chunks.push(c));
                req.on('end', () => resolve(Buffer.concat(chunks)));
              }),
              headers: req.headers,
            }
          : {}),
      });
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch (error) {
      res.writeHead(500);
      res.end(String(error));
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const registry = `http://127.0.0.1:${server.address().port}`;
  console.log(
    `Testing real npm exec/npx upgrade: ${baseline[0].version} -> fixture ${futureManifest.version} (skip one minor), preserve user files, run doctor...`
  );
  await npm(['exec', '--yes', '--', '@anglefeint/astro-theme@latest', 'upgrade'], project, {
    npm_config_registry: registry,
    npm_config_prefer_online: 'true',
  });
  assert.equal(
    JSON.parse(
      await readFile(
        path.join(project, 'node_modules/@anglefeint/astro-theme/package.json'),
        'utf8'
      )
    ).version,
    futureManifest.version
  );
  assert.deepEqual(
    await hashes(),
    before,
    'Upgrade must preserve config, articles, fragments, music, images, headers and custom pages byte-for-byte'
  );
  assert.match(await npm(['exec', '--', 'astro-theme', 'new-fragment', '--help']), /new-fragment/);
  assert.equal(
    JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8')).scripts['new-fragment'],
    undefined
  );
  await assert.rejects(readFile(path.join(project, 'dist/en/fragments/index.html')), {
    code: 'ENOENT',
  });
  const newFragmentOutput = await npm(['exec', '--', 'astro-theme', 'new-fragment']);
  assert.match(newFragmentOutput, /Created/);
  assert.equal((await readdir(path.join(project, 'src/content/fragments/en'))).length, 2);
  const [generatedFragment] = (
    await readdir(path.join(project, 'src/content/fragments/en'))
  ).filter((name) => name !== 'personal.md');
  const generatedContent = await readFile(
    path.join(project, 'src/content/fragments/en', generatedFragment),
    'utf8'
  );
  assert.match(generatedContent, /^id: '[A-Za-z0-9]{8}'$/m);
  for (const locale of await loadProjectLocales(project)) {
    assert.equal(
      await readFile(
        path.join(project, 'src/content/fragments', locale, generatedFragment),
        'utf8'
      ),
      generatedContent
    );
  }
  await assert.rejects(readdir(path.join(project, 'src/content/fragments/zh')), { code: 'ENOENT' });
  preservation = before;
  scenarios.push(
    'skip-version upgrade preserves source, public assets, .env, host config, Astro and TypeScript entries'
  );
  const userModule = await loadProjectModule(path.join(project, 'src/site.config.ts'));
  const defaultModule = await loadProjectModule(
    path.join(project, 'node_modules/@anglefeint/astro-theme/src/project/defaults.ts')
  );
  assert.equal(defaultModule.defineThemeConfig({}).theme.blogPageSize, 11);
  assert.equal(userModule.THEME_CONFIG.theme.blogPageSize, 2);
  assert.equal(userModule.THEME_CONFIG.theme.enableCodeLab, true);
  assert.deepEqual(userModule.THEME_CONFIG.theme.music.tracks, [
    { title: 'My recording', src: '/music/owned.mp3' },
  ]);
  scenarios.push(
    'new optional defaults arrive; explicit pagination and complete playlist overrides survive'
  );
  assert.match(
    await readFile(path.join(project, 'dist/en/code-lab/index.html'), 'utf8'),
    /Format JSON/
  );
  assert.match(
    await readFile(path.join(project, 'dist/en/index.html'), 'utf8'),
    /class="frontier-dropdown"[\s\S]*?href="\/en\/code-lab\/"[\s\S]*?Code Lab/
  );
  assert.match(
    await readFile(path.join(project, 'dist/en/index.html'), 'utf8'),
    /Personal identity|My recording/
  );
  assert.match(
    await readFile(path.join(project, 'dist/en/blog/personal/index.html'), 'utf8'),
    /My original article/
  );
  assert.match(
    await readFile(path.join(project, 'dist/projects/index.html'), 'utf8'),
    /My custom project/
  );
  assert.match(await readFile(path.join(project, 'dist/_headers'), 'utf8'), /X-Personal: retained/);
  assert.match(
    await readFile(path.join(project, 'dist/_headers'), 'utf8'),
    /X-Robots-Tag: noindex/
  );
  for (const locale of ['en', 'ja', 'de', 'es', 'ko', 'pt-br', 'ru', 'zh-hant'])
    assert.match(
      await readFile(path.join(project, `dist/${locale}/code-lab/index.html`), 'utf8'),
      /Format JSON/
    );
  await assert.rejects(readFile(path.join(project, 'dist/zh/code-lab/index.html')), {
    code: 'ENOENT',
  });
  // Functional browser acceptance of a newly bundled component and client module.
  previewServer = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const filename = path.resolve(
        project,
        'dist',
        '.' + pathname,
        ...(pathname.endsWith('/') ? ['index.html'] : [])
      );
      assert(filename.startsWith(path.join(project, 'dist') + path.sep));
      const mime = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.png': 'image/png',
      };
      const body = await readFile(filename);
      res.writeHead(200, {
        'Content-Type': mime[path.extname(filename)] ?? 'application/octet-stream',
      });
      res.end(body);
    } catch {
      if (!res.headersSent) res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => previewServer.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const origin = `http://127.0.0.1:${previewServer.address().port}`;
    await page.goto(`${origin}/en/blog/`);
    await page.locator('.frontier-dropdown summary').click();
    await page.getByRole('link', { name: 'Code Lab', exact: true }).click();
    await page.waitForURL('**/en/code-lab/');
    await page.locator('[data-code-input]').fill('{"hello":[1,2]}');
    await page.getByRole('button', { name: 'Format JSON' }).click();
    await page.waitForFunction(() =>
      document.querySelector('[data-code-output]')?.textContent?.includes('\n')
    );
    assert.equal(
      await page.locator('[data-code-output]').textContent(),
      JSON.stringify({ hello: [1, 2] }, null, 2)
    );
    await page.locator('[data-code-input]').fill('<img src=x onerror=alert(1)>');
    await page.getByRole('button', { name: 'Format JSON' }).click();
    assert.equal(await page.locator('[data-code-output]').textContent(), 'Invalid JSON');
    await page.goto(`${origin}/ja/code-lab/`);
    assert.equal(await page.locator('h1').textContent(), 'Code Lab');
    assert.deepEqual(errors, [], 'Existing shell and new code must not throw browser errors');
    scenarios.push(
      'browser menu navigation, valid JSON, invalid inert input, Japanese page, zero page errors'
    );
  } finally {
    await browser.close();
  }
  // Optional new settings receive package defaults; authors can explicitly opt out.
  const siteConfig = path.join(project, 'src/site.config.ts');
  await writeFile(
    siteConfig,
    (await readFile(siteConfig, 'utf8')).replace(
      'blogPageSize: 2,',
      'enableCodeLab: false, fragments: { enabled: true }, blogPageSize: 2,'
    )
  );
  const optedOut = await hashes();
  await npm(['run', 'doctor']);
  await assert.rejects(readFile(path.join(project, 'dist/en/code-lab/index.html')), {
    code: 'ENOENT',
  });
  assert.doesNotMatch(
    await readFile(path.join(project, 'dist/en/index.html'), 'utf8'),
    /href="\/en\/code-lab\/"/
  );
  assert.match(
    await readFile(path.join(project, 'dist/en/fragments/index.html'), 'utf8'),
    /My private draft fragment/
  );
  const fragmentsHtml = await readFile(path.join(project, 'dist/en/fragments/index.html'), 'utf8');
  const fragmentIndexHref = fragmentsHtml.match(/data-fragment-index="([^"]+)"/)?.[1];
  assert.match(fragmentIndexHref ?? '', /^\/en\/fragments\/index\/[a-f0-9]{16}\.json$/);
  const fragmentIndex = JSON.parse(
    await readFile(path.join(project, `dist${fragmentIndexHref}`), 'utf8')
  );
  const fragmentId = fragmentsHtml.match(/data-fragment-id="([^"]+)"/)?.[1];
  assert.equal(fragmentIndex.version, 1);
  assert.equal(fragmentIndex.pages[fragmentId], 1);
  assert.ok(fragmentsHtml.includes(`href="/en/fragments/#fragment-${fragmentId}"`));
  assert.deepEqual(await hashes(), optedOut);
  scenarios.push(
    'old scripts need no changes: new-fragment works after upgrade; optional feed preserves and renders personal fragments'
  );
  scenarios.push('new optional feature can be disabled without breaking old user settings');
  // A user-owned route is never silently overwritten by a newly reserved package route.
  const customLab = path.join(project, 'src/pages/[lang]/code-lab.astro');
  await mkdir(path.dirname(customLab), { recursive: true });
  const customContent = '<h1>My own Code Lab: retain me</h1>';
  await writeFile(customLab, customContent);
  await assert.rejects(npm(['run', 'doctor']), /Reserved standard route exists/);
  results.at(-1).expectedFailure = true;
  assert.equal(await readFile(customLab, 'utf8'), customContent);
  scenarios.push('conflicting custom route stops clearly and preserves the original file');
  passed = true;
  console.log(
    'Real one-command upgrade passed: localized Code Lab menu/page/component/client interaction delivered; all user files unchanged.'
  );
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (previewServer) await new Promise((resolve) => previewServer.close(resolve));
  await writeFile(
    path.join(evidence, 'report.json'),
    JSON.stringify({ passed, results, scenarios, preservation, temporary: temp }, null, 2)
  );
  console.log(`Upgrade evidence: ${evidence}`);
  if (passed) await rm(temp, { recursive: true, force: true });
  else console.log(`Failed fixture retained: ${temp}`);
}
