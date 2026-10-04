// M2 without a key: the registry cites its research, routing follows the Build Brief, compilation
// is deterministic, and submit enforces rules 3, 4 and 6, the spend cap and idempotency before any
// request. fal is replaced by a recording fetch here only; without FAL_KEY the pipeline stops.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateKeyPairSync, sign, createHash } from 'node:crypto';
import { ROOT } from '../src/env.mjs';
import { MODELS, model, billedDuration, estimateUsd } from '../src/render/models.mjs';
import { route, assertTerritory, territoryBreaches, TerritoryError } from '../src/render/route.mjs';
import { compile, negatives, seedFor, CompileError } from '../src/compile/index.mjs';
import { submit, collect, approvalFor, SubmitError } from '../src/render/submit.mjs';
import { verifyWebhook } from '../src/render/webhook.mjs';
import { summarise, percentile } from '../src/render/report.mjs';
import { planChapter } from '../src/render/cli.mjs';
import { Ledger, Budget, BudgetError } from '../src/ledger/ledger.mjs';

const contract = (id = 's1e3-sh01') => JSON.parse(readFileSync(join(ROOT, 'content/s1e3/shots', `${id}.json`), 'utf8'));
const env = { FAL_KEY: 'fake-fal-123' }; // under 16 characters: the secret scan's assignment rule ignores it

test('every model in the registry cites a row in docs/research/fal.md (M0.5 acceptance)', () => {
  const research = readFileSync(join(ROOT, 'docs/research/fal.md'), 'utf8');
  for (const [id, m] of Object.entries(MODELS)) {
    assert.match(m.research, /^docs\/research\/fal\.md/, id);
    if (m.endpoint) assert.ok(research.includes('`' + m.endpoint + '`'), `${id}: ${m.endpoint} is not in docs/research/fal.md`);
    for (const field of ['licence', 'territory', 'usdPerSecond', 'durations']) assert.ok(m[field], `${id} has no ${field}`);
  }
});

test('rule 4: every MiniMax H3 endpoint is india_only, and a worldwide contract routed to one throws', () => {
  for (const [id, m] of Object.entries(MODELS)) if (m.family === 'minimax-h3') assert.equal(m.territory, 'india_only', id);
  const c = contract('s1e3-sh05');
  assert.throws(() => route(c, { override: 'h3-selfhost' }), (err) => err instanceof TerritoryError && /rule 4/.test(err.message));
  assert.throws(() => route(c, { override: 'h3-lora-r2v' }), TerritoryError);
  assert.doesNotThrow(() => assertTerritory({ ...c, territory: 'india_only' }, model('h3-lora-r2v')));
});

test('routing follows the Build Brief: premium beats to Kling, the rest to Wan at 480p', () => {
  const kinds = {};
  for (const f of readdirSync(join(ROOT, 'content/s1e3/shots'))) {
    const c = JSON.parse(readFileSync(join(ROOT, 'content/s1e3/shots', f), 'utf8'));
    kinds[c.retention] ??= new Set();
    kinds[c.retention].add(route(c).id);
  }
  for (const r of ['hook', 'reveal', 'cliffhanger']) assert.deepEqual([...kinds[r]], ['kling-v3-standard-t2v'], r);
  for (const r of ['stakes', 'connective']) assert.deepEqual([...kinds[r]], ['wan-3.0-t2v'], r);
  assert.equal(route(contract(), { quality: 'final' }).id, 'kling-v3-pro-t2v');
  assert.equal(route(contract('s1e3-sh05'), { referenceImageUrls: ['https://example.invalid/a.png'] }).id, 'wan-3.0-r2v');
});

