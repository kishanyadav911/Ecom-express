import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface RouterContextType {
  currentRoute: string;
  navigate: (route: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function Router({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => setCurrentRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    setParams({});
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useNavigate must be used within Router');
  return context.navigate;
}

export function useRoute() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRoute must be used within Router');
  return context.currentRoute;
}

export function useParams() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useParams must be used within Router');
  return context.params;
}
