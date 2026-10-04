// John Smith's e-texts of the critical editions (bombay.indology.info): plain text, one half-line
// per line, `5001089a हिरण्यनाभो …` (Rāmāyaṇa: 1-digit book) or `07034019a …` (Mahābhārata: 2-digit
// book), then the adhyāya or sarga (3 digits), the verse (3 digits) and the pāda letter. Lines with
// a space instead of the letter are speaker lines. The Roman files use ISO 15919; the app uses IAST.

/** ISO 15919 (Smith's UR files) to IAST. */
export function iso15919ToIast(s) {
  return s
    .normalize('NFC')
    .replace(/r̥̄/g, 'ṝ').replace(/R̥̄/g, 'Ṝ')
    .replace(/r̥/g, 'ṛ').replace(/R̥/g, 'Ṛ')
    .replace(/l̥̄/g, 'ḹ').replace(/l̥/g, 'ḷ')
    .replace(/ṁ/g, 'ṃ').replace(/Ṁ/g, 'Ṃ')
    .replace(/’/g, "'");
}

/**
 * Parse one Smith file. bookDigits is 1 for the Rāmāyaṇa and 2 for the Mahābhārata.
 * @returns {Map<string, { book: number, adhyaya: number, verse: number, speaker?: string, padas: string[] }>}
 */
export function parseSmith(text, { bookDigits }) {
  const line = new RegExp(`^(\\d{${bookDigits}})(\\d{3})(\\d{3})([a-zA-Z ])\\s*(.*)$`);
  const verses = new Map();
  let speaker = null;
  for (const raw of text.split(/\r?\n/)) {
    const m = line.exec(raw);
    if (!m) continue;
    const [, b, a, v, pada, body] = m;
    const key = `${Number(b)}.${Number(a)}.${Number(v)}`;
    if (pada === ' ') { speaker = { at: key, text: body.trim() }; continue; }
    const entry = verses.get(key) ?? { book: Number(b), adhyaya: Number(a), verse: Number(v), padas: [] };
    if (speaker?.at === key) entry.speaker = speaker.text;
    entry.padas.push(body.trim());
    verses.set(key, entry);
  }
  return verses;
}
