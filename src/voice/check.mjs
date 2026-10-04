// pnpm voice:check <chapter> — round-trip QC for narration: transcribe each WAV with Sarvam Saaras
// and compare the transcript with the script line, so a mispronounced name or a dropped phrase
// shows up as a low match without anyone having to listen first. Advisory: a native reviewer
// still signs off each language. Calls are ledgered (rule 3) and cached on the WAV's hash.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, requireEnv, redact, maxRunUsd } from '../env.mjs';
import { Ledger, Budget } from '../ledger/ledger.mjs';
import { assertDataUse } from '../providers.mjs';
import { INR_PER_USD, wavInfo } from './sarvam.mjs';

export const STT_URL = 'https://api.sarvam.ai/speech-to-text';
/** Saaras: ₹30 per hour, billed per second (https://docs.sarvam.ai/api/getting-started/pricing.md, 2026-10-04). */
export const STT_INR_PER_HOUR = 30;
const CACHE = join(ROOT, 'out', 'cache', 'stt');

/** Lower-case words with diacritics and punctuation removed, for a tolerant comparison. */
export function words(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
}

/** Word-level similarity: 1 − (word edit distance / reference length), floored at 0. */
export function wordMatch(reference, hypothesis) {
  const a = words(reference);
  const b = words(hypothesis);
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return a.length ? Math.max(0, 1 - d[a.length][b.length] / a.length) : 1;
}

async function transcribe(wavPath, lang, { ledger, budget, fetch, env }) {
  const buf = readFileSync(wavPath);
  const hash = createHash('sha256').update(buf).update(lang).digest('hex');
  const cached = join(CACHE, `${hash}.json`);
  if (existsSync(cached)) return { ...JSON.parse(readFileSync(cached, 'utf8')), cached: true };
  assertDataUse('sarvam', 'script');
  const key = requireEnv('SARVAM_API_KEY', env);
  const seconds = wavInfo(buf).durationMs / 1000;
  const estUsd = (seconds / 3600) * STT_INR_PER_HOUR / INR_PER_USD;
  const idem = `stt:${hash}`;
  budget.reserve(estUsd, idem);
  ledger.append({ kind: 'stt-check', phase: 'intent', key: idem, provider: 'sarvam', model: 'saaras:v4', lang, seconds, estUsd });
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'audio/wav' }), 'line.wav');
  fd.append('model', 'saaras:v4');
  fd.append('language_code', lang);
  const started = Date.now();
  const res = await fetch(STT_URL, { method: 'POST', headers: { 'api-subscription-key': key }, body: fd });
  const body = await res.text();
  if (!res.ok) {
    budget.settle(estUsd, 0);
    ledger.append({ kind: 'stt-check', phase: 'failed', key: idem, provider: 'sarvam', status: res.status, error: redact(body, env).slice(0, 300) });
    throw new Error(`Sarvam STT returned ${res.status}: ${redact(body, env).slice(0, 300)}`);
  }
  const { transcript, request_id: requestId } = JSON.parse(body);
  budget.settle(estUsd, estUsd);
  ledger.append({ kind: 'stt-check', phase: 'done', key: idem, provider: 'sarvam', model: 'saaras:v4', requestId, ms: Date.now() - started, seconds, usd: estUsd });
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(cached, JSON.stringify({ transcript, requestId }));
  return { transcript, requestId, cached: false };
}

export async function run(argv = process.argv.slice(2), { fetch = globalThis.fetch, env = process.env, log = console.log } = {}) {
  const chapter = argv[0];
  if (!chapter) throw new Error('usage: pnpm voice:check <chapter>');
  const script = JSON.parse(readFileSync(join(ROOT, 'content', chapter, 'narration.json'), 'utf8'));
  const ledger = new Ledger(join(ROOT, 'content', chapter, 'ledger.jsonl'));
  const budget = new Budget(maxRunUsd(env));
  const rows = [];
  for (const lang of script.languages) {
    for (const line of [{ id: 'n00-disclosure', text: script.disclosure.text }, ...script.lines]) {
      const wav = join(ROOT, 'out', chapter, 'voice', lang, `${line.id}.wav`);
      if (!existsSync(wav)) throw new Error(`${wav} is missing; run pnpm voice ${chapter} first`);
      const { transcript, cached } = await transcribe(wav, lang, { ledger, budget, fetch, env });
      rows.push({ lang, id: line.id, match: wordMatch(line.text[lang], transcript), script: line.text[lang], heard: transcript, cached });
    }
  }
  for (const r of rows) log(`${r.lang}  ${r.id.padEnd(15)} ${(r.match * 100).toFixed(0).padStart(3)}%  heard: ${r.heard}`);
  const low = rows.filter((r) => r.match < 0.8);
  log(`${rows.length} lines; mean match ${(rows.reduce((s, r) => s + r.match, 0) / rows.length * 100).toFixed(1)}%; ${low.length} under 80% for a reviewer to listen to first`);
  return rows;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  run().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
