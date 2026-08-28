/**
 * Targeted, idempotent sync for the approved Acrobat website annotations.
 *
 * Dry-run is the default. Apply only after the CMS schema migration is deployed:
 *   npm run sync:website-changes
 *   npm run sync:website-changes -- --apply
 *
 * Only the fields listed below are updated. Photos, menus, hours, contact details and
 * translations outside Swedish are intentionally preserved.
 */
import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

const APPLY = process.argv.includes("--apply");

const branches = {
  rosengard: {
    hero: {
      badge: "Från havet till glöden",
      title1: "Kolgrillat &",
      title2: "friterat",
      title3: "fisk och skaldjur",
      sub: "Ät hos oss, beställ för avhämtning eller få maten levererad direkt hem till dig. Välkommen till EuroFisk Rosengård.",
      menuCta: "Se menyn",
      bookCta: "Beställ mat",
    },
    featuredSection: {
      label: "Tre sätt att njuta av havet",
      title: "Från vårt kök",
      sub: "Från fisk över glödande kol och frasigt friterade favoriter till generösa skaldjursrätter — välj det du är sugen på och njut på plats, beställ för avhämtning eller få maten levererad hem.",
      cta: "Utforska hela menyn",
      cards: [
        { name: "Över glödande kol", tag: "Kolgrillat", desc: "Fisk och skaldjur får möta glöden och tillagas med omsorg för en djupare grillsmak, saftig insida och den karaktär som bara riktig kolgrillning ger." },
        { name: "Krispigt från fritösen", tag: "Friterat", desc: "Frasig fisk och skaldjur, tillagade på beställning och serverade med våra utvalda såser och tillbehör — varmt, krispigt och redo att njutas direkt." },
        { name: "Räkor och skaldjur", tag: "Skaldjur & Seafood Boil", desc: "Grillade räkor, generösa skaldjursrätter och vår Seafood Boil — smaker skapade för att delas, upptäckas och gärna ätas med händerna." },
      ],
    },
    gallerySection: { label: "", title: "Ögonblick från köket", sub: "Kolgrillat, friterat och skaldjur — en glimt av smakerna, hantverket och rätterna som serveras hos EuroFisk Rosengård." },
    experience: {
      staffLabel: "Om EuroFisk · Rosengård", staffTitle: "Passionen bakom varje rätt",
      staffSub: "Hos oss börjar allt med råvaran. Sedan tar glöden, hantverket och smaken vid.", staffRole: "Kökschef",
      staffQuote: "För mig handlar det om att laga mat jag själv hade blivit glad av att få framför mig — varm, generös och full av smak.",
      staffBio: "Med rötter i fiskhandeln och en stark passion för mat växte EuroFisk fram med ambitionen att göra fisk och skaldjur till något mer än bara en måltid. På Rosengård möter råvaran glöden, fritösen och vårt kök — med fokus på smak, generösa portioner och en upplevelse vi vill att gästen ska vilja återvända till.",
      facts: [
        { icon: "fish", title: "Utvalt från havet", sub: "Råvaror vi själva väljer med omsorg." },
        { icon: "flame", title: "Över äkta glöd", sub: "Kolgrillat för djupare smak." },
        { icon: "heart", title: "Tillagat när du beställer", sub: "Nylagat, varmt och redo att njutas." },
      ],
      placeLabel: "Besök oss · Rosengård", placeTitle: "Tillagad fisk — på det sätt som passar dig",
      placeSub: "Ät hos oss, beställ för avhämtning eller få maten levererad hem. Du väljer själv hur du vill njuta av EuroFisk.",
      interiorLabel: "Ät hos oss", interiorSub: "", exteriorLabel: "Besök oss", exteriorSub: "", infoLabel: "Besök oss",
    },
    about: {
      label: "Om EuroFisk · Rosengård", title: "Smaker man gärna kommer tillbaka till",
      p1: "Vi tror att riktigt bra fisk börjar långt innan den hamnar på tallriken. Därför lägger vi lika mycket omsorg på råvaran som på tillagningen — från de första förberedelserna till den sista minuten över glöden eller i vårt kök.",
      p2: "Resultatet ska vara enkelt att känna igen: tydliga smaker, generösa portioner och mat vi själva gärna hade satt oss ner för att äta.",
      stats: [{ value: "Råvaran först", label: "Grunden i varje rätt." }, { value: "Äkta glöd", label: "Smaken från kolgrillen." }, { value: "Generöst serverat", label: "Som vi själva vill ha det." }],
    },
  },
  "ostra-sorgenfri": {
    hero: {
      badge: "Dagens fångst på is", title1: "Färsk fisk", title2: "per kilo", title3: "ur disken",
      sub: "Hel fisk och skaldjur på is, levererat färskt varje dag. Välj själv i disken — ta med den rå eller låt oss grilla eller fritera den medan du väntar.",
      menuCta: "Se dagens priser", bookCta: "Beställ mat",
    },
    featuredSection: {
      label: "Ur fiskdisken", title: "Dagens färskaste",
      sub: "Upptäck allt från välkända favoriter till mer exotiska fiskarter och skaldjur — välj art och mängd direkt från fiskdisken.", cta: "Se dagens sortiment",
      cards: [
        { name: "Lokala & klassiska favoriter", tag: "Ur fiskdisken", desc: "Lokala favoriter från våra närmare vatten — välkända arter med självklar plats på middagsbordet." },
        { name: "Exotiska arter", tag: "Från världens hav", desc: "Upptäck arter som inte alltid finns i den vanliga matbutiken — ett sortiment som förändras efter tillgång." },
        { name: "Havets delikatesser", tag: "Räkor och skaldjur", desc: "Från saftiga räkor till havets mest uppskattade delikatesser — råvaror som lyfter middagen och passar både vardag och fest." },
      ],
    },
    gallerySection: { label: "", title: "Upptäck vår fiskdisk", sub: "Från lokala favoriter till exotiska arter och havets delikatesser — upptäck ett varierande sortiment där vi hjälper dig att hitta din favorit. Vi rensar och kryddar efter dina önskemål, redo att tillagas hemma." },
    experience: {
      staffLabel: "Om EuroFisk · Östra Sorgenfri", staffTitle: "Kunskapen bakom varje val",
      staffSub: "Hos oss börjar middagen vid fiskdisken. Med ett brett urval och kunskap om råvaran hjälper vi dig att välja rätt fisk.", staffRole: "Fiskhandlare",
      staffQuote: "Berätta vad du tänkt laga — så hjälper jag dig att välja rätt fisk och gör den redo för köket.",
      staffBio: "EuroFisk Östra Sorgenfri bygger på erfarenhet från fiskhandeln och en vilja att erbjuda mer än den traditionella fiskdisken. Här möts välkända favoriter med arter från världens hav — ett varierande sortiment för dig som vet precis vad du söker och för dig som gärna upptäcker något nytt.",
      facts: [
        { icon: "fish", title: "Från nära & fjärran", sub: "Lokala favoriter och exotiska arter." },
        { icon: "flame", title: "Rensat som du vill ha det", sub: "Förberett efter dina önskemål." },
        { icon: "heart", title: "Marinerat & redo", sub: "Klart att tillaga på ditt sätt." },
      ],
      placeLabel: "Besök oss · Östra Sorgenfri", placeTitle: "Fisk & skaldjur — på det sätt som passar dig",
      placeSub: "Besök vår fiskdisk, beställ för avhämtning eller få fisk och skaldjur levererat hem. Vi hjälper dig att välja, rensa och marinera efter dina önskemål.",
      interiorLabel: "Handla i fiskdisken", interiorSub: "Besök oss på Danska vägen, upptäck dagens sortiment och välj själv bland fisk och skaldjur från vår disk.", exteriorLabel: "Besök oss", exteriorSub: "", infoLabel: "Besök oss",
    },
    about: {
      label: "Om EuroFisk · Östra Sorgenfri", title: "Förtroende byggs över fiskdisken",
      p1: "För oss är ett besök hos EuroFisk mer än ett köp över fiskdisken. Det är en stund där kunskap, kvalitet och personlig service möts — så att du kan känna dig trygg i ditt val och inspirerad inför måltiden.",
      p2: "Vi hjälper dig att hitta rätt fisk för det du vill laga, oavsett om du söker en välkänd favorit eller vill upptäcka något nytt.",
      stats: [{ value: "Rätt för din middag", label: "Vi hjälper dig att välja rätt." }, { value: "På ditt sätt", label: "Rensat, marinerat och redo för tillagning." }, { value: "Personlig service", label: "Hjälp när du behöver den." }],
    },
  },
} as const;

