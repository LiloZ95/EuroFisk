import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

export interface SiteLocation {
  pathname: string;
  search: string;
  hash: string;
}

export type SiteDestination =
  | string
  | {
      pathname?: string;
      search?: string;
      hash?: string;
    };

interface SiteRouterValue {
  location: SiteLocation;
  navigate: (to: SiteDestination, options?: { replace?: boolean }) => void;
  hrefFor: (to: SiteDestination) => string;
}

const SiteRouterContext = createContext<SiteRouterValue | null>(null);
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

function readLocation(): SiteLocation {
  const browserPath = window.location.pathname;
  const pathname =
    BASE_PATH && browserPath.startsWith(BASE_PATH)
      ? browserPath.slice(BASE_PATH.length) || "/"
      : browserPath || "/";

  return {
    pathname: pathname.startsWith("/") ? pathname : `/${pathname}`,
    search: window.location.search,
    hash: window.location.hash,
  };
}

function normalizeDestination(to: SiteDestination, current: SiteLocation) {
  if (typeof to === "string") return to;

  const pathname = to.pathname ?? current.pathname;
  const search = to.search
    ? to.search.startsWith("?")
      ? to.search
      : `?${to.search}`
    : "";
  const hash = to.hash
    ? to.hash.startsWith("#")
      ? to.hash
      : `#${to.hash}`
    : "";

  return `${pathname}${search}${hash}`;
}

function browserHref(to: SiteDestination, current: SiteLocation) {
  const destination = normalizeDestination(to, current);
  if (/^(https?:|mailto:|tel:)/.test(destination)) return destination;

  if (destination.startsWith("#")) {
    return `${BASE_PATH}${current.pathname}${current.search}${destination}`;
  }

  const normalized = destination.startsWith("/") ? destination : `/${destination}`;
  return `${BASE_PATH}${normalized}`;
}

export function SiteRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<SiteLocation>(readLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const frame = window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search, location.hash]);

  const value = useMemo<SiteRouterValue>(() => {
    const hrefFor = (to: SiteDestination) => browserHref(to, location);
    const navigate = (to: SiteDestination, options?: { replace?: boolean }) => {
      const method = options?.replace ? "replaceState" : "pushState";
      window.history[method]({}, "", hrefFor(to));
      setLocation(readLocation());
    };
    return { location, navigate, hrefFor };
  }, [location]);

  return <SiteRouterContext.Provider value={value}>{children}</SiteRouterContext.Provider>;
}

export function useSiteLocation() {
  const context = useContext(SiteRouterContext);
  if (!context) throw new Error("useSiteLocation must be used inside SiteRouter");
  return context.location;
}

export function useSiteRouter() {
  const context = useContext(SiteRouterContext);
  if (!context) throw new Error("useSiteRouter must be used inside SiteRouter");
  return context;
}

interface SiteLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: SiteDestination;
}

export function SiteLink({ to, onClick, target, ...props }: SiteLinkProps) {
  const context = useContext(SiteRouterContext);
  if (!context) throw new Error("SiteLink must be used inside SiteRouter");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank"
    ) {
      return;
    }

    event.preventDefault();
    context.navigate(to);
  };

  return <a {...props} href={context.hrefFor(to)} target={target} onClick={handleClick} />;
}
