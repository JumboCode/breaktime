import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    // https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements#web-app-manifest
    manifest: { 
      name: 'Breaktime',
      short_name: 'Breaktime',
      description: 'Breaktime',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/favicon.svg',
          size: '192x192',
          type: 'image/png' 
        },
        {
          src: '/favicon.svg',
          size: '512x512',
          type: 'image/png' 
        }
      ],
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})