import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
        selfHandleResponse: true,
        async rewrite(path) {
          return path;
        },
        async handle(req, res) {
          // Extract the API path from the URL
          const apiPath = req.url.replace(/^\/api/, '');
          
          try {
            // Dynamically import the API handler
            const apiFile = path.resolve(`./api${apiPath}.js`);
            
            if (!fs.existsSync(apiFile)) {
              console.error(`API file not found: ${apiFile}`);
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'API endpoint not found' }));
              return true;
            }
            
            // Import the handler
            const handlerModule = await import(apiFile);
            const handler = handlerModule.default;
            
            // Call the handler
            await handler(req, res);
            return true;
          } catch (error) {
            console.error('API handler error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
            return true;
          }
        }
      }
    }
  }
})
