import { ExternalLink, MessageSquareText, Star } from "lucide-react";
import { useBranch } from "@/app/lib/BranchContext";
import { useLang } from "@/app/lib/LangContext";
import { T } from "@/app/lib/translations";
import { display, sans } from "@/app/lib/styles";
import { FadeUp } from "@/app/lib/animations";

export default function ReviewsPage() {
  const { lang } = useLang();
  const { branch } = useBranch();
  const t = T[lang];

  const feedbackTopics =
    lang === "sv"
      ? ["Maten och färskheten", "Servicen och väntetiden", "Atmosfären och helhetsupplevelsen"]
      : ["The food and freshness", "Service and waiting time", "Atmosphere and overall experience"];

  return (
    <div className="pt-16 min-h-screen" style={sans}>
      <div className="bg-primary text-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
          <FadeUp>
            <p className="text-[#C7E5FF] text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.reviewsPageLabel}</p>
            <h1 className="text-5xl lg:text-7xl font-normal mb-3" style={display}>{t.reviewsPageTitle}</h1>
            <p className="text-white/85 max-w-lg" style={sans}>{t.reviewsPageSub}</p>
          </FadeUp>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <FadeUp className="lg:col-span-3">
            <section className="h-full rounded-2xl border border-border bg-card p-7 sm:p-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-7">
                <Star size={26} aria-hidden="true" />
              </div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
                {lang === "sv" ? "Verifierad källa" : "Verified source"}
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal text-foreground mb-4" style={display}>{t.reviewText}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">{t.reviewsPageSub}</p>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-12 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-7 rounded-lg hover:bg-accent transition-colors text-sm"
              >
                {lang === "sv" ? "Öppna Google Maps" : "Open Google Maps"} <ExternalLink size={15} />
              </a>
            </section>
          </FadeUp>

          <FadeUp className="lg:col-span-2" delay={0.12}>
            <aside className="h-full rounded-2xl bg-primary text-white p-7 sm:p-10">
              <MessageSquareText size={30} className="text-[#C7E5FF] mb-7" aria-hidden="true" />
              <h2 className="text-3xl font-normal mb-3" style={display}>{t.reviewsCta}</h2>
              <p className="text-white/85 leading-relaxed mb-7">{t.reviewsCtaSub}</p>
              <ul className="space-y-3 mb-8">
                {feedbackTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3 text-sm text-white/90">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C7E5FF] flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-12 inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-7 rounded-lg hover:bg-[#EAF4FF] transition-colors text-sm"
              >
                {lang === "sv" ? "Dela din upplevelse" : "Share your experience"} <ExternalLink size={15} />
              </a>
            </aside>
          </FadeUp>
        </div>
      </main>
    </div>
  );
}
