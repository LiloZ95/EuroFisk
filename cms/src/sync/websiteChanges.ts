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

const translatedBranches = {
  en: {
    rosengard: {
      hero: { badge: "From sea to flame", title1: "Charcoal-grilled &", title2: "crispy fried", title3: "fish and seafood", sub: "Dine with us, order for pickup, or have your meal delivered straight to your door. Welcome to EuroFisk Rosengård.", menuCta: "View the menu", bookCta: "Order food" },
      featuredSection: { label: "Three ways to enjoy the sea", title: "From our kitchen", sub: "From fish over glowing charcoal and crispy fried favourites to generous seafood dishes — choose what you are craving and enjoy it here, order for pickup, or have it delivered.", cta: "Explore the full menu", cards: [
        { name: "Over glowing charcoal", tag: "Charcoal-grilled", desc: "Fish and seafood meet the flame and are cooked with care for deeper grilled flavour, a juicy centre, and the character only real charcoal can create." },
        { name: "Crispy from the fryer", tag: "Fried", desc: "Crispy fish and seafood, cooked to order and served with our selected sauces and sides — hot, crunchy, and ready to enjoy." },
        { name: "Prawns and seafood", tag: "Seafood & Seafood Boil", desc: "Grilled prawns, generous seafood dishes, and our Seafood Boil — flavours made to share, discover, and happily eat with your hands." },
      ] },
      gallerySection: { label: "", title: "Moments from the kitchen", sub: "Charcoal-grilled, fried, and seafood dishes — a glimpse of the flavours, craft, and plates served at EuroFisk Rosengård." },
      experience: { staffLabel: "About EuroFisk · Rosengård", staffTitle: "The passion behind every dish", staffSub: "Everything starts with the ingredients. Then the flame, craft, and flavour take over.", staffRole: "Head chef", staffQuote: "For me, cooking means making the kind of food I would be delighted to have placed in front of me — warm, generous, and full of flavour.", staffBio: "Rooted in the fish trade and driven by a strong passion for food, EuroFisk grew from the ambition to make fish and seafood more than just a meal. At Rosengård, quality ingredients meet the charcoal grill, fryer, and our kitchen — with a focus on flavour, generous portions, and an experience guests want to return to.", facts: [
        { icon: "fish", title: "Selected from the sea", sub: "Ingredients we personally choose with care." },
        { icon: "flame", title: "Over real charcoal", sub: "Charcoal-grilled for deeper flavour." },
        { icon: "heart", title: "Cooked when you order", sub: "Freshly prepared, hot, and ready to enjoy." },
      ], placeLabel: "Visit us · Rosengård", placeTitle: "Prepared fish — just the way you like it", placeSub: "Dine with us, order for pickup, or have your meal delivered. You decide how you want to enjoy EuroFisk.", interiorLabel: "Dine with us", interiorSub: "", exteriorLabel: "Visit us", exteriorSub: "", infoLabel: "Visit us" },
      about: { label: "About EuroFisk · Rosengård", title: "Flavours worth coming back for", p1: "We believe truly good fish begins long before it reaches the plate. That is why we put as much care into the ingredients as the cooking — from the first preparation to the final minute over the flame or in our kitchen.", p2: "The result should be easy to recognise: clear flavours, generous portions, and food we would gladly sit down to enjoy ourselves.", stats: [{ value: "Ingredients first", label: "The foundation of every dish." }, { value: "Real charcoal", label: "Flavour from the grill." }, { value: "Generously served", label: "Just the way we like it." }] },
    },
    "ostra-sorgenfri": {
      hero: { badge: "Today's catch on ice", title1: "Fresh fish", title2: "by the kilo", title3: "from the counter", sub: "Whole fish and seafood on ice, delivered fresh every day. Choose yours at the counter — take it home raw or let us grill or fry it while you wait.", menuCta: "View today's prices", bookCta: "Order food" },
      featuredSection: { label: "From the fish counter", title: "Today's freshest selection", sub: "Discover familiar favourites, more exotic fish, and seafood — choose the variety and quantity directly from the counter.", cta: "View today's selection", cards: [
        { name: "Local & classic favourites", tag: "From the fish counter", desc: "Local favourites from nearby waters — familiar varieties with a natural place at the dinner table." },
        { name: "Exotic varieties", tag: "From the world's oceans", desc: "Discover varieties not always found in an ordinary supermarket — a selection that changes with availability." },
        { name: "Delicacies from the sea", tag: "Prawns and seafood", desc: "From juicy prawns to the sea's most appreciated delicacies — ingredients that elevate both everyday meals and celebrations." },
      ] },
      gallerySection: { label: "", title: "Discover our fish counter", sub: "From local favourites to exotic varieties and delicacies from the sea — explore a changing selection where we help you find your favourite. We clean and season it to your wishes, ready to cook at home." },
      experience: { staffLabel: "About EuroFisk · Östra Sorgenfri", staffTitle: "Knowledge behind every choice", staffSub: "Dinner begins at the fish counter. With a broad selection and deep product knowledge, we help you choose the right fish.", staffRole: "Fishmonger", staffQuote: "Tell me what you are planning to cook — I will help you choose the right fish and prepare it for your kitchen.", staffBio: "EuroFisk Östra Sorgenfri is built on experience from the fish trade and a desire to offer more than a traditional fish counter. Familiar favourites meet varieties from the world's oceans — a changing selection for customers who know exactly what they want and those eager to discover something new.", facts: [
        { icon: "fish", title: "From near and far", sub: "Local favourites and exotic varieties." },
        { icon: "flame", title: "Cleaned your way", sub: "Prepared to your wishes." },
        { icon: "heart", title: "Marinated & ready", sub: "Ready to cook your way." },
      ], placeLabel: "Visit us · Östra Sorgenfri", placeTitle: "Fish & seafood — just the way you like it", placeSub: "Visit our fish counter, order for pickup, or have fish and seafood delivered. We help you choose, clean, and marinate it to your wishes.", interiorLabel: "Shop at the fish counter", interiorSub: "Visit us on Danska vägen, discover today's selection, and choose your fish and seafood directly from our counter.", exteriorLabel: "Visit us", exteriorSub: "", infoLabel: "Visit us" },
      about: { label: "About EuroFisk · Östra Sorgenfri", title: "Trust is built across the fish counter", p1: "A visit to EuroFisk is more than a purchase across the fish counter. It is a moment where knowledge, quality, and personal service come together — helping you feel confident in your choice and inspired for the meal ahead.", p2: "We help you find the right fish for what you want to cook, whether you are looking for a familiar favourite or want to discover something new.", stats: [{ value: "Right for your meal", label: "We help you choose correctly." }, { value: "Your way", label: "Cleaned, marinated, and ready to cook." }, { value: "Personal service", label: "Help when you need it." }] },
    },
  },
  ar: {
    rosengard: {
      hero: { badge: "من البحر إلى الجمر", title1: "سمك ومأكولات بحرية", title2: "مشوية على الفحم", title3: "ومقلية مقرمشة", sub: "تناول الطعام لدينا، اطلب للاستلام، أو احصل على وجبتك إلى باب منزلك. أهلاً بك في EuroFisk Rosengård.", menuCta: "عرض القائمة", bookCta: "اطلب الطعام" },
      featuredSection: { label: "ثلاث طرق للاستمتاع بخيرات البحر", title: "من مطبخنا", sub: "من السمك المشوي فوق الجمر والأطباق المقلية المقرمشة إلى أطباق المأكولات البحرية السخية — اختر ما تشتهيه وتناوله لدينا أو اطلبه للاستلام أو التوصيل.", cta: "استكشف القائمة كاملة", cards: [
        { name: "فوق الجمر المتوهج", tag: "مشوي على الفحم", desc: "يلتقي السمك والمأكولات البحرية بالجمر ويُطهى بعناية لنكهة أعمق وقوام طري وطابع لا يمنحه إلا الفحم الحقيقي." },
        { name: "مقرمش من المقلاة", tag: "مقلي", desc: "سمك ومأكولات بحرية مقرمشة تُحضّر عند الطلب وتُقدّم مع صلصاتنا وإضافاتنا المختارة — ساخنة ومقرمشة وجاهزة للاستمتاع." },
        { name: "روبيان ومأكولات بحرية", tag: "مأكولات بحرية وSeafood Boil", desc: "روبيان مشوي وأطباق بحرية سخية وSeafood Boil — نكهات صُممت للمشاركة والاكتشاف والاستمتاع بها باليدين." },
      ] },
      gallerySection: { label: "", title: "لحظات من المطبخ", sub: "مشوي على الفحم ومقلي ومأكولات بحرية — لمحة عن النكهات والحِرفة والأطباق التي نقدّمها في EuroFisk Rosengård." },
      experience: { staffLabel: "عن EuroFisk · Rosengård", staffTitle: "الشغف وراء كل طبق", staffSub: "كل شيء يبدأ بالمكوّنات، ثم يأتي دور الجمر والحِرفة والنكهة.", staffRole: "رئيس الطهاة", staffQuote: "بالنسبة لي، الطبخ هو أن أقدّم طعاماً يسعدني أن يوضع أمامي — دافئاً وسخياً ومليئاً بالنكهة.", staffBio: "بجذور في تجارة السمك وشغف قوي بالطعام، نشأ EuroFisk بطموح يجعل السمك والمأكولات البحرية أكثر من مجرد وجبة. في Rosengård تلتقي المكوّنات الجيدة بالجمر والمقلاة ومطبخنا — مع التركيز على النكهة والحصص السخية وتجربة يرغب الضيف في تكرارها.", facts: [
        { icon: "fish", title: "مختار من البحر", sub: "مكوّنات نختارها بأنفسنا بعناية." },
        { icon: "flame", title: "فوق فحم حقيقي", sub: "مشوي على الفحم لنكهة أعمق." },
        { icon: "heart", title: "يُطهى عند الطلب", sub: "طازج وساخن وجاهز للاستمتاع." },
      ], placeLabel: "زرنا · Rosengård", placeTitle: "سمك محضّر بالطريقة التي تناسبك", placeSub: "تناول الطعام لدينا أو اطلب للاستلام أو التوصيل إلى المنزل. أنت تختار كيف تستمتع بـEuroFisk.", interiorLabel: "تناول الطعام لدينا", interiorSub: "", exteriorLabel: "زرنا", exteriorSub: "", infoLabel: "زرنا" },
      about: { label: "عن EuroFisk · Rosengård", title: "نكهات تستحق العودة", p1: "نؤمن أن السمك الجيد يبدأ قبل وصوله إلى الطبق بوقت طويل. لذلك نعتني بالمكوّنات بقدر عنايتنا بالطهي — من التحضيرات الأولى إلى الدقيقة الأخيرة فوق الجمر أو في مطبخنا.", p2: "يجب أن تكون النتيجة واضحة: نكهات صريحة وحصص سخية وطعام يسعدنا أن نجلس لتناوله بأنفسنا.", stats: [{ value: "المكوّنات أولاً", label: "أساس كل طبق." }, { value: "فحم حقيقي", label: "نكهة من الشواية." }, { value: "تقديم سخي", label: "كما نحبّه لأنفسنا." }] },
    },
    "ostra-sorgenfri": {
      hero: { badge: "صيد اليوم على الثلج", title1: "سمك طازج", title2: "بالكيلو", title3: "من واجهة العرض", sub: "سمك كامل ومأكولات بحرية على الثلج تصل طازجة كل يوم. اختر من الواجهة — خذها نيئة أو دعنا نشويها أو نقليها أثناء انتظارك.", menuCta: "عرض أسعار اليوم", bookCta: "اطلب الطعام" },
      featuredSection: { label: "من واجهة السمك", title: "الأطزج اليوم", sub: "اكتشف الأنواع المعروفة والمفضلة والأسماك الأكثر تميزاً والمأكولات البحرية — اختر النوع والكمية مباشرة من الواجهة.", cta: "عرض تشكيلة اليوم", cards: [
        { name: "المفضلات المحلية والكلاسيكية", tag: "من واجهة السمك", desc: "أنواع محلية مفضلة من مياهنا القريبة — أصناف معروفة لها مكان طبيعي على مائدة الطعام." },
        { name: "أنواع مميزة من بحار العالم", tag: "من بحار العالم", desc: "اكتشف أنواعاً لا تتوفر دائماً في المتاجر العادية — تشكيلة تتغير حسب المتاح." },
        { name: "خيرات البحر", tag: "روبيان ومأكولات بحرية", desc: "من الروبيان الطري إلى أشهر خيرات البحر — مكوّنات ترتقي بوجبات الأيام العادية والمناسبات." },
      ] },
      gallerySection: { label: "", title: "اكتشف واجهة السمك", sub: "من المفضلات المحلية إلى الأنواع المميزة وخيرات البحر — اكتشف تشكيلة متغيرة ونساعدك في إيجاد ما يناسبك. ننظف السمك ونتبّله حسب رغبتك ليصبح جاهزاً للطهي في المنزل." },
      experience: { staffLabel: "عن EuroFisk · Östra Sorgenfri", staffTitle: "المعرفة وراء كل اختيار", staffSub: "تبدأ الوجبة عند واجهة السمك. بتشكيلة واسعة ومعرفة بالمكوّنات، نساعدك في اختيار السمكة المناسبة.", staffRole: "خبير الأسماك", staffQuote: "أخبرني ماذا تريد أن تطهو — سأساعدك في اختيار السمكة المناسبة وتجهيزها لمطبخك.", staffBio: "يقوم EuroFisk Östra Sorgenfri على خبرة في تجارة السمك ورغبة في تقديم أكثر من واجهة تقليدية. تلتقي الأصناف المعروفة بأنواع من بحار العالم — تشكيلة متغيرة لمن يعرف ما يريد ولمن يحب اكتشاف شيء جديد.", facts: [
        { icon: "fish", title: "من القريب والبعيد", sub: "مفضلات محلية وأنواع مميزة." },
        { icon: "flame", title: "تنظيف حسب رغبتك", sub: "تجهيز وفق طلبك." },
        { icon: "heart", title: "متبّل وجاهز", sub: "جاهز للطهي بطريقتك." },
      ], placeLabel: "زرنا · Östra Sorgenfri", placeTitle: "سمك ومأكولات بحرية بالطريقة التي تناسبك", placeSub: "زر واجهة السمك أو اطلب للاستلام أو التوصيل. نساعدك في الاختيار والتنظيف والتتبيل حسب رغبتك.", interiorLabel: "تسوّق من واجهة السمك", interiorSub: "زرنا في Danska vägen واكتشف تشكيلة اليوم واختر السمك والمأكولات البحرية مباشرة من واجهتنا.", exteriorLabel: "زرنا", exteriorSub: "", infoLabel: "زرنا" },
      about: { label: "عن EuroFisk · Östra Sorgenfri", title: "الثقة تُبنى عند واجهة السمك", p1: "زيارة EuroFisk أكثر من مجرد شراء من واجهة السمك. إنها لحظة تجمع المعرفة والجودة والخدمة الشخصية — لتشعر بالثقة في اختيارك والحماس للوجبة القادمة.", p2: "نساعدك في العثور على السمكة المناسبة لما تريد طهوه، سواء كنت تبحث عن صنف مألوف أو ترغب في اكتشاف شيء جديد.", stats: [{ value: "المناسب لوجبتك", label: "نساعدك في الاختيار الصحيح." }, { value: "بطريقتك", label: "منظّف ومتبل وجاهز للطهي." }, { value: "خدمة شخصية", label: "المساعدة عندما تحتاجها." }] },
    },
  },
} as const;

