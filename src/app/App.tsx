import { lazy, Suspense } from "react";
import { LangProvider } from "./lib/LangContext";
import { SiteLink, SiteRouter, useSiteLocation } from "./lib/siteRouter";
import Root from "./Root";

const HomePage = lazy(() => import("./pages/HomePage"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));

function NotFoundPage() {
  return (
    <main className="min-h-[70vh] pt-32 px-5 text-center">
      <h1 className="text-4xl mb-4">Sidan hittades inte</h1>
      <p className="text-muted-foreground mb-8">The page you requested does not exist.</p>
      <SiteLink to="/" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 text-white font-semibold">
        Till startsidan
      </SiteLink>
    </main>
  );
}

function SiteRoutes() {
  const { pathname } = useSiteLocation();

  let page;
  if (pathname === "/") page = <HomePage />;
  else if (pathname === "/menu") page = <MenuPage />;
  else if (pathname === "/reviews") page = <ReviewsPage />;
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
        <SiteRoutes />
      </SiteRouter>
    </LangProvider>
  );
}
