import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:5173';
const screenshotDir = process.env.QA_DIR || '/tmp/izzy-qa';
const banned = /\b(someone|somebody|everyone|everybody|anyone|anybody|nobody|no one|hands?|handmade|handcrafted|handful|fingers?|fingertips?|footprints|persons?|people|humans?)\b/i;
const routes = ['/', '/workshop', '/creations', '/make', '/scrapbook', '/friends', '/about', '/creations/izzy-does-it', '/creations/mare-stream', '/lost-note'];
const sizes = [[1440, 900], [1024, 768], [768, 1024], [390, 844], [360, 800]];
const failures = [];
await mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('pageerror', (error) => failures.push(`${width}px: ${error.message}`));
    for (const route of routes) {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').waitFor({ state: 'visible' });
      if (route === '/') {
        await page.waitForFunction(() => {
          const frame = document.querySelector('.hero-art-composition');
          return frame && getComputedStyle(frame).opacity === '1';
        });
      }
      const result = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        title: document.title,
        text: document.body.innerText,
        labels: [...document.querySelectorAll('[aria-label], [alt], [title], [placeholder]')].map((element) => ['aria-label', 'alt', 'title', 'placeholder'].map((attribute) => element.getAttribute(attribute) || '').join(' ')).join(' '),
      }));
      assert.equal(result.document, result.viewport, `Horizontal overflow on ${route} at ${width}px`);
      assert.match(result.title, /Izzy Moonbow/, `Missing page title on ${route}`);
      assert.equal(banned.test(`${result.text} ${result.labels}`), false, `Pony vocabulary check failed on ${route}`);
      if (width === 1440 || width === 390 || route === '/') {
        const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
        await page.screenshot({ path: `${screenshotDir}/${width}-${name}.png`, fullPage: true });
      }
    }
    await page.close();
    console.log(`Routes, copy, and overflow: ${width} x ${height} passed`);
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(`${base}/workshop`);
  for (const [label, outcome] of [['Loose ribbon', 'A bookmark charm'], ['Bent frame', 'A mended frame'], ['Old tin', 'A keepsake tin']]) {
    await page.getByRole('radio', { name: new RegExp(label) }).check();
    await page.getByRole('button', { name: 'Try this idea' }).click();
    assert.equal(await page.locator('.scene-result-name').innerText(), outcome);
    await page.getByRole('button', { name: 'Take it apart' }).click();
    assert.equal(await page.locator('.scene-result-name').innerText(), 'What could these be?');
  }
  await page.getByRole('button', { name: 'Try another little idea' }).click();
  assert.equal(await page.getByRole('radio', { name: /Loose ribbon/ }).isChecked(), true);
  console.log('Workshop: three assemblies, resets, and next idea passed');

  await page.goto(`${base}/creations`);
  await page.getByRole('button', { name: 'Made Together' }).focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('.gallery-count').innerText(), /Showing 1 little creation/i);
  assert.equal(await page.locator('.gallery-item').count(), 1);
  assert.match(await page.locator('.gallery-item').innerText(), /Mare Stream/);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  assert.equal(await page.locator('.gallery-item').count(), 9);
  await page.locator('.gallery-item').first().click();
  assert.match(page.url(), /\/creations\/izzy-does-it$/);
  await page.reload();
  assert.match(await page.locator('h1').innerText(), /Izzy Does It/);
  for (const slug of ['sunnys-lantern', 'friendship-bracelets', 'bridlewood-disguises', 'macaroni-crown', 'mare-stream', 'mistys-charm', 'flower-corsages', 'seaside-braids']) {
    await page.goto(`${base}/creations/${slug}`);
    await page.locator('.story-steps article').first().waitFor();
    assert.equal(await page.locator('.story-steps article').count(), 3, `Incomplete creation: ${slug}`);
    assert.equal(await page.locator('.detail-page .art-slot').count(), 3, `Missing art spaces: ${slug}`);
  }
  await page.goto(`${base}/creations/not-a-creation`);
  await page.locator('.notfound h1').waitFor();
  console.log('Gallery: filters, project navigation, and deep refresh passed');

  await page.goto(`${base}/make`);
  await page.evaluate(() => localStorage.setItem('izzy-bracelet-v1', '{bad json'));
  await page.reload();
  assert.match(await page.locator('.board-bottom').innerText(), /0 \/ 12 beads/);
  await page.evaluate(() => localStorage.setItem('izzy-bracelet-v1', JSON.stringify({ version: 1, cord: 'unknown', beads: ['unknown'] })));
  await page.reload();
  assert.match(await page.locator('.board-bottom').innerText(), /0 \/ 12 beads/);
  await page.getByRole('button', { name: 'Mane blue cord' }).click();
  await page.getByRole('button', { name: 'Add Blue button bead' }).click();
  await page.getByRole('button', { name: 'Add Pink pin bead' }).click();
  await page.getByRole('button', { name: 'Add Violet heart bead' }).click();
  await page.getByRole('button', { name: /Select Blue button bead 1/ }).click();
  await page.getByRole('button', { name: 'Move right' }).click();
  await page.getByRole('button', { name: 'Remove selected' }).click();
  assert.match(await page.locator('.board-bottom').innerText(), /2 \/ 12 beads/);
  await page.getByRole('button', { name: 'Undo' }).click();
  assert.match(await page.locator('.board-bottom').innerText(), /3 \/ 12 beads/);
  await page.getByRole('button', { name: 'Remove last' }).click();
  await page.getByRole('button', { name: 'Bridlewood afternoon' }).click();
  assert.match(await page.locator('.board-bottom').innerText(), /5 \/ 12 beads/);
  await page.getByRole('button', { name: 'Little surprise' }).click();
  assert.match(await page.locator('.board-bottom').innerText(), /Mane blue cord/);
  await page.getByRole('button', { name: 'For a sunny day' }).click();
  await page.getByRole('button', { name: 'Keep this one' }).click();
  assert.match(await page.locator('.save-area').innerText(), /Saved to this browser/);
  await page.reload();
  assert.match(await page.locator('.board-bottom').innerText(), /5 \/ 12 beads/);
  assert.match(await page.locator('.board-bottom').innerText(), /Warm yellow cord/);
  await page.getByRole('button', { name: 'Start again' }).click();
  assert.equal(await page.getByText('Take the beads off and start again?').isVisible(), true);
  await page.getByRole('button', { name: 'Yes, start again' }).click();
  assert.match(await page.locator('.board-bottom').innerText(), /0 \/ 12 beads/);
  assert.equal(await page.evaluate(() => localStorage.getItem('izzy-bracelet-v1')), null);
  console.log('Bracelet: validation, editing, undo, presets, save, restore, and reset passed');

  await page.goto(`${base}/scrapbook?page=bridlewood`);
  await page.locator('.scrap-index-list button').first().waitFor();
  assert.equal(await page.locator('.scrap-index-list button').count(), 4);
  await page.getByRole('button', { name: /Next note/ }).click();
  assert.match(await page.locator('.scrap-writing h3').innerText(), /plants glow/);
  await page.getByRole('tab', { name: /Around Maretime Bay/ }).focus();
  await page.keyboard.press('Enter');
  await page.locator('#tab-maretime[aria-selected="true"]').waitFor();
  assert.match(page.url(), /page=maretime/);
  assert.equal(await page.locator('.scrap-index-list button').count(), 3);
  await page.keyboard.press('ArrowRight');
  await page.locator('#tab-wander[aria-selected="true"]').waitFor();
  assert.match(page.url(), /page=wander/);
  assert.equal(await page.locator('.scrap-index-list button').count(), 3);
  await page.reload();
  await page.locator('#tab-wander[aria-selected="true"]').waitFor();
  await page.getByRole('button', { name: /Se.or Butterscotch/ }).click();
  assert.match(await page.locator('.scrap-writing').innerText(), /good listener/);
  assert.equal(await page.getByRole('button', { name: 'Take a closer look' }).count(), 0);
  console.log('Scrapbook: ten notes, query tabs, keyboard, and empty-art state passed');

  await page.goto(`${base}/friends`);
  for (const name of ['Sunny', 'Pipp', 'Zipp', 'Hitch', 'Misty']) {
    const toggle = page.getByRole('button', { name: new RegExp(`^${name}`) });
    if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator(`#friend-${name} a`).isVisible(), true);
  }
  console.log('Friends: five openable postcards and links passed');

  await page.goto(`${base}/about`);
  await page.getByRole('button', { name: 'Fold this letter' }).click();
  assert.equal(await page.locator('#letter-content').isVisible(), false);
  await page.getByRole('button', { name: 'Unfold my letter' }).click();
  assert.equal(await page.locator('#letter-content').isVisible(), true);
  console.log('About: letter fold and unfold passed');

  const blocked = await browser.newPage();
  await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); }; });
  await blocked.goto(`${base}/make`);
  await blocked.getByRole('button', { name: 'Keep this one' }).click();
  assert.match(await blocked.locator('.bracelet-feedback').innerText(), /Couldn't keep that one here/);
  await blocked.close();
  console.log('Bracelet: unavailable storage is handled without a crash');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await mobile.goto(`${base}/`);
  await mobile.getByRole('button', { name: 'Menu' }).focus();
  await mobile.keyboard.press('Enter');
  assert.equal(await mobile.getByRole('navigation', { name: 'Mobile navigation' }).isVisible(), true);
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.getByRole('navigation', { name: 'Mobile navigation' }).count(), 0);
  await mobile.getByRole('button', { name: 'Menu' }).click();
  await mobile.mouse.click(5, 800);
  assert.equal(await mobile.getByRole('navigation', { name: 'Mobile navigation' }).count(), 0);
  await mobile.getByRole('button', { name: 'Menu' }).click();
  await mobile.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Workshop' }).click();
  assert.match(mobile.url(), /\/workshop$/);
  assert.equal(await mobile.locator('h1').isVisible(), true);
  console.log('Mobile keyboard menu and reduced motion passed');
  await mobile.close();
  await page.close();
  assert.deepEqual(failures, [], 'Browser runtime errors');
  console.log(`Screenshots saved to ${screenshotDir}`);
} finally {
  await browser.close();
}