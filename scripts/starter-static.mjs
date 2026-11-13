// Validate the virtual distribution before any npm installation or checkout mutation.
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import {
  STARTER_MANAGED_FILES,
  STARTER_OBSOLETE_FILES,
  STARTER_CONTENT_ROOT,
  STARTER_CONTENT_MANAGED_FILES,
  starterSourcePath,
} from './starter-manifest.mjs';
import { readGitSnapshot } from './git-snapshot.mjs';
import { buildStarterPackage } from './starter-package.mjs';
import { checkReadmeLinks } from './check-readme-links.mjs';
import { checkStarterGuidance } from './check-starter-guidance.mjs';

export async function checkStarterStatic({ root = process.cwd(), snapshot, targetSnapshot } = {}) {
  root = path.resolve(root);
  const source = async (file) => {
    const bytes = snapshot ? snapshot.read(file) : await readFile(path.join(root, file));
    assert(bytes !== null, `Missing starter source: ${file}`);
    return bytes;
  };
  const [main, theme] = await Promise.all(
    ['package.json', 'packages/theme/package.json'].map(source)
  );
  const pkg = buildStarterPackage(JSON.parse(main), {}, `^${JSON.parse(theme).version}`);
  const files = new Map(
    await Promise.all(
      STARTER_MANAGED_FILES.map(async (file) => [
        file,
        file === 'package.json'
          ? Buffer.from(JSON.stringify(pkg))
          : await source(starterSourcePath(file)),
      ])
    )
  );
  files.set('package.json', Buffer.from(JSON.stringify(pkg)));
  targetSnapshot ??= await readGitSnapshot(root, 'starter');
  const content = new Set(STARTER_CONTENT_MANAGED_FILES);
  const obsolete = new Set(STARTER_OBSOLETE_FILES);
  const delivered = new Set(
    [...targetSnapshot.files.keys()].filter(
      (file) =>
        !obsolete.has(file) &&
        !(file.startsWith(STARTER_CONTENT_ROOT + '/') && file.endsWith('.md') && !content.has(file))
    )
  );
  for (const file of files.keys()) delivered.add(file);
  const relative = (file) => path.relative(root, file).split(path.sep).join('/');
  const read = async (file, encoding) => {
    const bytes = files.get(relative(file));
    assert(bytes, `Missing distributed file: ${relative(file)}`);
    return encoding ? bytes.toString(encoding) : bytes;
  };
  const exists = async (file) => {
    const target = relative(file);
    assert(
      delivered.has(target) || [...delivered].some((p) => p.startsWith(target + '/')),
      `Not distributed: ${target}`
    );
  };
  await checkReadmeLinks(
    root,
    STARTER_MANAGED_FILES.filter((p) => /^README.*\.md$/.test(p)),
    { read, exists }
  );
  await checkStarterGuidance(root, { read, exists });
  return {
    files: files.size,
    readmes: STARTER_MANAGED_FILES.filter((p) => /^README.*\.md$/.test(p)).length,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  checkStarterStatic()
    .then((result) => console.log('[starter-static]', result))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
