// Submitting a shot to fal's queue, with every guard before the request:
//   rule 6  a final needs a human approval record (content/<chapter>/approvals/<shot>.json)
//   rule 4  a worldwide contract never goes to an india_only model (src/render/route.mjs)
//   spend   the run's estimate may not pass MAX_RUN_USD
//   rule 3  the ledger row is written and flushed before the request
//   retry   one idempotency key per (shot, attempt), so a re-run never double-bills
// Without FAL_KEY this throws before any request; nothing is rendered elsewhere instead.
// Runs poll the queue: this container cannot receive webhooks (src/render/webhook.mjs is for deployment).
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, requireEnv, redact } from '../env.mjs';
import { route } from './route.mjs';
import { compile } from '../compile/index.mjs';
import { assertDataUse } from '../providers.mjs';

export const QUEUE = 'https://queue.fal.run';
/** fal media is public by default; keep render outputs one day and download them at once. */
export const MEDIA_RETENTION_S = 86400;

export class SubmitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SubmitError';
  }
}

/** Rule 6: the approval record for a final render of one shot, or null. */
export function approvalFor(contract, { root = ROOT } = {}) {
  const path = join(root, 'content', contract.chapter, 'approvals', `${contract.id}.json`);
  if (!existsSync(path)) return null;
  const a = JSON.parse(readFileSync(path, 'utf8'));
  return a.shot === contract.id && a.quality === 'final' && typeof a.by === 'string' && a.by && /^\d{4}-\d{2}-\d{2}$/.test(a.date) ? a : null;
}

export const idempotencyKey = (contract, attempt) => `render:${contract.id}:${attempt}`;

/**
 * Plan and submit one take.
 * @returns {Promise<{ requestId: string, statusUrl: string, responseUrl: string, compiled: object } | { skipped: string }>}
 */
export async function submit(contract, { attempt = 1, quality = contract.quality, ledger, budget, fetch = globalThis.fetch, env = process.env, root = ROOT, referenceImageUrls = [], loras = [], override } = {}) {
  if (quality === 'final' && !approvalFor(contract, { root })) {
    throw new SubmitError(`rule 6: ${contract.id} final render refused: no approval record at content/${contract.chapter}/approvals/${contract.id}.json (finals need a human)`);
  }
  const m = route(contract, { quality, override, referenceImageUrls });
  const compiled = compile(contract, m, { attempt, quality, referenceImageUrls, loras });
  if (!ledger || !budget) throw new SubmitError('a ledger and a budget are required before any request (rule 3)');

  const key = idempotencyKey(contract, attempt);
  const prior = ledger.latest(key);
  if (prior && prior.phase !== 'failed') return { skipped: `${key} already ${prior.phase} (request ${prior.requestId ?? 'pending'})`, prior };

  // Prompts carry our scripts and public text only; partner terms are unverified, so fal is
  // treated as a service that may pass inputs on (rule 5 blocks unreleased source).
  assertDataUse('fal', 'script');
  const apiKey = requireEnv('FAL_KEY', env);
  budget.reserve(compiled.estUsd, key);
  ledger.append({
    kind: 'render', phase: 'intent', key, shot: contract.id, beat: contract.beat, attempt, quality,
    provider: 'fal', model: m.id, endpoint: m.endpoint, seed: compiled.seed, resolution: compiled.resolution,
    billedS: compiled.billedS, estUsd: compiled.estUsd, licence: m.licence, territory: m.territory,
    contractTerritory: contract.territory, inputHash: compiled.inputHash,
  });

  const started = Date.now();
  let res;
  try {
    res = await fetch(`${QUEUE}/${m.endpoint}`, {
      method: 'POST',
      headers: {
        authorization: `Key ${apiKey}`,
        'content-type': 'application/json',
        'x-fal-object-lifecycle-preference': JSON.stringify({ expiration_duration_seconds: MEDIA_RETENTION_S }),
      },
      body: JSON.stringify(compiled.input),
    });
  } catch (err) {
    budget.settle(compiled.estUsd, 0);
    ledger.append({ kind: 'render', phase: 'failed', key, shot: contract.id, ms: Date.now() - started, error: redact(err.message, env) });
    throw new SubmitError(`fal unreachable: ${redact(err.message, env)}`);
  }
  const text = await res.text();
  if (!res.ok) {
    budget.settle(compiled.estUsd, 0);
    ledger.append({ kind: 'render', phase: 'failed', key, shot: contract.id, ms: Date.now() - started, status: res.status, error: redact(text, env).slice(0, 500) });
    throw new SubmitError(`fal queue returned ${res.status}: ${redact(text, env).slice(0, 300)}`);
  }
  const body = JSON.parse(text);
  ledger.append({
    kind: 'render', phase: 'queued', key, shot: contract.id, model: m.id, requestId: body.request_id,
    statusUrl: body.status_url, responseUrl: body.response_url, submitMs: Date.now() - started,
  });
  return { requestId: body.request_id, statusUrl: body.status_url, responseUrl: body.response_url, compiled };
}

/**
 * Poll a queued take until it completes, then download the video. Records queue latency and the
 * billed estimate in the ledger. Throws on a failed take; never substitutes another provider.
 */
export async function collect(queued, { ledger, budget, fetch = globalThis.fetch, env = process.env, outDir, intervalMs = 5000, timeoutMs = 20 * 60000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  const apiKey = requireEnv('FAL_KEY', env);
  const headers = { authorization: `Key ${apiKey}` };
  const { compiled } = queued;
  const key = `render:${compiled.shot}:${compiled.attempt}`;
  const started = Date.now();
  for (;;) {
    const s = await (await fetch(`${queued.statusUrl}?logs=0`, { headers })).json();
    if (s.status === 'COMPLETED') {
      if (s.error) {
        budget.settle(compiled.estUsd, 0);
        ledger.append({ kind: 'render', phase: 'failed', key, shot: compiled.shot, error: redact(String(s.error), env), errorType: s.error_type ?? null });
        throw new SubmitError(`${compiled.shot} attempt ${compiled.attempt} failed at fal: ${s.error}`);
      }
      break;
    }
    if (Date.now() - started > timeoutMs) throw new SubmitError(`${compiled.shot}: still ${s.status} after ${timeoutMs / 60000} min`);
    await sleep(intervalMs);
  }
  const result = await (await fetch(queued.responseUrl, { headers })).json();
  const url = result.video?.url;
  if (!url) throw new SubmitError(`${compiled.shot}: fal result has no video url`);
  const video = Buffer.from(await (await fetch(url)).arrayBuffer());
  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, `${compiled.shot}.a${compiled.attempt}.mp4`);
  writeFileSync(path, video);
  ledger.append({
    kind: 'render', phase: 'done', key, shot: compiled.shot, model: compiled.model, requestId: queued.requestId,
    queueMs: Date.now() - started, usd: compiled.estUsd, seed: result.seed ?? compiled.seed, bytes: video.length, path,
  });
  return { path, result };
}
