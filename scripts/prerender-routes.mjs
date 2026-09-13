/**
 * Materialises every public SPA route and gives each one complete, crawlable metadata.
 *
 * GitHub Pages has no rewrite layer. Writing an index.html for every real route makes
 * deep links return 200 instead of the SPA shell through 404.html. The same pass writes
 * route-specific canonicals, language alternates, social cards and JSON-LD, then emits the
 * discovery files consumed by search engines and answer engines.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const shellPath = join(dist, "index.html");
const contentPath = join(root, "src/content/content.json");

const SITE_URL = "https://www.eurofisk.se";
const PHONE = "+46790164813";
const PAGE_PATHS = ["/", "/menu", "/reviews"];
const LANGUAGE_ORDER = ["sv", "en", "ar"];

const LANGUAGES = {
  sv: {
    prefix: "",
    dir: "ltr",
    ogLocale: "sv_SE",
    siteTitle: "EuroFisk Malmö | Färsk fisk i Rosengård & Östra Sorgenfri",
    siteDescription:
      "EuroFisk erbjuder färsk, grillad och friterad fisk i Rosengård och Östra Sorgenfri, Malmö. Se menyer, öppettider och kontaktuppgifter.",
    homeTagline: "Färsk fisk och skaldjur i Malmö",
    pages: { "/": "Start", "/menu": "Meny", "/reviews": "Omdömen" },
    homeDescription: (branch) =>
      branch.menuType === "portion"
        ? `EuroFisk ${branch.area} i Malmö serverar färsk, kolgrillad och friterad fisk. ${branch.address}. ${stripBidi(branch.hoursSummary)}. Se menyn och beställ via WhatsApp.`
        : `EuroFisk ${branch.area} i Malmö erbjuder färsk fisk per kilo, rå eller tillagad. ${branch.address}. ${stripBidi(branch.hoursSummary)}. Se dagens utbud.`,
    menuDescription: (branch) =>
      `${branch.menuIntro?.sub ?? "Se vår aktuella fiskmeny."} ${branch.address}.`,
    reviewsDescription: (branch) =>
      `Läs vad gäster säger om ${branch.name} i Malmö. Se öppettider, meny och kontaktuppgifter.`,
    imageAlt: (area) => `EuroFisk i ${area}, Malmö`,
  },
  en: {
    prefix: "/en",
    dir: "ltr",
    ogLocale: "en_GB",
    siteTitle: "EuroFisk Malmö | Fresh fish in Rosengård & Östra Sorgenfri",
    siteDescription:
      "EuroFisk serves fresh, charcoal-grilled and fried fish in Rosengård and Östra Sorgenfri, Malmö. View menus, opening hours and contact details.",
    homeTagline: "Fresh fish and seafood in Malmö",
    pages: { "/": "Home", "/menu": "Menu", "/reviews": "Reviews" },
    homeDescription: (branch) =>
      branch.menuType === "portion"
        ? `EuroFisk ${branch.area} in Malmö serves fresh, charcoal-grilled and fried fish. ${branch.address}. ${stripBidi(branch.hoursSummary)}. View the menu and order on WhatsApp.`
        : `EuroFisk ${branch.area} in Malmö offers fresh fish by the kilo, raw or cooked. ${branch.address}. ${stripBidi(branch.hoursSummary)}. See today's selection.`,
    menuDescription: (branch) =>
      `${branch.menuIntro?.sub ?? "Explore our current fish menu."} ${branch.address}.`,
    reviewsDescription: (branch) =>
      `Read what guests say about ${branch.name} in Malmö. View opening hours, the menu and contact details.`,
    imageAlt: (area) => `EuroFisk in ${area}, Malmö`,
  },
  ar: {
    prefix: "/ar",
    dir: "rtl",
    ogLocale: "ar_AR",
    siteTitle: "EuroFisk مالمو | سمك طازج في Rosengård وÖstra Sorgenfri",
    siteDescription:
      "يقدّم EuroFisk السمك الطازج والمشوي على الفحم والمقلي في Rosengård وÖstra Sorgenfri في مالمو. تصفّح القوائم وساعات العمل وبيانات التواصل.",
    homeTagline: "سمك ومأكولات بحرية طازجة في مالمو",
    pages: { "/": "الرئيسية", "/menu": "القائمة", "/reviews": "التقييمات" },
    homeDescription: (branch) =>
      branch.menuType === "portion"
        ? `يقدّم EuroFisk ${branch.area} السمك الطازج والمشوي على الفحم والمقلي. ${branch.address}. ${stripBidi(branch.hoursSummary)}. تصفّح القائمة واطلب.`
        : `يوفّر EuroFisk ${branch.area} في مالمو السمك الطازج بالكيلو، نيئاً أو مطهواً. ${branch.address}. ${stripBidi(branch.hoursSummary)}. اطّلع على تشكيلة اليوم.`,
    menuDescription: (branch) =>
      `${branch.menuIntro?.sub ?? "تصفّح قائمة السمك الحالية."} ${branch.address}.`,
    reviewsDescription: (branch) =>
      `اقرأ آراء الزوّار حول ${branch.name} في مالمو. اطّلع على ساعات العمل والقائمة وبيانات التواصل.`,
    imageAlt: (area) => `EuroFisk في ${area}، مالمو`,
  },
};

const BRANCH_SCHEMA = {
  rosengard: {
    type: "Restaurant",
    streetAddress: "Adlerfelts väg",
    postalCode: "213 70",
    openingHours: [
      { days: ["Monday", "Tuesday"], opens: "10:00", closes: "19:00" },
      {
        days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
  },
  "ostra-sorgenfri": {
    type: "GroceryStore",
    streetAddress: "Danska vägen 55",
    postalCode: "212 29",
    openingHours: [
      {
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  },
};

if (!existsSync(shellPath)) {
  console.error("dist/index.html is missing — run the build first.");
  process.exit(1);
}
if (!existsSync(contentPath)) {
  console.error("src/content/content.json is missing — fetch CMS content before building.");
  process.exit(1);
}

const shell = readFileSync(shellPath, "utf8");
const content = JSON.parse(readFileSync(contentPath, "utf8"));
const seoMarker = /<!-- SEO_META_START[\s\S]*?SEO_META_END -->/;

if (!seoMarker.test(shell)) {
  console.error("SEO metadata markers are missing from the built index.html.");
  process.exit(1);
}

// The router is code-owned: generating a 200 page for a CMS slug the app cannot match is
// worse than returning a real 404, so verify that both sources agree.
const branchesSource = readFileSync(join(root, "src/app/lib/branches.ts"), "utf8");
const slugs = [...branchesSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
if (slugs.length === 0) {
  console.error("No branch slugs found in src/app/lib/branches.ts");
  process.exit(1);
}

for (const lang of LANGUAGE_ORDER) {
  const cmsSlugs = (content.locales?.[lang]?.branches ?? []).map((branch) => branch.slug);
  const missing = slugs.filter((slug) => !cmsSlugs.includes(slug));
  const unknown = cmsSlugs.filter((slug) => !slugs.includes(slug));
  if (missing.length > 0 || unknown.length > 0) {
    console.error(
      `Branch mismatch for ${lang}. Missing in CMS: ${missing.join(", ") || "none"}; ` +
        `missing in router: ${unknown.join(", ") || "none"}.`,
    );
    process.exit(1);
  }
}

function stripBidi(value = "") {
  return String(value).replace(/[\u2066-\u2069]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeXml(value) {
  return escapeHtml(value).replaceAll("'", "&apos;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function localizedPath(lang, logicalPath) {
  const prefix = LANGUAGES[lang].prefix;
  if (logicalPath === "/") return prefix || "/";
  return `${prefix}${logicalPath}`;
}

function canonicalUrl(lang, logicalPath) {
  const path = localizedPath(lang, logicalPath);
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`;
}

function branchFor(lang, slug) {
  return content.locales[lang].branches.find((branch) => branch.slug === slug);
}

function publicMediaUrl(url) {
  if (!url) return `${SITE_URL}/apple-touch-icon.png`;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("r2.dev")) {
      return `https://media.eurofisk.se${parsed.pathname}`;
    }
    return parsed.href;
  } catch {
    return url;
  }
}

function imageFor(branch) {
  const media = branch?.photos?.social ?? branch?.photos?.exterior ?? branch?.photos?.hero;
  return {
    url: publicMediaUrl(media?.url ?? media?.hero ?? media?.card),
    width: media?.width ?? undefined,
    height: media?.height ?? undefined,
  };
}

function pageMetadata({ lang, pagePath, branch, indexable = true }) {
  const locale = LANGUAGES[lang];
  const logicalPath = branch ? `/${branch.slug}${pagePath === "/" ? "" : pagePath}` : pagePath;
  const url = canonicalUrl(lang, logicalPath);
  const image = imageFor(branch ?? branchFor(lang, "rosengard"));
  const imageAlt = locale.imageAlt(branch?.area ?? "Rosengård & Östra Sorgenfri");

  if (!branch) {
    return {
      lang,
      dir: locale.dir,
      pagePath,
      logicalPath,
      url,
      title: locale.siteTitle,
      description: locale.siteDescription,
      image,
      imageAlt,
      indexable,
    };
  }

  const pageName = locale.pages[pagePath];
  const title =
    pagePath === "/"
      ? `EuroFisk ${branch.area} | ${locale.homeTagline}`
      : `${pageName} — EuroFisk ${branch.area} | Malmö`;

  let description;
  if (pagePath === "/menu") description = locale.menuDescription(branch);
  else if (pagePath === "/reviews") description = locale.reviewsDescription(branch);
  else description = locale.homeDescription(branch);

  return {
    lang,
    dir: locale.dir,
    pagePath,
    logicalPath,
    url,
    title,
    description: stripBidi(description),
    image,
    imageAlt,
    branch,
    indexable,
  };
}

function structuredData(meta) {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const webPageId = `${meta.url}#webpage`;
  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "EuroFisk",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/apple-touch-icon.png`,
        width: 180,
        height: 180,
      },
      telephone: PHONE,
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_URL}/`,
      name: "EuroFisk",
      inLanguage: meta.lang,
      publisher: { "@id": organizationId },
    },
  ];

  let businessId;
  if (meta.branch) {
    const branch = meta.branch;
    const schema = BRANCH_SCHEMA[branch.slug];
    businessId = `${canonicalUrl("sv", `/${branch.slug}`)}#business`;
    const branchDescription = stripBidi(
      [branch.about?.p1, branch.about?.p2].filter(Boolean).join(" ") || meta.description,
    );

    graph.push({
      "@type": schema.type,
      "@id": businessId,
      name: branch.name,
      description: branchDescription,
      inLanguage: meta.lang,
      url: canonicalUrl(meta.lang, `/${branch.slug}`),
      image: meta.image.url,
      telephone: PHONE,
      priceRange: "SEK",
      currenciesAccepted: "SEK",
      address: {
        "@type": "PostalAddress",
        streetAddress: schema.streetAddress,
        postalCode: schema.postalCode,
        addressLocality: "Malmö",
        addressCountry: "SE",
      },
      openingHoursSpecification: schema.openingHours.map((hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days,
        opens: hours.opens,
        closes: hours.closes,
      })),
      hasMap: branch.mapsUrl,
      hasMenu: canonicalUrl(meta.lang, `/${branch.slug}/menu`),
      ...(schema.type === "Restaurant" ? { servesCuisine: ["Seafood", "Fish"] } : {}),
      parentOrganization: { "@id": organizationId },
    });
  }

  graph.push({
    "@type": "WebPage",
    "@id": webPageId,
    url: meta.url,
    name: meta.title,
    description: meta.description,
    inLanguage: meta.lang,
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId ?? organizationId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: meta.image.url,
      ...(meta.image.width ? { width: meta.image.width } : {}),
      ...(meta.image.height ? { height: meta.image.height } : {}),
    },
  });

  if (meta.branch) {
    const locale = LANGUAGES[meta.lang];
    const items = [
      { name: locale.pages["/"], item: canonicalUrl(meta.lang, "/") },
      {
        name: meta.branch.area,
        item: canonicalUrl(meta.lang, `/${meta.branch.slug}`),
      },
    ];
    if (meta.pagePath !== "/") {
      items.push({ name: locale.pages[meta.pagePath], item: meta.url });
    }
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function seoBlock(meta) {
  const locale = LANGUAGES[meta.lang];
  const alternates = LANGUAGE_ORDER.map(
    (lang) =>
      `      <link rel="alternate" hreflang="${lang}" href="${escapeHtml(
        canonicalUrl(lang, meta.logicalPath),
      )}" />`,
  );
  alternates.push(
    `      <link rel="alternate" hreflang="x-default" href="${escapeHtml(
      canonicalUrl("sv", meta.logicalPath),
    )}" />`,
  );

  const ogAlternates = LANGUAGE_ORDER.filter((lang) => lang !== meta.lang).map(
    (lang) =>
      `      <meta property="og:locale:alternate" content="${LANGUAGES[lang].ogLocale}" />`,
  );
  const imageDimensions = [
    meta.image.width
      ? `      <meta property="og:image:width" content="${meta.image.width}" />`
      : "",
    meta.image.height
      ? `      <meta property="og:image:height" content="${meta.image.height}" />`
      : "",
  ].filter(Boolean);

  return `<!-- SEO_META_START — generated for ${meta.logicalPath} (${meta.lang}) -->
      <title>${escapeHtml(meta.title)}</title>
      <meta name="description" content="${escapeHtml(meta.description)}" />
      <meta name="robots" content="${
        meta.indexable
          ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          : "noindex, follow"
      }" />
      <link rel="canonical" href="${escapeHtml(meta.url)}" />
${alternates.join("\n")}
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="EuroFisk" />
      <meta property="og:locale" content="${locale.ogLocale}" />
${ogAlternates.join("\n")}
      <meta property="og:url" content="${escapeHtml(meta.url)}" />
      <meta property="og:title" content="${escapeHtml(meta.title)}" />
      <meta property="og:description" content="${escapeHtml(meta.description)}" />
      <meta property="og:image" content="${escapeHtml(meta.image.url)}" />
      <meta property="og:image:secure_url" content="${escapeHtml(meta.image.url)}" />
      <meta property="og:image:type" content="image/webp" />
${imageDimensions.join("\n")}
      <meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
      <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
      <meta name="twitter:image" content="${escapeHtml(meta.image.url)}" />
      <meta name="twitter:image:alt" content="${escapeHtml(meta.imageAlt)}" />
      <script type="application/ld+json">${safeJson(structuredData(meta))}</script>
      <!-- SEO_META_END -->`;
}

function renderHtml(meta) {
  return shell
    .replace(seoMarker, seoBlock(meta))
    .replace(/<html lang="[^"]+"(?: dir="[^"]+")?>/, `<html lang="${meta.lang}" dir="${meta.dir}">`);
}

function writeRoute(routePath, html) {
  if (routePath === "/") {
    writeFileSync(shellPath, html);
    return;
  }
  const directory = join(dist, routePath);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "index.html"), html);
}

const indexablePages = [];
const writtenRoutes = [];

for (const lang of LANGUAGE_ORDER) {
  // One site-wide landing page per language.
  const rootMeta = pageMetadata({ lang, pagePath: "/", branch: null });
  writeRoute(localizedPath(lang, "/"), renderHtml(rootMeta));
  indexablePages.push(rootMeta);
  writtenRoutes.push(localizedPath(lang, "/"));

  // Keep old unscoped menu/review links functional, but do not index them: the visitor's
  // stored location controls their content, while canonical branch URLs are deterministic.
  for (const pagePath of PAGE_PATHS.slice(1)) {
    const fallbackBranch = branchFor(lang, "rosengard");
    const legacyMeta = pageMetadata({
      lang,
      pagePath,
      branch: fallbackBranch,
      indexable: false,
    });
    legacyMeta.logicalPath = pagePath;
    legacyMeta.url = canonicalUrl(lang, `/${fallbackBranch.slug}${pagePath}`);
    writeRoute(localizedPath(lang, pagePath), renderHtml(legacyMeta));
    writtenRoutes.push(localizedPath(lang, pagePath));
  }

  for (const slug of slugs) {
    const branch = branchFor(lang, slug);
    for (const pagePath of PAGE_PATHS) {
      const meta = pageMetadata({ lang, pagePath, branch });
      writeRoute(localizedPath(lang, meta.logicalPath), renderHtml(meta));
      indexablePages.push(meta);
      writtenRoutes.push(localizedPath(lang, meta.logicalPath));
    }
  }
}

// A genuine 404 remains a 404 and explicitly says not to index the fallback shell.
const notFoundMeta = pageMetadata({
  lang: "sv",
  pagePath: "/",
  branch: null,
  indexable: false,
});
notFoundMeta.title = "Sidan hittades inte | EuroFisk";
notFoundMeta.description = "Sidan du sökte finns inte.";
writeFileSync(join(dist, "404.html"), renderHtml(notFoundMeta));
writeFileSync(join(dist, ".nojekyll"), "");

const lastModified = new Date().toISOString().slice(0, 10);
const sitemapEntries = indexablePages
  .map((meta) => {
    const alternates = LANGUAGE_ORDER.map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(
          canonicalUrl(lang, meta.logicalPath),
        )}" />`,
    );
    alternates.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
        canonicalUrl("sv", meta.logicalPath),
      )}" />`,
    );
    return `  <url>
    <loc>${escapeXml(meta.url)}</loc>
    <lastmod>${lastModified}</lastmod>
${alternates.join("\n")}
    <image:image>
      <image:loc>${escapeXml(meta.image.url)}</image:loc>
      <image:title>${escapeXml(meta.imageAlt)}</image:title>
    </image:image>
  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

const robots = `# EuroFisk public website
# Search and answer-engine crawling is allowed. Cloudflare may append separate
# content-usage signals according to the domain owner's AI Crawl Control settings.
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync(join(dist, "robots.txt"), robots);

function menuLines(lang, branch) {
  const categories = (content.locales[lang].menu ?? [])
    .filter((category) => category.menuType === branch.menuType)
    .sort((a, b) => a.order - b.order);
  return categories
    .flatMap((category) => [
      `### ${category.label}`,
      category.note ? category.note : null,
      ...category.items.map((item) => {
        const prices = item.options?.length
          ? item.options.map((option) => `${option.label}: ${option.price}`).join("; ")
          : item.price;
        return `- ${item.name}${item.desc ? ` — ${item.desc}` : ""}${prices ? ` (${prices})` : ""}`;
      }),
      "",
    ])
    .filter((line) => line !== null);
}

const llms = `# EuroFisk

> EuroFisk is a fish restaurant and fresh-fish counter with two locations in Malmö, Sweden. This file summarizes canonical public facts for search and answer engines.

## Locations

- [EuroFisk Rosengård](${SITE_URL}/rosengard/): cooked fish portions, charcoal-grilled and fried fish. Adlerfelts väg, 213 70 Malmö. Monday–Tuesday 10:00–19:00; Wednesday–Sunday 10:00–20:00.
- [EuroFisk Östra Sorgenfri](${SITE_URL}/ostra-sorgenfri/): fresh fish by the kilogram, available raw, cleaned, marinated, grilled or fried. Danska vägen 55, 212 29 Malmö. Daily 09:00–18:00.

## Canonical pages

- [Rosengård menu](${SITE_URL}/rosengard/menu/)
- [Rosengård reviews](${SITE_URL}/rosengard/reviews/)
- [Östra Sorgenfri menu](${SITE_URL}/ostra-sorgenfri/menu/)
- [Östra Sorgenfri reviews](${SITE_URL}/ostra-sorgenfri/reviews/)
- [Full multilingual content](${SITE_URL}/llms-full.txt)

## Languages

The complete site is available in Swedish (default), [English](${SITE_URL}/en/) and [Arabic](${SITE_URL}/ar/). Every localized page declares its canonical URL and language alternates.

## Contact

Phone and WhatsApp: ${PHONE}. Menu availability and prices may change; the canonical menu pages are the source of truth.
`;
writeFileSync(join(dist, "llms.txt"), llms);

const llmsFullSections = LANGUAGE_ORDER.flatMap((lang) => {
  return [
    `## ${lang.toUpperCase()}`,
    "",
    ...slugs.flatMap((slug) => {
      const branch = branchFor(lang, slug);
      return [
        `### ${branch.name}`,
        "",
        `Canonical URL: ${canonicalUrl(lang, `/${slug}`)}`,
        `Address: ${branch.address}`,
        `Phone: ${PHONE}`,
        `Opening hours: ${stripBidi(branch.hoursSummary)}`,
        branch.about?.p1,
        branch.about?.p2,
        "",
        `Menu: ${canonicalUrl(lang, `/${slug}/menu`)}`,
        branch.menuIntro?.sub,
        branch.menuIntro?.note,
        "",
        ...menuLines(lang, branch),
      ].filter(Boolean);
    }),
  ];
});

writeFileSync(
  join(dist, "llms-full.txt"),
  `# EuroFisk — full multilingual reference\n\n${llmsFullSections.join("\n")}\n`,
);

console.log(`Prerendered ${writtenRoutes.length} routes in sv, en and ar.`);
console.log(`Indexed ${indexablePages.length} canonical URLs in sitemap.xml.`);
console.log("Generated robots.txt, llms.txt and llms-full.txt.");
