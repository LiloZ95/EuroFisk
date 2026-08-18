/**
 * Generates `data.ts` from the site's existing source files.
 *
 * Rather than retyping several hundred strings of Swedish, English and Arabic copy — and
 * risking a silent typo in a language nobody on the team proofreads — this loads the real
 * modules through Vite's SSR pipeline and serialises what they actually contain.
 *
 * Run from the repo root:  node cms/src/seed/generate.mjs
 * Re-run it if the source files change before the CMS goes live.
 */
import { createServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "../../..");

const server = await createServer({
  root: repoRoot,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "warn",
});

const load = (p) => server.ssrLoadModule(p);

const { T } = await load("/src/app/lib/translations.ts");
const { BRANCHES } = await load("/src/app/lib/branches.ts");
const { MENU_DATA } = await load("/src/app/lib/menuData.ts");
const { KG_MENU_DATA } = await load("/src/app/lib/kgMenuData.ts");
const { copyFor } = await load("/src/app/lib/branchCopy.ts");

const LANGS = ["sv", "en", "ar"];
const byLang = (fn) => Object.fromEntries(LANGS.map((l) => [l, fn(l)]));

// ── Photo slots ─────────────────────────────────────────────────────────────
// Maps each source file to the stable key the seed script uploads it under.
const PHOTO_FILES = [
  { key: "logo", file: "eurofisk-logo-transparent.webp", alt: byLang(() => "EuroFisk") },
  { key: "hero-video", file: "hero-grill-salmon.mp4", alt: byLang(() => "") },

  { key: "rosengard-hero", file: "720946626_18111809275785649_9222392841617946435_n.webp",
    alt: { sv: "EuroFisk grillad fisk", en: "EuroFisk grilled fish", ar: "سمك مشوي من EuroFisk" } },
  { key: "rosengard-exterior", file: "566195161_1102427925211751_5067642239529561451_n.webp",
    alt: { sv: "EuroFisk utifrån", en: "EuroFisk exterior", ar: "واجهة EuroFisk من الخارج" } },
  { key: "rosengard-interior", file: "725947039_18113287858785649_7163341319390753622_n.webp",
    alt: { sv: "Restaurangens matsal", en: "Restaurant dining area", ar: "صالة المطعم من الداخل" } },
  { key: "rosengard-featured-1", file: "740594412_1303242941796914_1231758959184970134_n.webp",
    alt: { sv: "Hel grillad guldsparid", en: "Whole grilled bream", ar: "سمكة اجاج كاملة مشوية" } },
  { key: "rosengard-featured-2", file: "737550945_1303242938463581_1649297779520794798_n.webp",
    alt: { sv: "Grillad laxfilé", en: "Grilled salmon fillet", ar: "فيليه سلمون مشوي" } },
  { key: "rosengard-featured-3", file: "738040921_1303242945130247_8074259589386338750_n.webp",
    alt: { sv: "Hel grillad havsabborre", en: "Whole grilled sea bass", ar: "سمكة قاروص كاملة مشوية" } },
  { key: "rosengard-gallery-1", file: "719301082_18111809287785649_8243644206559662839_n.webp",
    alt: { sv: "Grillad fisk och räkor på bord", en: "Grilled fish and prawns spread", ar: "سمك مشوي وروبيان على الطاولة" } },
  { key: "rosengard-gallery-2", file: "581500223_1125924292862114_7329200820988390004_n.webp",
    alt: { sv: "Färsk fisk och räkor på fat", en: "Fresh fish and shrimp display", ar: "سمك وروبيان طازج معروض" } },
  { key: "rosengard-gallery-3", file: "725191264_18113287450785649_8734965326228817069_n.webp",
    alt: { sv: "Räkplanka med såser", en: "Prawn platter with sauces", ar: "طبق روبيان مع الصلصات" } },

  { key: "os-hero", file: "ostra-sorgenfri/counter-long.webp",
    alt: { sv: "Fiskdisken", en: "The fish counter", ar: "ثلاجة السمك" } },
  { key: "os-exterior", file: "ostra-sorgenfri/stall-exterior.webp",
    alt: { sv: "EuroFisks fiskdisk i Östra Sorgenfri utifrån", en: "The EuroFisk fish counter in Östra Sorgenfri from outside", ar: "محل EuroFisk للسمك في Östra Sorgenfri من الخارج" } },
  { key: "os-interior", file: "ostra-sorgenfri/counter-crabs-hake.webp",
    alt: { sv: "Krabbor och kummel i disken", en: "Crabs and hake at the counter", ar: "سلطعون وعرموط في الثلاجة" } },
  { key: "os-featured-1", file: "ostra-sorgenfri/bream-on-ice.webp",
    alt: { sv: "Hel färsk guldsparid på is", en: "Whole fresh bream on ice", ar: "سمكة اجاج كاملة طازجة على الثلج" } },
  { key: "os-featured-2", file: "ostra-sorgenfri/salmon-fillets.webp",
    alt: { sv: "Färsk lax i disken", en: "Fresh salmon at the counter", ar: "سلمون طازج في الثلاجة" } },
  { key: "os-featured-3", file: "ostra-sorgenfri/prawns.webp",
    alt: { sv: "Färska räkor ur disken", en: "Fresh prawns from the counter", ar: "روبيان طازج من الثلاجة" } },
  { key: "os-gallery-1", file: "ostra-sorgenfri/gurnard-squid.webp",
    alt: { sv: "Röd knorrhane och bläckfisk på is", en: "Red gurnard and squid on ice", ar: "سمك الحرّ الأحمر والحبار على الثلج" } },
  { key: "os-gallery-2", file: "ostra-sorgenfri/sardines-on-ice.webp",
    alt: { sv: "Färska sardiner på is", en: "Fresh sardines on ice", ar: "سردين طازج على الثلج" } },
  { key: "os-gallery-3", file: "ostra-sorgenfri/crabs-on-ice.webp",
    alt: { sv: "Blåkrabbor på is i disken", en: "Blue crabs on ice at the counter", ar: "سلطعون أزرق على الثلج في الثلاجة" } },
];