test('compilation is deterministic and carries rule 1 into the negative prompt', () => {
  const c = contract();
  const m = route(c);
  const a = compile(c, m);
  const b = compile(JSON.parse(JSON.stringify(c)), m);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.match(a.input.negative_prompt, /close-up of a deity's face/);
  assert.match(a.input.negative_prompt, /point of view of a deity/);
  assert.match(a.input.prompt, /dark basalt/);
  assert.match(a.input.prompt, /as if by divine sight/);
  assert.equal(a.input.generate_audio, false, 'our audio is Sarvam and Vāgdhenu, never the video model');
  const w = compile(contract('s1e3-sh05'), model('wan-3.0-t2v'));
  assert.equal(w.input.resolution, '480p');
  assert.match(w.input.prompt, /Avoid: .*close-up of a deity's face/, 'models without a negative field get an Avoid sentence');
  assert.equal(w.seed, seedFor('s1e3-sh05', 1));
  assert.notEqual(compile(contract('s1e3-sh05'), model('wan-3.0-t2v'), { attempt: 2 }).seed, w.seed, 'a retry is a new take');
});

test('the compiled s1e3 cold open matches its reviewed golden payload', () => {
  const golden = JSON.parse(readFileSync(join(ROOT, 'test/fixtures/compile/s1e3-sh01.draft.json'), 'utf8'));
  assert.deepEqual(compile(contract(), route(contract())), golden);
});

test('an unknown forbidden token, a missing LoRA or missing references stop compilation', () => {
  assert.throws(() => negatives({ ...contract(), forbidden: [...contract().forbidden, 'dragons'] }), /"dragons" has no phrase/);
  const india = { ...contract('s1e3-sh05'), territory: 'india_only' };
  assert.throws(() => compile(india, model('h3-lora-r2v')), (err) => err instanceof CompileError && /needs a trained style LoRA/.test(err.message));
  assert.throws(() => compile(contract('s1e3-sh05'), model('wan-3.0-r2v')), /needs reference images/);
  assert.throws(() => compile(india, model('h3-selfhost')), /unavailable/);
});

test('durations bill to the model and the s1e3 draft pass fits under $15', () => {
  assert.equal(billedDuration(model('ltx-2.5-t2v-fast'), 5), 6);
  assert.equal(billedDuration(model('kling-v3-standard-t2v'), 2), 3);
  assert.throws(() => billedDuration(model('kling-v3-standard-t2v'), 16), /longest take/);
  assert.equal(estimateUsd(model('wan-3.0-t2v'), 6, '480p'), 0.3);
  const plan = planChapter('s1e3');
  assert.equal(plan.length, 13);
  const total = plan.reduce((s, p) => s + p.compiled.estUsd, 0);
  assert.ok(total < 15, `draft estimate $${total}`);
  assert.ok(plan.every((p) => p.compiled.territory === 'worldwide'));
});

function rig() {
  const dir = mkdtempSync(join(tmpdir(), 'render-'));
  const ledgerPath = join(dir, 'ledger.jsonl');
  const calls = [];
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init, rows: existsSync(ledgerPath) ? readFileSync(ledgerPath, 'utf8').trim().split('\n').length : 0 });
    const u = String(url);
    if (u.startsWith('https://queue.fal.run/') && init.method === 'POST') {
      return Response.json({ request_id: 'req-1', status_url: 'https://queue.fal.run/x/requests/req-1/status', response_url: 'https://queue.fal.run/x/requests/req-1' });
    }
    if (u.includes('/status')) return Response.json({ status: 'COMPLETED' });
    if (u.endsWith('/requests/req-1')) return Response.json({ video: { url: 'https://v3.fal.media/files/x.mp4' }, seed: 7 });
    return new Response(Buffer.from('fake-mp4'));
  };
  return { dir, ledgerPath, ledger: new Ledger(ledgerPath), budget: new Budget(15), fetch, calls };
}

test('rule 3: the ledger row is flushed before fal sees the request; a re-run of the same take is skipped', async () => {
  const { dir, ledger, budget, fetch, calls } = rig();
  const c = contract('s1e3-sh05');
  const q = await submit(c, { ledger, budget, fetch, env, root: dir });
  assert.equal(calls[0].url, 'https://queue.fal.run/alibaba/wan-3.0/text-to-video');
  assert.equal(calls[0].init.headers.authorization, 'Key ' + env.FAL_KEY);
  assert.equal(calls[0].rows, 1, 'intent row on disk before the request');
  const intent = ledger.rows()[0];
  for (const f of ['model', 'seed', 'licence', 'territory', 'attempt', 'estUsd']) assert.ok(intent[f] !== undefined, `intent row has ${f}`);
  const again = await submit(c, { ledger, budget, fetch, env, root: dir });
  assert.match(again.skipped, /render:s1e3-sh05:1 already queued/);
  assert.equal(calls.length, 1, 'no double billing');
  const got = await collect(q, { ledger, budget, fetch, env, outDir: join(dir, 'out'), sleep: async () => {} });
  assert.ok(existsSync(got.path));
  assert.deepEqual(ledger.rows().map((r) => r.phase), ['intent', 'queued', 'done']);
  assert.equal(territoryBreaches(ledger.rows()).length, 0);
});