const translatedSettings = {
  en: {
    deliveryBadge: "Free home delivery from 649 kr", deliveryTitle: "Free home delivery", deliveryArea: "Within Malmö",
    deliverySub: "Spend 649 kr or more and delivery is on us — charcoal-grilled fish, crispy favourites, and seafood, freshly prepared and delivered to your door.", deliveryCta: "Order delivery →", deliveryFeeNote: "Standard delivery fee: 99 kr",
    deliveryBenefits: [{ title: "Free delivery from 649 kr", sub: "Spend 649 kr or more and delivery is on us." }, { title: "2 signature sauces included", sub: "Two of our signature sauces are included at no extra cost." }, { title: "Allergies? Tell us", sub: "Let us know before ordering and we will help you choose correctly." }],
  },
  ar: {
    deliveryBadge: "توصيل مجاني من 649 كرونة", deliveryTitle: "توصيل منزلي مجاني", deliveryArea: "داخل مالمو",
    deliverySub: "اطلب بقيمة 649 كرونة أو أكثر والتوصيل علينا — سمك مشوي على الفحم وأطباق مقرمشة ومأكولات بحرية محضّرة طازجة وتصل إلى بابك.", deliveryCta: "اطلب التوصيل ←", deliveryFeeNote: "رسوم التوصيل العادية 99 كرونة",
    deliveryBenefits: [{ title: "توصيل مجاني من 649 كرونة", sub: "اطلب بقيمة 649 كرونة أو أكثر والتوصيل علينا." }, { title: "صلصتان مميزتان مشمولتان", sub: "تتضمن الطلبية صلصتين من صلصاتنا المميزة دون تكلفة إضافية." }, { title: "لديك حساسية؟ أخبرنا", sub: "أخبرنا قبل الطلب وسنساعدك في الاختيار المناسب." }],
  },
} as const;

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

  for (const locale of ["en", "ar"] as const) {
    for (const [slug, data] of Object.entries(translatedBranches[locale])) {
      const result = await payload.find({ collection: "branches", where: { slug: { equals: slug } }, limit: 1, locale, fallbackLocale: false, depth: 0 });
      const existing = result.docs[0];
      if (!existing) throw new Error(`Branch not found: ${slug}`);

      const currentFeatured = existing.featuredSection as { cards?: Array<Record<string, unknown>> } | undefined;
      const currentExperience = existing.experience as { facts?: Array<Record<string, unknown>> } | undefined;
      const currentAbout = existing.about as { stats?: Array<Record<string, unknown>> } | undefined;
      const merged = {
        ...data,
        featuredSection: {
          ...data.featuredSection,
          cards: data.featuredSection.cards.map((card: Record<string, unknown>, index: number) => ({ ...(currentFeatured?.cards?.[index] ?? {}), ...card })),
        },
        experience: {
          ...data.experience,
          facts: data.experience.facts.map((fact: Record<string, unknown>, index: number) => ({ ...(currentExperience?.facts?.[index] ?? {}), ...fact })),
        },
        about: {
          ...data.about,
          stats: data.about.stats.map((stat: Record<string, unknown>, index: number) => ({ ...(currentAbout?.stats?.[index] ?? {}), ...stat })),
        },
      };

      console.log(`  ${APPLY ? "update" : "would update"}: ${slug} (${locale})`);
      if (APPLY) await payload.update({ collection: "branches", id: existing.id, locale, fallbackLocale: false, data: merged as never });
    }

    const currentSettings = await payload.findGlobal({ slug: "site-settings", locale, fallbackLocale: false, depth: 0 });
    const currentBenefits = currentSettings.deliveryBenefits as Array<Record<string, unknown>> | undefined;
    const localizedSettings = {
      ...translatedSettings[locale],
      deliveryBenefits: translatedSettings[locale].deliveryBenefits.map((benefit, index) => ({ ...(currentBenefits?.[index] ?? {}), ...benefit })),
    };
    console.log(`  ${APPLY ? "update" : "would update"}: site-settings delivery content (${locale})`);
    if (APPLY) await payload.updateGlobal({ slug: "site-settings", locale, fallbackLocale: false, data: localizedSettings as never });
  }
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
