import type { Lang } from "./LangContext";

export interface KgMenuItem {
  name: string;
  arabic: string;
  rawPrice: string;
  preparedPrice: string;
}

export interface KgMenu {
  title: string;
  subtitle: string;
  rawLabel: string;
  preparedLabel: string;
  priceNote: string;
  items: KgMenuItem[];
}

const kgItemsSv: KgMenuItem[] = [
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
    title: "Fisk per kg",
    subtitle: "Välj mellan grillad, friterad eller rå fisk.",
    rawLabel: "Rå",
    preparedLabel: "Tillagad",
    priceNote: "Alla priser anges per kilogram.",
    items: kgItemsSv,
  },
  en: {
    title: "Fish by the kg",
    subtitle: "Choose grilled, fried or raw fish.",
    rawLabel: "Raw",
    preparedLabel: "Prepared",
    priceNote: "All prices are per kilogram.",
    items: kgItemsSv.map((item, index) => ({
      ...item,
      name: englishNames[index],
    })),
  },
};
