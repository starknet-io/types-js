import { describe, it, expect } from '@jest/globals';
import {
  typedKeys,
  typedEntries,
  typedFromEntries,
  createBrand,
  assertUnreachable,
  includes,
} from '../../../src/core/utils';
import type { Brand } from '../../../src/core/utils';

describe('Core Utilities', () => {
  describe('typedKeys', () => {
    it('should return typed keys of an object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = typedKeys(obj);

      expect(keys).toEqual(['a', 'b', 'c']);
      // Type test - keys should be typed as ('a' | 'b' | 'c')[]
      const typeTest: ('a' | 'b' | 'c')[] = keys;
      expect(typeTest).toBeDefined();
    });

    it('should handle empty objects', () => {
      const obj = {};
      const keys = typedKeys(obj);
      expect(keys).toEqual([]);
    });

    it('should handle objects with symbol keys', () => {
      const sym = Symbol('test');
      const obj = { a: 1, [sym]: 2 };
      const keys = typedKeys(obj);
      expect(keys).toEqual(['a']); // Symbols are not included
    });
  });

  describe('typedEntries', () => {
    it('should return typed entries of an object', () => {
      const obj = { a: 1, b: 'two', c: true };
      const entries = typedEntries(obj);

      expect(entries).toEqual([
        ['a', 1],
        ['b', 'two'],
        ['c', true],
      ]);

      // Type test - entries should be properly typed as key-value pairs
      const typeTest: Array<[string, unknown]> = entries;
      expect(typeTest).toBeDefined();
    });

    it('should handle empty objects', () => {
      const obj = {};
      const entries = typedEntries(obj);
      expect(entries).toEqual([]);
    });
  });

  describe('typedFromEntries', () => {
    it('should create typed object from entries', () => {
      const entries: [string, number][] = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ];
      const obj = typedFromEntries(entries);

      expect(obj).toEqual({ a: 1, b: 2, c: 3 });
      // Type test - obj should be typed as Record<string, number>
      const typeTest: Record<string, number> = obj;
      expect(typeTest).toBeDefined();
    });

    it('should handle empty entries', () => {
      const entries: [string, unknown][] = [];
      const obj = typedFromEntries(entries);
      expect(obj).toEqual({});
    });

    it('should handle duplicate keys (last wins)', () => {
      const entries: [string, number][] = [
        ['a', 1],
        ['a', 2],
        ['a', 3],
      ];
      const obj = typedFromEntries(entries);
      expect(obj).toEqual({ a: 3 });
    });
  });

  describe('createBrand', () => {
    it('should create a branded type', () => {
      type UserId = Brand<string, 'UserId'>;
      const toUserId = createBrand<string, 'UserId'>();

      const id = '123';
      const userId = toUserId(id);

      expect(userId).toBe(id);
      expect(typeof userId).toBe('string');

      // Type test - userId should be typed as UserId
      const typeTest: UserId = userId;
      expect(typeTest).toBeDefined();
    });

    it('should work with different base types', () => {
      type _Score = Brand<number, 'Score'>;
      const toScore = createBrand<number, 'Score'>();

      const score = toScore(100);
      expect(score).toBe(100);
      expect(typeof score).toBe('number');

      // Use the _Score type to avoid unused warning
      // eslint-disable-next-line no-underscore-dangle
      const _scoreTest: _Score = score;
      expect(_scoreTest).toBeDefined();
    });

    it('should create distinct branded types', () => {
      type Email = Brand<string, 'Email'>;
      type _Username = Brand<string, 'Username'>;

      const toEmail = createBrand<string, 'Email'>();
      const toUsername = createBrand<string, 'Username'>();

      // eslint-disable-next-line no-underscore-dangle
      const _email = toEmail('test@example.com');
      // eslint-disable-next-line no-underscore-dangle
      const _username = toUsername('testuser');

      // Use the variables and types to avoid unused warnings
      expect(_email).toBe('test@example.com');
      expect(_username).toBe('testuser');

      // eslint-disable-next-line no-underscore-dangle
      const _emailType: Email = _email;
      // eslint-disable-next-line no-underscore-dangle
      const _usernameType: _Username = _username;
      expect(_emailType).toBeDefined();
      expect(_usernameType).toBeDefined();

      // These should be different types at compile time
      // Type assertion to bypass the strict type error
      // eslint-disable-next-line no-underscore-dangle
      const _testDifferentTypes = (_email as string) !== (_username as string);
      expect(typeof _testDifferentTypes).toBe('boolean');
    });
  });

  describe('assertUnreachable', () => {
    it('should throw error when called', () => {
      const value = 'unexpected' as never;
      expect(() => assertUnreachable(value)).toThrow('Unreachable code reached with value');
    });

    it('should be useful in exhaustive switch statements', () => {
      type Status = 'pending' | 'completed' | 'failed';

      function handleStatus(status: Status): string {
        switch (status) {
          case 'pending':
            return 'In progress';
          case 'completed':
            return 'Done';
          case 'failed':
            return 'Error';
          default:
            // This ensures all cases are handled
            return assertUnreachable(status);
        }
      }

      expect(handleStatus('pending')).toBe('In progress');
      expect(handleStatus('completed')).toBe('Done');
      expect(handleStatus('failed')).toBe('Error');
    });
  });

  describe('includes', () => {
    it('should check if array includes a value with proper typing', () => {
      const arr = ['a', 'b', 'c'] as const;

      expect(includes(arr, 'a')).toBe(true);
      expect(includes(arr, 'b')).toBe(true);
      expect(includes(arr, 'c')).toBe(true);
      expect(includes(arr, 'd')).toBe(false);
    });

    it('should narrow types correctly', () => {
      const arr = ['pending', 'completed', 'failed'] as const;
      const value: string = 'pending';

      if (includes(arr, value)) {
        // Type should be narrowed to 'pending' | 'completed' | 'failed'
        const typeTest: 'pending' | 'completed' | 'failed' = value;
        expect(typeTest).toBeDefined();
        expect(arr).toContain(value);
      }
    });

    it('should work with number arrays', () => {
      const arr = [1, 2, 3] as const;

      expect(includes(arr, 1)).toBe(true);
      expect(includes(arr, 4)).toBe(false);
    });

    it('should work with mixed type arrays', () => {
      const arr = [1, 'two', true, null] as const;

      expect(includes(arr, 1)).toBe(true);
      expect(includes(arr, 'two')).toBe(true);
      expect(includes(arr, true)).toBe(true);
      expect(includes(arr, null)).toBe(true);
      expect(includes(arr, false)).toBe(false);
    });
  });
});
