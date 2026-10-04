// pnpm manifest <chapter> — build content/<chapter>/manifest.json (the app contract) from the plan:
// beats.json, the shot contracts, narration.json, voice-timing.json and the canon. Media stays
// "pending" until real files are hosted; nothing here invents media. Captions are timed from the
// narration audio: each line starts at its shot's start (or after the line before it in the same
// shot) and lasts as long as its longest language.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../env.mjs';
import { loadCanon } from '../canon/index.mjs';
import { validateManifest } from '../canon/manifest.mjs';

export const LEAD_MS = 300;
export const GAP_MS = 400;
const json = (p) => JSON.parse(readFileSync(p, 'utf8'));
const shortLang = (l) => l.split('-')[0];

export function loadPlan(chapter) {
  const dir = join(ROOT, 'content', chapter);
  const shots = new Map(readdirSync(join(dir, 'shots')).filter((f) => f.endsWith('.json')).map((f) => {
    const c = json(join(dir, 'shots', f));
    return [c.id, c];
  }));
  return { dir, beats: json(join(dir, 'beats.json')), narration: json(join(dir, 'narration.json')), timing: json(join(dir, 'voice-timing.json')), shots };
}

/** Line start and end times across the chapter, from shot durations and line audio lengths. */
export function timeline(plan) {
  const lines = new Map([['n00-disclosure', { id: 'n00-disclosure', text: plan.narration.disclosure.text, claims: [] }], ...plan.narration.lines.map((l) => [l.id, l])]);
  const out = [];
  const shotsAt = [];
  for (const beat of plan.beats.beats) {
    let t = beat.startMs;
    for (const { id, lines: ids } of beat.shots) {
      const shot = plan.shots.get(id);
      const shotStart = t;
      const shotEnd = t + shot.durationS * 1000;
      shotsAt.push({ id, beat: beat.kind, startMs: shotStart, endMs: shotEnd });
      let cursor = shotStart + LEAD_MS;
      for (const lineId of ids) {
        const line = lines.get(lineId);
        const ms = Math.max(...plan.narration.languages.map((l) => plan.timing[l]?.[lineId] ?? NaN));
        if (!Number.isFinite(ms)) throw new Error(`${lineId}: no voice timing; run pnpm voice ${plan.beats.chapter}`);
        out.push({ line, startMs: cursor, endMs: cursor + ms, shot: id });
        cursor += ms + GAP_MS;
      }
      t = shotEnd;
    }
  }
  return { lines: out, shots: shotsAt };
}

export function buildManifest(chapter, canon = loadCanon()) {
  const plan = loadPlan(chapter);
  const { beats, narration } = plan;
  const tl = timeline(plan);
  const captions = tl.lines.filter((x) => x.line.claims.length).map((x) => ({
    startMs: x.startMs,
    endMs: x.endMs,
    text: Object.fromEntries(narration.languages.map((l) => [shortLang(l), x.line.text[l]])),
    claims: x.line.claims,
  }));
  // Reveals go to the app without the internal scholar note.
  const reveals = beats.reveals.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== 'scholarNote')));
  const peopleIds = new Set(beats.people);
  const people = canon.people.filter((p) => peopleIds.has(p.id)).map((p) => ({
    id: p.id,
    names: p.names,
    edges: p.edges.filter((e) => peopleIds.has(e.to)),
  }));

  const manifest = {
    $schema: '../../schema/chapter-manifest.schema.json',
    id: beats.chapter,
    season: beats.season,
    title: beats.title,
    edition: canon.editions.get('bori-ce').shownAs,
    durationMs: beats.durationMs,
    witness: beats.witness,
    beats: beats.beats.map((b) => ({ kind: b.kind, startMs: b.startMs, endMs: b.endMs, ...(b.verse ? { verse: b.verse } : {}), ...(b.reveal ? { reveal: b.reveal } : {}) })),
    media: {
      video: { status: 'pending', hls: null, mp4: null },
      narration: Object.fromEntries(narration.languages.map((l) => [shortLang(l), { status: 'pending', url: null }])),
      chant: { status: 'pending', url: null },
      experience: beats.experience ?? null,
    },
    captions,
    reveals,
    people,
    claims: {},
    next: beats.next,
    provenance: { aiLabel: true, signOff: null },
  };

  const used = new Set();
  manifest.beats.forEach((b) => b.verse && used.add(b.verse));
  captions.forEach((c) => c.claims.forEach((id) => used.add(id)));
  reveals.forEach((r) => r.text.claims.forEach((id) => used.add(id)));
  people.forEach((p) => p.edges.forEach((e) => e.claims.forEach((id) => used.add(id))));
  for (const id of [...used].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
    const r = canon.resolve(id);
    if (!r) throw new Error(`${id} does not resolve in the canon (rule 2)`);
    const c = { book: r.ref.book, adhyaya: r.ref.adhyaya, ...(r.ref.verse ? { verse: r.ref.verse } : {}), ...(r.ref.verseEnd ? { verseEnd: r.ref.verseEnd } : {}), edition: 'BORI CE', status: r.claim.status };
    if (r.passages.length === 1) { c.devanagari = r.passages[0].devanagari; c.iast = r.passages[0].iast; }
    if (r.claim.translation) c.translation = { en: r.claim.translation.en };
    if (r.ref.verse === undefined || r.passages.length > 1) c.summary = { en: r.claim.statement };
    manifest.claims[id] = c;
  }

  const v = validateManifest(manifest, { canon });
  if (!v.ok) throw new Error(`manifest for ${chapter} is invalid:\n  ${v.errors.join('\n  ')}`);
  return manifest;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const chapter = process.argv[2];
  if (!chapter) {
    console.error('usage: pnpm manifest <chapter>');
    process.exitCode = 1;
  } else {
    const m = buildManifest(chapter);
    writeFileSync(join(ROOT, 'content', chapter, 'manifest.json'), JSON.stringify(m, null, 2) + '\n');
    console.log(`wrote content/${chapter}/manifest.json: ${m.beats.length} beats, ${m.captions.length} captions, ${Object.keys(m.claims).length} claims, ${m.durationMs / 1000} s`);
  }
}
