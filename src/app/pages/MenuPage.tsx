import { useState, useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { useLang } from "@/app/lib/LangContext";
import { T } from "@/app/lib/translations";
import { MENU_DATA } from "@/app/lib/menuData";
import { display, sans } from "@/app/lib/styles";
import { FadeUp, FadeUpGroup } from "@/app/lib/animations";
import { SiteLink } from "@/app/lib/siteRouter";

export default function MenuPage() {
  const { lang } = useLang();
  const t = T[lang];
  const categories = MENU_DATA[lang];
  const [activeId, setActiveId] = useState(categories[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setActiveId(MENU_DATA[lang][0].id);
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  const scrollTo = (id: string) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="pt-16 min-h-screen">
      {/* Page header */}
      <div className="bg-primary text-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
          <FadeUp>
            <p className="text-[#C7E5FF] text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.menuPageLabel}</p>
            <h1 className="text-5xl lg:text-7xl font-normal mb-3" style={display}>{t.menuPageTitle}</h1>
            <p className="text-white/85 max-w-lg" style={sans}>{t.menuPageSub}</p>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-12">
        {/* Mobile category navigation stays available throughout the long menu. */}
        <nav
          aria-label={lang === "sv" ? "Menykategorier" : "Menu categories"}
          className="lg:hidden sticky top-16 z-30 mb-8 -mx-5 px-5 py-3 overflow-x-auto flex gap-2 bg-background/95 backdrop-blur-md border-b border-border"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              aria-current={activeId === cat.id ? "true" : undefined}
              className={`min-h-11 flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeId === cat.id ? "bg-primary text-white" : "bg-secondary text-foreground"}`}
              style={sans}>
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="flex gap-10 items-start">
          {/* Sticky sidebar */}
          <aside className="hidden lg:flex flex-col gap-1 sticky top-24 w-52 flex-shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                aria-current={activeId === cat.id ? "true" : undefined}
                className={`min-h-11 text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeId === cat.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-primary/8"}`}
                style={sans}>
                {cat.label}
              </button>
            ))}
            <div className="mt-6 p-4 bg-card border border-border rounded-xl">
              <p className="text-xs text-muted-foreground leading-relaxed" style={sans}>{t.menuNote}</p>
            </div>
          </aside>

          {/* Items */}
          <div className="flex-1 min-w-0 flex flex-col gap-14">
            {categories.map((cat, catIndex) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-32" ref={(el) => { sectionRefs.current[cat.id] = el; }}>
                <FadeUp delay={catIndex * 0.05}>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-3xl font-normal text-foreground" style={display}>{cat.label}</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-sm" style={sans}>{cat.items.length} {t.menuDishes}</span>
                  </div>
                  {cat.note && (
                    <p className="text-sm text-muted-foreground -mt-2 mb-5 max-w-2xl" style={sans}>{cat.note}</p>
                  )}
                </FadeUp>
                <FadeUpGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3" stagger={0.06}>
                  {cat.items.map((item) => (
                    <div key={item.name}
                      className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-200 group">
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-foreground text-sm lg:text-base leading-tight" style={sans}>{item.name}</span>
                          {item.tag && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/12 text-primary px-2 py-0.5 rounded-full flex-shrink-0" style={sans}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        {item.arabic && (
                          <p lang="ar" dir="rtl" className="w-fit text-primary/80 text-base font-semibold leading-tight mb-2">
                            {item.arabic}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs leading-relaxed mb-3" style={sans}>{item.desc}</p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-primary font-bold text-sm" style={sans}>{item.price}</span>
                          {item.orderable !== false && (
                            <SiteLink
                              to={{ pathname: "/", search: `?order=${encodeURIComponent(item.name)}`, hash: "#kontakt" }}
                              className="min-h-11 inline-flex items-center justify-center rounded-lg border border-primary/25 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                              aria-label={`${lang === "sv" ? "Beställ" : "Order"} ${item.name}`}
                              style={sans}
                            >
                              {lang === "sv" ? "Beställ" : "Order"}
                            </SiteLink>
                          )}
                        </div>
                      </div>

                      {/* Circular photo */}
                      {item.photo ? (
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-border group-hover:border-primary/30 transition-colors duration-200 shadow-sm">
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex-shrink-0 bg-primary/8 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-1 text-primary/55">
                          <ImageIcon size={20} aria-hidden="true" />
                          <span className="text-[9px] font-semibold text-center px-2 leading-tight" style={sans}>
                            {lang === "sv" ? "Foto kommer" : "Photo coming"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </FadeUpGroup>
              </section>
            ))}
            <p className="text-muted-foreground text-sm pb-8" style={sans}>{t.menuNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
