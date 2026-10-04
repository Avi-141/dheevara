// IAST to Devanagari for verse text, following printed convention: a word that ends in a consonant
// joins the next word (vinirgantum ahaṃ → विनिर्गन्तुमहं), and an avagraha joins its word
// (yogo 'nīkasya → योगोऽनीकस्य). GRETIL's Mahābhārata is in IAST; the app and the chant need
// Devanagari. Checked against the scholar-verified lines in test/translit.test.mjs.

const VOWELS = {
  a: ['अ', ''], ā: ['आ', 'ा'], i: ['इ', 'ि'], ī: ['ई', 'ी'], u: ['उ', 'ु'], ū: ['ऊ', 'ू'],
  ṛ: ['ऋ', 'ृ'], ṝ: ['ॠ', 'ॄ'], ḷ: ['ऌ', 'ॢ'], ḹ: ['ॡ', 'ॣ'],
  e: ['ए', 'े'], ai: ['ऐ', 'ै'], o: ['ओ', 'ो'], au: ['औ', 'ौ'],
};
const CONSONANTS = {
  k: 'क', kh: 'ख', g: 'ग', gh: 'घ', ṅ: 'ङ',
  c: 'च', ch: 'छ', j: 'ज', jh: 'झ', ñ: 'ञ',
  ṭ: 'ट', ṭh: 'ठ', ḍ: 'ड', ḍh: 'ढ', ṇ: 'ण',
  t: 'त', th: 'थ', d: 'द', dh: 'ध', n: 'न',
  p: 'प', ph: 'फ', b: 'ब', bh: 'भ', m: 'म',
  y: 'य', r: 'र', l: 'ल', v: 'व', ś: 'श', ṣ: 'ष', s: 'स', h: 'ह', ḻ: 'ळ',
};
const MARKS = { ṃ: 'ं', ṁ: 'ं', ḥ: 'ः', "'": 'ऽ', '’': 'ऽ', '|': '।', '||': '॥', '.': '।' };
const DIGITS = '०१२३४५६७८९';
const VIRAMA = '्';

const TOKENS = [...Object.keys(VOWELS), ...Object.keys(CONSONANTS), ...Object.keys(MARKS)].sort((a, b) => b.length - a.length);

export class TranslitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TranslitError';
  }
}

/** Transliterate one IAST word (no spaces) to Devanagari. */
function word(w) {
  let out = '';
  let pendingConsonant = false; // the last glyph is a consonant still carrying its inherent a
  let i = 0;
  const lower = w.normalize('NFC').toLowerCase();
  while (i < lower.length) {
    const ch = lower[i];
    if (/[0-9]/.test(ch)) {
      if (pendingConsonant) { out += VIRAMA; pendingConsonant = false; }
      out += DIGITS[Number(ch)];
      i++;
      continue;
    }
    const tok = TOKENS.find((t) => lower.startsWith(t, i));
    if (!tok) throw new TranslitError(`cannot transliterate "${w}" at "${lower.slice(i)}"`);
    i += tok.length;
    if (CONSONANTS[tok]) {
      if (pendingConsonant) out += VIRAMA;
      out += CONSONANTS[tok];
      pendingConsonant = true;
    } else if (VOWELS[tok]) {
      out += pendingConsonant ? VOWELS[tok][1] : VOWELS[tok][0];
      pendingConsonant = false;
    } else {
      if (pendingConsonant && tok !== "'" && tok !== '’') {
        // ṃ or ḥ after a bare consonant cannot occur in IAST; a daṇḍa ends the word.
        if (tok === 'ṃ' || tok === 'ṁ' || tok === 'ḥ') throw new TranslitError(`"${tok}" follows a consonant in "${w}"`);
        out += VIRAMA;
      }
      out += MARKS[tok];
      pendingConsonant = false;
    }
  }
  // A word-final consonant with no vowel token after it is a dead consonant (halanta).
  return { text: out, endsInConsonant: pendingConsonant };
}

/**
 * Transliterate an IAST line. Words ending in a consonant join the following word; a word starting
 * with an avagraha, and the particles cid and cana, join the preceding one.
 */
export function iastToDevanagari(line) {
  // GRETIL separates the pādas of a long-metre half-line with ";": a pāda break never joins, and
  // the BORI Devanagari e-text keeps the ";" (checked against Smith's UD files).
  if (line.includes(';')) return line.split(';').map((p) => iastToDevanagari(p)).join('; ');
  const words = line.trim().split(/\s+/).filter(Boolean);
  let out = '';
  for (let k = 0; k < words.length; k++) {
    const w = words[k];
    const { text, endsInConsonant } = word(w);
    if (k > 0) {
      const prev = words[k - 1];
      // The indefinite particles cid, cana are printed joined to their word (kasyāṃ cid → कस्यांचिद्).
      const joinsPrev = /^['’]/.test(w) || /^(cid|cit|cana)$/.test(w) || word(prev).endsInConsonant;
      if (joinsPrev) {
        if (out.endsWith(VIRAMA) && /^[ऄ-औ]/.test(text)) {
          // dead consonant + initial vowel: the vowel becomes a sign on that consonant
          const vowel = Object.values(VOWELS).find(([indep]) => text.startsWith(indep));
          out = out.slice(0, -1) + vowel[1] + text.slice(vowel[0].length) + (endsInConsonant ? VIRAMA : '');
          continue;
        }
        out += endsInConsonant ? text + VIRAMA : text;
        continue;
      }
      out += ' ';
    }
    out += endsInConsonant ? text + VIRAMA : text;
  }
  return out;
}
