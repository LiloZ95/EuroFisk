import { motion, useReducedMotion } from "motion/react";
import { Truck, MapPin, Home } from "lucide-react";
import { useT } from "@/app/lib/branchCopy";
import { display, sans } from "@/app/lib/styles";
import { FadeUp } from "@/app/lib/animations";

/**
 * Jagged edge that mimics the torn-paper split on the printed banner. Drawn once and
 * reused rotated for the bottom, so both tears come from the same shape. `preserveAspectRatio`
 * is off, so the path stretches to any width instead of tiling.
 */
const TORN_EDGE =
  "M0,14 L24,8 L50,18 L76,9 L104,20 L130,11 L158,21 L184,7 L212,17 L240,10 L268,19 L296,8 " +
  "L326,18 L352,12 L380,22 L408,9 L436,19 L464,11 L492,21 L520,8 L548,17 L576,10 L604,20 " +
  "L632,13 L660,22 L688,9 L716,18 L744,7 L772,19 L800,12 L828,21 L856,10 L884,17 L912,8 " +
  "L940,20 L968,11 L996,21 L1024,9 L1052,18 L1080,13 L1108,22 L1136,10 L1164,19 L1200,12 " +
  "L1200,0 L0,0 Z";

/**
 * Full-bleed promo strip for the free home delivery offer. Sits between two pale sections
 * on the home page, so the solid brand blue plus the torn edges make it impossible to
 * scroll past without noticing.
 *
 * `onSelectDelivery` pre-selects delivery in the order form; the anchor still does the
 * scrolling natively, so the strip keeps working if the handler is ever dropped.
 */
export function DeliveryBanner({ onSelectDelivery }: { onSelectDelivery: () => void }) {
  const t = useT();
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="delivery-heading"
      className="relative isolate overflow-hidden bg-primary text-white"
    >
      {/* Torn edges: filled with the colour of the neighbouring section, so the blue
          reads as torn away from the page rather than as a separate shape. */}
      <svg
        className="absolute inset-x-0 top-0 h-3 w-full sm:h-5"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={TORN_EDGE} fill="var(--background)" />
      </svg>
      <svg
        className="absolute inset-x-0 bottom-0 h-3 w-full rotate-180 sm:h-5"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={TORN_EDGE} fill="var(--card)" />
      </svg>

      {/* Depth behind the headline — a soft light pool plus a darker floor. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(95,179,245,0.38) 0%, rgba(95,179,245,0) 60%), " +
            "linear-gradient(to bottom, transparent 55%, rgba(13,31,60,0.35) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:py-20 lg:px-10 lg:py-24">
        <FadeUp>
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
            style={sans}
          >
            {/* Nudges forward on a loop — just enough motion to catch the eye mid-scroll. */}
            <motion.span
              className="flex"
              animate={reduce ? undefined : { x: [0, 3, 0] }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            >
              <Truck size={15} aria-hidden="true" />
            </motion.span>
            {t.deliveryBadge}
          </span>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h2
            id="delivery-heading"
            className="mt-6 text-balance text-[clamp(2.5rem,7vw+0.5rem,4.75rem)] font-normal leading-[1.02]"
            style={display}
          >
            {t.deliveryTitle}
          </h2>
          <p
            className="mt-3 flex items-center justify-center gap-2 text-lg font-semibold text-sky-soft sm:text-xl"
            style={sans}
          >
            <MapPin size={18} aria-hidden="true" className="flex-shrink-0" />
            {t.deliveryArea}
          </p>
        </FadeUp>

        <FadeUp delay={0.16}>
          <p
            className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-2 gap-y-1 text-balance leading-relaxed text-white/85"
            style={sans}
          >
            {t.deliverySub}
            <Home size={17} aria-hidden="true" className="flex-shrink-0 text-sky" />
          </p>
        </FadeUp>

        <FadeUp delay={0.24}>
          <a
            href="#kontakt"
            onClick={onSelectDelivery}
            className="mt-9 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white px-8 text-sm font-bold text-primary shadow-lg shadow-ink/25 transition-transform duration-200 hover:scale-[1.03] active:scale-100"
            style={sans}
          >
            <Truck size={18} aria-hidden="true" />
            {t.deliveryCta}
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
