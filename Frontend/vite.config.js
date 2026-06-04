import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.resolve(__dirname, '../AdminPannel');

const adminMimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

function serveAdminPanel() {
  return {
    name: 'campus-admin-panel',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = req.url?.split('?')[0] || '';

        if (!requestUrl.startsWith('/admin')) {
          return next();
        }

        let relativePath = requestUrl.slice('/admin'.length) || '/';
        if (relativePath === '/' || relativePath === '') {
          relativePath = '/index.html';
        }

        const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
        const filePath = path.join(adminRoot, normalizedPath);

        if (!filePath.startsWith(adminRoot) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          if (requestUrl === '/admin' || requestUrl === '/admin/') {
            const indexPath = path.join(adminRoot, 'index.html');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(fs.readFileSync(indexPath));
            return;
          }

          return next();
        }

        const extension = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', adminMimeTypes[extension] || 'application/octet-stream');
        res.end(fs.readFileSync(filePath));
      });
    },
  };
}

export default defineConfig({
  root: __dirname,
  plugins: [serveAdminPanel()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api/': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'login.html'),
        signup: path.resolve(__dirname, 'signup.html'),
        forgot: path.resolve(__dirname, 'forgot.html'),
        complain: path.resolve(__dirname, 'complain.html'),
        feedback: path.resolve(__dirname, 'feedback.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        about: path.resolve(__dirname, 'about.html'),
      },
    },
  },
});
