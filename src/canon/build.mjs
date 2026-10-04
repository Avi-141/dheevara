// pnpm canon:build — regenerate content/canon/mbh/{verse-index,passages,variants}.json from the
// pinned GRETIL files (fetched and checksummed by src/canon/fetch.mjs). Only the verses a
// registered claim cites are written, with the e-text's attribution in sources.json; the full
// e-text stays in the gitignored cache (rights: docs/research/sources.md).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../env.mjs';
import { editions, ensureBook } from './fetch.mjs';
import { parseGretil, verseIndex, toPassage } from '../ingest/gretil.mjs';
import { parseClaimId, verseIds } from './index.mjs';

const DIR = join(ROOT, 'content', 'canon');

/**
 * Apparatus passages kept for the scholar (never claims of the text): *259 after 7.34.18 has
 * Abhimanyu say he heard how to enter the cakravyūha from Kṛṣṇa while in the womb.
 */
export const VARIANTS = ['7.34.18*259'];

const sortedObject = (entries) => Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));

export async function build({ log = console.log } = {}) {
  const ed = editions().find((e) => e.id === 'bori-ce');
  const claimIds = readdirSync(join(DIR, 'claims'))
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(join(DIR, 'claims', f), 'utf8')).claims.map((c) => c.id));
  const wanted = new Set(claimIds.flatMap((id) => verseIds(parseClaimId(id) ?? {})));

  const index = {};
  const passages = [];
  const variants = [];
  for (const book of Object.keys(ed.etext.files)) {
    const html = readFileSync(await ensureBook(ed, book, { log }), 'utf8');
    const { verses, star } = parseGretil(html);
    Object.assign(index, verseIndex(verses));
    for (const [key, entry] of verses) {
      const id = `mbh.${key}`;
      if (wanted.has(id)) passages.push([id, toPassage(entry, ed.id)]);
    }
    for (const id of VARIANTS) {
      const s = star.get(id);
      if (s) variants.push([`mbh.${id}`, { id: `mbh.${id}`, edition: ed.id, after: `mbh.${s.book}.${s.adhyaya}.${s.after}`, iast: s.lines, note: 'Star passage printed in the critical apparatus, not in the constituted text.' }]);
    }
  }
  // Cross-check: every cited verse's Devanagari must equal BORI's checked Devanagari e-text.
  const ud = new Map();
  for (const book of Object.keys(ed.devanagariCheck.files)) {
    const text = readFileSync(await ensureBook(ed, book, { set: 'devanagariCheck', log }), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const m = /^(\d{2})(\d{3})(\d{3})[a-z]\s+(.*)$/.exec(line);
      if (!m) continue;
      const id = `mbh.${Number(m[1])}.${Number(m[2])}.${Number(m[3])}`;
      ud.set(id, [...(ud.get(id) ?? []), m[4].trim()]);
    }
  }
  const mismatched = passages.filter(([id, p]) => p.devanagari.replace(/ ॥ [०-९]+ ॥$/, '') !== (ud.get(id) ?? []).join(' । '));
  if (mismatched.length) throw new Error(`Devanagari differs from the BORI e-text for: ${mismatched.map(([id]) => id).join(', ')}`);
  for (const [, p] of passages) p.devanagariCheckedAgainst = ed.devanagariCheck.id;

  const missing = [...wanted].filter((id) => !passages.some(([p]) => p === id));
  if (missing.length) throw new Error(`verses cited by claims but absent from the e-text: ${missing.join(', ')}`);

  const out = (name, data) => writeFileSync(join(DIR, 'mbh', name), JSON.stringify(data, null, 2) + '\n');
  out('verse-index.json', sortedObject(Object.entries(index).map(([b, a]) => [b, sortedObject(Object.entries(a))])));
  out('passages.json', sortedObject(passages));
  out('variants.json', sortedObject(variants));
  log(`verse index: ${Object.keys(index).length} books; passages: ${passages.length} (Devanagari identical to ${ed.devanagariCheck.id}); variants: ${variants.length}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  build().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
