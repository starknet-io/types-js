import { describe, it, expect } from '@jest/globals';
import {
  isFELT,
  isPaddedFELT,
  isAddress,
  isEthAddress,
  isStorageKey,
  isNumAsHex,
  isU64,
  isU128,
  isTxnHash,
  isL1TxnHash,
  isBlockHash,
  isChainId,
  isBlockNumber,
  isSignature,
  assertFELT,
  assertAddress,
  assertEthAddress,
  assertBlockNumber,
} from '../../../src/core/guards';
import { TEST_CONSTANTS } from '../../utils/test-helpers';

describe('Core Type Guards', () => {
  describe('isFELT', () => {
    it('should return true for valid FELT values', () => {
      expect(isFELT('0x0')).toBe(true);
      expect(isFELT('0x1')).toBe(true);
      expect(isFELT('0x123abc')).toBe(true);
      expect(isFELT(`0x${'f'.repeat(62)}`)).toBe(true); // Max length
      expect(isFELT(TEST_CONSTANTS.VALID_FELT)).toBe(true);
    });

    it('should return false for invalid FELT values', () => {
      expect(isFELT('')).toBe(false);
      expect(isFELT('123')).toBe(false); // Missing 0x prefix
      expect(isFELT('0x')).toBe(false); // Just prefix
      expect(isFELT('0xg123')).toBe(false); // Invalid hex char
      expect(isFELT(`0x${'f'.repeat(65)}`)).toBe(false); // Too long
      expect(isFELT(null as any)).toBe(false);
      expect(isFELT(undefined as any)).toBe(false);
      expect(isFELT(123 as any)).toBe(false);
    });
  });

  describe('isPaddedFELT', () => {
    it('should return true for valid padded FELT values', () => {
      // Looking at the regex: /^0x(0[0-8]{1}[a-fA-F0-9]{62}$)/
      // It expects 0x followed by exactly 64 chars starting with 0 and second char 0-8
      expect(isPaddedFELT(`0x00${'0'.repeat(62)}`)).toBe(true);
      expect(isPaddedFELT(`0x01${'a'.repeat(62)}`)).toBe(true);
      expect(isPaddedFELT(`0x08${'f'.repeat(62)}`)).toBe(true);
    });

    it('should return false for invalid padded FELT values', () => {
      expect(isPaddedFELT('')).toBe(false);
      expect(isPaddedFELT('0x')).toBe(false);
      expect(isPaddedFELT(`0x09${'0'.repeat(62)}`)).toBe(false); // Second char is 9 (not 0-8)
      expect(isPaddedFELT(`0x0${'0'.repeat(61)}`)).toBe(false); // Too short (only 62 chars after 0x)
      expect(isPaddedFELT(`0x0${'0'.repeat(65)}`)).toBe(false); // Too long (66 chars after 0x)
      expect(isPaddedFELT(`0x10${'0'.repeat(62)}`)).toBe(false); // First char after 0x is not 0
    });
  });

  describe('isAddress', () => {
    it('should return true for valid StarkNet addresses', () => {
      expect(isAddress(TEST_CONSTANTS.VALID_ADDRESS)).toBe(true);
      expect(isAddress('0x1')).toBe(true); // Minimum valid FELT
      expect(isAddress(`0x1${'0'.repeat(61)}`)).toBe(true); // Max length (1 + 61 = 62 chars)
    });

    it('should return false for invalid addresses', () => {
      expect(isAddress('')).toBe(false);
      expect(isAddress('0x0123')).toBe(false); // Leading zero not allowed (except just '0')
      expect(isAddress(`0x${'0'.repeat(63)}`)).toBe(false); // Too long (64 chars)
      expect(isAddress(`0x${'0'.repeat(65)}`)).toBe(false); // Too long
      expect(isAddress(TEST_CONSTANTS.INVALID_ADDRESS)).toBe(false);
    });
  });

  describe('isEthAddress', () => {
    it('should return true for valid Ethereum addresses', () => {
      expect(isEthAddress(TEST_CONSTANTS.VALID_ETH_ADDRESS)).toBe(true);
      expect(isEthAddress(`0x${'a'.repeat(40)}`)).toBe(true);
      expect(isEthAddress(`0x${'F'.repeat(40)}`)).toBe(true); // Uppercase
    });

    it('should return false for invalid Ethereum addresses', () => {
      expect(isEthAddress('')).toBe(false);
      expect(isEthAddress('0x123')).toBe(false); // Too short
      expect(isEthAddress(`0x${'0'.repeat(39)}`)).toBe(false); // Too short
      expect(isEthAddress(`0x${'0'.repeat(41)}`)).toBe(false); // Too long
      expect(isEthAddress(TEST_CONSTANTS.INVALID_ETH_ADDRESS)).toBe(false);
    });
  });

  describe('isStorageKey', () => {
    it('should return true for valid storage keys', () => {
      expect(isStorageKey(TEST_CONSTANTS.VALID_STORAGE_KEY)).toBe(true);
      expect(isStorageKey('0x0')).toBe(true); // Just 0
      expect(isStorageKey(`0x7${'f'.repeat(62)}`)).toBe(true); // Starts with 7, max 63 chars total
    });

    it('should return false for invalid storage keys', () => {
      expect(isStorageKey('')).toBe(false);
      expect(isStorageKey('0xabc')).toBe(false); // Doesn't start with 0-7 after 0x
      expect(isStorageKey(`0x8${'0'.repeat(10)}`)).toBe(false); // Starts with 8 (not 0-7)
      expect(isStorageKey('not-hex')).toBe(false); // Not hex format
    });
  });

  describe('isNumAsHex', () => {
    it('should return true for valid hex numbers', () => {
      expect(isNumAsHex('0x0')).toBe(true);
      expect(isNumAsHex('0x1')).toBe(true);
      expect(isNumAsHex('0xff')).toBe(true);
      expect(isNumAsHex('0x123abc')).toBe(true);
    });

    it('should return false for invalid hex numbers', () => {
      expect(isNumAsHex('')).toBe(false);
      expect(isNumAsHex('123')).toBe(false); // Missing 0x
      expect(isNumAsHex('0x')).toBe(false); // Just prefix
      expect(isNumAsHex('0xg')).toBe(false); // Invalid char
    });
  });

  describe('isU64', () => {
    it('should return true for valid u64 values', () => {
      expect(isU64('0x0')).toBe(true);
      expect(isU64('0x1')).toBe(true);
      expect(isU64('0xffffffffffffffff')).toBe(true); // Max u64
      expect(isU64(TEST_CONSTANTS.VALID_U64)).toBe(true);
    });

    it('should return false for values exceeding u64', () => {
      expect(isU64('0x10000000000000000')).toBe(false); // Too large
      expect(isU64(`0x${'f'.repeat(17)}`)).toBe(false); // Too many chars
    });
  });

  describe('isU128', () => {
    it('should return true for valid u128 values', () => {
      expect(isU128('0x0')).toBe(true);
      expect(isU128('0x1')).toBe(true);
      expect(isU128(`0x${'f'.repeat(32)}`)).toBe(true); // Max u128
      expect(isU128(TEST_CONSTANTS.VALID_U128)).toBe(true);
    });

    it('should return false for values exceeding u128', () => {
      expect(isU128(`0x${'f'.repeat(33)}`)).toBe(false); // Too large
    });
  });

  describe('isTxnHash', () => {
    it('should return true for valid transaction hashes', () => {
      expect(isTxnHash(TEST_CONSTANTS.VALID_TXN_HASH)).toBe(true);
      expect(isTxnHash(`0x${'a'.repeat(62)}`)).toBe(true); // Max length
    });

    it('should return false for invalid transaction hashes', () => {
      expect(isTxnHash('')).toBe(false);
      expect(isTxnHash(`0x${'a'.repeat(64)}`)).toBe(false); // Too long (isFELT max is 62)
      expect(isTxnHash(`0x${'a'.repeat(65)}`)).toBe(false); // Too long
    });
  });

  describe('isL1TxnHash', () => {
    it('should return true for valid L1 transaction hashes', () => {
      expect(isL1TxnHash(`0x${'b'.repeat(64)}`)).toBe(true); // Uses isNumAsHex, allows any length
    });

    it('should return false for invalid L1 transaction hashes', () => {
      expect(isL1TxnHash('')).toBe(false);
      expect(isL1TxnHash('0x')).toBe(false); // Just prefix
    });
  });

  describe('isBlockHash', () => {
    it('should return true for valid block hashes', () => {
      expect(isBlockHash(TEST_CONSTANTS.VALID_BLOCK_HASH)).toBe(true);
      expect(isBlockHash(`0x${'c'.repeat(62)}`)).toBe(true); // Max length for isFELT
    });

    it('should return false for invalid block hashes', () => {
      expect(isBlockHash('')).toBe(false);
      expect(isBlockHash(`0x${'c'.repeat(64)}`)).toBe(false); // Too long (isFELT max is 62)
    });
  });

  describe('isChainId', () => {
    it('should return true for valid chain IDs', () => {
      expect(isChainId(TEST_CONSTANTS.VALID_CHAIN_ID)).toBe(true);
      expect(isChainId('0x534e5f4d41494e')).toBe(true); // SN_MAIN
    });

    it('should return false for invalid chain IDs', () => {
      expect(isChainId('')).toBe(false);
      expect(isChainId('INVALID')).toBe(false);
    });
  });

  describe('isBlockNumber', () => {
    it('should return true for valid block numbers', () => {
      expect(isBlockNumber(0)).toBe(true);
      expect(isBlockNumber(1)).toBe(true);
      expect(isBlockNumber(TEST_CONSTANTS.VALID_BLOCK_NUMBER)).toBe(true);
      expect(isBlockNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('should return false for invalid block numbers', () => {
      expect(isBlockNumber(-1)).toBe(false);
      expect(isBlockNumber(1.5)).toBe(false);
      expect(isBlockNumber(null as any)).toBe(false);
      expect(isBlockNumber('123' as any)).toBe(false);
    });
  });

  describe('isSignature', () => {
    it('should return true for valid signatures', () => {
      expect(isSignature(TEST_CONSTANTS.VALID_SIGNATURE)).toBe(true);
      expect(isSignature(['0x123'])).toBe(true); // Single element
      expect(isSignature(['0x123', '0x456', '0x789'])).toBe(true); // Multiple
      expect(isSignature([])).toBe(true); // Empty array - [].every() returns true
    });

    it('should return false for invalid signatures', () => {
      expect(isSignature(['invalid'])).toBe(false); // Invalid hex
      expect(isSignature('not-array' as any)).toBe(false);
    });
  });

  describe('Assert functions', () => {
    describe('assertFELT', () => {
      it('should not throw for valid FELT', () => {
        expect(() => assertFELT(TEST_CONSTANTS.VALID_FELT)).not.toThrow();
      });

      it('should throw for invalid FELT', () => {
        expect(() => assertFELT('invalid')).toThrow('Invalid FELT');
      });
    });

    describe('assertAddress', () => {
      it('should not throw for valid address', () => {
        expect(() => assertAddress(TEST_CONSTANTS.VALID_ADDRESS)).not.toThrow();
      });

      it('should throw for invalid address', () => {
        expect(() => assertAddress('invalid')).toThrow('Invalid address');
      });
    });

    describe('assertEthAddress', () => {
      it('should not throw for valid Ethereum address', () => {
        expect(() => assertEthAddress(TEST_CONSTANTS.VALID_ETH_ADDRESS)).not.toThrow();
      });

      it('should throw for invalid Ethereum address', () => {
        expect(() => assertEthAddress('0x123')).toThrow('Invalid Ethereum address');
      });
    });

    describe('assertBlockNumber', () => {
      it('should not throw for valid block number', () => {
        expect(() => assertBlockNumber(123)).not.toThrow();
      });

      it('should throw for invalid block number', () => {
        expect(() => assertBlockNumber(-1)).toThrow('Invalid block number');
      });
    });
  });
});
