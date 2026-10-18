import { createMaintainerSession } from './maintainer-session.mjs';

let session;
try {
  session = await createMaintainerSession('pre-push check');
  await session.run('npm', ['run', 'check']);
} catch (error) {
  console.error(error.message);
  process.exitCode = error.exitCode || 1;
} finally {
  await session?.close();
}
