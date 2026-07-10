import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useLang } from "@/app/lib/LangContext";
import { T } from "@/app/lib/translations";
import { logoImg } from "@/app/lib/images";
import { sans, display } from "@/app/lib/styles";

const NAV_ROUTES = ["/", "/menu", "/reviews", "/#kontakt"];

export default function Root() {
  const { lang, setLang } = useLang();
  const t = T[lang];
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setNavOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLabels = [t.navHome, t.navMenu, t.navReviews, t.navContact];
  const isActive = (route: string) =>
    route === "/" ? location.pathname === "/" : location.pathname.startsWith(route);

  const onLight = scrolled || location.pathname !== "/";

  return (
    <div className="bg-background text-foreground min-h-screen" style={sans}>

      {/* ── NAV ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${onLight ? "bg-white shadow-sm border-b border-border" : "bg-white/85 backdrop-blur-md"}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-6xl mx-auto px-5 lg:px-10 flex items-center justify-between h-16">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <ImageWithFallback src={logoImg} alt="EuroFisk logo" className="h-10 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLabels.map((label, i) => {
              const route = NAV_ROUTES[i];
              const active = isActive(route);
              const cls = `text-sm font-medium transition-colors relative ${active ? "text-primary" : "text-foreground/65 hover:text-primary"}`;
              return route.startsWith("/#") ? (
                <a key={label} href={route} className={cls} style={sans}>{label}</a>
              ) : (
                <Link key={label} to={route} className={cls} style={sans}>
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => setLang(lang === "sv" ? "en" : "sv")}
              className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/55 hover:border-primary hover:text-primary transition-colors"
              style={sans}>
              <span className="text-base leading-none">{lang === "sv" ? "🇬🇧" : "🇸🇪"}</span>
              {lang === "sv" ? "EN" : "SV"}
            </button>
            <a href="/#kontakt"
              className="bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors"
              style={sans}>
              {t.navBook}
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setLang(lang === "sv" ? "en" : "sv")}
              className="flex items-center gap-1 border border-border rounded-full px-2.5 py-1 text-xs font-semibold text-foreground/55"
              style={sans}>
              <span className="text-sm">{lang === "sv" ? "🇬🇧" : "🇸🇪"}</span>
              {lang === "sv" ? "EN" : "SV"}
            </button>
            <button className="text-foreground p-1" onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border px-5 py-5 flex flex-col gap-4 overflow-hidden"
          >
            {navLabels.map((label, i) => {
              const route = NAV_ROUTES[i];
              return route.startsWith("/#") ? (
                <a key={label} href={route}
                  className="text-sm font-medium text-foreground/65 hover:text-primary transition-colors"
                  onClick={() => setNavOpen(false)}>{label}</a>
              ) : (
                <Link key={label} to={route}
                  className={`text-sm font-medium transition-colors ${isActive(route) ? "text-primary" : "text-foreground/65 hover:text-primary"}`}
                  onClick={() => setNavOpen(false)}>{label}</Link>
              );
            })}
            <a href="/#kontakt"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded text-sm font-semibold text-center"
              onClick={() => setNavOpen(false)}>
              {t.navBook}
            </a>
          </motion.div>
        )}
      </motion.nav>

      {/* ── PAGE (animated on route change) ── */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground text-white">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="bg-white inline-block rounded-lg p-2 mb-5">
              <ImageWithFallback src={logoImg} alt="EuroFisk logo" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-white/55 text-sm leading-relaxed">{t.footerSub}</p>
          </div>
          <div>
            <p className="text-white/35 text-xs uppercase tracking-widest mb-5 font-semibold" style={sans}>{t.footerNav}</p>
            <div className="flex flex-col gap-3">
              {navLabels.map((label, i) => {
                const route = NAV_ROUTES[i];
                return route.startsWith("/#") ? (
                  <a key={label} href={route} className="text-white/55 text-sm hover:text-white transition-colors">{label}</a>
                ) : (
                  <Link key={label} to={route} className="text-white/55 text-sm hover:text-white transition-colors">{label}</Link>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-white/35 text-xs uppercase tracking-widest mb-5 font-semibold" style={sans}>{t.footerContact}</p>
            <div className="flex flex-col gap-3 text-white/55 text-sm">
              <span>0730 56 68 13</span>
              <span>Centrum, Eskilstuna</span>
              <span>{t.footerHours}</span>
            </div>
            <div className="flex gap-3 mt-6">
              <a href="#" className="text-white/35 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="text-white/35 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="text-center text-white/25 text-xs py-5" style={sans}>{t.footerCopy}</p>
        </div>
      </footer>
    </div>
  );
}
