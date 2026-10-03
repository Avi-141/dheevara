// Screenshot every mockup screen with the real fonts.
//   shots/<id>.png      at 390×844 (phones) and 1440×900 (studio)
//   shots/360/<id>.png  phones at 360×740, to catch layout collisions on small Androids
// Google Fonts requests are served from design/fonts (vendored by design/fonts/fetch-fonts.sh),
// because the headless browser cannot reach fonts.googleapis.com through the proxy.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const fonts = dir + '../fonts/';
if (!existsSync(fonts + 'fonts.css')) throw new Error('Run design/fonts/fetch-fonts.sh first');
mkdirSync(dir + 'shots/360', { recursive: true });

const b = await chromium.launch();
async function open(vars) {
  const p = await b.newPage({ viewport: { width: 1960, height: 1200 }, deviceScaleFactor: 2 });
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: readFileSync(fonts + 'fonts.css', 'utf8').replaceAll('url(files/', 'url(https://fonts.local/files/') }));
  await p.route('https://fonts.local/files/**', r => r.fulfill({ contentType: 'font/woff2', body: readFileSync(fonts + 'files/' + r.request().url().split('/files/')[1]) }));
  await p.goto('file://' + dir + 'index.html');
  if (vars) await p.addStyleTag({ content: `:root{${vars}}` });
  await p.evaluate(async () => { await document.fonts.ready; });
  const failed = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'error').map(f => f.family));
  if (failed.length) throw new Error('Fonts failed: ' + failed.join(', '));
  await p.waitForTimeout(500);
  return p;
}

let p = await open();
const ids = await p.$$eval('.phone,.desk', els => els.map(e => e.id));
for (const id of ids) await p.locator('#' + id).screenshot({ path: `${dir}shots/${id}.png` });
await p.close();

p = await open('--w:360px;--h:740px');
const phones = await p.$$eval('.phone', els => els.map(e => e.id));
for (const id of phones) await p.locator('#' + id).screenshot({ path: `${dir}shots/360/${id}.png` });
// Report anything that overflows its phone at the small size.
const overflow = await p.$$eval('.phone', els => els.flatMap(ph => {
  const r = ph.getBoundingClientRect();
  return [...ph.querySelectorAll('.body > *, .foot > *, .bar > *')].filter(el => {
    const e = el.getBoundingClientRect();
    return e.width && (e.right > r.right + 1 || e.left < r.left - 1);
  }).map(el => ph.id + ': ' + (el.className || el.tagName));
}));
console.log(ids.length, 'screens;', phones.length, 'phones at 360×740');
if (overflow.length) console.log('Horizontal overflow at 360:', overflow);
await b.close();
