import path from 'path';
import { defineConfig } from 'vite';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;
if (!rawPort) throw new Error('PORT environment variable is required but was not provided.');
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({ root: path.resolve(import.meta.dirname, '..') }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) => m.devBanner()),
        ]
      : []),
  ],
  root: path.resolve(import.meta.dirname),
  publicDir: path.resolve(import.meta.dirname, 'assets'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        'gi-hollow-pipe': path.resolve(import.meta.dirname, 'pages/products/gi-hollow-pipe.html'),
        nexframe: path.resolve(import.meta.dirname, 'pages/products/nexframe.html'),
        glass: path.resolve(import.meta.dirname, 'pages/products/glass.html'),
        'h-beam': path.resolve(import.meta.dirname, 'pages/products/h-beam.html'),
        contact: path.resolve(import.meta.dirname, 'pages/contact.html'),
        '404': path.resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: { strict: false },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
