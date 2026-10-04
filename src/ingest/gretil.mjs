// GRETIL Mahābhārata (BORI critical edition e-text, Tokunaga et al., revised by John Smith).
// Lines look like `07,034.019a<TAB>upadiṣṭo hi me pitrā yogo 'nīkasya bhedane<BR>`: book, adhyāya,
// verse, pāda letter. A line with no pāda letter is a speaker line (`abhimanyur uvāca`).
// `07,034.018*0259_01` is a star passage: a line found in some manuscripts that the critical
// edition prints in its apparatus, not in the constituted text. Star passages are kept apart and
// never resolve as claims of the text.
import { iastToDevanagari } from '../canon/translit.mjs';

const LINE = /^(\d{2}),(\d{3})\.(\d{3})([a-z]?)(\*\d{4}_\d{2})?\t(.*?)(?:<BR>)?\s*$/i;

/**
 * Parse one GRETIL book file.
 * @returns {{ verses: Map<string, { book, adhyaya, verse, speaker?, padas: string[] }>,
 *             star: Map<string, { book, adhyaya, after, id, lines: string[] }> }}
 */
export function parseGretil(html) {
  const verses = new Map();
  const star = new Map();
  let speaker = null;
  for (const raw of html.split('\n')) {
    const m = LINE.exec(raw.trim());
    if (!m) continue;
    const [, b, a, v, pada, starId, text] = m;
    const book = Number(b);
    const adhyaya = Number(a);
    const verse = Number(v);
    const clean = text.replace(/<[^>]+>/g, '').trim();
    if (starId) {
      const id = `${book}.${adhyaya}.${verse}*${Number(starId.slice(1, 5))}`;
      const entry = star.get(id) ?? { book, adhyaya, after: verse, id, lines: [] };
      entry.lines.push(clean);
      star.set(id, entry);
      continue;
    }
    if (!pada) {
      speaker = { at: `${book}.${adhyaya}.${verse}`, text: clean };
      continue;
    }
    const key = `${book}.${adhyaya}.${verse}`;
    const entry = verses.get(key) ?? { book, adhyaya, verse, padas: [] };
    if (speaker?.at === key) entry.speaker = speaker.text;
    entry.padas.push(clean);
    verses.set(key, entry);
  }
  return { verses, star };
}

/** Verses per adhyāya: { "<book>": { "<adhyaya>": lastVerse } }. */
export function verseIndex(verses) {
  const index = {};
  for (const { book, adhyaya, verse } of verses.values()) {
    index[book] ??= {};
    index[book][adhyaya] = Math.max(index[book][adhyaya] ?? 0, verse);
  }
  return index;
}

/** A verse as stored in the canon: IAST half-lines joined, and Devanagari in printed form. */
export function toPassage(entry, edition) {
  const half = (p) => p.join(' / ');
  const devaLines = entry.padas.map(iastToDevanagari);
  return {
    id: `mbh.${entry.book}.${entry.adhyaya}.${entry.verse}`,
    edition,
    ...(entry.speaker ? { speaker: entry.speaker } : {}),
    iast: half(entry.padas),
    devanagari: `${devaLines.join(' । ')} ॥ ${String(entry.verse).replace(/[0-9]/g, (d) => '०१२३४५६७८९'[d])} ॥`,
  };
}
