import type { Lang } from "./LangContext";
import {
  guldsparidCard,
  havsabborreCard,
  laxfileCard,
  shrimpPlatterImg,
} from "./images";

/** A named price variant of one item, e.g. raw vs prepared on the per-kilo menu. */
export interface MenuPriceOption {
  label: string;
  price: string;
}

export interface MenuItem {
  name: string;
  /** Secondary Arabic name shown under the dish. Omitted in the `ar` menu, where
   *  `name` already is the Arabic one and the second line would just repeat it. */
  arabic?: string;
  desc?: string;
  /** Single price. Items priced per variant use `options` instead. */
  price?: string;
  options?: MenuPriceOption[];
  tag?: string;
  photo?: string;
  orderable?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  note?: string;
  /** Appended to the WhatsApp order line so "Rå" reads as "Rå (pris per kg)". */
  priceUnit?: string;
  items: MenuItem[];
}

const includedSv =
  "Serveras med fattoush & sallad, husets såser och friterat pitabröd.";
const includedEn =
  "Served with fattoush & salad, house sauces and fried pita bread.";
const includedAr =
  "يُقدَّم مع الفتوش والسلطة وصلصات المطعم وخبز البيتا المقلي.";

export const MENU_DATA: Record<Lang, MenuCategory[]> = {
  sv: [
    {
      id: "grillat-friterat",
      label: "Grillat / Friterat",
      note: "Välj grillat eller friterat. Tillbehören i vår portionsmeny ingår.",
      items: [
        {
          name: "Guldsparid",
          arabic: "اجاج",
          desc: includedSv,
          price: "149 kr",
          photo: guldsparidCard,
        },
        {
          name: "Havsabborre",
          arabic: "قاروص",
          desc: includedSv,
          price: "149 kr",
          photo: havsabborreCard,
        },
        {
          name: "Räkor",
          arabic: "روبيان",
          desc: includedSv,
          price: "149 kr",
          photo: shrimpPlatterImg,
        },
        {
          name: "Laxfilé",
          arabic: "فيليه سلمون",
          desc: includedSv,
          price: "149 kr",
          photo: laxfileCard,
        },
      ],
    },
    {
      id: "friterat",
      label: "Friterat",
      note: "Friteras på beställning och serveras med portionsmenyns tillbehör.",
      items: [
        {
          name: "Rödmullet",
          arabic: "سلطان إبراهيم",
          desc: includedSv,
          price: "149 kr",
        },
        {
          name: "Sardiner",
          arabic: "سردين",
          desc: includedSv,
          price: "149 kr",
        },
        {
          name: "Kalamari",
          arabic: "كاليماري",
          desc: includedSv,
          price: "149 kr",
        },
      ],
    },
    {
      id: "tillbehor",
      label: "Tillbehör",
      items: [
        { name: "Pommes", desc: "Extra portion pommes.", price: "20 kr" },
        { name: "Hummus", desc: "Extra portion hummus.", price: "20 kr" },
        { name: "Dryck", desc: "Valfri dryck enligt restaurangens utbud.", price: "15 kr" },
      ],
    },
    {
      id: "ingar",
      label: "Ingår i varje portion",
      note: "Dessa tillbehör ingår i alla huvudrätter ovan.",
      items: [
        {
          name: "Fattoush & sallad",
          desc: "Färsk sallad med fattoush.",
          price: "Ingår",
          orderable: false,
        },
        {
          name: "Husets såser",
          desc: "Restaurangens såser serveras till portionen.",
          price: "Ingår",
          orderable: false,
        },
        {
          name: "Friterat pitabröd",
          desc: "Krispigt friterat pitabröd.",
          price: "Ingår",
          orderable: false,
        },
      ],
    },
  ],
  en: [
    {
      id: "grillat-friterat",
      label: "Grilled / Fried",
      note: "Choose grilled or fried. The portion-menu accompaniments are included.",
      items: [
        {
          name: "Gilthead Bream",
          arabic: "اجاج",
          desc: includedEn,
          price: "149 kr",
          photo: guldsparidCard,
        },
        {
          name: "Sea Bass",
          arabic: "قاروص",
          desc: includedEn,
          price: "149 kr",
          photo: havsabborreCard,
        },
        {
          name: "Prawns",
          arabic: "روبيان",
          desc: includedEn,
          price: "149 kr",
          photo: shrimpPlatterImg,
        },
        {
          name: "Salmon Fillet",
          arabic: "فيليه سلمون",
          desc: includedEn,
          price: "149 kr",
          photo: laxfileCard,
        },
      ],
    },
    {
      id: "friterat",
      label: "Fried",
      note: "Fried to order and served with the portion-menu accompaniments.",
      items: [
        {
          name: "Red Mullet",
          arabic: "سلطان إبراهيم",
          desc: includedEn,
          price: "149 kr",
        },
        {
          name: "Sardines",
          arabic: "سردين",
          desc: includedEn,
          price: "149 kr",
        },
        {
          name: "Calamari",
          arabic: "كاليماري",
          desc: includedEn,
          price: "149 kr",
        },
      ],
    },
    {
      id: "tillbehor",
      label: "Sides",
      items: [
        { name: "Fries", desc: "Extra portion of fries.", price: "20 kr" },
        { name: "Hummus", desc: "Extra portion of hummus.", price: "20 kr" },
        { name: "Drink", desc: "Any drink from the restaurant's available selection.", price: "15 kr" },
      ],
    },
    {
      id: "ingar",
      label: "Included with every portion",
      note: "These accompaniments are included with every main dish above.",
      items: [
        {
          name: "Fattoush & salad",
          desc: "Fresh salad with fattoush.",
          price: "Included",
          orderable: false,
        },
        {
          name: "House sauces",
          desc: "The restaurant's sauces are served with the portion.",
          price: "Included",
          orderable: false,
        },
        {
          name: "Fried pita bread",
          desc: "Crispy fried pita bread.",
          price: "Included",
          orderable: false,
        },
      ],
    },
  ],
  ar: [
    {
      id: "grillat-friterat",
      label: "مشاوي / مقالي",
      note: "اختر مشوي أو مقلي. مقبّلات قائمة الوجبة مشمولة.",
      items: [
        {
          name: "اجاج",
          desc: includedAr,
          price: "149 kr",
          photo: guldsparidCard,
        },
        {
          name: "قاروص",
          desc: includedAr,
          price: "149 kr",
          photo: havsabborreCard,
        },
        {
          name: "روبيان",
          desc: includedAr,
          price: "149 kr",
          photo: shrimpPlatterImg,
        },
        {
          name: "فيليه سلمون",
          desc: includedAr,
          price: "149 kr",
          photo: laxfileCard,
        },
      ],
    },
    {
      id: "friterat",
      label: "مقالي",
      note: "يُقلى عند الطلب ويُقدَّم مع مقبّلات قائمة الوجبة.",
      items: [
        {
          name: "سلطان إبراهيم",
          desc: includedAr,
          price: "149 kr",
        },
        {
          name: "سردين",
          desc: includedAr,
          price: "149 kr",
        },
        {
          name: "كاليماري",
          desc: includedAr,
          price: "149 kr",
        },
      ],
    },
    {
      id: "tillbehor",
      label: "إضافات",
      items: [
        { name: "بطاطا مقلية", desc: "حصة إضافية من البطاطا المقلية.", price: "20 kr" },
        { name: "حمّص", desc: "حصة إضافية من الحمّص.", price: "20 kr" },
        { name: "مشروب", desc: "أي مشروب من المتوفّر لدى المطعم.", price: "15 kr" },
      ],
    },
    {
      id: "ingar",
      label: "مشمول مع كل وجبة",
      note: "هذه المقبّلات مشمولة مع كل طبق رئيسي أعلاه.",
      items: [
        {
          name: "فتوش وسلطة",
          desc: "سلطة طازجة مع الفتوش.",
          price: "مشمول",
          orderable: false,
        },
        {
          name: "صلصات المطعم",
          desc: "تُقدَّم صلصات المطعم مع الوجبة.",
          price: "مشمول",
          orderable: false,
        },
        {
          name: "خبز بيتا مقلي",
          desc: "خبز بيتا مقلي ومقرمش.",
          price: "مشمول",
          orderable: false,
        },
      ],
    },
  ],
};
