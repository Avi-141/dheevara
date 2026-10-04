// pnpm web:check — render every JS experience in web/ at 390×844 and 1440×900 (Build Brief, JS
// experience standards) in its preview states, fail on any console error or page error, check the
// accessibility hooks the standards require, and write screenshots to out/web-shots/.
// Needs Chromium (Playwright); not part of pnpm check, which runs in CI without a browser.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'out', 'web-shots');
const SIZES = [[390, 844], [1440, 900]];
const FONTS = join(ROOT, 'design', 'fonts');

/** Serve Google Fonts from the vendored copies in design/fonts, so headless renders match and need no network. */
async function vendorFonts(page) {
  await page.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: readFileSync(join(FONTS, 'fonts.css'), 'utf8').replaceAll('url(files/', 'url(https://fonts.local/files/') }));
  await page.route('https://fonts.local/files/**', (r) => r.fulfill({ contentType: 'font/woff2', body: readFileSync(join(FONTS, 'files', r.request().url().split('/files/')[1])) }));
}

/** States per experience: [hash, name, checks]. dom: the experience uses DOM controls we can assert. */
const EXPERIENCES = {
  'chakravyuha.html': { dom: false, states: [['', 'start'], ['#at=6', 'carve'], ['#at=20&auto', 'ride'], ['#at=60&auto&reveal', 'reveal']] },
  'lineage.html': { dom: true, states: [['', 'abhimanyu'], ['#hanuman', 'hanuman'], ['#reveal', 'reveal']] },
  'mainaka.html': { dom: true, states: [['', 'start'], ['#at=8', 'mahendra'], ['#at=22&auto', 'leap'], ['#at=38&auto', 'sea'], ['#at=50&auto&reveal', 'reveal'], ['#at=80&auto', 'question']] },
};

const browser = await chromium.launch();
let failures = 0;
mkdirSync(OUT, { recursive: true });
for (const [file, exp] of Object.entries(EXPERIENCES)) {
  for (const [w, h] of SIZES) {
    for (const [hash, name] of exp.states) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(String(e)));
      await vendorFonts(page);
      await page.goto(pathToFileURL(join(ROOT, 'web', file)).href + hash);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const problems = [...errors];
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      if (scrollW > w + 1) problems.push(`page scrolls sideways (${scrollW}px wide at ${w}px)`);
      if (exp.dom) {
        if (!(await page.$('[aria-live]'))) problems.push('no aria-live region for captions');
        if (hash.includes('reveal') && !(await page.$('[role="dialog"]'))) problems.push('#reveal did not open the reveal sheet');
        if (file === 'mainaka.html') {
          if (!(await page.isVisible('#mute'))) problems.push('mute control not visible');
          if ((await page.isVisible('#title')) !== (name === 'start')) problems.push(`title card ${name === 'start' ? 'missing' : 'still showing'}`);
          if ((await page.isVisible('#end')) !== (name === 'question')) problems.push(`end card ${name === 'question' ? 'missing' : 'showing early'}`);
        }
      }
      const shot = join(OUT, `${file.replace('.html', '')}-${name}-${w}x${h}.png`);
      await page.screenshot({ path: shot });
      const status = problems.length ? 'FAIL' : 'ok  ';
      if (problems.length) failures++;
      console.log(`${status}  ${file.padEnd(17)} ${String(w + '×' + h).padEnd(9)} ${name.padEnd(9)} ${problems.join('; ')}`);
      await page.close();
    }
  }
}
await browser.close();
console.log(failures ? `${failures} state(s) failed` : 'all states pass');
process.exitCode = failures ? 1 : 0;