test('rule 6: a final render without a human approval record is refused before any request', async () => {
  const { dir, ledger, budget, fetch, calls } = rig();
  const c = contract('s1e3-sh05');
  await assert.rejects(submit(c, { quality: 'final', ledger, budget, fetch, env, root: dir }), (err) => err instanceof SubmitError && /rule 6/.test(err.message));
  assert.equal(calls.length, 0);
  mkdirSync(join(dir, 'content/s1e3/approvals'), { recursive: true });
  writeFileSync(join(dir, 'content/s1e3/approvals/s1e3-sh05.json'), JSON.stringify({ shot: 's1e3-sh05', quality: 'final', by: 'Avi Solanki', date: '2026-10-04' }));
  assert.ok(approvalFor(c, { root: dir }));
  await submit(c, { quality: 'final', ledger, budget, fetch, env, root: dir });
  assert.equal(calls.length, 1);
});

test('the spend cap and a missing FAL_KEY both stop a take before any request', async () => {
  const { dir, ledger, fetch, calls } = rig();
  await assert.rejects(submit(contract(), { ledger, budget: new Budget(0.1), fetch, env, root: dir }), BudgetError);
  await assert.rejects(submit(contract(), { ledger, budget: new Budget(15), fetch, env: {}, root: dir }), /FAL_KEY is not set/);
  assert.equal(calls.length, 0);
  assert.equal(ledger.rows().length, 0);
});

test('webhook signatures verify against the JWKS, and tampering or stale timestamps fail', () => {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const jwks = { keys: [publicKey.export({ format: 'jwk' })] };
  const rawBody = Buffer.from(JSON.stringify({ request_id: 'r', status: 'OK', payload: {} }));
  const now = 1_800_000_000;
  const msg = ['r', 'u', String(now), createHash('sha256').update(rawBody).digest('hex')].join('\n');
  const headers = {
    'x-fal-webhook-request-id': 'r', 'x-fal-webhook-user-id': 'u', 'x-fal-webhook-timestamp': String(now),
    'x-fal-webhook-signature': sign(null, Buffer.from(msg), privateKey).toString('hex'),
  };
  assert.deepEqual(verifyWebhook({ headers, rawBody, jwks, nowS: now }), { ok: true });
  assert.equal(verifyWebhook({ headers, rawBody: Buffer.from('{}'), jwks, nowS: now }).ok, false);
  assert.match(verifyWebhook({ headers, rawBody, jwks, nowS: now + 301 }).reason, /300 s window/);
});

test('the report sums cost per shot and beat, measures latency, and audits territory', () => {
  const rows = [
    { kind: 'render', phase: 'intent', key: 'k1', shot: 'a', beat: 'scene', model: 'wan-3.0-t2v', contractTerritory: 'worldwide' },
    { kind: 'render', phase: 'done', key: 'k1', shot: 'a', usd: 0.3, queueMs: 1000 },
    { kind: 'render', phase: 'intent', key: 'k2', shot: 'b', beat: 'scene', model: 'h3-lora-r2v', contractTerritory: 'worldwide' },
    { kind: 'voice', phase: 'done', key: 'v', usd: 0.01, ms: 1500 },
  ];
  const s = summarise(rows);
  assert.equal(s.byShot.a, 0.3);
  assert.equal(s.byBeat.scene, 0.3);
  assert.equal(s.latency.render.p50, 1000);
  assert.equal(s.territoryBreaches.length, 1, 'a worldwide contract on an india_only model is a breach');
  assert.equal(percentile([1, 2, 3, 4, 100], 95), 100);
});
