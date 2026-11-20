import { useMemo } from "react";
import { useBranch } from "./BranchContext";
import type { BranchId } from "./branches";
import { useLang, type Lang } from "./LangContext";
import { cmsBranch, cmsLocale, mediaUrl } from "./cmsContent";
import { T, type Translation } from "./translations";
import { RESTAURANT_COPY } from "./restaurantCopy";
import legacyMenuCopyReplacements from "./legacyMenuCopy.json";

const legacyMenuCopy = new Map(Object.entries(legacyMenuCopyReplacements));

type BranchOverrides = Partial<Record<Lang, Partial<Translation>>>;

/** Restaurant-specific copy, with CMS overrides below. */
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
  const concise = RESTAURANT_COPY[lang];
  // Shorter local defaults stay below CMS edits in the precedence order.
  const base = {
    ...T[lang], ...BRANCH_COPY[branchId]?.[lang],
    heroSub: concise.heroSub,
    aboutTitle: concise.aboutTitle,
    aboutP1: concise.aboutBody,
    contactTitle: concise.contactTitle,
    contactSub: concise.contactSub,
  } as Translation;
  const out = applyCms(base, branchId, lang);
  // Retire the old price promotion without rewriting CMS records. Custom menu copy
  // and subsequent CMS edits continue to take priority over the built-in defaults.
  out.menuPageSub = legacyMenuCopy.get(out.menuPageSub) ?? out.menuPageSub;
  out.menuNote = legacyMenuCopy.get(out.menuNote) ?? out.menuNote;
  return out;
}

/** The active translation: current language, with the selected branch's overrides applied. */
export function useT(): Translation {
  const { lang } = useLang();
  const { branchId } = useBranch();
  return useMemo(() => copyFor(branchId, lang), [branchId, lang]);
}
