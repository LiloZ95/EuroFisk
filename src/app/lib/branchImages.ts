import type { BranchId } from "./branches";
import { exteriorImg, heroImg, interiorImg } from "./images";
import { cmsBranch, mediaUrl } from "./cmsContent";
import type { Lang } from "./LangContext";

// Östra Sorgenfri's own photography — the fish counter, not the grill kitchen.
import stallExterior from "@/imports/ostra-sorgenfri/stall-exterior.webp";
import counterLong from "@/imports/ostra-sorgenfri/counter-long.webp";
import counterCrabsHake from "@/imports/ostra-sorgenfri/counter-crabs-hake.webp";

// Grilling footage: only true of the Rosengård kitchen. The counter branch shows a still.
import heroVideo from "@/imports/hero-grill-salmon.mp4";

export interface BranchImages {
  /** Full-bleed background behind the hero headline. */
  hero: string;
  exterior: string;
  interior: string;
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
    exterior: exteriorImg,
    interior: interiorImg,
    heroVideo,
  },
  "ostra-sorgenfri": {
    hero: counterLong,
    exterior: stallExterior,
    interior: counterCrabsHake,
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
    exterior: mediaUrl(b.photos.exterior, "hero") || fallback.exterior,
    interior: mediaUrl(b.photos.interior, "hero") || fallback.interior,
    // A branch with no video in the CMS genuinely has none — don't resurrect the bundled
    // one, or Östra Sorgenfri would start showing the Rosengård grill again.
    heroVideo: mediaUrl(b.photos.heroVideo, "original") || undefined,
  };
}
