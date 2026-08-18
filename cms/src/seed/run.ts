/**
 * One-time migration: copies the site's current hard-coded content into Payload, so the
 * owner opens the admin panel and finds the real site rather than empty fields.
 *
 * Safe to re-run: every record is matched by a stable key (branch slug, category id,
 * media filename) and updated in place rather than duplicated.
 *
 *   cd cms && npm run seed
 *
 * Photos are read from ../src/imports and uploaded to R2 through Payload, which also
 * generates the resized variants.
 */
import "dotenv/config";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "../payload.config";
import { BRANCH_SEED, MENU_SEED, SITE_SETTINGS_SEED, PHOTO_FILES } from "./data";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const IMPORTS_DIR = path.resolve(dirname, "../../../src/imports");

/**
 * Shapes of the generated seed data. `data.ts` is emitted as `any[]` (it is machine-written
 * JSON), so these describe it just well enough for the loops below to be type-checked.
 */
type Loc = Record<string, string>;

interface SeedBranch {
  slug: string;
  common: Record<string, unknown>;
  photos: {
    heroImage?: string;
    heroVideo?: string;
    exteriorImage?: string;
    interiorImage?: string;
    menuPlatterImage?: string;
    gallery: Array<{ key: string; caption: Loc }>;
  };
  hoursSummary: Loc;
  hoursRows: Array<{ days: Loc; time: string }>;
  hero: Record<string, Loc>;
  // `cards` holds the photo keys (shared across locales); the sv/en/ar keys hold that
  // locale's label/title/sub plus its own per-card text.
  featuredSection: {
    cards: Array<{ key: string }>;
  } & Record<string, { cards?: Array<Record<string, string>> } & Record<string, unknown>>;
  gallerySection: Record<string, Loc>;
  about: Record<string, Loc>;
  menuIntro: Record<string, Loc>;
  contact: Record<string, Loc>;
}

interface SeedCategory {
  menuType: "portion" | "kg";
  order: number;
  label: Loc;
  note?: Loc;
  priceUnit?: Loc;
  items: Array<{
    name: Loc;
    arabicName?: string;
    desc?: Loc;
    price?: string;
    priceOptions?: Array<{ label: Loc; price: string }>;
    tag?: Loc;
    photoKey?: string;
    orderable?: boolean;
  }>;
}

