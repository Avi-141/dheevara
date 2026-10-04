// pnpm canon:fetch — download the pinned e-text files into .cache/canon/ (gitignored) and
// check each against its sha256 in content/canon/sources.json. A changed file fails loudly: re-check
// the text and update the pin; never accept an unverified source.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../env.mjs';

export const CACHE = join(ROOT, '.cache', 'canon');
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

export function editions() {
  return JSON.parse(readFileSync(join(ROOT, 'content', 'canon', 'sources.json'), 'utf8')).editions;
}

/** Path of the cached file for one book, fetching and verifying it if needed. */
export async function ensureBook(edition, book, { set = 'etext', fetch = globalThis.fetch, log = () => {} } = {}) {
  const file = edition[set]?.files[book];
  if (!file) throw new Error(`${edition.id}: no ${set} file pinned for book ${book}`);
  const path = join(CACHE, set, file.url.split('/').pop());
  if (existsSync(path) && sha256(readFileSync(path)) === file.sha256) return path;
  log(`fetching ${file.url}`);
  const res = await fetch(file.url);
  if (!res.ok) throw new Error(`GRETIL returned ${res.status} for ${file.url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const got = sha256(buf);
  if (got !== file.sha256) {
    throw new Error(`${file.url} has sha256 ${got}, pinned ${file.sha256}. The source changed: re-check the text, then update content/canon/sources.json.`);
  }
  mkdirSync(join(CACHE, set), { recursive: true });
  writeFileSync(path, buf);
  return path;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  for (const ed of editions()) {
    for (const set of ['etext', 'devanagariCheck', 'devanagari']) {
      for (const book of Object.keys(ed[set]?.files ?? {})) {
        const p = await ensureBook(ed, book, { set, log: console.log });
        console.log(`ok    ${ed.id} ${set} book ${book}  ${p.slice(ROOT.length)}`);
      }
    }
  }
}