// Which photo key fills each slot, per branch.
const BRANCH_PHOTOS = {
  rosengard: {
    heroImage: "rosengard-hero",
    heroVideo: "hero-video",
    exteriorImage: "rosengard-exterior",
    interiorImage: "rosengard-interior",
    menuPlatterImage: "rosengard-gallery-3",
    featured: ["rosengard-featured-1", "rosengard-featured-2", "rosengard-featured-3"],
    gallery: ["rosengard-gallery-1", "rosengard-gallery-2", "rosengard-gallery-3", "rosengard-interior", "rosengard-exterior"],
  },
  "ostra-sorgenfri": {
    heroImage: "os-hero",
    heroVideo: undefined, // grilling footage is the Rosengård kitchen, not this counter
    exteriorImage: "os-exterior",
    interiorImage: "os-interior",
    menuPlatterImage: "os-featured-3",
    featured: ["os-featured-1", "os-featured-2", "os-featured-3"],
    gallery: ["os-gallery-1", "os-gallery-2", "os-gallery-3", "os-featured-3", "os-exterior"],
  },
};

// ── Branches ────────────────────────────────────────────────────────────────
const BRANCH_SEED = Object.values(BRANCHES).map((b) => {
  const photos = BRANCH_PHOTOS[b.id];
  const copy = byLang((l) => copyFor(b.id, l));

  return {
    slug: b.slug,
    common: {
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
    },
    photos: {
      heroImage: photos.heroImage,
      heroVideo: photos.heroVideo,
      exteriorImage: photos.exteriorImage,
      interiorImage: photos.interiorImage,
      menuPlatterImage: photos.menuPlatterImage,
      gallery: photos.gallery.map((key, i) => ({
        key,
        caption: byLang((l) => copy[l].gallery[i]?.alt ?? ""),
      })),
    },
    hoursSummary: b.hours.summary,
    hoursRows: b.hours.rows.map((r) => ({ days: r.days, time: r.time })),
    hero: byLang((l) => ({
      badge: copy[l].heroBadge,
      title1: copy[l].heroTitle1,
      title2: copy[l].heroTitle2,
      title3: copy[l].heroTitle3,
      sub: copy[l].heroSub,
      menuCta: copy[l].heroMenu,
      bookCta: copy[l].heroBook,
    })),
    featuredSection: {
      cards: photos.featured.map((key) => ({ key })),
      ...byLang((l) => ({
        label: copy[l].featuredLabel,
        title: copy[l].featuredTitle,
        sub: copy[l].featuredSub,
        cards: copy[l].featured.map((f) => ({ name: f.name, tag: f.tag, desc: f.desc })),
      })),
    },
    gallerySection: byLang((l) => ({ label: copy[l].galleryLabel, title: copy[l].galleryTitle })),
    about: byLang((l) => ({
      label: copy[l].aboutLabel,
      title: copy[l].aboutTitle,
      p1: copy[l].aboutP1,
      p2: copy[l].aboutP2,
    })),
    menuIntro: byLang((l) => ({
      sub: copy[l].menuPageSub,
      note: copy[l].menuNote,
      dishesWord: copy[l].menuDishes,
    })),
    contact: byLang((l) => ({ sub: copy[l].contactSub })),
  };
});

