import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';

const ROOT = process.cwd();
const REQUIRED_FIELDS = ['doc_id', 'doc_role', 'doc_scope', 'update_triggers'];
const REQUIRED_ARRAY_FIELDS = ['doc_scope', 'update_triggers'];

const EXCLUDE_PREFIXES = [
  'src/content/blog/',
  'public/images/',
  '.cursor/workflows/',
  '.cursor/skills/',
  '.git/',
  'node_modules/',
  'dist/',
];

const EXCLUDE_FILES = new Set([]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const rel = relative(ROOT, abs).replaceAll('\\', '/');
    if (EXCLUDE_PREFIXES.some((prefix) => rel.startsWith(prefix))) continue;
    const st = statSync(abs);
    if (st.isDirectory()) {
      walk(abs, out);
      continue;
    }
    if (!rel.endsWith('.md')) continue;
    if (EXCLUDE_FILES.has(rel)) continue;
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

function getBranchName() {
  const r = spawnSync('git', ['branch', '--show-current'], { encoding: 'utf8' });
  if (r.status !== 0) return 'unknown';
  return r.stdout.trim() || 'unknown';
}

function validateReadmeBranchPolicy(files, branch) {
  const issues = [];
  const readmes = files.filter((f) => /^README(\..+)?\.md$/.test(f) || f === 'README.md');
  for (const file of readmes) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes('#starter')) {
      issues.push(`${file}: missing '#starter' template install reference`);
    }
    if (!text.includes('npm update @anglefeint/astro-theme')) {
      issues.push(`${file}: missing theme upgrade command 'npm update @anglefeint/astro-theme'`);
    }

    const wrongNpm =
      /npm create astro@latest -- --template anglefeint\/astro-theme-anglefeint(?!#starter)/.test(
        text
      );
    const wrongPnpm =
      /pnpm create astro@latest --template anglefeint\/astro-theme-anglefeint(?!#starter)/.test(
        text
      );
    if (wrongNpm || wrongPnpm) {
      issues.push(`${file}: contains template install command without '#starter'`);
    }
  }

  if (branch === 'starter') {
    const policyFile = 'docs/BRANCH_POLICY.md';
    try {
      const policy = readFileSync(policyFile, 'utf8');
      if (!policy.includes('starter')) {
        issues.push(`${policyFile}: missing starter branch policy details`);
      }
    } catch {
      issues.push(`${policyFile}: missing file`);
    }
  }
  return issues;
}

function main() {
  const files = walk(ROOT).sort();
  const missingFrontmatter = [];
  const parseErrors = [];
  const missingFields = [];
  const wrongTypeFields = [];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const parsedFrontmatter = parseDocFrontmatter(file, text);
    if (!parsedFrontmatter.ok) {
      if (parsedFrontmatter.reason === 'missing-frontmatter') {
        missingFrontmatter.push(file);
      } else {
        parseErrors.push(`${file}: ${parsedFrontmatter.error}`);
      }
      continue;
    }
    const parsed = parsedFrontmatter.data;
    if (!parsed || typeof parsed !== 'object') {
      missingFrontmatter.push(file);
      continue;
    }
    for (const field of REQUIRED_FIELDS) {
      if (!(field in parsed) || parsed[field] === '' || parsed[field] === undefined) {
        missingFields.push(`${file}: missing field '${field}'`);
      }
    }
    for (const field of REQUIRED_ARRAY_FIELDS) {
      const value = parsed[field];
      if (value !== undefined && !Array.isArray(value)) {
        wrongTypeFields.push(`${file}: field '${field}' should be an array, got '${typeof value}'`);
      }
    }
  }

  const branch = getBranchName();
  const branchPolicyIssues = validateReadmeBranchPolicy(files, branch);

  const hasError =
    missingFrontmatter.length > 0 ||
    parseErrors.length > 0 ||
    missingFields.length > 0 ||
    wrongTypeFields.length > 0 ||
    branchPolicyIssues.length > 0;

  if (!hasError) {
    console.log(`Doc metadata validation passed on branch '${branch}'.`);
    console.log(`Scanned ${files.length} markdown files.`);
    return;
  }

  console.error(`Doc metadata validation failed on branch '${branch}'.`);
  if (missingFrontmatter.length) {
    console.error('\nMissing frontmatter:');
    for (const item of missingFrontmatter) console.error(`- ${item}`);
  }
  if (parseErrors.length) {
    console.error('\nFrontmatter parse errors:');
    for (const item of parseErrors) console.error(`- ${item}`);
  }
  if (missingFields.length) {
    console.error('\nMissing required fields:');
    for (const item of missingFields) console.error(`- ${item}`);
  }
  if (wrongTypeFields.length) {
    console.error('\nWrong field format:');
    for (const item of wrongTypeFields) console.error(`- ${item}`);
  }
  if (branchPolicyIssues.length) {
    console.error('\nBranch policy issues:');
    for (const item of branchPolicyIssues) console.error(`- ${item}`);
  }
  process.exit(1);
}

main();
