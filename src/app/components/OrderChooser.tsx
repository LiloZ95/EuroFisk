import { X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/app/components/ui/dialog";
import { OrderButton } from "./OrderButton";
import { useLang } from "@/app/lib/LangContext";
import { useOrder } from "@/app/lib/OrderContext";
import { foodSpreadImg } from "@/app/lib/images";
import { useBranch } from "@/app/lib/BranchContext";
import { imagesFor } from "@/app/lib/branchImages";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { RESTAURANT_COPY } from "@/app/lib/restaurantCopy";
import { display, sans } from "@/app/lib/styles";

export function OrderChooser() {
  const { lang, dir } = useLang();
  const { branchId } = useBranch();
  const orderImage = imagesFor(branchId, lang).menuPlatter;
  const { orderOpen, setOrderOpen, restoreOrderFocus } = useOrder();
  const copy = RESTAURANT_COPY[lang];
  return (
    <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
      <DialogContent dir={dir} showCloseButton={false}
        className="block max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[2rem] border-0 p-0 shadow-2xl sm:max-w-[640px] sm:rounded-[2.5rem]"
        style={sans}
        onCloseAutoFocus={(event) => { event.preventDefault(); restoreOrderFocus(); }}>
        <div className="relative h-[clamp(10rem,32dvh,20rem)] overflow-hidden bg-secondary">
          <ImageWithFallback src={orderImage} fallbackSrc={foodSpreadImg} alt="" className="h-full w-full object-cover object-[50%_58%]" decoding="async" />
          <DialogClose aria-label={copy.close}
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:end-5 sm:top-5 sm:size-12">
            <X size={24} aria-hidden="true" />
          </DialogClose>
        </div>
        <div className="px-5 pb-7 pt-6 text-center sm:px-10 sm:pb-9 sm:pt-8">
          <DialogTitle className="text-[clamp(2.25rem,6vw,3.5rem)] leading-tight text-ink" style={display}>
            {copy.orderTitle}
          </DialogTitle>
          <DialogDescription className="mx-auto mb-7 mt-3 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
            {copy.orderSub}
          </DialogDescription>
          <OrderButton />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.orderHint}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
