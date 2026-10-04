// Sarvam Bulbul v3 narration (docs/research/sarvam.md). One request per line, cached on a hash of
// every input that changes the audio, so a second run makes no API calls. The ledger row is
// written before the request (rule 3) and the run's spend is capped (MAX_RUN_USD).
// Sanskrit is never sent here: ślokas are chanted (rule 7, src/voice/chant.mjs).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { requireEnv, redact, ROOT } from '../env.mjs';
import { assertDataUse } from '../providers.mjs';

export const TTS_URL = 'https://api.sarvam.ai/text-to-speech';

/** Bulbul v3 limits and price, from https://docs.sarvam.ai (retrieved 2026-10-04). */
export const BULBUL = {
  model: 'bulbul:v3',
  maxChars: 2500,
  pace: [0.5, 2.0],
  temperature: [0.01, 2.0],
  sampleRates: [8000, 16000, 22050, 24000, 32000, 44100, 48000],
  languages: ['bn-IN', 'en-IN', 'gu-IN', 'hi-IN', 'kn-IN', 'ml-IN', 'mr-IN', 'od-IN', 'pa-IN', 'ta-IN', 'te-IN'],
  speakers: [
    'shubh', 'aditya', 'ritu', 'priya', 'neha', 'rahul', 'pooja', 'rohan', 'simran', 'kavya', 'amit', 'dev',
    'ishita', 'shreya', 'ratan', 'varun', 'manan', 'sumit', 'roopa', 'kabir', 'aayan', 'ashutosh', 'advait',
    'anand', 'tanya', 'tarun', 'sunny', 'mani', 'gokul', 'vijay', 'shruti', 'suhani', 'mohit', 'kavitha',
    'rehan', 'soham', 'rupali',
  ],
  inrPer10kChars: 30,
};

/**
 * USD per INR for cost records: ECB reference rate via Frankfurter, 1 USD = 96.32 INR on
 * 2026-10-02 (https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR, retrieved 2026-10-04).
 */
export const INR_PER_USD = 96.32;

export const CACHE_DIR = join(ROOT, 'out', 'cache', 'voice');

export class VoiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VoiceError';
  }
}

/** Dollars for `chars` characters of Bulbul v3. */
export function costUsd(chars) {
  return (chars / 10000) * BULBUL.inrPer10kChars / INR_PER_USD;
}

/** Check a request before anything is spent. Returns the normalised request. */
export function normalise({ text, lang, speaker, pace = 1, dictId = null, dictHash = null, sampleRate = 24000, temperature = 0.6 }) {
  if (typeof text !== 'string' || !text.trim()) throw new VoiceError('narrate: text is empty');
  const clean = text.trim();
  if ([...clean].length > BULBUL.maxChars) throw new VoiceError(`narrate: ${[...clean].length} characters; Bulbul v3 takes at most ${BULBUL.maxChars} per request`);
  // A double daṇḍa ends a verse; a śloka is chanted, never read by a TTS voice (rule 7). A single
  // daṇḍa is ordinary Hindi punctuation. The voice CLI also refuses any line quoting a canon pāda.
  if (/॥|\|\|/.test(clean)) throw new VoiceError('narrate: text contains a double daṇḍa (verse); a śloka is chanted, never read by TTS (rule 7)');
  if (!BULBUL.languages.includes(lang)) throw new VoiceError(`narrate: language "${lang}" is not one Bulbul v3 speaks (${BULBUL.languages.join(', ')})`);
  if (!BULBUL.speakers.includes(speaker)) throw new VoiceError(`narrate: speaker "${speaker}" is not a Bulbul v3 voice (lowercase names only)`);
  if (!(pace >= BULBUL.pace[0] && pace <= BULBUL.pace[1])) throw new VoiceError(`narrate: pace ${pace} is outside ${BULBUL.pace.join('–')}`);
  if (!(temperature >= BULBUL.temperature[0] && temperature <= BULBUL.temperature[1])) throw new VoiceError(`narrate: temperature ${temperature} is outside ${BULBUL.temperature.join('–')}`);
  if (!BULBUL.sampleRates.includes(sampleRate)) throw new VoiceError(`narrate: sample rate ${sampleRate} is not one of ${BULBUL.sampleRates.join(', ')}`);
  if (dictId && !dictHash) throw new VoiceError('narrate: a dictId needs the dictionary content hash, or the cache would outlive an edit to the dictionary');
  return { text: clean, lang, speaker, pace, dictId, dictHash, sampleRate, temperature };
}

/** The cache key: every input that changes the audio. */
export function cacheKey(req) {
  const keyed = { provider: 'sarvam', model: BULBUL.model, codec: 'wav', ...req };
  return createHash('sha256').update(JSON.stringify(keyed, Object.keys(keyed).sort())).digest('hex');
}

