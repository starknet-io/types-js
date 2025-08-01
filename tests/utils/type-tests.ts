type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

type Expect<T extends true> = T;

type ExpectTrue<T extends true> = T;
type ExpectFalse<T extends false> = T;

type IsAny<T> = 0 extends 1 & T ? true : false;
type NotAny<T> = true extends IsAny<T> ? false : true;

export type { Equal, NotEqual, Expect, ExpectTrue, ExpectFalse, IsAny, NotAny };

export type Extends<A, B> = A extends B ? true : false;

export type NotExtends<A, B> = A extends B ? false : true;

export type HasProperty<T, K extends string | number | symbol> = K extends keyof T ? true : false;

export type IsNullable<T> = null extends T ? true : undefined extends T ? true : false;

export type IsOptional<T, K extends keyof T> =
  T extends Record<K, T[K]> ? ({} extends Pick<T, K> ? true : false) : false;

export type IsReadonly<T, K extends keyof T> = Equal<
  { [P in K]: T[P] },
  { readonly [P in K]: T[P] }
>;

export type IsMutable<T, K extends keyof T> = Equal<
  { [P in K]: T[P] },
  { -readonly [P in K]: T[P] }
>;

export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | `${K}.${DeepKeys<T[K]>}` : never;
    }[keyof T]
  : never;

export function assertType<T>(_value?: T): void {}

export function assertNotType<T, U>(_value: T & (T extends U ? never : unknown)): void {
  // This function is used for compile-time type checking only
}

export const typeTests = {
  pass: <T>(_result: T extends true ? true : never): void => {},
  fail: <T>(_result: T extends false ? true : never): void => {},
};

export type TestCases<T extends Record<string, boolean>> = T;
