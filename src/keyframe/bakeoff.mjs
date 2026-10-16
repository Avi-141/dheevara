// pnpm bakeoff:keyframes [--shots s1e3-sh05,s1e3-sh12] [--takes 2] [--models a,b] [--plan]
// The keyframe bake-off (docs/research/2026-10-15-api-first-tooling.md, section 9): the same
// compiled prompt from each shot contract goes to each candidate image model on fal, a fixed
// number of takes per shot, so the models can be compared on one contact sheet.
//   rule 1  the contract's forbidden list travels as an "Avoid:" sentence (none of these models
//           takes a negative prompt); the verdicts check it by eye
//   rule 3  every take writes its ledger row and flushes it before the request
//   rule 5  prompts are 'script' class (written from public text); fal may pass them to partners
//   spend   the whole run is estimated first and refused above MAX_RUN_USD
// Without FAL_KEY it stops before the first request; --plan prints the run without a key.
// Results land in out/<chapter>/bakeoff/ (gitignored) with an index.html contact sheet.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, maxRunUsd, requireEnv, redact } from '../env.mjs';
import { Ledger, Budget, RUN_ID } from '../ledger/ledger.mjs';
import { loadCanon } from '../canon/index.mjs';
import { validateContract } from '../contract/validate.mjs';
import { prompt, negatives, seedFor } from '../compile/index.mjs';
import { assertDataUse } from '../providers.mjs';
import { QUEUE, MEDIA_RETENTION_S } from '../render/submit.mjs';

/**
 * Candidate keyframe models on fal. Prices from each model's fal page, retrieved 2026-10-16.
 * input() builds the fal request body for a 9:16 still.
 */
export const KEYFRAME_MODELS = {
  'nano-banana-pro': {
    endpoint: 'fal-ai/nano-banana-pro',
    maker: 'Google (Gemini 3 Pro Image)',
    price: '$0.15 per image (1K/2K)',
    estUsd: () => 0.15,
    input: (text, seed) => ({ prompt: text, aspect_ratio: '9:16', resolution: '2K', num_images: 1, output_format: 'png', seed }),
  },
  'flux-2-pro': {
    endpoint: 'fal-ai/flux-2-pro',
    maker: 'Black Forest Labs',
    price: '$0.03 for the first megapixel, then per extra megapixel',
    // 1088x1920 is 2.09 MP; billed as $0.03 + $0.015 per extra MP, rounded up, so $0.075 is a ceiling.
    estUsd: () => 0.075,
    input: (text, seed) => ({ prompt: text, image_size: { width: 1088, height: 1920 }, output_format: 'png', seed, safety_tolerance: '2', enable_safety_checker: true }),
  },
  'seedream-4.5': {
    endpoint: 'fal-ai/bytedance/seedream/v4.5/text-to-image',
    maker: 'ByteDance',
    price: '$0.04 per image',
    estUsd: () => 0.04,
    // Seedream 4.5 needs at least 2560x1440 pixels in total.
    input: (text, seed) => ({ prompt: text, image_size: { width: 1440, height: 2560 }, num_images: 1, seed, enable_safety_checker: true }),
  },
};

export const DEFAULT_SHOTS = ['s1e3-sh05', 's1e3-sh12'];

export class BakeoffError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BakeoffError';
  }
}

export const bakeoffKey = (modelId, shot, take) => `keyframe:bakeoff:${modelId}:${shot}:${take}`;

/** The still prompt for one contract: the video compiler's words plus the forbidden list. */
export function stillPrompt(contract) {
  return `${prompt(contract)} Avoid: ${negatives(contract).join(', ')}.`;
}

/** Every take of the run, deterministically: same arguments give byte-identical inputs. */
export function planBakeoff(contracts, { models = Object.keys(KEYFRAME_MODELS), takes = 2 } = {}) {
  const out = [];
  for (const id of models) {
    const m = KEYFRAME_MODELS[id];
    if (!m) throw new BakeoffError(`unknown keyframe model "${id}"; known: ${Object.keys(KEYFRAME_MODELS).join(', ')}`);
    for (const contract of contracts) {
      const text = stillPrompt(contract);
      for (let take = 1; take <= takes; take++) {
        const seed = seedFor(contract.id, take);
        const input = m.input(text, seed);
        out.push({
          model: id, endpoint: m.endpoint, shot: contract.id, take, seed, estUsd: m.estUsd(), input,
          key: bakeoffKey(id, contract.id, take),
          inputHash: createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 16),
        });
      }
    }
  }
  return out;
}

