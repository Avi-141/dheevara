// Screenshot every mockup screen to design/mockups/shots/<id>.png
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
mkdirSync(dir + 'shots', { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1900, height: 1200 }, deviceScaleFactor: 2 });
await p.goto('file://' + dir + 'index.html');
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
const ids = await p.$$eval('.phone,.desk', els => els.map(e => e.id));
for (const id of ids) await p.locator('#' + id).screenshot({ path: `${dir}shots/${id}.png` });
await p.screenshot({ path: `${dir}shots/wall.png`, fullPage: true });
console.log(ids.length, 'screens');
await b.close();
