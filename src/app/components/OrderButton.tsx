import { useLang } from "@/app/lib/LangContext";
import { useOrder } from "@/app/lib/OrderContext";
import { ORDER_URL } from "@/app/lib/ordering";
import { RESTAURANT_COPY } from "@/app/lib/restaurantCopy";

export function OrderButton() {
  const { lang } = useLang();
  const { setOrderOpen } = useOrder();
  return (
    <a href={ORDER_URL} onClick={() => setOrderOpen(false)}
      className="flex min-h-14 w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-lg font-extrabold text-white transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:min-h-16 sm:text-xl">
      {RESTAURANT_COPY[lang].orderTitle}
    </a>
  );
}
