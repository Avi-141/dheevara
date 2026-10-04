// The chant step (rule 7): a śloka goes to Vāgdhenu on our GPU box (services/vagdhenu/) or to a
// human reciter, never to a TTS voice. Until VAGDHENU_URL is set this throws; there is no fallback.
// Output stays internal until Vāgdhenu's author agrees (docs/research/vagdhenu.md).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { requireEnv, redact, ROOT, MissingEnvError } from '../env.mjs';
import { assertDataUse } from '../providers.mjs';

export const CHANT_CACHE_DIR = join(ROOT, 'out', 'cache', 'chant');

export class ChantError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ChantError';
  }
}

/** One verse, in Devanagari, split into pādas at daṇḍas or line breaks. */
export function padas(devanagari) {
  return devanagari
    .replace(/[०-९]+/g, '')
    .split(/[।॥\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Chant one śloka. Throws a ChantError naming VAGDHENU_URL when no chant service exists.
 * @returns {Promise<{ wavPath: string, cached: boolean }>}
 */
export async function chant({ devanagari, meter = null, seed = 60 }, { ledger, key, cacheDir = CHANT_CACHE_DIR, fetch = globalThis.fetch, env = process.env } = {}) {
  if (!/[ऀ-ॿ]/.test(devanagari ?? '')) throw new ChantError('chant: the verse must be in Devanagari');
  const lines = padas(devanagari);
  const hash = createHash('sha256').update(JSON.stringify({ service: 'vagdhenu', lines, meter, seed })).digest('hex');
  const wavPath = join(cacheDir, `${hash}.wav`);
  if (existsSync(wavPath)) return { wavPath, cached: true };

  let base;
  try {
    base = requireEnv('VAGDHENU_URL', env);
  } catch (err) {
    if (err instanceof MissingEnvError) {
      throw new ChantError(
        'chant: VAGDHENU_URL is not set, so there is no chant service. Ślokas are chanted by Vāgdhenu on a CUDA box ' +
          '(services/vagdhenu/) or by a human reciter, never by a TTS voice (rule 7). See docs/research/vagdhenu.md.',
      );
    }
    throw err;
  }
  assertDataUse('vagdhenu', 'public');
  if (!ledger) throw new ChantError('chant: a ledger is required before any request (rule 3)');
  const idem = key ?? `chant:${hash}`;
  ledger.append({ kind: 'chant', phase: 'intent', key: idem, provider: 'vagdhenu', meter, seed, padas: lines.length, usd: 0, licence: 'Apache-2.0 code and weights; voice is the author\'s, internal use only until permission', territory: 'internal' });

  const started = Date.now();
  let res;
  try {
    res = await fetch(new URL('/chant', base), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ padas: lines, meter, seed }),
    });
  } catch (err) {
    ledger.append({ kind: 'chant', phase: 'failed', key: idem, provider: 'vagdhenu', ms: Date.now() - started, error: redact(err.message, env) });
    throw new ChantError(`chant: Vāgdhenu at VAGDHENU_URL is unreachable: ${redact(err.message, env)}`);
  }
  const ms = Date.now() - started;
  if (!res.ok) {
    const body = redact(await res.text(), env).slice(0, 300);
    ledger.append({ kind: 'chant', phase: 'failed', key: idem, provider: 'vagdhenu', ms, status: res.status, error: body });
    throw new ChantError(`chant: Vāgdhenu returned ${res.status}: ${body}`);
  }
  const wav = Buffer.from(await res.arrayBuffer());
  if (wav.subarray(0, 4).toString('ascii') !== 'RIFF') throw new ChantError('chant: Vāgdhenu did not return a WAV file');
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(wavPath + '.part', wav);
  renameSync(wavPath + '.part', wavPath);
  ledger.append({ kind: 'chant', phase: 'done', key: idem, provider: 'vagdhenu', ms, bytes: wav.length, meter: res.headers.get('x-meter') ? decodeURIComponent(res.headers.get('x-meter')) : meter, usd: 0 });
  return { wavPath, cached: false };
}
