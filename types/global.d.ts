declare global {
  interface Window {
    shopify?: {
      resourcePicker(arg0: { type: string; multiple: boolean; action: string; filter: { variants: boolean; }; }): unknown;
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