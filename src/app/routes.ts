import { createBrowserRouter } from "react-router";
import Root from "./Root";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ReviewsPage from "./pages/ReviewsPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: HomePage },
        { path: "menu", Component: MenuPage },
        { path: "reviews", Component: ReviewsPage },
      ],
    },
  ],
  // Matches Vite's base so routes work under the /EuroFisk/ sub-path on GitHub Pages.
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" }
);
