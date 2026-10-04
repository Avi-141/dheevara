import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { validateContract } from '../src/contract/validate.mjs';
import { MANDATORY_FORBIDDEN, WITNESSES } from '../src/contract/rules.mjs';
import { ROOT } from '../src/env.mjs';

const VALID = join(ROOT, 'test/fixtures/contracts/valid.json');
const base = () => JSON.parse(readFileSync(VALID, 'utf8'));
const variant = (change) => { const c = base(); change(c); return c; };
const messages = (r) => r.errors.map((e) => e.message).join('\n');

test('the fixture contract is valid', () => {
  const r = validateContract(base());
  assert.equal(r.ok, true, messages(r));
});

test('rule 1: the mandatory forbidden entries come from the schema', () => {
  assert.deepEqual(MANDATORY_FORBIDDEN, ['deity_face_closeup', 'pov_inside_deity']);
});

for (const token of ['deity_face_closeup', 'pov_inside_deity']) {
  test(`rule 1: a contract without "${token}" in forbidden fails`, () => {
    const r = validateContract(variant((c) => { c.forbidden = c.forbidden.filter((f) => f !== token); }));
    assert.equal(r.ok, false);
    assert.match(messages(r), new RegExp(`/forbidden must include "${token}" \\(rule 1\\)`));
  });
}

test('rule 1: a revered figure cannot be the witness', () => {
  const r = validateContract(variant((c) => { c.witness = 'krishna'; }));
  assert.equal(r.ok, false);
  assert.match(messages(r), /\/witness is "krishna"; it must be one of sanjaya, vanara, charioteer \(rule 1\)/);
  assert.ok(!WITNESSES.includes('krishna'));
});

test('rule 1: a close framing on a revered figure fails; a wide one passes', () => {
  const close = validateContract(variant((c) => { c.camera.framing = 'close'; c.references.push('char.krishna'); }));
  assert.equal(close.ok, false);
  assert.match(messages(close), /facial close-up of a revered figure \(rule 1\)/);
  const wide = validateContract(variant((c) => { c.references.push('char.krishna'); }));
  assert.equal(wide.ok, true, messages(wide));
});

test('rule 2: a contract with no claims fails', () => {
  const r = validateContract(variant((c) => { c.claims = []; }));
  assert.equal(r.ok, false);
  assert.match(messages(r), /\/claims must NOT have fewer than 1 items \(rule 2\)/);
});

test('rule 2: a malformed claim id fails', () => {
  const r = validateContract(variant((c) => { c.claims = ['Drona Parva 34']; }));
  assert.equal(r.ok, false);
  assert.match(messages(r), /\/claims\/0 "Drona Parva 34" does not match .* \(rule 2\)/);
});

test('rule 2: claim ids are checked against the canon when a resolver is given', () => {
  const known = new Set(['mbh.7.33']);
  assert.equal(validateContract(base(), { resolveClaim: (id) => known.has(id) }).ok, true);
  const r = validateContract(variant((c) => { c.claims.push('mbh.7.99.1'); }), { resolveClaim: (id) => known.has(id) });
  assert.equal(r.ok, false);
  assert.match(messages(r), /"mbh.7.99.1" does not resolve to a passage in the canon \(rule 2\)/);
});

test('rule 4: territory must be worldwide or india_only', () => {
  const r = validateContract(variant((c) => { c.territory = 'global'; }));
  assert.equal(r.ok, false);
  assert.match(messages(r), /\/territory is "global"; it must be one of worldwide, india_only \(rule 4\)/);
});

test('rule 6: quality must be draft or final', () => {
  const r = validateContract(variant((c) => { c.quality = '4k'; }));
  assert.equal(r.ok, false);
  assert.match(messages(r), /\(rule 6\)/);
});

test('unknown fields, a missing field and a too-long shot fail with readable errors', () => {
  const r = validateContract(variant((c) => { c.lens = 35; delete c.blocking; c.durationS = 30; }));
  assert.equal(r.ok, false);
  const text = messages(r);
  assert.match(text, /has an unknown field "lens"/);
  assert.match(text, /is missing "blocking"/);
  assert.match(text, /\/durationS must be <= 15/);
});

test('a shot id must belong to its chapter', () => {
  const r = validateContract(variant((c) => { c.id = 's1e4-sh01'; }));
  assert.equal(r.ok, false);
  assert.match(messages(r), /\/id "s1e4-sh01" does not belong to chapter "s1e3"/);
});

test('the CLI passes a valid file and fails an invalid one with exit code 1', () => {
  const cli = join(ROOT, 'src/contract/cli.mjs');
  const out = execFileSync(process.execPath, [cli, VALID], { encoding: 'utf8' });
  assert.match(out, /1 of 1 contracts valid/);

  const dir = mkdtempSync(join(tmpdir(), 'contract-'));
  const bad = join(dir, 'bad.json');
  writeFileSync(bad, JSON.stringify(variant((c) => { c.forbidden = []; })));
  const res = spawnSync(process.execPath, [cli, VALID, bad], { encoding: 'utf8' });
  assert.equal(res.status, 1);
  assert.match(res.stdout, /FAIL .*bad\.json/);
  assert.match(res.stdout, /must include "deity_face_closeup" \(rule 1\)/);
  assert.match(res.stdout, /1 of 2 contracts valid/);

  const missing = spawnSync(process.execPath, [cli, join(dir, 'nope.json')], { encoding: 'utf8' });
  assert.equal(missing.status, 1);
  assert.match(missing.stdout, /file not found/);
});

test('rule 1 and style bible section 7: no framing closer than medium_wide on a person', () => {
  const medium = validateContract(variant((c) => { c.camera.framing = 'medium'; c.references.push('char.abhimanyu'); }));
  assert.equal(medium.ok, false);
  assert.match(messages(medium), /medium_wide is the closest framing on a person \(style bible section 7\) \(rule 1\)/);
  const mw = validateContract(variant((c) => { c.camera.framing = 'medium_wide'; c.references.push('char.abhimanyu'); }));
  assert.equal(mw.ok, true, messages(mw));
  const insert = validateContract(variant((c) => { c.camera.framing = 'medium'; c.references = ['obj.chariot_wheel', 'style.relief_lamp']; }));
  assert.equal(insert.ok, true, 'an object may be framed close');
});
