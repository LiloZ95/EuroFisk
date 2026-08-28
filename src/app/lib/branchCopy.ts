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
  rosengard: {
    sv: {
      heroBadge: "Från havet till glöden",
      heroTitle1: "Kolgrillat &",
      heroTitle2: "friterat",
      heroTitle3: "fisk och skaldjur",
      heroSub: "Ät hos oss, beställ för avhämtning eller få maten levererad direkt hem till dig. Välkommen till EuroFisk Rosengård.",
      heroMenu: "Se menyn",
      heroBook: "Beställ mat",
      featuredLabel: "Tre sätt att njuta av havet",
      featuredTitle: "Från vårt kök",
      featuredSub: "Från fisk över glödande kol och frasigt friterade favoriter till generösa skaldjursrätter — välj det du är sugen på och njut på plats, beställ för avhämtning eller få maten levererad hem.",
      featured: [
        { img: T.sv.featured[0].img, name: "Över glödande kol", tag: "Kolgrillat", desc: "Fisk och skaldjur får möta glöden och tillagas med omsorg för en djupare grillsmak, saftig insida och den karaktär som bara riktig kolgrillning ger." },
        { img: T.sv.featured[1].img, name: "Krispigt från fritösen", tag: "Friterat", desc: "Frasig fisk och skaldjur, tillagade på beställning och serverade med våra utvalda såser och tillbehör — varmt, krispigt och redo att njutas direkt." },
        { img: T.sv.featured[2].img, name: "Räkor och skaldjur", tag: "Skaldjur & Seafood Boil", desc: "Grillade räkor, generösa skaldjursrätter och vår Seafood Boil — smaker skapade för att delas, upptäckas och gärna ätas med händerna." },
      ],
      viewFullMenu: "Utforska hela menyn",
      galleryTitle: "Ögonblick från köket",
      gallerySub: "Kolgrillat, friterat och skaldjur — en glimt av smakerna, hantverket och rätterna som serveras hos EuroFisk Rosengård.",
      staffLabel: "Om EuroFisk · Rosengård",
      staffTitle: "Passionen bakom varje rätt",
      staffSub: "Hos oss börjar allt med råvaran. Sedan tar glöden, hantverket och smaken vid.",
      staffRole: "Kökschef",
      staffQuote: "För mig handlar det om att laga mat jag själv hade blivit glad av att få framför mig — varm, generös och full av smak.",
      staffBio: "Med rötter i fiskhandeln och en stark passion för mat växte EuroFisk fram med ambitionen att göra fisk och skaldjur till något mer än bara en måltid. På Rosengård möter råvaran glöden, fritösen och vårt kök — med fokus på smak, generösa portioner och en upplevelse vi vill att gästen ska vilja återvända till.",
      facts: [["fish", "Utvalt från havet", "Råvaror vi själva väljer med omsorg."], ["flame", "Över äkta glöd", "Kolgrillat för djupare smak."], ["heart", "Tillagat när du beställer", "Nylagat, varmt och redo att njutas."]],
      placeLabel: "Besök oss · Rosengård",
      placeTitle: "Tillagad fisk — på det sätt som passar dig",
      placeSub: "Ät hos oss, beställ för avhämtning eller få maten levererad hem. Du väljer själv hur du vill njuta av EuroFisk.",
      placeInteriorLabel: "Ät hos oss",
      placeExteriorLabel: "Besök oss",
      placeAtmosphere: "Besök oss",
      aboutLabel: "Om EuroFisk · Rosengård",
      aboutTitle: "Smaker man gärna kommer tillbaka till",
      aboutP1: "Vi tror att riktigt bra fisk börjar långt innan den hamnar på tallriken. Därför lägger vi lika mycket omsorg på råvaran som på tillagningen — från de första förberedelserna till den sista minuten över glöden eller i vårt kök.",
      aboutP2: "Resultatet ska vara enkelt att känna igen: tydliga smaker, generösa portioner och mat vi själva gärna hade satt oss ner för att äta.",
      aboutStats: [["Råvaran först", "Grunden i varje rätt."], ["Äkta glöd", "Smaken från kolgrillen."], ["Generöst serverat", "Som vi själva vill ha det."]],
    },
  },
  "ostra-sorgenfri": {
    sv: {
      heroBadge: "Dagens fångst på is",
      heroTitle1: "Färsk fisk",
      heroTitle2: "per kilo",
      heroTitle3: "ur disken",
      heroSub:
        "Hel fisk och skaldjur på is, levererat färskt varje dag. Välj själv i disken — ta med den rå eller låt oss grilla eller fritera den medan du väntar.",
      heroMenu: "Se dagens priser",
      heroBook: "Beställ mat",

      featuredLabel: "Ur disken",
      featuredTitle: "Dagens färskaste",
      featuredSub:
        "Upptäck allt från välkända favoriter till mer exotiska fiskarter och skaldjur — välj art och mängd direkt från fiskdisken.",
      featured: [
        { img: breamOnIce, name: "Lokala & klassiska favoriter", tag: "Ur fiskdisken", desc: "Lokala favoriter från våra närmare vatten — välkända arter med självklar plats på middagsbordet." },
        { img: salmonFillets, name: "Exotiska arter", tag: "Från världens hav", desc: "Upptäck arter som inte alltid finns i den vanliga matbutiken — ett sortiment som förändras efter tillgång." },
        { img: prawns, name: "Havets delikatesser", tag: "Räkor och skaldjur", desc: "Från saftiga räkor till havets mest uppskattade delikatesser — råvaror som lyfter middagen och passar både vardag och fest." },
      ],
      viewFullMenu: "Se dagens sortiment",
      galleryTitle: "Upptäck vår fiskdisk",
      gallerySub: "Från lokala favoriter till exotiska arter och havets delikatesser — upptäck ett varierande sortiment där vi hjälper dig att hitta din favorit. Vi rensar och kryddar efter dina önskemål, redo att tillagas hemma.",
      staffLabel: "Om EuroFisk · Östra Sorgenfri",
      staffTitle: "Kunskapen bakom varje val",
      staffSub: "Hos oss börjar middagen vid fiskdisken. Med ett brett urval och kunskap om råvaran hjälper vi dig att välja rätt fisk.",
      staffRole: "Fiskhandlare",
      staffQuote: "Berätta vad du tänkt laga — så hjälper jag dig att välja rätt fisk och gör den redo för köket.",
      staffBio: "EuroFisk Östra Sorgenfri bygger på erfarenhet från fiskhandeln och en vilja att erbjuda mer än den traditionella fiskdisken. Här möts välkända favoriter med arter från världens hav — ett varierande sortiment för dig som vet precis vad du söker och för dig som gärna upptäcker något nytt.",
      facts: [["fish", "Från nära & fjärran", "Lokala favoriter och exotiska arter."], ["flame", "Rensat som du vill ha det", "Förberett efter dina önskemål."], ["heart", "Marinerat & redo", "Klart att tillaga på ditt sätt."]],
      placeLabel: "Besök oss · Östra Sorgenfri",
      placeTitle: "Fisk & skaldjur — på det sätt som passar dig",
      placeSub: "Besök vår fiskdisk, beställ för avhämtning eller få fisk och skaldjur levererat hem. Vi hjälper dig att välja, rensa och marinera efter dina önskemål.",
      placeInteriorLabel: "Handla i fiskdisken",
      placeInteriorSub: "Besök oss på Danska vägen, upptäck dagens sortiment och välj själv bland fisk och skaldjur från vår disk.",
      placeExteriorLabel: "Besök oss",
      placeAtmosphere: "Besök oss",
      aboutLabel: "Om EuroFisk · Östra Sorgenfri",
      aboutTitle: "Förtroende byggs över fiskdisken",
      aboutP1: "För oss är ett besök hos EuroFisk mer än ett köp över fiskdisken. Det är en stund där kunskap, kvalitet och personlig service möts — så att du kan känna dig trygg i ditt val och inspirerad inför måltiden.",
      aboutP2: "Vi hjälper dig att hitta rätt fisk för det du vill laga, oavsett om du söker en välkänd favorit eller vill upptäcka något nytt.",
      aboutStats: [["Rätt för din middag", "Vi hjälper dig att välja rätt."], ["På ditt sätt", "Rensat, marinerat och redo för tillagning."], ["Personlig service", "Hjälp när du behöver den."]],
      gallery: [
        { img: gurnardSquid, alt: "Röd knorrhane och bläckfisk på is" },
        { img: sardinesOnIce, alt: "Färska sardiner på is" },
        { img: crabsOnIce, alt: "Blåkrabbor på is i disken" },
        { img: prawns, alt: "Nykokta räkor" },
        { img: stallExterior, alt: "EuroFisks fiskdisk i Östra Sorgenfri utifrån" },
      ],
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
  set("viewFullMenu", b.featuredSection?.cta);
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
  set("gallerySub", b.gallerySection?.sub);
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
  const translatedStats = Array.isArray(b.about?.stats)
    ? b.about.stats.filter((item: { value?: string; label?: string }) => typeof item.value === "string" && item.value.trim() !== "")
    : [];
  if (translatedStats.length) {
    out.aboutStats = translatedStats.map((item: { value?: string; label?: string }) => [item.value ?? "", item.label ?? ""]);
  }

  const experience = b.experience;
  if (experience) {
    set("staffLabel", experience.staffLabel);
    set("staffTitle", experience.staffTitle);
    set("staffSub", experience.staffSub);
    set("staffRole", experience.staffRole);
    set("staffQuote", experience.staffQuote);
    set("staffBio", experience.staffBio);
    set("placeLabel", experience.placeLabel);
    set("placeTitle", experience.placeTitle);
    set("placeSub", experience.placeSub);
    set("placeInteriorLabel", experience.interiorLabel);
    set("placeInteriorSub", experience.interiorSub);
    set("placeExteriorLabel", experience.exteriorLabel);
    set("placeExteriorSub", experience.exteriorSub);
    set("placeAtmosphere", experience.infoLabel);
    const translatedFacts = Array.isArray(experience.facts)
      ? experience.facts.filter((item) => typeof item.title === "string" && item.title.trim() !== "")
      : [];
    if (translatedFacts.length) {
      out.facts = translatedFacts.map((item) => [item.icon ?? "fish", item.title ?? "", item.sub ?? ""]);
    }
  }

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
    const translatedBenefits = Array.isArray(settings.deliveryBenefits)
      ? settings.deliveryBenefits.filter((item: { title?: string }) => typeof item.title === "string" && item.title.trim() !== "")
      : [];
    if (translatedBenefits.length) {
      out.deliveryBenefits = translatedBenefits.map((item: { title?: string; sub?: string }) => [item.title ?? "", item.sub ?? ""]);
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
