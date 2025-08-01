import { describe, it, expect } from '@jest/globals';

// Basic functionality test to verify the library is working
describe('Basic Library Functionality', () => {
  it('should compile and run without errors', () => {
    // Import core functions
    // eslint-disable-next-line global-require
    const { isFELT, isAddress } = require('../src/core/guards');

    // Test basic functionality
    expect(typeof isFELT).toBe('function');
    expect(typeof isAddress).toBe('function');

    // Test with valid values
    expect(isFELT('0x123')).toBe(true);
    expect(isFELT('invalid')).toBe(false);

    // Test valid address - use a proper 63-char address
    const validAddress = '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
    expect(isAddress(validAddress)).toBe(true);
    expect(isAddress('invalid')).toBe(false);
  });

  it('should export types correctly', () => {
    // Import type utilities
    // eslint-disable-next-line global-require
    const { typedKeys } = require('../src/core/utils');

    expect(typeof typedKeys).toBe('function');

    const obj = { a: 1, b: 2, c: 3 };
    const keys = typedKeys(obj);
    expect(keys).toEqual(['a', 'b', 'c']);
  });

  it('should work with CommonJS require', () => {
    // Test that the built package can be required
    // eslint-disable-next-line global-require
    const typesLibrary = require('../dist/cjs/index.js');

    expect(typeof typesLibrary.isFELT).toBe('function');
    expect(typeof typesLibrary.isAddress).toBe('function');
    expect(typeof typesLibrary.typedKeys).toBe('function');

    // Test functionality
    expect(typesLibrary.isFELT('0x123')).toBe(true);
    expect(typesLibrary.isFELT('invalid')).toBe(false);
  });
});
