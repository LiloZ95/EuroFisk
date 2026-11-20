import { ltr } from "./bidi";
import { stripLangFromPath, type Lang } from "./LangContext";

export type BranchId = "rosengard";
export type BranchMenuType = "portion" | "kg";

export interface Branch {
  id: BranchId;
  slug: string;
  area: string;
  name: string;
  address: string;
  mapsUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  menuType: BranchMenuType;
  /** Widest daily window, used to bound the pickup/arrival time input. */
  serviceHours: { opens: string; closes: string };
  hours: {
    summary: Record<Lang, string>;
    rows: Array<{
      days: Record<Lang, string>;
      time: string;
    }>;
  };
}

// Public restaurant configuration. Archived CMS branches are not published.
export const BRANCHES: Record<BranchId, Branch> = {
  rosengard: {
    id: "rosengard",
    slug: "rosengard",
    area: "Rosengård",
    name: "EuroFisk (Rosengård)",
    address: "Adlerfelts väg, 213 70 Malmö",
    mapsUrl:
      "https://www.google.com/maps/place//data=!4m2!3m1!1s0x4653a102e35188f7:0x83d21f1962b16c08?sa=X&ved=1t:8290&ictx=111",
    phoneDisplay: ltr("+46 79 016 48 13"),
    phoneHref: "tel:+46790164813",
    whatsappNumber: "46790164813",
    menuType: "portion",
    serviceHours: { opens: "10:00", closes: "20:00" },
    hours: {
      summary: {
        sv: `Mån–tis ${ltr("10–19")} · Ons–sön ${ltr("10–20")}`,
        en: `Mon–Tue ${ltr("10am–7pm")} · Wed–Sun ${ltr("10am–8pm")}`,
        ar: `الإثنين–الثلاثاء ${ltr("10–19")} · الأربعاء–الأحد ${ltr("10–20")}`,
      },
      rows: [
        {
          days: { sv: "Måndag–tisdag", en: "Monday–Tuesday", ar: "الإثنين–الثلاثاء" },
          time: ltr("10:00–19:00"),
        },
        {
          days: { sv: "Onsdag–söndag", en: "Wednesday–Sunday", ar: "الأربعاء–الأحد" },
          time: ltr("10:00–20:00"),
        },
      ],
    },
  },

};

export const BRANCH_IDS = Object.keys(BRANCHES) as BranchId[];

export function getBranchIdFromPath(pathname: string): BranchId | null {
  const firstSegment = stripLangFromPath(pathname).split("/").filter(Boolean)[0];
  return BRANCH_IDS.find((id) => BRANCHES[id].slug === firstSegment) ?? null;
}

export function stripBranchFromPath(pathname: string) {
  const unprefixedPath = stripLangFromPath(pathname);
  // Recognize the retired path only so old links can redirect to Rosengård.
  const prefix = unprefixedPath.match(/^\/(?:rosengard|ostra-sorgenfri)(?=\/|$)/)?.[0];
  return prefix ? unprefixedPath.slice(prefix.length) || "/" : unprefixedPath || "/";
}

export function branchPath(branchId: BranchId, pagePath = "/") {
  const normalizedPage = pagePath === "/" ? "" : pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  return `/${BRANCHES[branchId].slug}${normalizedPage}`;
}
