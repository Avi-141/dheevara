// pnpm report <chapter> — what the ledger says: dollars per shot, per beat and per chapter (renders,
// voice, checks), queue and request latency at p50 and p95, and the rule-4 territory audit.
// Cost and latency are measured, not guessed (handoff section 5).
import { join } from 'node:path';
import { ROOT } from '../env.mjs';
import { Ledger } from '../ledger/ledger.mjs';
import { territoryBreaches } from './route.mjs';

export function percentile(values, p) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)];
}

export function summarise(rows) {
  const done = rows.filter((r) => r.phase === 'done');
  const intents = new Map(rows.filter((r) => r.phase === 'intent').map((r) => [r.key, r]));
  const byShot = {};
  const byBeat = {};
  const byKind = {};
  for (const r of done) {
    const usd = r.usd ?? 0;
    byKind[r.kind] = (byKind[r.kind] ?? 0) + usd;
    if (r.kind === 'render') {
      byShot[r.shot] = (byShot[r.shot] ?? 0) + usd;
      const beat = intents.get(r.key)?.beat ?? 'unknown';
      byBeat[beat] = (byBeat[beat] ?? 0) + usd;
    }
  }
  const latency = (kind, field) => {
    const v = done.filter((r) => r.kind === kind && Number.isFinite(r[field])).map((r) => r[field]);
    return { n: v.length, p50: percentile(v, 50), p95: percentile(v, 95) };
  };
  return {
    totalUsd: done.reduce((s, r) => s + (r.usd ?? 0), 0),
    byKind, byShot, byBeat,
    latency: { render: latency('render', 'queueMs'), voice: latency('voice', 'ms'), stt: latency('stt-check', 'ms') },
    failed: rows.filter((r) => r.phase === 'failed').length,
    territoryBreaches: territoryBreaches(rows.filter((r) => r.phase === 'intent')),
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const chapter = process.argv[2];
  const s = summarise(new Ledger(join(ROOT, 'content', chapter, 'ledger.jsonl')).rows());
  const money = (x) => `$${x.toFixed(4)}`;
  console.log(`${chapter}: ${money(s.totalUsd)} recorded spend`);
  for (const [k, v] of Object.entries(s.byKind)) console.log(`  ${k.padEnd(16)} ${money(v)}`);
  for (const [k, v] of Object.entries(s.byBeat)) console.log(`  beat ${k.padEnd(11)} ${money(v)}`);
  for (const [k, v] of Object.entries(s.byShot)) console.log(`  ${k.padEnd(16)} ${money(v)}`);
  for (const [k, l] of Object.entries(s.latency)) if (l.n) console.log(`  latency ${k.padEnd(8)} n=${l.n} p50 ${l.p50} ms  p95 ${l.p95} ms`);
  console.log(`  failed requests: ${s.failed}`);
  console.log(`  territory breaches (rule 4): ${s.territoryBreaches.length}`);
}
