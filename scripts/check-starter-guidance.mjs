// Maintainer acceptance: inspect the files a consumer actually receives.
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from './parse-frontmatter.mjs';
import { checkReadmeLinks } from './check-readme-links.mjs';

export async function checkStarterGuidance(root) {
  const read = (file) => readFile(path.join(root, file), 'utf8');
  const pkg = JSON.parse(await read('package.json'));
  const files = ['AGENTS.md', 'CLAUDE.md', '.cursor/rules/00-repo.mdc'];
  const guide = await read('AGENTS.md');
  assert.match(await read('CLAUDE.md'), /^@AGENTS\.md$/m, 'Claude must import the shared guide');
  const cursor = matter(await read('.cursor/rules/00-repo.mdc'));
  assert.equal(cursor.data.alwaysApply, true, 'Cursor entry must always apply');
  assert.match(cursor.content, /AGENTS\.md/);
  for (const [, command] of guide.matchAll(/`npm run ([\w:-]+)/g)) {
    assert.ok(pkg.scripts[command], `AGENTS.md names an unavailable command: ${command}`);
  }
  assert.doesNotMatch(guide, /docs\/(?:AI_WORKFLOW|MAINTAINER_WORKFLOW)|npm run release:/);
  await checkReadmeLinks(root, files);
  const readmes = [
    'README',
    'README.zh-CN',
    'README.ja',
    'README.ko',
    'README.es',
    'README.pt-BR',
    'README.de',
    'README.ru',
    'README.zh-Hant',
  ];
  const ids = new Set();
  for (const file of [...files, ...readmes.map((name) => `${name}.meta.yaml`)]) {
    const text = await read(file);
    const { data } = matter(file.endsWith('.yaml') ? `---\n${text}\n---` : text);
    assert.ok(data.doc_id, `${file}: missing document identity`);
    assert.ok(!ids.has(data.doc_id), `${file}: duplicate document identity`);
    ids.add(data.doc_id);
    for (const target of [...(data.depends_on ?? []), ...(data.sync_targets ?? [])]) {
      await access(path.join(root, target));
    }
  }
  for (const name of readmes) assert.ok((await read(`${name}.md`)).includes('AGENTS.md'));
}
