/**
 * RateTracker.in - Production Node.js Server
 * Architecture Component: Backend (Node.js) & Hosting (Vercel / Local)
 * 
 * Supports:
 * 1. Serving React 3D production application (ratetracker-react/dist) with vanilla fallback
 * 2. Mounting Vercel-compatible /api/* serverless endpoints
 * 3. Zero-dependency fallback operation
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables if dotenv is present
try {
  require('dotenv').config();
} catch (e) {
  // Dotenv optional
}

const PORT = process.env.PORT || 3000;
const REACT_DIST_DIR = path.join(__dirname, 'ratetracker-react', 'dist');
const VANILLA_DIR = __dirname;

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
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

// Route handlers for /api
const apiRoutes = {
  '/api/products': require('./api/products'),
  '/api/cuelinks': require('./api/cuelinks'),
  '/api/feeds': require('./api/feeds'),
  '/api/alerts': require('./api/alerts'),
  '/api/health': require('./api/health'),
  '/api/hotels': require('./api/hotels')
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

  // 2. Determine frontend static directory (React build if dist exists, else Vanilla)
  const hasReactBuild = fs.existsSync(REACT_DIST_DIR);
  const activeStaticDir = hasReactBuild ? REACT_DIST_DIR : VANILLA_DIR;

  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(activeStaticDir, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client routing
      const indexPath = path.join(activeStaticDir, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          // If React dist has no index, try vanilla
          const vanillaIndex = path.join(VANILLA_DIR, 'index.html');
          fs.readFile(vanillaIndex, (vErr, vContent) => {
            if (vErr) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              return res.end('404 Not Found');
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(vContent);
          });
          return;
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
  const hasReact = fs.existsSync(REACT_DIST_DIR);
  console.log(`
  ==============================================================
  🚀 RateTracker.in (ratetracker.in) Production Server Running
  ==============================================================
  • Primary UI:        ${hasReact ? 'Modern React 19 + 3D App (ratetracker-react/dist)' : 'Vanilla JS / CSS3 App (Root)'}
  • Node.js Backend:   Active on port ${PORT}
  • Affiliate:         Cuelinks API (Publisher CID: 82192)
  • Endpoints Active:  /api/products, /api/cuelinks, /api/hotels, /api/feeds, /api/alerts, /api/health
  ==============================================================
  🔗 Application URL:  http://localhost:${PORT}
  🔗 Products API:     http://localhost:${PORT}/api/products
  🔗 Hotels API:       http://localhost:${PORT}/api/hotels
  🔗 Cuelinks Status:  http://localhost:${PORT}/api/cuelinks?action=status
  ==============================================================
  `);
});

module.exports = server;
