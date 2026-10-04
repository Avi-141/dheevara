// P: the s1e3 plan holds together. Beats tile the chapter, every shot contract is placed once in
// the beat it names, every narration line is placed once and finishes inside its beat, a line's
// claims are depicted by its beat's shots, and the committed manifest is current and valid.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../src/env.mjs';
import { loadCanon } from '../src/canon/index.mjs';
import { validateFile } from '../src/contract/validate.mjs';
import { validateManifest } from '../src/canon/manifest.mjs';
import { loadPlan, timeline, buildManifest } from '../src/plan/manifest.mjs';

const canon = loadCanon();
const plan = loadPlan('s1e3');
const { beats } = plan.beats;

test('s1e3 beats tile the chapter in the fixed grammar, inside 90–120 s', () => {
  assert.deepEqual(beats.map((b) => b.kind), ['cold_open', 'verse', 'scene', 'reveal', 'question']);
  let t = 0;
  for (const b of beats) { assert.equal(b.startMs, t, b.kind); t = b.endMs; }
  assert.equal(t, plan.beats.durationMs);
  assert.ok(t >= 90000 && t <= 120000);
  const cold = beats[0].endMs - beats[0].startMs;
  assert.ok(cold >= 5000 && cold <= 8000, 'cold open is 5–8 s (decision of 3 Oct)');
});

test('each beat is filled exactly by its shots (plus any end hold); the verse beat has no video', () => {
  for (const b of beats.filter((x) => x.kind !== 'verse')) {
    const shots = b.shots.reduce((s, { id }) => s + plan.shots.get(id).durationS * 1000, 0);
    assert.equal(shots + (b.holdMs ?? 0), b.endMs - b.startMs, b.kind);
  }
  assert.equal(beats.find((b) => b.kind === 'verse').shots.length, 0);
});

test('every shot contract is placed once, in the beat it names, and is valid against the canon', () => {
  const files = readdirSync(join(ROOT, 'content/s1e3/shots')).filter((f) => f.endsWith('.json'));
  const placed = beats.flatMap((b) => b.shots.map((s) => [s.id, b.kind]));
  assert.equal(placed.length, files.length);
  assert.equal(new Set(placed.map(([id]) => id)).size, placed.length, 'no shot placed twice');
  for (const [id, kind] of placed) assert.equal(plan.shots.get(id).beat, kind, id);
  for (const f of files) {
    const r = validateFile(join(ROOT, 'content/s1e3/shots', f), { resolveClaim: (id) => canon.resolve(id), revered: canon.revered() });
    assert.equal(r.ok, true, `${f}: ${r.errors.map((e) => e.message).join('; ')}`);
  }
});

test('every narration line is placed once and finishes inside its beat in every language', () => {
  const ids = ['n00-disclosure', ...plan.narration.lines.map((l) => l.id)];
  const placed = beats.flatMap((b) => b.shots.flatMap((s) => s.lines));
  assert.deepEqual([...placed].sort(), [...ids].sort());
  const { lines } = timeline(plan);
  for (const x of lines) {
    const beat = beats.find((b) => b.shots.some((s) => s.id === x.shot));
    assert.ok(x.endMs <= beat.endMs - (beat.holdMs ?? 0), `${x.line.id} ends at ${x.endMs}, after its beat ends at ${beat.endMs}`);
  }
});

test("rule 2: a line's claims are depicted by the shots of its beat", () => {
  for (const b of beats) {
    const shown = new Set(b.shots.flatMap(({ id }) => plan.shots.get(id).claims));
    for (const { lines } of b.shots) {
      for (const id of lines) {
        const line = plan.narration.lines.find((l) => l.id === id);
        for (const c of line?.claims ?? []) assert.ok(shown.has(c), `${id} cites ${c}, which no ${b.kind} shot depicts`);
      }
    }
  }
});

test('the committed manifest is current (pnpm manifest s1e3) and valid against the canon', () => {
  const committed = JSON.parse(readFileSync(join(ROOT, 'content/s1e3/manifest.json'), 'utf8'));
  assert.deepEqual(committed, JSON.parse(JSON.stringify(buildManifest('s1e3', canon))));
  const r = validateManifest(committed, { canon });
  assert.equal(r.ok, true, r.errors.join('\n'));
  assert.equal(committed.media.video.status, 'pending', 'no media is invented');
  assert.equal(committed.provenance.signOff, null, 'no sign-off until a scholar signs (rule 9)');
});
