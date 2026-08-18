/**
 * Reads the content fetched from Payload at build time.
 *
 * `content.json` is written by `scripts/fetch-content.mjs` before every build. This module
 * is the only place that knows its shape — everything else in the app keeps using the same
 * `useT()` / `imagesFor()` / `BRANCHES` API it always has, so the CMS swap is invisible to
 * the components.
 *
 * When `content.json` is absent (a fresh clone with no CMS access, or a contributor working
 * offline), `CMS_AVAILABLE` is false and the callers fall back to the hard-coded data that
 * still lives in translations.ts / branches.ts. That keeps the repo buildable without
 * credentials.
 */
import type { Lang } from "./LangContext";
import type { BranchId } from "./branches";

export interface CmsMedia {
  url: string | null;
  card: string | null;
  hero: string | null;
  thumb: string | null;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface CmsBranch {
  slug: string;
  name: string;
  area: string;
  address: string;
  mapsUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  menuType: "portion" | "kg";
  serviceHours: { opens: string; closes: string };
  hoursSummary: string;
  hoursRows: Array<{ days: string; time: string }>;
  photos: {
    hero: CmsMedia | null;
    heroVideo: CmsMedia | null;
    exterior: CmsMedia | null;
    interior: CmsMedia | null;
    menuPlatter: CmsMedia | null;
  };
  gallery: Array<{ img: CmsMedia | null; caption: string }>;
  hero: Record<string, string>;
  featuredSection: {
    label: string;
    title: string;
    sub: string;
    cards: Array<{ img: CmsMedia | null; name: string; tag: string; desc: string }>;
  };
  gallerySection: Record<string, string>;
  about: Record<string, string>;
  menuIntro: Record<string, string>;
  contact: Record<string, string>;
}

export interface CmsMenuCategory {
  id: string;
  menuType: "portion" | "kg";
  order: number;
  label: string;
  note: string;
  priceUnit: string;
  items: Array<{
    name: string;
    arabic?: string;
    desc?: string;
    price?: string;
    options?: Array<{ label: string; price: string }>;
    tag?: string;
    photo?: string;
    orderable: boolean;
  }>;
}

export interface CmsLocale {
  branches: CmsBranch[];
  menu: CmsMenuCategory[];
  settings: Record<string, unknown> & { logo: CmsMedia | null };
}

export interface CmsContent {
  locales: Record<Lang, CmsLocale>;
  generatedFrom?: string;
}

// Vite resolves this at build time. `import.meta.glob` rather than a bare import so a
// missing file is an empty result instead of a build error.
const found = import.meta.glob<{ default: CmsContent }>("../../content/content.json", {
  eager: true,
});

const loaded = Object.values(found)[0]?.default;

/** True when a content.json was fetched and bundled. */
export const CMS_AVAILABLE = Boolean(loaded?.locales?.sv?.branches?.length);

export const CMS: CmsContent | null = CMS_AVAILABLE ? (loaded as CmsContent) : null;

export function cmsLocale(lang: Lang): CmsLocale | null {
  return CMS?.locales?.[lang] ?? null;
}

export function cmsBranch(lang: Lang, branchId: BranchId): CmsBranch | null {
  return cmsLocale(lang)?.branches.find((b) => b.slug === branchId) ?? null;
}

/**
 * Picks the right rendition for how the image is displayed. `hero` is the full-bleed
 * background; `card` covers the featured and gallery tiles.
 */
export function mediaUrl(
  m: CmsMedia | null | undefined,
  size: "hero" | "card" | "thumb" | "original" = "card",
): string {
  if (!m) return "";
  if (size === "original") return m.url ?? "";
  return m[size] ?? m.url ?? "";
}
