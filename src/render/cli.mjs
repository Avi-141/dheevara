// pnpm render <chapter> [--quality draft|final] [--plan] [--attempt N]
// Routes and compiles every shot contract of a chapter, prints the plan and the run's estimate,
// and refuses the whole run if the estimate passes MAX_RUN_USD. --plan stops there (no key needed).
// Otherwise every take is submitted (ledger first) and collected by polling fal's queue. Without
// FAL_KEY it stops before the first request.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, maxRunUsd, requireEnv } from '../env.mjs';
import { Ledger, Budget, RUN_ID } from '../ledger/ledger.mjs';
import { loadCanon } from '../canon/index.mjs';
import { validateContract } from '../contract/validate.mjs';
import { route } from './route.mjs';
import { compile } from '../compile/index.mjs';
import { submit, collect } from './submit.mjs';

function args(argv) {
  const o = { chapter: null, quality: 'draft', plan: false, attempt: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--quality') o.quality = argv[++i];
    else if (a === '--plan') o.plan = true;
    else if (a === '--attempt') o.attempt = Number(argv[++i]);
    else if (!o.chapter) o.chapter = a;
    else throw new Error(`unknown argument ${a}`);
  }
  if (!o.chapter || !['draft', 'final'].includes(o.quality)) throw new Error('usage: pnpm render <chapter> [--quality draft|final] [--plan] [--attempt N]');
  return o;
}

/** Route and compile every contract; throws on the first invalid contract or rule breach. */
export function planChapter(chapter, { quality = 'draft', attempt = 1 } = {}) {
  const dir = join(ROOT, 'content', chapter, 'shots');
  const canon = loadCanon();
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const contract = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const v = validateContract(contract, { resolveClaim: (id) => canon.resolve(id), revered: canon.revered() });
    if (!v.ok) throw new Error(`${f}: ${v.errors.map((e) => e.message).join('; ')}`);
    const m = route(contract, { quality });
    return { contract, compiled: compile(contract, m, { attempt, quality }) };
  });
}

export async function run(argv = process.argv.slice(2), { fetch = globalThis.fetch, env = process.env, log = console.log } = {}) {
  const o = args(argv);
  const plan = planChapter(o.chapter, { quality: o.quality, attempt: o.attempt });
  const total = plan.reduce((s, p) => s + p.compiled.estUsd, 0);
  for (const { contract, compiled: c } of plan) {
    log(`${c.shot}  ${contract.beat.padEnd(9)} ${contract.retention.padEnd(11)} ${c.model.padEnd(22)} ${String(c.resolution ?? '-').padEnd(5)} ${String(c.billedS).padStart(2)} s  seed ${String(c.seed ?? '-').padEnd(10)} $${c.estUsd.toFixed(3)}  ${c.territory}`);
  }
  const cap = maxRunUsd(env);
  log(`${plan.length} shots, ${o.quality}, attempt ${o.attempt}: estimate $${total.toFixed(2)} of MAX_RUN_USD $${cap}`);
  if (total > cap) throw new Error(`run refused: estimate $${total.toFixed(2)} is over MAX_RUN_USD $${cap}`);
  if (o.plan) return { plan, total };

  requireEnv('FAL_KEY', env);
  const ledger = new Ledger(join(ROOT, 'content', o.chapter, 'ledger.jsonl'));
  const budget = new Budget(cap);
  const outDir = join(ROOT, 'out', o.chapter, 'renders', o.quality);
  for (const { contract } of plan) {
    const queued = await submit(contract, { attempt: o.attempt, quality: o.quality, ledger, budget, fetch, env });
    if (queued.skipped) { log(`skip  ${queued.skipped}`); continue; }
    const { path } = await collect(queued, { ledger, budget, fetch, env, outDir });
    log(`done  ${contract.id}  ${path}`);
  }
  log(`run ${RUN_ID}: spent $${ledger.spentUsd().toFixed(2)}`);
  return { plan, total };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  run().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
