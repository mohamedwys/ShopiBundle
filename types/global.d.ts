import { Session } from '@shopify/shopify-api';
import { NextApiRequest } from 'next';

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

declare module 'next' {
  interface NextApiRequest {
    user_session?: Session;
    shop?: string;
  }
}

export {};