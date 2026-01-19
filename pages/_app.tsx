import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import Head from "next/head";
import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import { I18nContext, I18nManager, useI18n } from "@shopify/react-i18n";
import en from "@/translations/en.json";
import shopifyTranslations from "@shopify/polaris/locales/en.json";

const Providers = ({ children }) => {
  const [i18n, ShareTranslations] = useI18n({
    id: "app",
    fallback: { ...en, ...shopifyTranslations },
    async translations(locale) {
      const dictionary = await import(`@/translations/${locale}.json`);
      const dictionaryPolaris = await import(
        `@shopify/polaris/locales/${locale}.json`
      );
      return { ...dictionary.default, ...dictionaryPolaris.default };
    },
  });

  return (
    <PolarisProvider i18n={i18n.translations}>
      <ShareTranslations>
        <AppBridgeProvider>{children}</AppBridgeProvider>
      </ShareTranslations>
    </PolarisProvider>
  );
};

export default function App({ Component, pageProps }) {
  const locale = pageProps.locale || "en";
  const i18nManager = new I18nManager({
    locale,
    onError(error) {
      console.error(error);
    },
  });

  return (
    <>
      <Head>
        <script
          src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
          data-api-key={process.env.NEXT_PUBLIC_SHOPIFY_API_KEY}
        />
      </Head>
      <I18nContext.Provider value={i18nManager}>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </I18nContext.Provider>
    </>
  );
}
