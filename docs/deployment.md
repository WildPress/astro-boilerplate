# Deployment

This boilerplate includes an opt-in Bunny.net deployment script, but this repository should not deploy anywhere itself.

## Bunny.net

Script:

```bash
npm run deploy:bunny
```

The script syncs `dist/` to a Bunny Storage Zone with the Bunny Storage HTTP API, deletes stale remote files, and can optionally purge Bunny CDN cache. The same npm script is used locally and by GitHub Actions.

If `INDEXNOW_KEY` is set, the script also writes the required IndexNow key file into `dist/`, uploads it with the site, and submits changed page URLs after deployment.

Do not run deployments from this boilerplate repo. Configure and run deployment only in a project created from the boilerplate.

## Local Deployment

1. Copy `.env.example` to `.env` in the real project repo.
2. Fill in the Bunny values.
3. Run:

```bash
npm run validate
npm run deploy:bunny
```

`npm run deploy:bunny` uses Node's `--env-file-if-exists=.env`, so local `.env` values are loaded automatically when present.

## Required Environment Variables

| Variable | Description |
| --- | --- |
| `BUNNY_STORAGE_ENDPOINT` | Storage endpoint hostname only, such as `storage.bunnycdn.com`. Do not include protocol or path. |
| `BUNNY_STORAGE_ZONE_NAME` | Bunny storage zone name. |
| `BUNNY_STORAGE_ACCESS_KEY` | Storage zone read/write password. |

## Optional Environment Variables

| Variable | Description |
| --- | --- |
| `BUNNY_API_KEY` | Bunny account API key used for CDN purges. If omitted, upload still runs but purge is skipped. |
| `BUNNY_PULL_ZONE_ID` | Pull Zone ID. Required when `BUNNY_PURGE_MODE=full`. |
| `BUNNY_PURGE_MODE` | `full` or `changed-urls`. Defaults to `full`. |
| `BUNNY_PUBLIC_BASE_URL` | Public site URL used for changed-URL purges. Defaults to `site` in `astro.config.mjs`. |
| `BUNNY_PURGE_URLS` | Extra absolute URLs to purge, separated by commas or new lines. |
| `BUNNY_CLEAN_DEPLOY` | Set to `true` to delete all remote files before upload. Use carefully. |
| `INDEXNOW_KEY` | IndexNow API key. When set, deployment creates `/<key>.txt` and submits page URLs. |
| `INDEXNOW_ENDPOINT` | IndexNow endpoint. Defaults to `https://api.indexnow.org/indexnow`. |
| `INDEXNOW_MODE` | `changed-urls` or `all`. Defaults to `changed-urls`. |

## IndexNow

IndexNow is opt-in for downstream projects. To enable it:

1. Generate a stable IndexNow key for the real site.
2. Set `INDEXNOW_KEY` in local `.env` or as a GitHub secret.
3. Confirm `site` in `astro.config.mjs`, or set `BUNNY_PUBLIC_BASE_URL`.
4. Deploy with `npm run deploy:bunny`.

The key must be 8 to 128 letters, numbers, or dashes. The deploy script writes `dist/<key>.txt` before upload so the public key location is `https://example.com/<key>.txt`.

By default, `INDEXNOW_MODE=changed-urls` submits changed, added, and deleted page URLs detected during deployment. Use `INDEXNOW_MODE=all` to submit every generated page URL on each deploy.

## Setup For A New Project

1. Set the correct `site` URL in `astro.config.mjs`.
2. Add the required Bunny secrets in the deployment environment.
3. Decide whether to purge by full Pull Zone or changed URLs.
4. Optionally add `INDEXNOW_KEY` for search engine update notifications.
5. Run `npm run validate`.
6. Run `npm run deploy:bunny` only from the real project repo.

## Canonical Host

Choose one public origin for the project before launch:

- Apex canonical: `https://example.com`
- `www` canonical: `https://www.example.com`

Set `site` in `astro.config.mjs` to that exact origin. Astro uses it for generated sitemap URLs, and `BaseLayout` uses it for canonical and Open Graph URLs.

Redirect alternate hostnames at the hosting or CDN layer with a permanent redirect. For Bunny-backed projects, configure this in Bunny Edge Rules with a hostname condition and a Redirect To URL action that preserves the request path.

Examples:

- If `https://www.example.com` is canonical, redirect `example.com/*` to `https://www.example.com/*`.
- If `https://example.com` is canonical, redirect `www.example.com/*` to `https://example.com/*`.

Do not try to solve host canonicalisation inside Astro pages. A static build can emit canonical metadata, but it cannot issue host-level redirects once Bunny is serving the files.

## GitHub Actions

`.github/workflows/deploy-bunny.yml` runs the same `npm run deploy:bunny` script through a manual `workflow_dispatch` trigger.

Required GitHub secrets:

- `BUNNY_STORAGE_ENDPOINT`
- `BUNNY_STORAGE_ZONE_NAME`
- `BUNNY_STORAGE_ACCESS_KEY`

Optional GitHub secrets:

- `BUNNY_API_KEY`
- `BUNNY_PULL_ZONE_ID`
- `INDEXNOW_KEY`

Optional GitHub variables:

- `BUNNY_PURGE_MODE`
- `BUNNY_PUBLIC_BASE_URL`
- `BUNNY_PURGE_URLS`
- `BUNNY_CLEAN_DEPLOY`
- `INDEXNOW_ENDPOINT`
- `INDEXNOW_MODE`
