import type { BranchId } from "./branches";
import { exteriorImg, heroImg, interiorImg } from "./images";

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

export function imagesFor(branchId: BranchId): BranchImages {
  return BRANCH_IMAGES[branchId];
}
