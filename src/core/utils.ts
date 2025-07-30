/**
 * Type utilities for enhanced TypeScript development
 */

/**
 * Creates a non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Prettifies complex types for better IDE display
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Makes specific fields required while keeping others optional
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specific fields optional while keeping others required
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extracts the union of all keys from a union of objects
 */
export type UnionKeys<T> = T extends unknown ? keyof T : never;

/**
 * Creates a strict union where each variant must have unique keys
 */
export type StrictUnion<T, U = T> = T extends unknown
  ? T & Partial<Record<Exclude<UnionKeys<U>, keyof T>, never>>
  : never;

/**
 * Deeply readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Deeply partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Removes null and undefined from a type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Type-safe Object.keys alternative
 */
export const typedKeys = <T extends Record<string, unknown>>(obj: T): (keyof T)[] =>
  Object.keys(obj) as (keyof T)[];

/**
 * Type-safe Object.entries alternative
 */
export const typedEntries = <T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

/**
 * Type-safe Object.fromEntries alternative
 */
export const typedFromEntries = <K extends string | number | symbol, V>(
  entries: [K, V][]
): Record<K, V> => Object.fromEntries(entries) as Record<K, V>;

/**
 * Creates a branded type factory
 */
export const createBrand = <T, B extends string>() => {
  return (value: T): T & { readonly __brand: B } => value as T & { readonly __brand: B };
};

/**
 * Utility for exhaustive type checking
 */
export const assertUnreachable = (value: never): never => {
  throw new Error(`Unreachable code reached with value: ${JSON.stringify(value)}`);
};

/**
 * Type-safe array includes check
 */
export const includes = <T extends readonly unknown[]>(
  array: T,
  value: unknown
): value is T[number] => array.includes(value as T[number]);

/**
 * Conditional type utility for better type inference
 */
export type If<C extends boolean, T, F> = C extends true ? T : F;

/**
 * Extracts function parameters as a tuple
 */
export type Parameters<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

/**
 * Extracts function return type
 */
export type ReturnType<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: unknown[]
) => infer R
  ? R
  : never;
