import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock Auth0
vi.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: vi.fn(),
  Auth0Client: vi.fn(),
}));

// Mock QR Code Generator
vi.mock('qrcode-generator', () => ({
  default: vi.fn(() => ({
    addData: vi.fn(),
    make: vi.fn(),
    createImgTag: vi.fn(() => '<img src="mock-qr-code.png" />'),
  })),
}));

// Configure Vue Test Utils
config.global.mocks = {
  // Add any global mocks here
};

// Add any global test utilities here
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})); 