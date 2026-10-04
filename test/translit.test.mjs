// IAST (GRETIL) to Devanagari, checked against the Devanagari the scholar review verified for
// 7.34.17–19 (design/mockups/reviews/scholar.md; handoff section 6).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iastToDevanagari, TranslitError } from '../src/canon/translit.mjs';

const CASES = [
  ['dhanaṃjayo hi nas tāta garhayed etya saṃyugāt', 'धनंजयो हि नस्तात गर्हयेदेत्य संयुगात्'],
  ['kṣipram astraṃ samādāya droṇānīkaṃ viśātaya', 'क्षिप्रमस्त्रं समादाय द्रोणानीकं विशातय'],
  ['abhimanyur uvāca', 'अभिमन्युरुवाच'],
  ['droṇasya dṛḍham avyagram anīkapravaraṃ yudhi', 'द्रोणस्य दृढमव्यग्रमनीकप्रवरं युधि'],
  ['pitṝṇāṃ jayam ākāṅkṣann avagāhe bhinadmi ca', 'पितॄणां जयमाकाङ्क्षन्नवगाहे भिनद्मि च'],
  ["upadiṣṭo hi me pitrā yogo 'nīkasya bhedane", 'उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने'],
  ['notsahe tu vinirgantum ahaṃ kasyāṃ cid āpadi', 'नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि'],
];

for (const [iast, deva] of CASES) {
  test(`IAST to Devanagari: ${iast}`, () => {
    assert.equal(iastToDevanagari(iast), deva);
  });
}

test('vowel-initial words, visarga, aspirates and a final consonant', () => {
  assert.equal(iastToDevanagari('eko ʼyaṃ'.replace('ʼ', "'")), 'एकोऽयं');
  assert.equal(iastToDevanagari('rāmaḥ'), 'रामः');
  assert.equal(iastToDevanagari('aiśvaryam'), 'ऐश्वर्यम्');
  assert.equal(iastToDevanagari('tat tvam asi'), 'तत्त्वमसि');
});

test('a ";" pāda break in a triṣṭubh line does not join, and is kept as the BORI Devanagari keeps it', () => {
  assert.equal(iastToDevanagari("tasyā garbhaḥ samabhavad agnikalpaḥ; so 'dhīyānaṃ pitaram athābhyuvāca"), 'तस्या गर्भः समभवदग्निकल्पः; सोऽधीयानं पितरमथाभ्युवाच');
});

test('an unknown character is an error, never a silent guess', () => {
  assert.throws(() => iastToDevanagari('xyz'), TranslitError);
});
