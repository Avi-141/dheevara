// Turn design/mockups/index.html into a publishable artifact page in out/artifact/mockups/.
// The artifact host supplies <html>/<head>/<body>, so we strip those and keep <title>, fonts and styles first.
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { execSync } from 'node:child_process';
const dir = new URL('.', import.meta.url).pathname;
const out = dir + '../../out/artifact/mockups/';
mkdirSync(out, { recursive: true });
let html = readFileSync(dir + 'index.html', 'utf8');
html = html
  .replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, '')
  .replace(/<meta charset[^>]*>\s*<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<\/head>\s*<body>/i, '')
  .replace(/<\/body>\s*<\/html>\s*$/i, '')
  // phone-width viewers see the 360 build of every screen; studio screens scroll sideways in their own box
  .replace('</style>', '.desk-wrap{overflow-x:auto}\n@media (max-width:440px){:root{--w:358px;--h:740px}}\n</style>');
writeFileSync(out + 'mockups.html', html);
cpSync(dir + 'frames', out + 'frames', { recursive: true, filter: f => !f.endsWith('endwide.png') });
// Plates ship as JPEG (about 100 KB each instead of 1.2 MB PNG).
execSync(`python3 -c "import glob,os\nfrom PIL import Image\nfor f in glob.glob('${out}frames/*.png'):\n  Image.open(f).convert('RGB').save(f[:-4]+'.jpg',quality=82,optimize=True,progressive=True); os.remove(f)"`);
writeFileSync(out + 'mockups.html', readFileSync(out + 'mockups.html', 'utf8').replace(/frames\/(\w+)\.png/g, 'frames/$1.jpg'));
console.log('wrote', out + 'mockups.html', (html.length / 1024).toFixed(0) + ' KB');
