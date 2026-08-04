import { createContext, useContext, useEffect, useState } from "react";
import { readStored, writeStored } from "./storage";

export type Lang = "sv" | "en" | "ar";
export type Dir = "ltr" | "rtl";

/** Order here is the order shown in the language switcher; `sv` is the site default. */
export const LANGS: Array<{ code: Lang; short: string; native: string }> = [
  { code: "sv", short: "SV", native: "Svenska" },
  { code: "en", short: "EN", native: "English" },
  { code: "ar", short: "AR", native: "العربية" },
];

const LANG_CODES = LANGS.map((l) => l.code);

export function dirFor(lang: Lang): Dir {
  return lang === "ar" ? "rtl" : "ltr";
}

/** Locale codes for `og:locale` — Facebook/WhatsApp reject bare language tags. */
const OG_LOCALES: Record<Lang, string> = {
  sv: "sv_SE",
  en: "en_GB",
  ar: "ar_AR",
};

interface LangContextType {
  lang: Lang;
  dir: Dir;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: "sv", dir: "ltr", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = readStored("eurofisk-language");
    return LANG_CODES.includes(saved as Lang) ? (saved as Lang) : "sv";
  });

  const dir = dirFor(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    // Arabic mirrors the whole layout — set it on <html> so logical CSS properties,
    // scroll direction and Radix popovers all follow the reading direction.
    document.documentElement.dir = dir;
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", OG_LOCALES[lang]);
    writeStored("eurofisk-language", lang);
  }, [lang, dir]);

  return <LangContext.Provider value={{ lang, dir, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
