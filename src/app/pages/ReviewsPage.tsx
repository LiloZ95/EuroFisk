import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Star, ExternalLink, Quote } from "lucide-react";
import { useLang } from "@/app/lib/LangContext";
import { T } from "@/app/lib/translations";
import { display, sans } from "@/app/lib/styles";
import { FadeUp, FadeUpGroup } from "@/app/lib/animations";

const REVIEWS = {
  sv: [
    { name: "Ahmed K.", rating: 5, date: "Mars 2024", text: "Fantastisk fisk! Havsabborrn var perfekt grillad — krispigt skinn och saftigt kött. Bästa fisken i Eskilstuna utan tvekan. Kommer tillbaka varje vecka." },
    { name: "Maria L.", rating: 5, date: "April 2024", text: "Guldspariden är en dröm. Servisen var vänlig och maten kom snabbt. Prisvärdet är oslagbart. Rekommenderar starkt till alla!" },
    { name: "Björn A.", rating: 4, date: "Februari 2024", text: "Mix planka för två var enorm och fantastisk. Lite väntetid under rusningstid men absolut värt det. Tar alltid med gäster hit." },
    { name: "Fatima H.", rating: 5, date: "Maj 2024", text: "Hela familjen älskar att äta här. Barnplattan är perfekt för de yngre och familjeplattten är magnifik. Riktigt hemlagad känsla." },
    { name: "Erik S.", rating: 5, date: "Januari 2024", text: "Laxfilén var oslagbar. Serveras med en sallad som är perfekt balanserad med vinägrett. Kryddningen är spot on. 10/10 utan tvekan." },
    { name: "Sara N.", rating: 4, date: "Juni 2024", text: "Räkplankan med king prawns och vitlökssmör är min absoluta favorit. Tar alltid med vänner hit för en avslappnad fredagsmiddag." },
    { name: "David M.", rating: 5, date: "Mars 2024", text: "Har ätit på många fiskrestauranger runt om i Sverige men EuroFisk håller konsekvent en hög kvalitet varje gång. Imponerande!" },
    { name: "Layla B.", rating: 5, date: "April 2024", text: "En vän tog mig hit första gången — nu är jag en stamkund. Personalen är alltid glad och hjälpsam. Maten är alltid färsk och vällagad." },
    { name: "Jonas P.", rating: 5, date: "Maj 2024", text: "Fisksoppan som förrätt följt av grillad havsabborre — en perfekt kombination. Atmosfären är avslappnad och välkomnande." },
  ],
  en: [
    { name: "Ahmed K.", rating: 5, date: "March 2024", text: "Amazing fish! The sea bass was perfectly grilled — crispy skin and juicy flesh. Best fish in Eskilstuna without a doubt. Coming back every week." },
    { name: "Maria L.", rating: 5, date: "April 2024", text: "The gilt-head bream is a dream. Service was friendly and food came quickly. The value for money is unbeatable. Strongly recommend to everyone!" },
    { name: "Björn A.", rating: 4, date: "February 2024", text: "The mix platter for two was enormous and fantastic. A little wait during rush hour but absolutely worth it. Always bring guests here." },
    { name: "Fatima H.", rating: 5, date: "May 2024", text: "The whole family loves eating here. The kids plate is perfect for the younger ones and the family platter is magnificent. Truly home-cooked feeling." },
    { name: "Erik S.", rating: 5, date: "January 2024", text: "The salmon fillet was unbeatable. Served with a perfectly balanced salad. The seasoning is spot on. 10/10 without a doubt." },
    { name: "Sara N.", rating: 4, date: "June 2024", text: "The prawn platter with king prawns and garlic butter is my absolute favourite. Always bring friends here for a relaxed Friday dinner." },
    { name: "David M.", rating: 5, date: "March 2024", text: "I have eaten at many fish restaurants across Sweden but EuroFisk consistently maintains a high quality every single time. Impressive!" },
    { name: "Layla B.", rating: 5, date: "April 2024", text: "A friend took me here the first time — now I am a regular. Staff are always cheerful and helpful. The food is always fresh and well-prepared." },
    { name: "Jonas P.", rating: 5, date: "May 2024", text: "Fish soup as a starter followed by grilled sea bass — a perfect combination. The atmosphere is relaxed and welcoming." },
  ],
};

const RATING_BREAKDOWN = [
  { stars: 5, count: 162, pct: 81 },
  { stars: 4, count: 32, pct: 16 },
  { stars: 3, count: 4, pct: 2 },
  { stars: 2, count: 1, pct: 0.5 },
  { stars: 1, count: 1, pct: 0.5 },
];

function AnimatedBar({ pct, delay }: { pct: number; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: "0%" }}
        animate={inView ? { width: `${pct}%` } : undefined}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  );
}

export default function ReviewsPage() {
  const { lang } = useLang();
  const t = T[lang];
  const reviews = REVIEWS[lang];

  return (
    <div className="pt-16 min-h-screen" style={sans}>
      {/* Header */}
      <div className="bg-primary text-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
          <FadeUp>
            <p className="text-[#5FB3F5] text-sm font-semibold tracking-widest uppercase mb-3" style={sans}>{t.reviewsPageLabel}</p>
            <h1 className="text-5xl lg:text-7xl font-normal mb-3" style={display}>{t.reviewsPageTitle}</h1>
            <p className="text-white/65 max-w-lg" style={sans}>{t.reviewsPageSub}</p>
          </FadeUp>
        </div>
      </div>

      {/* Rating summary */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 py-12">
          <FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-2xl">
              {/* Score */}
              <div className="flex items-center gap-7">
                <div className="text-center">
                  <p className="text-8xl font-normal text-primary leading-none mb-3" style={display}>4.8</p>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-muted-foreground text-sm">{t.reviewsTotal}</p>
                </div>
              </div>
              {/* Bars */}
              <div className="flex flex-col gap-2.5">
                {RATING_BREAKDOWN.map((row, i) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-4 text-right tabular-nums">{row.stars}</span>
                    <Star size={11} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <AnimatedBar pct={row.pct} delay={i * 0.1 + 0.3} />
                    <span className="text-xs text-muted-foreground w-7 text-right tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Review grid */}
      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-14">
        <FadeUpGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.07}>
          {reviews.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/25 hover:shadow-md hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-200">
              <Quote size={22} className="text-primary/25 mb-3 flex-shrink-0" />
              <p className="text-foreground text-sm leading-relaxed flex-1 mb-5">"{r.text}"</p>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-semibold text-foreground text-sm">{r.name}</p>
                  <span className="text-muted-foreground text-xs">{r.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={11} className={j < r.rating ? "fill-yellow-400 text-yellow-400" : "text-border fill-border"} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </FadeUpGroup>
      </div>

      {/* CTA */}
      <FadeUp>
        <div className="bg-primary text-white">
          <div className="max-w-6xl mx-auto px-5 lg:px-10 py-16 text-center">
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <h2 className="text-3xl lg:text-4xl font-normal mb-3" style={display}>{t.reviewsCta}</h2>
            <p className="text-white/65 mb-8 max-w-md mx-auto" style={sans}>{t.reviewsCtaSub}</p>
            <a
              href="https://g.page/r/eurofisk/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-lg hover:bg-white/92 transition-colors text-sm shadow-lg shadow-black/20"
              style={sans}
            >
              Google Reviews <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
