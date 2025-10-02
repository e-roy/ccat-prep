import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Route = "landing" | "listen" | "settings" | "history";

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>("landing");

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    // Update URL - landing is base URL, others use hash
    if (route === "landing") {
      window.history.pushState({}, "", "/");
    } else {
      window.history.pushState({}, "", `#${route}`);
    }
  };

  // Handle browser back/forward and initial load
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1) as Route;
      if (["listen", "settings", "history"].includes(hash)) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Initialize from URL
    const hash = window.location.hash.slice(1) as Route;
    if (["listen", "settings", "history"].includes(hash)) {
      setCurrentRoute(hash);
    } else {
      setCurrentRoute("landing");
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}
