import '@jest/globals';
import { isFELT, isAddress, isEthAddress } from '../src/core/guards.js';

// Global test setup
beforeAll(() => {
  // Set any global test configurations here
  // eslint-disable-next-line no-console
  console.log('Starting StarkNet.js Types Test Suite');
});

afterAll(() => {
  // Clean up after all tests
  // eslint-disable-next-line no-console
  console.log('Completed StarkNet.js Types Test Suite');
});

// Custom matchers for type testing
expect.extend({
  toBeValidHex(received: string) {
    // Use a basic hex check since we don't have a specific guard for general hex
    const pass = typeof received === 'string' && /^0x[0-9a-fA-F]+$/.test(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid hex string`
          : `expected ${received} to be a valid hex string (starting with 0x followed by hex characters)`,
      pass,
    };
  },

  toBeValidFelt(received: string) {
    // Use the actual isFELT guard function instead of duplicating logic
    const pass = typeof received === 'string' && isFELT(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid FELT`
          : `expected ${received} to be a valid FELT according to the isFELT guard function`,
      pass,
    };
  },

  toBeValidAddress(received: string) {
    // Use the actual isAddress guard function instead of duplicating logic
    const pass = typeof received === 'string' && isAddress(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid StarkNet address`
          : `expected ${received} to be a valid StarkNet address according to the isAddress guard function`,
      pass,
    };
  },

  toBeValidEthAddress(received: string) {
    // Use the actual isEthAddress guard function instead of duplicating logic
    const pass = typeof received === 'string' && isEthAddress(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid Ethereum address`
          : `expected ${received} to be a valid Ethereum address according to the isEthAddress guard function`,
      pass,
    };
  },
});

// Extend Jest matchers TypeScript definitions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidHex(): R;
      toBeValidFelt(): R;
      toBeValidAddress(): R;
      toBeValidEthAddress(): R;
    }
  }
}

export {};
