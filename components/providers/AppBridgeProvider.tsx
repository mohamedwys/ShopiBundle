"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
import createApp from "@shopify/app-bridge";

interface AppBridgeProviderProps {
  children: ReactNode;
}

interface AppBridgeContextValue {
  app: ReturnType<typeof createApp> | null;
}

const AppBridgeContext = createContext<AppBridgeContextValue>({ app: null });

export const useAppBridge = () => useContext(AppBridgeContext);

export default function AppBridgeProvider({ children }: AppBridgeProviderProps) {
  const router = useRouter();
  const [app, setApp] = useState<ReturnType<typeof createApp> | null>(null);
  const { host } = router.query;

  useEffect(() => {
    if (!host || typeof host !== 'string') {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    
    if (!apiKey) {
      console.error("NEXT_PUBLIC_SHOPIFY_API_KEY is not defined");
      return;
    }

    try {
      const appBridge = createApp({
        apiKey,
        host,
        forceRedirect: true,
      });

      setApp(appBridge);
    } catch (error) {
      console.error("Error creating App Bridge:", error);
    }

    return () => {
      // Cleanup if needed
      setApp(null);
    };
  }, [host]);

  return (
    <AppBridgeContext.Provider value={{ app }}>
      {children}
    </AppBridgeContext.Provider>
  );
}