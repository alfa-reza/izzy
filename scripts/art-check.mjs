import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// A blank test pixel is intercepted in memory; no character art is added to the site.
const base = process.env.BASE_URL || 'http://localhost:5173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.route('**/src/content/media.ts*', async (route) => {
    const response = await route.fetch();
    const original = await response.text();
    assert.ok(original.includes('const sources = {};'), 'Run this check against the Vite dev server with an empty art manifest.');
    const body = original.replace('const sources = {};', "const sources = { noteHome: 'assets/places/test.png', homeIzzy: 'assets/characters/missing.webp' };");
    await route.fulfill({ response, body });
  });
  await page.route('**/assets/places/test.png', (route) => route.fulfill({
    contentType: 'image/png',
    body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/VsAAAAASUVORK5CYII=', 'base64'),
  }));
  await page.route('**/assets/characters/missing.webp', (route) => route.fulfill({ status: 404, body: '' }));
  await page.goto(`${base}/scrapbook`);
  await page.getByRole('button', { name: 'Take a closer look' }).click();
  assert.equal(await page.getByRole('dialog').isVisible(), true);
  assert.match(await page.evaluate(() => document.activeElement?.textContent || ''), /Close picture/);
  await page.keyboard.press('Tab');
  assert.match(await page.evaluate(() => document.activeElement?.textContent || ''), /Close picture/);
  await page.keyboard.press('Shift+Tab');
  assert.match(await page.evaluate(() => document.activeElement?.textContent || ''), /Close picture/);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.match(await page.evaluate(() => document.activeElement?.textContent || ''), /Take a closer look/);
  await page.goto(`${base}/`);
  await page.locator('.hero-art-frame .art-empty').waitFor();
  assert.equal(await page.locator('.hero-art-frame img').count(), 0);
  console.log('Loaded image, lightbox focus and Escape, and broken-image fallback passed');
} finally {
  await browser.close();
}