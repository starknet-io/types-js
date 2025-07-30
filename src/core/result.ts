/**
 * Result pattern for type-safe error handling - Perfect Architecture
 */

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Create a successful result
 */
export const Ok = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

/**
 * Create an error result
 */
export const Err = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

/**
 * Type guard for successful results
 */
export const isOk = <T, E>(result: Result<T, E>): result is { success: true; data: T } =>
  result.success;

/**
 * Type guard for error results
 */
export const isErr = <T, E>(result: Result<T, E>): result is { success: false; error: E } =>
  !result.success;

/**
 * Map over successful results
 */
export const map = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
  isOk(result) ? Ok(fn(result.data)) : (result as Result<U, E>);

/**
 * Chain operations that return Results
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => (isOk(result) ? fn(result.data) : (result as Result<U, E>));

/**
 * Handle errors in Results
 */
export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> =>
  isErr(result) ? Err(fn(result.error)) : (result as Result<T, F>);

/**
 * Base class for domain-specific errors
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  abstract readonly domain: string;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Type validation errors
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';

  readonly domain = 'TYPE_SYSTEM';

  constructor(
    message: string,
    public readonly value: unknown,
    public readonly expectedType: string,
    context?: Record<string, unknown>
  ) {
    super(message, { ...context, value, expectedType });
  }
}

/**
 * Type conversion errors
 */
export class ConversionError extends DomainError {
  readonly code = 'CONVERSION_ERROR';

  readonly domain = 'TYPE_SYSTEM';

  constructor(
    message: string,
    public readonly fromType: string,
    public readonly toType: string,
    context?: Record<string, unknown>
  ) {
    super(message, { ...context, fromType, toType });
  }
}