/**
 * Synthesise one narration line.
 * @returns {Promise<{ wavPath: string, cached: boolean, chars: number, usd: number }>}
 */
export async function narrate(input, { ledger, budget, key: idemKey, cacheDir = CACHE_DIR, fetch = globalThis.fetch, env = process.env } = {}) {
  const req = normalise(input);
  const hash = cacheKey(req);
  const wavPath = join(cacheDir, `${hash}.wav`);
  if (existsSync(wavPath)) return { wavPath, cached: true, chars: 0, usd: 0 };

  assertDataUse('sarvam', 'script');
  const apiKey = requireEnv('SARVAM_API_KEY', env);
  if (!ledger || !budget) throw new VoiceError('narrate: a ledger and a budget are required before any request (rule 3)');

  const chars = [...req.text].length;
  const estUsd = costUsd(chars);
  const key = idemKey ?? `voice:${hash}`;
  budget.reserve(estUsd, key);
  ledger.append({
    kind: 'voice', phase: 'intent', key, provider: 'sarvam', model: BULBUL.model,
    lang: req.lang, speaker: req.speaker, pace: req.pace, sampleRate: req.sampleRate, dictId: req.dictId,
    chars, estUsd, cacheHash: hash, licence: 'Sarvam Production License (EULA), output assigned to us', territory: 'worldwide',
  });

  const started = Date.now();
  let res;
  try {
    res = await fetch(TTS_URL, {
      method: 'POST',
      headers: { 'api-subscription-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        text: req.text,
        language_code: req.lang,
        speaker: req.speaker,
        pace: req.pace,
        temperature: req.temperature,
        speech_sample_rate: req.sampleRate,
        output_audio_codec: 'wav',
        model: BULBUL.model,
        ...(req.dictId ? { dict_id: req.dictId } : {}),
      }),
    });
  } catch (err) {
    budget.settle(estUsd, 0);
    ledger.append({ kind: 'voice', phase: 'failed', key, provider: 'sarvam', ms: Date.now() - started, error: redact(err.message, env) });
    throw new VoiceError(`Sarvam unreachable: ${redact(err.message, env)}`);
  }
  const ms = Date.now() - started;
  const body = await res.text();
  if (!res.ok) {
    budget.settle(estUsd, 0);
    ledger.append({ kind: 'voice', phase: 'failed', key, provider: 'sarvam', ms, status: res.status, error: redact(body, env).slice(0, 500) });
    throw new VoiceError(`Sarvam TTS returned ${res.status}: ${redact(body, env).slice(0, 300)}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new VoiceError('Sarvam TTS returned a body that is not JSON');
  }
  const b64 = parsed.audios?.[0];
  if (typeof b64 !== 'string' || !b64) throw new VoiceError('Sarvam TTS returned no audio in audios[0]');
  const wav = Buffer.from(b64, 'base64');
  if (wav.subarray(0, 4).toString('ascii') !== 'RIFF' || wav.subarray(8, 12).toString('ascii') !== 'WAVE') {
    throw new VoiceError('Sarvam TTS audio is not a WAV file');
  }

  const usd = costUsd(chars);
  budget.settle(estUsd, usd);
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(wavPath + '.part', wav);
  renameSync(wavPath + '.part', wavPath);
  writeFileSync(join(cacheDir, `${hash}.json`), JSON.stringify({ requestId: parsed.request_id ?? null, ...req, text: undefined, chars, at: new Date().toISOString() }, null, 2));
  ledger.append({
    kind: 'voice', phase: 'done', key, provider: 'sarvam', model: BULBUL.model, requestId: parsed.request_id ?? null,
    ms, chars, usd, bytes: wav.length,
  });
  return { wavPath, cached: false, chars, usd };
}

/** Read a WAV header: sample rate, channels, bits and duration in ms. */
export function wavInfo(buf) {
  const b = Buffer.isBuffer(buf) ? buf : readFileSync(buf);
  if (b.subarray(0, 4).toString('ascii') !== 'RIFF') throw new VoiceError('not a RIFF file');
  let off = 12;
  let fmt;
  while (off + 8 <= b.length) {
    const id = b.subarray(off, off + 4).toString('ascii');
    const size = b.readUInt32LE(off + 4);
    if (id === 'fmt ') fmt = { channels: b.readUInt16LE(off + 10), sampleRate: b.readUInt32LE(off + 12), byteRate: b.readUInt32LE(off + 16), bits: b.readUInt16LE(off + 22) };
    if (id === 'data' && fmt) {
      const dataBytes = Math.min(size, b.length - off - 8);
      return { ...fmt, durationMs: Math.round((dataBytes / fmt.byteRate) * 1000) };
    }
    off += 8 + size + (size % 2);
  }
  throw new VoiceError('WAV has no fmt/data chunk');
}
