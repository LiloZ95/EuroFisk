import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { LANGS, useLang } from "@/app/lib/LangContext";
import { sans } from "@/app/lib/styles";
import { T } from "@/app/lib/translations";

/**
 * Three languages no longer fit the old two-way toggle, so this is a small menu.
 * Flags are deliberately not used — Arabic has no single country behind it, and a
 * globe plus the language code reads the same to every visitor.
 *
 * `compact` drops the code on the narrowest phones, where the header also has to fit
 * the branch name and the hamburger.
 *
 * Reads T[lang] directly rather than useT(): the switcher is language chrome, so it has
 * no per-branch wording and does not need to sit inside a BranchProvider.
 */
export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, dir, setLang } = useLang();
  const t = T[lang];
  const current = LANGS.find((option) => option.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger
        aria-label={`${t.langLabel} — ${current.native}`}
        className="flex min-h-11 flex-shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-semibold text-foreground/60 transition-colors hover:border-primary hover:text-primary"
        style={sans}
      >
        <Languages size={15} aria-hidden="true" />
        <span className={compact ? "hidden sm:inline" : undefined}>{current.short}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44 border-border">
        {LANGS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            lang={option.code}
            onSelect={() => setLang(option.code)}
            className="min-h-11 cursor-pointer justify-between gap-4 text-sm font-medium"
            style={sans}
          >
            {option.native}
            {option.code === lang && (
              <Check size={15} className="text-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
