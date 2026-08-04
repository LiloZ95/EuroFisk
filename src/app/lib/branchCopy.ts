import { useMemo } from "react";
import { useBranch } from "./BranchContext";
import type { BranchId } from "./branches";
import { guldsparidCard, havsabborreCard, laxfileCard } from "./images";
import { useLang, type Lang } from "./LangContext";
import { T, type Translation } from "./translations";

type BranchOverrides = Partial<Record<Lang, Partial<Translation>>>;

/**
 * Östra Sorgenfri is a fresh fish counter, not a grill kitchen: the fish lies whole on ice,
 * you pick it yourself and pay by the kilo, and cooking it is optional. Only the keys that
 * actually describe that offer are overridden here — everything else falls through to the
 * shared copy in translations.ts, so a wording fix there still reaches both branches.
 *
 * The "Passion för fisk" / about section is deliberately NOT overridden: it is the brand
 * story and stays identical on both branches.
 */
const BRANCH_COPY: Partial<Record<BranchId, BranchOverrides>> = {
  "ostra-sorgenfri": {
    sv: {
      heroBadge: "Dagens fångst på is",
      heroTitle1: "Färsk fisk",
      heroTitle2: "per kilo",
      heroTitle3: "ur disken",
      heroSub:
        "Hel fisk och skaldjur på is, levererat färskt varje dag. Välj själv i disken — ta med den rå eller låt oss grilla eller fritera den medan du väntar.",
      heroMenu: "Se dagens priser",

      featuredLabel: "Ur disken",
      featuredTitle: "Dagens färskaste",
      featuredSub:
        "Fångsten kommer in färsk varje dag. Välj din fisk hel på is och betala per kilo.",
      // The photos are still the shared ones — swap them here when the counter gets its own.
      featured: [
        {
          img: guldsparidCard,
          name: "Guldsparid",
          tag: "Mild och lättlagad",
          desc: "Hel färsk guldsparid på is — köp per kilo, rå eller tillagad",
        },
        {
          img: laxfileCard,
          name: "Lax",
          tag: "Alltid populär",
          desc: "Färsk lax i disken — hel eller filead på plats",
        },
        {
          img: havsabborreCard,
          name: "Havsabborre",
          tag: "Fast och saftig",
          desc: "Hel havsabborre på is — vi rensar och grillar om du vill",
        },
      ],
      viewFullMenu: "Se hela utbudet",

      menuPageSub:
        "Färsk fisk per kilo — välj den rå eller låt oss grilla eller fritera den. Alla priser anges per kilogram.",
      menuNote:
        "Tillgången på färsk fisk kan variera. Kontakta personalen om allergier eller särskilda önskemål.",
      menuDishes: "sorter",

      contactSub:
        "Beställ färsk fisk för avhämtning eller ät hos oss — välj nedan så tar vi hand om resten via WhatsApp.",
    },
    en: {
      heroBadge: "Today's catch on ice",
      heroTitle1: "Fresh fish",
      heroTitle2: "by the kilo",
      // Kept as short as the line it replaces ("from the sea") — the h1 clamps up to
      // 5.5rem inside a max-w-xl block, so a longer line wraps on wide screens.
      heroTitle3: "from the ice",
      heroSub:
        "Whole fish and shellfish on ice, delivered fresh every day. Pick yours at the counter — take it home raw, or let us grill or fry it while you wait.",
      heroMenu: "See today's prices",

      featuredLabel: "From the counter",
      featuredTitle: "Freshest today",
      featuredSub:
        "The catch comes in fresh every day. Pick your fish whole on ice and pay by the kilo.",
      featured: [
        {
          img: guldsparidCard,
          name: "Gilt-head Bream",
          tag: "Mild and easy",
          desc: "Whole fresh bream on ice — sold by the kilo, raw or prepared",
        },
        {
          img: laxfileCard,
          name: "Salmon",
          tag: "Always a favourite",
          desc: "Fresh salmon at the counter — whole or filleted on the spot",
        },
        {
          img: havsabborreCard,
          name: "Sea Bass",
          tag: "Firm and juicy",
          desc: "Whole sea bass on ice — we clean and grill it if you like",
        },
      ],
      viewFullMenu: "See the full counter",

      menuPageSub:
        "Fresh fish by the kilo — take it raw, or let us grill or fry it for you. All prices are per kilogram.",
      menuNote:
        "Fresh fish availability may vary. Ask the team about allergies or special requests.",
      menuDishes: "kinds",

      contactSub:
        "Order fresh fish for pickup or to eat in — pick below and we'll take care of the rest over WhatsApp.",
    },
    ar: {
      heroBadge: "صيد اليوم على الثلج",
      heroTitle1: "سمك طازج",
      heroTitle2: "بالكيلو",
      heroTitle3: "من الثلج مباشرة",
      heroSub:
        "سمك كامل ومأكولات بحرية على الثلج، تصلنا طازجة كل يوم. اختر سمكتك بنفسك — خذها نيئة، أو دعنا نشويها أو نقليها لك في الحال.",
      heroMenu: "شاهد أسعار اليوم",

      featuredLabel: "من الثلاجة",
      featuredTitle: "الأطزج اليوم",
      featuredSub: "يصلنا الصيد طازجاً كل يوم. اختر سمكتك كاملة على الثلج وادفع بالكيلو.",
      featured: [
        {
          img: guldsparidCard,
          name: "اجاج",
          tag: "طعم خفيف وسهل",
          desc: "سمكة اجاج كاملة طازجة على الثلج — تُباع بالكيلو، نيئة أو محضَّرة",
        },
        {
          img: laxfileCard,
          name: "سلمون",
          tag: "المفضّل دائماً",
          desc: "سلمون طازج في الثلاجة — كامل أو مقطّع فيليه أمامك",
        },
        {
          img: havsabborreCard,
          name: "قاروص",
          tag: "قوام متماسك وطريّ",
          desc: "سمكة قاروص كاملة على الثلج — ننظّفها ونشويها لك إن أحببت",
        },
      ],
      viewFullMenu: "شاهد كل المتوفّر",

      menuPageSub:
        "سمك طازج بالكيلو — خذه نيئاً أو دعنا نشويه أو نقليه لك. جميع الأسعار للكيلوغرام الواحد.",
      menuNote:
        "قد يختلف توفّر السمك الطازج. تواصل مع العاملين بخصوص الحساسية أو الطلبات الخاصة.",
      menuDishes: "نوعاً",

      contactSub:
        "اطلب سمكاً طازجاً للاستلام أو لتناوله عندنا — اختر أدناه ونتكفّل بالباقي عبر WhatsApp.",
    },
  },
};

export function copyFor(branchId: BranchId, lang: Lang): Translation {
  return { ...T[lang], ...BRANCH_COPY[branchId]?.[lang] };
}

/** The active translation: current language, with the selected branch's overrides applied. */
export function useT(): Translation {
  const { lang } = useLang();
  const { branchId } = useBranch();
  return useMemo(() => copyFor(branchId, lang), [branchId, lang]);
}
