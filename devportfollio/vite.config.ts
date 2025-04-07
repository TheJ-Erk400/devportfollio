import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import fs from 'fs';

// Import the security configuration
// @ts-ignore - We need to use require for CommonJS modules
const securityConfig = require('./security.config.js');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';
  const securitySettings = isProd ? securityConfig.production : securityConfig.development;
  
  // Check if SSL certificates exist
  const hasCertificates = fs.existsSync('./cert/cert.pem') && fs.existsSync('./cert/key.pem');
  
  return {
    base: isProd ? '/CHECKMATE.IO- AI devportfollio' : '/',
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['**/*'],
        manifest: {
          name: 'CheckMate - AI Profile Creator',
          short_name: 'CheckMate',
          description: 'Create professional AI-powered developer profiles',
          theme_color: '#16213e',
          background_color: '#1a1a2e',
          icons: [
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icons/maskable-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdnjs-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ],
          directoryIndex: 'index.html',
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/\/api\//],
          skipWaiting: true,
          clientsClaim: true
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html'
        }
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      https: hasCertificates ? {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
      } : undefined,
      proxy: {
        '/api': {
          target: 'https://api.groq.com/openai/v1/chat/completions',
          changeOrigin: true,
          secure: isProd, // Enforce secure in production
          rewrite: (path) => ''
        }
      },
      headers: securitySettings.headers
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProd, // Only generate sourcemaps in development
      minify: isProd,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue'],
            qrcode: ['qrcode-generator'],
            pdf: ['jspdf', 'html2canvas', 'pdfmake', 'html-to-pdfmake']
          }
        }
      },
      target: 'es2020',
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined
    },
    // Add preview configuration for testing the production build
    preview: {
      port: 4173,
      https: hasCertificates ? {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
      } : undefined,
      headers: securitySettings.headers
    }
  };
}); 