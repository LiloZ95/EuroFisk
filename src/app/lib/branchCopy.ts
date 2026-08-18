import { useMemo } from "react";
import { useBranch } from "./BranchContext";
import type { BranchId } from "./branches";
import breamOnIce from "@/imports/ostra-sorgenfri/bream-on-ice.webp";
import salmonFillets from "@/imports/ostra-sorgenfri/salmon-fillets.webp";
import prawns from "@/imports/ostra-sorgenfri/prawns.webp";
import sardinesOnIce from "@/imports/ostra-sorgenfri/sardines-on-ice.webp";
import crabsOnIce from "@/imports/ostra-sorgenfri/crabs-on-ice.webp";
import gurnardSquid from "@/imports/ostra-sorgenfri/gurnard-squid.webp";
import stallExterior from "@/imports/ostra-sorgenfri/stall-exterior.webp";
import { useLang, type Lang } from "./LangContext";
import { cmsBranch, cmsLocale, mediaUrl } from "./cmsContent";
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
      featured: [
        { img: breamOnIce, name: "Guldsparid", tag: "Mild och lättlagad", desc: "Hel färsk guldsparid på is — köp per kilo, rå eller tillagad" },
        { img: salmonFillets, name: "Lax", tag: "Alltid populär", desc: "Färsk lax i disken — hel eller filead på plats" },
        { img: prawns, name: "Räkor", tag: "Kokta samma dag", desc: "Färska räkor ur disken — köp per kilo" },
      ],
      gallery: [
        { img: gurnardSquid, alt: "Röd knorrhane och bläckfisk på is" },
        { img: sardinesOnIce, alt: "Färska sardiner på is" },
        { img: crabsOnIce, alt: "Blåkrabbor på is i disken" },
        { img: prawns, alt: "Nykokta räkor" },
        { img: stallExterior, alt: "EuroFisks fiskdisk i Östra Sorgenfri utifrån" },
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
        { img: breamOnIce, name: "Gilt-head Bream", tag: "Mild and easy", desc: "Whole fresh bream on ice — sold by the kilo, raw or prepared" },
        { img: salmonFillets, name: "Salmon", tag: "Always a favourite", desc: "Fresh salmon at the counter — whole or filleted on the spot" },
        { img: prawns, name: "Prawns", tag: "Cooked the same day", desc: "Fresh prawns from the counter — sold by the kilo" },
      ],
      gallery: [
        { img: gurnardSquid, alt: "Red gurnard and squid on ice" },
        { img: sardinesOnIce, alt: "Fresh sardines on ice" },
        { img: crabsOnIce, alt: "Blue crabs on ice at the counter" },
        { img: prawns, alt: "Freshly cooked prawns" },
        { img: stallExterior, alt: "The EuroFisk fish counter in Östra Sorgenfri from outside" },
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
        { img: breamOnIce, name: "اجاج", tag: "طعم خفيف وسهل", desc: "سمكة اجاج كاملة طازجة على الثلج — تُباع بالكيلو، نيئة أو محضَّرة" },
        { img: salmonFillets, name: "سلمون", tag: "المفضّل دائماً", desc: "سلمون طازج في الثلاجة — كامل أو مقطّع فيليه أمامك" },
        { img: prawns, name: "روبيان", tag: "مسلوق في نفس اليوم", desc: "روبيان طازج من الثلاجة — يُباع بالكيلو" },
      ],
      gallery: [
        { img: gurnardSquid, alt: "سمك الحرّ الأحمر والحبار على الثلج" },
        { img: sardinesOnIce, alt: "سردين طازج على الثلج" },
        { img: crabsOnIce, alt: "سلطعون أزرق على الثلج في الثلاجة" },
        { img: prawns, alt: "روبيان مسلوق طازج" },
        { img: stallExterior, alt: "محل EuroFisk للسمك في Östra Sorgenfri من الخارج" },
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

/**
 * Overlays whatever the CMS supplies onto the built-in copy.
 *
 * Only non-empty CMS values override, so a field the owner has left blank falls through to
 * the wording that ships in the code rather than blanking out a section of the site.
 */
function applyCms(base: Translation, branchId: BranchId, lang: Lang): Translation {
  const b = cmsBranch(lang, branchId);
  if (!b) return base;

  const out: Translation = { ...base };
  const set = <K extends keyof Translation>(key: K, value: unknown) => {
    if (typeof value === "string" && value.trim() !== "") {
      out[key] = value as Translation[K];
    }
  };

  set("heroBadge", b.hero?.badge);
  set("heroTitle1", b.hero?.title1);
  set("heroTitle2", b.hero?.title2);
  set("heroTitle3", b.hero?.title3);
  set("heroSub", b.hero?.sub);
  set("heroMenu", b.hero?.menuCta);
  set("heroBook", b.hero?.bookCta);

  set("featuredLabel", b.featuredSection?.label);
  set("featuredTitle", b.featuredSection?.title);
  set("featuredSub", b.featuredSection?.sub);
  if (b.featuredSection?.cards?.length) {
    out.featured = b.featuredSection.cards.map((c, i) => ({
      img: mediaUrl(c.img, "card") || base.featured[i]?.img || "",
      name: c.name || base.featured[i]?.name || "",
      tag: c.tag || base.featured[i]?.tag || "",
      desc: c.desc || base.featured[i]?.desc || "",
    }));
  }

  set("galleryLabel", b.gallerySection?.label);
  set("galleryTitle", b.gallerySection?.title);
  if (b.gallery?.length) {
    out.gallery = b.gallery.map((g, i) => ({
      img: mediaUrl(g.img, "card") || base.gallery[i]?.img || "",
      alt: g.caption || g.img?.alt || base.gallery[i]?.alt || "",
    }));
  }

  set("aboutLabel", b.about?.label);
  set("aboutTitle", b.about?.title);
  set("aboutP1", b.about?.p1);
  set("aboutP2", b.about?.p2);

  set("menuPageSub", b.menuIntro?.sub);
  set("menuNote", b.menuIntro?.note);
  set("menuDishes", b.menuIntro?.dishesWord);

  set("contactSub", b.contact?.sub);

  // Site-wide strings (nav, form labels, WhatsApp wording) live in the global.
  const settings = cmsLocale(lang)?.settings;
  if (settings) {
    for (const [key, value] of Object.entries(settings)) {
      if (key === "logo") continue;
      if (key in out) set(key as keyof Translation, value);
    }
  }

  return out;
}

export function copyFor(branchId: BranchId, lang: Lang): Translation {
  const base = { ...T[lang], ...BRANCH_COPY[branchId]?.[lang] } as Translation;
  return applyCms(base, branchId, lang);
}

/** The active translation: current language, with the selected branch's overrides applied. */
export function useT(): Translation {
  const { lang } = useLang();
  const { branchId } = useBranch();
  return useMemo(() => copyFor(branchId, lang), [branchId, lang]);
}
