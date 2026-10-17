import { createTerminalReader } from '../packages/theme/src/scripts/terminal/reader.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createFilesystem,
  normalizePath,
} from '../packages/theme/src/scripts/terminal/filesystem.js';
import { parseCommand } from '../packages/theme/src/scripts/terminal/commands.js';
import { createTerminalSession } from '../packages/theme/src/scripts/terminal/session.js';
import { createTerminalLoader } from '../packages/theme/src/scripts/terminal/loader.js';

const labels = Object.fromEntries(
  [
    'syntax',
    'usage',
    'unknown',
    'notFound',
    'notDirectory',
    'isDirectory',
    'failed',
    'tooLarge',
    'empty',
    'help',
  ].map((key) => [key, `${key}: {value}`])
);
const entries = [
  { path: '/root/bash/scripts/about.md', type: 'file', content: 'about' },
  {
    path: '/root/bash/scripts/posts/a b.md',
    type: 'file',
    content: '<script>literal text</script>',
  },
  { path: '/root/bash/scripts/empty', type: 'directory' },
];

test('virtual paths normalize dots and ancestors without accessing a system filesystem', () => {
  assert.equal(normalizePath('../../../../etc', '/root/bash'), '/etc');
  assert.equal(normalizePath('./posts/../about.md', '/root/bash/scripts'), entries[0].path);
  assert.throws(() => normalizePath('bad\0name'));
  const fs = createFilesystem(JSON.parse(JSON.stringify(entries)));
  assert.equal(fs.get('posts', '/root/bash/scripts').type, 'directory');
  assert.equal(fs.get('/etc/passwd'), undefined);
  assert.deepEqual(
    fs.list('/root/bash/scripts').map((node) => node.type),
    ['directory', 'directory', 'file']
  );
  assert.throws(() =>
    createFilesystem([
      { path: '/a', type: 'file' },
      { path: '/a/b', type: 'file' },
    ])
  );
});

test('command parsing accepts quoted Unicode paths and rejects incomplete quoting', () => {
  assert.deepEqual(parseCommand('cat "中文 标题.md"'), ['cat', '中文 标题.md']);
  assert.deepEqual(parseCommand('vi a\\ b.md'), ['vi', 'a b.md']);
  assert.deepEqual(parseCommand('cd..'), ['cd', '..']);
  assert.throws(() => parseCommand('cat "unfinished'));
});

test('session executes read-only commands, keeps cwd, completes paths and delegates article reading', async () => {
  const fs = createFilesystem(entries);
  const session = createTerminalSession({
    filesystem: fs,
    cwd: '/root/bash/scripts',
    labels,
    readFile: async (node) => node.content,
  });
  assert.match((await session.execute('pwd')).lines[0], /\/root\/bash\/scripts/u);
  assert.ok((await session.execute('ls -la')).lines.some((line) => line.endsWith('posts/')));
  assert.equal(session.complete('vi ab'), 'vi about.md');
  await session.execute('cd posts');
  assert.equal(session.complete('cat a'), 'cat "a b.md"');
  assert.deepEqual((await session.execute('cat "a b.md"')).lines, [
    '<script>literal text</script>',
  ]);
  const read = await session.execute('vi "a b.md"');
  assert.equal(read.reader.content, '<script>literal text</script>');
  assert.match(session.prompt, /\/posts \$ /u);
  await session.execute('cd ..');
  assert.match((await session.execute('cat posts')).lines[0], /^isDirectory/u);
  assert.match((await session.execute('cd about.md')).lines[0], /^notDirectory/u);
  assert.match((await session.execute('cat missing.md')).lines[0], /^notFound/u);
  assert.match((await session.execute('cp about.md elsewhere')).lines[0], /^unknown/u);
  assert.match((await session.execute('cat about.md | sh')).lines[0], /^usage/u);
  assert.equal((await session.execute('clear')).clear, true);
  assert.ok((await session.execute('help')).lines[1].includes('cat'));
});

test('document loader restricts origin, caps content, caches four files and releases its cache', async () => {
  const oldFetch = globalThis.fetch;
  const oldLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: { href: 'https://example.test/en/about/', origin: 'https://example.test' },
  });
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    return new globalThis.Response(JSON.stringify({ content: 'text' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  };
  try {
    const loader = createTerminalLoader();
    const file = (n) => ({ path: `/file${n}`, url: `/en/terminal/${n}.json` });
    assert.equal(await loader.read(file(0)), 'text');
    await loader.read(file(0));
    assert.equal(requests, 1);
    for (let i = 1; i <= 4; i++) await loader.read(file(i));
    await loader.read(file(0));
    assert.equal(requests, 6);
    await assert.rejects(loader.read({ path: '/evil', url: 'https://elsewhere.test/doc.json' }));
    await assert.rejects(createTerminalLoader({ maxLength: 2 }).read(file(8)), /tooLarge/u);
    loader.dispose();
    await assert.rejects(loader.read(file(0)), /disposed/u);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldLocation) Object.defineProperty(globalThis, 'location', oldLocation);
    else delete globalThis.location;
  }
});

test('Canvas reading state scrolls and exits without DOM or window dependencies', () => {
  const reader = createTerminalReader(
    { path: '/a.md', content: 'first\nsecond' },
    { readerHint: 'read only' }
  );
  assert.deepEqual(reader.lines, ['first', 'second']);
  reader.move(100, 20);
  assert.equal(reader.top, 20);
  reader.move(-100, 20);
  assert.equal(reader.top, 0);
  assert.equal(reader.execute(':w').exit, false);
  assert.equal(reader.status, 'read only');
  assert.equal(reader.execute(':q').exit, true);
});
