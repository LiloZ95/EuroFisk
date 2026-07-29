import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Clock, Phone, ArrowRight, Star, ChevronRight, Bike, ShoppingBag, Navigation } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useBranch } from "@/app/lib/BranchContext";
import { useLang } from "@/app/lib/LangContext";
import { T } from "@/app/lib/translations";
import { heroImg, exteriorImg, interiorImg } from "@/app/lib/images";
import { display, sans } from "@/app/lib/styles";
import { FadeUp, FadeIn, FadeUpGroup, LineReveal } from "@/app/lib/animations";
// Self-hosted hero loop (Mixkit free license). Swap this file for EuroFisk's
// own cooking footage anytime — keep it a compressed 720p MP4 for fast load.
import heroVideo from "@/imports/hero-grill-salmon.mp4";
import { SiteLink, useSiteLocation } from "@/app/lib/siteRouter";

const ease = [0.22, 1, 0.36, 1] as const;

/** Official WhatsApp glyph — lucide-react ships no brand icons. */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.887 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>
    </svg>
  );
}

export default function HomePage() {
  const { lang } = useLang();
  const { branch, openChooser, pathFor } = useBranch();
  const t = T[lang];
  const reduce = useReducedMotion();
  const location = useSiteLocation();
  const [fulfillment, setFulfillment] = useState<"delivery" | "takeaway">("delivery");
  const [form, setForm] = useState({ name: "", phone: "", time: "", note: "", address: "", order: "" });
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [playHeroVideo, setPlayHeroVideo] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const updateVideo = () => setPlayHeroVideo(media.matches);
    updateVideo();
    media.addEventListener("change", updateVideo);
    return () => media.removeEventListener("change", updateVideo);
  }, []);

  useEffect(() => {
    const selectedDish = new URLSearchParams(location.search).get("order");
    if (!selectedDish) return;
    setFulfillment("takeaway");
    setForm((current) => ({ ...current, order: current.order || selectedDish }));
  }, [location.search]);

  // Build a WhatsApp deep link with the order pre-filled (localised to the current language).
  const buildWaUrl = () => {
    const isDelivery = fulfillment === "delivery";
    const lines = [
      isDelivery ? t.waMsgIntroDelivery : t.waMsgIntroTakeaway,
      "",
      `📍 ${lang === "sv" ? "Plats" : "Location"}: ${branch.name}`,
      `🙋 ${t.waLblName}: ${form.name}`,
    ];
    if (isDelivery && form.address.trim()) lines.push(`🏠 ${t.waLblAddress}: ${form.address}`);
    if (form.time) lines.push(`⏰ ${isDelivery ? t.waLblDelivery : t.waLblPickup}: ${form.time}`);
    if (form.order.trim()) lines.push(`🍴 ${t.waLblOrder}: ${form.order}`);
    lines.push(`📞 ${t.waLblPhone}: ${form.phone}`);
    if (form.note.trim()) lines.push(`📝 ${t.waLblNote}: ${form.note}`);
    return `https://wa.me/${branch.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0D1F3C] pt-16">
        {/* Background video — self-hosted loop, slow cinematic zoom.
            Falls back to the poster image if the video can't play. */}
        {playHeroVideo ? (
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroImg as unknown as string}
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideo}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1.14 }}
            transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        ) : (
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Cinematic overlays: directional gradient for headline contrast + bottom vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F3C]/92 via-[#0D1F3C]/65 to-[#0D1F3C]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-10 py-12 sm:py-16 md:py-20 w-full flex-1 flex items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-7 backdrop-blur-sm"
              style={sans}
            >
              {t.heroBadge} — {branch.area}
            </motion.div>

            <h1 className="text-[clamp(2.75rem,6vw+1rem,5.5rem)] font-normal text-white leading-[1.05] mb-6" style={display}>
              <LineReveal delay={0.25}>{t.heroTitle1}</LineReveal>
              <LineReveal delay={0.4}><em className="not-italic text-[#5FB3F5]">{t.heroTitle2}</em></LineReveal>
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
              <div key={i} className="flex items-center gap-3 text-white md:px-6 first:pl-0">
                <Icon size={17} className="text-[#5FB3F5] flex-shrink-0" />
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

      {/* ── GALLERY ── */}
      <section id="galleri" className="py-16 lg:py-24 bg-card border-y border-border overflow-hidden">
        <FadeUp className="max-w-6xl mx-auto px-5 lg:px-10 mb-10 text-center">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.galleryLabel}</p>
          <h2 className="text-4xl lg:text-5xl font-normal text-foreground" style={display}>{t.galleryTitle}</h2>
        </FadeUp>

        {/* Horizontal scroll strip — full bleed, no side padding */}
        <FadeIn delay={0.15}>
          <div
            className="flex gap-3 overflow-x-auto pb-2 px-5 lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full" style={sans}>{photo.alt}</span>
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
                    src={heroImg}
                    alt="EuroFisk founder"
                    loading="lazy"
                    decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/60 via-transparent to-transparent" />
              </div>
              {/* Role badge */}
              <div className="absolute bottom-5 left-5 right-5">
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
              <div className="relative pl-6 border-l-4 border-primary">
                <p className="text-2xl lg:text-3xl font-normal text-foreground leading-snug italic" style={display}>
                  "{t.staffQuote}"
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base" style={sans}>{t.staffBio}</p>

              {/* Key facts */}
              <div className="grid grid-cols-3 gap-5 pt-4 border-t border-border">
                {([
                  ["🐟", lang === "sv" ? "Färsk fisk" : "Fresh fish", lang === "sv" ? "Varje dag" : "Every day"],
                  ["🔥", lang === "sv" ? "Grillat" : "Grilled", lang === "sv" ? "På riktigt" : "The real way"],
                  ["❤️", lang === "sv" ? "Med kärlek" : "With love", lang === "sv" ? "Alltid" : "Always"],
                ] as [string, string, string][]).map(([emoji, title, sub]) => (
                  <div key={title} className="text-center">
                    <p className="text-2xl mb-1">{emoji}</p>
                    <p className="text-foreground text-sm font-semibold" style={sans}>{title}</p>
                    <p className="text-muted-foreground text-xs" style={sans}>{sub}</p>
                  </div>
                ))}
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
                  src={interiorImg}
                  alt="EuroFisk dining room interior"
                  loading="lazy"
                  decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full" style={sans}>
                  🪑 {t.placeCapacity}
                </span>
              </div>
            </FadeUp>

            {/* Right column — exterior + info card */}
            <FadeUp className="lg:col-span-5 lg:h-full flex flex-col gap-4" delay={0.2}>
              <div className="relative overflow-hidden rounded-2xl bg-secondary group flex-1 min-h-0">
                <ImageWithFallback
                  src={exteriorImg}
                  alt="EuroFisk exterior"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full" style={sans}>
                    🌿 {t.placeTerrace}
                  </span>
                </div>
              </div>

              {/* Info card */}
              <div className="bg-primary rounded-2xl p-6 text-white flex-shrink-0">
                <p className="text-[#C7E5FF] text-xs font-semibold tracking-widest uppercase mb-2" style={sans}>{t.placeAtmosphere}</p>
                <div className="flex flex-col gap-3 mt-3">
                  {([
                    [Clock, branch.hours.summary[lang]],
                    [MapPin, branch.address],
                    [Phone, branch.phoneDisplay],
                  ] as [React.ElementType, string][]).map(([Icon, val], i) => (
                    <div key={i} className="flex items-center gap-2.5 text-white/75 text-sm">
                      <Icon size={14} className="text-[#5FB3F5] flex-shrink-0" />
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
            <p className="text-[#C7E5FF] text-sm font-semibold tracking-widest uppercase mb-4" style={sans}>{t.aboutLabel}</p>
            <h2 className="text-3xl lg:text-5xl font-normal mb-6 leading-tight whitespace-pre-line" style={display}>{t.aboutTitle}</h2>
            <p className="text-white/75 leading-relaxed mb-5" style={sans}>{t.aboutP1}</p>
            <p className="text-white/75 leading-relaxed mb-10" style={sans}>{t.aboutP2}</p>
            <FadeUpGroup className="grid grid-cols-3 gap-5 pt-6 border-t border-white/20" stagger={0.12}>
              {t.aboutStats.map(([n, l]) => (
                <div key={l}>
                  <p className="text-4xl font-normal text-[#C7E5FF] mb-1" style={display}>{n}</p>
                  <p className="text-white/80 text-xs uppercase tracking-wide" style={sans}>{l}</p>
                </div>
              ))}
            </FadeUpGroup>
          </FadeUp>
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <ImageWithFallback src={exteriorImg} alt="EuroFisk exterior" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: 0.4 }}
                className="absolute -bottom-5 -left-5 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3"
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

      {/* ── REVIEWS TEASER ── */}
      <FadeUp>
        <section className="py-16 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-5 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />)}</div>
              <h3 className="text-3xl font-normal text-foreground mb-1" style={display}>{t.reviewText}</h3>
              <p className="text-muted-foreground" style={sans}>{t.reviewSub}</p>
            </div>
            <SiteLink to={pathFor("/reviews")} className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-accent transition-colors flex-shrink-0" style={sans}>
              {t.navReviews} <ChevronRight size={16} />
            </SiteLink>
          </div>
        </section>
      </FadeUp>

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
                <Phone size={16} /> {lang === "sv" ? "Ring oss" : "Call us"}
              </a>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Navigation size={16} /> {lang === "sv" ? "Hitta hit" : "Directions"}
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
                      {lang === "sv" ? "Din beställning skickas till" : "Your order will be sent to"}
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">{branch.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openChooser}
                  className="min-h-11 flex-shrink-0 px-2 text-xs font-bold text-primary underline decoration-primary/25 underline-offset-4"
                >
                  {lang === "sv" ? "Byt" : "Change"}
                </button>
              </div>
              {submitted ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto mb-5"
                  >
                    <WhatsAppIcon size={30} />
                  </motion.div>
                  <h3 className="text-2xl font-normal text-foreground mb-2" style={display}>{t.waSuccessTitle}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto" style={sans}>{t.waSuccessSub}</p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-[#1eb959] transition-colors"
                    style={sans}
                  >
                    <WhatsAppIcon size={18} /> {t.waCta}
                  </a>
                  <p className="text-muted-foreground/70 text-xs mt-3" style={sans}>{t.waHelper}</p>
                  <button onClick={() => setSubmitted(false)} className="mt-5 text-sm text-primary font-semibold underline underline-offset-4 hover:text-accent transition-colors" style={sans}>{t.successAgain}</button>
                </div>
              ) : (
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit} aria-describedby="whatsapp-privacy">
                  {/* Fulfillment selector — delivery or takeaway (primary choice) */}
                  <div
                    className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl"
                    role="group"
                    aria-label={lang === "sv" ? "Välj leverans eller avhämtning" : "Choose delivery or takeaway"}
                  >
                    {([
                      ["delivery", t.fulfillDelivery, Bike],
                      ["takeaway", t.fulfillTakeaway, ShoppingBag],
                    ] as ["delivery" | "takeaway", string, React.ElementType][]).map(([f, label, Icon]) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFulfillment(f)}
                        aria-pressed={fulfillment === f}
                        className={`relative flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${fulfillment === f ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                        style={sans}
                      >
                        {fulfillment === f && (
                          <motion.span
                            layoutId="fulfill-pill"
                            className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2"><Icon size={16} /> {label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Name + phone (always required) */}
                    {[
                      { label: t.formName, key: "name", type: "text", ph: t.formNamePh, autoComplete: "name", inputMode: "text" as const },
                      { label: t.formPhone, key: "phone", type: "tel", ph: t.formPhonePh, autoComplete: "tel", inputMode: "tel" as const },
                    ].map((f) => (
                      <div key={f.key}>
                        <label htmlFor={`contact-${f.key}`} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{f.label}</label>
                        <input
                          id={`contact-${f.key}`}
                          name={f.key}
                          type={f.type}
                          required
                          placeholder={f.ph}
                          autoComplete={f.autoComplete}
                          inputMode={f.inputMode}
                          pattern={f.key === "phone" ? "[0-9+()\\s-]{7,20}" : undefined}
                          value={form[f.key as keyof typeof form]}
                          onChange={(e) => set(f.key, e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                          style={sans}
                        />
                      </div>
                    ))}

                  {/* Fulfillment-specific fields — swap with a soft fade */}
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
                        <textarea id="order-address" name="address" autoComplete="street-address" rows={2} required placeholder={t.formAddressPh} value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-none" style={sans} />
                      </div>
                    )}
                    <div>
                      <label htmlFor="order-time" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{fulfillment === "delivery" ? t.formDeliveryTime : t.formPickupTime}</label>
                      <input id="order-time" name="time" type="time" required value={form.time} onChange={(e) => set("time", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors" style={sans} />
                    </div>
                    <div>
                      <label htmlFor="order-details" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formOrder}</label>
                      <textarea id="order-details" name="order" rows={3} required placeholder={t.formOrderPh} value={form.order}
                        onChange={(e) => set("order", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-none" style={sans} />
                    </div>
                  </motion.div>
                  <div>
                    <label htmlFor="contact-note" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formNote}</label>
                    <textarea id="contact-note" name="note" rows={3} placeholder={t.formNotePh} value={form.note} onChange={(e) => set("note", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors resize-none" style={sans} />
                  </div>
                  <p id="whatsapp-privacy" className="text-xs leading-relaxed text-muted-foreground" style={sans}>{t.waPrivacy}</p>
                  <button type="submit" className="w-full bg-[#25D366] text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-[#1eb959] transition-colors flex items-center justify-center gap-2 mt-1" style={sans}>
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
