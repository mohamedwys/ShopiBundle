"use client";

import { ReactNode, useMemo } from "react";
import { useRouter } from "next/router";
import { Provider } from "@shopify/app-bridge-react";

interface AppBridgeProviderProps {
  children: ReactNode;
}

export default function AppBridgeProvider({ children }: AppBridgeProviderProps) {
  const router = useRouter();
  const { host } = router.query;

  const config = useMemo(() => {
    // Only create config when host is available
    if (!host || typeof host !== 'string') {
      return null;
    }

    return {
      apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
      host: host,
      forceRedirect: true,
    };
  }, [host]);

  // Render children even if host isn't ready yet to avoid hydration issues
  // The Provider will handle initialization when config becomes available
  if (!config) {
    return <>{children}</>;
  }

  return (
    <Provider config={config}>
      {children}
    </Provider>
  );
}