const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
  console.log('Usage: npm run new-post -- <slug> [--locales en,fr,...]');
  console.log('Slug: lowercase letters, numbers, hyphens.');
  console.log('Locales override: --locales en,fr or ANGLEFEINT_LOCALES=en,fr');
  process.exit(0);
}
import '../packages/theme/src/cli-new-post.mjs';
