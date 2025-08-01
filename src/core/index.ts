/**
 * Core module exports - shared primitives and utilities
 */

// Re-export types
export type * from './types.js';

// Re-export guards
export * from './guards.js';

// Re-export utilities
export type * from './utils.js';
export {
  typedKeys,
  typedEntries,
  typedFromEntries,
  createBrand,
  assertUnreachable,
  includes,
} from './utils.js';
