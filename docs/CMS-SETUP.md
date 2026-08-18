# Connecting the CMS to the live site

The site is a static build. Content is fetched from Payload **once per build** and baked
into the bundle, so visitors never wait on the CMS and a CMS outage can't take the site
down. The cost of that tradeoff: an edit appears after a rebuild, roughly two minutes.

This document covers wiring the rebuild up so the owner never has to think about it.

## 1. Build-time fetch

`scripts/fetch-content.mjs` pulls every locale from the CMS and writes
`src/content/content.json`. It runs automatically before each build via the `prebuild`
script in `package.json`.

```bash
CMS_URL=https://cms.eurofisk.se npm run build
```

If the CMS is unreachable **and** a previous `content.json` exists, the build continues
with the older content and prints a warning rather than failing. A CMS hiccup should not
break a deploy.

`src/content/content.json` is committed on purpose — it means a fresh clone builds without
CMS credentials, and the site's content history lives in git.

## 2. Rebuild when the owner hits Save

Add `CMS_URL` as a repository variable and give the deploy workflow a
`repository_dispatch` trigger:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
  repository_dispatch:
    types: [cms-update]
```

Then in Payload, add an `afterChange` hook that pings GitHub. In
`cms/src/payload.config.ts`, on the collections the owner edits:

```ts
hooks: {
  afterChange: [
    async () => {
      if (!process.env.GITHUB_DISPATCH_TOKEN) return
      await fetch('https://api.github.com/repos/<owner>/EuroFisk/dispatches', {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_DISPATCH_TOKEN}`,
        },
        body: JSON.stringify({ event_type: 'cms-update' }),
      })
    },
  ],
}
```

The token needs only the `contents: write` permission on this one repository. Create it as
a fine-grained personal access token and store it as `GITHUB_DISPATCH_TOKEN` in the CMS
host's environment.

Debounce is worth adding later — an owner editing ten fields in a row will otherwise
trigger ten builds. A simple approach is to fire the dispatch on a 60-second trailing
timer.

## 3. Update the deploy workflow

`.github/workflows/deploy.yml` needs the fetch step to have the CMS URL:

```yaml
      - name: Build
        run: npm run build
        env:
          DEPLOY_TARGET: gh-pages
          CMS_URL: ${{ vars.CMS_URL }}
```

Set `CMS_URL` under *Settings → Secrets and variables → Actions → Variables*.

## Rollback

Content is in git via `content.json`. To undo a bad edit immediately — faster than
correcting it in the CMS and waiting for a rebuild:

```bash
git revert <commit>   # or check out an older content.json
git push
```

Then fix the content in the CMS at leisure, so the next fetch doesn't reintroduce it.
