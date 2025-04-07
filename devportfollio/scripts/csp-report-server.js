const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Configure log directory
const LOG_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const CSP_LOG_FILE = path.join(LOG_DIR, 'csp-violations.log');

// Middleware to handle JSON requests
app.use(express.json({ 
  type: ['application/json', 'application/csp-report'],
  limit: '50mb'
}));

// Configure CORS for the report endpoint
app.use(cors({
  origin: ['https://localhost:3000', 'https://github.com/TheJ-Erk400/devportfollio'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

// CSP Report endpoint
app.post('/csp-report', (req, res) => {
  const time = new Date().toISOString();
  const report = req.body['csp-report'] || req.body;
  
  // Log to console
  console.log(`[${time}] CSP Violation:`, JSON.stringify(report, null, 2));
  
  // Log to file
  const logEntry = `[${time}] ${JSON.stringify(report)}\n`;
  fs.appendFileSync(CSP_LOG_FILE, logEntry);
  
  // Respond with success
  res.status(204).end();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const PORT = process.env.CSP_REPORT_PORT || 8081;
app.listen(PORT, () => {
  console.log(`CSP Report Server running on port ${PORT}`);
  console.log(`Reports are being logged to: ${CSP_LOG_FILE}`);
  console.log('Press Ctrl+C to stop');
}); 