import { useEffect, useRef, useState } from "react";
import { ImageIcon, MapPin, Phone } from "lucide-react";
import { FadeUp, FadeUpGroup } from "@/app/lib/animations";
import { useBranch } from "@/app/lib/BranchContext";
import { useT } from "@/app/lib/branchCopy";
import { kgCategories } from "@/app/lib/kgMenuData";
import { useLang } from "@/app/lib/LangContext";
import { MENU_DATA, type MenuCategory, type MenuItem } from "@/app/lib/menuData";
import { SiteLink, type SiteDestination } from "@/app/lib/siteRouter";
import { display, sans } from "@/app/lib/styles";
import { type Translation } from "@/app/lib/translations";

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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-soft" style={sans}>
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

/** Prefills the order field on the home page's WhatsApp form. */
function orderDestination(pathname: string, orderText: string): SiteDestination {
  return {
    pathname,
    search: `?order=${encodeURIComponent(orderText)}`,
    hash: "#kontakt",
  };
}

function MenuItemCard({
  item,
  priceUnit,
  showPhoto,
  t,
}: {
  item: MenuItem;
  priceUnit?: string;
  /** False when no item in the category has a photo — 14 identical dashed circles
   *  is noise, not a signal. */
  showPhoto: boolean;
  t: Translation;
}) {
  const { pathFor } = useBranch();
  const orderable = item.orderable !== false;

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/8">
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
        {item.desc && (
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
        )}

        {item.options ? (
          // Priced per variant: each variant is its own order link, so the card keeps the
          // same footprint as a single-price one.
          <div className="flex flex-wrap gap-2">
            {item.options.map((option) => {
              const orderText = priceUnit
                ? `${item.name} — ${option.label} (${priceUnit})`
                : `${item.name} — ${option.label}`;

              // basis-24 + flex-1: the variants sit side by side when the card is wide
              // enough and wrap onto their own lines when it is not.
              return (
                <SiteLink
                  key={option.label}
                  to={orderDestination(pathFor(), orderText)}
                  className="group/price flex min-h-11 min-w-0 flex-1 basis-24 flex-col justify-center rounded-xl border border-border bg-secondary/55 px-3 py-2 transition-colors hover:border-primary hover:bg-primary hover:text-white"
                  aria-label={`${t.orderCta} ${item.name}, ${option.label}`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover/price:text-white/70">
                    {option.label}
                  </span>
                  <strong className="mt-0.5 block text-sm text-primary transition-colors group-hover/price:text-white">
                    {option.price}
                  </strong>
                </SiteLink>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-primary">{item.price}</span>
            {orderable && (
              <SiteLink
                to={orderDestination(pathFor(), item.name)}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary/25 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                aria-label={`${t.orderCta} ${item.name}`}
              >
                {t.orderCta}
              </SiteLink>
            )}
          </div>
        )}
      </div>

      {!showPhoto ? null : item.photo ? (
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
          <span className="px-2 text-center text-[10px] font-semibold leading-tight">
            {t.photoComing}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * One layout for both branches. The per-kilo price list is adapted into the same
 * category/item shape (see kgCategories), so the only thing that differs between the two
 * menus is the data and the copy — never the page structure.
 */
function MenuView({ categories, t }: { categories: MenuCategory[]; t: Translation }) {
  const { branch } = useBranch();
  const [activeId, setActiveId] = useState(categories[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  // Categories are rebuilt on every render, so the effects key off the identity of the
  // *set* of categories rather than the array itself.
  const categoryKey = categories.map((category) => category.id).join("|");

  useEffect(() => {
    setActiveId(categoryKey.split("|")[0]);
  }, [categoryKey]);

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
  }, [categoryKey]);

  const scrollTo = (id: string) =>
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  // A single-entry "jump to section" nav is decoration, not navigation.
  const showCategoryNav = categories.length > 1;

  const askLink = (className: string) => (
    <a
      href={branch.phoneHref}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/20 px-4 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white ${className}`}
    >
      <Phone size={14} aria-hidden="true" />
      {t.menuAsk}
    </a>
  );

  return (
    <>
      <MenuHeader label={t.menuPageLabel} title={t.menuPageTitle} subtitle={t.menuPageSub} />

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-10">
        {showCategoryNav && (
        <nav
          aria-label={t.menuCategoriesAria}
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
        )}

        <div className="flex items-start gap-10">
          {showCategoryNav && (
          <aside className="sticky top-24 hidden w-52 flex-shrink-0 flex-col gap-1 lg:flex">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollTo(category.id)}
                aria-current={activeId === category.id ? "true" : undefined}
                className={`min-h-11 rounded-lg px-4 py-2.5 text-start text-sm font-medium transition-all ${
                  activeId === category.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-primary"
                }`}
              >
                {category.label}
              </button>
            ))}
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">{t.menuNote}</p>
              {askLink("w-full")}
            </div>
          </aside>
          )}

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
                    <span className="flex-shrink-0 text-sm text-muted-foreground">
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
                    <MenuItemCard
                      key={item.name}
                      item={item}
                      priceUnit={category.priceUnit}
                      showPhoto={category.items.some((entry) => entry.photo)}
                      t={t}
                    />
                  ))}
                </FadeUpGroup>
              </section>
            ))}

            <div className="flex flex-col items-start gap-4 pb-8">
              <p className="text-sm text-muted-foreground">{t.menuNote}</p>
              {askLink(showCategoryNav ? "lg:hidden" : "")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MenuPage() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const t = useT();
  const categories =
    branch.menuType === "kg" ? kgCategories(lang, t) : MENU_DATA[lang];

  return (
    <div className="min-h-screen pt-16" style={sans}>
      <MenuView categories={categories} t={t} />
    </div>
  );
}
