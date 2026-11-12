#!/usr/bin/env node
// Compatibility entry; execution lives in reusable maintainer tools.
import { runNpmTools } from './npm-release-tools.mjs';

function parseArgs(argv) {
  const opts = {
    tag: '',
    dryRun: false,
    skipChecks: false,
    skipPack: false,
    skipRegistryCheck: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--skip-checks') {
      console.warn(
        '--skip-checks is deprecated: validation is selected separately; no full suite or matrix runs implicitly.'
      );
      continue;
    }
    if (arg === '--skip-pack') {
      opts.skipPack = true;
      continue;
    }
    if (arg === '--skip-registry-check') {
      opts.skipRegistryCheck = true;
      continue;
    }
    if (arg === '--tag') {
      opts.tag = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (arg.startsWith('--tag=')) {
      opts.tag = arg.slice('--tag='.length);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    console.error(`Unknown argument: ${arg}`);
    printHelp();
    process.exit(1);
  }

  return opts;
}

function printHelp() {
  console.log(`Usage:
  npm run release:npm -- [--tag <tag>] [--dry-run] [--skip-checks] [--skip-pack] [--skip-registry-check]

Examples:
  npm run release:npm
  npm run release:npm -- --tag alpha
  npm run release:npm -- --tag alpha --dry-run

Publication mechanics only. Select change-related technical validation with release:tools.
`);
}

runNpmTools(['npm-delivery'], parseArgs(process.argv.slice(2))).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
