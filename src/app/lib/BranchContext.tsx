import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BRANCHES,
  branchPath,
  getBranchIdFromPath,
  stripBranchFromPath,
  type Branch,
  type BranchId,
} from "./branches";
import { useSiteRouter } from "./siteRouter";
import { readStored, writeStored } from "./storage";

const STORAGE_KEY = "eurofisk-branch";

interface BranchContextValue {
  branch: Branch;
  branchId: BranchId;
  hasSelectedBranch: boolean;
  chooserOpen: boolean;
  switchNotice: string | null;
  openChooser: () => void;
  setChooserOpen: (open: boolean) => void;
  selectBranch: (branchId: BranchId) => void;
  pathFor: (pagePath?: string) => string;
}

const BranchContext = createContext<BranchContextValue | null>(null);

function savedBranch(): BranchId | null {
  const saved = readStored(STORAGE_KEY);
  return saved === "rosengard" || saved === "ostra-sorgenfri" ? saved : null;
}

export function BranchProvider({ children }: { children: ReactNode }) {
  const { location, navigate } = useSiteRouter();
  const pathBranch = getBranchIdFromPath(location.pathname);
  const storedBranch = savedBranch();
  const [branchId, setBranchId] = useState<BranchId>(
    pathBranch ?? storedBranch ?? "rosengard",
  );
  const [hasSelectedBranch, setHasSelectedBranch] = useState(
    Boolean(pathBranch || storedBranch),
  );
  const [chooserOpen, setChooserOpenState] = useState(
    !pathBranch && !storedBranch,
  );
  const [switchNotice, setSwitchNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!pathBranch) return;
    setBranchId(pathBranch);
    setHasSelectedBranch(true);
    setChooserOpenState(false);
    writeStored(STORAGE_KEY, pathBranch);
  }, [pathBranch]);

  useEffect(() => {
    if (pathBranch || !storedBranch) return;
    navigate(
      {
        pathname: branchPath(storedBranch, stripBranchFromPath(location.pathname)),
        search: location.search,
        hash: location.hash,
      },
      { replace: true },
    );
  }, [location.hash, location.pathname, location.search, navigate, pathBranch, storedBranch]);

  useEffect(() => {
    if (!switchNotice) return;
    const timer = window.setTimeout(() => setSwitchNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [switchNotice]);

  const value = useMemo<BranchContextValue>(() => {
    const selectBranch = (nextBranchId: BranchId) => {
      const changed = hasSelectedBranch && nextBranchId !== branchId;
      const currentPage = stripBranchFromPath(location.pathname);

      setBranchId(nextBranchId);
      setHasSelectedBranch(true);
      setChooserOpenState(false);
      writeStored(STORAGE_KEY, nextBranchId);

      navigate(
        {
          pathname: branchPath(nextBranchId, currentPage),
          search: changed ? "" : location.search,
          hash: location.hash,
        },
        { replace: !hasSelectedBranch },
      );

      if (changed) setSwitchNotice(BRANCHES[nextBranchId].name);
    };

    return {
      branch: BRANCHES[branchId],
      branchId,
      hasSelectedBranch,
      chooserOpen,
      switchNotice,
      openChooser: () => setChooserOpenState(true),
      setChooserOpen: (open) => {
        if (open || hasSelectedBranch) setChooserOpenState(open);
      },
      selectBranch,
      pathFor: (pagePath = "/") => branchPath(branchId, pagePath),
    };
  }, [
    branchId,
    chooserOpen,
    hasSelectedBranch,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    switchNotice,
  ]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) throw new Error("useBranch must be used inside BranchProvider");
  return context;
}
