// Render the prototype at phone and desktop sizes through each state; fail on console errors.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const fonts = dir + '../fonts/';
mkdirSync(dir + 'shots', { recursive: true });
// The artifact host wraps the page in a skeleton; mimic it for local checks.
writeFileSync(dir + '.local.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>' + readFileSync(dir + 'chapter.html', 'utf8') + '</body></html>');
const b = await chromium.launch();
const errors = [];
async function shot(name, hash, size, act) {
  const p = await b.newPage({ viewport: size, deviceScaleFactor: 2 });
  p.on('console', m => m.type() === 'error' && errors.push(name + ': ' + m.text()));
  p.on('pageerror', e => errors.push(name + ': ' + e.message));
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: readFileSync(fonts + 'fonts.css', 'utf8').replaceAll('url(files/', 'url(https://fonts.local/files/') }));
  await p.route('https://fonts.local/files/**', r => r.fulfill({ contentType: 'font/woff2', body: readFileSync(fonts + 'files/' + r.request().url().split('/files/')[1]) }));
  await p.goto('file://' + dir + '.local.html' + (hash ? '#' + hash : ''));
  await p.evaluate(() => document.fonts.ready);
  if (act) await act(p);
  await p.screenshot({ path: `${dir}shots/${name}.png` });
  await p.close();
}
const phone = { width: 390, height: 844 };
await shot('1-start', '', phone, p => p.waitForTimeout(600));
await shot('2-cold', '', phone, async p => { await p.click('#beginBtn'); await p.waitForTimeout(2600); });
await shot('3-verse', 'verse', phone, p => p.waitForTimeout(7500));
await shot('4-scene', 'scene', phone, p => p.waitForTimeout(1500));
await shot('5-reveal', 'reveal', phone, p => p.waitForTimeout(1400));
await shot('6-question', 'question', phone, p => p.waitForTimeout(2000));
await shot('7-controls', 'scene', phone, async p => { await p.waitForTimeout(800); await p.click('#ctrlBtn'); await p.waitForTimeout(900); });
await shot('8-small', 'scene', { width: 360, height: 740 }, p => p.waitForTimeout(1500));
await shot('9-desktop', 'scene', { width: 1440, height: 900 }, p => p.waitForTimeout(1500));
await b.close();
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors');
