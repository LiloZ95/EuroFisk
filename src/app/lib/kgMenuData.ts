import type { Lang } from "./LangContext";
import type { MenuCategory } from "./menuData";
import type { Translation } from "./translations";

export interface KgMenuItem {
  name: string;
  /** Secondary Arabic name shown under the fish. Omitted in the `ar` menu, where
   *  `name` already is the Arabic one and the second line would just repeat it. */
  arabic?: string;
  rawPrice: string;
  preparedPrice: string;
}

export interface KgMenu {
  rawLabel: string;
  preparedLabel: string;
  items: KgMenuItem[];
}

// The Arabic name is required here because the `ar` menu is derived from it.
const kgItemsSv: Array<KgMenuItem & { arabic: string }> = [
  { name: "Guldsparid", arabic: "اجاج", rawPrice: "129 kr", preparedPrice: "219 kr" },
  { name: "Havsabborre", arabic: "براق", rawPrice: "139 kr", preparedPrice: "219 kr" },
  { name: "Karp", arabic: "كارب", rawPrice: "119 kr", preparedPrice: "199 kr" },
  { name: "Sardiner", arabic: "سردين", rawPrice: "119 kr", preparedPrice: "199 kr" },
  { name: "Grå multe", arabic: "بوري", rawPrice: "129 kr", preparedPrice: "199 kr" },
  { name: "Kalamari", arabic: "كالاماري", rawPrice: "199 kr", preparedPrice: "299 kr" },
  { name: "Rödpagell", arabic: "جريدي", rawPrice: "199 kr", preparedPrice: "299 kr" },
  { name: "Rödmullet", arabic: "سلطان إبراهيم", rawPrice: "199 kr", preparedPrice: "299 kr" },
  { name: "Lax", arabic: "سلمون", rawPrice: "199 kr", preparedPrice: "299 kr" },
  { name: "Räkor", arabic: "روبيان", rawPrice: "199 kr", preparedPrice: "299 kr" },
  { name: "Rödbraxen", arabic: "فريدي", rawPrice: "219 kr", preparedPrice: "299 kr" },
  { name: "Barracuda", arabic: "مليفة", rawPrice: "199 kr", preparedPrice: "299 kr" },
  { name: "Oxögonfisk", arabic: "زوري / غبص", rawPrice: "149 kr", preparedPrice: "219 kr" },
  { name: "Kummel", arabic: "عرموط", rawPrice: "199 kr", preparedPrice: "299 kr" },
];

const englishNames = [
  "Gilthead Bream",
  "Sea Bass",
  "Carp",
  "Sardines",
  "Grey Mullet",
  "Calamari",
  "Red Porgy",
  "Red Mullet",
  "Salmon",
  "Prawns",
  "Red Seabream",
  "Barracuda",
  "Bigeye Fish",
  "Hake",
];

export const KG_MENU_DATA: Record<Lang, KgMenu> = {
  sv: {
    rawLabel: "Rå",
    preparedLabel: "Tillagad",
    items: kgItemsSv,
  },
  en: {
    rawLabel: "Raw",
    preparedLabel: "Prepared",
    items: kgItemsSv.map((item, index) => ({
      ...item,
      name: englishNames[index],
    })),
  },
  ar: {
    rawLabel: "نيء",
    preparedLabel: "محضَّر",
    items: kgItemsSv.map(({ arabic, ...item }) => ({
      ...item,
      name: arabic,
    })),
  },
};

/**
 * Adapts the per-kilo price list into the same category/item shape the portion menu uses,
 * so both branches render through one layout. The two prices become the item's `options`.
 */
export function kgCategories(lang: Lang, t: Translation): MenuCategory[] {
  const menu = KG_MENU_DATA[lang];

  return [
    {
      id: "fisk-per-kg",
      label: t.kgCategoryLabel,
      note: t.kgIntro,
      priceUnit: t.kgPricePerKg,
      items: menu.items.map((item) => ({
        name: item.name,
        arabic: item.arabic,
        options: [
          { label: menu.rawLabel, price: item.rawPrice },
          { label: menu.preparedLabel, price: item.preparedPrice },
        ],
      })),
    },
  ];
}
