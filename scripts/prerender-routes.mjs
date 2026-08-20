/**
 * Writes the SPA shell to every real route so GitHub Pages answers 200.
 *
 * Pages has no rewrite rules: it looks for a file at the requested path and, finding
 * none, serves 404.html. That renders correctly — 404.html is a copy of the shell, so
 * React boots and routes client-side — but the status code is still 404, which means
 * Google will not index /rosengard/menu or any other deep link. Materialising an
 * index.html at each route turns those into ordinary 200s.
 *
 * Paths that are genuinely unknown keep falling through to 404.html, so a real
 * mistyped URL still returns 404 rather than a soft one.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const shellPath = join(dist, "index.html");

if (!existsSync(shellPath)) {
  console.error("dist/index.html is missing — run the build first.");
  process.exit(1);
}
const shell = readFileSync(shellPath, "utf8");

// The pages SiteRoutes matches in src/app/App.tsx. "/" is dist/index.html already.
const PAGES = ["/menu", "/reviews"];

// Slugs come from src/app/lib/branches.ts because that is what the router matches on.
// Reading them from the CMS content instead would let this generate a 200 page for a
// slug the router does not recognise, which renders as "not found" — worse than a 404.
const branchesSource = readFileSync(join(root, "src/app/lib/branches.ts"), "utf8");
const slugs = [...branchesSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

if (slugs.length === 0) {
  console.error("No branch slugs found in src/app/lib/branches.ts");
  process.exit(1);
}

// A slug the CMS knows but branches.ts does not means a branch was renamed in Payload
// without the router being updated. Those pages would render as not found, so say so.
const contentPath = join(root, "src/content/content.json");
if (existsSync(contentPath)) {
  const content = JSON.parse(readFileSync(contentPath, "utf8"));
  const cmsSlugs = (content.locales?.sv?.branches ?? []).map((b) => b.slug).filter(Boolean);
  const unknown = cmsSlugs.filter((slug) => !slugs.includes(slug));
  if (unknown.length > 0) {
    console.warn(
      `Warning: CMS branch slug(s) missing from src/app/lib/branches.ts: ${unknown.join(", ")}`,
    );
  }
}

const routes = [
  ...PAGES,
  ...slugs.flatMap((slug) => [`/${slug}`, ...PAGES.map((page) => `/${slug}${page}`)]),
];

for (const route of routes) {
  const dir = join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), shell);
}

// The catch-all for anything not listed above, and the marker that stops Pages running
// the output through Jekyll.
writeFileSync(join(dist, "404.html"), shell);
writeFileSync(join(dist, ".nojekyll"), "");

console.log(`Prerendered ${routes.length} routes:`);
for (const route of routes) console.log(`  ${route}/`);
