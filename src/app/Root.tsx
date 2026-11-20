import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Menu, X } from "lucide-react";
import { OrderChooser } from "@/app/components/OrderChooser";
import { useOrder } from "@/app/lib/OrderContext";
import { LangSwitcher } from "@/app/components/LangSwitcher";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { stripBidi } from "@/app/lib/bidi";
import { useT } from "@/app/lib/branchCopy";
import { useBranch } from "@/app/lib/BranchContext";
import { branchPath, getBranchIdFromPath, stripBranchFromPath } from "@/app/lib/branches";
import { cmsBranch, cmsLocale, mediaUrl } from "@/app/lib/cmsContent";
import { pathForLang, stripLangFromPath, useLang, type Lang } from "@/app/lib/LangContext";
import { logoImg, LOGO_SIZE } from "@/app/lib/images";
import { SiteLink, useSiteLocation, type SiteDestination } from "@/app/lib/siteRouter";
import { sans } from "@/app/lib/styles";
import { fmt } from "@/app/lib/translations";

const SITE_URL = "https://www.eurofisk.se";
const SEO_LANGS: Lang[] = ["sv", "en", "ar"];

function absoluteSiteUrl(lang: Lang, logicalPath: string) {
  const path = pathForLang(logicalPath, lang);
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`;
}

function publicMediaUrl(url: string) {
  try {
    return new URL(url).href;
  } catch {
    return url;
  }
}

export default function Root({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const t = useT();
  const siteLogo = mediaUrl(cmsLocale(lang)?.settings.logo, "original") || logoImg;
  const location = useSiteLocation();
  const { branch, branchId, pathFor } = useBranch();
  const { openOrder } = useOrder();
  const [navOpen, setNavOpen] = useState(false);
  const navToggleRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setNavOpen(false);
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.hash, location.pathname]);

  // The mobile panel behaves like any dismissible overlay: Escape closes it and focus
  // goes back to the control that opened it, instead of being stranded mid-document.
  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setNavOpen(false);
      navToggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  const currentPage = stripBranchFromPath(location.pathname);

  // Keep metadata correct after client-side navigation too. The build writes the same data
  // into each route's source HTML for crawlers and social-card bots that do not run React.
  useEffect(() => {
    const pathBranch = getBranchIdFromPath(location.pathname);
    const currentLogicalPath = stripLangFromPath(location.pathname);
    const validPage = currentPage === "/" || currentPage === "/menu" || currentPage === "/reviews";
    const siteLanding = !pathBranch && currentPage === "/";
    const indexable = validPage && Boolean(pathBranch || siteLanding);
    const pageName =
      currentPage === "/menu"
        ? t.seoPageMenu
        : currentPage === "/reviews"
          ? t.seoPageReviews
          : null;
    const site = `EuroFisk ${branch.area}`;
    const title = !validPage
      ? `${t.notFoundTitle} | EuroFisk`
      : siteLanding
        ? t.seoSiteTitle
        : pageName
          ? `${pageName} — ${site} | Malmö`
          : `${site} | ${t.seoHomeTagline}`;
    const description = !validPage
      ? t.notFoundSub
      : siteLanding
        ? t.seoSiteDescription
        : currentPage === "/menu"
          ? fmt(t.seoMenuDescription, { branch: branch.name })
          : currentPage === "/reviews"
            ? fmt(t.seoReviewsDescription, { branch: branch.name })
            : fmt(t.seoDescription, {
                branch: branch.name,
                address: branch.address,
                hours: branch.hours.summary[lang],
              });

    // /menu and /reviews remain usable aliases; crawlers use the restaurant URL.
    const canonicalLogicalPath = pathBranch || siteLanding || !validPage
      ? currentLogicalPath
      : branchPath(branchId, currentPage);
    const canonical = absoluteSiteUrl(lang, canonicalLogicalPath);
    const cms = cmsBranch(lang, branchId);
    const cmsImage = cms?.photos.social ?? cms?.photos.exterior ?? cms?.photos.hero;
    const image = publicMediaUrl(
      mediaUrl(cmsImage, "original") ||
        "https://media.eurofisk.se/rosengard-exterior-1400x1050.webp",
    );
    const imageAlt = siteLanding
      ? "EuroFisk Rosengård, Malmö"
      : `EuroFisk ${branch.area}, Malmö`;

    document.title = title;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", stripBidi(description));
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        "content",
        indexable
          ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          : "noindex, follow",
      );
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);

    for (const alternateLang of SEO_LANGS) {
      document
        .querySelector(`link[rel="alternate"][hreflang="${alternateLang}"]`)
        ?.setAttribute("href", absoluteSiteUrl(alternateLang, canonicalLogicalPath));
    }
    document
      .querySelector('link[rel="alternate"][hreflang="x-default"]')
      ?.setAttribute("href", absoluteSiteUrl("sv", canonicalLogicalPath));

    const socialTags: Array<[string, string]> = [
      ['meta[property="og:url"]', canonical],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', stripBidi(description)],
      ['meta[property="og:image"]', image],
      ['meta[property="og:image:secure_url"]', image],
      ['meta[property="og:image:alt"]', imageAlt],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', stripBidi(description)],
      ['meta[name="twitter:image"]', image],
      ['meta[name="twitter:image:alt"]', imageAlt],
    ];
    for (const [selector, value] of socialTags) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
  }, [branch, branchId, currentPage, lang, location.pathname, t]);

  const contactTo: SiteDestination = { pathname: pathFor(), hash: "#kontakt" };
  const navItems: Array<{ label: string; page: string; to: SiteDestination }> = [
    { label: t.navHome, page: "/", to: pathFor() },
    { label: t.navMenu, page: "/menu", to: pathFor("/menu") },
    { label: t.navReviews, page: "/reviews", to: pathFor("/reviews") },
    { label: t.navContact, page: "#kontakt", to: contactTo },
  ];
  const onLight = scrolled || currentPage !== "/";

  return (
    <div className="min-h-screen bg-background text-foreground" style={sans}>
      <a
        href="#content"
        className="sr-only rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80]"
      >
        {t.skipToContent}
      </a>

      <motion.nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          onLight
            ? "border-b border-border bg-white shadow-sm"
            : "bg-white/90 shadow-sm backdrop-blur-md"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
          <SiteLink
            to={pathFor()}
            className="flex-shrink-0 transition-opacity hover:opacity-80"
            aria-label={`EuroFisk ${branch.area}`}
          >
            <ImageWithFallback
              src={siteLogo}
              fallbackSrc={logoImg}
              alt="EuroFisk"
              width={LOGO_SIZE.width}
              height={LOGO_SIZE.height}
              className="h-10 w-auto object-contain sm:h-11"
            />
          </SiteLink>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const active = item.page !== "#kontakt" && currentPage === item.page;
                return (
                  <SiteLink
                    key={item.label}
                    to={item.to}
                    className={`relative text-sm font-medium transition-colors ${
                      active ? "text-primary" : "text-foreground/65 hover:text-primary"
                    }`}
                    style={sans}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 inset-x-0 h-0.5 rounded-full bg-primary"
                      />
                    )}
                  </SiteLink>
                );
              })}
            </div>

            <div className="h-6 w-px bg-border" aria-hidden="true" />

            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={15} aria-hidden="true" /> {branch.area}
            </span>

            <LangSwitcher />

            <button type="button" data-order-trigger onClick={openOrder}
              className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent">
              {t.navBook}
            </button>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 lg:hidden">
            <button type="button" data-order-trigger onClick={openOrder}
              className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-xs font-bold text-white">
              {t.navBook}
            </button>
            {/* Stays in the header at every width — the globe alone on the narrowest phones,
                so the language switch never hides behind the hamburger. */}
            <LangSwitcher compact />
            <button
              ref={navToggleRef}
              type="button"
              className="flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center p-2 text-foreground"
              onClick={() => setNavOpen((open) => !open)}
              aria-label={navOpen ? t.navClose : t.navOpen}
              aria-expanded={navOpen}
              aria-controls="mobile-navigation"
            >
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border bg-white px-5 py-5 lg:hidden"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <SiteLink
                    key={item.label}
                    to={item.to}
                    className={`text-sm font-medium transition-colors ${
                      item.page !== "#kontakt" && currentPage === item.page
                        ? "text-primary"
                        : "text-foreground/65 hover:text-primary"
                    }`}
                    onClick={() => setNavOpen(false)}
                  >
                    {item.label}
                  </SiteLink>
                ))}
                <button type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground"
                  onClick={() => { setNavOpen(false); openOrder(); }}>
                  {t.navBook}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.main
        id="content"
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.main>

      <footer className="bg-foreground text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-3 lg:px-10">
          <div>
            <ImageWithFallback
              src={siteLogo}
              fallbackSrc={logoImg}
              alt="EuroFisk"
              width={LOGO_SIZE.width}
              height={LOGO_SIZE.height}
              loading="lazy"
              className="mb-5 h-12 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed text-white/70">
              {fmt(t.footerTagline, { area: branch.area })}
            </p>
          </div>
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/70">
              {t.footerNav}
            </p>
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <SiteLink
                  key={item.label}
                  to={item.to}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </SiteLink>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/70">
              {t.footerContact}
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <strong className="font-semibold text-white">{branch.name}</strong>
              <a href={branch.phoneHref} className="transition-colors hover:text-white">
                {branch.phoneDisplay}
              </a>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {branch.address}
              </a>
              <span>{branch.hours.summary[lang]}</span>
              <button
                type="button"
                onClick={openOrder}
                className="mt-1 self-start text-sm font-semibold text-sky-link underline decoration-white/20 underline-offset-4 hover:text-white"
              >
                {t.navBook}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="py-5 text-center text-xs text-white/55">
            © {new Date().getFullYear()} {t.footerCopy}
          </p>
        </div>
      </footer>

      <OrderChooser />
    </div>
  );
}
