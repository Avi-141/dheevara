// M5 canon v0: claim ids resolve to book, adhyāya and verse in the critical edition's verse index;
// an unresolvable id fails (rule 2); committed passages are consistent with their e-text form.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadCanon, parseClaimId, checkRef, CanonError, CANON_DIR } from '../src/canon/index.mjs';
import { claimUses, unresolved } from '../src/canon/claims-used.mjs';
import { iastToDevanagari } from '../src/canon/translit.mjs';
import { REVERED } from '../src/contract/rules.mjs';

const canon = loadCanon();

test('claim ids parse into verse, verse range, adhyāya and adhyāya range', () => {
  assert.deepEqual(parseClaimId('mbh.7.34.19'), { text: 'mbh', book: 7, adhyaya: 34, verse: 19 });
  assert.deepEqual(parseClaimId('mbh.7.34.17-21'), { text: 'mbh', book: 7, adhyaya: 34, verse: 17, verseEnd: 21 });
  assert.deepEqual(parseClaimId('mbh.7.33'), { text: 'mbh', book: 7, adhyaya: 33 });
  assert.deepEqual(parseClaimId('mbh.14.65-69'), { text: 'mbh', book: 14, adhyaya: 65, adhyayaEnd: 69 });
  assert.equal(parseClaimId('Drona Parva 34'), null);
});

test('rule 2: a reference to a verse the edition does not have does not resolve', () => {
  assert.equal(checkRef(parseClaimId('mbh.7.34.29'), canon.index), null, '7.34 has 29 verses');
  assert.match(checkRef(parseClaimId('mbh.7.34.30'), canon.index), /has 29 verses, not 30/);
  assert.match(checkRef(parseClaimId('mbh.7.999'), canon.index), /does not exist/);
  assert.match(checkRef(parseClaimId('mbh.2.1'), canon.index), /mbh book 2 is not in the verse index/);
  assert.match(checkRef(parseClaimId('bhp.1.1'), canon.index), /no edition of "bhp"/);
  assert.match(checkRef(parseClaimId('mbh.7.34.21-17'), canon.index), /not ascending/);
});

test('every registered claim resolves, and a verse claim carries its verses', () => {
  for (const [id] of canon.claims) assert.ok(canon.resolve(id), id);
  const r = canon.resolve('mbh.7.34.17-21');
  assert.deepEqual(r.passages.map((p) => p.id), ['mbh.7.34.17', 'mbh.7.34.18', 'mbh.7.34.19', 'mbh.7.34.20', 'mbh.7.34.21']);
  assert.equal(canon.resolve('mbh.7.34.20'), null, 'a real verse that no claim registers is not citable');
});

test('the s1e3 verse reads as the scholar review verified it', () => {
  const v = canon.resolve('mbh.7.34.19').passages[0];
  assert.equal(v.devanagari, 'उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने । नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि ॥ १९ ॥');
  assert.equal(canon.resolve('mbh.7.34.19').claim.translation.by, 'scholar-review');
});

test('committed passages match their e-text: Devanagari is the transliteration of the IAST', () => {
  for (const p of canon.passages.values()) {
    const lines = p.iast.split(' / ').map(iastToDevanagari);
    assert.ok(p.devanagari.startsWith(lines.join(' । ')), p.id);
  }
});

test('rule 2: CI fails when a claim does not resolve', () => {
  const dir = mkdtempSync(join(tmpdir(), 'canon-'));
  cpSync(CANON_DIR, dir, { recursive: true });
  const file = join(dir, 'claims', 's1e3.json');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  data.claims.push({ id: 'mbh.7.34.30', edition: 'bori-ce', statement: 'A verse that is not in the edition.', status: 'etext' });
  writeFileSync(file, JSON.stringify(data));
  assert.throws(() => loadCanon(dir), (err) => err instanceof CanonError && /mbh.7.34.30 does not resolve: 7.34 has 29 verses, not 30/.test(err.message));
});

test('rule 2: every claim id used in chapter content resolves', () => {
  const bad = unresolved(canon, claimUses());
  assert.deepEqual(bad, [], bad.map((u) => `${u.file} ${u.at}: ${u.id}`).join('\n'));
});

test('rule 1: canon revered flags only extend the REVERED list', () => {
  for (const id of canon.revered()) assert.ok(REVERED.includes(id), `${id} is revered in the canon but not in REVERED`);
  for (const p of canon.people) if (REVERED.includes(p.id)) assert.equal(p.revered, true, `${p.id} is in REVERED; the canon must flag it`);
});

test('every person edge cites a claim', () => {
  for (const p of canon.people) for (const e of p.edges) assert.ok(e.claims.length > 0, `${p.id} ${e.rel} ${e.to}`);
});

test('the committed canon export is current (run pnpm canon:export after editing the canon)', async () => {
  const { buildExport, EXPORT_PATH } = await import('../src/canon/export.mjs');
  assert.deepEqual(JSON.parse(readFileSync(EXPORT_PATH, 'utf8')), JSON.parse(JSON.stringify(buildExport(canon))));
});
