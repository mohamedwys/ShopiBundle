/**
 * ShopiBundle Widget Build Configuration
 *
 * Uses esbuild to compile the React widget into a single JS file
 * that can be loaded as a Shopify theme extension asset.
 *
 * Output: ../extensions/product-bundle/assets/bundle-widget.js
 *
 * Usage:
 *   node esbuild.config.js          # Production build
 *   node esbuild.config.js --watch  # Watch mode for development
 */

const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [path.resolve(__dirname, 'src/index.tsx')],
  bundle: true,
  outfile: path.resolve(
    __dirname,
    '../extensions/product-bundle/assets/bundle-widget.js'
  ),
  format: 'iife',
  platform: 'browser',
  target: ['es2020', 'chrome80', 'firefox80', 'safari14'],
  minify: !isWatch,
  sourcemap: isWatch ? 'inline' : false,
  // Inject CSS into JS (creates a style tag)
  loader: {
    '.css': 'text',
  },
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  // React is bundled in (not externalized) so the widget is self-contained
  banner: {
    js: '/* ShopiBundle Widget v1.0.0 - https://shopi-bundle.vercel.app */',
  },
  metafile: true,
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      const result = await esbuild.build(buildOptions);
      const outputFile = Object.keys(result.metafile.outputs)[0];
      const outputSize = result.metafile.outputs[outputFile].bytes;
      console.log(
        `Built: ${outputFile} (${(outputSize / 1024).toFixed(1)}kb)`
      );
    }
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
