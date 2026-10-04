// M6 web track: the committed experiences in web/ are exactly what pnpm web:build makes from
// web/src and the canon, and every line they show carries a claim that resolves (rule 2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCanon } from '../src/canon/index.mjs';
import { buildWeb, dataFor } from '../scripts/build-web.mjs';
import { REVERED } from '../src/contract/rules.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const canon = loadCanon();
const built = buildWeb(canon);

test('every built experience in web/ matches its source and the canon (no drift)', () => {
  const sources = readdirSync(join(ROOT, 'web', 'src')).filter((f) => f.endsWith('.html')).sort();
  assert.deepEqual(Object.keys(built).sort(), sources);
  for (const [name, html] of Object.entries(built)) {
    assert.equal(readFileSync(join(ROOT, 'web', name), 'utf8'), html, `web/${name} is stale: run pnpm web:build`);
    assert.doesNotMatch(html, /\/\*@(include|data)/, `${name} has an unexpanded build marker`);
  }
});

test('the reveal module is shared: both experiences inline the same copy', () => {
  const shared = readFileSync(join(ROOT, 'web', 'shared', 'reveal-sheet.js'), 'utf8').trim();
  for (const name of ['lineage.html', 'mainaka.html']) assert.ok(built[name].includes(shared), name);
});

test('rule 2: every caption, reveal and question in a scripted experience names a claim', () => {
  const data = dataFor('mainaka', canon);
  const lines = [...Object.values(data.phases).flat(), data.question, ...data.reveals.map((r) => r.text)];
  for (const line of lines) {
    assert.ok(line.claims?.length, `no claim on: ${line.text.en}`);
    for (const id of line.claims) assert.ok(data.claims[id]?.adhyaya, `${id} is not carried in DATA`);
  }
  for (const r of data.reveals) assert.ok(r.popular.source.label, `${r.id}: the popular telling is labelled as such`);
});

test('rule 2: the lineage explorer carries every claim its people cite', () => {
  const data = dataFor('lineage', canon);
  const cited = new Set(data.people.flatMap((p) => JSON.stringify(p).match(/"(mbh|ram)\.[\d.-]+"/g) ?? []).map((s) => s.slice(1, -1)));
  assert.ok(cited.size > 0);
  for (const id of cited) assert.ok(data.claims[id], `${id} is cited but not carried`);
});

test('rule 2: every chakravyuha caption cite resolves to a registered claim', () => {
  const html = readFileSync(join(ROOT, 'web', 'chakravyuha.html'), 'utf8');
  const cites = [
    ...[...html.matchAll(/say\('(?:[^'\\]|\\.)*',\s*[\d.]+,\s*'([^']+)'\)/g)].map((m) => m[1]),
    ...[...html.matchAll(/\['(?:[^'\\]|\\.)*',\s*'([\d.,–\s]+)'\]/g)].map((m) => m[1]),
  ];
  assert.ok(cites.length >= 15, `found ${cites.length} cited captions`);
  for (const cite of cites) {
    for (const ref of cite.split(',').map((s) => s.trim().replace('–', '-'))) {
      assert.ok(canon.resolve(`mbh.${ref}`), `Mahābhārata ${ref} is not a registered claim`);
    }
  }
  const bare = [...html.matchAll(/say\('((?:[^'\\]|\\.)*)'(?:,\s*[\d.]+)?\)/g)].map((m) => m[1]);
  assert.deepEqual(bare, [], 'a caption with no cite');
});

test('rule 1: the Mainaka witness is not a revered figure, and the revered figures are flagged', () => {
  const data = dataFor('mainaka', canon);
  assert.ok(!REVERED.includes(data.witness), data.witness);
  for (const id of ['hanuman', 'vayu', 'samudra']) assert.ok(REVERED.includes(id), id);
});
