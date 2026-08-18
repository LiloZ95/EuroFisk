/**
 * Pulls the current content out of Payload and writes it to `src/content/content.json`,
 * which the site imports like any other module.
 *
 * Runs before every build (see the `prebuild` script). The site therefore stays a static
 * bundle: visitors never talk to the CMS, so the site cannot go down because the CMS is
 * down, and there is no per-visit latency.
 *
 * Defaults to http://localhost:3000, so a local CMS needs no configuration. To point at a
 * deployed one, set CMS_URL first:
 *
 *   PowerShell:  $env:CMS_URL = "https://cms.eurofisk.se"; npm run build
 *   bash:        CMS_URL=https://cms.eurofisk.se npm run build
 *
 * If the CMS is unreachable and a previous content.json exists, the build continues with
 * the old content and warns. That is deliberate: a CMS outage should not break a deploy.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(dirname, "../src/content");
const OUT_FILE = path.join(OUT_DIR, "content.json");

const CMS_URL = (process.env.CMS_URL ?? "http://localhost:3000").replace(/\/$/, "");
const LOCALES = ["sv", "en", "ar"];

async function get(endpoint, locale) {
  const url = `${CMS_URL}/api/${endpoint}${endpoint.includes("?") ? "&" : "?"}locale=${locale}&depth=2&limit=100`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

/** Reduces a Payload media object to just the URLs the site needs. */
function media(doc) {
  if (!doc || typeof doc !== "object") return null;
  return {
    url: doc.url ?? null,
    // `sizes` are generated on upload; fall back to the original when a size is missing
    // (videos and small images have no resized variants).
    card: doc.sizes?.card?.url ?? doc.url ?? null,
    hero: doc.sizes?.hero?.url ?? doc.url ?? null,
    thumb: doc.sizes?.thumb?.url ?? doc.url ?? null,
    alt: doc.alt ?? "",
    width: doc.width ?? null,
    height: doc.height ?? null,
  };
}

async function main() {
  const content = { locales: {}, generatedFrom: CMS_URL };

  for (const locale of LOCALES) {
    const [branches, menu, settings] = await Promise.all([
      get("branches", locale),
      get("menu-categories?sort=order", locale),
      get("globals/site-settings", locale),
    ]);

    content.locales[locale] = {
      branches: branches.docs.map((b) => ({
        slug: b.slug,
        name: b.name,
        area: b.area,
        address: b.address,
        mapsUrl: b.mapsUrl,
        phoneDisplay: b.phoneDisplay,
        phoneHref: b.phoneHref,
        whatsappNumber: b.whatsappNumber,
        menuType: b.menuType,
        serviceHours: b.serviceHours,
        hoursSummary: b.hoursSummary,
        hoursRows: (b.hoursRows ?? []).map((r) => ({ days: r.days, time: r.time })),
        photos: {
          hero: media(b.heroImage),
          heroVideo: media(b.heroVideo),
          exterior: media(b.exteriorImage),
          interior: media(b.interiorImage),
          menuPlatter: media(b.menuPlatterImage),
        },
        gallery: (b.gallery ?? []).map((g) => ({
          img: media(g.photo),
          caption: g.caption ?? g.photo?.alt ?? "",
        })),
        hero: b.hero ?? {},
        featuredSection: {
          label: b.featuredSection?.label ?? "",
          title: b.featuredSection?.title ?? "",
          sub: b.featuredSection?.sub ?? "",
          cards: (b.featuredSection?.cards ?? []).map((c) => ({
            img: media(c.photo),
            name: c.name,
            tag: c.tag,
            desc: c.desc,
          })),
        },
        gallerySection: b.gallerySection ?? {},
        about: b.about ?? {},
        menuIntro: b.menuIntro ?? {},
        contact: b.contact ?? {},
      })),

      menu: menu.docs.map((c) => ({
        id: String(c.id),
        menuType: c.menuType,
        order: c.order,
        label: c.label,
        note: c.note ?? "",
        priceUnit: c.priceUnit ?? "",
        items: (c.items ?? []).map((i) => ({
          name: i.name,
          arabic: i.arabicName || undefined,
          desc: i.desc || undefined,
          price: i.priceMode === "options" ? undefined : i.price || undefined,
          options:
            i.priceMode === "options"
              ? (i.priceOptions ?? []).map((o) => ({ label: o.label, price: o.price }))
              : undefined,
          tag: i.tag || undefined,
          photo: media(i.photo)?.card ?? undefined,
          orderable: i.orderable !== false,
        })),
      })),

      settings: {
        ...settings,
        logo: media(settings.logo),
      },
    };
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(content, null, 2), "utf8");

  const counts = content.locales.sv;
  console.log(`Fetched content from ${CMS_URL}`);
  console.log(`  branches: ${counts.branches.length}`);
  console.log(`  menu:     ${counts.menu.length} sections, ${counts.menu.reduce((n, c) => n + c.items.length, 0)} items`);
  console.log(`  → ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  if (fs.existsSync(OUT_FILE)) {
    console.warn(`\n!  Could not reach the CMS (${err.message}).`);
    console.warn("!  Building with the previously fetched content instead.\n");
    process.exit(0);
  }

  // No CMS and no cache. The site still builds — it falls back to the copy and photos that
  // ship in the repo — so this must not fail the build, or a fresh clone could not be built
  // without CMS credentials. CI sets REQUIRE_CMS=1 to make it fatal there.
  const message = `Could not reach the CMS at ${CMS_URL} and no cached content exists.`;
  if (process.env.REQUIRE_CMS === "1") {
    console.error(`\n${message}`);
    console.error(`${err.message}\n`);
    process.exit(1);
  }
  console.warn(`\n!  ${message}`);
  console.warn("!  Building with the content that ships in the repo.\n");
  process.exit(0);
});
