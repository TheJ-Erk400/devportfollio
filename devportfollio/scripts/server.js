const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
const cors = require('cors');

// Import security configuration
const securityConfig = require('../security.config.js');
const securitySettings = securityConfig.current;

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Heroku, Nginx, etc.
app.set('trust proxy', 1);

// Convert CSP object to string format for Express server
const cspString = securityConfig.cspObjectToString(securitySettings.csp);

// Apply Helmet middleware for security headers
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: securitySettings.csp
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  expectCt: {
    maxAge: 86400,
    enforce: true
  },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
}));

// Apply CORS configuration
app.use(cors(securitySettings.corsOptions));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '..', 'dist'), {
  setHeaders: (res, path) => {
    // Set cache control for different asset types
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Groq Whisper API proxy route - only allow completions endpoint
app.use('/api/chat', (req, res, next) => {
  console.log('Proxying request to Groq Chat Completions API');
  
  // Forward to Groq API
  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization
    }
  };
  
  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  req.pipe(proxyReq);
  
  proxyReq.on('error', (error) => {
    console.error('Proxy request error:', error);
    res.status(500).json({ error: 'Failed to connect to Groq API' });
  });
});

// SPA fallback - serve index.html for all non-file routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Check for SSL certificates
const CERT_DIR = path.join(__dirname, '..', 'cert');
const hasCertificates = fs.existsSync(path.join(CERT_DIR, 'cert.pem')) && 
                         fs.existsSync(path.join(CERT_DIR, 'key.pem'));

// Start the server
if (hasCertificates) {
  // HTTPS server
  const httpsOptions = {
    key: fs.readFileSync(path.join(CERT_DIR, 'key.pem')),
    cert: fs.readFileSync(path.join(CERT_DIR, 'cert.pem'))
  };
  
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`🔒 HTTPS server running on port ${PORT}`);
    console.log(`Open https://localhost:${PORT} in your browser`);
  });
} else {
  // HTTP server (for development only)
  console.warn('⚠️  WARNING: Running without HTTPS. Generate certificates with npm run generate-cert');
  app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT} (not secure)`);
    console.log(`Open http://localhost:${PORT} in your browser`);
  });
} 