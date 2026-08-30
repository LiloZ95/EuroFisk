import { createContext, useContext, useEffect, useState } from "react";
import { writeStored } from "./storage";

export type Lang = "sv" | "en" | "ar";
export type Dir = "ltr" | "rtl";

/** Order here is the order shown in the language switcher; `sv` is the site default. */
export const LANGS: Array<{ code: Lang; short: string; native: string }> = [
  { code: "sv", short: "SV", native: "Svenska" },
  { code: "en", short: "EN", native: "English" },
  { code: "ar", short: "AR", native: "العربية" },
];

const LANG_CODES = LANGS.map((l) => l.code);
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Swedish owns the unprefixed URL; translated pages use /en and /ar. */
export function langFromPath(pathname: string): Lang {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return LANG_CODES.includes(firstSegment as Lang) && firstSegment !== "sv"
    ? (firstSegment as Lang)
    : "sv";
}

export function stripLangFromPath(pathname: string): string {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = withLeadingSlash.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "ar") parts.shift();
  return parts.length > 0 ? `/${parts.join("/")}` : "/";
}

export function pathForLang(pathname: string, lang: Lang): string {
  const unprefixed = stripLangFromPath(pathname);
  if (lang === "sv") return unprefixed;
  return unprefixed === "/" ? `/${lang}` : `/${lang}${unprefixed}`;
}

function appPathFromBrowser(pathname: string): string {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }
  return pathname || "/";
}

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
  // The URL is the source of truth. This gives every translation a stable, shareable URL
  // and prevents a crawler (or a shared link) from receiving a language left in storage by
  // an earlier visitor.
  const [lang, setLangState] = useState<Lang>(() =>
    langFromPath(appPathFromBrowser(window.location.pathname)),
  );

  const dir = dirFor(lang);

  const setLang = (nextLang: Lang) => {
    if (nextLang === lang) return;

    const url = new URL(window.location.href);
    const appPath = appPathFromBrowser(url.pathname);
    const localizedPath = pathForLang(appPath, nextLang);
    url.pathname = `${BASE_PATH}${localizedPath}` || "/";

    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setLangState(nextLang);
    // SiteRouter owns its own location state, so let it observe the URL change too.
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const onPopState = () =>
      setLangState(langFromPath(appPathFromBrowser(window.location.pathname)));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
