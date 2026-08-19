# Connecting the CMS to the live site

The site is a static build. Content is fetched from Payload **once per build** and baked
into the bundle, so visitors never wait on the CMS and a CMS outage can't take the site
down. The cost of that tradeoff: an edit appears after a rebuild, roughly two minutes.

This document covers wiring the rebuild up so the owner never has to think about it.

## 1. Build-time fetch

`scripts/fetch-content.mjs` pulls every locale from the CMS and writes
`src/content/content.json`. It runs automatically before each build via the `prebuild`
script in `package.json`.

Locally it defaults to `http://localhost:3000`, so with the CMS running you just need:

```bash
npm run build
```

To point at a deployed CMS, set `CMS_URL` first — note the syntax differs by shell:

```powershell
# PowerShell (Windows)
$env:CMS_URL = "https://cms.eurofisk.se"
npm run build
```

```bash
# bash / zsh
CMS_URL=https://cms.eurofisk.se npm run build
```

If the CMS is unreachable **and** a previous `content.json` exists, the build continues
with the older content and prints a warning rather than failing. A CMS hiccup should not
break a deploy.

`src/content/content.json` is committed on purpose — it means a fresh clone builds without
CMS credentials, and the site's content history lives in git.

## 2. Deploying the CMS to Vercel

The CMS is a Next.js app with no local state — Postgres lives at Neon, media at R2 — so it
deploys as-is.

1. **Import the repo** at vercel.com → Add New → Project.
2. **Set Root Directory to `cms`.** This is the one setting that is easy to miss and it
   fails confusingly if wrong: the repository root is the Vite site, not the CMS.
   Framework auto-detects as Next.js.
3. **Add the environment variables** from `cms/.env.example` — for *all* environments
   (Production, Preview, Development). `payload.config.ts` throws on a missing variable at
   import time, and Next imports it during `next build`, so an absent value fails the build
   rather than showing up later at runtime.
4. **Deploy**, then copy the assigned URL.
5. **Set `CORS_ORIGINS` to that URL** and redeploy. It is unknown until the first deploy
   exists, so this second pass is unavoidable. Until it is set the admin panel cannot call
   its own API.

### Postgres must be the pooled connection

Use the Neon connection string whose host contains `-pooler`. Each serverless invocation
opens its own connection, and the direct host exhausts its connection limit quickly under
the admin panel's normal traffic.

### R2 needs a CORS policy

Uploads use `clientUploads` (see below), which means the browser PUTs files straight to the
bucket. Cloudflare dashboard → R2 → your bucket → Settings → CORS policy:

```json
[
  {
    "AllowedOrigins": ["https://<your-cms>.vercel.app"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Without this, uploads fail in the browser with an opaque CORS error while the server logs
look perfectly healthy.

### Why uploads bypass the server

Vercel caps a serverless request body at 4.5 MB. A photo straight off a phone is routinely
larger, so uploading through the function would fail for exactly the files the owner is
most likely to add. `clientUploads: true` in `payload.config.ts` has the browser PUT the
original directly to R2 and send the server only a pointer; the server then fetches it back
to run sharp, so the generated `thumb`/`card`/`hero` sizes and WebP conversion still happen
as before.

### Schema changes need migrations

The Postgres adapter only auto-pushes schema in development. Production expects the tables
to already exist — they do, from local development against the same Neon database. Any
*future* change to a collection's fields needs a Payload migration committed alongside it,
or production will read a schema that no longer matches the config.

## 3. Rebuild when the owner hits Save

This is built, in `cms/src/hooks/triggerRebuild.ts`, and attached to the collections and
global the owner edits (Branches, MenuCategories, Media, SiteSettings — not Users). After
each save it POSTs a `repository_dispatch` of type `cms-update`, which
`.github/workflows/deploy.yml` already listens for.

It is inert unless both `GITHUB_REPO` and `GITHUB_DISPATCH_TOKEN` are set, which is what
keeps local editing and `npm run seed` from firing real deploys.

Create the token at *GitHub → Settings → Developer settings → Personal access tokens →
Fine-grained tokens*, scoped to this repository only, with **Contents: read and write** —
that is the permission `repository_dispatch` requires. Store it on Vercel as
`GITHUB_DISPATCH_TOKEN`, and set `GITHUB_REPO` to `owner/EuroFisk`.

A failed dispatch is logged and swallowed. The owner's save has already succeeded at that
point, and reporting an error would be both alarming and untrue; the worst case is the live
site lags until the next save.

### No debounce, on purpose

Ten quick saves fire ten dispatches. The workflow runs under
`concurrency: { group: pages, cancel-in-progress: true }`, so the earlier runs are cancelled
and only the last one publishes — the same outcome a debounce would produce, without any
state to keep. An in-process timer would not have worked here regardless: Vercel freezes the
function once the response is sent, so a pending `setTimeout` never fires.

## 4. Point the site at the CMS

`.github/workflows/deploy.yml` already passes these through to the build:

```yaml
      - name: Build
        run: npm run build
        env:
          DEPLOY_TARGET: gh-pages
          CMS_URL: ${{ vars.CMS_URL }}
          REQUIRE_CMS: ${{ vars.REQUIRE_CMS }}
```

Under *Settings → Secrets and variables → Actions → Variables*, set `CMS_URL` to the
Vercel URL. Once you have seen a deploy fetch content successfully, also set `REQUIRE_CMS`
to `1` so a failed fetch fails the deploy instead of quietly shipping stale content.

## Rollback

Content is in git via `content.json`. To undo a bad edit immediately — faster than
correcting it in the CMS and waiting for a rebuild:

```bash
git revert <commit>   # or check out an older content.json
git push
```

Then fix the content in the CMS at leisure, so the next fetch doesn't reintroduce it.
