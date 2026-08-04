import { Quote } from "lucide-react";
import { useT } from "@/app/lib/branchCopy";
import type { Review } from "@/app/lib/reviews";
import { sans } from "@/app/lib/styles";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/** One review, full text, for the list on the Reviews page. */
export function ReviewCard({ review }: { review: Review }) {
  const t = useT();

  return (
    <figure className="mb-5 break-inside-avoid rounded-2xl border border-border bg-card p-6">
      <Quote size={20} className="mb-3 text-primary/30" aria-hidden="true" />
      {/* Google's English rendering — kept left-to-right on the Arabic layout. */}
      <blockquote lang="en" dir="ltr" className="whitespace-pre-line text-sm leading-relaxed text-foreground/85" style={sans}>
        {review.text}
        {review.truncated && "…"}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {initials(review.author)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">
            {review.author}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {[review.meta, review.when].filter(Boolean).join(" · ")}
          </span>
        </span>
      </figcaption>
      {review.originalLang && (
        <p className="mt-3 text-xs italic text-muted-foreground">{t.reviewsTranslated}</p>
      )}
    </figure>
  );
}
