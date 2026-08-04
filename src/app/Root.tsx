import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, MapPin, Menu, X } from "lucide-react";
import { BranchChooser } from "@/app/components/BranchChooser";
import { LangSwitcher } from "@/app/components/LangSwitcher";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { stripBidi } from "@/app/lib/bidi";
import { useT } from "@/app/lib/branchCopy";
import { useBranch } from "@/app/lib/BranchContext";
import { stripBranchFromPath } from "@/app/lib/branches";
import { useLang } from "@/app/lib/LangContext";
import { logoImg } from "@/app/lib/images";
import { SiteLink, useSiteLocation, type SiteDestination } from "@/app/lib/siteRouter";
import { sans } from "@/app/lib/styles";
import { fmt } from "@/app/lib/translations";

export default function Root({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const t = useT();
  const location = useSiteLocation();
  const { branch, openChooser, pathFor, switchNotice } = useBranch();
  const [navOpen, setNavOpen] = useState(false);
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

  const currentPage = stripBranchFromPath(location.pathname);

  // Branch URLs are indexable separately, so the title and description have to name the
  // branch the visitor actually landed on — otherwise both URLs compete for one snippet.
  useEffect(() => {
    const pageName =
      currentPage === "/menu"
        ? t.seoPageMenu
        : currentPage === "/reviews"
          ? t.seoPageReviews
          : null;
    const site = `EuroFisk ${branch.area}`;

    document.title = pageName
      ? `${pageName} — ${site} | Malmö`
      : `${site} | ${t.seoHomeTagline}`;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        // The hours carry invisible bidi isolates for the Arabic layout; crawlers read
        // meta content as plain text, so they come back out here.
        stripBidi(
          fmt(t.seoDescription, {
            branch: branch.name,
            address: branch.address,
            hours: branch.hours.summary[lang],
          }),
        ),
      );
  }, [branch, currentPage, lang, t]);

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
      <motion.nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          onLight
            ? "border-b border-border bg-white shadow-sm"
            : "bg-white/90 shadow-sm backdrop-blur-md"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
          <SiteLink
            to={pathFor()}
            className="flex-shrink-0 transition-opacity hover:opacity-80"
            aria-label={`EuroFisk ${branch.area}`}
          >
            <ImageWithFallback
              src={logoImg}
              alt="EuroFisk"
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

            <button
              type="button"
              onClick={openChooser}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label={fmt(t.locationChangeAria, { area: branch.area })}
            >
              <MapPin size={15} className="text-primary" aria-hidden="true" />
              {branch.area}
              <ChevronDown size={14} aria-hidden="true" />
            </button>

            <LangSwitcher />

            <SiteLink
              to={contactTo}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
            >
              {t.navBook}
            </SiteLink>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 lg:hidden">
            <button
              type="button"
              onClick={openChooser}
              className="inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-semibold text-foreground"
              aria-label={fmt(t.locationChangeAria, { area: branch.area })}
            >
              <MapPin size={14} className="flex-shrink-0 text-primary" aria-hidden="true" />
              {/* No fixed width: the branch name is the only thing here allowed to shrink,
                  so a long area name truncates instead of overflowing narrow phones. */}
              <span className="truncate sm:max-w-32">{branch.area}</span>
            </button>
            {/* Stays in the header at every width — the globe alone on the narrowest phones,
                so the language switch never hides behind the hamburger. */}
            <LangSwitcher compact />
            <button
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
              <button
                type="button"
                onClick={() => {
                  setNavOpen(false);
                  openChooser();
                }}
                className="mb-5 flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 text-start"
              >
                <span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t.locationSelectedLabel}
                  </span>
                  <span className="mt-1 block font-semibold text-primary">{branch.name}</span>
                </span>
                <span className="text-xs font-bold text-primary">{t.changeShort}</span>
              </button>

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
                <SiteLink
                  to={contactTo}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground"
                  onClick={() => setNavOpen(false)}
                >
                  {t.navBook}
                </SiteLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <footer className="bg-foreground text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-3 lg:px-10">
          <div>
            <ImageWithFallback
              src={logoImg}
              alt="EuroFisk"
              className="mb-5 h-12 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed text-white/70">
              {fmt(t.footerTagline, { area: branch.area })}
            </p>
          </div>
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/35">
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
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/35">
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
                onClick={openChooser}
                className="mt-1 self-start text-sm font-semibold text-[#8CCBFF] underline decoration-white/20 underline-offset-4 hover:text-white"
              >
                {t.locationChange}
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

      <BranchChooser />

      <AnimatePresence>
        {switchNotice && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl bg-foreground px-5 py-4 text-sm font-medium text-white shadow-2xl"
          >
            <CheckCircle2 size={19} className="flex-shrink-0 text-[#8CCBFF]" aria-hidden="true" />
            {fmt(t.switchNotice, { branch: switchNotice })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