/** Load and validate shot contracts by id; throws on the first invalid one. */
export function loadContracts(shots, { root = ROOT } = {}) {
  const canon = loadCanon();
  return shots.map((id) => {
    const chapter = id.split('-')[0];
    const contract = JSON.parse(readFileSync(join(root, 'content', chapter, 'shots', `${id}.json`), 'utf8'));
    const v = validateContract(contract, { resolveClaim: (c) => canon.resolve(c), revered: canon.revered() });
    if (!v.ok) throw new BakeoffError(`${id}: ${v.errors.map((e) => e.message).join('; ')}`);
    return contract;
  });
}

/**
 * Submit one take, poll it, download the image. Ledger row first; a take already done in the
 * ledger is skipped, so a re-run never double-bills. Never substitutes another model on failure.
 */
export async function runTake(t, { ledger, budget, fetch = globalThis.fetch, env = process.env, outDir, intervalMs = 3000, timeoutMs = 10 * 60000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const prior = ledger.latest(t.key);
  if (prior?.phase === 'done') return { skipped: true, file: join(ROOT, prior.path) };

  assertDataUse('fal', 'script');
  const apiKey = requireEnv('FAL_KEY', env);
  budget.reserve(t.estUsd, t.key);
  ledger.append({
    kind: 'keyframe', phase: 'intent', key: t.key, shot: t.shot, take: t.take, provider: 'fal', model: t.model,
    endpoint: t.endpoint, seed: t.seed, estUsd: t.estUsd, inputHash: t.inputHash, purpose: 'bakeoff',
  });
  const headers = { authorization: `Key ${apiKey}` };
  const fail = (error, extra = {}) => {
    budget.settle(t.estUsd, 0);
    ledger.append({ kind: 'keyframe', phase: 'failed', key: t.key, shot: t.shot, model: t.model, error: redact(String(error), env).slice(0, 500), ...extra });
    return new BakeoffError(`${t.model} ${t.shot} take ${t.take}: ${redact(String(error), env).slice(0, 300)}`);
  };

  const started = Date.now();
  let queued;
  try {
    const res = await fetch(`${QUEUE}/${t.endpoint}`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json', 'x-fal-object-lifecycle-preference': JSON.stringify({ expiration_duration_seconds: MEDIA_RETENTION_S }) },
      body: JSON.stringify(t.input),
    });
    const text = await res.text();
    if (!res.ok) throw fail(`fal queue returned ${res.status}: ${text}`, { status: res.status });
    queued = JSON.parse(text);
  } catch (err) {
    if (err instanceof BakeoffError) throw err;
    throw fail(`fal unreachable: ${err.message}`);
  }
  ledger.append({ kind: 'keyframe', phase: 'queued', key: t.key, shot: t.shot, model: t.model, requestId: queued.request_id });

  for (;;) {
    const s = await (await fetch(`${queued.status_url}?logs=0`, { headers })).json();
    if (s.status === 'COMPLETED') {
      if (s.error) throw fail(s.error, { errorType: s.error_type ?? null });
      break;
    }
    if (Date.now() - started > timeoutMs) throw fail(`still ${s.status} after ${timeoutMs / 60000} min`);
    await sleep(intervalMs);
  }
  const result = await (await fetch(queued.response_url, { headers })).json();
  const image = result.images?.[0];
  if (!image?.url) throw fail('fal result has no image url');
  const bytes = Buffer.from(await (await fetch(image.url)).arrayBuffer());
  const ext = (image.content_type ?? '').includes('jpeg') ? 'jpg' : 'png';
  mkdirSync(join(outDir, t.model), { recursive: true });
  const path = join(outDir, t.model, `${t.shot}.t${t.take}.${ext}`);
  writeFileSync(path, bytes);
  const row = ledger.append({
    kind: 'keyframe', phase: 'done', key: t.key, shot: t.shot, take: t.take, model: t.model, requestId: queued.request_id,
    ms: Date.now() - started, usd: t.estUsd, seed: result.seed ?? t.seed, width: image.width ?? null, height: image.height ?? null,
    bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), path: relative(ROOT, path),
  });
  return { file: path, ms: row.ms };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** A static contact sheet: one row per model, one column per take of each shot. */
