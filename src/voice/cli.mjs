// pnpm voice <chapter> [--lang en-IN,hi-IN] [--final] [--samples]
// Narrates every line of content/<chapter>/narration.json with the casts in content/voice/casts.json:
// one WAV per line per language under out/<chapter>/voice/<lang>/<line>.wav. Calls are cached on a
// hash of all inputs, so a second run makes zero API calls. --samples renders the first line in each
// cast's alternate voices, for casting. Ledger rows go to content/<chapter>/ledger.jsonl.
import { readFileSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, maxRunUsd } from '../env.mjs';
import { Ledger, Budget, RUN_ID } from '../ledger/ledger.mjs';
import { loadCanon } from '../canon/index.mjs';
import { narrate, wavInfo } from './sarvam.mjs';
import { buildDictionary, ensureDictionary } from './dictionary.mjs';

function args(argv) {
  const out = { chapter: null, langs: null, final: false, samples: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lang') out.langs = argv[++i].split(',');
    else if (a === '--final') out.final = true;
    else if (a === '--samples') out.samples = true;
    else if (!out.chapter) out.chapter = a;
    else throw new Error(`unknown argument ${a}`);
  }
  if (!out.chapter) throw new Error('usage: pnpm voice <chapter> [--lang en-IN,hi-IN] [--final] [--samples]');
  return out;
}

const json = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** Rule 7 at the script level: no narration line may quote a pāda of a cited verse. */
export function quotedVerse(text, canon) {
  for (const p of canon.passages.values()) {
    for (const pada of (p.devanagari ?? '').split(/[।॥|]+/).map((s) => s.replace(/[०-९\s]+$/g, '').trim()).filter((s) => s.length >= 8)) {
      if (text.includes(pada)) return p.id;
    }
  }
  return null;
}

export async function run(argv = process.argv.slice(2), { fetch = globalThis.fetch, env = process.env, log = console.log } = {}) {
  const opts = args(argv);
  const dir = join(ROOT, 'content', opts.chapter);
  const script = json(join(dir, 'narration.json'));
  const casts = json(join(ROOT, 'content', 'voice', 'casts.json'));
  const canon = loadCanon();
  const ledger = new Ledger(join(dir, 'ledger.jsonl'));
  const budget = new Budget(maxRunUsd(env));
  const langs = opts.langs ?? script.languages;

  for (const lineDef of script.lines) {
    for (const id of lineDef.claims) {
      if (!canon.resolve(id)) throw new Error(`${opts.chapter}/${lineDef.id}: claim ${id} does not resolve (rule 2)`);
    }
    for (const lang of langs) {
      const verse = quotedVerse(lineDef.text[lang] ?? '', canon);
      if (verse) throw new Error(`${opts.chapter}/${lineDef.id} (${lang}) quotes ${verse}; ślokas are chanted, not narrated (rule 7)`);
    }
  }

  const terms = json(join(ROOT, 'content', 'voice', 'terms.json')).terms.flatMap((t) => t.forms.map((en) => ({ en })));
  const names = [...canon.people.map((p) => ({ en: p.names.en })), ...terms];
  const dict = await ensureDictionary(buildDictionary(names), { ledger, fetch, env });
  let calls = dict.calls;
  let chars = 0;
  let usd = 0;
  const written = [];

  const render = async (lang, cast, lineDef, outPath) => {
    const text = lineDef.text[lang];
    if (!text) throw new Error(`${opts.chapter}/${lineDef.id}: no ${lang} text`);
    const r = await narrate(
      { text, lang, speaker: cast.speaker, pace: cast.pace, temperature: cast.temperature, sampleRate: opts.final ? 48000 : 24000, dictId: dict.id, dictHash: dict.hash },
      { ledger, budget, fetch, env, key: `voice:${opts.chapter}:${lineDef.id}:${lang}:${cast.speaker}` },
    );
    if (!r.cached) { calls++; chars += r.chars; usd += r.usd; }
    mkdirSync(join(outPath, '..'), { recursive: true });
    copyFileSync(r.wavPath, outPath);
    written.push({ path: outPath, cached: r.cached, ms: wavInfo(outPath).durationMs });
  };

  for (const lang of langs) {
    const cast = casts.narrators[lang];
    if (!cast) throw new Error(`content/voice/casts.json has no narrator for ${lang}`);
    if (opts.samples) {
      for (const speaker of [cast.speaker, ...(cast.alternates ?? [])]) {
        await render(lang, { ...cast, speaker }, script.lines[0], join(ROOT, 'out', opts.chapter, 'voice-samples', lang, `${speaker}.wav`));
      }
      continue;
    }
    if (script.disclosure?.text?.[lang]) {
      // The spoken AI disclosure before narration (style bible section 13); it states no claim.
      await render(lang, cast, { id: 'n00-disclosure', text: script.disclosure.text }, join(ROOT, 'out', opts.chapter, 'voice', lang, 'n00-disclosure.wav'));
    }
    for (const lineDef of script.lines) {
      await render(lang, cast, lineDef, join(ROOT, 'out', opts.chapter, 'voice', lang, `${lineDef.id}.wav`));
    }
  }

  if (!opts.samples) {
    // Line durations per language, committed so captions and beats can be timed without the WAVs.
    const timing = {};
    for (const w of written) {
      const [lang, file] = relative(join(ROOT, 'out', opts.chapter, 'voice'), w.path).split('/');
      (timing[lang] ??= {})[file.replace(/\.wav$/, '')] = w.ms;
    }
    writeFileSync(join(dir, 'voice-timing.json'), JSON.stringify({ note: 'Written by pnpm voice: milliseconds per narration line, per language, at the current cast and dictionary.', ...timing }, null, 2) + '\n');
  }
  for (const w of written) log(`${w.cached ? 'cached' : 'new   '}  ${relative(ROOT, w.path)}  ${(w.ms / 1000).toFixed(1)} s`);
  const totalMs = written.reduce((s, w) => s + w.ms, 0);
  log(`${written.length} WAVs, ${(totalMs / 1000).toFixed(1)} s of audio; ${calls} API calls, ${chars} characters billed, $${usd.toFixed(4)} (run ${RUN_ID}, cap $${budget.capUsd})`);
  return { written, calls, chars, usd };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  run().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}

