import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.BASE_URL || 'http://localhost:5173';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function audit(label, currentPage = page) {
  const results = await new AxeBuilder({ page: currentPage }).withTags(tags).analyze();
  const summary = results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);
  assert.deepEqual(summary, [], `${label}: ${summary.join('; ')}`);
  console.log(`${label}: no automated WCAG A/AA violations`);
}

try {
  for (const route of ['/', '/workshop', '/creations', '/creations/mare-stream', '/make', '/scrapbook', '/friends', '/about', '/bad-page']) {
    await page.goto(`${base}${route}`);
    await page.locator('h1').waitFor();
    await audit(route);
  }
  await page.goto(`${base}/workshop`);
  await page.getByRole('radio', { name: /Bent frame/ }).check();
  await page.getByRole('button', { name: 'Try this idea' }).click();
  await audit('Workshop assembled');
  await page.goto(`${base}/make`);
  await page.getByRole('button', { name: 'Add Blue button bead' }).click();
  await page.getByRole('button', { name: 'Add Violet heart bead' }).click();
  await page.getByRole('button', { name: 'Start again' }).click();
  await audit('Bracelet confirmation');
  await page.goto(`${base}/friends`);
  await page.getByRole('button', { name: /^Misty/ }).click();
  await audit('Misty postcard open');
  await page.goto(`${base}/scrapbook?page=wander`);
  await page.getByRole('button', { name: /Se.or Butterscotch/ }).click();
  await audit('Scrapbook note');
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${base}/`);
  await mobilePage.getByRole('button', { name: 'Menu' }).click();
  await audit('Mobile menu open', mobilePage);
  await mobile.close();
} finally {
  await browser.close();
}