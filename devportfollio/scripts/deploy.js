const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CERT_DIR = path.join(__dirname, '..', 'cert');
const DIST_DIR = path.join(__dirname, '..', 'dist');

/**
 * Pre-deployment checks and build
 */
function prepareForDeployment() {
  console.log('🚀 Starting deployment preparation...');
  
  // Check if we're in production mode
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Warning: Not running in production mode!');
    process.env.NODE_ENV = 'production';
  }
  
  // Ensure SSL certificates exist for HTTPS
  ensureCertificates();
  
  // Run production build
  console.log('📦 Building for production...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
  
  // Verify build output
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory not found!');
    process.exit(1);
  }
  
  // Create security.txt file
  createSecurityTxt();
  
  console.log('✅ Build completed successfully!');
  console.log('\nTo start the production server with HTTPS:');
  console.log('  npm run serve:https');
}

/**
 * Ensure SSL certificates exist
 */
function ensureCertificates() {
  console.log('🔒 Checking SSL certificates...');
  
  if (!fs.existsSync(path.join(CERT_DIR, 'cert.pem')) || 
      !fs.existsSync(path.join(CERT_DIR, 'key.pem'))) {
    console.log('🔑 SSL certificates not found, generating...');
    try {
      execSync('node ./scripts/generate-ssl-cert.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to generate SSL certificates:', error);
      console.log('Please run: npm run generate-cert');
      process.exit(1);
    }
  } else {
    console.log('✅ SSL certificates found!');
  }
}

/**
 * Create security.txt file following the standard
 * https://securitytxt.org/
 */
function createSecurityTxt() {
  console.log('📝 Creating security.txt file...');
  
  const securityTxtContent = `# Security Policy
Contact: mailto:security@github.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: en
Canonical: https://github.com/TheJ-Erk400/devportfollio/.well-known/security.txt
Policy: https://github.com/TheJ-Erk400/devportfollio/security/policy
`;

  // Create .well-known directory if it doesn't exist
  const wellKnownDir = path.join(DIST_DIR, '.well-known');
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }
  
  // Write security.txt file
  fs.writeFileSync(path.join(wellKnownDir, 'security.txt'), securityTxtContent);
  
  // Also add it to the root for compatibility
  fs.writeFileSync(path.join(DIST_DIR, 'security.txt'), securityTxtContent);
  
  console.log('✅ security.txt file created!');
}

// Run the deployment preparation
prepareForDeployment(); 