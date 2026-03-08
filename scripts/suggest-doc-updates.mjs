import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';

const ROOT = process.cwd();
const EXCLUDE_PREFIXES = [
  'src/content/blog/',
  'public/images/',
  '.cursor/workflows/',
  '.cursor/skills/',
  '.git/',
  'node_modules/',
  'dist/',
];
const SIDECAR_ELIGIBLE_DOCS = new Set([
  'README.md',
  'README.zh-CN.md',
  'README.ja.md',
  'README.es.md',
  'README.ko.md',
  'packages/theme/README.md',
]);

function normalizePath(value) {
  return value.replaceAll('\\', '/');
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const rel = normalizePath(relative(ROOT, abs));
    if (EXCLUDE_PREFIXES.some((prefix) => rel.startsWith(prefix))) continue;
    const st = statSync(abs);
    if (st.isDirectory()) {
      walk(abs, out);
      continue;
    }
    if (!rel.endsWith('.md') && !rel.endsWith('.mdc')) continue;
    out.push(rel);
  }
  return out;
}

function parseDocFrontmatter(file, text) {
  try {
    const parsed = matter(text);
    if (!parsed.matter || Object.keys(parsed.data).length === 0) {
      return { ok: false, reason: 'missing-frontmatter' };
    }
    return { ok: true, data: parsed.data };
  } catch (error) {
    return {
      ok: false,
      reason: 'parse-error',
      error: error instanceof Error ? error.message : String(error),
      file,
    };
  }
}

function getSidecarPath(file) {
  if (!SIDECAR_ELIGIBLE_DOCS.has(file)) return null;
  return file.replace(/\.md$/u, '.meta.yaml');
}

function parseSidecarMetadata(file) {
  const sidecarPath = getSidecarPath(file);
  if (!sidecarPath || !existsSync(join(ROOT, sidecarPath))) {
    return { ok: false, reason: 'missing-sidecar' };
  }

  try {
    const sidecarText = readFileSync(join(ROOT, sidecarPath), 'utf8');
    const parsed = matter(`---\n${sidecarText}\n---`);
    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      return { ok: false, reason: 'empty-sidecar', file: sidecarPath };
    }
    return { ok: true, data: parsed.data, source: sidecarPath };
  } catch (error) {
    return {
      ok: false,
      reason: 'sidecar-parse-error',
      error: error instanceof Error ? error.message : String(error),
      file: sidecarPath,
    };
  }
}

function resolveDocMetadata(file) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const parsedFrontmatter = parseDocFrontmatter(file, text);
  if (parsedFrontmatter.ok) {
    return { ok: true, data: parsedFrontmatter.data, source: 'frontmatter' };
  }

  if (parsedFrontmatter.reason !== 'missing-frontmatter') {
    return parsedFrontmatter;
  }

  const parsedSidecar = parseSidecarMetadata(file);
  if (parsedSidecar.ok) return parsedSidecar;
  if (parsedSidecar.reason === 'sidecar-parse-error' || parsedSidecar.reason === 'empty-sidecar') {
    return parsedSidecar;
  }
  return { ok: false, reason: 'missing-metadata' };
}

function parseArgs(argv) {
  const files = [];
  let json = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--files') {
      const next = argv[i + 1] ?? '';
      files.push(
        ...next
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      );
      i += 1;
      continue;
    }
    files.push(arg);
  }

  return { files: files.map(normalizePath), json };
}

function getChangedFilesFromGit() {
  const result = spawnSync('git', ['status', '--short'], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || 'Failed to read git status.');
  }

  return result.stdout
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const rawPath = line.slice(3).trim();
      const nextPath = rawPath.includes(' -> ') ? rawPath.split(' -> ').at(-1) : rawPath;
      return normalizePath(nextPath ?? rawPath);
    });
}

