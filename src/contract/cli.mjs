// pnpm contract:validate [file ...]
// Validates the given shot contracts, or with no arguments every content/*/shots/*.json.
// Exits 1 if any contract fails or a named file is missing.
import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from '../env.mjs';
import { validateFile } from './validate.mjs';

function allContracts() {
  const content = join(ROOT, 'content');
  if (!existsSync(content)) return [];
  return readdirSync(content, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(content, d.name, 'shots')))
    .flatMap((d) => readdirSync(join(content, d.name, 'shots'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => join(content, d.name, 'shots', f)))
    .sort();
}

const files = process.argv.length > 2 ? process.argv.slice(2) : allContracts();
let failed = 0;
for (const file of files) {
  const { ok, errors } = validateFile(file);
  const name = relative(process.cwd(), file) || file;
  if (ok) {
    console.log(`ok    ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}`);
    for (const e of errors) console.log(`      ${e.message}`);
  }
}
console.log(files.length
  ? `${files.length - failed} of ${files.length} contracts valid`
  : 'no shot contracts under content/*/shots yet');
process.exitCode = failed ? 1 : 0;
