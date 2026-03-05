import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function parseArgs(argv) {
  return {
    checkOnly: argv.includes('--check'),
    allowAnyBranch: argv.includes('--allow-any-branch'),
    from: argv.find((arg) => arg.startsWith('--from='))?.slice('--from='.length) || 'main',
  };
}

async function run(command, args) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    maxBuffer: 20 * 1024 * 1024,
  });
  if (stdout.trim()) process.stdout.write(stdout);
  if (stderr.trim()) process.stderr.write(stderr);
}

async function currentBranch() {
  const { stdout } = await execFileAsync('git', ['branch', '--show-current']);
  return stdout.trim();
}

async function ensureStarterBranch(allowAnyBranch) {
  if (allowAnyBranch) return;
  const branch = await currentBranch();
  if (branch !== 'starter') {
    throw new Error(
      `[maintainer:sync-starter] current branch is "${branch}". Switch to "starter" or pass --allow-any-branch.`
    );
  }
}

async function main() {
  const { checkOnly, allowAnyBranch, from } = parseArgs(process.argv.slice(2));

  await ensureStarterBranch(allowAnyBranch);

  if (checkOnly) {
    await run('node', ['scripts/regenerate-starter.mjs', '--check', `--from=${from}`]);
    await run('npm', ['run', 'check']);
    await run('node', ['scripts/check-scaffold.mjs']);
    return;
  }

  await run('node', ['scripts/regenerate-starter.mjs', `--from=${from}`]);
  await run('node', ['scripts/regenerate-starter.mjs', '--check', `--from=${from}`]);
  await run('npm', ['run', 'check']);
  await run('node', ['scripts/check-scaffold.mjs']);

  console.log('[maintainer:sync-starter] sync + validation complete.');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
