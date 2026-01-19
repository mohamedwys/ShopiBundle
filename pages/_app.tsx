// pages/_app.tsx
import type { AppProps } from "next/app";
import { AppProvider } from "@shopify/polaris";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={enTranslations}>
      <AppBridgeProvider>
        <Component {...pageProps} />
      </AppBridgeProvider>
    </AppProvider>
  );
}