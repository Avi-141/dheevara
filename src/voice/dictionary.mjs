// The Bulbul pronunciation dictionary, generated from canon names (DHE-29). One dictionary per
// account, updated in place so its id stays stable; at most 100 words (docs/research/sarvam.md).
// English narration keeps diacritics in captions; the dictionary tells Bulbul how to say them.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { requireEnv, redact, ROOT } from '../env.mjs';
import { assertDataUse } from '../providers.mjs';

export const DICT_URL = 'https://api.sarvam.ai/text-to-speech/pronunciation-dictionary';
export const MAX_WORDS = 100;
export const STATE_PATH = join(ROOT, 'out', 'state', 'sarvam-dictionary.json');

export class DictionaryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DictionaryError';
  }
}

// IAST to a plain spelling an Indian-English voice reads correctly, in one pass (longest match first).
const IAST = {
  'ṣṭh': 'shth', ch: 'chh', c: 'ch', C: 'Ch', ṣ: 'sh', Ṣ: 'Sh', ś: 'sh', Ś: 'Sh',
  ṛ: 'ri', Ṛ: 'Ri', ṝ: 'ree', ā: 'a', Ā: 'A', ī: 'i', Ī: 'I', ū: 'u', Ū: 'U',
  ṭ: 't', Ṭ: 'T', ḍ: 'd', Ḍ: 'D', ṇ: 'n', ñ: 'n', ṅ: 'n', ṃ: 'm', ḥ: 'h',
};
const IAST_RE = new RegExp(Object.keys(IAST).sort((a, b) => b.length - a.length).join('|'), 'g');

/** A plain-letter spelling of an IAST name for en-IN narration: Yudhiṣṭhira → Yudhishthira. */
export function plainSpelling(iast) {
  return iast.normalize('NFC').replace(IAST_RE, (m) => IAST[m]);
}

/**
 * Build the dictionary file from names. `names` is [{ en, hi? }]; en is the IAST house spelling.
 * en-IN gets a plain spelling for every name that carries diacritics; hi-IN gets an entry only
 * where a Devanagari form differs from the narration spelling (none by default).
 */
export function buildDictionary(names) {
  const en = {};
  for (const { en: name } of names) {
    if (!name || /^[\x20-\x7E]+$/.test(name)) continue;
    for (const word of name.split(/\s+/)) {
      if (/^[\x20-\x7E]+$/.test(word)) continue;
      en[word] = plainSpelling(word);
      if (!/'s?$/.test(word)) en[`${word}'s`] = `${plainSpelling(word)}'s`; // matching is by exact word
    }
  }
  const words = Object.keys(en).length;
  if (words > MAX_WORDS) throw new DictionaryError(`${words} words; a Sarvam dictionary holds at most ${MAX_WORDS}`);
  const sorted = Object.fromEntries(Object.entries(en).sort(([a], [b]) => a.localeCompare(b)));
  const file = { pronunciations: { 'en-IN': sorted } };
  const hash = createHash('sha256').update(JSON.stringify(file)).digest('hex');
  return { file, hash, words };
}

function readState(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

/**
 * Make sure the account's dictionary matches `built`. Creates it once, then updates it in place
 * when the content hash changes. Makes no API call when the recorded state already matches.
 * @returns {Promise<{ id: string, hash: string, calls: number }>}
 */
export async function ensureDictionary(built, { ledger, statePath = STATE_PATH, fetch = globalThis.fetch, env = process.env } = {}) {
  const state = readState(statePath);
  if (state?.hash === built.hash && state.id) return { id: state.id, hash: built.hash, calls: 0 };

  assertDataUse('sarvam', 'public');
  const apiKey = requireEnv('SARVAM_API_KEY', env);
  if (!ledger) throw new DictionaryError('a ledger is required before any request (rule 3)');
  const update = Boolean(state?.id);
  const key = `dictionary:${built.hash}`;
  ledger.append({ kind: 'voice-dictionary', phase: 'intent', key, provider: 'sarvam', action: update ? 'update' : 'create', words: built.words, usd: 0 });

  const fd = new FormData();
  fd.append('file', new Blob([JSON.stringify(built.file)], { type: 'application/json' }), 'dheevara.json');
  const url = update ? `${DICT_URL}?dict_id=${encodeURIComponent(state.id)}` : DICT_URL;
  const res = await fetch(url, { method: update ? 'PUT' : 'POST', headers: { 'api-subscription-key': apiKey }, body: fd });
  const body = await res.text();
  if (!res.ok) {
    ledger.append({ kind: 'voice-dictionary', phase: 'failed', key, provider: 'sarvam', status: res.status, error: redact(body, env).slice(0, 300) });
    throw new DictionaryError(`Sarvam dictionary ${update ? 'update' : 'create'} returned ${res.status}: ${redact(body, env).slice(0, 300)}`);
  }
  const parsed = JSON.parse(body);
  const id = parsed.dictionary_id ?? parsed.dict_id ?? state?.id;
  if (!id) throw new DictionaryError('Sarvam dictionary response carried no dictionary_id');
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, JSON.stringify({ id, hash: built.hash, words: built.words, at: new Date().toISOString() }, null, 2));
  ledger.append({ kind: 'voice-dictionary', phase: 'done', key, provider: 'sarvam', id, usd: 0 });
  return { id, hash: built.hash, calls: 1 };
}
