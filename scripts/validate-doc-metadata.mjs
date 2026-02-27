import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

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

const EXCLUDE_FILES = new Set([
	'AGENTS.md',
]);

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

function extractFrontmatter(text) {
	if (!text.startsWith('---\n')) return null;
	const end = text.indexOf('\n---\n', 4);
	if (end === -1) return null;
	return text.slice(4, end);
}

function parseFrontmatter(frontmatter) {
	const map = {};
	for (const raw of frontmatter.split('\n')) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		const idx = line.indexOf(':');
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		const value = line.slice(idx + 1).trim();
		map[key] = value;
	}
	return map;
}

function isArrayLike(v) {
	return v.startsWith('[') && v.endsWith(']');
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

		const wrongNpm = /npm create astro@latest -- --template voidtem\/astro-theme-anglefeint(?!#starter)/.test(text);
		const wrongPnpm = /pnpm create astro@latest --template voidtem\/astro-theme-anglefeint(?!#starter)/.test(text);
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
	const missingFields = [];
	const wrongTypeFields = [];

	for (const file of files) {
		const text = readFileSync(file, 'utf8');
		const fm = extractFrontmatter(text);
		if (!fm) {
			missingFrontmatter.push(file);
			continue;
		}
		const parsed = parseFrontmatter(fm);
		for (const field of REQUIRED_FIELDS) {
			if (!(field in parsed) || parsed[field] === '') {
				missingFields.push(`${file}: missing field '${field}'`);
			}
		}
		for (const field of REQUIRED_ARRAY_FIELDS) {
			const value = parsed[field];
			if (value && !isArrayLike(value)) {
				wrongTypeFields.push(`${file}: field '${field}' should be array-like, got '${value}'`);
			}
		}
	}

	const branch = getBranchName();
	const branchPolicyIssues = validateReadmeBranchPolicy(files, branch);

	const hasError =
		missingFrontmatter.length > 0 ||
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
