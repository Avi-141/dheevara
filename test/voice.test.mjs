// M1 voice: Bulbul request checks, ledger-before-spend, the cache (a second run makes no calls),
// the spend cap, rule 5 at the router, and rule 7 (the chant step fails loudly without Vāgdhenu).
// The provider is replaced by a recording fetch here only; the pipeline itself has no stand-in.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { narrate, normalise, cacheKey, costUsd, wavInfo, VoiceError } from '../src/voice/sarvam.mjs';
import { chant, padas, ChantError } from '../src/voice/chant.mjs';
import { Ledger, Budget, BudgetError } from '../src/ledger/ledger.mjs';
import { assertDataUse, DataUseError } from '../src/providers.mjs';

function wavBytes(ms = 100, rate = 24000) {
  const n = Math.round((rate * ms) / 1000);
  const b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  return b;
}

function recordingFetch(ledgerPath, response = () => ({ status: 200, body: JSON.stringify({ request_id: 'r1', audios: [wavBytes().toString('base64')] }) })) {
  const calls = [];
  const fn = async (url, init) => {
    const rowsAtCall = existsSync(ledgerPath) ? readFileSync(ledgerPath, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
    calls.push({ url: String(url), init, rowsAtCall });
    const r = response(url, init);
    return new Response(r.body, { status: r.status, headers: r.headers });
  };
  fn.calls = calls;
  return fn;
}

const env = { SARVAM_API_KEY: 'fake-key-123' }; // under 16 characters, so the secret scan's assignment rule ignores it
const line = { text: 'Abhimanyu tells Yudhiṣṭhira his father taught him to break in.', lang: 'en-IN', speaker: 'anand', pace: 0.95 };

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'voice-'));
  const ledgerPath = join(dir, 'ledger.jsonl');
  return { dir, ledgerPath, ledger: new Ledger(ledgerPath), budget: new Budget(15), cacheDir: join(dir, 'cache') };
}

test('Bulbul requests are checked before anything is spent', () => {
  assert.throws(() => normalise({ ...line, speaker: 'Anand' }), /not a Bulbul v3 voice \(lowercase names only\)/);
  assert.throws(() => normalise({ ...line, pace: 2.5 }), /pace 2.5 is outside 0.5–2/);
  assert.throws(() => normalise({ ...line, lang: 'sa-IN' }), /not one Bulbul v3 speaks/);
  assert.throws(() => normalise({ ...line, text: 'x'.repeat(2501) }), /at most 2500/);
  assert.throws(() => normalise({ ...line, sampleRate: 96000 }), /sample rate 96000/);
  assert.throws(() => normalise({ ...line, dictId: 'p_1' }), /needs the dictionary content hash/);
});

test('rule 7: a śloka is never sent to the TTS voice', () => {
  assert.throws(() => normalise({ ...line, lang: 'hi-IN', text: 'उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने । नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि ॥' }), /chanted, never read by TTS \(rule 7\)/);
  assert.doesNotThrow(() => normalise({ ...line, lang: 'hi-IN', speaker: 'shubh', text: 'अभिमन्यु व्यूह में अकेले घुसता है।' }), 'a single daṇḍa is Hindi punctuation');
});

test('the cache key covers every input that changes the audio', () => {
  const a = cacheKey(normalise(line));
  assert.equal(a, cacheKey(normalise({ ...line })));
  for (const change of [{ pace: 1 }, { speaker: 'ritu' }, { text: line.text + '!' }, { sampleRate: 48000 }, { temperature: 0.5 }, { dictId: 'p_1', dictHash: 'h1' }]) {
    assert.notEqual(cacheKey(normalise({ ...line, ...change })), a, JSON.stringify(change));
  }
  assert.notEqual(cacheKey(normalise({ ...line, dictId: 'p_1', dictHash: 'h1' })), cacheKey(normalise({ ...line, dictId: 'p_1', dictHash: 'h2' })));
});

test('rule 3: the ledger row is on disk before the request; a second run makes zero API calls', async () => {
  const { ledgerPath, ledger, budget, cacheDir } = setup();
  const fetch = recordingFetch(ledgerPath);
  const first = await narrate(line, { ledger, budget, cacheDir, fetch, env });
  assert.equal(first.cached, false);
  assert.equal(fetch.calls.length, 1);
  const { url, init, rowsAtCall } = fetch.calls[0];
  assert.equal(url, 'https://api.sarvam.ai/text-to-speech');
  assert.equal(init.headers['api-subscription-key'], env.SARVAM_API_KEY);
  const body = JSON.parse(init.body);
  assert.deepEqual(
    { model: body.model, speaker: body.speaker, language_code: body.language_code, pace: body.pace, speech_sample_rate: body.speech_sample_rate, output_audio_codec: body.output_audio_codec },
    { model: 'bulbul:v3', speaker: 'anand', language_code: 'en-IN', pace: 0.95, speech_sample_rate: 24000, output_audio_codec: 'wav' },
  );
  assert.equal(rowsAtCall.length, 1);
  assert.equal(rowsAtCall[0].phase, 'intent');
  assert.equal(rowsAtCall[0].chars, [...line.text].length);
  assert.ok(rowsAtCall[0].estUsd > 0);
  assert.equal(wavInfo(first.wavPath).sampleRate, 24000);

  const rows = ledger.rows();
  assert.deepEqual(rows.map((r) => r.phase), ['intent', 'done']);
  assert.equal(rows[1].requestId, 'r1');
  assert.ok(Math.abs(rows[1].usd - costUsd([...line.text].length)) < 1e-12);

  const second = await narrate(line, { ledger, budget, cacheDir, fetch, env });
  assert.equal(second.cached, true);
  assert.equal(second.wavPath, first.wavPath);
  assert.equal(fetch.calls.length, 1, 'no second API call');
  assert.equal(ledger.rows().length, 2, 'a cache hit spends nothing and writes no row');
});

