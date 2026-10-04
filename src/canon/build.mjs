// pnpm canon:build — regenerate content/canon/<text>/{verse-index,passages,variants}.json from the
// pinned e-texts (fetched and checksummed by src/canon/fetch.mjs). Only the verses a registered
// claim cites are written, with each edition's attribution in sources.json; the full e-texts stay
// in the gitignored cache (rights: docs/research/sources.md).
//   bori-ce (Mahābhārata): GRETIL IAST, transliterated, and required to equal Smith's Devanagari
//   baroda-ce (Rāmāyaṇa):  Smith's Roman (ISO 15919 → IAST) and Smith's Devanagari as written
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../env.mjs';
import { editions, ensureBook } from './fetch.mjs';
import { parseGretil, verseIndex, toPassage } from '../ingest/gretil.mjs';
import { parseSmith, iso15919ToIast } from '../ingest/smith.mjs';
import { parseClaimId, verseIds } from './index.mjs';

const DIR = join(ROOT, 'content', 'canon');

/**
 * Apparatus passages kept for the scholar (never claims of the text): *259 after 7.34.18 has
 * Abhimanyu say he heard how to enter the cakravyūha from Kṛṣṇa while in the womb.
 */
export const VARIANTS = ['7.34.18*259'];

const sortedObject = (entries) => Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
const devaNumber = (n) => String(n).replace(/[0-9]/g, (d) => '०१२३४५६७८९'[d]);

function smithUd(text, bookDigits) {
  const map = new Map();
  for (const [key, entry] of parseSmith(text, { bookDigits })) map.set(key, entry.padas);
  return map;
}

async function buildBori(ed, wanted, log) {
  const index = {};
  const passages = [];
  const variants = [];
  for (const book of Object.keys(ed.etext.files)) {
    const { verses, star } = parseGretil(readFileSync(await ensureBook(ed, book, { log }), 'utf8'));
    Object.assign(index, verseIndex(verses));
    for (const [key, entry] of verses) if (wanted.has(`mbh.${key}`)) passages.push([`mbh.${key}`, toPassage(entry, ed.id)]);
    for (const id of VARIANTS) {
      const s = star.get(id);
      if (s) variants.push([`mbh.${id}`, { id: `mbh.${id}`, edition: ed.id, after: `mbh.${s.book}.${s.adhyaya}.${s.after}`, iast: s.lines, note: 'Star passage printed in the critical apparatus, not in the constituted text.' }]);
    }
  }
  // Cross-check: every cited verse's Devanagari must equal BORI's checked Devanagari e-text.
  const ud = new Map();
  for (const book of Object.keys(ed.devanagariCheck.files)) {
    for (const [key, padas] of smithUd(readFileSync(await ensureBook(ed, book, { set: 'devanagariCheck', log }), 'utf8'), 2)) ud.set(`mbh.${key}`, padas);
  }
  const mismatched = passages.filter(([id, p]) => p.devanagari.replace(/ ॥ [०-९]+ ॥$/, '') !== (ud.get(id) ?? []).join(' । '));
  if (mismatched.length) throw new Error(`Devanagari differs from the BORI e-text for: ${mismatched.map(([id]) => id).join(', ')}`);
  for (const [, p] of passages) p.devanagariCheckedAgainst = ed.devanagariCheck.id;
  return { index, passages, variants };
}

async function buildSmith(ed, wanted, log) {
  const index = {};
  const passages = [];
  for (const book of Object.keys(ed.etext.files)) {
    const roman = parseSmith(readFileSync(await ensureBook(ed, book, { log }), 'utf8'), { bookDigits: ed.etext.bookDigits });
    const deva = smithUd(readFileSync(await ensureBook(ed, book, { set: 'devanagari', log }), 'utf8'), ed.etext.bookDigits);
    Object.assign(index, verseIndex(roman));
    for (const [key, entry] of roman) {
      const id = `${ed.text}.${key}`;
      if (!wanted.has(id)) continue;
      const d = deva.get(key);
      if (!d || d.length !== entry.padas.length) throw new Error(`${id}: Roman and Devanagari files disagree on its lines`);
      passages.push([id, {
        id,
        edition: ed.id,
        ...(entry.speaker ? { speaker: iso15919ToIast(entry.speaker) } : {}),
        iast: entry.padas.map(iso15919ToIast).join(' / '),
        devanagari: `${d.join(' । ')} ॥ ${devaNumber(entry.verse)} ॥`,
      }]);
    }
  }
  return { index, passages, variants: [] };
}

export async function build({ log = console.log } = {}) {
  const claimIds = readdirSync(join(DIR, 'claims'))
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(join(DIR, 'claims', f), 'utf8')).claims.map((c) => c.id));
  const wanted = new Set(claimIds.flatMap((id) => verseIds(parseClaimId(id) ?? {})));

  for (const ed of editions()) {
    const out = ed.id === 'bori-ce' ? await buildBori(ed, wanted, log) : await buildSmith(ed, wanted, log);
    const missing = [...wanted].filter((id) => id.startsWith(`${ed.text}.`) && !out.passages.some(([p]) => p === id));
    if (missing.length) throw new Error(`verses cited by claims but absent from the e-text: ${missing.join(', ')}`);
    const dir = join(DIR, ed.text);
    mkdirSync(dir, { recursive: true });
    const write = (name, data) => writeFileSync(join(dir, name), JSON.stringify(data, null, 2) + '\n');
    write('verse-index.json', sortedObject(Object.entries(out.index).map(([b, a]) => [b, sortedObject(Object.entries(a))])));
    write('passages.json', sortedObject(out.passages));
    if (out.variants.length) write('variants.json', sortedObject(out.variants));
    log(`${ed.text}: verse index ${Object.keys(out.index).length} books; passages ${out.passages.length}; variants ${out.variants.length}`);
  }
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  build().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
