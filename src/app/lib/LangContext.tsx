import { createContext, useContext, useEffect, useState } from "react";
import { readStored, writeStored } from "./storage";

export type Lang = "sv" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: "sv", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = readStored("eurofisk-language");
    return saved === "en" || saved === "sv" ? saved : "sv";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    writeStored("eurofisk-language", lang);
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
