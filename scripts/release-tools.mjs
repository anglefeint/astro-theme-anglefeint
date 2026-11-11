#!/usr/bin/env node
import process from 'node:process';
import { npmReleaseTools, deliveryTools, planNpmTools } from './release-tool-plan.mjs';

const usage = `Usage: npm run release:tools -- list
       npm run release:tools -- plan <npm-tool> [npm-tool ...]
       npm run release:tools -- run <npm-tool> [npm-tool ...]
No action publishes by default. Select npm-delivery explicitly for complete npm delivery.
Dependencies execute once per invocation; no previous-run result is reused.
Standalone delivery capabilities listed by "list" use their existing commands.`;

async function main() {
  const [action, ...targets] = process.argv.slice(2);
  if (!action || ['--help', '-h'].includes(action)) return console.log(usage);
  if (action === 'list') {
    if (targets.length) throw new Error('list takes no arguments.');
    console.log(JSON.stringify({ npm: npmReleaseTools, standalone: deliveryTools }, null, 2));
    return;
  }
  if (!['plan', 'run'].includes(action)) throw new Error(`Unknown action: ${action}`);
  const plan = planNpmTools(targets);
  console.log(
    JSON.stringify({ requested: targets, plan, publishes: plan.includes('npm-upload') }, null, 2)
  );
  if (action === 'run') {
    const { runNpmTools } = await import('./npm-release-tools.mjs');
    await runNpmTools(targets);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
