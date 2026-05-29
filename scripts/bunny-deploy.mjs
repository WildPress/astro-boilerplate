/**
 * Syncs dist/ to a Bunny.net storage zone via the HTTP Storage API.
 * Uploads all local files and deletes any remote files not present locally.
 * Optionally purges stable public URLs from the Bunny CDN after upload.
 *
 * Required env vars:
 *   BUNNY_STORAGE_ENDPOINT   e.g. storage.bunnycdn.com
 *   BUNNY_STORAGE_ZONE_NAME  e.g. my-site
 *   BUNNY_STORAGE_ACCESS_KEY storage zone read/write password
 *
 * Optional env vars:
 *   BUNNY_API_KEY            Bunny account API key used for CDN purges
 *   BUNNY_PULL_ZONE_ID       Bunny Pull Zone ID used for full cache purges
 *   BUNNY_PURGE_MODE         "full" (default) or "changed-urls"
 *   BUNNY_PUBLIC_BASE_URL    Public site URL; defaults to astro.config.mjs site
 *   BUNNY_PURGE_URLS         Extra absolute URLs to purge, comma/newline separated
 *   BUNNY_CLEAN_DEPLOY       Set to "true" to delete ALL remote files before uploading.
 *                            Guarantees a clean slate, useful when CDN purge is not
 *                            yet wired up and you need to be sure old files are gone.
 *   INDEXNOW_KEY             IndexNow API key. When set, the key file is written to
 *                            dist/ and changed page URLs are submitted after upload.
 *   INDEXNOW_ENDPOINT        Submission endpoint. Defaults to https://api.indexnow.org/indexnow.
 *   INDEXNOW_MODE            "changed-urls" (default) or "all".
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const ENDPOINT = process.env.BUNNY_STORAGE_ENDPOINT;
const ZONE = process.env.BUNNY_STORAGE_ZONE_NAME;
const KEY = process.env.BUNNY_STORAGE_ACCESS_KEY;
const API_KEY = process.env.BUNNY_API_KEY;
const PULL_ZONE_ID = process.env.BUNNY_PULL_ZONE_ID;
const PURGE_MODE = process.env.BUNNY_PURGE_MODE || 'full';
const CLEAN_DEPLOY = process.env.BUNNY_CLEAN_DEPLOY === 'true';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY?.trim() || '';
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const INDEXNOW_MODE = process.env.INDEXNOW_MODE || 'changed-urls';
const DIST = 'dist';
const STORAGE_CONCURRENCY = 20;
const PURGE_CONCURRENCY = 1;
const PURGE_MAX_RETRIES = 5;
const INDEXNOW_MAX_URLS = 10000;

if (!ENDPOINT || !ZONE || !KEY) {
  console.error('Missing required env vars: BUNNY_STORAGE_ENDPOINT, BUNNY_STORAGE_ZONE_NAME, BUNNY_STORAGE_ACCESS_KEY');
  process.exit(1);
}

if (/^https?:\/\//i.test(ENDPOINT) || ENDPOINT.includes('/')) {
  console.error('Invalid BUNNY_STORAGE_ENDPOINT. Use only the hostname, e.g. storage.bunnycdn.com, with no protocol or path.');
  process.exit(1);
}

if (ZONE.includes('/')) {
  console.error('Invalid BUNNY_STORAGE_ZONE_NAME. Use only the storage zone name, with no slashes or endpoint path.');
  process.exit(1);
}

if (!existsSync(DIST)) {
  console.error(`Missing ${DIST}/. Run the build before deploying.`);
  process.exit(1);
}

if (INDEXNOW_KEY && !/^[a-zA-Z0-9-]{8,128}$/.test(INDEXNOW_KEY)) {
  console.error('Invalid INDEXNOW_KEY. Use 8 to 128 letters, numbers, or dashes.');
  process.exit(1);
}

if (!['changed-urls', 'all'].includes(INDEXNOW_MODE)) {
  console.error('Invalid INDEXNOW_MODE. Use "changed-urls" or "all".');
  process.exit(1);
}

try {
  new URL(INDEXNOW_ENDPOINT);
} catch {
  console.error('Invalid INDEXNOW_ENDPOINT. Use an absolute URL like https://api.indexnow.org/indexnow.');
  process.exit(1);
}

if (INDEXNOW_KEY) {
  writeFileSync(join(DIST, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
}

const baseUrl = `https://${ENDPOINT}/${ZONE}`;
const headers = { AccessKey: KEY };

async function getSiteUrl() {
  if (process.env.BUNNY_PUBLIC_BASE_URL) {
    return process.env.BUNNY_PUBLIC_BASE_URL;
  }

  try {
    const astroConfigModule = await import(new URL('../astro.config.mjs', import.meta.url));
    return astroConfigModule.default?.site;
  } catch (error) {
    console.error('Unable to resolve site URL from astro.config.mjs. Set BUNNY_PUBLIC_BASE_URL explicitly.');
    throw error;
  }
}

function normalizePublicBaseUrl(value) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);

    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
      throw new Error('Expected an absolute http(s) URL.');
    }

    return parsed.toString().replace(/\/+$/, '');
  } catch (error) {
    throw new Error(
      `Invalid public base URL "${trimmed}". Set BUNNY_PUBLIC_BASE_URL to an absolute URL like https://www.example.com.`,
      { cause: error },
    );
  }
}

let publicBaseUrl = null;

function walkLocal(dir, root = dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkLocal(full, root));
    } else {
      files.push(full.slice(root.length + 1).replace(/\\/g, '/'));
    }
  }
  return files;
}

async function listRemote(path = '') {
  const url = `${baseUrl}/${path ? `${path}/` : ''}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(
      `Unable to list Bunny storage path "${path || '/'}": HTTP ${res.status}. Check BUNNY_STORAGE_ENDPOINT, BUNNY_STORAGE_ZONE_NAME, and BUNNY_STORAGE_ACCESS_KEY.`,
    );
  }
  const items = await res.json();
  const files = [];
  for (const item of items) {
    const full = path ? `${path}/${item.ObjectName}` : item.ObjectName;
    if (item.IsDirectory) {
      files.push(...await listRemote(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function upload(relativePath) {
  const body = readFileSync(join(DIST, relativePath));
  const res = await fetch(`${baseUrl}/${relativePath}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/octet-stream' },
    body,
  });
  if (!res.ok) throw new Error(`Upload failed ${relativePath}: HTTP ${res.status}`);
}

async function deleteFile(remotePath) {
  const res = await fetch(`${baseUrl}/${remotePath}`, { method: 'DELETE', headers });
  if (!res.ok && res.status !== 404) throw new Error(`Delete failed ${remotePath}: HTTP ${res.status}`);
}

async function downloadFile(remotePath) {
  const res = await fetch(`${baseUrl}/${remotePath}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Download failed ${remotePath}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function batch(items, fn, concurrency = STORAGE_CONCURRENCY) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

function toPublicPath(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  if (relativePath.endsWith('.html')) return `/${relativePath}`;
  if (relativePath.startsWith('_astro/')) return null;

  return `/${relativePath}`;
}

function toIndexNowPath(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  if (relativePath.endsWith('.html')) return `/${relativePath}`;

  return null;
}

function parseExtraPurgeUrls() {
  const raw = process.env.BUNNY_PURGE_URLS || '';
  return raw
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function getPurgeUrls(localFiles) {
  const urls = new Set(parseExtraPurgeUrls());

  for (const file of localFiles) {
    const publicPath = toPublicPath(file);
    if (!publicPath) continue;
    urls.add(new URL(publicPath, `${publicBaseUrl}/`).toString());
  }

  return [...urls].sort();
}

async function getChangedPublicUrls(localFiles, remoteFiles) {
  const remoteSet = new Set(remoteFiles);
  const changedUrls = new Set();
  const purgeCandidates = localFiles.filter((file) => toPublicPath(file) !== null);

  await batch(purgeCandidates, async (file) => {
    const publicPath = toPublicPath(file);
    if (!publicPath) return;

    if (!remoteSet.has(file)) {
      changedUrls.add(new URL(publicPath, `${publicBaseUrl}/`).toString());
      return;
    }

    const localBuffer = readFileSync(join(DIST, file));
    const remoteBuffer = await downloadFile(file);

    if (!remoteBuffer || !localBuffer.equals(remoteBuffer)) {
      changedUrls.add(new URL(publicPath, `${publicBaseUrl}/`).toString());
    }
  });

  return changedUrls;
}

function getIndexNowUrls(localFiles, changedPublicUrls = new Set()) {
  const urls = new Set();

  if (INDEXNOW_MODE === 'all') {
    for (const file of localFiles) {
      const publicPath = toIndexNowPath(file);
      if (!publicPath) continue;
      urls.add(new URL(publicPath, `${publicBaseUrl}/`).toString());
    }

    return [...urls].sort();
  }

  for (const url of changedPublicUrls) {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== new URL(publicBaseUrl).origin) continue;
      if (parsed.pathname.endsWith('/') || parsed.pathname.endsWith('.html')) {
        urls.add(parsed.toString());
      }
    } catch {
      // Ignore invalid URLs collected from optional user-provided purge lists.
    }
  }

  return [...urls].sort();
}

async function submitIndexNow(urls) {
  if (!INDEXNOW_KEY) {
    console.log('INDEXNOW_KEY not set; skipping IndexNow submission.');
    return;
  }

  if (urls.length === 0) {
    console.log('No page URLs detected for IndexNow submission.');
    return;
  }

  if (urls.length > INDEXNOW_MAX_URLS) {
    console.error(`IndexNow supports up to ${INDEXNOW_MAX_URLS} URLs per request. Current submission has ${urls.length}.`);
    process.exit(1);
  }

  const { hostname } = new URL(publicBaseUrl);
  const keyLocation = new URL(`/${INDEXNOW_KEY}.txt`, `${publicBaseUrl}/`).toString();
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: hostname,
      key: INDEXNOW_KEY,
      keyLocation,
      urlList: urls,
    }),
  });

  if (![200, 202].includes(res.status)) {
    const message = await res.text();
    throw new Error(`IndexNow submission failed: HTTP ${res.status}${message ? ` ${message}` : ''}`);
  }

  console.log(`Submitted ${urls.length} URL(s) to IndexNow.`);
}

async function purgeUrl(url) {
  for (let attempt = 1; attempt <= PURGE_MAX_RETRIES; attempt += 1) {
    const res = await fetch(`https://api.bunny.net/purge?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: { AccessKey: API_KEY },
    });

    if (res.ok) return;

    const message = await res.text();

    if (res.status === 429 && attempt < PURGE_MAX_RETRIES) {
      let retryAfterSeconds = 2;

      try {
        const parsed = JSON.parse(message);
        if (typeof parsed.retry_after_seconds === 'number') {
          retryAfterSeconds = parsed.retry_after_seconds;
        }
      } catch {
        const retryAfterHeader = res.headers.get('retry-after');
        if (retryAfterHeader) {
          const parsedHeader = Number.parseInt(retryAfterHeader, 10);
          if (Number.isFinite(parsedHeader) && parsedHeader > 0) {
            retryAfterSeconds = parsedHeader;
          }
        }
      }

      console.log(`  ... rate limited for ${url}, retrying in ${retryAfterSeconds}s (attempt ${attempt}/${PURGE_MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));
      continue;
    }

    throw new Error(`Purge failed ${url}: HTTP ${res.status}${message ? ` ${message}` : ''}`);
  }
}

async function purgePullZone(id) {
  for (let attempt = 1; attempt <= PURGE_MAX_RETRIES; attempt += 1) {
    const res = await fetch(`https://api.bunny.net/pullzone/${encodeURIComponent(id)}/purgeCache`, {
      method: 'POST',
      headers: {
        AccessKey: API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (res.ok || res.status === 204) return;

    const message = await res.text();

    if (res.status === 429 && attempt < PURGE_MAX_RETRIES) {
      const retryAfterHeader = res.headers.get('retry-after');
      const retryAfterSeconds = Number.parseInt(retryAfterHeader || '2', 10);
      const delay = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds : 2;
      console.log(`  ... rate limited for full purge, retrying in ${delay}s (attempt ${attempt}/${PURGE_MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      continue;
    }

    throw new Error(`Full purge failed for pull zone ${id}: HTTP ${res.status}${message ? ` ${message}` : ''}`);
  }
}

const EXCLUDED_DIRS = ['docs'];

const localFiles = walkLocal(DIST).filter(
  (f) => !EXCLUDED_DIRS.some((dir) => f === dir || f.startsWith(`${dir}/`)),
);
console.log('Fetching current remote file list...');
const remoteFiles = await listRemote();
const needsPublicBaseUrl = INDEXNOW_KEY || (API_KEY && PURGE_MODE !== 'full');
let changedPublicUrls = new Set();

if (needsPublicBaseUrl) {
  const siteUrl = await getSiteUrl();

  if (!siteUrl) {
    console.error('Missing public base URL. Set BUNNY_PUBLIC_BASE_URL or define site in astro.config.mjs.');
    process.exit(1);
  }

  try {
    publicBaseUrl = normalizePublicBaseUrl(siteUrl);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (INDEXNOW_KEY || PURGE_MODE !== 'full') {
    changedPublicUrls = await getChangedPublicUrls(localFiles, remoteFiles);
  }
}

if (CLEAN_DEPLOY && remoteFiles.length > 0) {
  console.log(`Clean deploy: deleting all ${remoteFiles.length} remote file(s) before upload...`);
  await batch(remoteFiles, async (file) => {
    await deleteFile(file);
    console.log(`  RM ${file}`);
  });
}

const localSet = new Set(localFiles);
const toDelete = CLEAN_DEPLOY ? [] : remoteFiles.filter((file) => !localSet.has(file));

if (needsPublicBaseUrl) {
  for (const file of toDelete) {
    const publicPath = toPublicPath(file);
    if (!publicPath) continue;
    changedPublicUrls.add(new URL(publicPath, `${publicBaseUrl}/`).toString());
  }
}

console.log(`Uploading ${localFiles.length} files...`);
await batch(localFiles, async (file) => {
  await upload(file);
  console.log(`  UP ${file}`);
});

if (!CLEAN_DEPLOY) {
  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} stale file(s)...`);
    await batch(toDelete, async (file) => {
      await deleteFile(file);
      console.log(`  RM ${file}`);
    });
  } else {
    console.log('No stale files to remove.');
  }
}

if (!API_KEY) {
  console.log('BUNNY_API_KEY not set; skipping CDN purge.');
} else if (PURGE_MODE === 'full') {
  if (!PULL_ZONE_ID) {
    console.error('Missing BUNNY_PULL_ZONE_ID. Set it to use BUNNY_PURGE_MODE=full.');
    process.exit(1);
  }

  console.log(`Purging entire Bunny pull zone ${PULL_ZONE_ID}...`);
  await purgePullZone(PULL_ZONE_ID);
  console.log(`  PURGE FULL ${PULL_ZONE_ID}`);
} else {
  const purgeUrls = [...new Set([...getPurgeUrls([]), ...changedPublicUrls])].sort();

  if (purgeUrls.length === 0) {
    console.log('No stable URLs detected for purge.');
  } else {
    console.log(`Purging ${purgeUrls.length} URL(s) from Bunny CDN...`);
    await batch(purgeUrls, async (url) => {
      await purgeUrl(url);
      console.log(`  PURGE ${url}`);
    }, PURGE_CONCURRENCY);
  }
}

if (INDEXNOW_KEY) {
  const indexNowUrls = getIndexNowUrls(localFiles, changedPublicUrls);
  await submitIndexNow(indexNowUrls);
}

console.log('Done.');
