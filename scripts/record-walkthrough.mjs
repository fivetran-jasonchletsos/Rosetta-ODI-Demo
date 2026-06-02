// Records a ~100s walkthrough of the live Rosetta ODI demo.
// Output: rosetta-app/public/video/walkthrough.mp4
//
// Usage: node scripts/record-walkthrough.mjs [--local]
//   --local  records against http://localhost:3000 (npx serve out) instead of prod
//
// Requirements: playwright + ffmpeg on PATH. Unlike the dbt-Wizard recorder,
// Rosetta is a Next.js static export, so each segment is a real page navigation
// (trailingSlash routes), not a hash route.

import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const outFile = resolve(repoRoot, 'rosetta-app/public/video/walkthrough.mp4');

const useLocal = process.argv.includes('--local');
const base = useLocal
  ? 'http://localhost:3000'
  : 'https://fivetran-jasonchletsos.github.io/Rosetta-ODI-Demo';

const VIEWPORT = { width: 1440, height: 900 };

// Representative tour: the combined pipeline -> Fivetran half -> dbt half ->
// the config builder -> the translation table -> the metrics dashboard ->
// day in the life -> how it's built. ~12s per segment keeps the reel near 100s.
const SEGMENTS = [
  { path: '/',              dwellMs: 5500, scrollMs: 7000 },
  { path: '/fivetran/',     dwellMs: 5000, scrollMs: 7500 },
  { path: '/dbt/',          dwellMs: 5000, scrollMs: 7500 },
  { path: '/builder/',      dwellMs: 5000, scrollMs: 7500 },
  { path: '/translate/',    dwellMs: 5000, scrollMs: 7500 },
  { path: '/metrics/',      dwellMs: 5000, scrollMs: 7500 },
  { path: '/day/',          dwellMs: 5000, scrollMs: 7500 },
  { path: '/architecture/', dwellMs: 5000, scrollMs: 7500 },
];

async function recordSegments() {
  const workDir = mkdtempSync(join(tmpdir(), 'rosetta-record-'));
  console.log('[record] work dir:', workDir);
  console.log('[record] base:', base);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: workDir, size: VIEWPORT },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const seg of SEGMENTS) {
    const url = `${base}${seg.path}`;
    console.log('[record] ->', url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));

    const h1 = await page.locator('h1').first().textContent().catch(() => '');
    console.log('[record]   caption:', (h1 || '').trim().replace(/\s+/g, ' ').slice(0, 120));

    await page.waitForTimeout(seg.dwellMs);

    await page.evaluate((ms) => new Promise((res) => {
      const start = performance.now();
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      function tick(now) {
        const t = Math.min(1, (now - start) / ms);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        window.scrollTo(0, max * eased);
        if (t < 1) requestAnimationFrame(tick);
        else res();
      }
      requestAnimationFrame(tick);
    }), seg.scrollMs);

    await page.waitForTimeout(800);
  }

  await context.close();
  await browser.close();

  const webms = readdirSync(workDir).filter((f) => f.endsWith('.webm')).map((f) => join(workDir, f));
  if (webms.length === 0) throw new Error('no .webm produced');
  const inputWebm = webms[0];
  console.log('[record] captured:', inputWebm);

  mkdirSync(dirname(outFile), { recursive: true });
  if (existsSync(outFile)) rmSync(outFile);

  const cmd = [
    'ffmpeg', '-y',
    '-i', `"${inputWebm}"`,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-preset', 'medium',
    '-crf', '22',
    '-movflags', '+faststart',
    '-an',
    `"${outFile}"`,
  ].join(' ');
  console.log('[ffmpeg]', cmd);
  execSync(cmd, { stdio: 'inherit' });

  console.log('[done] wrote', outFile);
  rmSync(workDir, { recursive: true, force: true });
}

recordSegments().catch((err) => {
  console.error(err);
  process.exit(1);
});
