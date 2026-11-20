import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Clock, Phone, ArrowRight, ChevronRight, Navigation, Fish } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ReviewMarquee } from "@/app/components/ReviewMarquee";
import { useBranch } from "@/app/lib/BranchContext";
import { useOrder } from "@/app/lib/OrderContext";
import { OrderButton } from "@/app/components/OrderButton";
import { RESTAURANT_COPY } from "@/app/lib/restaurantCopy";
import { bundledPhotoFor, foodSpreadImg } from "@/app/lib/images";
import { useT } from "@/app/lib/branchCopy";
import { capturedOnLabel, reviewsFor } from "@/app/lib/reviews";
import { useLang } from "@/app/lib/LangContext";
import { BRANCH_IMAGES, imagesFor } from "@/app/lib/branchImages";
import { display, sans } from "@/app/lib/styles";
import { fmt } from "@/app/lib/translations";
import { FadeUp, FadeIn, FadeUpGroup, LineReveal } from "@/app/lib/animations";
import { SiteLink } from "@/app/lib/siteRouter";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePage() {
  const { lang } = useLang();
  const { branch, branchId, pathFor } = useBranch();
  const { openOrder } = useOrder();
  const copy = RESTAURANT_COPY[lang];
  const reviews = reviewsFor(branchId);
  const media = imagesFor(branchId, lang);
  const fallbackMedia = BRANCH_IMAGES[branchId];
  const t = useT();
  const reduce = useReducedMotion();
  const [playHeroVideo, setPlayHeroVideo] = useState(false);

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
            onError={() => setPlayHeroVideo(false)}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1.14 }}
            transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        ) : (
          <ImageWithFallback
            src={media.hero}
            fallbackSrc={fallbackMedia.hero}
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
              <button type="button" onClick={openOrder} className="inline-flex items-center gap-2 bg-white/12 border border-white/30 text-white px-7 py-3.5 rounded font-semibold text-sm hover:bg-white/22 backdrop-blur-sm transition-colors" style={sans}>
                {t.heroBook}
              </button>
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
              [Clock, t.infoHours, branch.hours.summary[lang], undefined],
              [MapPin, t.infoAddr, branch.address, branch.mapsUrl],
              [Phone, t.infoPhone, branch.phoneDisplay, branch.phoneHref],
            ] as [React.ElementType, string, string, string | undefined][]).map(([Icon, label, val, href], i) => (
              <div key={i} className="flex items-center gap-3 text-white md:px-6 first:ps-0">
                <Icon size={17} className="text-sky flex-shrink-0" />
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wider" style={sans}>{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-white text-sm font-medium underline-offset-4 hover:underline">{val}</a>
                  ) : <p className="text-white text-sm font-medium">{val}</p>}
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
        </FadeUp>
        <FadeUpGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10" stagger={0.12}>
          {t.featured.map((d) => (
            <div key={d.name} className="group overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback src={d.img} fallbackSrc={bundledPhotoFor(d.img)} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-1" style={sans}>{d.tag}</p>
                <h3 className="text-foreground text-2xl font-normal mb-1.5" style={display}>{d.name}</h3>
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
          {t.galleryLabel && <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.galleryLabel}</p>}
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
                <ImageWithFallback
                  src={photo.img}
                  fallbackSrc={bundledPhotoFor(photo.img)}
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

      {/* ── ABOUT ── */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <FadeUp>
            <p className="text-sky-soft text-sm font-semibold tracking-widest uppercase mb-4" style={sans}>{t.aboutLabel}</p>
            <h2 className="text-3xl lg:text-5xl font-normal mb-6 leading-tight whitespace-pre-line" style={display}>{t.aboutTitle}</h2>
            <p className="max-w-lg text-lg leading-relaxed text-white/85" style={sans}>{t.aboutP1}</p>
            <button type="button" onClick={openOrder} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 font-bold text-primary hover:bg-sky-tint">
              {copy.orderTitle} <ArrowRight size={18} aria-hidden="true" />
            </button>
          </FadeUp>
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <ImageWithFallback src={media.about} fallbackSrc={fallbackMedia.about} alt="EuroFisk" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>

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
                [MapPin, t.infoAddr, branch.address, branch.mapsUrl],
                [Clock, t.infoHours, branch.hours.rows.map((row) => `${row.days[lang]} ${row.time}`).join("\n"), undefined],
                [Phone, t.infoPhone, branch.phoneDisplay, branch.phoneHref],
              ] as [React.ElementType, string, string, string | undefined][]).map(([Icon, label, val, href], i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold" style={sans}>{label as string}</p>
                    {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-muted-foreground text-sm underline-offset-4 hover:text-primary hover:underline" style={sans}>{val}</a> : <p className="text-muted-foreground text-sm whitespace-pre-line" style={sans}>{val}</p>}
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
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-primary/5">
              <ImageWithFallback src={media.menuPlatter} fallbackSrc={foodSpreadImg} alt="" loading="lazy" className="h-48 w-full object-cover object-[50%_58%]" />
              <div className="p-6 text-center sm:p-8">
                <h2 className="text-3xl text-foreground" style={display}>{copy.orderTitle}</h2>
                <p className="mb-6 mt-3 text-muted-foreground">{copy.orderSub}</p>
                <OrderButton />
                <p className="mt-3 text-xs text-muted-foreground">{copy.orderHint}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