// ── Menu ────────────────────────────────────────────────────────────────────
// The portion menu is per-language arrays that line up index for index.
const photoUrlToKey = new Map();
{
  const images = await load("/src/app/lib/images.ts");
  photoUrlToKey.set(images.guldsparidCard, "rosengard-featured-1");
  photoUrlToKey.set(images.laxfileCard, "rosengard-featured-2");
  photoUrlToKey.set(images.havsabborreCard, "rosengard-featured-3");
  photoUrlToKey.set(images.shrimpPlatterImg, "rosengard-gallery-3");
}

const MENU_SEED = MENU_DATA.sv.map((cat, catIndex) => ({
  menuType: "portion",
  order: catIndex,
  label: byLang((l) => MENU_DATA[l][catIndex].label),
  note: byLang((l) => MENU_DATA[l][catIndex].note ?? ""),
  priceUnit: byLang((l) => MENU_DATA[l][catIndex].priceUnit ?? ""),
  items: cat.items.map((item, i) => ({
    name: byLang((l) => MENU_DATA[l][catIndex].items[i].name),
    arabicName: item.arabic ?? "",
    desc: byLang((l) => MENU_DATA[l][catIndex].items[i].desc ?? ""),
    price: item.price,
    priceOptions: item.options
      ? item.options.map((o, oi) => ({
          label: byLang((l) => MENU_DATA[l][catIndex].items[i].options[oi].label),
          price: o.price,
        }))
      : undefined,
    tag: item.tag ? byLang((l) => MENU_DATA[l][catIndex].items[i].tag ?? "") : undefined,
    photoKey: photoUrlToKey.get(item.photo),
    orderable: item.orderable,
  })),
}));

// The per-kilo menu: one section whose items each carry a raw and a prepared price.
{
  const kg = KG_MENU_DATA.sv;
  MENU_SEED.push({
    menuType: "kg",
    order: 0,
    label: byLang((l) => T[l].kgCategoryLabel),
    note: byLang((l) => T[l].kgIntro),
    priceUnit: byLang((l) => T[l].kgPricePerKg),
    items: kg.items.map((item, i) => ({
      name: byLang((l) => KG_MENU_DATA[l].items[i].name),
      arabicName: item.arabic ?? "",
      desc: byLang(() => ""),
      priceOptions: [
        { label: byLang((l) => KG_MENU_DATA[l].rawLabel), price: item.rawPrice },
        { label: byLang((l) => KG_MENU_DATA[l].preparedLabel), price: item.preparedPrice },
      ],
      orderable: true,
    })),
  });
}

// ── Site-wide text ──────────────────────────────────────────────────────────
const pick = (l, keys) => Object.fromEntries(keys.map((k) => [k, T[l][k]]).filter(([, v]) => v !== undefined));
const SETTINGS_KEYS = [
  "navHome", "navMenu", "navReviews", "navContact", "navBook",
  "deliveryBadge", "deliveryTitle", "deliveryArea", "deliverySub", "deliveryCta",
  "formName", "formPhone", "formGuests", "formNote", "formOrder", "formAddress", "formSubmit",
  "modeBook", "modeOrder", "fulfillDineIn", "fulfillTakeaway", "fulfillDelivery",
  "waMsgIntro", "waMsgIntroTakeaway", "waMsgIntroDineIn", "waMsgIntroDelivery",
];
const SITE_SETTINGS_SEED = byLang((l) => pick(l, SETTINGS_KEYS));

// ── Write ───────────────────────────────────────────────────────────────────
const banner = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Produced by \`node cms/src/seed/generate.mjs\`, which reads the site's existing
 * translations, branch data and menus so the seed is an exact copy of what is live today.
 * Once the CMS is the source of truth this file is history; regenerate only if you reseed
 * from code.
 */

/* eslint-disable */
`;

const out =
  banner +
  `export const PHOTO_FILES = ${JSON.stringify(PHOTO_FILES, null, 2)} as const;\n\n` +
  `export const BRANCH_SEED = ${JSON.stringify(BRANCH_SEED, null, 2)} as any[];\n\n` +
  `export const MENU_SEED = ${JSON.stringify(MENU_SEED, null, 2)} as any[];\n\n` +
  `export const SITE_SETTINGS_SEED = ${JSON.stringify(SITE_SETTINGS_SEED, null, 2)} as any;\n`;

fs.writeFileSync(path.join(dirname, "data.ts"), out, "utf8");

console.log(`Wrote data.ts`);
console.log(`  photos:   ${PHOTO_FILES.length}`);
console.log(`  branches: ${BRANCH_SEED.length}`);
console.log(`  menu:     ${MENU_SEED.length} sections, ${MENU_SEED.reduce((n, c) => n + c.items.length, 0)} items`);

await server.close();
