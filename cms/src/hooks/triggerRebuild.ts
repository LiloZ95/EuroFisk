import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from "payload";

/**
 * Tells GitHub to rebuild the public site after the owner saves a change.
 *
 * The site is static files on GitHub Pages built by `scripts/fetch-content.mjs`, which pulls
 * from this CMS at build time. Nothing re-reads the CMS afterwards, so without this hook an
 * edit would sit here invisibly until someone pushed a commit.
 *
 * No debounce: ten quick saves fire ten dispatches, but the deploy workflow runs under
 * `concurrency: { group: pages, cancel-in-progress: true }`, so only the last one survives to
 * publish. Debouncing in-process would not work here anyway — Vercel freezes the function
 * once the response is sent, so a pending timer never runs.
 */

const REPO = process.env.GITHUB_REPO;
const TOKEN = process.env.GITHUB_DISPATCH_TOKEN;

async function requestRebuild(payload: Payload, reason: string): Promise<void> {
  // Unset locally and during seeding, which is what keeps `npm run seed` from spraying
  // dispatches at GitHub. Deployments set both.
  if (!REPO || !TOKEN) return;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "cms-update",
        client_payload: { reason },
      }),
    });

    if (!response.ok) {
      payload.logger.error(
        `Rebuild request rejected by GitHub (${response.status}): ${await response.text()}`,
      );
    } else {
      payload.logger.info(`Rebuild requested (${reason})`);
    }
  } catch (error) {
    // A save that succeeded must not report failure because GitHub was unreachable. The
    // content is safely stored; the worst case is the live site lags until the next save.
    payload.logger.error({ err: error }, "Could not reach GitHub to request a rebuild");
  }
}

export const rebuildAfterChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  req,
}) => {
  await requestRebuild(req.payload, `${collection.slug} ${operation}`);
  return doc;
};

export const rebuildAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await requestRebuild(req.payload, `${collection.slug} delete`);
  return doc;
};

export const rebuildAfterGlobalChange: GlobalAfterChangeHook = async ({ doc, global, req }) => {
  await requestRebuild(req.payload, `${global.slug} update`);
  return doc;
};
