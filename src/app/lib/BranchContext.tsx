import { createContext, useContext, useEffect, type ReactNode } from "react";
import { BRANCHES, branchPath, stripBranchFromPath, type Branch, type BranchId } from "./branches";
import { stripLangFromPath } from "./LangContext";
import { useSiteRouter } from "./siteRouter";
import { writeStored } from "./storage";

interface BranchContextValue {
  branch: Branch;
  branchId: BranchId;
  pathFor: (pagePath?: string) => string;
}

const restaurant: BranchContextValue = {
  branch: BRANCHES.rosengard,
  branchId: "rosengard",
  pathFor: (pagePath = "/") => branchPath("rosengard", pagePath),
};
const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ children }: { children: ReactNode }) {
  const { location, navigate } = useSiteRouter();
  useEffect(() => {
    // Old bookmarks and saved branch choices now lead to the restaurant.
    writeStored("eurofisk-branch", "rosengard");
    const path = stripLangFromPath(location.pathname);
    if (path !== "/ostra-sorgenfri" && !path.startsWith("/ostra-sorgenfri/")) return;
    navigate({
      pathname: branchPath("rosengard", stripBranchFromPath(path)),
      search: location.search,
      hash: location.hash,
    }, { replace: true });
  }, [location.pathname, location.search, location.hash, navigate]);
  return <BranchContext.Provider value={restaurant}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) throw new Error("useBranch must be used inside BranchProvider");
  return context;
}
