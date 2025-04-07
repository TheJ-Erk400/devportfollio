# Icons Directory

This directory should contain the following icon files for the PWA:

## Required Icon Files

### Standard Icons
- `icon-72x72.png` - 72x72 pixel icon (Android devices)
- `icon-96x96.png` - 96x96 pixel icon (Android devices) 
- `icon-128x128.png` - 128x128 pixel icon (Android/Windows)
- `icon-144x144.png` - 144x144 pixel icon (Android/Windows)
- `icon-152x152.png` - 152x152 pixel icon (iOS)
- `icon-192x192.png` - 192x192 pixel icon (Android/Chrome)
- `icon-384x384.png` - 384x384 pixel icon (Android/Windows) 
- `icon-512x512.png` - 512x512 pixel icon (Android/iOS/Chrome)

### Special Icons
- `maskable-icon.png` - 512x512 pixel icon with padding for adaptive icons (Android)
- `badge-72x72.png` - 72x72 pixel icon for notification badges
- `shortcut-create.png` - 96x96 pixel icon for the "Create Profile" shortcut
- `shortcut-view.png` - 96x96 pixel icon for the "View Profile" shortcut
- `placeholder-image.png` - 512x512 pixel fallback image for failed image requests

### iOS Splash Screens
- `splash-640x1136.png` - Splash screen for iPhone 5/SE
- `splash-750x1334.png` - Splash screen for iPhone 6/7/8 
- `splash-1242x2208.png` - Splash screen for iPhone 6+/7+/8+
- `splash-1125x2436.png` - Splash screen for iPhone X/XS
- `splash-1536x2048.png` - Splash screen for iPad
- `splash-1668x2224.png` - Splash screen for iPad Pro 10.5"
- `splash-2048x2732.png` - Splash screen for iPad Pro 12.9"

## Icon Requirements

1. All icons should have the CheckMate.io logo with the following gradient:
   - Start color: #00dbde
   - End color: #fc00ff

2. The icons should match the design of the logo in the app:
   - Diamond shape in the center
   - Gradient-filled circle outline

3. For the **maskable icon**, ensure there is extra padding around the logo (about 20% on each side) to allow for adaptive icon cropping on different devices.

## Icon Generation

To generate all required icons efficiently, you can use:

1. [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) - A CLI tool
   ```bash
   npx pwa-asset-generator logo.svg ./icons --icon-only --maskable --favicon
   ```

2. [PWA Builder](https://www.pwabuilder.com/) - An online tool for generating PWA assets

3. [App Icon Generator](https://appicon.co/) - For generating iOS-specific icons

## Placeholder Notice

If you're seeing this README, it means you need to create and add the actual icon files to this directory. The app requires these icons for full PWA functionality and proper display on mobile devices.

Please create and add these files before deploying the application. 