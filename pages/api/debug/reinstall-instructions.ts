import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { shop } = req.query;

  if (!shop || typeof shop !== 'string') {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reinstall Instructions</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #008060; }
          .step { background: #f6f6f7; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .important { background: #fff4e6; border-left: 4px solid #ffa500; padding: 15px; margin: 20px 0; }
          code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
          a { color: #008060; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>🔄 App Reinstall Instructions</h1>
        <p><strong>Usage:</strong> /api/debug/reinstall-instructions?shop=YOUR_SHOP.myshopify.com</p>
      </body>
      </html>
    `);
  }

  const reinstallUrl = `${process.env.SHOPIFY_APP_URL}/api?shop=${shop}`;
  const forceReinstallUrl = `${process.env.SHOPIFY_APP_URL}/api/debug/force-reinstall?shop=${shop}&confirm=yes`;

  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reinstall ShopiBundle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 { color: #008060; }
        h2 { color: #333; margin-top: 30px; }
        .step {
          background: #f6f6f7;
          padding: 20px;
          margin: 15px 0;
          border-radius: 8px;
          border-left: 4px solid #008060;
        }
        .step h3 { margin-top: 0; color: #008060; }
        .important {
          background: #fff4e6;
          border-left: 4px solid #ffa500;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .success {
          background: #e6f7f1;
          border-left: 4px solid #008060;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        code {
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
        }
        .button {
          display: inline-block;
          background: #008060;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 10px 10px 10px 0;
        }
        .button:hover { background: #006e52; }
        .button-secondary {
          background: #5c6ac4;
        }
        .button-secondary:hover {
          background: #4959bd;
        }
        a { color: #008060; }
        .shop-name { color: #008060; font-weight: 600; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
        .error { color: #d82c0d; font-weight: 600; }
      </style>
    </head>
    <body>
      <h1>🔄 Reinstall ShopiBundle App</h1>
      <p>Shop: <span class="shop-name">${shop}</span></p>

      <div class="important">
        <strong>⚠️ Why you need to reinstall:</strong><br>
        Your app's access token has expired or become invalid. This requires a fresh OAuth authorization to generate a new valid token.
      </div>

      <h2>📋 Reinstallation Steps</h2>

      <div class="step">
        <h3>Step 1: Clean Up Old Session (Recommended)</h3>
        <p>First, delete the old invalid session from the database:</p>
        <a href="${forceReinstallUrl}" class="button" target="_blank">
          🗑️ Delete Old Session
        </a>
        <p style="margin-top: 10px;"><small>Opens in new tab. Wait for "success: true" message.</small></p>
      </div>

      <div class="step">
        <h3>Step 2: Uninstall from Shopify Admin</h3>
        <p>Go to your Shopify admin and uninstall the app:</p>
        <ol>
          <li>Open Shopify Admin: <code>https://admin.shopify.com/store/YOUR_STORE/settings/apps</code></li>
          <li>Find "ShopiBundle" in the installed apps list</li>
          <li>Click the app name</li>
          <li>Click <strong>"Uninstall app"</strong></li>
          <li>Confirm the uninstallation</li>
        </ol>
      </div>

      <div class="step">
        <h3>Step 3: Reinstall the App</h3>
        <p>Click the button below to start fresh OAuth flow:</p>
        <a href="${reinstallUrl}" class="button button-secondary">
          🚀 Reinstall App
        </a>
        <p style="margin-top: 15px;"><strong>What will happen:</strong></p>
        <ul>
          <li>You'll be redirected to Shopify authorization page</li>
          <li>Review and approve the app permissions</li>
          <li>A new valid access token will be generated</li>
          <li>You'll be redirected back to the working app</li>
        </ul>
      </div>

      <div class="success">
        <strong>✅ After reinstallation:</strong><br>
        All features should work correctly:
        <ul style="margin: 10px 0 0 0;">
          <li>✅ Full dashboard with bundle management</li>
          <li>✅ Create/edit/delete bundles</li>
          <li>✅ Auto bundle generation</li>
          <li>✅ Analytics and reporting</li>
        </ul>
      </div>

      <h2>🔧 Troubleshooting</h2>

      <div class="step">
        <h3>If OAuth fails with "CookieNotFound" error:</h3>
        <p>This is a known issue with serverless platforms (Vercel). Try these solutions:</p>
        <ol>
          <li><strong>Clear browser cookies</strong> and try again</li>
          <li><strong>Use incognito/private browsing mode</strong></li>
          <li><strong>Try a different browser</strong></li>
          <li><strong>Make sure you're not in the Shopify admin iframe</strong> - the reinstall link should open in a new top-level window</li>
        </ol>
      </div>

      <div class="step">
        <h3>Still having issues?</h3>
        <p>Contact support with this information:</p>
        <ul>
          <li>Shop: <code>${shop}</code></li>
          <li>Error: OAuth CookieNotFound</li>
          <li>Platform: Vercel Serverless</li>
        </ul>
      </div>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #e1e3e5;">

      <p style="color: #6d7175; font-size: 14px;">
        <strong>Direct URLs:</strong><br>
        Force Delete: <code style="font-size: 12px;">${forceReinstallUrl}</code><br>
        Reinstall: <code style="font-size: 12px;">${reinstallUrl}</code>
      </p>
    </body>
    </html>
  `);
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default handler;
