# CheckMate.io - AI Developer Profile Creator

## Overview

CheckMate.io is an innovative platform that leverages artificial intelligence to create professional, interactive developer profiles. Our platform helps developers showcase their skills, projects, and experience in a dynamic, AI-powered format that stands out to potential employers and clients.

## Features

- **AI-Powered Profiles**: Create stunning, interactive developer profiles using advanced AI technology
- **Smart Cover Letters**: Generate tailored cover letters for job applications
- **Digital Badge System**: Share your professional profile via QR codes
- **Resume & CV Generator**: Create professional resumes with multiple templates (modern and classic)
- **GitHub Integration**: Showcase your projects and contributions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **PWA Support**: Install as a native app on mobile or desktop
- **HTTPS Support**: Enhanced security with local SSL certificate generation

## Tech Stack

- **Frontend Framework**: Vue 3 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Auth0
- **Animations**: GSAP
- **QR Code Generation**: qrcode-generator
- **PDF Generation**: jsPDF, pdfmake, html2canvas
- **Testing**: Vitest + Vue Test Utils + Cypress
- **Deployment**: GitHub Pages

## Project Setup

### Prerequisites

- Node.js (v21+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TheJ-Erk400/devportfollio.git
   cd devportfollio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create icon files:
   - Add icon files to the `/icons` directory:
     - `icon-192x192.png` - 192x192 pixel icon
     - `icon-512x512.png` - 512x512 pixel icon
   - The icons should match the design of the app's logo:
     - Diamond shape in the center
     - Gradient-filled circle outline (from #00dbde to #fc00ff)

4. Generate SSL certificates for local development (optional):
   ```bash
   npm run generate-cert
   ```

5. Run the development server:
   ```bash
   # Standard development server
   npm run dev
   
   # With HTTPS (after generating certificates)
   npm run dev -- --https
   ```

## Project Structure

```
checkmate.io/
├── .github/          # GitHub Actions workflows
├── cert/             # SSL certificates for local development
├── components/       # Vue components
├── cypress/          # E2E tests
├── icons/            # PWA icons
├── public/           # Static assets
├── scripts/          # Utility scripts
├── src/              # Source files
│   ├── components/   # Vue components
│   │   ├── CVGenerator.vue    # Resume generator component
│   │   └── QRCodeGenerator.vue # QR code generator component  
├── styles/           # CSS files
├── tests/            # Unit tests
│   ├── e2e/          # End-to-end tests
│   └── unit/         # Unit tests
├── index.html        # Main HTML file
├── manifest.json     # PWA manifest
├── package.json      # Project dependencies
├── sw.js             # Service worker
└── README.md         # Project documentation
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Generate test coverage report
npm run test:coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
# Standard preview
npm run preview

# Preview with HTTPS
npm run serve:https
```

## PWA Configuration

CheckMate.io is configured as a Progressive Web App (PWA) with advanced features such as:

- Offline functionality with a custom offline page
- App installation on mobile and desktop devices
- Push notifications support
- Background sync for data submission when offline
- Automatic updates when new versions are deployed

### PWA Setup Requirements

To fully deploy the PWA features, ensure you:

1. **Generate all required icons**:
   ```bash
   npm run generate-pwa-assets
   ```
   This will create all the necessary icons and splash screens required for proper PWA display.

2. **HTTPS is required**:
   Service workers (required for PWA functionality) only work on secure origins (HTTPS) or localhost.
   - For local development, use the certificate generation script:
     ```bash
     npm run generate-cert
     ```

3. **Configure Web App Manifest**:
   The `manifest.json` file is already configured, but you may want to customize app details.

4. **Test PWA Features**:
   Use Chrome DevTools > Application tab to verify:
   - Service worker registration
   - Cache storage
   - Manifest validation
   - Offline functionality

### PWA Performance

The PWA implementation uses advanced caching strategies:

- Static assets: Cache-first strategy
- API calls: Network-first strategy with offline fallback
- Third-party CDN resources: Cache-first with 30-day expiration

## Key Components

### CV/Resume Generator

The CV Generator allows users to:

- Create professional resumes and CVs with personal information, skills, experience, education, and projects
- Choose between modern and classic templates
- Export as PDF format for easy sharing
- Receive AI-based suggestions to enhance resume content (premium feature)

### QR Code Generator

The QR Code Generator enables users to:

- Create customizable QR codes for their professional portfolio
- Adjust size and color to match personal branding
- Download QR codes in PNG format
- Embed profile links, contact information, and portfolio URLs

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch. The workflow:

1. Runs all tests
2. Builds the application
3. Deploys to GitHub Pages

You can also deploy manually to any static hosting service:

- **GitHub Pages**: Already configured with GitHub Actions
- **Netlify**: Connect your GitHub repository for automatic deployments
- **Vercel**: Import your project for seamless deployment

## Troubleshooting

### Common Issues

1. **Service Worker Registration Failed**: 
   - Ensure you're accessing the app via HTTPS or localhost
   - Check that the sw.js file is in the root directory

2. **Icons Not Loading**:
   - Verify that you've created and placed the icon files in the `/icons` directory
   - Check the paths in the manifest.json file

3. **QR Code Not Generating**:
   - Check the browser console for errors
   - Ensure the qrcode-generator script is loaded

4. **PDF Generation Issues**:
   - Make sure all required libraries (jsPDF, html2canvas, pdfmake) are installed
   - Check browser console for specific errors
   - Try using a different browser if issues persist

5. **Node.js Version Issues**:
   - Make sure you're using Node.js v21 or higher
   - Run `node -v` to check your current version

6. **SSL Certificate Issues**:
   - If you encounter issues with the SSL certificate generation, ensure `devcert` is installed correctly
   - On Windows, you may need to run as administrator for certificate installation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2024 Level4Foe Framework. All rights reserved.
All copyrights & trademarks of Snow City Solutions & GuardingUS.AI. INC

## Contact

For support or inquiries, please contact support@checkmate.io