test('the run cap refuses a request before it is sent', async () => {
  const { ledgerPath, ledger, cacheDir } = setup();
  const fetch = recordingFetch(ledgerPath);
  await assert.rejects(narrate(line, { ledger, budget: new Budget(1e-9), cacheDir, fetch, env }), BudgetError);
  assert.equal(fetch.calls.length, 0);
  assert.equal(ledger.rows().length, 0);
});

test('a provider error fails loudly, is ledgered, never prints the key, and caches nothing', async () => {
  const { ledgerPath, ledger, budget, cacheDir } = setup();
  const fetch = recordingFetch(ledgerPath, () => ({ status: 403, body: JSON.stringify({ error: { message: `bad key ${env.SARVAM_API_KEY}` } }) }));
  await assert.rejects(narrate(line, { ledger, budget, cacheDir, fetch, env }), (err) => {
    assert.ok(err instanceof VoiceError);
    assert.match(err.message, /Sarvam TTS returned 403/);
    assert.ok(!err.message.includes(env.SARVAM_API_KEY));
    return true;
  });
  assert.deepEqual(ledger.rows().map((r) => r.phase), ['intent', 'failed']);
  assert.ok(!JSON.stringify(ledger.rows()).includes(env.SARVAM_API_KEY));
  assert.equal(budget.committedUsd, 0);
});

test('no key, no call: a missing SARVAM_API_KEY names the variable', async () => {
  const { ledgerPath, ledger, budget, cacheDir } = setup();
  const fetch = recordingFetch(ledgerPath);
  await assert.rejects(narrate(line, { ledger, budget, cacheDir, fetch, env: {} }), /SARVAM_API_KEY is not set/);
  assert.equal(fetch.calls.length, 0);
});

test('rule 5: unreleased source passages are blocked from services that may train on inputs', () => {
  assert.throws(() => assertDataUse('sarvam', 'unreleased_source'), (err) => err instanceof DataUseError && /rule 5/.test(err.message));
  assert.throws(() => assertDataUse('exa', 'unreleased_source'), /rule 5/);
  assert.doesNotThrow(() => assertDataUse('jev', 'unreleased_source'));
  assert.doesNotThrow(() => assertDataUse('sarvam', 'script'));
  assert.throws(() => assertDataUse('somewhere', 'public'), /no data-use terms recorded/);
});

const verse = 'उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने । नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि ॥ १९ ॥';

test('rule 7: without VAGDHENU_URL the chant step throws, naming the variable; nothing else speaks the verse', async () => {
  const { ledger, cacheDir } = setup();
  await assert.rejects(chant({ devanagari: verse }, { ledger, cacheDir, env: {}, fetch: () => assert.fail('no request') }), (err) => {
    assert.ok(err instanceof ChantError);
    assert.match(err.message, /VAGDHENU_URL is not set/);
    assert.match(err.message, /never by a TTS voice \(rule 7\)/);
    return true;
  });
  assert.equal(ledger.rows().length, 0);
});

test('the chant client sends pādas to Vāgdhenu and caches the WAV', async () => {
  assert.deepEqual(padas(verse), ['उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने', 'नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि']);
  const { ledgerPath, ledger, cacheDir } = setup();
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body), rows: readFileSync(ledgerPath, 'utf8').trim().split('\n').length });
    return new Response(wavBytes(), { status: 200, headers: { 'x-meter': encodeURIComponent('anuṣṭubh') } });
  };
  const e = { VAGDHENU_URL: 'http://127.0.0.1:7861' };
  const first = await chant({ devanagari: verse, meter: 'anuṣṭubh' }, { ledger, cacheDir, env: e, fetch });
  assert.equal(first.cached, false);
  assert.equal(calls[0].url, 'http://127.0.0.1:7861/chant');
  assert.equal(calls[0].body.padas.length, 2);
  assert.equal(calls[0].rows, 1, 'intent row written before the request');
  assert.equal(ledger.rows().at(-1).meter, 'anuṣṭubh');
  const second = await chant({ devanagari: verse, meter: 'anuṣṭubh' }, { ledger, cacheDir, env: e, fetch });
  assert.equal(second.cached, true);
  assert.equal(calls.length, 1);
});

test('the pronunciation dictionary respells IAST names in one pass, with possessives, under the 100-word cap', async () => {
  const { buildDictionary, plainSpelling } = await import('../src/voice/dictionary.mjs');
  assert.equal(plainSpelling('Yudhiṣṭhira'), 'Yudhishthira');
  assert.equal(plainSpelling('cakravyūha'), 'chakravyuha');
  assert.equal(plainSpelling('Chāyā'), 'Chhaya', 'IAST ch is aspirated and must not become chhh');
  const b = buildDictionary([{ en: 'Droṇa' }, { en: 'Abhimanyu' }, { en: "Pāṇḍavas'" }]);
  assert.deepEqual(b.file.pronunciations['en-IN'], { 'Droṇa': 'Drona', "Droṇa's": "Drona's", "Pāṇḍavas'": "Pandavas'" });
  assert.throws(() => buildDictionary(Array.from({ length: 60 }, (_, i) => ({ en: `Nāma${i}` }))), /at most 100/);
});
