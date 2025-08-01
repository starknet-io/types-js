import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  TypeRegistry,
  TransformRegistry,
  typeRegistry,
  transformRegistry,
  registerValidator,
} from '../../../src/core/extensions';
import { Ok, Err, ValidationError } from '../../../src/core/result';
import type { TypeValidator, TypePlugin, TypeTransformer } from '../../../src/core/extensions';

describe('Core Extensions', () => {
  describe('TypeRegistry', () => {
    let registry: TypeRegistry;

    beforeEach(() => {
      registry = new TypeRegistry();
    });

    it('should register and retrieve validators', () => {
      const mockValidator: TypeValidator<string> = {
        name: 'test-validator',
        version: '1.0.0',
        validate: (value: unknown): value is string => typeof value === 'string',
        serialize: (value: string) => value,
        deserialize: (value: string) => Ok(value),
      };

      registry.register(mockValidator);

      const retrieved = registry.getValidator<string>('test-validator');
      expect(retrieved).toBe(mockValidator);
      expect(registry.listValidators()).toEqual(['test-validator']);
    });

    it('should throw error when registering duplicate validator', () => {
      const mockValidator: TypeValidator<string> = {
        name: 'duplicate',
        version: '1.0.0',
        validate: (value: unknown): value is string => typeof value === 'string',
        serialize: (value: string) => value,
        deserialize: (value: string) => Ok(value),
      };

      registry.register(mockValidator);
      expect(() => registry.register(mockValidator)).toThrow(
        'Validator duplicate is already registered'
      );
    });

    it('should register plugins with dependencies', () => {
      const dependency: TypePlugin<string> = {
        metadata: {
          name: 'dependency',
          version: '1.0.0',
          description: 'Test dependency',
        },
        validator: {
          name: 'dep-validator',
          version: '1.0.0',
          validate: (value: unknown): value is string => typeof value === 'string',
          serialize: (value: string) => value,
          deserialize: (value: string) => Ok(value),
        },
      };

      const plugin: TypePlugin<number> = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
          description: 'Test plugin',
          author: 'Test Author',
          dependencies: ['dependency'],
        },
        validator: {
          name: 'test-validator',
          version: '1.0.0',
          validate: (value: unknown): value is number => typeof value === 'number',
          serialize: (value: number) => value.toString(),
          deserialize: (value: string) => {
            const num = Number(value);
            return Number.isNaN(num)
              ? Err(new ValidationError('Invalid number', value, 'number'))
              : Ok(num);
          },
        },
      };

      registry.registerPlugin(dependency);
      registry.registerPlugin(plugin);

      expect(registry.listPlugins()).toEqual(['dependency', 'test-plugin']);
      expect(registry.getPluginMetadata('test-plugin')).toEqual(plugin.metadata);
    });

    it('should throw error when plugin dependency is missing', () => {
      const plugin: TypePlugin<number> = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
          description: 'Test plugin',
          dependencies: ['missing-dependency'],
        },
        validator: {
          name: 'test-validator',
          version: '1.0.0',
          validate: (value: unknown): value is number => typeof value === 'number',
          serialize: (value: number) => value.toString(),
          deserialize: (value: string) => Ok(Number(value)),
        },
      };

      expect(() => registry.registerPlugin(plugin)).toThrow(
        'Plugin test-plugin requires missing-dependency which is not registered'
      );
    });

    it('should throw error when registering duplicate plugin', () => {
      const plugin: TypePlugin<string> = {
        metadata: {
          name: 'duplicate-plugin',
          version: '1.0.0',
          description: 'Test plugin',
        },
        validator: {
          name: 'test-validator',
          version: '1.0.0',
          validate: (value: unknown): value is string => typeof value === 'string',
          serialize: (value: string) => value,
          deserialize: (value: string) => Ok(value),
        },
      };

      registry.registerPlugin(plugin);
      expect(() => registry.registerPlugin(plugin)).toThrow(
        'Plugin duplicate-plugin is already registered'
      );
    });

    it('should validate values using registered validators', () => {
      const validator: TypeValidator<string> = {
        name: 'string-validator',
        version: '1.0.0',
        validate: (value: unknown): value is string => typeof value === 'string',
        serialize: (value: string) => value,
        deserialize: (value: string) => Ok(value),
      };

      registry.register(validator);

      expect(registry.validate('string-validator', 'hello')).toBe(true);
      expect(registry.validate('string-validator', 123)).toBe(false);
    });

    it('should throw error when validator not found', () => {
      expect(() => registry.validate('nonexistent', 'value')).toThrow(
        'Validator nonexistent not found'
      );
    });

    it('should return undefined for nonexistent validator', () => {
      expect(registry.getValidator('nonexistent')).toBeUndefined();
    });

    it('should return undefined for nonexistent plugin metadata', () => {
      expect(registry.getPluginMetadata('nonexistent')).toBeUndefined();
    });
  });

  describe('TransformRegistry', () => {
    let registry: TransformRegistry;

    beforeEach(() => {
      registry = new TransformRegistry();
    });

    it('should register and use transformers', () => {
      const transformer: TypeTransformer<string, number> = {
        from: 'string',
        to: 'number',
        transform: (value: string) => {
          const num = Number(value);
          return Number.isNaN(num)
            ? Err(new ValidationError('Invalid number', value, 'number'))
            : Ok(num);
        },
      };

      registry.register(transformer);

      const result = registry.transform('string', 'number', '42');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('should handle transform errors', () => {
      const transformer: TypeTransformer<string, number> = {
        from: 'string',
        to: 'number',
        transform: (value: string) => Err(new ValidationError('Always fails', value, 'number')),
      };

      registry.register(transformer);

      const result = registry.transform('string', 'number', 'invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should return error when transformer not found', () => {
      const result = registry.transform('unknown', 'type', 'value');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toBe('No transformer found for unknown -> type');
      }
    });
  });

  describe('registerValidator decorator', () => {
    it('should register validator with default version', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @registerValidator<string>('decorated-validator')
      class TestValidator implements TypeValidator<string> {
        name = 'decorated-validator';

        version = '1.0.0';

        validate(value: unknown): value is string {
          return typeof value === 'string';
        }

        serialize(value: string): string {
          return value;
        }

        deserialize(value: string) {
          return Ok(value);
        }
      }

      // Use the class to avoid unused variable warning
      expect(TestValidator).toBeDefined();
      const validator = typeRegistry.getValidator('decorated-validator');
      expect(validator).toBeDefined();
      expect(validator?.name).toBe('decorated-validator');
      expect(validator?.version).toBe('1.0.0');
    });

    it('should register validator with custom version', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @registerValidator<number>('custom-version-validator', '2.1.0')
      class CustomVersionValidator implements TypeValidator<number> {
        name = 'custom-version-validator';

        version = '2.1.0';

        validate(value: unknown): value is number {
          return typeof value === 'number';
        }

        serialize(value: number): string {
          return value.toString();
        }

        deserialize(value: string) {
          const num = Number(value);
          return Number.isNaN(num)
            ? Err(new ValidationError('Invalid number', value, 'number'))
            : Ok(num);
        }
      }

      // Use the class to avoid unused variable warning
      expect(CustomVersionValidator).toBeDefined();
      const validator = typeRegistry.getValidator('custom-version-validator');
      expect(validator).toBeDefined();
      expect(validator?.version).toBe('2.1.0');
    });

    it('should set name and version if not present', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @registerValidator<boolean>('missing-props-validator', '3.0.0')
      class MissingPropsValidator implements TypeValidator<boolean> {
        name!: string;

        version!: string;

        validate(value: unknown): value is boolean {
          return typeof value === 'boolean';
        }

        serialize(value: boolean): string {
          return value.toString();
        }

        deserialize(value: string) {
          return Ok(value === 'true');
        }
      }

      // Use the class to avoid unused variable warning
      expect(MissingPropsValidator).toBeDefined();
      const validator = typeRegistry.getValidator('missing-props-validator');
      expect(validator).toBeDefined();
      expect(validator?.name).toBe('missing-props-validator');
      expect(validator?.version).toBe('3.0.0');
    });
  });

  describe('Global registries', () => {
    it('should export global type registry', () => {
      expect(typeRegistry).toBeInstanceOf(TypeRegistry);
    });

    it('should export global transform registry', () => {
      expect(transformRegistry).toBeInstanceOf(TransformRegistry);
    });
  });
});
