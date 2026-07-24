import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'vite';

// Cross-platform __dirname replacement (works on Node 20+ and any platform)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// PORT is optional: defaults to 5173 for npm run dev, respects env var when set (e.g. Replit, Render)
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  // BASE_PATH lets deployment platforms serve from a sub-path; defaults to root
  base: process.env.BASE_PATH ?? '/',

  root: __dirname,

  // assets/ is the static public directory (images, icons, etc.)
  publicDir: path.join(__dirname, 'assets'),

  build: {
    // Output to dist/ — consumed by Vercel, Netlify, Render, Firebase Hosting
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      // Multi-page application: each HTML file is an independent entry point
      input: {
        main:           path.join(__dirname, 'index.html'),
        'gi-hollow-pipe': path.join(__dirname, 'pages/products/gi-hollow-pipe.html'),
        nexframe:       path.join(__dirname, 'pages/products/nexframe.html'),
        glass:          path.join(__dirname, 'pages/products/glass.html'),
        'h-beam':       path.join(__dirname, 'pages/products/h-beam.html'),
        contact:        path.join(__dirname, 'pages/contact.html'),
        '404':          path.join(__dirname, '404.html'),
      },
    },
  },

  server: {
    port,
    // Don't throw if port is taken on a dev machine
    strictPort: false,
    host: '0.0.0.0',
    // 'all' allows any host (required for Replit proxying and container environments)
    allowedHosts: 'all',
    fs: { strict: false },
  },

  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
});