const settings = {
  deliveryBadge: "Fri hemleverans från 649 kr",
  deliveryTitle: "Gratis hemleverans",
  deliveryArea: "Inom Malmö",
  deliverySub: "Beställ för 649 kr eller mer så bjuder vi på leveransen — kolgrillad fisk, frasiga favoriter och skaldjur, nylagat och levererat hela vägen till din dörr.",
  deliveryCta: "Beställ hem →",
  deliveryFeeNote: "Ord. leveransavgift 99 kr",
  deliveryBenefits: [
    { title: "Fri leverans från 649 kr", sub: "Beställ för 649 kr eller mer så bjuder vi på leveransen." },
    { title: "2 signatursåser ingår", sub: "Två av våra signatursåser följer med utan extra kostnad." },
    { title: "Allergier? Säg till oss", sub: "Meddela oss om allergier innan beställning, så hjälper vi dig att välja rätt." },
  ],
};

async function main() {
  const payload = await getPayload({ config });
  console.log(APPLY ? "Applying approved website changes" : "Dry run — no CMS records will be changed");

  for (const [slug, data] of Object.entries(branches)) {
    const result = await payload.find({ collection: "branches", where: { slug: { equals: slug } }, limit: 1, locale: "sv", depth: 0 });
    const existing = result.docs[0];
    if (!existing) throw new Error(`Branch not found: ${slug}`);

    // Preserve upload relationships and stable row ids while replacing only approved text.
    const currentFeatured = existing.featuredSection as { cards?: Array<Record<string, unknown>> } | undefined;
    const merged = {
      ...data,
      featuredSection: {
        ...data.featuredSection,
        cards: data.featuredSection.cards.map((card, index) => ({ ...(currentFeatured?.cards?.[index] ?? {}), ...card })),
      },
    };

    console.log(`  ${APPLY ? "update" : "would update"}: ${slug}`);
    if (APPLY) await payload.update({ collection: "branches", id: existing.id, locale: "sv", data: merged as never });
  }

  console.log(`  ${APPLY ? "update" : "would update"}: site-settings delivery content`);
  if (APPLY) await payload.updateGlobal({ slug: "site-settings", locale: "sv", data: settings });
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
