// The canon v0: editions, a verse-count index, the verses our claims cite, the claims themselves
// and people. Rule 2: a claim id is usable only if it is registered in content/canon/claims/ AND
// names verses that exist in the edition's index. Everything here is read from committed files;
// pnpm canon:build regenerates the index and passages from the pinned e-text.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { ROOT } from '../env.mjs';

export const CANON_DIR = join(ROOT, 'content', 'canon');
const json = (p) => JSON.parse(readFileSync(p, 'utf8'));

const ajv = new Ajv2020({ allErrors: true, strict: true });
const checkClaimsFile = ajv.compile(json(join(ROOT, 'schema', 'claim.schema.json')));

/**
 * Parse a claim id. mbh.7.34.19 is a verse; mbh.7.34.17-21 a verse range; mbh.7.33 a whole
 * adhyāya; mbh.14.65-69 a run of adhyāyas. Returns null for anything else.
 */
export function parseClaimId(id) {
  const m = /^([a-z]{2,8})\.(\d+)\.(\d+)(?:\.(\d+))?(?:-(\d+))?$/.exec(id);
  if (!m) return null;
  const [, text, b, a, v, end] = m;
  const ref = { text, book: Number(b), adhyaya: Number(a) };
  if (v !== undefined) {
    ref.verse = Number(v);
    if (end !== undefined) ref.verseEnd = Number(end);
  } else if (end !== undefined) {
    ref.adhyayaEnd = Number(end);
  }
  return ref;
}

/** Does `ref` name verses that exist in `index` ({ <text>: { <book>: { <adhyaya>: lastVerse } } })? Returns a reason string when it does not. */
export function checkRef(ref, index) {
  const text = index[ref.text];
  if (!text) return `no edition of "${ref.text}" is in the canon`;
  const book = text[ref.book];
  if (!book) return `${ref.text} book ${ref.book} is not in the verse index`;
  const last = book[ref.adhyaya];
  if (!last) return `adhyāya ${ref.book}.${ref.adhyaya} does not exist`;
  if (ref.adhyayaEnd !== undefined) {
    if (ref.adhyayaEnd <= ref.adhyaya) return `range ${ref.adhyaya}-${ref.adhyayaEnd} is not ascending`;
    for (let a = ref.adhyaya; a <= ref.adhyayaEnd; a++) if (!book[a]) return `adhyāya ${ref.book}.${a} does not exist`;
  }
  if (ref.verse !== undefined) {
    if (ref.verse < 1 || ref.verse > last) return `${ref.book}.${ref.adhyaya} has ${last} verses, not ${ref.verse}`;
    if (ref.verseEnd !== undefined) {
      if (ref.verseEnd <= ref.verse) return `range ${ref.verse}-${ref.verseEnd} is not ascending`;
      if (ref.verseEnd > last) return `${ref.book}.${ref.adhyaya} has ${last} verses, not ${ref.verseEnd}`;
    }
  }
  return null;
}

/** The single-verse ids a verse-level claim covers (empty for adhyāya-level claims). */
export function verseIds(ref) {
  if (ref.verse === undefined) return [];
  const out = [];
  for (let v = ref.verse; v <= (ref.verseEnd ?? ref.verse); v++) out.push(`${ref.text}.${ref.book}.${ref.adhyaya}.${v}`);
  return out;
}

export class CanonError extends Error {
  constructor(problems) {
    super(`canon is inconsistent:\n  ${problems.join('\n  ')}`);
    this.name = 'CanonError';
    this.problems = problems;
  }
}

/** Load the canon from `dir` and check it; throws a CanonError listing every problem. */
export function loadCanon(dir = CANON_DIR) {
  const problems = [];
  const sources = json(join(dir, 'sources.json'));
  const editions = new Map(sources.editions.map((e) => [e.id, e]));
  const index = {};
  const passages = new Map();
  for (const ed of sources.editions) {
    if (!existsSync(join(dir, ed.text, 'verse-index.json'))) { problems.push(`${ed.id}: no ${ed.text}/verse-index.json (run pnpm canon:build)`); continue; }
    index[ed.text] = json(join(dir, ed.text, 'verse-index.json'));
    for (const [id, p] of Object.entries(json(join(dir, ed.text, 'passages.json')))) passages.set(id, p);
  }
  const people = existsSync(join(dir, 'people.json')) ? json(join(dir, 'people.json')).people : [];

  const claims = new Map();
  for (const file of readdirSync(join(dir, 'claims')).filter((f) => f.endsWith('.json')).sort()) {
    const data = json(join(dir, 'claims', file));
    if (!checkClaimsFile(data)) {
      for (const e of checkClaimsFile.errors) problems.push(`claims/${file}${e.instancePath} ${e.message}`);
      continue;
    }
    for (const c of data.claims) {
      if (claims.has(c.id)) problems.push(`claims/${file}: ${c.id} is registered twice`);
      const ref = parseClaimId(c.id);
      if (!ref) { problems.push(`claims/${file}: ${c.id} is not a claim id`); continue; }
      if (!editions.has(c.edition)) problems.push(`claims/${file}: ${c.id} names unknown edition ${c.edition}`);
      else if (editions.get(c.edition).text !== ref.text) problems.push(`claims/${file}: ${c.id} is a ${ref.text} id but edition ${c.edition} is ${editions.get(c.edition).text}`);
      const why = checkRef(ref, index);
      if (why) problems.push(`claims/${file}: ${c.id} does not resolve: ${why}`);
      for (const vid of verseIds(ref)) if (!passages.has(vid)) problems.push(`claims/${file}: ${c.id} needs passage ${vid} (run pnpm canon:build)`);
      claims.set(c.id, { ...c, ref, file });
    }
  }

  const ids = new Set(people.map((p) => p.id));
  for (const p of people) {
    for (const e of p.edges) {
      if (!ids.has(e.to)) problems.push(`people: ${p.id} → ${e.to}: no such person`);
      for (const id of e.claims) if (!claims.has(id)) problems.push(`people: ${p.id} ${e.rel} ${e.to} cites unregistered claim ${id}`);
    }
  }
  if (problems.length) throw new CanonError(problems);

  return {
    editions,
    index,
    passages,
    claims,
    people,
    /** The claim and its verses, or null when the id is not a registered, resolvable claim. */
    resolve(id) {
      const claim = claims.get(id);
      if (!claim) return null;
      return { claim, ref: claim.ref, passages: verseIds(claim.ref).map((v) => passages.get(v)) };
    },
    /** Rule 1 data: person ids flagged revered in the canon (extends REVERED; never shortens it). */
    revered() {
      return people.filter((p) => p.revered).map((p) => p.id);
    },
  };
}
