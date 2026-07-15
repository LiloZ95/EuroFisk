import { useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Clock, Phone, ArrowRight, Star, ChevronRight, Instagram, Facebook } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useLang } from "@/app/lib/LangContext";
import { T } from "@/app/lib/translations";
import { heroImg, exteriorImg, interiorImg } from "@/app/lib/images";
import { display, sans } from "@/app/lib/styles";
import { FadeUp, FadeIn, FadeUpGroup, LineReveal } from "@/app/lib/animations";
// Self-hosted hero loop (Mixkit free license). Swap this file for EuroFisk's
// own cooking footage anytime — keep it a compressed 720p MP4 for fast load.
import heroVideo from "@/imports/hero-grill-salmon.mp4";

const ease = [0.22, 1, 0.36, 1] as const;

const GALLERY_PHOTOS = [
  { url: "https://images.unsplash.com/photo-1556814901-18c866c057da?w=600&q=80", alt: "Fish on the grill" },
  { url: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80", alt: "Shrimp platter" },
  { url: "https://images.unsplash.com/photo-1625489539789-39bb40ed9a8a?w=600&q=80", alt: "Chef preparing fish" },
  { url: "https://images.unsplash.com/photo-1584300005420-38486f627b07?w=600&q=80", alt: "Fish dish" },
  { url: "https://images.unsplash.com/photo-1559742811-822873691df8?w=600&q=80", alt: "Grilled shrimp with lime" },
  { url: "https://images.unsplash.com/photo-1717465962264-517140fe69b1?w=600&q=80", alt: "Fish from the oven" },
  { url: "https://images.unsplash.com/photo-1761095596599-dd7b3bee6287?w=600&q=80", alt: "Fish skewers on grill" },
  { url: "https://images.unsplash.com/photo-1666437469803-c6d5ba853a50?w=600&q=80", alt: "Seafood plate" },
];

export default function HomePage() {
  const { lang } = useLang();
  const t = T[lang];
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0D1F3C] pt-16">
        {/* Background video — self-hosted loop, slow cinematic zoom.
            Falls back to the poster image if the video can't play. */}
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroImg as unknown as string}
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          initial={{ scale: 1.04 }}
          animate={reduce ? { scale: 1.04 } : { scale: 1.14 }}
          transition={reduce ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        {/* Cinematic overlays: directional gradient for headline contrast + bottom vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1F3C]/92 via-[#0D1F3C]/65 to-[#0D1F3C]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-10 py-20 w-full">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-7 backdrop-blur-sm"
              style={sans}
            >
              {t.heroBadge}
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
              <Link to="/menu" className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded font-semibold text-sm hover:bg-accent transition-colors" style={sans}>
                {t.heroMenu} <ArrowRight size={16} />
              </Link>
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
          className="absolute bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-5 lg:px-10 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:divide-x divide-white/20">
            {([
              [Clock, t.infoHours, t.infoHoursVal],
              [MapPin, t.infoAddr, t.infoAddrVal],
              [Phone, t.infoPhone, "0730 56 68 13"],
            ] as [React.ElementType, string, string][]).map(([Icon, label, val], i) => (
              <div key={i} className="flex items-center gap-3 text-white md:px-6 first:pl-0">
                <Icon size={17} className="text-[#5FB3F5] flex-shrink-0" />
                <div>
                  <p className="text-white/55 text-xs uppercase tracking-wider" style={sans}>{label}</p>
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
                <ImageWithFallback src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
          <Link to="/menu" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200" style={sans}>
            {t.viewFullMenu} <ChevronRight size={16} />
          </Link>
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
            {GALLERY_PHOTOS.map((photo, i) => (
              <div
                key={i}
                className="relative flex-none overflow-hidden rounded-2xl bg-secondary group"
                style={{ width: "300px", height: "380px" }}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
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
                <p className="text-[#5FB3F5] text-xs font-semibold tracking-widest uppercase mb-2" style={sans}>{t.placeAtmosphere}</p>
                <div className="flex flex-col gap-3 mt-3">
                  {([
                    [Clock, t.infoHoursVal],
                    [MapPin, t.infoAddrVal],
                    [Phone, "0730 56 68 13"],
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
            <p className="text-[#5FB3F5] text-sm font-semibold tracking-widest uppercase mb-4" style={sans}>{t.aboutLabel}</p>
            <h2 className="text-3xl lg:text-5xl font-normal mb-6 leading-tight whitespace-pre-line" style={display}>{t.aboutTitle}</h2>
            <p className="text-white/75 leading-relaxed mb-5" style={sans}>{t.aboutP1}</p>
            <p className="text-white/75 leading-relaxed mb-10" style={sans}>{t.aboutP2}</p>
            <FadeUpGroup className="grid grid-cols-3 gap-5 pt-6 border-t border-white/20" stagger={0.12}>
              {t.aboutStats.map(([n, l]) => (
                <div key={l}>
                  <p className="text-4xl font-normal text-[#5FB3F5] mb-1" style={display}>{n}</p>
                  <p className="text-white/55 text-xs uppercase tracking-wide" style={sans}>{l}</p>
                </div>
              ))}
            </FadeUpGroup>
          </FadeUp>
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <ImageWithFallback src={exteriorImg} alt="EuroFisk exterior" className="w-full h-full object-cover" />
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
            <Link to="/reviews" className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-accent transition-colors flex-shrink-0" style={sans}>
              {t.navReviews} <ChevronRight size={16} />
            </Link>
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
              {t.contactInfo.map(([Icon, label, val], i) => (
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
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" aria-label="Facebook"><Facebook size={16} /></a>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="bg-card border border-border rounded-2xl p-7 lg:p-9 shadow-lg shadow-primary/5">
              {submitted ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5"
                  >
                    <span className="text-3xl text-primary">✓</span>
                  </motion.div>
                  <h3 className="text-2xl font-normal text-foreground mb-2" style={display}>{t.successTitle}</h3>
                  <p className="text-muted-foreground text-sm" style={sans}>{t.successSub}</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-primary font-semibold underline underline-offset-4 hover:text-accent transition-colors" style={sans}>{t.successAgain}</button>
                </div>
              ) : (
                <form className="grid grid-cols-1 gap-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <h3 className="text-xl font-normal text-foreground" style={display}>{t.formTitle}</h3>
                  {[
                    { label: t.formName, key: "name", type: "text", ph: t.formNamePh },
                    { label: t.formPhone, key: "phone", type: "tel", ph: t.formPhonePh },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{f.label}</label>
                      <input type={f.type} required placeholder={f.ph} value={form[f.key as keyof typeof form]}
                        onChange={(e) => set(f.key, e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 transition-colors" style={sans} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: t.formDate, key: "date", type: "date" }, { label: t.formTime, key: "time", type: "time" }].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{f.label}</label>
                        <input type={f.type} required value={form[f.key as keyof typeof form]}
                          onChange={(e) => set(f.key, e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" style={sans} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formGuests}</label>
                    <select value={form.guests} onChange={(e) => set("guests", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" style={sans}>
                      {["1","2","3","4","5","6","7","8","9","10+"].map((n) => (
                        <option key={n} value={n}>{n} {n === "1" ? t.guestSingular : t.guestPlural}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" style={sans}>{t.formNote}</label>
                    <textarea rows={3} placeholder={t.formNotePh} value={form.note} onChange={(e) => set("note", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-primary/50 transition-colors resize-none" style={sans} />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-1" style={sans}>
                    {t.formSubmit} <ArrowRight size={16} />
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
