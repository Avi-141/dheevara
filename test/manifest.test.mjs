// The chapter manifest is the contract with the app: shape by schema, and in code the beat timing,
// references, and rule 2 (every referenced claim is in the claims map and resolves in the canon).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateManifest } from '../src/canon/manifest.mjs';
import { loadCanon } from '../src/canon/index.mjs';
import { ROOT } from '../src/env.mjs';
import { WITNESSES } from '../src/contract/rules.mjs';

const canon = loadCanon();
const base = () => JSON.parse(readFileSync(join(ROOT, 'test/fixtures/manifest/valid.json'), 'utf8'));
const variant = (change) => { const m = base(); change(m); return m; };
const text = (r) => r.errors.join('\n');

test('the fixture manifest is valid against the schema and the canon', () => {
  const r = validateManifest(base(), { canon });
  assert.equal(r.ok, true, text(r));
});

test('rule 2: a claim referenced but missing from the claims map fails', () => {
  const r = validateManifest(variant((m) => { delete m.claims['mbh.1.213.65']; }), { canon });
  assert.equal(r.ok, false);
  assert.match(text(r), /\/reveals\/0\/text\/claims: claim mbh.1.213.65 is referenced but missing from the top-level claims map \(rule 2\)/);
});

test('rule 2: a claim in the map that does not resolve in the canon fails', () => {
  const r = validateManifest(variant((m) => {
    m.captions[0].claims = ['mbh.7.34.30'];
    m.claims['mbh.7.34.30'] = { book: 7, adhyaya: 34, verse: 30, edition: 'BORI CE', status: 'etext' };
  }), { canon });
  assert.match(text(r), /\/claims\/mbh.7.34.30 does not resolve in the canon \(rule 2\)/);
});

test('a caption without a claim fails the schema', () => {
  const r = validateManifest(variant((m) => { m.captions[0].claims = []; }));
  assert.equal(r.ok, false);
  assert.match(text(r), /\/captions\/0\/claims must NOT have fewer than 1 items/);
});

test('beats must be contiguous, start with the cold open and end at durationMs', () => {
  assert.match(text(validateManifest(variant((m) => { m.beats[2].startMs = 27000; }))), /starts at 27000, expected 26000/);
  assert.match(text(validateManifest(variant((m) => { m.durationMs = 117000; }))), /beats end at 116000, but durationMs is 117000/);
  assert.match(text(validateManifest(variant((m) => { [m.beats[0], m.beats[1]] = [m.beats[1], m.beats[0]]; }))), /must be the cold open/);
  assert.match(text(validateManifest(variant((m) => { delete m.beats[3].reveal; }))), /reveal beat with no reveal/);
  assert.match(text(validateManifest(variant((m) => { m.beats[3].reveal = 'nope'; }))), /"nope" is not in reveals/);
});

test('a chapter outside 90–120 s fails', () => {
  const r = validateManifest(variant((m) => { m.durationMs = 60000; m.beats.at(-1).endMs = 60000; m.beats.at(-1).startMs = 50000; m.beats[3].endMs = 50000; }));
  assert.match(text(r), /outside 90000–120000/);
});

test('rule 1: the manifest witness list is the shot contract witness list', () => {
  const schema = JSON.parse(readFileSync(join(ROOT, 'schema/chapter-manifest.schema.json'), 'utf8'));
  assert.deepEqual(schema.properties.witness.enum, WITNESSES);
});

test('the AI label cannot be turned off', () => {
  const r = validateManifest(variant((m) => { m.provenance.aiLabel = false; }));
  assert.equal(r.ok, false);
});
