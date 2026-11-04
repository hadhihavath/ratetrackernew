/**
 * RateTracker.in - Production Node.js Server
 * Architecture Component: Backend (Node.js) & Hosting (Vercel / Local)
 * 
 * Supports:
 * 1. Serving static frontend assets (HTML, CSS, JavaScript)
 * 2. Mounting Vercel-compatible /api/* serverless endpoints
 * 3. Graceful handling without external dependencies
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables if dotenv is present
try {
  require('dotenv').config();
} catch (e) {
  // Dotenv optional in zero-dependency mode
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME types dictionary for static frontend
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Route handlers for /api
const apiRoutes = {
  '/api/products': require('./api/products'),
  '/api/cuelinks': require('./api/cuelinks'),
  '/api/feeds': require('./api/feeds'),
  '/api/alerts': require('./api/alerts'),
  '/api/health': require('./api/health')
};

/**
 * Adapter to wrap Node.js standard req/res into Vercel-compatible serverless handler
 */
function handleApiRequest(handler, req, res) {
  let bodyBuffer = '';
  req.on('data', chunk => { bodyBuffer += chunk; });
  req.on('end', () => {
    // Add Vercel helper methods to res
    res.status = function(code) {
      res.statusCode = code;
      return res;
    };
    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
      return res;
    };
    res.redirect = function(statusCode, location) {
      res.writeHead(statusCode, { Location: location });
      res.end();
      return res;
    };

    req.body = bodyBuffer;
    try {
      req.body = JSON.parse(bodyBuffer);
    } catch (e) {
      // Body is not JSON
    }

    try {
      handler(req, res);
    } catch (err) {
      console.error('Server error executing API handler:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. Check for API routes
  for (const [routePath, handler] of Object.entries(apiRoutes)) {
    if (pathname === routePath || pathname.startsWith(routePath + '/')) {
      return handleApiRequest(handler, req, res);
    }
  }

  // 2. Serve static frontend files (HTML, CSS, JavaScript)
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA-style client routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`
  ==============================================================
  🚀 RateTracker.in (ratetracker.in) Production Server Running
  ==============================================================
  • Component: Frontend             -> HTML, CSS, JavaScript
  • Component: Backend              -> Node.js (Active on port ${PORT})
  • Component: Database             -> Supabase / PostgreSQL
  • Component: Affiliate Integr.    -> Cuelinks API (Publisher CID: 82192)
  • Component: Product Information  -> Approved merchant APIs and feeds
  • Component: Hosting              -> Vercel & Node.js Native
  ==============================================================
  🔗 Local URL:    http://localhost:${PORT}
  🔗 API Health:   http://localhost:${PORT}/api/health
  🔗 Products API: http://localhost:${PORT}/api/products
  🔗 Cuelinks API: http://localhost:${PORT}/api/cuelinks?action=status
  ==============================================================
  `);
});

module.exports = server;

