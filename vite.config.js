import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import adminAuthHandler from './src/components/api/admin-auth.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = env.ADMIN_PASSWORD;

  return {
    plugins: [
      react(),
      {
        name: 'admin-auth-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/admin-auth', async (req, res) => {
            if (req.method === 'POST') {
              let rawBody = '';
              for await (const chunk of req) rawBody += chunk;
              try {
                req.body = JSON.parse(rawBody || '{}');
              } catch {
                req.body = {};
              }
            }
            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (payload) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
            };
            await adminAuthHandler(req, res, env.ADMIN_PASSWORD);
          });
        }
      }
    ]
  };
});
