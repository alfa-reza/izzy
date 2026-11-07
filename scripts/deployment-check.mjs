import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import { chromium } from 'playwright';

const env = { ...process.env };
delete env.VITE_SITE_BASE;
let browser;
let server;

try {
  // The unminified test build lets this check inject a temporary art path in memory.
  execFileSync('npm', ['run', 'build', '--', '--base=/test-repo/', '--minify=false'], { stdio: 'inherit', env: { ...env, VITE_SITE_BASE: '/test-repo/' } });
  const original = await readFile('dist/index.html', 'utf8');
  assert.ok(original.includes('const sources = {};'), 'Expected an empty manifest in the test build.');
  const html = original.replace('const sources = {};', "const sources = { noteHome: 'assets/places/test.png' };");
  const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/VsAAAAASUVORK5CYII=', 'base64');
  const requests = [];
  server = http.createServer((request, response) => {
    const path = new URL(request.url || '/', 'http://localhost').pathname;
    requests.push(path);
    if (path === '/test-repo/assets/places/test.png') {
      response.writeHead(200, { 'content-type': 'image/png' });
      response.end(pixel);
    } else if (path.startsWith('/test-repo/')) {
      response.writeHead(path === '/test-repo/' ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(html);
    } else {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  for (const slug of ['mare-stream', 'izzy-does-it']) {
    const response = await page.goto(`${origin}/test-repo/creations/${slug}`);
    assert.equal(response.status(), 404);
    await page.locator('.detail-heading h1').waitFor();
    await page.reload();
    await page.locator('.story-steps article').first().waitFor();
    assert.equal(await page.locator('.desktop-nav a[href="/test-repo/creations"]').count(), 1);
  }
  await page.goto(`${origin}/test-repo/scrapbook?page=bridlewood`);
  await page.getByRole('button', { name: 'Take a closer look' }).waitFor();
  assert.equal(await page.locator('.scrap-photo img').getAttribute('src'), '/test-repo/assets/places/test.png');
  assert.ok(requests.includes('/test-repo/assets/places/test.png'));
  console.log('Simulated repository fallback, deep refresh, navigation, and local art path passed');
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  // Leave the standard Cloudflare/root artifact in dist, without a GitHub 404 file.
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env });
}