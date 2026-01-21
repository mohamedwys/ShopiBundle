"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import createApp from "@shopify/app-bridge";

interface AppBridgeProviderProps {
  children: ReactNode;
}

interface AppBridgeContextValue {
  app: ReturnType<typeof createApp> | null;
  error: string | null;
  isReady: boolean;
}

const AppBridgeContext = createContext<AppBridgeContextValue>({
  app: null,
  error: null,
  isReady: false
});

export const useAppBridge = () => useContext(AppBridgeContext);

export default function AppBridgeProvider({ children }: AppBridgeProviderProps) {
  const router = useRouter();
  const [app, setApp] = useState<ReturnType<typeof createApp> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { host, shop } = router.query;

  useEffect(() => {
    // Don't try to initialize until router is ready
    if (!router.isReady) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;

    // Check for API key first
    if (!apiKey) {
      const errorMsg = "NEXT_PUBLIC_SHOPIFY_API_KEY is not defined in environment variables";
      console.error(errorMsg);
      setError(errorMsg);
      setIsReady(true);
      return;
    }

    // If no host parameter, we might need to redirect to auth
    if (!host || typeof host !== 'string') {
      console.warn('No host parameter found in URL');

      // If we have a shop parameter but no host, redirect to auth
      if (shop && typeof shop === 'string') {
        console.log('Redirecting to auth to get host parameter...');
        // Give router a moment to settle before redirecting
        const timer = setTimeout(() => {
          window.location.href = `/api?shop=${shop}`;
        }, 500);
        return () => clearTimeout(timer);
      }

      setError('Missing required host parameter. Please install or reinstall the app.');
      setIsReady(true);
      return;
    }

    try {
      console.log('Initializing App Bridge with:', { apiKey: apiKey.substring(0, 8) + '...', host });

      const appBridge = createApp({
        apiKey,
        host,
        forceRedirect: true,
      });

      setApp(appBridge);
      setError(null);
      setIsReady(true);
      console.log('✓ App Bridge initialized successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error creating App Bridge';
      console.error("Error creating App Bridge:", err);
      setError(errorMsg);
      setIsReady(true);
    }

    return () => {
      // Cleanup if needed
      setApp(null);
      setError(null);
      setIsReady(false);
    };
  }, [host, shop, router.isReady]);

  return (
    <AppBridgeContext.Provider value={{ app, error, isReady }}>
      {children}
    </AppBridgeContext.Provider>
  );
}