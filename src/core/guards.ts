/**
 * Type guards for runtime validation of branded types
 * These provide type-safe validation at runtime
 */

import type {
  ADDRESS,
  BLOCK_HASH,
  BLOCK_NUMBER,
  CHAIN_ID,
  ETH_ADDRESS,
  FELT,
  L1_TXN_HASH,
  NUM_AS_HEX,
  SIGNATURE,
  STORAGE_KEY,
  TXN_HASH,
  u128,
  u64,
} from './types.js';

/**
 * Validates if a string is a valid FELT
 * @param value - String to validate
 * @returns Type predicate indicating if value is FELT
 */
export const isFELT = (value: string): value is FELT =>
  /^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,62})$/.test(value);

/**
 * Validates if a string is a valid PADDED_FELT
 * @param value - String to validate
 * @returns Type predicate indicating if value is FELT
 */
export const isPaddedFELT = (value: string): value is FELT =>
  /^0x(0[0-8]{1}[a-fA-F0-9]{62}$)/.test(value);

/**
 * Validates if a string is a valid ADDRESS (must also be valid FELT)
 * @param value - String to validate
 * @returns Type predicate indicating if value is ADDRESS
 */
export const isAddress = (value: string): value is ADDRESS => isFELT(value);

/**
 * Validates if a string is a valid Ethereum address
 * @param value - String to validate
 * @returns Type predicate indicating if value is ETH_ADDRESS
 */
export const isEthAddress = (value: string): value is ETH_ADDRESS =>
  /^0x[a-fA-F0-9]{40}$/.test(value);

/**
 * Validates if a string is a valid storage key
 * @param value - String to validate
 * @returns Type predicate indicating if value is STORAGE_KEY
 */
export const isStorageKey = (value: string): value is STORAGE_KEY =>
  /^0x(0|[0-7]{1}[a-fA-F0-9]{0,62}$)/.test(value);

/**
 * Validates if a string is a valid hex number
 * @param value - String to validate
 * @returns Type predicate indicating if value is NUM_AS_HEX
 */
export const isNumAsHex = (value: string): value is NUM_AS_HEX => /^0x[a-fA-F0-9]+$/.test(value);

/**
 * Validates if a string is a valid u64
 * @param value - String to validate
 * @returns Type predicate indicating if value is u64
 */
export const isU64 = (value: string): value is u64 =>
  /^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,15})$/.test(value);

/**
 * Validates if a string is a valid u128
 * @param value - String to validate
 * @returns Type predicate indicating if value is u128
 */
export const isU128 = (value: string): value is u128 =>
  /^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,31})$/.test(value);

/**
 * Validates if a string is a valid transaction hash
 * @param value - String to validate
 * @returns Type predicate indicating if value is TXN_HASH
 */
export const isTxnHash = (value: string): value is TXN_HASH => isFELT(value);

/**
 * Validates if a string is a valid L1 transaction hash
 * @param value - String to validate
 * @returns Type predicate indicating if value is L1_TXN_HASH
 */
export const isL1TxnHash = (value: string): value is L1_TXN_HASH => isNumAsHex(value);

/**
 * Validates if a string is a valid block hash
 * @param value - String to validate
 * @returns Type predicate indicating if value is BLOCK_HASH
 */
export const isBlockHash = (value: string): value is BLOCK_HASH => isFELT(value);

/**
 * Validates if a string is a valid chain ID
 * @param value - String to validate
 * @returns Type predicate indicating if value is CHAIN_ID
 */
export const isChainId = (value: string): value is CHAIN_ID => isNumAsHex(value);

/**
 * Validates if a number is a valid block number
 * @param value - Number to validate
 * @returns Type predicate indicating if value is BLOCK_NUMBER
 */
export const isBlockNumber = (value: number): value is BLOCK_NUMBER =>
  Number.isInteger(value) && value >= 0;

/**
 * Validates if an array contains valid FELT signatures
 * @param value - Array to validate
 * @returns Type predicate indicating if value is SIGNATURE
 */
export const isSignature = (value: string[]): value is SIGNATURE =>
  Array.isArray(value) && value.every(isFELT);

/**
 * Assertion functions for runtime type checking
 */

export const assertFELT = (value: string, message = 'Invalid FELT'): asserts value is FELT => {
  if (!isFELT(value)) {
    throw new TypeError(`${message}: ${value}`);
  }
};

export const assertAddress = (
  value: string,
  message = 'Invalid address'
): asserts value is ADDRESS => {
  if (!isAddress(value)) {
    throw new TypeError(`${message}: ${value}`);
  }
};

export const assertEthAddress = (
  value: string,
  message = 'Invalid Ethereum address'
): asserts value is ETH_ADDRESS => {
  if (!isEthAddress(value)) {
    throw new TypeError(`${message}: ${value}`);
  }
};

export const assertBlockNumber = (
  value: number,
  message = 'Invalid block number'
): asserts value is BLOCK_NUMBER => {
  if (!isBlockNumber(value)) {
    throw new TypeError(`${message}: ${value}`);
  }
};
