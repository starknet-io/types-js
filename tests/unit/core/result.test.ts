import { describe, it, expect } from '@jest/globals';
import {
  Result,
  Ok,
  Err,
  isOk,
  isErr,
  map,
  flatMap,
  mapError,
  DomainError,
  ValidationError,
  ConversionError,
} from '../../../src/core/result';

describe('Core Result Types', () => {
  describe('Result type and constructors', () => {
    it('should create successful results', () => {
      const result = Ok('success');
      expect(result).toEqual({
        success: true,
        data: 'success',
      });
    });

    it('should create error results', () => {
      const error = new Error('test error');
      const result = Err(error);
      expect(result).toEqual({
        success: false,
        error,
      });
    });
  });

  describe('Type guards', () => {
    it('should identify successful results', () => {
      const success = Ok('data');
      const failure = Err('error');

      expect(isOk(success)).toBe(true);
      expect(isOk(failure)).toBe(false);

      if (isOk(success)) {
        expect(success.data).toBe('data');
      }
    });

    it('should identify error results', () => {
      const success = Ok('data');
      const failure = Err('error');

      expect(isErr(failure)).toBe(true);
      expect(isErr(success)).toBe(false);

      if (isErr(failure)) {
        expect(failure.error).toBe('error');
      }
    });
  });

  describe('Functional operations', () => {
    describe('map', () => {
      it('should transform successful results', () => {
        const result = Ok(5);
        const mapped = map(result, (x) => x * 2);

        expect(mapped).toEqual(Ok(10));
      });

      it('should pass through error results unchanged', () => {
        const error = new Error('test error');
        const result: Result<number, Error> = Err(error);
        const mapped = map(result, (x) => x * 2);

        expect(mapped).toEqual(Err(error));
      });
    });

    describe('flatMap', () => {
      it('should chain successful operations', () => {
        const result = Ok(5);
        const chained = flatMap(result, (x) => Ok(x.toString()));

        expect(chained).toEqual(Ok('5'));
      });

      it('should chain operations that can fail', () => {
        const result = Ok(-5);
        const chained = flatMap(result, (x) =>
          x >= 0 ? Ok(Math.sqrt(x)) : Err('Cannot take square root of negative number')
        );

        expect(chained).toEqual(Err('Cannot take square root of negative number'));
      });

      it('should pass through initial errors', () => {
        const error = new Error('initial error');
        const result: Result<number, Error> = Err(error);
        const chained = flatMap(result, (x) => Ok(x.toString()));

        expect(chained).toEqual(Err(error));
      });
    });

    describe('mapError', () => {
      it('should transform error results', () => {
        const result: Result<string, string> = Err('original error');
        const mapped = mapError(result, (error) => `Transformed: ${error}`);

        expect(mapped).toEqual(Err('Transformed: original error'));
      });

      it('should pass through successful results unchanged', () => {
        const result: Result<string, string> = Ok('success');
        const mapped = mapError(result, (error) => `Transformed: ${error}`);

        expect(mapped).toEqual(Ok('success'));
      });

      it('should change error type', () => {
        const result: Result<string, string> = Err('string error');
        const mapped = mapError(result, (error) => new Error(error));

        expect(mapped.success).toBe(false);
        if (!mapped.success) {
          expect(mapped.error).toBeInstanceOf(Error);
          expect(mapped.error.message).toBe('string error');
        }
      });
    });
  });

  describe('DomainError', () => {
    it('should be an abstract class with required properties', () => {
      class TestDomainError extends DomainError {
        readonly code = 'TEST_ERROR';

        readonly domain = 'TEST_DOMAIN';
      }

      const error = new TestDomainError('Test message', { key: 'value' });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.domain).toBe('TEST_DOMAIN');
      expect(error.context).toEqual({ key: 'value' });
      expect(error.name).toBe('TestDomainError');
    });

    it('should work without context', () => {
      class SimpleDomainError extends DomainError {
        readonly code = 'SIMPLE_ERROR';

        readonly domain = 'SIMPLE_DOMAIN';
      }

      const error = new SimpleDomainError('Simple message');

      expect(error.message).toBe('Simple message');
      expect(error.context).toBeUndefined();
    });
  });

  describe('ValidationError', () => {
    it('should include validation-specific properties', () => {
      const error = new ValidationError('Invalid value', 'invalid-input', 'string', {
        source: 'test',
      });

      expect(error).toBeInstanceOf(DomainError);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.domain).toBe('TYPE_SYSTEM');
      expect(error.value).toBe('invalid-input');
      expect(error.expectedType).toBe('string');
      expect(error.context).toEqual({
        source: 'test',
        value: 'invalid-input',
        expectedType: 'string',
      });
    });

    it('should work without additional context', () => {
      const error = new ValidationError('Invalid number', 'abc', 'number');

      expect(error.message).toBe('Invalid number');
      expect(error.value).toBe('abc');
      expect(error.expectedType).toBe('number');
      expect(error.context).toEqual({
        value: 'abc',
        expectedType: 'number',
      });
    });
  });

  describe('ConversionError', () => {
    it('should include conversion-specific properties', () => {
      const error = new ConversionError('Cannot convert', 'string', 'number', {
        reason: 'invalid format',
      });

      expect(error).toBeInstanceOf(DomainError);
      expect(error.code).toBe('CONVERSION_ERROR');
      expect(error.domain).toBe('TYPE_SYSTEM');
      expect(error.fromType).toBe('string');
      expect(error.toType).toBe('number');
      expect(error.context).toEqual({
        reason: 'invalid format',
        fromType: 'string',
        toType: 'number',
      });
    });

    it('should work without additional context', () => {
      const error = new ConversionError('Type mismatch', 'boolean', 'string');

      expect(error.message).toBe('Type mismatch');
      expect(error.fromType).toBe('boolean');
      expect(error.toType).toBe('string');
      expect(error.context).toEqual({
        fromType: 'boolean',
        toType: 'string',
      });
    });
  });

  describe('Complex usage scenarios', () => {
    it('should chain multiple operations', () => {
      const parseNumber = (str: string): Result<number, string> => {
        const num = Number(str);
        return Number.isNaN(num) ? Err('Invalid number') : Ok(num);
      };

      const sqrt = (num: number): Result<number, string> =>
        num < 0 ? Err('Cannot take square root of negative') : Ok(Math.sqrt(num));

      const result = flatMap(parseNumber('16'), sqrt);
      expect(result).toEqual(Ok(4));

      const errorResult = flatMap(parseNumber('invalid'), sqrt);
      expect(errorResult).toEqual(Err('Invalid number'));

      const negativeResult = flatMap(parseNumber('-4'), sqrt);
      expect(negativeResult).toEqual(Err('Cannot take square root of negative'));
    });

    it('should transform errors through the pipeline', () => {
      const initialResult: Result<string, string> = Err('parsing failed');

      const transformed = mapError(
        map(initialResult, (x) => x.toUpperCase()),
        (error) => new ValidationError(error, 'input', 'valid-string')
      );

      expect(isErr(transformed)).toBe(true);
      if (isErr(transformed)) {
        expect(transformed.error).toBeInstanceOf(ValidationError);
        expect(transformed.error.message).toBe('parsing failed');
      }
    });
  });
});