async function main() {
  const payload = await getPayload({ config });

  // ── Photos ────────────────────────────────────────────────────────────────
  // Upload each source file once and remember its id, so the content below can point at it.
  const mediaIds = new Map<string, string | number>();

  // Files are uploaded under their slot name ("rosengard-hero.webp") rather than the
  // original camera filename, so the owner can recognise them in the media library. Payload
  // takes the name from the file on disk, so each source is copied to a temp file first —
  // that also lets Payload sniff the real MIME type instead of us guessing from the
  // extension, which is wrong for the hero video (an MP4 whose container brand is M4V).
  const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), "eurofisk-seed-"));

  for (const photo of PHOTO_FILES) {
    const source = path.join(IMPORTS_DIR, photo.file);
    if (!fs.existsSync(source)) {
      console.warn(`  ! missing ${photo.file} — skipping`);
      continue;
    }

    const slotName = `${photo.key}${path.extname(photo.file)}`;

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: slotName } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      mediaIds.set(photo.key, existing.docs[0].id);
      console.log(`  = ${photo.key} (already uploaded)`);
      continue;
    }

    const filePath = path.join(stagingDir, slotName);
    fs.copyFileSync(source, filePath);

    const created = await payload.create({
      collection: "media",
      locale: "sv",
      data: { alt: photo.alt.sv },
      filePath,
    });

    // Fill in the other two languages of the alt text.
    for (const locale of ["en", "ar"] as const) {
      await payload.update({
        collection: "media",
        id: created.id,
        locale,
        data: { alt: photo.alt[locale] },
      });
    }

    mediaIds.set(photo.key, created.id);
    console.log(`  + ${photo.key}`);
  }

  const mediaId = (key?: string) => (key ? mediaIds.get(key) : undefined);

  // ── Locations ─────────────────────────────────────────────────────────────
  for (const branch of BRANCH_SEED as SeedBranch[]) {
    const existing = await payload.find({
      collection: "branches",
      where: { slug: { equals: branch.slug } },
      limit: 1,
    });

    // As with the menu: reuse the row ids from the Swedish pass so the other locales
    // translate the existing gallery/card rows instead of replacing them.
    let galleryIds: Array<string | undefined> = [];
    let cardIds: Array<string | undefined> = [];
    let hoursIds: Array<string | undefined> = [];

    // Swedish first (the default locale), then the translations on top of the same record.
    for (const locale of ["sv", "en", "ar"] as const) {
      const data = {
        ...branch.common,
        heroImage: mediaId(branch.photos.heroImage),
        heroVideo: mediaId(branch.photos.heroVideo),
        exteriorImage: mediaId(branch.photos.exteriorImage),
        interiorImage: mediaId(branch.photos.interiorImage),
        menuPlatterImage: mediaId(branch.photos.menuPlatterImage),
        gallery: branch.photos.gallery.map((g, i) => ({
          ...(galleryIds[i] ? { id: galleryIds[i] } : {}),
          photo: mediaId(g.key),
          caption: g.caption[locale],
        })),
        hoursSummary: branch.hoursSummary[locale],
        hoursRows: branch.hoursRows.map((r, i) => ({
          ...(hoursIds[i] ? { id: hoursIds[i] } : {}),
          days: r.days[locale],
          time: r.time,
        })),
        hero: branch.hero[locale],
        featuredSection: {
          ...branch.featuredSection[locale],
          cards: branch.featuredSection.cards.map((c, i) => ({
            ...(cardIds[i] ? { id: cardIds[i] } : {}),
            photo: mediaId(c.key),
            ...(branch.featuredSection[locale]?.cards?.[i] ?? {}),
          })),
        },
        gallerySection: branch.gallerySection[locale],
        about: branch.about[locale],
        menuIntro: branch.menuIntro[locale],
        contact: branch.contact[locale],
      };

      const saved =
        existing.docs.length > 0
          ? await payload.update({ collection: "branches", id: existing.docs[0].id, locale, data })
          : await payload.create({ collection: "branches", locale, data });

      if (existing.docs.length === 0) existing.docs.push(saved as never);

      if (locale === "sv") {
        const doc = saved as {
          gallery?: Array<{ id?: string }>;
          hoursRows?: Array<{ id?: string }>;
          featuredSection?: { cards?: Array<{ id?: string }> };
        };
        galleryIds = (doc.gallery ?? []).map((r) => r.id);
        hoursIds = (doc.hoursRows ?? []).map((r) => r.id);
        cardIds = (doc.featuredSection?.cards ?? []).map((r) => r.id);
      }
    }
    console.log(`  + location: ${branch.slug}`);
  }

  // ── Menu ──────────────────────────────────────────────────────────────────
  for (const category of MENU_SEED as SeedCategory[]) {
    const existing = await payload.find({
      collection: "menu-categories",
      where: { and: [{ menuType: { equals: category.menuType } }, { order: { equals: category.order } }] },
      limit: 1,
    });

    // Array rows are matched by id across locales. Without reusing the ids Payload created
    // for Swedish, updating the English pass would replace the rows rather than translate
    // them — losing the photo relations, which are not localized.
    let rowIds: Array<{ id?: string; optionIds: Array<string | undefined> }> = [];

    for (const locale of ["sv", "en", "ar"] as const) {
      const data = {
        menuType: category.menuType,
        order: category.order,
        label: category.label[locale],
        note: category.note?.[locale],
        priceUnit: category.priceUnit?.[locale],
        items: category.items.map((item, i) => ({
          ...(rowIds[i]?.id ? { id: rowIds[i].id } : {}),
          name: item.name[locale],
          arabicName: item.arabicName,
          desc: item.desc?.[locale],
          priceMode: item.priceOptions ? "options" : "single",
          price: item.price,
          priceOptions: item.priceOptions?.map((o, oi) => ({
            ...(rowIds[i]?.optionIds[oi] ? { id: rowIds[i].optionIds[oi] } : {}),
            label: o.label[locale],
            price: o.price,
          })),
          tag: item.tag?.[locale],
          photo: mediaId(item.photoKey),
          orderable: item.orderable ?? true,
        })),
      };

      const saved =
        existing.docs.length > 0
          ? await payload.update({ collection: "menu-categories", id: existing.docs[0].id, locale, data })
          : await payload.create({ collection: "menu-categories", locale, data });

      if (existing.docs.length === 0) existing.docs.push(saved as never);

      // Capture the ids the first pass generated so the other locales reuse them.
      if (locale === "sv") {
        rowIds = ((saved as { items?: Array<{ id?: string; priceOptions?: Array<{ id?: string }> }> }).items ?? []).map(
          (row) => ({ id: row.id, optionIds: (row.priceOptions ?? []).map((o) => o.id) }),
        );
      }
    }
    console.log(`  + menu section: ${category.label.sv} (${category.menuType})`);
  }

  // ── Site-wide text ────────────────────────────────────────────────────────
  for (const locale of ["sv", "en", "ar"] as const) {
    await payload.updateGlobal({
      slug: "site-settings",
      locale,
      data: { ...SITE_SETTINGS_SEED[locale], logo: mediaId("logo") },
    });
  }
  console.log("  + site-wide text");

  fs.rmSync(stagingDir, { recursive: true, force: true });

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
