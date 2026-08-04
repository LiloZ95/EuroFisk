import { lazy, Suspense } from "react";
import { BranchProvider, useBranch } from "./lib/BranchContext";
import { stripBranchFromPath } from "./lib/branches";
import { useT } from "./lib/branchCopy";
import { LangProvider } from "./lib/LangContext";
import { SiteLink, SiteRouter, useSiteLocation } from "./lib/siteRouter";
import Root from "./Root";

const HomePage = lazy(() => import("./pages/HomePage"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));

function NotFoundPage() {
  const { pathFor } = useBranch();
  const t = useT();

  return (
    <main className="min-h-[70vh] pt-32 px-5 text-center">
      <h1 className="text-4xl mb-4">{t.notFoundTitle}</h1>
      <p className="text-muted-foreground mb-8">{t.notFoundSub}</p>
      <SiteLink to={pathFor()} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 text-white font-semibold">
        {t.notFoundCta}
      </SiteLink>
    </main>
  );
}

function SiteRoutes() {
  const { pathname } = useSiteLocation();
  const pagePath = stripBranchFromPath(pathname);

  let page;
  if (pagePath === "/") page = <HomePage />;
  else if (pagePath === "/menu") page = <MenuPage />;
  else if (pagePath === "/reviews") page = <ReviewsPage />;
  else page = <NotFoundPage />;

  return (
    <Root>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-label="Loading page" />}>
        {page}
      </Suspense>
    </Root>
  );
}

export default function App() {
  return (
    <LangProvider>
      <SiteRouter>
        <BranchProvider>
          <SiteRoutes />
        </BranchProvider>
      </SiteRouter>
    </LangProvider>
  );
}
