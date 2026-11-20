import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

const INTRO_KEY = "eurofisk-order-intro-seen";
function shouldShowIntro() {
  try { return sessionStorage.getItem(INTRO_KEY) !== "true"; } catch { return true; }
}

interface OrderContextValue {
  orderOpen: boolean;
  openOrder: () => void;
  setOrderOpen: (open: boolean) => void;
  restoreOrderFocus: () => void;
}
const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderOpen, setOpen] = useState(shouldShowIntro);
  const trigger = useRef<HTMLElement | null>(null);
  const openOrder = useCallback(() => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);
  const setOrderOpen = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      try { sessionStorage.setItem(INTRO_KEY, "true"); } catch { /* Browsing works without storage. */ }
    }
  }, []);
  const restoreOrderFocus = useCallback(() => {
    // Automatically opened dialogs have no Radix trigger to restore focus to.
    const target = trigger.current?.isConnected && trigger.current.getClientRects().length > 0
      ? trigger.current
      : [...document.querySelectorAll<HTMLElement>("[data-order-trigger]")]
          .find((element) => element.getClientRects().length > 0);
    target?.focus();
  }, []);
  const value = useMemo(() => ({ orderOpen, openOrder, setOrderOpen, restoreOrderFocus }),
    [orderOpen, openOrder, setOrderOpen, restoreOrderFocus]);
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used inside OrderProvider");
  return context;
}
