import { cmsLocale } from "./cmsContent";
import type { Lang } from "./LangContext";
import type { BranchMenuType } from "./branches";
import { kgCategories } from "./kgMenuData";
import { MENU_DATA, type MenuCategory } from "./menuData";
import type { Translation } from "./translations";

/**
 * The menu for a branch, preferring what the CMS supplies.
 *
 * Returns the same `MenuCategory[]` shape the hard-coded data always did, so the menu page
 * consumes it unchanged. When the CMS has no sections of the requested type — a fresh
 * clone with no content.json, or a menu the owner has not filled in — this falls back to
 * the arrays that ship in the repo.
 */
export function menuFor(
  menuType: BranchMenuType,
  lang: Lang,
  t: Translation,
): MenuCategory[] {
  const fallback = menuType === "kg" ? kgCategories(lang, t) : MENU_DATA[lang];

  const sections = (cmsLocale(lang)?.menu ?? [])
    .filter((c) => c.menuType === menuType)
    .sort((a, b) => a.order - b.order);

  if (sections.length === 0) return fallback;

  return sections.map((c) => ({
    id: c.id,
    label: c.label,
    note: c.note || undefined,
    priceUnit: c.priceUnit || undefined,
    items: c.items.map((i) => ({
      name: i.name,
      arabic: i.arabic,
      desc: i.desc,
      price: i.price,
      options: i.options,
      tag: i.tag,
      photo: i.photo,
      orderable: i.orderable,
    })),
  }));
}
