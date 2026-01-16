declare global {
  interface Window {
    shopify?: {
      idToken: () => Promise<string>;
      config: {
        apiKey: string;
        host: string;
      };
      environment: {
        embedded: boolean;
        mobile: boolean;
      };
    };
  }
}

export {};