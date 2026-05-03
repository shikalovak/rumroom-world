// Auto-submit URLs to IndexNow (Bing/Yandex/Naver/Seznam) after deploy.
//
// This is wired into `astro build` (see package.json) so it runs automatically
// on every Vercel deploy — no manual step required.
//
// Reads sitemap from local ./dist/sitemap.xml (built by Astro just before this
// runs). Falls back to live https://rumroom.world/sitemap.xml when run manually.
//
// Note: Google Indexing API not included — Google's UI silently rejects service
// account emails (May 2026 finding). For Google indexing, sitemap.xml + manual
// Request Indexing in Search Console for urgent URLs is the practical path.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_HOST = 'rumroom.world';
const SITE_URL = `https://${SITE_HOST}`;
const INDEXNOW_KEY = '40fda137da296c32dc1da3e626b38e94';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const LOCAL_SITEMAP = path.join(__dirname, '..', 'dist', 'sitemap.xml');

// ---------- Get URL list ----------
function parseSitemapXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function getUrlList() {
  const argUrls = process.argv.slice(2).filter((a) => a.startsWith('http'));
  if (argUrls.length > 0) {
    console.log(`Using ${argUrls.length} URLs from CLI args`);
    return argUrls;
  }
  // Prefer local sitemap (post-build) — that's the freshest source during deploy
  if (fs.existsSync(LOCAL_SITEMAP)) {
    const xml = fs.readFileSync(LOCAL_SITEMAP, 'utf8');
    const urls = parseSitemapXml(xml);
    console.log(`Found ${urls.length} URLs in dist/sitemap.xml`);
    return urls;
  }
  // Fallback to live site (when run manually outside build)
  console.log('No dist/sitemap.xml — fetching live sitemap...');
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Live sitemap fetch failed: ${res.status}`);
  const urls = parseSitemapXml(await res.text());
  console.log(`Found ${urls.length} URLs in live sitemap`);
  return urls;
}

// ---------- IndexNow ----------
async function pushIndexNow(urls) {
  if (urls.length === 0) return;
  const body = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // 200 OK or 202 Accepted are both success
    if (res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow: pushed ${urls.length} URL(s) — Bing/Yandex/Naver/Seznam`);
    } else {
      const text = await res.text().catch(() => '');
      console.error(`⚠️  IndexNow ${res.status}: ${text.slice(0, 200)}`);
    }
  } catch (e) {
    // Don't fail the build if IndexNow is down — sitemap auto-recrawl is fine fallback
    console.error(`⚠️  IndexNow failed (non-blocking): ${e.message}`);
  }
}

// ---------- Main ----------
async function main() {
  try {
    const urls = await getUrlList();
    if (urls.length === 0) {
      console.log('No URLs to push, exiting');
      return;
    }
    await pushIndexNow(urls);
  } catch (err) {
    // Don't fail the build — log only
    console.error('index-push non-fatal error:', err.message);
  }
}

main();
