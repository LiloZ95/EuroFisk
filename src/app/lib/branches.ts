import type { Lang } from "./LangContext";

export type BranchId = "rosengard" | "ostra-sorgenfri";
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
  hours: {
    summary: Record<Lang, string>;
    rows: Array<{
      days: Record<Lang, string>;
      time: string;
    }>;
  };
}

// Both shops are reached on the same phone/WhatsApp line — the duplicated number below is
// intentional, not a copy-paste slip. Orders stay distinguishable because the WhatsApp
// message and the booking form both carry the selected branch name.
// `menuType` is the only thing deciding which menu a branch shows; swap the two values to
// swap the menus.
export const BRANCHES: Record<BranchId, Branch> = {
  rosengard: {
    id: "rosengard",
    slug: "rosengard",
    area: "Rosengård",
    name: "EuroFisk (Rosengård)",
    address: "Adlerfelts väg, 213 70 Malmö",
    mapsUrl:
      "https://www.google.com/maps/place//data=!4m2!3m1!1s0x4653a102e35188f7:0x83d21f1962b16c08?sa=X&ved=1t:8290&ictx=111",
    phoneDisplay: "+46 79 016 48 13",
    phoneHref: "tel:+46790164813",
    whatsappNumber: "46790164813",
    menuType: "portion",
    hours: {
      summary: {
        sv: "Mån–tis 10–19 · Ons–sön 10–20",
        en: "Mon–Tue 10am–7pm · Wed–Sun 10am–8pm",
      },
      rows: [
        { days: { sv: "Måndag–tisdag", en: "Monday–Tuesday" }, time: "10:00–19:00" },
        { days: { sv: "Onsdag–söndag", en: "Wednesday–Sunday" }, time: "10:00–20:00" },
      ],
    },
  },
  "ostra-sorgenfri": {
    id: "ostra-sorgenfri",
    slug: "ostra-sorgenfri",
    area: "Östra Sorgenfri",
    name: "EuroFisk (Östra Sorgenfri)",
    address: "Danska vägen 55, 212 29 Malmö",
    mapsUrl:
      "https://www.google.com/maps/place//data=!4m2!3m1!1s0x4653a1049f0fd71b:0x4c4b29459ec11c12?sa=X&ved=1t:8290&ictx=111",
    phoneDisplay: "+46 79 016 48 13",
    phoneHref: "tel:+46790164813",
    whatsappNumber: "46790164813",
    menuType: "kg",
    hours: {
      summary: {
        sv: "Alla dagar 09–18",
        en: "Daily 9am–6pm",
      },
      rows: [
        { days: { sv: "Måndag–söndag", en: "Monday–Sunday" }, time: "09:00–18:00" },
      ],
    },
  },
};

export const BRANCH_IDS = Object.keys(BRANCHES) as BranchId[];

export function getBranchIdFromPath(pathname: string): BranchId | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return BRANCH_IDS.find((id) => BRANCHES[id].slug === firstSegment) ?? null;
}

export function stripBranchFromPath(pathname: string) {
  const branchId = getBranchIdFromPath(pathname);
  if (!branchId) return pathname || "/";

  const prefix = `/${BRANCHES[branchId].slug}`;
  const rest = pathname.slice(prefix.length);
  return rest || "/";
}

export function branchPath(branchId: BranchId, pagePath = "/") {
  const normalizedPage = pagePath === "/" ? "" : pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  return `/${BRANCHES[branchId].slug}${normalizedPage}`;
}
