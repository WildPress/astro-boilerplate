# Deployment

This boilerplate includes an opt-in Bunny.net deployment script, but this repository should not deploy anywhere itself.

## Bunny.net

Script:

```bash
npm run deploy:bunny
```

The script syncs `dist/` to a Bunny Storage Zone with the Bunny Storage HTTP API, deletes stale remote files, and can optionally purge Bunny CDN cache. The same npm script is used locally and by GitHub Actions.

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

## Setup For A New Project

1. Set the correct `site` URL in `astro.config.mjs`.
2. Add the required Bunny secrets in the deployment environment.
3. Decide whether to purge by full Pull Zone or changed URLs.
4. Run `npm run validate`.
5. Run `npm run deploy:bunny` only from the real project repo.

## GitHub Actions

`.github/workflows/deploy-bunny.yml` runs the same `npm run deploy:bunny` script through a manual `workflow_dispatch` trigger.

Required GitHub secrets:

- `BUNNY_STORAGE_ENDPOINT`
- `BUNNY_STORAGE_ZONE_NAME`
- `BUNNY_STORAGE_ACCESS_KEY`

Optional GitHub secrets:

- `BUNNY_API_KEY`
- `BUNNY_PULL_ZONE_ID`

Optional GitHub variables:

- `BUNNY_PURGE_MODE`
- `BUNNY_PUBLIC_BASE_URL`
- `BUNNY_PURGE_URLS`
- `BUNNY_CLEAN_DEPLOY`
