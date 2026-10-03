// Capture clean scene plates from the Chakravyūha experience for the mockups.
import { chromium } from 'playwright';
const dir = new URL('.', import.meta.url).pathname;
const src = 'file://' + dir + '../../web/chakravyuha.html';
const shots = { carve: 'at=6', army: 'at=14', ride: 'at=30&auto', ride2: 'at=45&auto', stuck: 'at=70&auto', fall: 'at=95&auto', end: 'at=125&auto', endwide: 'at=125&auto' };
const b = await chromium.launch();
for (const [k, h] of Object.entries(shots)) {
  const wide = k.endsWith('wide');
  const pg = await b.newPage({ viewport: wide ? { width: 1200, height: 800 } : { width: 430, height: 932 }, deviceScaleFactor: 2 });
  await pg.goto(`${src}#${h}&clean`);
  await pg.waitForTimeout(2500);
  await pg.screenshot({ path: `${dir}frames/${k}.png` });
  await pg.close();
}
await b.close();
