import { spawn } from 'node:child_process';
import { closeSync, openSync, writeSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

// Maintainer-only reporting; never distributed to starter or the theme package.
export async function createMaintainerSession(name, { root = process.cwd() } = {}) {
  const evidence = path.join(root, 'acceptance-results');
  await mkdir(evidence, { recursive: true });
  const lock = path.join(evidence, '.maintainer-lock');
  let lastNotice = 0;
  const waitingSince = Date.now();
  for (;;) {
    try {
      await mkdir(lock);
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let owner;
      try {
        owner = JSON.parse(await readFile(path.join(lock, 'owner.json'), 'utf8'));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      if (!owner && Date.now() - waitingSince > 5000)
        throw new Error(`Incomplete maintainer lock: inspect ${lock} before retrying.`);
      if (owner) {
        try {
          process.kill(owner.pid, 0);
        } catch (error) {
          if (error.code === 'ESRCH')
            throw new Error(
              `Interrupted maintainer session: inspect ${lock} before removing its stale lock.`
            );
          throw error;
        }
      }
      if (Date.now() - lastNotice >= 30_000) {
        console.log(`[maintainer] Waiting for another maintainer operation; lock: ${lock}`);
        lastNotice = Date.now();
      }
      await delay(250);
    }
  }

  let directory;
  try {
    directory = await mkdtemp(path.join(evidence, `maintainer-${Date.now()}-${process.pid}-`));
    await writeFile(path.join(lock, 'owner.json'), JSON.stringify({ pid: process.pid, name }));
  } catch (error) {
    await rm(lock, { recursive: true, force: true });
    throw error;
  }
  const started = Date.now();
  const stages = [];
  console.log(`[maintainer] ${name}; logs: ${directory}`);

  async function stage(label, operation) {
    const record = { label, status: 'running' };
    stages.push(record);
    const start = Date.now();
    console.log(`[stage ${stages.length}] START ${label}`);
    const heartbeat = setInterval(() => {
      console.log(`[stage] RUNNING ${label} (${((Date.now() - start) / 1000).toFixed(1)}s)`);
    }, 30_000);
    try {
      const value = await operation(record);
      record.status = 'passed';
      return value;
    } catch (error) {
      record.status = 'failed';
      throw error;
    } finally {
      clearInterval(heartbeat);
      record.seconds = Number(((Date.now() - start) / 1000).toFixed(2));
      console.log(
        `[stage] ${record.status.toUpperCase()} ${label} (${record.seconds}s)${record.log ? `; log: ${record.log}` : ''}`
      );
    }
  }

  async function run(command, args, { cwd = root, env = process.env, interactive = false } = {}) {
    return stage([command, ...args].join(' '), async (record) => {
      record.log = path.join(directory, `${stages.length}.log`);
      const fd = openSync(record.log, 'w');
      const [executable, argv] =
        command === 'npm' && process.platform === 'win32'
          ? ['cmd.exe', ['/d', '/s', '/c', 'npm', ...args]]
          : [command, args];
      try {
        await new Promise((resolve, reject) => {
          // Preserve npm's terminal/authentication behavior; never record interactive input.
          const child = spawn(executable, argv, {
            cwd,
            env,
            stdio: interactive ? 'inherit' : ['inherit', 'pipe', 'pipe'],
          });
          if (interactive)
            writeSync(
              fd,
              'Interactive output remains on the terminal; only exit status is recorded here.\n'
            );
          child.stdout?.on('data', (chunk) => {
            writeSync(fd, chunk);
          });
          child.stderr?.on('data', (chunk) => {
            writeSync(fd, chunk);
          });
          child.on('error', reject);
          child.on('close', (code, signal) => {
            record.exitCode = code;
            record.signal = signal;
            if (code === 0) resolve();
            else
              reject(
                Object.assign(
                  new Error(`${command} failed (${signal || code}); log: ${record.log}`),
                  { exitCode: code ?? 1 }
                )
              );
          });
        });
      } catch (error) {
        if (!interactive) {
          const tail = (await readFile(record.log, 'utf8')).split(/\r?\n/).slice(-20);
          console.error(tail.map((line) => line.slice(0, 400)).join('\n'));
        }
        throw error;
      } finally {
        closeSync(fd);
      }
    });
  }

  return {
    stage,
    run,
    async close() {
      try {
        await writeFile(
          path.join(directory, 'summary.json'),
          JSON.stringify(
            {
              name,
              seconds: Number(((Date.now() - started) / 1000).toFixed(2)),
              stages,
            },
            null,
            2
          )
        );
        console.log(`[maintainer] Finished; summary: ${path.join(directory, 'summary.json')}`);
      } finally {
        await rm(lock, { recursive: true, force: true });
      }
    },
  };
}