function classifyChangedFile(file) {
  const scopes = new Set();
  const triggers = new Set();
  const reasons = [];

  const mark = (nextScopes = [], nextTriggers = [], reason) => {
    for (const value of nextScopes) scopes.add(value);
    for (const value of nextTriggers) triggers.add(value);
    if (reason) reasons.push(reason);
  };

  if (
    file === 'AGENTS.md' ||
    file === 'CLAUDE.md' ||
    file.startsWith('.cursor/rules/') ||
    file === 'docs/AI_WORKFLOW.md' ||
    file === 'docs/DOC_METADATA_SPEC.md' ||
    file === 'docs/DOC_SYNC_WORKFLOW.md'
  ) {
    mark(
      ['doc-sync', 'workflow', 'validation'],
      ['workflow-change', 'doc-process-change', 'docs-workflow-change', 'validation-change'],
      'doc workflow metadata or routing'
    );
  }

  if (file.startsWith('docs/') || file === 'CONTRIBUTING.md' || file === 'UPGRADING.md') {
    mark([], ['doc-process-change'], 'maintained documentation changed');
  }

  if (
    file === 'README.md' ||
    /^README\..+\.md$/u.test(file) ||
    /^README\..+\.meta\.yaml$/u.test(file) ||
    file === 'README.meta.yaml' ||
    file === 'packages/theme/README.md' ||
    file === 'packages/theme/README.meta.yaml'
  ) {
    mark(
      ['setup', 'commands', 'themes', 'config', 'routing', 'package-usage', 'package-upgrade'],
      ['command-change', 'config-change', 'routing-change', 'package-change'],
      'public README surface changed'
    );
  }

  if (file === 'package.json') {
    mark(
      ['commands', 'workflow'],
      ['command-change', 'workflow-change'],
      'root command or workflow scripts changed'
    );
  }

  if (file.endsWith('/package.json')) {
    mark(
      ['package', 'package-usage'],
      ['package-change', 'command-change'],
      'package manifest changed'
    );
  }

  if (file === 'scripts/suggest-doc-updates.mjs' || file === 'scripts/validate-doc-metadata.mjs') {
    mark(
      ['doc-sync', 'validation', 'workflow'],
      ['doc-process-change', 'docs-workflow-change', 'validation-change', 'workflow-change'],
      'documentation workflow helper changed'
    );
  }

  if (
    (file.startsWith('scripts/') &&
      file !== 'scripts/suggest-doc-updates.mjs' &&
      file !== 'scripts/validate-doc-metadata.mjs') ||
    file.startsWith('tools/maintainer/')
  ) {
    mark(
      ['workflow', 'validation'],
      ['script-change', 'workflow-change'],
      'maintenance or validation script changed'
    );
  }

  if (file === 'scripts/starter-manifest.mjs') {
    mark(
      ['starter-sync', 'starter', 'workflow'],
      ['script-change', 'workflow-change', 'command-change'],
      'starter sync contract changed'
    );
  }

  if (file.startsWith('scripts/adapter-templates/') || file === 'scripts/sync-adapters.mjs') {
    mark(
      ['adapter-sync', 'config', 'workflow'],
      ['adapter-change', 'script-change', 'workflow-change'],
      'adapter sync contract changed'
    );
  }

  if (file.startsWith('src/site.config') || file.startsWith('src/config/')) {
    mark(['config'], ['config-change'], 'site config surface changed');
  }

  if (file.startsWith('src/i18n/') || file.startsWith('packages/theme/src/i18n/')) {
    mark(['routing', 'config'], ['i18n-change', 'routing-change'], 'i18n runtime changed');
  }

  if (
    file.startsWith('src/pages/') ||
    file === 'astro.config.mjs' ||
    file === 'packages/theme/src/components/BaseHead.astro'
  ) {
    mark(
      ['architecture', 'routing', 'seo'],
      ['architecture-change', 'routing-change', 'seo-change'],
      'routing or seo surface changed'
    );
  }

  if (
    file.startsWith('packages/theme/src/layouts/') ||
    file.startsWith('packages/theme/src/components/')
  ) {
    mark(['architecture'], ['architecture-change'], 'layout or shared component changed');
  }

  if (
    file.startsWith('packages/theme/src/styles/') ||
    file.startsWith('src/scripts/') ||
    file.startsWith('packages/theme/src/scripts/')
  ) {
    mark(
      ['visual-system', 'architecture'],
      ['visual-change', 'script-change', 'architecture-change'],
      'visual system or page runtime changed'
    );
  }

  if (file.startsWith('packages/theme/src/') || file === 'packages/theme/package.json') {
    mark(['package'], ['package-change'], 'theme package source changed');
  }

  if (file === 'CHANGELOG.md' || file.startsWith('docs/releases/')) {
    mark(
      ['release', 'package-upgrade', 'docs'],
      ['release-change', 'package-release'],
      'release notes changed'
    );
  }

  return { scopes, triggers, reasons };
}

function intersects(a = [], b = []) {
  return a.some((value) => b.includes(value));
}

function buildGraph(docs) {
  const graph = new Map();
  for (const doc of docs) {
    const targets = new Set(graph.get(doc.file) ?? []);
    for (const value of doc.metadata.sync_targets ?? []) targets.add(value);
    graph.set(doc.file, targets);
  }

  for (const doc of docs) {
    for (const dependency of doc.metadata.depends_on ?? []) {
      const next = new Set(graph.get(dependency) ?? []);
      next.add(doc.file);
      graph.set(dependency, next);
    }
  }

  return graph;
}

