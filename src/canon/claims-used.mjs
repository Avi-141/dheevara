// Rule 2 across the repo: every claim id that chapter content uses must resolve in the canon.
// Walks content/<chapter>/ JSON (not content/canon/) and collects ids from `claims` arrays,
// `claims` maps (the manifest), `verse` fields and `reveal.text.claims`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from '../env.mjs';

const CLAIM = /^[a-z]{2,8}(\.[0-9]+){1,3}(-[0-9]+)?$/;

function* jsonFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* jsonFiles(p);
    else if (name.endsWith('.json')) yield p;
  }
}

function collect(node, path, out) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collect(v, `${path}/${i}`, out));
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if (k === 'claims' && Array.isArray(v)) v.forEach((id, i) => out.push({ id, at: `${path}/claims/${i}` }));
    else if (k === 'claims' && v && typeof v === 'object') Object.keys(v).forEach((id) => out.push({ id, at: `${path}/claims/${id}` }));
    else if (k === 'verse' && typeof v === 'string' && CLAIM.test(v)) out.push({ id: v, at: `${path}/verse` });
    collect(v, `${path}/${k}`, out);
  }
}

/** Every claim use under content/ outside content/canon, as { file, at, id }. */
export function claimUses(root = join(ROOT, 'content')) {
  if (!existsSync(root)) return [];
  const uses = [];
  for (const dir of readdirSync(root)) {
    if (dir === 'canon' || dir === 'voice' || !statSync(join(root, dir)).isDirectory()) continue;
    for (const file of jsonFiles(join(root, dir))) {
      const found = [];
      collect(JSON.parse(readFileSync(file, 'utf8')), '', found);
      for (const f of found) uses.push({ file: relative(ROOT, file), ...f });
    }
  }
  return uses;
}

/** Uses whose id does not resolve in `canon`. */
export function unresolved(canon, uses = claimUses()) {
  return uses.filter((u) => !canon.resolve(u.id));
}
