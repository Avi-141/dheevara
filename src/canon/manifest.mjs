// The chapter manifest (schema/chapter-manifest.schema.json): the contract with the app session.
// The schema checks shape; this checks what a schema cannot: beats are contiguous, references point
// at things that exist, and every claim id referenced anywhere appears in the top-level claims map
// and resolves in the canon (rule 2).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { ROOT } from '../env.mjs';

const ajv = new Ajv2020({ allErrors: true, strict: true });
export const MANIFEST_SCHEMA = JSON.parse(readFileSync(join(ROOT, 'schema', 'chapter-manifest.schema.json'), 'utf8'));
const checkSchema = ajv.compile(MANIFEST_SCHEMA);

/** Chapters are 90–120 s (mission test). */
export const DURATION_MS = [90000, 120000];

function referencedClaims(m) {
  const refs = [];
  m.beats.forEach((b, i) => b.verse && refs.push([b.verse, `/beats/${i}/verse`]));
  m.captions.forEach((c, i) => c.claims.forEach((id) => refs.push([id, `/captions/${i}/claims`])));
  m.reveals.forEach((r, i) => {
    r.text.claims.forEach((id) => refs.push([id, `/reveals/${i}/text/claims`]));
    (r.collection.claims ?? []).forEach((id) => refs.push([id, `/reveals/${i}/collection/claims`]));
  });
  m.people.forEach((p, i) => p.edges.forEach((e, j) => e.claims.forEach((id) => refs.push([id, `/people/${i}/edges/${j}/claims`]))));
  return refs;
}

/**
 * @param {object} m a manifest
 * @param {{ canon?: ReturnType<import('./index.mjs').loadCanon> }} [opts]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateManifest(m, { canon } = {}) {
  if (!checkSchema(m)) {
    return { ok: false, errors: checkSchema.errors.map((e) => `${e.instancePath || '(manifest)'} ${e.message}${e.params?.additionalProperty ? ` "${e.params.additionalProperty}"` : ''}`) };
  }
  const errors = [];
  const [min, max] = DURATION_MS;
  if (m.durationMs < min || m.durationMs > max) errors.push(`/durationMs ${m.durationMs} is outside ${min}–${max} ms`);

  let t = 0;
  m.beats.forEach((b, i) => {
    if (b.startMs !== t) errors.push(`/beats/${i} starts at ${b.startMs}, expected ${t} (beats must be contiguous)`);
    if (b.endMs <= b.startMs) errors.push(`/beats/${i} ends before it starts`);
    if (b.kind === 'verse' && !b.verse) errors.push(`/beats/${i} is a verse beat with no verse`);
    if (b.kind === 'reveal' && !b.reveal) errors.push(`/beats/${i} is a reveal beat with no reveal`);
    t = b.endMs;
  });
  if (t !== m.durationMs) errors.push(`/beats end at ${t}, but durationMs is ${m.durationMs}`);
  if (m.beats[0]?.kind !== 'cold_open') errors.push('/beats/0 must be the cold open (decision of 3 Oct)');

  const revealIds = new Set(m.reveals.map((r) => r.id));
  m.beats.forEach((b, i) => b.reveal && !revealIds.has(b.reveal) && errors.push(`/beats/${i}/reveal "${b.reveal}" is not in reveals`));
  m.captions.forEach((c, i) => {
    if (c.endMs <= c.startMs) errors.push(`/captions/${i} ends before it starts`);
    if (c.endMs > m.durationMs) errors.push(`/captions/${i} runs past the end of the chapter`);
  });
  const personIds = new Set(m.people.map((p) => p.id));
  m.people.forEach((p, i) => p.edges.forEach((e, j) => !personIds.has(e.to) && errors.push(`/people/${i}/edges/${j}/to "${e.to}" is not in people`)));

  for (const [id, at] of referencedClaims(m)) {
    if (!m.claims[id]) errors.push(`${at}: claim ${id} is referenced but missing from the top-level claims map (rule 2)`);
  }
  if (canon) {
    for (const [id, c] of Object.entries(m.claims)) {
      const r = canon.resolve(id);
      if (!r) { errors.push(`/claims/${id} does not resolve in the canon (rule 2)`); continue; }
      if (c.book !== r.ref.book || c.adhyaya !== r.ref.adhyaya || (c.verse ?? null) !== (r.ref.verse ?? null) || (c.verseEnd ?? null) !== (r.ref.verseEnd ?? null)) {
        errors.push(`/claims/${id} book/adhyāya/verse do not match its id`);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}
