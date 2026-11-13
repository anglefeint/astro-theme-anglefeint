import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';
import { setTimeout } from 'node:timers/promises';

const transientCodes = new Set([
  'E404',
  'ETIMEDOUT',
  'ESOCKETTIMEDOUT',
  'ERR_SOCKET_TIMEOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'EAI_AGAIN',
  'ENOTFOUND',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'E408',
  'E429',
  'E500',
  'E502',
  'E503',
  'E504',
]);

function verificationError(code, message, retryable = false) {
  return Object.assign(new Error(message), { code, retryable });
}

function requireIdentity(condition, message) {
  if (!condition) throw verificationError('IDENTITY_MISMATCH', message);
}

// Only named transient npm failures retry. Unknown failures stop closed.
function classify(error) {
  if (typeof error.retryable === 'boolean') return error;
  let report;
  try {
    report = JSON.parse(String(error.stdout)).error;
  } catch {
    /* Not npm JSON. */
  }
  const rawCode =
    report?.code ||
    (typeof error.code === 'string' && error.code) ||
    String(error.stderr || '').match(/(?:npm (?:error|ERR!) code|\bcode)\s+(E[A-Z0-9_]+)/)?.[1] ||
    (error instanceof SyntaxError ? 'INVALID_JSON' : 'UNKNOWN_ERROR');
  const code = /^[A-Z][A-Z0-9_]*$/.test(rawCode) ? rawCode : 'UNKNOWN_ERROR';
  return verificationError(
    code,
    report?.summary || error.message || String(error),
    transientCodes.has(code)
  );
}

function safeReason(message) {
  return String(message)
    .replace(/(https?:\/\/)[^\s/@]+@/gi, '$1[redacted]@')
    .replace(/\b(?:npm_[A-Za-z0-9]+|Bearer\s+\S+)/gi, '[redacted]')
    .replace(/((?:token|password|_authToken|authorization)\s*[=:]\s*)[^\s&,;]+/gi, '$1[redacted]')
    .replace(/\s+/g, ' ')
    .slice(0, 400);
}

// Both publication and recovery use this contract. Never retries an upload/install.
export async function verifyPublishedPackage({
  name,
  version,
  tag = 'latest',
  capture,
  destination,
  attempts = 12,
  delayMs = 10000,
  sleep = setTimeout,
  log = console.log,
  onFailure = () => {},
  onWait = () => {},
  expected = {},
}) {
  assert.ok(Number.isInteger(attempts) && attempts > 0);
  const options = ['--json', '--prefer-online', '--fetch-retries=0', '--fetch-timeout=15000'];
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let stage = 'tag';
    try {
      const visible = JSON.parse(await capture(['view', `${name}@${tag}`, 'version', ...options]));
      if (typeof visible !== 'string')
        throw verificationError('INVALID_RESPONSE', 'Tag version must be a string');
      if (visible !== version)
        throw verificationError(
          'TAG_PENDING',
          `Tag ${tag} points to ${visible}; waiting for ${version}`,
          true
        );
      stage = 'metadata';
      const metadata = JSON.parse(await capture(['view', `${name}@${version}`, ...options]));
      requireIdentity(metadata?.name === name, 'Registry package name mismatch');
      requireIdentity(metadata.version === version, 'Registry version mismatch');
      requireIdentity(
        typeof metadata.dist?.integrity === 'string' &&
          /^sha(?:256|384|512)-[A-Za-z0-9+/]+={0,2}$/.test(metadata.dist.integrity),
        'Registry integrity is missing or malformed'
      );
      requireIdentity(
        typeof metadata.dist?.shasum === 'string' && /^[0-9a-f]{40}$/i.test(metadata.dist.shasum),
        'Registry SHA1 is missing or malformed'
      );
      if (expected.source)
        requireIdentity(metadata.gitHead === expected.source, 'Published source mismatch');
      if (expected.integrity)
        requireIdentity(
          metadata.dist.integrity === expected.integrity,
          'Published integrity mismatch'
        );
      if (expected.shasum)
        requireIdentity(metadata.dist.shasum === expected.shasum, 'Published SHA1 mismatch');
      stage = 'download';
      const packed = JSON.parse(
        await capture([
          'pack',
          `${name}@${version}`,
          '--ignore-scripts',
          '--pack-destination',
          destination,
          ...options,
        ])
      );
      requireIdentity(
        Array.isArray(packed) && packed.length === 1,
        'Expected exactly one downloaded package'
      );
      requireIdentity(
        packed[0]?.name === name && packed[0].version === version,
        'Downloaded package identity mismatch'
      );
      requireIdentity(
        packed[0].integrity === metadata.dist.integrity,
        'Downloaded integrity mismatch'
      );
      requireIdentity(packed[0].shasum === metadata.dist.shasum, 'Downloaded SHA1 mismatch');
      log(`[release] Registry ${tag}, metadata and tarball verified: ${name}@${version}`);
      return { ...packed[0], metadata };
    } catch (error) {
      const failure = classify(error);
      const action = !failure.retryable ? 'stop' : attempt < attempts ? 'retry' : 'exhausted';
      const reason = safeReason(failure.message);
      onFailure({ attempt, attempts, stage, code: failure.code, action, reason });
      log(
        `[release] Verification ${attempt}/${attempts} stage=${stage} code=${failure.code} action=${action}: ${reason}`
      );
      if (action === 'retry') {
        const waitStarted = performance.now();
        try {
          await sleep(delayMs);
        } finally {
          onWait(performance.now() - waitStarted);
        }
        continue;
      }
      throw Object.assign(
        new Error(
          `Registry verification ${action} for ${name}@${version}: stage=${stage} code=${failure.code}: ${reason}. ` +
            'Do not republish this version or sync starter yet. Diagnose the failure, then resume read-only verification.',
          { cause: error }
        ),
        { code: failure.code, stage, retryable: failure.retryable, attempt }
      );
    }
  }
}
