const fs = require('fs');
const path = require('path');
const devcert = require('devcert');

const CERT_DIR = path.join(__dirname, '..', 'cert');

async function generateCertificates() {
  console.log('Generating SSL certificates for local HTTPS development...');
  
  // Check if cert directory exists
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }
  
  try {
    const ssl = await devcert.certificateFor(['localhost'], { 
      getCaPath: true,
      getCaBuffer: true 
    });
    
    fs.writeFileSync(path.join(CERT_DIR, 'cert.pem'), ssl.cert);
    fs.writeFileSync(path.join(CERT_DIR, 'key.pem'), ssl.key);
    
    console.log('SSL certificates generated successfully!');
    console.log(`Certificates saved to: ${CERT_DIR}`);
    console.log('\nYou can now run the app with HTTPS:');
    console.log('  npm run build');
    console.log('  npm run serve:https');
    console.log('\nOr during development:');
    console.log('  npm run dev -- --https');
  } catch (error) {
    console.error('Error generating certificates:', error);
    process.exit(1);
  }
}

generateCertificates(); 