function collectDocs() {
  const files = walk(ROOT).sort();
  const docs = [];
  const metadataErrors = [];

  for (const file of files) {
    const parsed = resolveDocMetadata(file);
    if (!parsed.ok) {
      metadataErrors.push({
        file,
        reason: parsed.reason,
        error: parsed.error ?? null,
      });
      continue;
    }
    docs.push({ file, metadata: parsed.data });
  }

  return { docs, metadataErrors };
}

function main() {
  const { files: argvFiles, json } = parseArgs(process.argv.slice(2));
  const changedFiles = argvFiles.length > 0 ? argvFiles : getChangedFilesFromGit();

  if (changedFiles.length === 0) {
    const message = {
      changedFiles: [],
      inferredScopes: [],
      inferredTriggers: [],
      directHits: [],
      propagatedHits: [],
      skipped: [],
      metadataErrors: [],
      note: 'No changed files detected.',
    };
    if (json) {
      console.log(JSON.stringify(message, null, 2));
    } else {
      console.log('No changed files detected.');
    }
    return;
  }

  const { docs, metadataErrors } = collectDocs();
  const graph = buildGraph(docs);
  const changedDocSet = new Set(
    changedFiles.filter((file) => docs.some((doc) => doc.file === file))
  );

  const inferredScopes = new Set();
  const inferredTriggers = new Set();
  const reasonsByFile = new Map();

  for (const file of changedFiles) {
    const classified = classifyChangedFile(file);
    for (const scope of classified.scopes) inferredScopes.add(scope);
    for (const trigger of classified.triggers) inferredTriggers.add(trigger);
    if (classified.reasons.length > 0) {
      reasonsByFile.set(file, classified.reasons);
    }
  }

  const directHits = [];
  const skipped = [];
  const directSet = new Set();

  for (const doc of docs) {
    const hitByPath = changedDocSet.has(doc.file);
    const hitByScope = intersects(doc.metadata.doc_scope ?? [], [...inferredScopes]);
    const hitByTrigger = intersects(doc.metadata.update_triggers ?? [], [...inferredTriggers]);

    if (hitByPath || hitByScope || hitByTrigger) {
      directSet.add(doc.file);
      directHits.push({
        file: doc.file,
        reason: hitByPath
          ? 'changed doc file'
          : hitByScope && hitByTrigger
            ? 'doc_scope + update_triggers match inferred changes'
            : hitByScope
              ? 'doc_scope matches inferred changes'
              : 'update_triggers match inferred changes',
      });
    } else {
      skipped.push({
        file: doc.file,
        reason: 'no matching doc_scope or update_triggers',
      });
    }
  }

  const propagatedHits = [];
  const visited = new Set(directSet);
  const queue = [...directSet];

  while (queue.length > 0) {
    const current = queue.shift();
    for (const next of graph.get(current) ?? []) {
      if (visited.has(next)) continue;
      if (!docs.some((doc) => doc.file === next)) continue;
      visited.add(next);
      queue.push(next);
      propagatedHits.push({
        file: next,
        reason: `propagated from ${current}`,
      });
    }
  }

  const result = {
    changedFiles,
    inferredScopes: [...inferredScopes].sort(),
    inferredTriggers: [...inferredTriggers].sort(),
    fileReasons: Object.fromEntries(
      [...reasonsByFile.entries()].map(([file, reasons]) => [file, reasons])
    ),
    directHits,
    propagatedHits,
    skipped,
    metadataErrors,
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log('Changed files:');
  for (const file of changedFiles) console.log(`- ${file}`);

  console.log('\nInferred scopes:');
  for (const scope of result.inferredScopes) console.log(`- ${scope}`);

  console.log('\nInferred triggers:');
  for (const trigger of result.inferredTriggers) console.log(`- ${trigger}`);

  console.log('\nDirect-hit docs:');
  if (directHits.length === 0) {
    console.log('- (none)');
  } else {
    for (const item of directHits) console.log(`- ${item.file}: ${item.reason}`);
  }

  console.log('\nPropagated docs:');
  if (propagatedHits.length === 0) {
    console.log('- (none)');
  } else {
    for (const item of propagatedHits) console.log(`- ${item.file}: ${item.reason}`);
  }

  console.log('\nSkipped docs:');
  for (const item of skipped) console.log(`- ${item.file}: ${item.reason}`);

  if (metadataErrors.length > 0) {
    console.log('\nMetadata errors:');
    for (const item of metadataErrors) {
      console.log(`- ${item.file}: ${item.reason}${item.error ? ` (${item.error})` : ''}`);
    }
  }
}

main();
