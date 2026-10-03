import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const shots = { start: '', carve: 'at=4', army: 'at=14', ride: 'at=30&auto', ride2: 'at=45&auto', stuck: 'at=70&auto', reveal: 'at=75&auto&reveal', fall: 'at=95&auto', end: 'at=125&auto' };
for (const [k, h] of Object.entries(shots)) {
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await pg.goto('file:///home/user/dheevara/web/chakravyuha.html' + (h ? '#' + h : ''));
  await pg.waitForTimeout(2500);
  await pg.screenshot({ path: `design/mockups/frames/${k}.png` }); await pg.close();
}
await b.close();
