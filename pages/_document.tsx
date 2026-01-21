import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Shopify App Bridge - automatically injected by Shopify when embedded */}
        {/* This script tag is a fallback for development/testing */}
        <script
          src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
          defer
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