export function contactSheet(plan, results, contracts, outDir) {
  const shots = contracts.map((c) => c.id);
  const models = [...new Set(plan.map((t) => t.model))];
  const cell = (t) => {
    const r = results.get(t.key);
    const img = r?.file ? `<img src="${esc(relative(outDir, r.file))}" alt="${esc(`${t.model} ${t.shot} take ${t.take}`)}">` : `<div class="miss">${esc(r?.error ?? 'not run')}</div>`;
    return `<figure>${img}<figcaption>${esc(t.shot)} · take ${t.take} · seed ${t.seed}${r?.ms ? ` · ${(r.ms / 1000).toFixed(0)} s` : ''}</figcaption></figure>`;
  };
  const rows = models.map((m) => `<section><h2>${esc(m)} <small>${esc(KEYFRAME_MODELS[m].maker)} · ${esc(KEYFRAME_MODELS[m].price)}</small></h2><div class="row">${shots.flatMap((s) => plan.filter((t) => t.model === m && t.shot === s).map(cell)).join('')}</div></section>`).join('\n');
  const prompts = contracts.map((c) => `<details><summary>${esc(c.id)} prompt</summary><p>${esc(stillPrompt(c))}</p></details>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Keyframe bake-off</title>
<style>body{margin:0;padding:24px;background:#0B0B0A;color:#F4F2EE;font:15px/1.45 system-ui,sans-serif}h1{font-size:24px;margin:0 0 8px}h2{font-size:18px;margin:28px 0 10px}small{color:#A8A399;font-weight:400}.row{display:flex;gap:12px;overflow-x:auto}figure{margin:0;flex:0 0 220px}img{width:220px;aspect-ratio:9/16;object-fit:cover;border-radius:8px;display:block;background:#1E1D1A}.miss{width:220px;aspect-ratio:9/16;border:1px dashed #6E6A62;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;color:#F0694A;font-size:13px}figcaption{font-size:12.5px;color:#A8A399;margin-top:6px}details{margin-top:16px;max-width:900px}p{color:#CFCAC0}</style></head>
<body><h1>Keyframe bake-off · ${esc(shots.join(', '))}</h1><p>Run ${esc(RUN_ID)}. Same compiled prompt per shot for every model; seeds fixed by shot and take.</p>${rows}${prompts}</body></html>`;
}

function args(argv) {
  const o = { shots: DEFAULT_SHOTS, takes: 2, models: Object.keys(KEYFRAME_MODELS), plan: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--shots') o.shots = argv[++i].split(',');
    else if (a === '--takes') o.takes = Number(argv[++i]);
    else if (a === '--models') o.models = argv[++i].split(',');
    else if (a === '--plan') o.plan = true;
    else throw new BakeoffError(`unknown argument ${a}; usage: pnpm bakeoff:keyframes [--shots a,b] [--takes N] [--models a,b] [--plan]`);
  }
  if (!(Number.isInteger(o.takes) && o.takes >= 1 && o.takes <= 4)) throw new BakeoffError('--takes must be 1 to 4');
  const chapters = new Set(o.shots.map((s) => s.split('-')[0]));
  if (chapters.size !== 1) throw new BakeoffError('all shots must come from one chapter (one ledger)');
  return o;
}

export async function run(argv = process.argv.slice(2), { fetch = globalThis.fetch, env = process.env, log = console.log, root = ROOT } = {}) {
  const o = args(argv);
  const contracts = loadContracts(o.shots, { root });
  const plan = planBakeoff(contracts, { models: o.models, takes: o.takes });
  const total = plan.reduce((s, t) => s + t.estUsd, 0);
  for (const t of plan) log(`${t.model.padEnd(16)} ${t.shot}  take ${t.take}  seed ${String(t.seed).padEnd(10)} $${t.estUsd.toFixed(3)}`);
  const cap = maxRunUsd(env);
  log(`${plan.length} takes: estimate $${total.toFixed(2)} of MAX_RUN_USD $${cap}`);
  if (total > cap) throw new BakeoffError(`run refused: estimate $${total.toFixed(2)} is over MAX_RUN_USD $${cap}`);
  if (o.plan) return { plan, total };

  requireEnv('FAL_KEY', env);
  const chapter = contracts[0].chapter;
  const ledger = new Ledger(join(root, 'content', chapter, 'ledger.jsonl'));
  const budget = new Budget(cap);
  const outDir = join(root, 'out', chapter, 'bakeoff');
  const results = new Map();
  // Takes run in parallel per model; a failed take is recorded and shown, never replaced.
  await Promise.all(o.models.map(async (m) => {
    for (const t of plan.filter((x) => x.model === m)) {
      try {
        const r = await runTake(t, { ledger, budget, fetch, env, outDir });
        results.set(t.key, r);
        log(`done   ${t.model} ${t.shot} take ${t.take}${r.skipped ? ' (already in ledger)' : ` in ${(r.ms / 1000).toFixed(0)} s`}`);
      } catch (err) {
        results.set(t.key, { error: err.message });
        log(`FAILED ${err.message}`);
      }
    }
  }));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), contactSheet(plan, results, contracts, outDir));
  log(`spent $${ledger.spentUsd().toFixed(3)} this run; contact sheet at ${relative(root, join(outDir, 'index.html'))}`);
  return { plan, results };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((err) => {
    console.error(`${err.name}: ${err.message}`);
    process.exit(1);
  });
}
