// Core types and utilities - avoiding conflicts with existing API types
export type {
  FELT as CoreFELT,
  ADDRESS as CoreADDRESS,
  BLOCK_HASH as CoreBLOCK_HASH,
  TXN_HASH as CoreTXN_HASH,
  CHAIN_ID as CoreCHAIN_ID,
  BLOCK_NUMBER as CoreBLOCK_NUMBER,
  SIGNATURE as CoreSIGNATURE,
} from './core/types.js';

export {
  isFELT,
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
} from './core/guards.js';

export type * from './core/utils.js';
export {
  typedKeys,
  typedEntries,
  typedFromEntries,
  createBrand,
  assertUnreachable,
  includes,
} from './core/utils.js';

// Note: validators module disabled for now due to optional Zod dependency
// Will be enabled in future version with proper conditional imports

// API modules - maintain existing exports
export * from './api/index.js';
export * as API from './api/index.js';

export * from './wallet-api/index.js';
export * as WALLET_API from './wallet-api/index.js';

export * as PAYMASTER_API from './snip-29/index.js';
