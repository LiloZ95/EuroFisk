import { useState } from "react";
import { Pause, Play, Quote } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useT } from "@/app/lib/branchCopy";
import type { Review } from "@/app/lib/reviews";
import { display, sans } from "@/app/lib/styles";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function MarqueeCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-[17rem] w-[18rem] shrink-0 flex-col rounded-2xl border border-border bg-white p-5 shadow-[0_12px_35px_rgba(13,31,60,0.07)] sm:w-[21rem] sm:p-6">
      <Quote size={20} className="mb-4 shrink-0 text-primary/30" aria-hidden="true" />
      <blockquote
        lang="en"
        dir="ltr"
        className="line-clamp-5 whitespace-pre-line text-sm leading-6 text-foreground/80"
        style={sans}
      >
        {review.text}
        {review.truncated && "…"}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4" dir="ltr">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {initials(review.author)}
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-sm font-semibold text-foreground" style={display}>
            {review.author}
          </span>
          <span className="block truncate text-xs text-muted-foreground" style={sans}>
            {[review.meta, review.when].filter(Boolean).join(" · ")}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** A seamless horizontal review rail. Motion pauses on hover, focus, or button press. */
export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const duration = Math.max(32, reviews.length * 5.5);
  const stopped = paused || interacting;

  return (
    <div
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setInteracting(false);
        }
      }}
    >
      <div
        className={`review-marquee-viewport ${reduce ? "overflow-x-auto" : "overflow-hidden"}`}
        dir="ltr"
      >
        <div
          className={`flex w-max ${reduce ? "gap-5 px-5 lg:px-10" : "review-marquee-track"}`}
          style={
            reduce
              ? undefined
              : {
                  animationDuration: `${duration}s`,
                  animationPlayState: stopped ? "paused" : "running",
                }
          }
        >
          {reduce ? (
            reviews.map((review, index) => (
              <MarqueeCard key={`${review.author}-${index}`} review={review} />
            ))
          ) : (
            <>
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex gap-5 pe-5"
                  aria-hidden={copy === 1 ? "true" : undefined}
                >
                  {reviews.map((review, index) => (
                    <MarqueeCard key={`${copy}-${review.author}-${index}`} review={review} />
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {!reduce && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? t.reviewsResume : t.reviewsPause}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
            style={sans}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            {paused ? t.reviewsResume : t.reviewsPause}
          </button>
        </div>
      )}
    </div>
  );
}
