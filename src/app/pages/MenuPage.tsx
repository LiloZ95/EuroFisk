import { useEffect, useRef, useState } from "react";
import { ArrowRight, ImageIcon, MapPin, Scale } from "lucide-react";
import { FadeUp, FadeUpGroup } from "@/app/lib/animations";
import { useBranch } from "@/app/lib/BranchContext";
import { KG_MENU_DATA } from "@/app/lib/kgMenuData";
import { useLang } from "@/app/lib/LangContext";
import { MENU_DATA } from "@/app/lib/menuData";
import { SiteLink } from "@/app/lib/siteRouter";
import { display, sans } from "@/app/lib/styles";
import { T } from "@/app/lib/translations";

function MenuHeader({
  title,
  subtitle,
  label,
}: {
  title: string;
  subtitle: string;
  label: string;
}) {
  const { branch } = useBranch();

  return (
    <div className="bg-primary py-16 text-white lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <FadeUp>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C7E5FF]" style={sans}>
            {label}
          </p>
          <h1 className="mb-3 text-5xl font-normal lg:text-7xl" style={display}>
            {title}
          </h1>
          <p className="max-w-xl text-white/85" style={sans}>
            {subtitle}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold">
            <MapPin size={15} aria-hidden="true" />
            {branch.name}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function PortionMenu() {
  const { lang } = useLang();
  const { pathFor } = useBranch();
  const t = T[lang];
  const categories = MENU_DATA[lang];
  const [activeId, setActiveId] = useState(categories[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setActiveId(MENU_DATA[lang][0].id);
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    Object.values(sectionRefs.current).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, [lang]);

  const scrollTo = (id: string) =>
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <MenuHeader
        label={t.menuPageLabel}
        title={t.menuPageTitle}
        subtitle={t.menuPageSub}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-10">
        <nav
          aria-label={lang === "sv" ? "Menykategorier" : "Menu categories"}
          className="sticky top-16 z-30 -mx-5 mb-8 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-5 py-3 backdrop-blur-md lg:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => scrollTo(category.id)}
              aria-current={activeId === category.id ? "true" : undefined}
              className={`min-h-11 flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeId === category.id
                  ? "bg-primary text-white"
                  : "bg-secondary text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </nav>

        <div className="flex items-start gap-10">
          <aside className="sticky top-24 hidden w-52 flex-shrink-0 flex-col gap-1 lg:flex">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollTo(category.id)}
                aria-current={activeId === category.id ? "true" : undefined}
                className={`min-h-11 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                  activeId === category.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-primary"
                }`}
              >
                {category.label}
              </button>
            ))}
            <div className="mt-6 rounded-xl border border-border bg-card p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">{t.menuNote}</p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-14">
            {categories.map((category, categoryIndex) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-32"
                ref={(element) => {
                  sectionRefs.current[category.id] = element;
                }}
              >
                <FadeUp delay={categoryIndex * 0.05}>
                  <div className="mb-5 flex items-center gap-3">
                    <h2 className="text-3xl font-normal text-foreground" style={display}>
                      {category.label}
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm text-muted-foreground">
                      {category.items.length} {t.menuDishes}
                    </span>
                  </div>
                  {category.note && (
                    <p className="-mt-2 mb-5 max-w-2xl text-sm text-muted-foreground">
                      {category.note}
                    </p>
                  )}
                </FadeUp>

                <FadeUpGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2" stagger={0.06}>
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/8"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold leading-tight text-foreground lg:text-base">
                            {item.name}
                          </span>
                          {item.tag && (
                            <span className="flex-shrink-0 rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        {item.arabic && (
                          <p lang="ar" dir="rtl" className="mb-2 w-fit text-base font-semibold leading-tight text-primary/80">
                            {item.arabic}
                          </p>
                        )}
                        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-primary">{item.price}</span>
                          {item.orderable !== false && (
                            <SiteLink
                              to={{
                                pathname: pathFor(),
                                search: `?order=${encodeURIComponent(item.name)}`,
                                hash: "#kontakt",
                              }}
                              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary/25 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                              aria-label={`${lang === "sv" ? "Beställ" : "Order"} ${item.name}`}
                            >
                              {lang === "sv" ? "Beställ" : "Order"}
                            </SiteLink>
                          )}
                        </div>
                      </div>

                      {item.photo ? (
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-border shadow-sm transition-colors group-hover:border-primary/30 lg:h-24 lg:w-24">
                          <img
                            src={item.photo}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-primary/20 bg-primary/8 text-primary/55 lg:h-24 lg:w-24">
                          <ImageIcon size={20} aria-hidden="true" />
                          <span className="px-2 text-center text-[9px] font-semibold leading-tight">
                            {lang === "sv" ? "Foto kommer" : "Photo coming"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </FadeUpGroup>
              </section>
            ))}
            <p className="pb-8 text-sm text-muted-foreground">{t.menuNote}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function KgMenuView() {
  const { lang } = useLang();
  const { branch, pathFor } = useBranch();
  const menu = KG_MENU_DATA[lang];

  return (
    <>
      <MenuHeader
        label={lang === "sv" ? `${branch.area} meny` : `${branch.area} menu`}
        title={menu.title}
        subtitle={menu.subtitle}
      />

      <main className="mx-auto max-w-6xl px-5 py-12 lg:px-10 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Scale size={19} aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{menu.priceNote}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "sv"
                  ? "Välj rå fisk eller låt oss tillaga den grillad eller friterad."
                  : "Choose raw fish or let us prepare it grilled or fried."}
              </p>
            </div>
          </div>
          <a
            href={branch.phoneHref}
            className="inline-flex min-h-11 flex-shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-white px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {lang === "sv" ? "Fråga om dagens utbud" : "Ask about today's selection"}
          </a>
        </div>

        <FadeUpGroup className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.04}>
          {menu.items.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/8"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{item.name}</h2>
                  <p lang="ar" dir="rtl" className="mt-1 w-fit text-lg font-semibold text-primary/80">
                    {item.arabic}
                  </p>
                </div>
                <Scale size={19} className="mt-1 flex-shrink-0 text-primary/50" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: menu.rawLabel, price: item.rawPrice },
                  { label: menu.preparedLabel, price: item.preparedPrice },
                ].map((option) => {
                  const orderText = `${item.name} — ${option.label} (${
                    lang === "sv" ? "pris per kg" : "price per kg"
                  })`;
                  return (
                    <SiteLink
                      key={option.label}
                      to={{
                        pathname: pathFor(),
                        search: `?order=${encodeURIComponent(orderText)}`,
                        hash: "#kontakt",
                      }}
                      className="group/price rounded-xl border border-border bg-secondary/55 p-3 transition-colors hover:border-primary hover:bg-primary hover:text-white"
                      aria-label={`${lang === "sv" ? "Beställ" : "Order"} ${item.name}, ${option.label}`}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover/price:text-white/70">
                        {option.label}
                      </span>
                      <strong className="mt-1 block text-base text-primary transition-colors group-hover/price:text-white">
                        {option.price}
                      </strong>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors group-hover/price:text-white">
                        {lang === "sv" ? "Beställ" : "Order"} <ArrowRight size={12} />
                      </span>
                    </SiteLink>
                  );
                })}
              </div>
            </article>
          ))}
        </FadeUpGroup>

        <p className="mt-8 text-sm text-muted-foreground">
          {lang === "sv"
            ? "Tillgången på färsk fisk kan variera. Kontakta personalen om allergier eller särskilda önskemål."
            : "Fresh fish availability may vary. Ask the team about allergies or special requests."}
        </p>
      </main>
    </>
  );
}

export default function MenuPage() {
  const { branch } = useBranch();

  return (
    <div className="min-h-screen pt-16" style={sans}>
      {branch.menuType === "kg" ? <KgMenuView /> : <PortionMenu />}
    </div>
  );
}
