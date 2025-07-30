/**
 * Core branded types for enhanced type safety
 * These types provide runtime validation and better developer experience
 */

// Base branded type utility
type Brand<T, B> = T & { readonly __brand: B };

/**
 * A field element represented by at most 63 hex digits
 * @pattern ^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,62})$
 * @example "0x1234567890abcdef"
 * @example "0x0"
 * @see https://docs.starknet.io/documentation/architecture_and_concepts/Cryptography/hash-functions/
 */
export type FELT = Brand<string, 'FELT'>;

/**
 * A contract address on Starknet (branded FELT)
 * @example "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
 */
export type ADDRESS = Brand<FELT, 'ADDRESS'>;

/**
 * An ethereum address represented as 40 hex digits
 * @pattern ^0x[a-fA-F0-9]{40}$
 * @example "0x1234567890123456789012345678901234567890"
 */
export type ETH_ADDRESS = Brand<string, 'ETH_ADDRESS'>;

/**
 * A storage key. Represented as up to 62 hex digits, 3 bits, and 5 leading zeroes.
 * @pattern ^0x(0|[0-7]{1}[a-fA-F0-9]{0,62}$)
 */
export type STORAGE_KEY = Brand<string, 'STORAGE_KEY'>;

/**
 * String representing an unsigned integer number in prefixed hexadecimal format
 * @example "0x1a4"
 * @pattern ^0x[a-fA-F0-9]+$
 */
export type NUM_AS_HEX = Brand<string, 'NUM_AS_HEX'>;

/**
 * 64 bit unsigned integers, represented by hex string of length at most 16
 * @pattern ^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,15})$
 */
export type u64 = Brand<string, 'u64'>;

/**
 * 128 bit unsigned integers, represented by hex string of length at most 32
 * @pattern ^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,31})$
 */
export type u128 = Brand<string, 'u128'>;

/**
 * The hash of a Starknet transaction
 */
export type TXN_HASH = Brand<FELT, 'TXN_HASH'>;

/**
 * The hash of an Ethereum transaction
 */
export type L1_TXN_HASH = Brand<NUM_AS_HEX, 'L1_TXN_HASH'>;

/**
 * Block hash
 */
export type BLOCK_HASH = Brand<FELT, 'BLOCK_HASH'>;

/**
 * Chain ID
 */
export type CHAIN_ID = Brand<NUM_AS_HEX, 'CHAIN_ID'>;

/**
 * Block number
 * @minimum 0
 */
export type BLOCK_NUMBER = number;

/**
 * Array of field elements representing a signature
 */
export type SIGNATURE = FELT[];
