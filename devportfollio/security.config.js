/**
 * Security Configuration
 * 
 * This file contains security settings for different environments.
 * Use these configurations to maintain consistent security rules
 * across the application.
 */

// Base CSP directives for all environments
const baseCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
  'style-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
  'img-src': ["'self'", 'data:'],
  'font-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
  'connect-src': ["'self'", 'https://api.groq.com/openai/v1/chat/completions', 'https://github.com/TheJ-Erk400/devportfollio'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

// Development environment security settings
const development = {
  csp: {
    ...baseCSP,
    'connect-src': [...baseCSP['connect-src'], 'ws:', 'wss:'], // For hot reloading
    'report-uri': ['http://localhost:8081/csp-report']
  },
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  },
  corsOptions: {
    origin: ['https://localhost:3000', 'https://github.com/TheJ-Erk400/devportfollio'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
};

// Production environment security settings
const production = {
  csp: {
    ...baseCSP,
    'report-uri': ['https://github.com/TheJ-Erk400/devportfollio/csp-report'],
    'report-to': ['default']
  },
  headers: {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload', // 2 years
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    'Report-To': JSON.stringify({
      group: 'default',
      max_age: 31536000,
      endpoints: [{ url: 'https://github.com/TheJ-Erk400/devportfollio/csp-report' }]
    })
  },
  corsOptions: {
    origin: ['https://github.com/TheJ-Erk400/devportfollio'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }
};

// Helper function to convert CSP object to string format
function cspObjectToString(cspObject) {
  return Object.entries(cspObject)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

module.exports = {
  development,
  production,
  cspObjectToString,
  current: process.env.NODE_ENV === 'production' ? production : development
}; 