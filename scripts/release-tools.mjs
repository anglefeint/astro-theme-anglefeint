#!/usr/bin/env node
import process from 'node:process';
import {
  npmReleaseTools,
  deliveryTools,
  planNpmTools,
  validateToolSelection,
} from './release-tool-plan.mjs';

const usage = `Usage: npm run release:tools -- list
       npm run release:tools -- plan <tool> [tool ...]
       npm run release:tools -- run <tool> [tool ...] [--test tests/name.test.mjs ...] [--confirmed]
No action publishes by default. npm-delivery includes publication mechanics only.
Select independent validation for the actual change; unit-tests requires literal --test paths.
--confirmed acknowledges user approval already received for exceptional full checks.
Dependencies execute once per invocation; no previous-run result is reused.
Standalone delivery capabilities listed by "list" use their existing commands.`;

async function main() {
  const [action, ...args] = process.argv.slice(2);
  const targets = [],
    options = { testFiles: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--confirmed') options.confirmed = true;
    else if (args[i] === '--test') {
      const file = args[++i];
      if (!file || file.startsWith('--')) throw new Error('Missing --test path');
      options.testFiles.push(file);
    } else targets.push(args[i]);
  }
  if (!action || ['--help', '-h'].includes(action)) return console.log(usage);
  if (action === 'list') {
    if (args.length) throw new Error('list takes no arguments.');
    console.log(JSON.stringify({ tools: npmReleaseTools, standalone: deliveryTools }, null, 2));
    return;
  }
  if (!['plan', 'run'].includes(action)) throw new Error(`Unknown action: ${action}`);
  const plan = planNpmTools(targets);
  console.log(
    JSON.stringify(
      {
        requested: targets,
        plan,
        publishes: plan.includes('npm-upload'),
        confirmationRequired: plan.filter((name) => npmReleaseTools[name].requiresUserConfirmation),
      },
      null,
      2
    )
  );
  if (action === 'run') {
    validateToolSelection(plan, options);
    const { runNpmTools } = await import('./npm-release-tools.mjs');
    await runNpmTools(targets, options);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
