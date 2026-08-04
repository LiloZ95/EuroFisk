import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Clock, Phone, ArrowRight, Star, ChevronRight, UtensilsCrossed, ShoppingBag, Navigation, Fish, Flame, Heart, Truck } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { DeliveryBanner } from "@/app/components/DeliveryBanner";
import { ReviewMarquee } from "@/app/components/ReviewMarquee";
import { useBranch } from "@/app/lib/BranchContext";
import { useT } from "@/app/lib/branchCopy";
import { capturedOnLabel, reviewsFor } from "@/app/lib/reviews";
import { useLang } from "@/app/lib/LangContext";
import { imagesFor } from "@/app/lib/branchImages";
import { display, sans } from "@/app/lib/styles";
import { fmt } from "@/app/lib/translations";
import { FadeUp, FadeIn, FadeUpGroup, LineReveal } from "@/app/lib/animations";
import { SiteLink, useSiteLocation } from "@/app/lib/siteRouter";

const ease = [0.22, 1, 0.36, 1] as const;

/** Home delivery is free across Malmö from both branches; otherwise orders are collected
 *  or eaten in. Only delivery asks for an address. */
type Fulfillment = "delivery" | "takeaway" | "dinein";

/** Emoji render differently on every OS and ignore currentColor, so the fact strip keys
 *  into the same lucide set as the rest of the page. */
const FACT_ICONS: Record<string, React.ElementType> = { fish: Fish, flame: Flame, heart: Heart };

/** Error text sits directly under its field, not in a summary at the top of the form. */
function FieldError({ id, message }: { id: string; message: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-destructive" style={sans}>
      {message}
    </p>
  );
}

/** Official WhatsApp glyph — lucide-react ships no brand icons. */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.887 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>
    </svg>
  );
}

