import type { Lang } from "./LangContext";

/** Concise copy for the restaurant's new ordering flow and condensed home page. */
export const RESTAURANT_COPY = {
  sv: {
    orderTitle: "Beställ nu",
    orderSub: "Välj dina favoriter och beställ online.",
    orderHint: "Du fortsätter till order.site.",
    close: "Stäng",
    heroSub: "Kolgrillat, krispigt och fullt av smak. Njut här, hämta eller beställ hem.",
    aboutTitle: "Lagat med hjärta",
    aboutBody: "Fisk över glödande kol, krispiga favoriter och generösa skaldjursrätter. Välkommen till vårt kök i Rosengård.",
    contactTitle: "Vi ses i Rosengård!",
    contactSub: "Kom förbi, ring oss eller beställ din favorit online.",
  },
  en: {
    orderTitle: "Order now",
    orderSub: "Choose your favourites and order online.",
    orderHint: "Continue to order.site.",
    close: "Close",
    heroSub: "Charcoal-grilled, crispy and full of flavour. Eat here, pick up or order in.",
    aboutTitle: "Made with heart",
    aboutBody: "Fish over glowing coals, crispy favourites and generous seafood dishes. Welcome to our kitchen in Rosengård.",
    contactTitle: "See you in Rosengård!",
    contactSub: "Drop by, give us a call or order your favourite online.",
  },
  ar: {
    orderTitle: "اطلب الآن",
    orderSub: "اختر أطباقك المفضّلة واطلب أونلاين.",
    orderHint: "ستنتقل إلى order.site.",
    close: "إغلاق",
    heroSub: "مشوي على الفحم، مقرمش ومليان نكهة. كُل عندنا، استلم طلبك أو اطلبه للبيت.",
    aboutTitle: "مطبوخ من القلب",
    aboutBody: "سمك على الجمر، أطباق مقرمشة ومأكولات بحرية بحصص سخية. أهلاً بك في مطبخنا في Rosengård.",
    contactTitle: "نراك في Rosengård!",
    contactSub: "زورنا، اتصل بنا أو اطلب طبقك المفضّل أونلاين.",
  },
} satisfies Record<Lang, Record<string, string>>;
