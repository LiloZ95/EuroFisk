/** Fails the build when generated SEO artifacts disagree with the public route files. */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const siteUrl = "https://www.eurofisk.se";
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  const path = join(dist, relativePath);
  if (!existsSync(path)) {
    fail(`Missing ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function routeFile(url) {
  const pathname = new URL(url).pathname;
  return pathname === "/" ? "index.html" : join(pathname, "index.html");
}

const sitemap = read("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const canonicalUrls = urls.filter((url) => !url.includes("media.eurofisk.se"));

if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  fail("sitemap.xml is missing its XML declaration");
}
if (canonicalUrls.length !== 21) {
  fail(`Expected 21 canonical sitemap URLs, found ${canonicalUrls.length}`);
}
if (new Set(canonicalUrls).size !== canonicalUrls.length) {
  fail("sitemap.xml contains duplicate canonical URLs");
}

for (const url of canonicalUrls) {
  if (!url.startsWith(`${siteUrl}/`)) fail(`Non-canonical sitemap origin: ${url}`);
  const html = read(routeFile(url));
  if (!html) continue;

  const expectedLang = new URL(url).pathname.startsWith("/en/")
    ? "en"
    : new URL(url).pathname.startsWith("/ar/")
      ? "ar"
      : "sv";
  const expectedDir = expectedLang === "ar" ? "rtl" : "ltr";

  if (!html.includes(`<html lang="${expectedLang}" dir="${expectedDir}">`)) {
    fail(`${url} has the wrong html language or direction`);
  }
  if (count(html, /<title>/g) !== 1) fail(`${url} must have exactly one title`);
  if (count(html, /<meta name="description"/g) !== 1) {
    fail(`${url} must have exactly one description`);
  }
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (title.length < 20 || title.length > 70) {
    fail(`${url} title length is ${title.length}; expected 20–70 characters`);
  }
  if (description.length < 70 || description.length > 180) {
    fail(`${url} description length is ${description.length}; expected 70–180 characters`);
  }
  if (count(html, /<link rel="canonical"/g) !== 1) {
    fail(`${url} must have exactly one canonical`);
  }
  if (!html.includes(`<link rel="canonical" href="${url}"`)) {
    fail(`${url} does not self-canonicalize`);
  }
  if (!html.includes('meta name="robots" content="index, follow')) {
    fail(`${url} is not indexable`);
  }
  for (const hreflang of ["sv", "en", "ar", "x-default"]) {
    if (count(html, new RegExp(`hreflang="${hreflang}"`, "g")) !== 1) {
      fail(`${url} must have exactly one ${hreflang} alternate`);
    }
  }
  if (!html.includes(`<meta property="og:url" content="${url}"`)) {
    fail(`${url} has a mismatched Open Graph URL`);
  }

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLdBlocks.length !== 1) {
    fail(`${url} must have exactly one JSON-LD block`);
  } else {
    try {
      const data = JSON.parse(jsonLdBlocks[0][1]);
      if (data["@context"] !== "https://schema.org" || !Array.isArray(data["@graph"])) {
        fail(`${url} has incomplete JSON-LD`);
      }
    } catch (error) {
      fail(`${url} has invalid JSON-LD: ${error.message}`);
    }
  }
}

for (const legacy of [
  "menu/index.html",
  "reviews/index.html",
  "en/menu/index.html",
  "en/reviews/index.html",
  "ar/menu/index.html",
  "ar/reviews/index.html",
  "404.html",
]) {
  const html = read(legacy);
  if (html && !html.includes('meta name="robots" content="noindex, follow"')) {
    fail(`${legacy} must be noindex, follow`);
  }
}

const robots = read("robots.txt");
if (!robots.includes("User-agent: OAI-SearchBot\nAllow: /")) {
  fail("robots.txt does not explicitly allow OAI-SearchBot");
}
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
  fail("robots.txt does not advertise the canonical sitemap");
}

for (const geoFile of ["llms.txt", "llms-full.txt"]) {
  const value = read(geoFile);
  if (value && !value.includes("EuroFisk")) fail(`${geoFile} is missing the business name`);
}

if (failures.length > 0) {
  console.error("SEO validation failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${canonicalUrls.length} canonical URLs.`);