export default function HomePage() {
  const { lang, dir } = useLang();
  const { branch, branchId, openChooser, pathFor } = useBranch();
  const reviews = reviewsFor(branchId);
  const media = imagesFor(branchId);
  const t = useT();
  const reduce = useReducedMotion();
  const location = useSiteLocation();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("takeaway");
  const [form, setForm] = useState({ name: "", phone: "", time: "", note: "", order: "", address: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [playHeroVideo, setPlayHeroVideo] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!media.heroVideo) {
      setPlayHeroVideo(false);
      return;
    }
    const query = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const updateVideo = () => setPlayHeroVideo(query.matches);
    updateVideo();
    query.addEventListener("change", updateVideo);
    return () => query.removeEventListener("change", updateVideo);
  }, [media.heroVideo]);

  useEffect(() => {
    const selectedDish = new URLSearchParams(location.search).get("order");
    if (!selectedDish) return;
    setFulfillment("takeaway");
    setForm((current) => ({ ...current, order: current.order || selectedDish }));
  }, [location.search]);

  // Everything that differs between the three modes, in one place — adding a fourth mode
  // means adding one entry here rather than hunting down ternaries.
  const modeCopy = {
    delivery: { intro: t.waMsgIntroDelivery, timeLabel: t.formDeliveryTime, waTimeLabel: t.waLblDelivery },
    takeaway: { intro: t.waMsgIntroTakeaway, timeLabel: t.formPickupTime, waTimeLabel: t.waLblPickup },
    dinein: { intro: t.waMsgIntroDineIn, timeLabel: t.formVisitTime, waTimeLabel: t.waLblVisit },
  }[fulfillment];

  // Build a WhatsApp deep link with the order pre-filled (localised to the current language).
  const buildWaUrl = () => {
    const lines = [
      modeCopy.intro,
      "",
      `📍 ${t.waLblLocation}: ${branch.name}`,
      `🙋 ${t.waLblName}: ${form.name}`,
    ];
    if (fulfillment === "delivery") lines.push(`🏠 ${t.waLblAddress}: ${form.address}`);
    if (form.time) lines.push(`⏰ ${modeCopy.waTimeLabel}: ${form.time}`);
    if (form.order.trim()) lines.push(`🍴 ${t.waLblOrder}: ${form.order}`);
    lines.push(`📞 ${t.waLblPhone}: ${form.phone}`);
    if (form.note.trim()) lines.push(`📝 ${t.waLblNote}: ${form.note}`);
    return `https://wa.me/${branch.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  // Validated here rather than by the browser: native bubbles are unstyled, vanish on the
  // next click, and say "match the requested format" for a bad phone number.
  // Key order matters: submit focuses the first failing field, so it follows the visual order.
  const errors: Record<string, string> = {
    name: form.name.trim() ? "" : t.errRequired,
    phone: !form.phone.trim()
      ? t.errRequired
      : /^[0-9+()\s-]{7,20}$/.test(form.phone.trim())
        ? ""
        : t.errPhone,
    // Only asked for on delivery, so it must not block a takeaway or dine-in order.
    address: fulfillment !== "delivery" || form.address.trim() ? "" : t.errRequired,
    time: !form.time
      ? t.errRequired
      : form.time >= branch.serviceHours.opens && form.time <= branch.serviceHours.closes
        ? ""
        : fmt(t.errTime, branch.serviceHours),
    order: form.order.trim() ? "" : t.errRequired,
  };
  const fieldError = (key: string) => (showErrors ? errors[key] : "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) {
      setShowErrors(true);
      // Send focus to the first thing that needs fixing instead of leaving the visitor
      // to hunt for it.
      const firstBad = Object.keys(errors).find((key) => errors[key]);
      e.currentTarget
        .querySelector<HTMLElement>(`[data-field="${firstBad}"]`)
        ?.focus();
      return;
    }
    const url = buildWaUrl();
    setWaUrl(url);
    setSubmitted(true);
    // Attempt to open WhatsApp within the click gesture; the success screen has a
    // tappable fallback button in case the browser blocks the auto-open.
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-ink pt-16">
        {/* Background video — self-hosted loop, slow cinematic zoom.
            Falls back to the poster image if the video can't play. */}
        {playHeroVideo && media.heroVideo ? (
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.hero as unknown as string}
            className="absolute inset-0 w-full h-full object-cover"
            src={media.heroVideo}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1.14 }}
            transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        ) : (
          <img
            src={media.hero}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Cinematic overlays: directional gradient for headline contrast + bottom vignette for depth.
            The headline sits on the inline-start edge, so the dark end of the gradient follows it in RTL. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/35 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-10 py-12 sm:py-16 md:py-20 w-full flex-1 flex items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-7 backdrop-blur-sm"
              style={sans}
            >
              <Fish size={14} aria-hidden="true" />
              {t.heroBadge} — {branch.area}
            </motion.div>

            <h1 className="text-[clamp(2.75rem,6vw+1rem,5.5rem)] font-normal text-white leading-[1.05] mb-6" style={display}>
              <LineReveal delay={0.25}>{t.heroTitle1}</LineReveal>
              <LineReveal delay={0.4}><em className="not-italic text-sky">{t.heroTitle2}</em></LineReveal>
              <LineReveal delay={0.55}>{t.heroTitle3}</LineReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.75 }}
              className="text-white/75 text-lg leading-relaxed mb-8"
              style={sans}
            >
              {t.heroSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.9 }}
              className="flex flex-wrap gap-3"
            >
              <SiteLink to={pathFor("/menu")} className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded font-semibold text-sm hover:bg-accent transition-colors" style={sans}>
                {t.heroMenu} <ArrowRight size={16} />
              </SiteLink>
              <a href="#kontakt" className="inline-flex items-center gap-2 bg-white/12 border border-white/30 text-white px-7 py-3.5 rounded font-semibold text-sm hover:bg-white/22 backdrop-blur-sm transition-colors" style={sans}>
                {t.heroBook}
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 1.05 }}
          className="relative z-10 md:absolute md:bottom-0 md:left-0 md:right-0 bg-primary/95 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-5 lg:px-10 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:divide-x divide-white/20">
            {([
              [Clock, t.infoHours, branch.hours.summary[lang]],
              [MapPin, t.infoAddr, branch.address],
              [Phone, t.infoPhone, branch.phoneDisplay],
            ] as [React.ElementType, string, string][]).map(([Icon, label, val], i) => (
              <div key={i} className="flex items-center gap-3 text-white md:px-6 first:ps-0">
                <Icon size={17} className="text-sky flex-shrink-0" />
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wider" style={sans}>{label}</p>
                  <p className="text-white text-sm font-medium">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── SIGNATURE DISHES ── */}
      <section className="py-20 lg:py-28 max-w-6xl mx-auto px-5 lg:px-10">
        <FadeUp className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.featuredLabel}</p>
          <h2 className="text-4xl lg:text-5xl font-normal text-foreground mb-4" style={display}>{t.featuredTitle}</h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed" style={sans}>{t.featuredSub}</p>
        </FadeUp>
        <FadeUpGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" stagger={0.12}>
          {t.featured.map((d) => (
            <div key={d.name} className="group overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback src={d.img} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-1" style={sans}>{d.tag}</p>
                <h3 className="text-foreground text-2xl font-normal mb-1.5" style={display}>{d.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={sans}>{d.desc}</p>
              </div>
            </div>
          ))}
        </FadeUpGroup>
        <FadeUp className="text-center">
          <SiteLink to={pathFor("/menu")} className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200" style={sans}>
            {t.viewFullMenu} <ChevronRight size={16} />
          </SiteLink>
        </FadeUp>
      </section>

      {/* ── FREE DELIVERY PROMO ──
          Sits between two pale sections on purpose: the solid blue block is the first
          thing that breaks the page rhythm on the way down. */}
      <DeliveryBanner onSelectDelivery={() => setFulfillment("delivery")} />

      {/* ── GALLERY ──
          Top border dropped: the promo's torn edge already hands over to this section,
          and a straight rule across it would undo the tear. */}
      <section id="galleri" className="py-16 lg:py-24 bg-card border-b border-border overflow-hidden">
        <FadeUp className="max-w-6xl mx-auto px-5 lg:px-10 mb-10 text-center">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.galleryLabel}</p>
          <h2 className="text-4xl lg:text-5xl font-normal text-foreground" style={display}>{t.galleryTitle}</h2>
        </FadeUp>

        {/* Horizontal scroll strip — full bleed, no side padding */}
        <FadeIn delay={0.15}>
          {/* tabIndex + role: the scrollbar is hidden, so without these the rail is
              unreachable by keyboard and invisible to assistive tech. */}
          <div
            className="flex gap-3 overflow-x-auto px-5 pb-2 focus-visible:outline-none lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            tabIndex={0}
            role="group"
            aria-label={t.galleryTitle}
          >
            {t.gallery.map((photo, i) => (
              <div
                key={i}
                className="relative flex-none overflow-hidden rounded-2xl bg-secondary group"
                style={{ width: "300px", height: "380px" }}
              >
                <img
                  src={photo.img}
                  alt={photo.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                {/* Always visible, not hover-gated: on touch the hover state never fires. */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute bottom-4 start-4 end-4">
                  <span className="text-white text-xs font-medium" style={sans}>{photo.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── STAFF / FOUNDER ── */}
      <section className="py-20 lg:py-28 max-w-6xl mx-auto px-5 lg:px-10">
        <FadeUp className="text-center mb-14">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.staffLabel}</p>
          <h2 className="text-4xl lg:text-5xl font-normal text-foreground mb-4" style={display}>{t.staffTitle}</h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed" style={sans}>{t.staffSub}</p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn delay={0.1}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl shadow-primary/15">
                  <ImageWithFallback
                    src={media.hero}
                    alt="EuroFisk founder"
                    loading="lazy"
                    decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              </div>
              {/* Role badge */}
              <div className="absolute bottom-5 inset-x-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4">
                  <p className="text-white font-semibold text-lg" style={display}>EuroFisk</p>
                  <p className="text-white/70 text-sm" style={sans}>{t.staffRole}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-7">
              {/* Quote */}
              <div className="relative ps-6 border-s-4 border-primary">
                <p className="text-2xl lg:text-3xl font-normal text-foreground leading-snug italic" style={display}>
                  "{t.staffQuote}"
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base" style={sans}>{t.staffBio}</p>

              {/* Key facts */}
              <div className="grid grid-cols-3 gap-5 pt-4 border-t border-border">
                {t.facts.map(([iconKey, title, sub]) => {
                  const Icon = FACT_ICONS[iconKey] ?? Fish;
                  return (
                    <div key={title} className="text-center">
                      <Icon size={22} className="mx-auto mb-2 text-primary" aria-hidden="true" />
                      <p className="text-foreground text-sm font-semibold" style={sans}>{title}</p>
                      <p className="text-muted-foreground text-xs" style={sans}>{sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── OUR SPACE ── */}
      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
          <FadeUp className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.placeLabel}</p>
            <h2 className="text-4xl lg:text-5xl font-normal text-foreground mb-4" style={display}>{t.placeTitle}</h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed" style={sans}>{t.placeSub}</p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[420px]">
            {/* Interior — large left */}
            <FadeUp className="lg:col-span-7 h-64 lg:h-full relative overflow-hidden rounded-2xl bg-secondary group" delay={0.1}>
                <ImageWithFallback
                  src={media.interior}
                  alt="EuroFisk dining room interior"
                  loading="lazy"
                  decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 start-5">
                <span className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full" style={sans}>
                  <UtensilsCrossed size={14} aria-hidden="true" /> {t.fulfillDineIn}
                </span>
              </div>
            </FadeUp>

            {/* Right column — exterior + info card */}
            <FadeUp className="lg:col-span-5 lg:h-full flex flex-col gap-4" delay={0.2}>
              <div className="relative overflow-hidden rounded-2xl bg-secondary group flex-1 min-h-0">
                <ImageWithFallback
                  src={media.exterior}
                  alt="EuroFisk exterior"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 start-5">
                  <span className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full" style={sans}>
                    <ShoppingBag size={14} aria-hidden="true" /> {t.fulfillTakeaway}
                  </span>
                </div>
              </div>

              {/* Info card */}
              <div className="bg-primary rounded-2xl p-6 text-white flex-shrink-0">
                <p className="text-sky-soft text-xs font-semibold tracking-widest uppercase mb-2" style={sans}>{t.placeAtmosphere}</p>
                <div className="flex flex-col gap-3 mt-3">
                  {([
                    [Clock, branch.hours.summary[lang]],
                    [MapPin, branch.address],
                    [Phone, branch.phoneDisplay],
                  ] as [React.ElementType, string][]).map(([Icon, val], i) => (
                    <div key={i} className="flex items-center gap-2.5 text-white/75 text-sm">
                      <Icon size={14} className="text-sky flex-shrink-0" />
                      <span style={sans}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <FadeUp>
            <p className="text-sky-soft text-sm font-semibold tracking-widest uppercase mb-4" style={sans}>{t.aboutLabel}</p>
            <h2 className="text-3xl lg:text-5xl font-normal mb-6 leading-tight whitespace-pre-line" style={display}>{t.aboutTitle}</h2>
            <p className="text-white/75 leading-relaxed mb-5" style={sans}>{t.aboutP1}</p>
            <p className="text-white/75 leading-relaxed mb-10" style={sans}>{t.aboutP2}</p>
            <FadeUpGroup className="grid grid-cols-3 gap-5 pt-6 border-t border-white/20" stagger={0.12}>
              {t.aboutStats.map(([n, l]) => (
                <div key={l}>
                  <p className="text-4xl font-normal text-sky-soft mb-1" style={display}>{n}</p>
                  <p className="text-white/80 text-xs uppercase tracking-wide" style={sans}>{l}</p>
                </div>
              ))}
            </FadeUpGroup>
          </FadeUp>
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <ImageWithFallback src={media.exterior} alt="EuroFisk exterior" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: 0.4 }}
                className="absolute -bottom-5 -start-5 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3"
              >
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}</div>
                <div>
                  <p className="text-foreground text-xs font-bold" style={sans}>{t.reviewText}</p>
                  <p className="text-muted-foreground text-xs">{t.reviewSub}</p>
                </div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="overflow-hidden border-y border-border bg-card py-16 lg:py-24">
        <div className="mx-auto mb-10 max-w-6xl px-5 text-center lg:mb-14 lg:px-10">
          <FadeUp className="flex flex-col items-center">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.reviewsPageLabel}</p>
            <h2 className="text-3xl lg:text-4xl font-normal text-foreground mb-3" style={display}>{t.reviewText}</h2>
            <p className="text-muted-foreground mb-6" style={sans}>{t.reviewSub}</p>
            <SiteLink to={pathFor("/reviews")} className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-accent transition-colors" style={sans}>
              {t.navReviews} <ChevronRight size={16} />
            </SiteLink>
            {reviews.length > 0 && (
              <p className="mt-5 text-xs text-muted-foreground" style={sans}>
                {fmt(t.reviewsSourceNote, { date: capturedOnLabel(lang) })}
              </p>
            )}
          </FadeUp>
        </div>

        {reviews.length > 0 && (
          <FadeIn delay={0.15}>
            <ReviewMarquee reviews={reviews} />
          </FadeIn>
        )}
      </section>

      {/* ── CONTACT ── */}
      <section id="kontakt" className="py-20 lg:py-28 max-w-6xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <FadeUp>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4" style={sans}>{t.contactLabel}</p>
            <h2 className="text-3xl lg:text-5xl font-normal text-foreground mb-6" style={display}>{t.contactTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8" style={sans}>{t.contactSub}</p>
            <div className="flex flex-col gap-5 mb-8">
              {([
                [MapPin, t.infoAddr, branch.address],
                [Clock, t.infoHours, branch.hours.rows.map((row) => `${row.days[lang]} ${row.time}`).join("\n")],
                [Phone, t.infoPhone, branch.phoneDisplay],
              ] as [React.ElementType, string, string][]).map(([Icon, label, val], i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold" style={sans}>{label as string}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line" style={sans}>{val as string}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={branch.phoneHref} className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                <Phone size={16} /> {t.callUs}
              </a>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Navigation size={16} /> {t.directions}
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="bg-card border border-border rounded-2xl p-7 lg:p-9 shadow-lg shadow-primary/5">
              <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <MapPin size={16} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t.orderSentTo}
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">{branch.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openChooser}
                  className="min-h-11 flex-shrink-0 px-2 text-xs font-bold text-primary underline decoration-primary/25 underline-offset-4"
                >
                  {t.changeShort}
                </button>
              </div>
              {submitted ? (
                <div className="text-center py-10" role="status" aria-live="polite">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-whatsapp/15 text-whatsapp flex items-center justify-center mx-auto mb-5"
                  >
                    <WhatsAppIcon size={30} />
                  </motion.div>
                  <h3 className="text-2xl font-normal text-foreground mb-2" style={display}>{t.waSuccessTitle}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto" style={sans}>{t.waSuccessSub}</p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-whatsapp text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-whatsapp-hover transition-colors"
                    style={sans}
                  >
                    <WhatsAppIcon size={18} /> {t.waCta}
                  </a>
                  <p className="text-muted-foreground text-xs mt-3" style={sans}>{t.waHelper}</p>
                  <button onClick={() => setSubmitted(false)} className="mt-5 text-sm text-primary font-semibold underline underline-offset-4 hover:text-accent transition-colors" style={sans}>{t.successAgain}</button>
                </div>
              ) : (
                <form
                  className="grid grid-cols-1 gap-4"
                  onSubmit={handleSubmit}
                  aria-describedby="whatsapp-privacy"
                  noValidate
                >
                  {/* Fulfillment selector — delivery, takeaway or dine in (primary choice).
                      Icon sits above the label on phones: three labels side by side don't
                      fit next to their icons at the narrowest width. */}
                  <div
                    className="grid grid-cols-3 gap-1 p-1 bg-secondary rounded-xl"
                    role="group"
                    aria-label={t.fulfillGroupAria}
                  >
                    {([
                      ["delivery", t.fulfillDelivery, Truck],
                      ["takeaway", t.fulfillTakeaway, ShoppingBag],
                      ["dinein", t.fulfillDineIn, UtensilsCrossed],
                    ] as [Fulfillment, string, React.ElementType][]).map(([f, label, Icon]) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFulfillment(f)}
                        aria-pressed={fulfillment === f}
                        className={`relative flex items-center justify-center rounded-lg py-2 text-xs font-semibold transition-colors sm:py-2.5 sm:text-sm ${fulfillment === f ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                        style={sans}
                      >
                        {fulfillment === f && (
                          <motion.span
                            layoutId="fulfill-pill"
                            className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative z-10 flex flex-col items-center gap-1 px-1 text-center leading-tight sm:flex-row sm:gap-2">
                          <Icon size={16} className="flex-shrink-0" /> {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {fulfillment === "delivery" && (
                    <p className="-mb-1 flex items-start gap-2 rounded-lg bg-primary/8 px-3 py-2.5 text-xs font-medium text-primary" style={sans}>
                      <Truck size={15} aria-hidden="true" className="mt-px flex-shrink-0" />
                      {t.deliveryFormNote}
                    </p>
                  )}

                  {/* Name + phone (always required) */}
                    {[
                      { label: t.formName, key: "name", type: "text", ph: t.formNamePh, autoComplete: "name", inputMode: "text" as const },
                      { label: t.formPhone, key: "phone", type: "tel", ph: t.formPhonePh, autoComplete: "tel", inputMode: "tel" as const },
                    ].map((f) => {
                      const error = fieldError(f.key);
                      const hint = f.key === "phone" ? t.formPhoneHint : undefined;
                      const describedBy = [
                        error ? `${f.key}-error` : null,
                        hint ? `${f.key}-hint` : null,
                      ].filter(Boolean).join(" ");

                      return (
                        <div key={f.key}>
                          <label htmlFor={`contact-${f.key}`} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{f.label}</label>
                          <input
                            id={`contact-${f.key}`}
                            name={f.key}
                            data-field={f.key}
                            type={f.type}
                            required
                            placeholder={f.ph}
                            autoComplete={f.autoComplete}
                            inputMode={f.inputMode}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={describedBy || undefined}
                            value={form[f.key as keyof typeof form]}
                            onChange={(e) => set(f.key, e.target.value)}
                            className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors ${
                              error ? "border-destructive" : "border-border"
                            }`}
                            style={sans}
                          />
                          {hint && (
                            <p id={`${f.key}-hint`} className="mt-1.5 text-xs text-muted-foreground" style={sans}>{hint}</p>
                          )}
                          <FieldError id={`${f.key}-error`} message={error} />
                        </div>
                      );
                    })}

                  {/* The address field and the time label are what change between modes — fade
                      the whole block on switch so the extra field doesn't just pop in. */}
                  <motion.div
                    key={fulfillment}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-4"
                  >
                    {fulfillment === "delivery" && (
                      <div>
                        <label htmlFor="order-address" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formAddress}</label>
                        <input id="order-address" name="address" data-field="address" type="text" required
                          placeholder={t.formAddressPh} autoComplete="street-address"
                          aria-invalid={fieldError("address") ? true : undefined}
                          aria-describedby={fieldError("address") ? "address-error" : undefined}
                          value={form.address} onChange={(e) => set("address", e.target.value)}
                          className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors ${
                            fieldError("address") ? "border-destructive" : "border-border"
                          }`} style={sans} />
                        <FieldError id="address-error" message={fieldError("address")} />
                      </div>
                    )}
                    <div>
                      <label htmlFor="order-time" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{modeCopy.timeLabel}</label>
                      {/* min/max bound the picker to the branch's own opening hours, so a
                          03:00 pickup can no longer be submitted. */}
                      <input id="order-time" name="time" data-field="time" type="time" required
                        min={branch.serviceHours.opens} max={branch.serviceHours.closes}
                        aria-invalid={fieldError("time") ? true : undefined}
                        aria-describedby={fieldError("time") ? "time-error" : "time-hint"}
                        value={form.time} onChange={(e) => set("time", e.target.value)}
                        className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors ${
                          fieldError("time") ? "border-destructive" : "border-border"
                        }`} style={sans} />
                      <p id="time-hint" className="mt-1.5 text-xs text-muted-foreground" style={sans}>
                        {branch.hours.summary[lang]}
                      </p>
                      <FieldError id="time-error" message={fieldError("time")} />
                    </div>
                    <div>
                      <label htmlFor="order-details" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formOrder}</label>
                      <textarea id="order-details" name="order" data-field="order" rows={3} required placeholder={t.formOrderPh} value={form.order}
                        onChange={(e) => set("order", e.target.value)}
                        aria-invalid={fieldError("order") ? true : undefined}
                        aria-describedby={fieldError("order") ? "order-error" : undefined}
                        className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-none ${
                          fieldError("order") ? "border-destructive" : "border-border"
                        }`} style={sans} />
                      <FieldError id="order-error" message={fieldError("order")} />
                    </div>
                  </motion.div>
                  <div>
                    <label htmlFor="contact-note" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formNote}</label>
                    <textarea id="contact-note" name="note" rows={3} placeholder={t.formNotePh} value={form.note} onChange={(e) => set("note", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-none" style={sans} />
                  </div>
                  <p id="whatsapp-privacy" className="text-xs leading-relaxed text-muted-foreground" style={sans}>{t.waPrivacy}</p>
                  <button type="submit" className="w-full bg-whatsapp text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-whatsapp-hover transition-colors flex items-center justify-center gap-2 mt-1" style={sans}>
                    {t.formSubmit} <WhatsAppIcon size={17} />
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
