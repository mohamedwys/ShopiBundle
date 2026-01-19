import type { AppProps } from "next/app";
import { AppProvider } from "@shopify/polaris";
import AppBridgeProvider from "../components/providers/AppBridgeProvider";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppBridgeProvider>
      <AppProvider i18n={enTranslations}>
        <Component {...pageProps} />
      </AppProvider>
    </AppBridgeProvider>
  );
}