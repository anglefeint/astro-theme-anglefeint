import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import sharp from 'sharp';

const exec = promisify(execFile);
const cli = fileURLToPath(new URL('../packages/theme/src/cli.mjs', import.meta.url));

test('real starter doctor executes Astro check and build exactly once; a failed build blocks it', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-doctor-'));
  try {
    await mkdir(path.join(root, 'src'));
    await writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({
        anglefeint: { projectSchema: 1 },
        dependencies: { '@anglefeint/astro-theme': '^0.32.0' },
      })
    );
    await writeFile(
      path.join(root, 'astro.config.mjs'),
      '// @anglefeint/astro-theme/integration\n'
    );
    await writeFile(
      path.join(root, 'src/site.config.ts'),
      'export const THEME_CONFIG = { theme: { enableAboutPage: false } };'
    );
    const npmCli = path.join(root, 'npm-cli.js');
    await writeFile(
      npmCli,
      `const fs = require('node:fs');
const args = process.argv.slice(2).join(' ');
fs.appendFileSync('calls', args + '\\n');
if (args === 'run build' && process.env.DOCTOR_BUILD_FAIL) process.exit(7);
`
    );
    const env = { ...process.env, npm_execpath: npmCli, DOCTOR_BUILD_FAIL: '' };
    await exec(process.execPath, [cli, 'doctor'], { cwd: root, env });
    assert.equal(
      await readFile(path.join(root, 'calls'), 'utf8'),
      'exec -- astro check\nrun build\n'
    );
    await assert.rejects(
      exec(process.execPath, [cli, 'doctor'], {
        cwd: root,
        env: { ...env, DOCTOR_BUILD_FAIL: '1' },
      })
    );
  } finally {
    assert.equal(path.dirname(root), tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});

test('local doctor prepares persistent covers for older starters; CI doctor never repairs missing variants', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-doctor-covers-'));
  try {
    await mkdir(path.join(root, 'src/assets/blog/default-covers'), { recursive: true });
    await writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({
        anglefeint: { projectSchema: 1 },
        dependencies: { '@anglefeint/astro-theme': '^0.35.0' },
      })
    );
    await writeFile(
      path.join(root, 'astro.config.mjs'),
      '// @anglefeint/astro-theme/integration\n'
    );
    await writeFile(
      path.join(root, 'src/site.config.ts'),
      'export const THEME_CONFIG = { theme: { enableAboutPage: false } };'
    );
    await sharp({ create: { width: 400, height: 200, channels: 3, background: 'green' } })
      .png()
      .toFile(path.join(root, 'src/assets/blog/default-covers/cover.png'));
    const npmCli = path.join(root, 'npm-cli.js');
    await writeFile(
      npmCli,
      "require('node:fs').appendFileSync('calls', process.argv.slice(2).join(' ')+'\\n');"
    );
    await exec(process.execPath, [cli, 'doctor'], {
      cwd: root,
      env: { ...process.env, CI: '', npm_execpath: npmCli },
    });
    const manifestPath = path.join(root, 'src/assets/blog/covers/manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const variant = Object.values(manifest.sources)[0].variants[0].file;
    const image = path.join(root, 'src/assets/blog/covers/generated', variant);
    await rm(image);
    await writeFile(path.join(root, 'calls'), '');
    await assert.rejects(
      exec(process.execPath, [cli, 'doctor'], {
        cwd: root,
        env: { ...process.env, CI: 'true', npm_execpath: npmCli },
      }),
      /Missing, stale or modified/
    );
    await assert.rejects(readFile(image), { code: 'ENOENT' });
    assert.equal(await readFile(path.join(root, 'calls'), 'utf8'), '');
  } finally {
    assert.equal(path.dirname(root), tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});
