import type { BranchId } from "./branches";
import { exteriorImg, heroImg, interiorImg, foodSpreadImg } from "./images";
import { cmsBranch, mediaUrl } from "./cmsContent";
import type { Lang } from "./LangContext";

import heroVideo from "@/imports/hero-grill-salmon.mp4";

export interface BranchImages {
  /** Full-bleed background behind the hero headline. */
  hero: string;
  /** Portrait beside the founder / chef story. */
  founder: string;
  exterior: string;
  interior: string;
  /** Image beside the blue About section. */
  about: string;
  /** Optional image in the menu-page header. */
  menuPlatter?: string;
  /** Omitted where no footage represents that branch honestly. */
  heroVideo?: string;
}

/**
 * The photos that ship in the repo. Used until the CMS has been set up, and as the
 * fallback for any slot the owner has left empty.
 */
export const BRANCH_IMAGES: Record<BranchId, BranchImages> = {
  rosengard: {
    hero: heroImg,
    founder: heroImg,
    exterior: exteriorImg,
    interior: interiorImg,
    about: exteriorImg,
    menuPlatter: foodSpreadImg,
    heroVideo,
  },

};

/**
 * Photos for a branch, preferring what the CMS supplies.
 *
 * `lang` only affects which locale's media record is read; the files themselves are the
 * same across languages, so callers that don't care can omit it.
 */
export function imagesFor(branchId: BranchId, lang: Lang = "sv"): BranchImages {
  const fallback = BRANCH_IMAGES[branchId];
  const b = cmsBranch(lang, branchId);
  if (!b) return fallback;

  return {
    hero: mediaUrl(b.photos.hero, "hero") || fallback.hero,
    founder: mediaUrl(b.photos.founder, "hero") || mediaUrl(b.photos.hero, "hero") || fallback.founder,
    exterior: mediaUrl(b.photos.exterior, "hero") || fallback.exterior,
    interior: mediaUrl(b.photos.interior, "hero") || fallback.interior,
    about: mediaUrl(b.photos.about, "hero") || mediaUrl(b.photos.exterior, "hero") || fallback.about,
    menuPlatter: mediaUrl(b.photos.menuPlatter, "card") || fallback.menuPlatter,
    // A branch with no video in the CMS genuinely has none — don't resurrect the bundled
    // one if the owner has removed it.
    heroVideo: mediaUrl(b.photos.heroVideo, "original") || undefined,
  };
}
