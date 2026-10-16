// The keyframe bake-off without a key: plans are deterministic, every take writes its ledger row
// before the request, a done take is never re-billed, the cap and FAL_KEY stop the run, and a
// failed take is recorded rather than replaced. fal is replaced by a recording fetch here only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { KEYFRAME_MODELS, planBakeoff, loadContracts, runTake, stillPrompt, contactSheet, run, BakeoffError } from '../src/keyframe/bakeoff.mjs';
import { Ledger, Budget, BudgetError } from '../src/ledger/ledger.mjs';

const contracts = () => loadContracts(['s1e3-sh05', 's1e3-sh12']);
const env = { FAL_KEY: 'fake-fal-123', MAX_RUN_USD: '5' }; // under 16 characters: the secret scan's assignment rule ignores it

test('the plan is deterministic, 9:16 and carries the forbidden list', () => {
  const a = planBakeoff(contracts());
  const b = planBakeoff(contracts());
  assert.deepEqual(a, b);
  assert.equal(a.length, Object.keys(KEYFRAME_MODELS).length * 2 * 2);
  assert.equal(new Set(a.map((t) => t.key)).size, a.length);
  for (const t of a) {
    assert.match(t.input.prompt, /Avoid: .*deity face/);
    const size = t.input.image_size;
    if (size) assert.equal(Math.round((size.width / size.height) * 16), 9);
    else assert.equal(t.input.aspect_ratio, '9:16');
  }
  // Same shot and take give the same seed on every model, so the models face the same draw.
  const seeds = (m) => a.filter((t) => t.model === m).map((t) => t.seed);
  assert.deepEqual(seeds('nano-banana-pro'), seeds('seedream-4.5'));
  assert.ok(a.reduce((s, t) => s + t.estUsd, 0) < 1.5);
});

test('every model gets the identical prompt for a shot', () => {
  const [sh05] = contracts();
  const p = stillPrompt(sh05);
  for (const t of planBakeoff([sh05])) assert.equal(t.input.prompt, p);
});

test('unknown model is refused', () => {
  assert.throws(() => planBakeoff(contracts(), { models: ['midjourney'] }), BakeoffError);
});

function rig({ fail = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'keyframe-'));
  const ledgerPath = join(dir, 'ledger.jsonl');
  const calls = [];
  const fetch = async (url, init = {}) => {
    const u = String(url);
    calls.push({ url: u, method: init.method ?? 'GET', rows: existsSync(ledgerPath) ? readFileSync(ledgerPath, 'utf8').trim().split('\n').length : 0 });
    if (u.startsWith('https://queue.fal.run/') && init.method === 'POST') {
      return Response.json({ request_id: 'req-1', status_url: 'https://queue.fal.run/x/requests/req-1/status', response_url: 'https://queue.fal.run/x/requests/req-1' });
    }
    if (u.includes('/status')) return Response.json(fail ? { status: 'COMPLETED', error: 'content policy' } : { status: 'COMPLETED' });
    if (u.endsWith('/requests/req-1')) return Response.json({ images: [{ url: 'https://v3.fal.media/files/x.png', content_type: 'image/png', width: 1088, height: 1920 }], seed: 7 });
    return new Response(Buffer.from('fake-png'));
  };
  return { dir, ledgerPath, ledger: new Ledger(ledgerPath), budget: new Budget(5), fetch, calls };
}

test('the ledger row is flushed before the request, and a done take is not re-billed', async () => {
  const { dir, ledger, budget, fetch, calls } = rig();
  const [t] = planBakeoff(contracts());
  const r = await runTake(t, { ledger, budget, fetch, env, outDir: join(dir, 'out'), sleep: async () => {} });
  const post = calls.find((c) => c.method === 'POST');
  assert.equal(post.rows, 1, 'intent row written before the POST');
  assert.ok(existsSync(r.file));
  const phases = ledger.rows().map((x) => x.phase);
  assert.deepEqual(phases, ['intent', 'queued', 'done']);
  assert.match(ledger.rows()[2].sha256, /^[0-9a-f]{64}$/);

  const before = calls.length;
  const again = await runTake(t, { ledger, budget, fetch, env, outDir: join(dir, 'out') });
  assert.equal(again.skipped, true);
  assert.equal(calls.length, before, 'no request for a take already done');
});

test('a failed take is recorded and thrown, never replaced', async () => {
  const { dir, ledger, budget, fetch } = rig({ fail: true });
  const [t] = planBakeoff(contracts());
  await assert.rejects(runTake(t, { ledger, budget, fetch, env, outDir: join(dir, 'out'), sleep: async () => {} }), BakeoffError);
  assert.equal(ledger.rows().at(-1).phase, 'failed');
  assert.equal(budget.committedUsd, 0);
});

test('without FAL_KEY or over the cap, nothing is requested', async () => {
  const { dir, ledger, fetch, calls } = rig();
  const [t] = planBakeoff(contracts());
  await assert.rejects(runTake(t, { ledger, budget: new Budget(5), fetch, env: {}, outDir: join(dir, 'out') }), /FAL_KEY is not set/);
  await assert.rejects(runTake(t, { ledger, budget: new Budget(0.01), fetch, env, outDir: join(dir, 'out') }), BudgetError);
  assert.equal(calls.length, 0);
  await assert.rejects(run([], { fetch, env: { MAX_RUN_USD: '0.5', FAL_KEY: 'x' }, log: () => {} }), /over MAX_RUN_USD/);
  assert.equal(calls.length, 0);
});

test('the contact sheet links each image relative to the sheet and shows failures', () => {
  const cs = contracts();
  const plan = planBakeoff(cs, { models: ['seedream-4.5'], takes: 1 });
  const results = new Map([[plan[0].key, { file: '/x/out/s1e3/bakeoff/seedream-4.5/s1e3-sh05.t1.png', ms: 9000 }], [plan[1].key, { error: 'content policy' }]]);
  const html = contactSheet(plan, results, cs, '/x/out/s1e3/bakeoff');
  assert.match(html, /src="seedream-4\.5\/s1e3-sh05\.t1\.png"/);
  assert.match(html, /content policy/);
});
