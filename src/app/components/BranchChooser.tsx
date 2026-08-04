import { ArrowRight, Check, Clock3, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useBranch } from "@/app/lib/BranchContext";
import { BRANCH_IDS, BRANCHES } from "@/app/lib/branches";
import { useT } from "@/app/lib/branchCopy";
import { useLang } from "@/app/lib/LangContext";
import { display, sans } from "@/app/lib/styles";

export function BranchChooser() {
  const {
    branchId,
    chooserOpen,
    hasSelectedBranch,
    selectBranch,
    setChooserOpen,
  } = useBranch();
  const { lang } = useLang();
  const t = useT();

  return (
    <Dialog open={chooserOpen} onOpenChange={setChooserOpen}>
      <DialogContent
        showCloseButton={hasSelectedBranch}
        className="max-w-2xl gap-0 overflow-hidden border-0 p-0"
        onEscapeKeyDown={(event) => {
          if (!hasSelectedBranch) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (!hasSelectedBranch) event.preventDefault();
        }}
      >
        <div className="bg-primary px-6 py-7 text-white sm:px-8">
          <DialogHeader>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C7E5FF]" style={sans}>
              {t.chooserLabel}
            </p>
            <DialogTitle className="text-3xl font-normal leading-tight sm:text-4xl" style={display}>
              {t.chooserTitle}
            </DialogTitle>
            <DialogDescription className="max-w-xl text-sm leading-relaxed text-white/80">
              {t.chooserSub}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-3 bg-background p-4 sm:grid-cols-2 sm:p-6">
          {BRANCH_IDS.map((id) => {
            const option = BRANCHES[id];
            const selected = hasSelectedBranch && id === branchId;

            return (
              <button
                key={id}
                type="button"
                onClick={() => selectBranch(id)}
                className={`group min-h-44 rounded-2xl border p-5 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  selected
                    ? "border-primary bg-primary/7 shadow-sm"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={19} aria-hidden="true" />
                  </div>
                  {selected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Check size={12} aria-hidden="true" />
                      {t.chooserSelected}
                    </span>
                  )}
                </div>
                <h2 className="mb-1 text-xl font-semibold text-foreground" style={sans}>
                  {option.area}
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  {option.address}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock3 size={14} className="text-primary" aria-hidden="true" />
                  {option.hours.summary[lang]}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {t.chooserChoose}
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </button>
            );
          })}
        </div>

        <p className="border-t border-border bg-secondary/50 px-6 py-4 text-center text-xs text-muted-foreground">
          {t.chooserFooter}
        </p>
      </DialogContent>
    </Dialog>
  );
}
