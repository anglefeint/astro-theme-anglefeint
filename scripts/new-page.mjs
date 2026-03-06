const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
  console.log('Usage: npm run new-page -- <slug> --theme <base|ai|cyber|hacker|matrix>');
  console.log('Slug: lowercase letters, numbers, hyphens, optional nested paths.');
  process.exit(0);
}
import '../packages/theme/src/cli-new-page.mjs';
