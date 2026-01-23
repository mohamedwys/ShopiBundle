import { NextApiRequest } from 'next';

export function logAuthDebug(stage: string, req: NextApiRequest) {
  console.log(`\n=== ${stage} DEBUG ===`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('URL:', req.url);
  console.log('Method:', req.method);

  console.log('\nQuery Parameters:');
  Object.entries(req.query).forEach(([key, value]) => {
    console.log(`  ${key}:`, value);
  });

  console.log('\nCookies:');
  if (req.cookies && Object.keys(req.cookies).length > 0) {
    Object.entries(req.cookies).forEach(([key, value]) => {
      if (key.includes('shopify')) {
        console.log(`  ${key}:`, value?.substring(0, 50) + '...');
      } else {
        console.log(`  ${key}:`, value);
      }
    });
  } else {
    console.log('  (no cookies found)');
  }

  console.log('\nRelevant Headers:');
  const relevantHeaders = [
    'host',
    'origin',
    'referer',
    'user-agent',
    'cookie',
    'x-forwarded-host',
    'x-forwarded-proto',
  ];

  relevantHeaders.forEach(header => {
    const value = req.headers[header];
    if (value) {
      if (header === 'cookie') {
        console.log(`  ${header}:`, value.toString().substring(0, 100) + '...');
      } else {
        console.log(`  ${header}:`, value);
      }
    }
  });

  console.log(`=== END ${stage} DEBUG ===\n`);
}

export function validateShopifyRedirect(req: NextApiRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { code, hmac, host, shop, state, timestamp } = req.query;

  if (!shop) {
    errors.push('Missing shop parameter');
  }

  if (!code) {
    errors.push('Missing authorization code');
  }

  if (!hmac) {
    errors.push('Missing HMAC signature');
  }

  if (!host) {
    errors.push('Missing host parameter (may affect embedded app redirect)');
  }

  if (!state) {
    errors.push('Missing state parameter (OAuth CSRF protection)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
