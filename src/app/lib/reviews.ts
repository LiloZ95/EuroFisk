import type { BranchId } from "./branches";
import type { Lang } from "./LangContext";

export interface Review {
  author: string;
  /** Reviewer badge as Google shows it, e.g. "Local Guide · 118 reviews". */
  meta?: string;
  /** Age exactly as Google displayed it on CAPTURED_ON below — relative, so it drifts. */
  when: string;
  /** The reviewer's own words. Verbatim, typos included — never paraphrase a real person. */
  text: string;
  /** Set when Google served a machine translation instead of the original. */
  originalLang?: Lang;
  /** Google had collapsed the rest behind "More"; the text ends mid-thought. */
  truncated?: boolean;
}

/**
 * Pulled from the Google listing on this date. `when` values are relative to it, so they
 * read older every month — refresh the block when you next update the reviews.
 */
export const CAPTURED_ON = "2026-08-03";

/**
 * CAPTURED_ON written out in the reader's language. Several reviews are only days old,
 * so "6 days ago" would quietly become a lie — showing the pull date next to them keeps
 * the relative ages honest without inventing exact dates Google never gave us.
 */
export function capturedOnLabel(lang: Lang) {
  // Built from parts rather than Date.parse: an ISO date string is read as UTC midnight,
  // which renders as the previous day for anyone west of Greenwich.
  const [year, month, day] = CAPTURED_ON.split("-").map(Number);
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

/**
 * Real, named people. Two rules when editing this file:
 *  - Quote verbatim. Do not fix spelling, soften wording or invent star ratings — the
 *    paste carried no ratings, which is why nothing here renders stars.
 *  - Truncated entries are marked, not completed. Google collapsed the rest, and the
 *    missing half is not ours to write.
 */
export const REVIEWS: Partial<Record<BranchId, Review[]>> = {
  rosengard: [
    {
      author: "Mohamad Al Zawadi",
      meta: "Local Guide · 118 reviews",
      when: "11 months ago",
      text: "Euro Fisk in Malmö is absolutely amazing! Fresh, high-quality seafood every time, with a great variety to choose from. The staff are super friendly, knowledgeable, and always happy to help you pick the best fish for your needs.",
      truncated: true,
    },
    {
      author: "Jörgen Johansson",
      meta: "2 reviews",
      when: "a month ago",
      text: "EuroFisk in Rosengård is truly a gem for anyone who loves fish and seafood. The food is incredibly good, everything feels fresh, well prepared and made with care. The flavors are fantastic and the quality is noticeable in every bite.",
      originalLang: "sv",
      truncated: true,
    },
    {
      author: "Razan",
      meta: "Local Guide · 26 reviews",
      when: "11 months ago",
      text: "Fantastic food! The fish was perfectly fried, the salad was delicious and fresh, and the sauces went incredibly well. Highly recommended! 🌟",
      originalLang: "sv",
      truncated: true,
    },
    {
      author: "Roro Sam",
      meta: "12 reviews",
      when: "a month ago",
      text: "Nice place. Nice service. The owner is one of the best. This was the best fish I've ever tasted😮‍💨",
      originalLang: "sv",
      truncated: true,
    },
    {
      author: "Khaled Rasmy",
      meta: "Local Guide · 143 reviews",
      when: "a year ago",
      text: "Have been ordering from here for several years, and today we tried a large group order, with super good results. Very tasty seafood with super nice service. Highly recommended if you want tasty Mediterranean-ish type seafood",
      originalLang: "sv",
    },
    {
      author: "Kiana Islamian",
      meta: "14 reviews",
      when: "5 years ago",
      text: "Delicious food and super friendly staff! Malmö's best place for fish. Highly recommended, call and order in advance!",
      originalLang: "sv",
    },
    {
      author: "Emelie Mattsson",
      meta: "7 reviews",
      when: "5 years ago",
      // The paste mangled the hearts into "<3>3>3>3>3"; reconstructed as five "<3".
      text: "This place in Rosengård's parking lot doesn't look like much to the world, but WOW WHAT GOOOOOOOOD FOOD THEY HAVE!!!!!! <3<3<3<3<3 Recommended!",
      originalLang: "sv",
    },
    {
      author: "Alessandro B. Najjarine",
      meta: "Local Guide · 14 reviews",
      when: "a year ago",
      text: "Super nice place one of my favorite fishing place in Malmö always fresh fish and good taste. Always ask if you can get and combine a plate with shrimp and some fish fillet as grilled.",
      originalLang: "sv",
    },
    {
      author: "hasn kaware",
      meta: "2 reviews",
      when: "a year ago",
      text: "Thank you so much! Your food is delicious, and your customer service is excellent. Even your prices are reasonable and good. May God grant you success and happiness.",
      originalLang: "ar",
    },
    {
      author: "Aya Amany Elhaj",
      meta: "Local Guide · 294 reviews",
      when: "7 years ago",
      text: "Oooooh, they have really good fish and they do it in a good and tasty way 👍🏻👍🏻👍🏻👍🏻 you should try their fish sometime. Yum",
      originalLang: "sv",
    },
    {
      author: "Saba Yassin",
      meta: "3 reviews",
      when: "a year ago",
      text: "The best grilled shrimp I've ever eaten! Highly recommend.",
      originalLang: "sv",
    },
    {
      author: "Moe Awada",
      meta: "2 reviews",
      when: "a year ago",
      text: "Very good food you have to try and decide, you eat really fresh fish 🐟 🦐 🎣 😋",
      originalLang: "sv",
    },
    {
      author: "Hussein Elghoul",
      meta: "Local Guide · 25 reviews",
      when: "a year ago",
      text: "The best grilled fish, I recommend you try it.",
      originalLang: "sv",
    },
    {
      author: "maxima service",
      meta: "Local Guide · 11 reviews",
      when: "a year ago",
      text: "The food was delicious, fresh and hot, thank you for the fantastic service.",
      originalLang: "sv",
    },
    {
      author: "Rafal Ravn",
      meta: "1 review",
      when: "a year ago",
      text: "Best fish place in all of Skåne",
      originalLang: "sv",
    },
    {
      author: "Rahmah Kareem",
      meta: "Local Guide · 3 reviews",
      when: "a year ago",
      text: "Best in test fantastic fish stall",
      originalLang: "sv",
    },
    {
      author: "Mahmoud Kurdi",
      meta: "1 review",
      when: "7 years ago",
      text: "Fantastic",
    },
    {
      author: "Elena Hamshado",
      meta: "8 reviews",
      when: "a year ago",
      text: "It went great.",
      originalLang: "sv",
    },
    // The pull also returned two non-positive reviews (allen faisal, Redhwan Ghailan).
    // They are left out on purpose — the site shows the positive ones only.
  ],

  // Östra Sorgenfri. The pull also returned eight star-only ratings with no written
  // review at all (Saad K, Fadi Chammout, Adam Omeirat, Mohammad Ibrahim, Ibrahim
  // Kassir, Ahmed Abuhadayed, ibaa barakat, sami abed). There is nothing to quote, so
  // they are not listed here.
  "ostra-sorgenfri": [
    {
      author: "Abdallah El Alti",
      meta: "2 reviews",
      when: "3 days ago",
      text: "Absolutely amazing!\n\nThe fish and seafood are always super fresh and of the highest quality.",
      originalLang: "sv",
      truncated: true,
    },
    {
      author: "Tariq Omar",
      meta: "1 review",
      when: "6 days ago",
      text: "Very good and fresh fish at a very good price too, will be back one hundred percent",
      originalLang: "sv",
    },
    {
      author: "Jihad Asad",
      meta: "5 reviews",
      when: "6 days ago",
      text: "Fresh fish, always available, and the service is very, very good and respectful in Abdous.",
      originalLang: "ar",
    },
    {
      author: "Abed Abdul",
      meta: "1 review",
      when: "5 days ago",
      text: "The fish is amazing and the service is fantastic. The best chef, Abu Ali!",
      originalLang: "ar",
    },
    {
      author: "Raeed Ghazi",
      meta: "4 reviews",
      when: "6 days ago",
      text: "Fresh fish, and the guy was very nice and respectful.",
      originalLang: "ar",
    },
    {
      author: "hasn kaware",
      meta: "2 reviews",
      when: "5 days ago",
      text: "Abdous's service was excellent, and the fish was very fresh and new.",
      originalLang: "ar",
      truncated: true,
    },
    {
      author: "Ghanem Abdullah",
      meta: "1 review",
      when: "6 days ago",
      text: "Fresh fish, sweet Arabian treatment, Abdous",
      originalLang: "ar",
    },
    {
      author: "George Zainoun",
      meta: "4 reviews",
      when: "a month ago",
      text: "It is usually special.",
      originalLang: "sv",
      truncated: true,
    },
  ],
};

export function reviewsFor(branchId: BranchId): Review[] {
  return REVIEWS[branchId] ?? [];
}
